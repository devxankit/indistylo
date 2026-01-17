import type { Response, NextFunction } from "express";
import { User, Admin, Customer, Vendor } from "../../../models/index.js";

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    // Update core user info if provided
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    await user.save();

    let profile: any = null;
    let responseData: any = {
      _id: user._id,
      phone: user.phone,
      role: user.role,
      email: user.email,
    };

    if (user.role === "CUSTOMER") {
      profile = await Customer.findOne({ user: user._id });
      if (!profile) {
        profile = await Customer.create({
          user: user._id,
          name: req.body.name || "User",
          email: req.body.email || user.email,
        });
      } else {
        profile.name = req.body.name || profile.name;
        profile.email = req.body.email || profile.email;
        profile.avatar = req.body.avatar || profile.avatar;
        profile.location = req.body.location || profile.location;
        await profile.save();
      }
      responseData = {
        ...responseData,
        name: profile.name,
        avatar: profile.avatar,
        location: profile.location,
        walletBalance: profile.walletBalance,
        points: profile.points,
      };
    } else if (user.role === "VENDOR") {
      profile = await Vendor.findOne({ user: user._id });
      if (profile) {
        profile.ownerName = req.body.name || profile.ownerName;
        profile.email = req.body.email || profile.email;
        profile.businessName = req.body.businessName || profile.businessName;
        await profile.save();
        responseData = {
          ...responseData,
          name: profile.ownerName,
          businessName: profile.businessName,
        };
      }
    } else if (user.role === "ADMIN") {
      profile = await Admin.findOne({ user: user._id });
      if (profile) {
        profile.name = req.body.name || profile.name;
        profile.email = req.body.email || profile.email;
        await profile.save();
        responseData = {
          ...responseData,
          name: profile.name,
        };
      }
    }

    res.json({
      ...responseData,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID (for admin/vendor)
// @route   GET /api/user/:id
// @access  Private/Admin
export const getUserById = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    let profile: any = null;
    if (user.role === "CUSTOMER") {
      profile = await Customer.findOne({ user: user._id });
    } else if (user.role === "VENDOR") {
      profile = await Vendor.findOne({ user: user._id });
    }

    res.json({
      ...user.toObject(),
      profile: profile,
    });
  } catch (error) {
    next(error);
  }
};
