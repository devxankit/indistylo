import Booking from "../../../models/booking.model.js";
import Schedule from "../../../models/schedule.model.js";
import Staff from "../../../models/staff.model.js";
import { timeToMinutes, isOverlapping } from "../../../utils/timeUtils.js";

export const checkAvailability = async (
    salonId: string,
    date: Date,
    time: string,
    duration: number,
    preferredStaffId?: string,
    session?: any
) => {
    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getDay();

    console.log(`Checking Availability: Salon=${salonId}, Date=${date}, Day=${dayOfWeek}`);

    // 1. Get schedule for the day
    const schedule = await Schedule.findOne({
        salon: salonId,
        dayOfWeek,
    }).session(session);

    console.log(`Schedule found:`, schedule ? `Yes (Working: ${schedule.isWorking})` : 'No');

    if (!schedule || !schedule.isWorking) {
        return { available: false, message: "Salon is closed on this day" };
    }

    const requestedStart = timeToMinutes(time);
    const requestedEnd = requestedStart + duration;
    const scheduleStart = timeToMinutes(schedule.startTime);
    const scheduleEnd = timeToMinutes(schedule.endTime);

    // 2. Check if within working hours
    if (requestedStart < scheduleStart || requestedEnd > scheduleEnd) {
        return {
            available: false,
            message: `Requested time is outside working hours (${schedule.startTime} - ${schedule.endTime})`,
        };
    }

    // 3. Check for breaks
    for (const brk of schedule.breaks) {
        const breakStart = timeToMinutes(brk.startTime);
        const breakEnd = timeToMinutes(brk.endTime);

        if (isOverlapping(requestedStart, requestedEnd, breakStart, breakEnd)) {
            return {
                available: false,
                message: `Requested time overlaps with a break (${brk.startTime} - ${brk.endTime})`,
            };
        }
    }

    // 4. Get all active staff for the salon
    const query: any = { salon: salonId, isActive: true };
    if (preferredStaffId) {
        query._id = preferredStaffId;
    }
    const staffMembers = await Staff.find(query).session(session);

    if (staffMembers.length === 0) {
        return {
            available: false,
            message: preferredStaffId
                ? "Requested staff member is not available"
                : "No staff members available for this salon",
        };
    }

    // 5. Check each staff member's availability
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
        salon: salonId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: "cancelled" },
    })
        .populate("service", "duration")
        .populate({
            path: "package",
            populate: { path: "services", select: "duration" }
        })
        .session(session);

    const availableStaff = [];

    for (const staff of staffMembers) {
        const staffBookings = existingBookings.filter(
            (b) =>
                b.professional && b.professional.toString() === staff._id.toString()
        );

        let isStaffAvailable = true;
        for (const booking of staffBookings) {
            const bStart = timeToMinutes(booking.time);

            // DURATON CALCULATION logic
            let bDuration = (booking as any).duration;

            if (!bDuration) {
                if (booking.service) {
                    bDuration = (booking.service as any).duration;
                } else if (booking.package) {
                    const pkg = booking.package as any;
                    if (pkg.services && pkg.services.length > 0) {
                        bDuration = pkg.services.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
                    }
                }
            }

            bDuration = bDuration || 30; // Safety fallback

            const bEnd = bStart + bDuration;

            if (isOverlapping(requestedStart, requestedEnd, bStart, bEnd)) {
                isStaffAvailable = false;
                break;
            }
        }

        if (isStaffAvailable) {
            availableStaff.push(staff);
        }
    }

    if (availableStaff.length === 0) {
        return {
            available: false,
            message: "No staff members are available at this time",
        };
    }

    return {
        available: true,
        staffId: availableStaff[0]!._id, // Return the first available staff
    };
};
