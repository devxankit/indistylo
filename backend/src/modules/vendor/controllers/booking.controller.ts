import type { Response, NextFunction } from "express";
import Salon from "../../../models/salon.model.js";
import Spa from "../../../models/spa.model.js";
import Booking from "../../../models/booking.model.js";
import Customer from "../../../models/customer.model.js";
import Vendor from "../../../models/vendor.model.js";
import Admin from "../../../models/admin.model.js";
import { notifyBookingStatusUpdate } from "../../../utils/notificationHelper.js";

// @desc    Get vendor bookings
// @route   GET /api/vendor/bookings
// @access  Private/Vendor
export const getVendorBookings = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user._id }).lean();
        const isSpa = vendor?.type === "spa";
        const Model = isSpa ? Spa : Salon;

        const business = await Model.findOne({ vendor: req.user._id });
        if (!business) {
            return res.status(200).json([]);
        }
        const bookings = await Booking.find({ salon: business._id })
            .populate("user", "phone email")
            .populate("service", "name price duration")
            .populate("package", "name price duration")
            .populate("professional", "name")
            .sort("-date")
            .lean();

        // Populate customer name referencing Customer model manually 
        const populatedBookings = await Promise.all(bookings.map(async (booking: any) => {
            const customer = await Customer.findOne({ user: booking.user?._id }).select("name");
            return {
                ...booking,
                user: {
                    ...booking.user,
                    name: customer?.name || "Guest"
                }
            };
        }));

        res.status(200).json(populatedBookings);
    } catch (error) {
        next(error);
    }
};

// @desc    Update booking status
// @route   PATCH /api/vendor/bookings/:id
// @access  Private/Vendor
export const updateBookingStatus = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id).populate("salon");

        if (!booking) {
            res.status(404);
            return next(new Error("Booking not found"));
        }

        // Verify ownership
        const salon = booking.salon as any;
        if (salon.vendor.toString() !== req.user._id.toString()) {
            res.status(401);
            return next(new Error("Not authorized"));
        }

        // if (status === "completed" && booking.status !== "completed") {
        //     // Wallet update logic moved to Order Payment (verifyPayment)
        // }

        booking.status = status;
        await booking.save();

        // Notify user
        try {
            await notifyBookingStatusUpdate(
                booking.user.toString(),
                booking._id.toString(),
                status.toUpperCase(),
                salon.name
            );
        } catch (err) {
            console.error("Failed to notify user of booking update:", err);
        }

        res.status(200).json(booking);
    } catch (error) {
        next(error);
    }
};
