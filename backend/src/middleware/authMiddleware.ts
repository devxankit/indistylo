import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { User, Admin, Customer, Vendor } from "../models/index.js";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
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
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      );

      const user = await User.findById(decoded.id).select("-password").lean();
      if (!user) {
        res.status(401);
        return next(new Error("User not found"));
      }

      let profile = null;
      if (user.role === "ADMIN") {
        profile = await Admin.findOne({ user: user._id }).lean();
      } else if (user.role === "CUSTOMER") {
        profile = await Customer.findOne({ user: user._id }).lean();
      } else if (user.role === "VENDOR") {
        profile = await Vendor.findOne({ user: user._id }).lean();
      }

      req.user = { ...user, profile };
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error("Not authorized, no token"));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(
          `User role ${req.user?.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};
