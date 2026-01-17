import type { Request, Response, NextFunction } from "express";
import Booking from "../../../models/booking.model.js";
import Customer from "../../../models/customer.model.js";

// @desc    Get all bookings with filters
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { status, startDate, endDate, user } = req.query;
        const query: any = {};

        if (user) query.user = user;
        if (status) query.status = status;
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string),
            };
        }

        const bookings = await Booking.find(query)
            .populate("user", "phone role")
            .populate("salon", "name location")
            .populate("service", "name price")
            .sort("-createdAt")
            .lean();

        // Fetch customer profiles for each booking
        const bookingsWithCustomerNames = await Promise.all(
            bookings.map(async (booking: any) => {
                if (booking.user?.role === "CUSTOMER") {
                    const customer = await Customer.findOne({ user: booking.user._id }).select("name").lean();
                    return {
                        ...booking,
                        user: {
                            ...booking.user,
                            name: customer?.name || "Unknown Customer"
                        }
                    };
                }
                return booking;
            })
        );

        res.status(200).json(bookingsWithCustomerNames);
    } catch (error) {
        next(error);
    }
};
