import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { User, Vendor, Salon } from "../../../models/index.js";

/**
 * Middleware to protect vendor routes
 * Verifies JWT token, checks VENDOR role, validates token version, and checks account status
 */
export const vendorProtect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!token) {
                res.status(401);
                return next(new Error("Not authorized, token failed"));
            }

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error("JWT_SECRET not configured");
                res.status(500);
                return next(new Error("Server configuration error"));
            }

            const decoded: any = jwt.verify(token, secret);

            const user = await User.findById(decoded.id).select("-password").lean();

            if (!user) {
                res.status(401);
                return next(new Error("User not found"));
            }

            // Check account status
            if (user.status === "suspended") {
                res.status(403);
                return next(new Error("Account suspended. Please contact support."));
            }

            // Validate token version
            if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
                res.status(401);
                return next(new Error("Session expired. Please login again."));
            }

            // Check role
            if (user.role !== "VENDOR") {
                res.status(403);
                return next(new Error("Access denied. Vendor role required."));
            }

            // Fetch vendor profile
            const vendorProfile = await Vendor.findOne({ user: user._id }).lean();

            // Note: We don't block here if profile is missing, as the user might be 
            // hitting the endpoint to create their profile.
            // Individual controllers should handle missing profiles if needed.

            (req as any).user = { ...user, vendorProfile };
            next();
        } catch (error: any) {
            console.error("Vendor auth error:", error.message);
            if (error.name === "TokenExpiredError") {
                res.status(401);
                return next(new Error("Token expired. Please refresh."));
            }
            res.status(401);
            next(new Error("Not authorized, token failed"));
        }
        return;
    }

    if (!token) {
        res.status(401);
        next(new Error("Not authorized, no token"));
    }
};

/**
 * Middleware to verify vendor owns a salon
 */
export const hasSalon = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = (req as any).user;
    if (!user) {
        res.status(401);
        return next(new Error("Not authenticated"));
    }

    const salon = await Salon.findOne({ vendor: user._id });

    if (!salon) {
        res.status(400);
        return next(new Error("Please create a salon profile first"));
    }

    (req as any).salon = salon;
    next();
};

/**
 * Middleware to check if vendor is verified
 */
export const isVerifiedVendor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = (req as any).user;
    if (!user) {
        res.status(401);
        return next(new Error("Not authenticated"));
    }

    // Check vendor profile status
    const vendorProfile = user.vendorProfile;

    if (!vendorProfile) {
        res.status(403);
        return next(new Error("Vendor profile not found"));
    }

    if (vendorProfile.status !== 'active') {
        res.status(403);
        return next(new Error("Account pending approval from admin"));
    }

    next();
};
