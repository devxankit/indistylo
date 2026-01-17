import type { Request, Response, NextFunction } from "express";
import Payout from "../../../models/payout.model.js";
import Salon from "../../../models/salon.model.js";
import Spa from "../../../models/spa.model.js";
import Vendor from "../../../models/vendor.model.js";

// @desc    Get all payout requests
// @route   GET /api/admin/payouts
// @access  Private/Admin
export const getAllPayouts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const payouts = await Payout.find()
            .populate("vendor", "phone email")
            .sort("-createdAt")
            .lean();

        // Fetch salon/spa names and vendor profile names
        const payoutsWithNames = await Promise.all(
            payouts.map(async (payout: any) => {
                let businessName = "N/A";

                // Check both Salon and Spa collections
                if (payout.salon) {
                    // Try Salon first
                    const salon = await Salon.findById(payout.salon).select("name").lean();
                    if (salon?.name) {
                        businessName = salon.name;
                    } else {
                        // Try Spa
                        const spa = await Spa.findById(payout.salon).select("name").lean();
                        if (spa?.name) {
                            businessName = spa.name;
                        }
                    }
                }

                // Get vendor profile name and contact
                let vendorName = "N/A";
                let vendorEmail = payout.vendor?.email || "N/A";
                let vendorPhone = payout.vendor?.phone || "N/A";

                if (payout.vendor) {
                    const vendorProfile = await Vendor.findOne({
                        user: payout.vendor._id || payout.vendor
                    }).select("businessName ownerName").lean();

                    vendorName = vendorProfile?.businessName || vendorProfile?.ownerName || "N/A";
                }

                return {
                    ...payout,
                    salonName: businessName,
                    vendorName: vendorName,
                    vendorEmail: vendorEmail,
                    vendorPhone: vendorPhone
                };
            })
        );

        res.status(200).json(payoutsWithNames);
    } catch (error) {
        next(error);
    }
};

// @desc    Update payout status
// @route   PATCH /api/admin/payouts/:id
// @access  Private/Admin
export const updatePayoutStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { status, transactionId, adminNotes } = req.body;
        const payout = await Payout.findById(req.params.id);

        if (!payout) {
            res.status(404);
            return next(new Error("Payout not found"));
        }

        payout.status = status;
        if (transactionId) payout.transactionId = transactionId;
        if (adminNotes) payout.adminNotes = adminNotes;
        if (status === "processed") payout.processedAt = new Date();

        await payout.save();

        res.status(200).json(payout);
    } catch (error) {
        next(error);
    }
};
