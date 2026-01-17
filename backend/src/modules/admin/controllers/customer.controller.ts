import type { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model.js";
import Customer from "../../../models/customer.model.js";
import Address from "../../../models/address.model.js";

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getAllCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.find({ role: "CUSTOMER" }).lean();

        const customersWithProfiles = await Promise.all(
            users.map(async (user) => {
                const profile = await Customer.findOne({ user: user._id }).lean();
                // Fetch the default address (or first one found) for the user
                const address = await Address.findOne({ user: user._id, isDefault: true }).lean()
                    || await Address.findOne({ user: user._id }).lean();

                return { ...user, profile, savedAddress: address };
            })
        );

        res.status(200).json(customersWithProfiles);
    } catch (error) {
        next(error);
    }
};

// @desc    Create new customer manually
// @route   POST /api/admin/customers
// @access  Private/Admin
export const createCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { phone, name, email } = req.body;

        // Check if user already exists
        let user = await User.findOne({ phone });
        if (user) {
            res.status(400);
            return next(new Error("User with this phone already exists"));
        }

        // Create user
        user = await User.create({
            phone,
            email,
            role: "CUSTOMER",
        });

        // Create customer profile
        const profile = await Customer.create({
            user: user._id,
            name: name || "Customer",
            email: email || "",
        });

        res.status(201).json({ ...user.toObject(), profile });
    } catch (error) {
        next(error);
    }
};
