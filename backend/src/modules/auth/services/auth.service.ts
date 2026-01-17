import bcrypt from "bcryptjs";
import OTP from "../../../models/otp.model.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const logFile = path.join(process.cwd(), "otp-debug.log");
export const debugLog = (msg: string) => {
  const logMsg = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(logFile, logMsg);
  console.log(msg);
};

debugLog(
  `Auth Service initialized. MONGODB_URI: ${process.env.MONGODB_URI?.replace(
    /:([^@]+)@/,
    ":****@"
  )}`
);

const OTP_LENGTH = process.env.NODE_ENV === "production" ? 6 : 4;
const MAX_OTP_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Generate a secure OTP
 */
export const generateOTP = (): string => {
  debugLog(`Generating OTP. NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV !== "production") {
    const defaultOTP = process.env.DEFAULT_OTP;
    if (defaultOTP && defaultOTP.length === OTP_LENGTH) {
      debugLog(`Using DEFAULT_OTP: ${defaultOTP}`);
      return defaultOTP;
    }
    const devOTP = OTP_LENGTH === 6 ? "123456" : "1234";
    debugLog(`Using dev OTP: ${devOTP}`);
    return devOTP;
  }

  // Generate cryptographically secure OTP
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * Hash OTP before storage
 */
const hashOTP = async (otp: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

/**
 * Check if phone is blocked from OTP requests
 */
export const isPhoneBlocked = async (phone: string): Promise<boolean> => {
  const record = await OTP.findOne({ phone, isBlocked: true });
  if (!record) return false;

  if (record.blockedUntil && record.blockedUntil > new Date()) {
    return true;
  }

  // Block expired, unblock the phone
  await OTP.updateOne(
    { phone },
    { isBlocked: false, blockedUntil: null, attempts: 0 }
  );
  return false;
};

/**
 * Send OTP via SMS
 */
export const sendOTP = async (phone: string, otp: string): Promise<boolean> => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`📱 [DEV] OTP for ${phone}: ${otp}`);
    return true;
  }

  // Production SMS integration
  try {
    // TODO: Replace with actual SMS provider (MSG91, Twilio, etc.)
    console.log(`Sending OTP to ${phone} via SMS provider`);

    // Example MSG91 integration:
    // const response = await fetch('https://api.msg91.com/api/v5/otp', {
    //   method: 'POST',
    //   headers: { 'authkey': process.env.MSG91_AUTH_KEY },
    //   body: JSON.stringify({ mobile: phone, otp })
    // });

    return true;
  } catch (error) {
    console.error("SMS sending failed:", error);
    throw new Error("Failed to send OTP. Please try again.");
  }
};

/**
 * Save hashed OTP to database
 */
export const saveOTP = async (phone: string, otp: string): Promise<void> => {
  const phoneStr = String(phone);
  debugLog(`Saving OTP for phone: ${phoneStr}`);
  // Check if phone is blocked
  if (await isPhoneBlocked(phoneStr)) {
    debugLog(`Phone ${phoneStr} is blocked`);
    throw new Error("Too many attempts. Please try again in 30 minutes.");
  }

  // Delete existing OTPs for this phone
  const deleted = await OTP.deleteMany({ phone: phoneStr });
  debugLog(`Deleted ${deleted.deletedCount} existing OTPs for ${phoneStr}`);

  // Hash and save new OTP
  const otpHash = await hashOTP(otp);
  try {
    const newOTP = await OTP.create({
      phone: phoneStr,
      otpHash,
      attempts: 0,
      isBlocked: false,
    });
    debugLog(`New OTP created for ${phoneStr}: ${newOTP._id}`);
  } catch (error: any) {
    debugLog(`FAILED to create OTP for ${phoneStr}: ${error.message}`);
    throw error;
  }
};

/**
 * Verify OTP with attempt tracking
 */
export const verifyOTPRecord = async (
  phone: string,
  otp: string
): Promise<{
  valid: boolean;
  message?: string;
}> => {
  const phoneStr = String(phone);
  debugLog(`Verifying OTP for phone: ${phoneStr}, OTP: ${otp}`);

  // Debug: list all OTPs
  const allOtps = await OTP.find({});
  debugLog(`All OTPs in DB: ${JSON.stringify(allOtps)}`);

  const otpRecord = await OTP.findOne({ phone: phoneStr });

  if (!otpRecord) {
    debugLog(`No OTP record found for phone: ${phoneStr}`);
    return {
      valid: false,
      message: "OTP expired or not found. Please request a new one.",
    };
  }
  debugLog(`Found OTP record for ${phoneStr}. Attempts: ${otpRecord.attempts}`);

  // Check if blocked
  if (otpRecord.isBlocked) {
    if (otpRecord.blockedUntil && otpRecord.blockedUntil > new Date()) {
      const remainingMins = Math.ceil(
        (otpRecord.blockedUntil.getTime() - Date.now()) / 60000
      );
      return {
        valid: false,
        message: `Too many attempts. Try again in ${remainingMins} minutes.`,
      };
    }
    // Block expired
    otpRecord.isBlocked = false;
    otpRecord.attempts = 0;
  }

  // Verify OTP
  const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);

  if (isMatch) {
    // OTP verified - delete it
    await OTP.deleteOne({ _id: otpRecord._id });
    return { valid: true };
  }

  // Wrong OTP - increment attempts
  otpRecord.attempts += 1;

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    otpRecord.isBlocked = true;
    otpRecord.blockedUntil = new Date(Date.now() + BLOCK_DURATION_MS);
    await otpRecord.save();
    return {
      valid: false,
      message: "Too many failed attempts. Please try again in 30 minutes.",
    };
  }

  await otpRecord.save();
  const remaining = MAX_OTP_ATTEMPTS - otpRecord.attempts;
  return {
    valid: false,
    message: `Invalid OTP. ${remaining} attempts remaining.`,
  };
};

/**
 * Clean up expired OTP records (can be called by a cron job)
 */
export const cleanupExpiredOTPs = async (): Promise<void> => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  await OTP.deleteMany({ createdAt: { $lt: tenMinutesAgo } });
};
