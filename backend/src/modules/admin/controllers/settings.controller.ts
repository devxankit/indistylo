import type { Request, Response, NextFunction } from "express";
import Content from "../../../models/content.model.js";

// @desc    Get global app settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getAppSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let settings = await Content.findOne({ type: "settings" });
        if (!settings) {
            settings = await Content.create({
                type: "settings",
                data: {
                    appName: "IndiStylo",
                    supportEmail: "support@indistylo.com",
                    commissionRate: 15,
                },
            });
        }
        res.status(200).json(settings.data);
    } catch (error) {
        next(error);
    }
};

// @desc    Update global app settings
// @route   POST /api/admin/settings
// @access  Private/Admin
export const updateAppSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const settings = await Content.findOneAndUpdate(
            { type: "settings" },
            { data: req.body },
            { new: true, upsert: true }
        );
        res.status(200).json(settings.data);
    } catch (error) {
        next(error);
    }
};

// @desc    Get/Update commission rate (Stored in Content model)
// @route   GET /api/admin/commission
// @access  Private/Admin
export const getCommissionRate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const settings = await Content.findOne({ type: "settings" });
        const rate = settings?.data?.commissionRate || 15;
        res.status(200).json({ commissionRate: rate });
    } catch (error) {
        next(error);
    }
};

export const updateCommissionRate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { commissionRate } = req.body;
        await Content.findOneAndUpdate(
            { type: "settings" },
            { $set: { "data.commissionRate": commissionRate } },
            { upsert: true }
        );
        res.status(200).json({ commissionRate });
    } catch (error) {
        next(error);
    }
};
