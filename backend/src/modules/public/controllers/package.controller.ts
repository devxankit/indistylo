import type { Request, Response } from "express";
import Package from "../../../models/package.model.js";
import Salon from "../../../models/salon.model.js";
import Vendor from "../../../models/vendor.model.js";

// @desc    Get all packages (public)
// @route   GET /api/public/packages or /api/packages
// @access  Public
// @desc    Get all packages (public)
// @route   GET /api/public/packages or /api/packages
// @access  Public
export const getPackages = async (req: Request, res: Response) => {
    try {
        const { type, gender, salonId } = req.query;

        const query: any = { isActive: true };

        if (type) {
            query.type = type;
        }

        if (gender && gender !== "unisex") {
            query.gender = { $in: [gender, "unisex"] };
        }

        // Note: filtering by salonId directly on Package if needed
        // But for now, we just fetch all and let frontend/other logic handle it

        const packages = await Package.find(query)
            .populate("vendor", "businessName address city")
            .populate("salon") // Directly populate the salon/spa field
            .populate("services", "name duration price image")
            .sort({ createdAt: -1 });

        res.status(200).json(packages);
    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
export const getPackageById = async (req: Request, res: Response) => {
    try {
        const pkg = await Package.findById(req.params.id)
            .populate("vendor")
            .populate("salon") // Directly populate the salon/spa field
            .populate("services");

        if (!pkg) {
            return res.status(404).json({ message: "Package not found" });
        }

        res.status(200).json(pkg);
    } catch (error: any) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
