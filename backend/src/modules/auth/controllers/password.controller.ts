import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import User from "../../../models/user.model.js";

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            return next(new Error("User not found with that email"));
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash token and set to field
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set expire (10 mins)
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        // In production, send email here
        console.log(`Password reset token for ${email}: ${resetToken}`);

        res.status(200).json({ success: true, message: "Email sent" });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.resettoken as string)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400);
            return next(new Error("Invalid or expired token"));
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save();

        res.status(200).json({ success: true, message: "Password updated" });
    } catch (error) {
        next(error);
    }
};
