import type { Response, NextFunction } from "express";
import Salon from "../../../models/salon.model.js";
import Spa from "../../../models/spa.model.js";
import Staff from "../../../models/staff.model.js";
import Vendor from "../../../models/vendor.model.js";

// @desc    Get vendor's staff members
// @route   GET /api/vendor/staff
// @access  Private/Vendor
export const getMyStaff = async (
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
        const staff = await Staff.find({ salon: business._id });
        res.status(200).json(staff);
    } catch (error) {
        next(error);
    }
};

// @desc    Add new staff member
// @route   POST /api/vendor/staff
// @access  Private/Vendor
export const addStaff = async (req: any, res: Response, next: NextFunction) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user._id }).lean();
        const isSpa = vendor?.type === "spa";
        const Model = isSpa ? Spa : Salon;

        const business = await Model.findOne({ vendor: req.user._id });
        if (!business) {
            res.status(400);
            return next(new Error(`Please create a ${isSpa ? 'spa' : 'salon'} profile first`));
        }

        const staff = await Staff.create({
            salon: business._id,
            onModel: isSpa ? "Spa" : "Salon",
            ...req.body,
        });
        res.status(201).json(staff);
    } catch (error) {
        next(error);
    }
};

// @desc    Update staff member
// @route   PUT /api/vendor/staff/:id
// @access  Private/Vendor
export const updateStaff = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const staff = await Staff.findById(req.params.id).populate("salon");
        if (!staff) {
            res.status(404);
            return next(new Error("Staff not found"));
        }

        // Verify ownership
        const salon = staff.salon as any;
        if (salon.vendor.toString() !== req.user._id.toString()) {
            res.status(401);
            return next(new Error("Not authorized"));
        }

        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedStaff);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete staff member
// @route   DELETE /api/vendor/staff/:id
// @access  Private/Vendor
export const deleteStaff = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const staff = await Staff.findById(req.params.id).populate("salon");
        if (!staff) {
            res.status(404);
            return next(new Error("Staff not found"));
        }

        // Verify ownership
        const salon = staff.salon as any;
        if (salon.vendor.toString() !== req.user._id.toString()) {
            res.status(401);
            return next(new Error("Not authorized"));
        }

        await staff.deleteOne();
        res.status(200).json({ message: "Staff member deleted" });
    } catch (error) {
        next(error);
    }
};
