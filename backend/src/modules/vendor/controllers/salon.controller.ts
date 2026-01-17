import type { Response, NextFunction } from "express";
import Salon from "../../../models/salon.model.js";
import Spa from "../../../models/spa.model.js";
import Vendor from "../../../models/vendor.model.js";
import User from "../../../models/user.model.js";

// @desc    Get vendor's salon profile
// @route   GET /api/vendor/salon
// @access  Private/Vendor
export const getMySalon = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id }).lean();
    const vendorType = vendor?.type || "salon";

    let businessProfile;
    if (vendorType === "spa") {
      businessProfile = await Spa.findOne({ vendor: req.user._id }).lean();
    } else {
      businessProfile = await Salon.findOne({ vendor: req.user._id }).lean();
    }

    if (businessProfile) {
      res.status(200).json({ ...businessProfile, vendorType });
    } else {
      // Return empty but successful response if no profile yet
      res.status(200).json(vendor ? { vendorType: vendor.type } : null);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update salon profile
// @route   POST /api/vendor/salon
// @access  Private/Vendor
export const upsertSalon = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      location,
      geo,
      images,
      category,
      gender,
      // Vendor registration fields
      businessName,
      ownerName,
      email,
      address,
      city,
      state,
      pincode,
      gstNumber,
      aadharNumber,
      experience,
      specialization,
      verificationDocuments,
      vendorType,
    } = req.body;

    const isSpa = vendorType === "spa";
    const Model = isSpa ? Spa : Salon;

    let businessProfile = await Model.findOne({ vendor: req.user._id });

    const businessData: any = {
      vendor: req.user._id,
      name: name || businessName,
      description,
      location: location || address,
      geo: geo || { type: "Point", coordinates: [0, 0] },
      images,
      category,
      gender,
    };

    if (isSpa) {
      if (!businessData.category) {
        businessData.category = ["Spa"];
      } else if (Array.isArray(businessData.category)) {
        if (!businessData.category.includes("Spa")) {
          businessData.category.push("Spa");
        }
      } else if (typeof businessData.category === "string") {
        if (businessData.category !== "Spa") {
          businessData.category = [businessData.category, "Spa"];
        }
      }
    }

    if (businessProfile) {
      businessProfile = await Model.findByIdAndUpdate(
        businessProfile._id,
        { $set: businessData },
        { new: true }
      );
    } else {
      businessProfile = await Model.create(businessData);
    }

    // Also create or update Vendor profile with registration details
    if (businessName || ownerName || email) {
      let vendor = await Vendor.findOne({ user: req.user._id });
      const vendorData = {
        user: req.user._id,
        businessName: businessName || name,
        ownerName: ownerName || vendor?.ownerName || "New User",
        email: email || req.user.email,
        address: address || location,
        city: city || "",
        state: state || "",
        pincode: pincode || "",
        gstNumber: gstNumber || "",
        aadharNumber: aadharNumber || "",
        experience: experience || "",
        specialization: specialization || "",
        verificationDocuments: verificationDocuments || [],
        type: vendorType || vendor?.type || "salon",
      };

      if (vendor) {
        await Vendor.findByIdAndUpdate(vendor._id, { $set: vendorData });
      } else {
        await Vendor.create(vendorData);
      }
    }

    res.status(201).json(businessProfile);
  } catch (error) {
    next(error);
  }
};
