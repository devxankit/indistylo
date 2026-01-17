import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import {
  User,
  Admin,
  Customer,
  Vendor,
  RefreshToken,
} from "../../../models/index.js";
import type { IUser } from "../../../models/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/generateToken.js";
import {
  requestOTP,
  verifyOTP,
  setRefreshTokenCookie,
} from "./otp.controller.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 30 * 60 * 1000; // 30 minutes

// @desc    Register a new user / Login with phone (Legacy - should use OTP flow)
// @route   POST /api/auth/phone-login
// @access  Public
export const phoneLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Deprecated - redirect to OTP flow
  res.status(400).json({
    success: false,
    message: "Direct phone login is deprecated. Please use OTP authentication.",
    redirect: "/api/auth/send-otp",
  });
};

// @desc    Admin/Vendor Login with Email/Password
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return next(new Error("Please provide email and password"));
    }

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();

    const user = (await User.findOne({ email: sanitizedEmail }).select(
      "+password"
    )) as IUser;

    if (!user) {
      res.status(401);
      return next(new Error("Invalid email or password"));
    }

    // Fetch profile based on role
    let profile: any = null;
    if (user.role === "ADMIN") {
      profile = await Admin.findOne({ user: user._id });
    } else if (user.role === "VENDOR") {
      profile = await Vendor.findOne({ user: user._id });
    } else if (user.role === "CUSTOMER") {
      profile = await Customer.findOne({ user: user._id });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMins = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / 60000
      );
      res.status(423);
      return next(
        new Error(`Account is locked. Try again in ${remainingMins} minutes.`)
      );
    }

    // Check if account is suspended
    const status = profile?.status || "active";
    if (status === "suspended") {
      res.status(403);
      return next(
        new Error("Your account has been suspended. Please contact support.")
      );
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      // Increment failed attempts
      await user.incrementFailedAttempts();

      const remaining = MAX_LOGIN_ATTEMPTS - (user.failedLoginAttempts + 1);
      if (remaining > 0) {
        res.status(401);
        return next(
          new Error(`Invalid password. ${remaining} attempts remaining.`)
        );
      } else {
        res.status(423);
        return next(
          new Error(
            "Account locked due to too many failed attempts. Try again in 30 minutes."
          )
        );
      }
    }

    // Successful login - reset failed attempts
    await user.resetFailedAttempts();

    // Generate tokens with role and version
    const accessToken = generateAccessToken(
      user._id.toString(),
      user.role,
      user.tokenVersion
    );
    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.tokenVersion
    );

    // Store refresh token hash in database
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      deviceInfo: req.headers["user-agent"] || "unknown",
      ipAddress: req.ip || "",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      user: {
        _id: user._id,
        name: profile?.name || profile?.businessName || "User",
        phone: user.phone,
        role: user.role,
        email: user.email || profile?.email || "",
        status: status,
        isVerified: profile?.isVerified || false,
        profile: profile,
      },
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Token with rotation
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401);
      return next(new Error("No refresh token provided"));
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      res.status(401);
      return next(new Error("Invalid refresh token"));
    }

    // Check token hash in database
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const storedToken = await RefreshToken.findOne({
      userId: decoded.id,
      tokenHash,
      isRevoked: false,
    });

    if (!storedToken) {
      // Token not found or revoked - possible token theft, revoke all
      await (RefreshToken as any).revokeAllForUser(decoded.id);
      res.clearCookie("refreshToken");
      res.status(401);
      return next(
        new Error("Invalid refresh token. All sessions have been logged out.")
      );
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      return next(new Error("User not found"));
    }

    // Check token version (for logout all devices)
    if (
      decoded.tokenVersion !== undefined &&
      decoded.tokenVersion !== user.tokenVersion
    ) {
      res.status(401);
      return next(new Error("Session expired. Please login again."));
    }

    // Revoke old refresh token
    storedToken.isRevoked = true;
    await storedToken.save();

    // Generate new tokens (rotation)
    const newAccessToken = generateAccessToken(
      user._id.toString(),
      user.role,
      user.tokenVersion
    );
    const newRefreshToken = generateRefreshToken(
      user._id.toString(),
      user.tokenVersion
    );

    // Store new refresh token
    const newTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await RefreshToken.create({
      userId: user._id,
      tokenHash: newTokenHash,
      deviceInfo: req.headers["user-agent"] || "unknown",
      ipAddress: req.ip || "",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (revoke refresh token)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Revoke the refresh token
      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      await RefreshToken.updateOne({ tokenHash }, { isRevoked: true });
    }

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
export const logoutAll = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    // Increment token version to invalidate all existing tokens
    await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });

    // Revoke all refresh tokens
    await (RefreshToken as any).revokeAllForUser(req.user._id);

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out from all devices" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id).select("-password").lean();

    if (!user) {
      res.status(404);
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

    res.status(200).json({
      ...user,
      profile,
      // For backward compatibility
      name:
        profile?.name ||
        profile?.ownerName ||
        (profile as any)?.businessName ||
        "User",
      email: profile?.email || user.email,
    });
  } catch (error) {
    next(error);
  }
};
