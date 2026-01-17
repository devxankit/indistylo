import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  phone: string;
  email?: string;
  password?: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  status: "active" | "suspended";
  tokenVersion: number;
  failedLoginAttempts: number;
  lockUntil: Date | null;
  lastLoginAt: Date | null;
  lastLoginIp: string;
  resetPasswordToken?: string | null;
  resetPasswordExpire?: Date | null;
  matchPassword(enteredPassword: string): Promise<boolean>;
  incrementFailedAttempts(): Promise<IUser>;
  resetFailedAttempts(): Promise<IUser>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
      unique: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      minlength: [8, "Password must be at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "VENDOR", "ADMIN"],
      default: "CUSTOMER",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    // Security fields
    tokenVersion: {
      type: Number,
      default: 0, // Increment to invalidate all existing tokens
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLoginIp: {
      type: String,
      default: "",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Increment failed attempts
userSchema.methods.incrementFailedAttempts = async function () {
  // If lock is already expired, reset attempts
  if (this.lockUntil && this.lockUntil < new Date()) {
    this.failedLoginAttempts = 1;
    this.lockUntil = null;
  } else {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 5) {
      this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }
  }
  return this.save();
};

// Reset failed attempts
userSchema.methods.resetFailedAttempts = async function () {
  this.failedLoginAttempts = 0;
  this.lockUntil = null;
  return this.save();
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
