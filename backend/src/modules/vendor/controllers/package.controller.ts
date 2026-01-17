import type { Request, Response } from "express";
import Package from "../../../models/package.model.js";
import Vendor from "../../../models/vendor.model.js";
import Salon from "../../../models/salon.model.js";
import Spa from "../../../models/spa.model.js";

// @desc    Create a new package
// @route   POST /api/vendor/packages
// @access  Private (Vendor)
export const createPackage = async (req: any, res: Response) => {
    try {
        const {
            name,
            image,
            type,
            gender,
            description,
            services, // Array of service IDs
            price,
        } = req.body;

        // Remove duplicates from services array if any
        const uniqueServices = [...new Set(services)] as any[];

        if (!uniqueServices || !Array.isArray(uniqueServices) || uniqueServices.length < 2) {
            return res.status(400).json({ message: "A package must contain at least 2 distinct services." });
        }

        const vendor = await Vendor.findOne({ user: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        const isSpa = vendor.type === "spa";
        const Model = isSpa ? Spa : Salon;
        const business = await Model.findOne({ vendor: req.user._id });

        if (!business) {
            return res.status(400).json({ message: `Please create a ${isSpa ? 'spa' : 'salon'} profile first` });
        }

        const newPackage = await Package.create({
            vendor: vendor._id,
            salon: business._id,
            onModel: isSpa ? "Spa" : "Salon",
            name,
            image,
            type,
            gender,
            description,
            services: uniqueServices,
            price,
        });

        res.status(201).json(newPackage);
    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all packages for the logged-in vendor
// @route   GET /api/vendor/packages
// @access  Private (Vendor)
export const getVendorPackages = async (req: any, res: Response) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        const packages = await Package.find({ vendor: vendor._id })
            .populate("services")
            .sort({ createdAt: -1 });

        res.status(200).json(packages);
    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Delete a package
// @route   DELETE /api/vendor/packages/:id
// @access  Private (Vendor)
export const deletePackage = async (req: any, res: Response) => {
    try {
        const packageId = req.params.id;
        const vendor = await Vendor.findOne({ user: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: "Vendor profile not found" });
        }

        const pkg = await Package.findOne({ _id: packageId, vendor: vendor._id });

        if (!pkg) {
            return res.status(404).json({ message: "Package not found" });
        }

        await pkg.deleteOne();

        res.status(200).json({ message: "Package deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
