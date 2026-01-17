import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { User, Admin } from "../../../models/index.js";

/**
 * Middleware to protect admin routes
 * Verifies JWT token, checks ADMIN role, validates token version, and checks account status
 */
export const adminProtect = async (
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

            // Check role
            if (user.role !== "ADMIN") {
                res.status(403);
                return next(new Error("Access denied. Admin role required."));
            }

            // Fetch admin profile
            const adminProfile = await Admin.findOne({ user: user._id }).lean();
            if (!adminProfile) {
                res.status(403);
                return next(new Error("Admin profile not found"));
            }

            (req as any).user = { ...user, adminProfile };
            next();
        } catch (error: any) {
            console.error("Admin auth error:", error.message);
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
 * Middleware to check for super admin privileges
 */
export const isSuperAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = (req as any).user;
    if (!user) {
        res.status(401);
        return next(new Error("Not authenticated"));
    }

    if (user.email === "admin@indistylo.com" || user.adminProfile?.isSuperAdmin) {
        next();
    } else {
        res.status(403);
        next(new Error("Super admin access required"));
    }
};
