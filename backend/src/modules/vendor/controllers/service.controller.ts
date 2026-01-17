import type { Response, NextFunction } from "express";
import Salon from "../../../models/salon.model.js";
import Spa from "../../../models/spa.model.js";
import Service from "../../../models/service.model.js";
import Vendor from "../../../models/vendor.model.js";

// @desc    Get vendor's services
// @route   GET /api/vendor/services
// @access  Private/Vendor
export const getMyServices = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user._id }).lean();
        const isSpa = vendor?.type === "spa";
        const Model = isSpa ? Spa : Salon;

        const business = await Model.findOne({ vendor: req.user._id });
        if (!business) {
            return res.status(200).json([]);
        }
        const services = await Service.find({ salon: business._id });
        res.status(200).json(services);
    } catch (error) {
        next(error);
    }
};

// @desc    Add new service
// @route   POST /api/vendor/services
// @access  Private/Vendor
export const addService = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user._id }).lean();
        const isSpa = vendor?.type === "spa";
        const Model = isSpa ? Spa : Salon;

        const business = await Model.findOne({ vendor: req.user._id });
        if (!business) {
            res.status(400);
            return next(new Error(`Please create a ${isSpa ? 'spa' : 'salon'} profile first`));
        }

        const service = await Service.create({
            salon: business._id,
            onModel: isSpa ? "Spa" : "Salon",
            ...req.body,
        });
        res.status(201).json(service);
    } catch (error) {
        next(error);
    }
};

// @desc    Update service
// @route   PUT /api/vendor/services/:id
// @access  Private/Vendor
export const updateService = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const service = await Service.findById(req.params.id).populate("salon");
        if (!service) {
            res.status(404);
            return next(new Error("Service not found"));
        }

        // Verify ownership
        const salon = service.salon as any;
        if (salon.vendor.toString() !== req.user._id.toString()) {
            res.status(401);
            return next(new Error("Not authorized"));
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedService);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete service
// @route   DELETE /api/vendor/services/:id
// @access  Private/Vendor
export const deleteService = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const service = await Service.findById(req.params.id).populate("salon");
        if (!service) {
            res.status(404);
            return next(new Error("Service not found"));
        }

        // Verify ownership
        const salon = service.salon as any;
        if (salon.vendor.toString() !== req.user._id.toString()) {
            res.status(401);
            return next(new Error("Not authorized"));
        }

        await service.deleteOne();
        res.status(200).json({ message: "Service deleted" });
    } catch (error) {
        next(error);
    }
};
