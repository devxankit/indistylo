import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedUntil: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 1800 }, // Expires in 30 minutes
    },
  },
  { timestamps: true }
);

// Index for efficient lookups
otpSchema.index({ phone: 1, isBlocked: 1 });

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
