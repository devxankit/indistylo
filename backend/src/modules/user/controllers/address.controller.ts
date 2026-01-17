import type { Response, NextFunction } from "express";
import Address from "../../../models/address.model.js";

// @desc    Add new address
// @route   POST /api/user/addresses
// @access  Private
export const addAddress = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            label,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            isDefault,
            geo, // Extract geo
        } = req.body;

        // If this is default, unset other defaults
        if (isDefault) {
            await Address.updateMany({ user: req.user._id }, { isDefault: false });
        }

        const address = await Address.create({
            user: req.user._id,
            label,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            isDefault: isDefault || false,
            geo, // Save geo
        });

        res.status(201).json(address);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user addresses
// @route   GET /api/user/addresses
// @access  Private
export const getAddresses = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const addresses = await Address.find({ user: req.user._id });
        res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete address
// @route   DELETE /api/user/addresses/:id
// @access  Private
export const deleteAddress = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            res.status(404);
            return next(new Error("Address not found"));
        }

        if (address.user.toString() !== req.user._id.toString()) {
            res.status(401);
            return next(new Error("Not authorized"));
        }

        await address.deleteOne();
        res.status(200).json({ message: "Address removed" });
    } catch (error) {
        next(error);
    }
};

// @desc    Update address
// @route   PUT /api/user/addresses/:id
// @access  Private
export const updateAddress = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            res.status(404);
            return next(new Error("Address not found"));
        }

        if (address.user.toString() !== req.user._id.toString()) {
            res.status(401);
            return next(new Error("Not authorized"));
        }

        if (req.body.isDefault) {
            await Address.updateMany({ user: req.user._id }, { isDefault: false });
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedAddress);
    } catch (error) {
        next(error);
    }
};

// @desc    Set default address
// @route   PATCH /api/user/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            res.status(404);
            return next(new Error("Address not found"));
        }

        if (address.user.toString() !== req.user._id.toString()) {
            res.status(401);
            return next(new Error("Not authorized"));
        }

        await Address.updateMany({ user: req.user._id }, { isDefault: false });
        address.isDefault = true;
        await address.save();

        res.status(200).json(address);
    } catch (error) {
        next(error);
    }
};
