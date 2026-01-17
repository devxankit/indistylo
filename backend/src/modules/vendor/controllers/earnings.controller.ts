import type { Response, NextFunction } from "express";
import Salon from "../../../models/salon.model.js";
import Spa from "../../../models/spa.model.js";
import Booking from "../../../models/booking.model.js";
import Payout from "../../../models/payout.model.js";
import Vendor from "../../../models/vendor.model.js";
import { notifyPayoutRequest } from "../../../utils/notificationHelper.js";

// @desc    Get vendor earnings and wallet info
// @route   GET /api/vendor/earnings
// @access  Private/Vendor
export const getVendorEarnings = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const vendorProfile = await Vendor.findOne({ user: req.user._id });
        const commissionRate = vendorProfile?.commissionRate || 10;

        // Check for both Salon and Spa
        let salon = await Salon.findOne({ vendor: req.user._id });
        let business = salon;

        if (!salon) {
            const spa = await Spa.findOne({ vendor: req.user._id });
            business = spa;
        }

        if (!business) {
            return res.status(200).json({
                totalEarnings: 0,
                availableBalance: 0,
                pendingPayout: 0,
                commissionPaid: 0,
                commissionRate,
            });
        }

        const bookings = await Booking.find({
            salon: business._id,
            paymentStatus: "paid",
        });

        const totalEarnings = bookings.reduce(
            (acc, b) => acc + (b.vendorEarnings || 0),
            0
        );
        const commissionPaid = bookings.reduce(
            (acc, b) => acc + (b.commissionAmount || 0),
            0
        );

        const payouts = await Payout.find({
            $or: [
                { salon: business._id },
                { vendor: req.user._id }
            ]
        }).lean();
        const processedPayouts = payouts
            .filter((p: any) => p.status?.toLowerCase() === "processed")
            .reduce((acc, p) => acc + (p.amount || 0), 0);
        const pendingPayout = payouts
            .filter((p: any) => p.status?.toLowerCase() === "pending")
            .reduce((acc, p) => acc + (p.amount || 0), 0);

        const availableBalance = totalEarnings - processedPayouts - pendingPayout;

        res.status(200).json({
            totalEarnings,
            availableBalance,
            totalWithdrawn: processedPayouts,
            totalPending: pendingPayout,
            commissionPaid,
            commissionRate,
            payouts,
            _debug: {
                totalEarningsRaw: totalEarnings,
                processedPayoutsRaw: processedPayouts,
                pendingPayoutRaw: pendingPayout,
                payoutsCount: payouts.length,
                allPayouts: payouts.map((p: any) => ({ amount: p.amount, status: p.status }))
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Request a payout
// @route   POST /api/vendor/payouts
// @access  Private/Vendor
export const requestPayout = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount } = req.body;

        // Check for both Salon and Spa
        let salon = await Salon.findOne({ vendor: req.user._id });
        let business = salon;

        if (!salon) {
            const spa = await Spa.findOne({ vendor: req.user._id });
            business = spa;
        }

        if (!business) {
            res.status(400);
            return next(new Error("Please create a salon or spa profile first"));
        }

        // Calculate available balance
        const bookings = await Booking.find({
            salon: business._id,
            paymentStatus: "paid",
        });
        const totalEarnings = bookings.reduce(
            (acc, b) => acc + (b.vendorEarnings || 0),
            0
        );

        const payouts = await Payout.find({ salon: business._id });
        const processedPayouts = payouts
            .filter((p) => p.status === "processed")
            .reduce((acc, p) => acc + p.amount, 0);
        const pendingPayout = payouts
            .filter((p) => p.status === "pending")
            .reduce((acc, p) => acc + p.amount, 0);

        const availableBalance = totalEarnings - processedPayouts - pendingPayout;

        if (amount > availableBalance) {
            res.status(400);
            return next(new Error("Requested amount exceeds available balance"));
        }

        const payout = await Payout.create({
            vendor: req.user._id,
            salon: business._id,
            amount,
        });

        // Notify admin about payout request
        try {
            const vendorName = (business as any).name || "Vendor";
            notifyPayoutRequest(vendorName, amount, payout._id.toString());
        } catch (err) {
            console.error("Error sending payout notification:", err);
        }

        res.status(201).json(payout);
    } catch (error) {
        next(error);
    }
};
