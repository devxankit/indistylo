import type { Request, Response, NextFunction } from "express";
import { User, Customer, Vendor, Admin, Salon } from "../../../models/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/generateToken.js";
import {
  generateOTP,
  sendOTP,
  saveOTP,
  verifyOTPRecord,
  isPhoneBlocked,
  debugLog,
} from "../services/auth.service.js";
import { notifyNewVendorRegistration } from "../../../utils/notificationHelper.js";

// Helper to set refresh token cookie
export const setRefreshTokenCookie = (res: Response, token: string) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};

// @desc    Send OTP to phone
// @route   POST /api/auth/send-otp
// @access  Public
export const requestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { phone } = req.body;
    debugLog(`[REQUEST_OTP] Received: phone=${phone}`);

    if (!phone) {
      res.status(400);
      return next(new Error("Please provide a phone number"));
    }

    // Normalize phone: remove non-digits and handle +91
    const originalPhone = phone;
    phone = String(phone).replace(/\D/g, "");
    if (phone.length === 12 && phone.startsWith("91")) {
      phone = phone.slice(2);
    }
    debugLog(`[REQUEST_OTP] Normalized phone: ${originalPhone} -> ${phone}`);

    if (phone.length !== 10) {
      res.status(400);
      return next(new Error("Please provide a valid 10-digit phone number"));
    }

    // Validate phone format (Indian)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      res.status(400);
      return next(
        new Error(
          "Please provide a valid Indian phone number starting with 6-9"
        )
      );
    }

    // Check if phone is blocked
    if (await isPhoneBlocked(phone)) {
      res.status(429);
      return next(
        new Error("Too many attempts. Please try again in 30 minutes.")
      );
    }

    const otp = generateOTP();
    await saveOTP(phone, otp);
    await sendOTP(phone, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // Only return OTP in development for testing
      ...(process.env.NODE_ENV !== "production" && { otp }),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and Login/Register
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { phone, otp, name, role } = req.body;
    debugLog(
      `[VERIFY_OTP] Received raw: phone=${phone}, otp=${otp}, role=${role}`
    );

    if (!phone || !otp) {
      debugLog(`[VERIFY_OTP] Missing fields: phone=${phone}, otp=${otp}`);
      res.status(400);
      return next(new Error("Please provide phone and OTP"));
    }

    // Normalize phone
    const originalPhone = phone;
    phone = String(phone).replace(/\D/g, "");
    if (phone.length === 12 && phone.startsWith("91")) {
      phone = phone.slice(2);
    }
    debugLog(`[VERIFY_OTP] Normalized phone: ${originalPhone} -> ${phone}`);

    const result = await verifyOTPRecord(phone, otp);
    debugLog(`[VERIFY_OTP] Result for ${phone}: ${JSON.stringify(result)}`);

    if (!result.valid) {
      res.status(401);
      return next(new Error(result.message || "Invalid OTP"));
    }

    let user = await User.findOne({ phone });
    let isNewUser = false;
    let profile: any = null;

    if (!user) {
      isNewUser = true;
      user = await User.create({
        phone,
        role: role || "CUSTOMER",
      });

      // Create profile based on role
      if (user.role === "CUSTOMER") {
        profile = await Customer.create({
          user: user._id,
          name: name || "New User",
        });
      } else if (user.role === "VENDOR") {
        profile = await Vendor.create({
          user: user._id,
          businessName: name || "New Salon",
          ownerName: name || "New User",
          email: "", // To be updated
          address: "",
          city: "",
          state: "",
          pincode: "",
          aadharNumber: "",
        });

        // Notify admin about new vendor
        notifyNewVendorRegistration(profile.businessName || name || "New Vendor", user._id.toString());
      } else if (user.role === "ADMIN") {
        profile = await Admin.create({
          user: user._id,
          name: name || "Admin",
          email: "", // To be updated
        });
      }
    } else {
      // Fetch profile
      if (user.role === "CUSTOMER") {
        profile = await Customer.findOne({ user: user._id });
        // If profile name is still default "New User", treat as new user to force registration page
        if (profile && profile.name === "New User") {
          isNewUser = true;
        }
      } else if (user.role === "VENDOR") {
        profile = await Vendor.findOne({ user: user._id });
      } else if (user.role === "ADMIN") {
        profile = await Admin.findOne({ user: user._id });
      }

      // Strict check: if role is specificed, it must match user role (unless it's an upgrade)
      if (role && role !== user.role) {
        // Allow Customer -> Vendor upgrade
        if (role === "VENDOR" && user.role === "CUSTOMER") {
          // Upgrade logic proceeds
        } else {
          // Block Vendor -> Customer or other mismatches
          res.status(403);
          return next(
            new Error(
              `This number is registered as a ${user.role}. Please login to the ${user.role.toLowerCase()} portal.`
            )
          );
        }
      }

      if (role === "VENDOR" && user.role === "CUSTOMER") {
        // Upgrade customer to vendor
        user.role = "VENDOR";
        await user.save();

        // Create vendor profile if it doesn't exist
        if (!profile || user.role === "VENDOR") {
          const existingVendor = await Vendor.findOne({ user: user._id });
          if (!existingVendor) {
            profile = await Vendor.create({
              user: user._id,
              businessName: name || profile?.name || "New Salon",
              ownerName: name || profile?.name || "New User",
              email: profile?.email || "",
              address: "",
              city: "",
              state: "",
              pincode: "",
              aadharNumber: "",
            });

            // Notify admin about new vendor upgrade
            notifyNewVendorRegistration(profile.businessName || name || "New Vendor", user._id.toString());
          } else {
            profile = existingVendor;
          }
        }
      }
    }

    // Check if vendor account status
    if (user.role === "VENDOR") {
      if (profile?.status === "suspended") {
        res.status(403);
        return next(
          new Error("Your account has been suspended. Please contact support.")
        );
      }

      // Block login if pending AND profile is already filled (not a new registration flow)
      // New users (isNewUser=true) or users with empty address need access to complete profile
      const isProfileIncomplete = !(profile && 'address' in profile && profile.address) || !(profile && 'city' in profile && profile.city);

      if (!isNewUser && profile?.status === "pending" && !isProfileIncomplete) {
        res.status(403);
        return next(
          new Error("Account pending approval from admin")
        );
      }
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    const accessToken = generateAccessToken(
      user._id.toString(),
      user.role,
      user.tokenVersion
    );
    const refreshToken = generateRefreshToken(
      user._id.toString(),
      user.tokenVersion
    );

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      user: {
        _id: user._id,
        name: (profile && 'name' in profile && profile.name) || (profile && 'businessName' in profile && profile.businessName) || "User",
        phone: user.phone,
        role: user.role,
        email: user.email || (profile && 'email' in profile && profile.email) || "",
        status: (profile && 'status' in profile && profile.status) || "active",
        isVerified: (profile && 'isVerified' in profile && profile.isVerified) || false,
        profile: profile,
      },
      token: accessToken,
      isNewUser,
    });
  } catch (error) {
    next(error);
  }
};
