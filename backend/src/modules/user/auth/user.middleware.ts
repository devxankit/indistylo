import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { User, Customer } from "../../../models/index.js";

/**
 * Middleware to protect user/customer routes
 * Verifies JWT token, validates token version, and checks account status
 */
export const userProtect = async (
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

            // Validate token version (for logout-all functionality)
            if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
                res.status(401);
                return next(new Error("Session expired. Please login again."));
            }

            // Fetch customer profile
            const customerProfile = await Customer.findOne({ user: user._id }).lean();
            if (!customerProfile && user.role === "CUSTOMER") {
                // Auto-create profile if missing for CUSTOMER
                const newProfile = await Customer.create({
                    user: user._id,
                    name: "User",
                });
                (req as any).user = { ...user, customerProfile: newProfile.toObject() };
            } else {
                (req as any).user = { ...user, customerProfile };
            }
            
            next();
        } catch (error: any) {
            console.error("User auth error:", error.message);
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
 * Middleware to check if user is a customer
 */
export const isCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = (req as any).user;
    if (!user) {
        res.status(401);
        return next(new Error("Not authenticated"));
    }

    if (user.role !== "CUSTOMER") {
        res.status(403);
        return next(new Error("Customer role required"));
    }

    next();
};

/**
 * Middleware to check if user has verified phone
 */
export const hasVerifiedPhone = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = (req as any).user;
    if (!user) {
        res.status(401);
        return next(new Error("Not authenticated"));
    }

    if (!user.phone) {
        res.status(400);
        return next(new Error("Phone number required"));
    }

    next();
};
