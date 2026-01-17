import type { Request, Response, NextFunction } from "express";
import Service from "../../models/service.model.js";
import Salon from "../../models/salon.model.js";
import Spa from "../../models/spa.model.js";
import Staff from "../../models/staff.model.js";
import Schedule from "../../models/schedule.model.js";

// @desc    Get all services with filters
// @route   GET /api/services
// @access  Public
export const getServices = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type, category, salonId, search, gender } = req.query;
        const query: any = { isActive: true };

        if (type) query.type = type;
        // - [x] Analyze backend controller for that endpoint
        // - [x] Verify if professionals are correctly linked to the salon/vendor
        // - [ ] Fix the issue (frontend or backend)
        if (category) query.category = category;
        if (salonId) query.salon = salonId;
        if (gender) {
            query.gender = { $in: [gender, "unisex"] };
        }
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const services = await Service.find(query).populate(
            "salon",
            "name location rating geo images"
        );
        res.status(200).json(services);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all salons with geo-spatial search
// @route   GET /api/services/salons
// @access  Public
export const getSalons = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { category, search, lat, lng, radius = 10 } = req.query; // radius in km
        const query: any = { isActive: true };

        if (category) query.category = { $in: [category] };

        // Text Search
        if (search) {
            query.$text = { $search: search as string };
        }

        // Geo-spatial Search
        if (lat && lng) {
            query.geo = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
                    },
                    $maxDistance: parseInt(radius as string) * 1000, // convert km to meters
                },
            };
        }

        const salons = await Salon.find(query);
        const spas = await Spa.find(query);

        // Add businessType to each for frontend clarity
        const combined = [
            ...salons.map(s => ({ ...s.toObject(), onModel: 'Salon' })),
            ...spas.map(s => ({ ...s.toObject(), onModel: 'Spa' }))
        ];

        res.status(200).json(combined);
    } catch (error) {
        next(error);
    }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const service = await Service.findById(req.params.id).populate("salon");
        if (!service) {
            res.status(404);
            return next(new Error("Service not found"));
        }
        res.status(200).json(service);
    } catch (error) {
        next(error);
    }
};

// @desc    Get salon by ID
// @route   GET /api/services/salon/:id
// @access  Public
export const getSalonById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let business = await Salon.findById(req.params.id);
        if (!business) {
            business = await Spa.findById(req.params.id);
        }

        if (!business) {
            res.status(404);
            return next(new Error("Business not found"));
        }
        res.status(200).json(business);
    } catch (error) {
        next(error);
    }
};

// @desc    Get staff for a salon
// @route   GET /api/services/salon/:id/staff
// @access  Public
export const getSalonStaff = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log(`Fetching staff for id: ${req.params.id}`);
        let businessId = req.params.id;

        // First attempt: direct lookup
        let staff = await Staff.find({ salon: businessId as string, isActive: true });

        // If no staff found, check if the ID provided is actually a Vendor (User) ID
        if (staff.length === 0) {
            // Check Salon
            const salon = await Salon.findOne({ vendor: businessId });
            if (salon) {
                businessId = salon._id.toString();
            } else {
                // Check Spa
                const spa = await Spa.findOne({ vendor: businessId });
                if (spa) {
                    businessId = spa._id.toString();
                }
            }

            // If we found a business ID different from the param, try fetching again
            if (businessId !== req.params.id) {
                console.log(`Resolved Vendor ID ${req.params.id} to Business ID ${businessId}`);
                staff = await Staff.find({ salon: businessId, isActive: true });
            }
        }

        console.log(`Found ${staff.length} staff members`);
        res.status(200).json(staff);
    } catch (error) {
        console.error("Error fetching staff:", error);
        next(error);
    }
};

// @desc    Get schedule for a salon
// @route   GET /api/services/salon/:id/schedule
// @access  Public
export const getSalonSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log(`Fetching schedule for id: ${req.params.id}`);
        let businessId = req.params.id;

        let schedules = await Schedule.find({ salon: businessId as string });

        if (schedules.length === 0) {
            // Check Salon
            const salon = await Salon.findOne({ vendor: businessId });
            if (salon) {
                businessId = salon._id.toString();
            } else {
                // Check Spa
                const spa = await Spa.findOne({ vendor: businessId });
                if (spa) {
                    businessId = spa._id.toString();
                }
            }

            if (businessId !== req.params.id) {
                console.log(`Resolved Vendor ID ${req.params.id} to Business ID ${businessId}`);
                schedules = await Schedule.find({ salon: businessId });
            }
        }

        console.log(`Found ${schedules.length} schedules`);
        res.status(200).json(schedules);
    } catch (error) {
        console.error("Error fetching schedule:", error);
        next(error);
    }
};
