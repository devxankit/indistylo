import type { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model.js";
import Salon from "../../../models/salon.model.js";
import Spa from "../../../models/spa.model.js";
import Vendor from "../../../models/vendor.model.js";
import Customer from "../../../models/customer.model.js";
import Booking from "../../../models/booking.model.js";
import Payout from "../../../models/payout.model.js";
import Service from "../../../models/service.model.js";
import Review from "../../../models/review.model.js";
import Package from "../../../models/package.model.js";

// @desc    Get all vendors with their salons
// @route   GET /api/admin/vendors
// @access  Private/Admin
export const getAllVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendors = await User.find({ role: "VENDOR" }).lean();

    const vendorsWithSalons = await Promise.all(
      vendors.map(async (vendor) => {
        // Check for Salon first
        let salon = await Salon.findOne({ vendor: vendor._id }).lean();
        let type = 'salon';
        let business = salon;

        // If no salon, check for Spa
        if (!salon) {
          const spa = await Spa.findOne({ vendor: vendor._id }).lean();
          if (spa) {
            type = 'spa';
            business = spa;
          }
        }

        const vendorProfile = await Vendor.findOne({ user: vendor._id }).lean();

        return {
          ...vendor,
          salon: business,  // Keep as 'salon' for backward compatibility
          type,             // Add type field
          vendorProfile
        };
      })
    );

    res.status(200).json(vendorsWithSalons);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vendor details with stats
// @route   GET /api/admin/vendors/:id
// @access  Private/Admin
export const getVendorDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorUser = await User.findById(req.params.id).lean();
    if (!vendorUser || vendorUser.role !== "VENDOR") {
      res.status(404);
      return next(new Error("Vendor not found"));
    }

    // Check for both Salon and Spa
    let salon = await Salon.findOne({ vendor: vendorUser._id }).lean();
    let business = salon;

    if (!salon) {
      const spa = await Spa.findOne({ vendor: vendorUser._id }).lean();
      business = spa;
    }

    const vendorProfile = await Vendor.findOne({ user: vendorUser._id }).lean();

    // Calculate stats using business (either salon or spa)
    const bookings = business
      ? await Booking.find({ salon: business._id, paymentStatus: "paid" })
      : [];
    const totalRevenue = bookings.reduce((acc, b) => acc + b.price, 0);
    const totalBookings = bookings.length;
    const totalEarnings = bookings.reduce(
      (acc, b) => acc + (b.vendorEarnings || 0),
      0
    );

    const payouts = business ? await Payout.find({ salon: business._id }).sort({ createdAt: -1 }) : [];
    const totalPayouts = payouts
      .filter((p) => p.status === "processed")
      .reduce((acc, p) => acc + p.amount, 0);

    const totalCommission = totalRevenue - totalEarnings;
    const walletBalance = totalEarnings - totalPayouts;

    // Fetch detailed data for tabs
    const services = business ? await Service.find({ salon: business._id }) : [];

    const recentBookingsRaw = business
      ? await Booking.find({ salon: business._id })
        .sort({ date: -1 })
        .populate("user", "phone role")
        .populate("service", "name")
        .populate("professional", "name")
        .lean()
      : [];

    // Fetch customer profiles for each booking
    const recentBookings = await Promise.all(
      recentBookingsRaw.map(async (booking: any) => {
        if (booking.user?.role === "CUSTOMER") {
          const customer = await Customer.findOne({ user: booking.user._id }).select("name").lean();
          return {
            ...booking,
            user: {
              ...booking.user,
              name: customer?.name || "Unknown Customer"
            }
          };
        }
        return booking;
      })
    );

    const reviews = business
      ? await Review.find({ salon: business._id })
        .sort({ createdAt: -1 })
        .populate("user", "name image")
        .populate("service", "name")
      : [];

    const packages = vendorProfile
      ? await Package.find({ vendor: vendorProfile._id })
      : [];

    res.status(200).json({
      ...vendorUser,
      salon: business,  // Return business as 'salon' for backward compatibility
      vendorProfile,
      stats: {
        totalRevenue,
        totalBookings,
        totalEarnings,
        totalPayouts,
        totalCommission,
        walletBalance,
        recentPayouts: payouts.slice(0, 5), // Send recent 5 payouts for overview
      },
      services,
      packages,
      payouts, // Send all payouts for Transactions tab
      recentBookings,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor status
// @route   PATCH /api/admin/vendors/:id/status
// @access  Private/Admin
export const updateVendorStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user || user.role !== "VENDOR") {
      res.status(404);
      return next(new Error("Vendor not found"));
    }

    // Update vendor profile status
    const vendorProfile = await Vendor.findOneAndUpdate(
      { user: user._id },
      { $set: { status } },
      { new: true }
    );

    // Sync user status
    if (status === "suspended") {
      user.status = "suspended";
    } else {
      user.status = "active";
    }
    await user.save();

    // Also update salon isActive based on status
    if (status === "active") {
      await Salon.updateOne({ vendor: user._id }, { isActive: true });
    } else if (status === "suspended" || status === "rejected") {
      await Salon.updateOne({ vendor: user._id }, { isActive: false });
    }

    res
      .status(200)
      .json({ message: "Vendor status updated", user, vendorProfile });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify vendor document
// @route   PATCH /api/admin/vendors/:id/verify-document
// @access  Private/Admin
export const verifyVendorDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { documentId, status } = req.body;
    console.log('Verifying document:', { vendorId: req.params.id, documentId, status });

    const vendorProfile = await Vendor.findOne({ user: req.params.id });

    if (!vendorProfile) {
      res.status(404);
      return next(new Error("Vendor profile not found"));
    }

    if (
      !vendorProfile.verificationDocuments ||
      vendorProfile.verificationDocuments.length === 0
    ) {
      res.status(400);
      return next(new Error("No documents found for this vendor"));
    }

    console.log('Available documents:', vendorProfile.verificationDocuments.map((d: any) => ({ id: d._id, type: d.type, status: d.status })));

    const document = vendorProfile.verificationDocuments.find(
      (doc: any) => doc._id.toString() === documentId
    );

    if (!document) {
      console.error('Document not found. Looking for:', documentId);
      console.error('Available IDs:', vendorProfile.verificationDocuments.map((d: any) => d._id?.toString()));
      res.status(400);
      return next(new Error("Invalid document ID"));
    }

    document.status = status;
    console.log('Updated document status to:', status);

    // Check if all documents are verified
    const allVerified = vendorProfile.verificationDocuments.every(
      (doc) => doc.status === "verified"
    );

    if (allVerified) {
      vendorProfile.isVerified = true;
      vendorProfile.status = "active";
      await Salon.updateOne({ vendor: req.params.id }, { isActive: true });
      await User.findByIdAndUpdate(req.params.id, { status: "active" });
      console.log('All documents verified. Vendor activated.');
    }

    await vendorProfile.save();
    console.log('Vendor profile saved successfully');

    res.status(200).json({ message: "Document status updated", vendorProfile });
  } catch (error) {
    console.error('Error in verifyVendorDocument:', error);
    next(error);
  }
};

// @desc    Create new vendor manually (User + Salon)
// @route   POST /api/admin/vendors
// @access  Private/Admin
export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, name, email, salonName, location, businessName, ownerName, type } =
      req.body;

    // Check if user already exists
    let user = await User.findOne({ phone });
    if (user) {
      res.status(400);
      return next(new Error("User with this phone already exists"));
    }

    // Create user
    user = await User.create({
      phone,
      email: email || "",
      role: "VENDOR",
    });

    // Create vendor profile
    const vendorProfile = await Vendor.create({
      user: user._id,
      businessName: businessName || salonName || name || "New Salon",
      ownerName: ownerName || name || "New User",
      email: email || "",
      address: location || "",
      city: "",
      state: "",
      pincode: "",
      aadharNumber: "MANUAL", // Placeholder for manual creation
      status: "active",
      isVerified: true,
      type: type || "salon",
    });

    // Create salon
    const salon = await Salon.create({
      vendor: user._id,
      name: businessName || salonName || name || "New Salon",
      location: location || "",
      geo: { type: "Point", coordinates: [0, 0] },
      isActive: true,
    });

    res.status(201).json({ user, vendorProfile, salon });
  } catch (error) {
    next(error);
  }
};
