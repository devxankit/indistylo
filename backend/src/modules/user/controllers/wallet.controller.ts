import type { Response, NextFunction } from "express";
import { User, Customer } from "../../../models/index.js";
import Transaction from "../../../models/transaction.model.js";

// @desc    Get wallet balance
// @route   GET /api/user/wallet/balance
// @access  Private
export const getWalletBalance = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const customer = await Customer.findOne({ user: req.user._id });
        if (!customer) {
            res.status(404);
            return next(new Error("Customer profile not found"));
        }
        res.status(200).json({ balance: customer.walletBalance || 0 });
    } catch (error) {
        next(error);
    }
};

// @desc    Get wallet transactions
// @route   GET /api/user/wallet/transactions
// @access  Private
export const getWalletTransactions = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .sort("-createdAt")
            .limit(50);
        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
};
