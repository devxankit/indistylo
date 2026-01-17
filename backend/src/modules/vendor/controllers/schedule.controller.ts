import type { Response, NextFunction } from "express";
import Salon from "../../../models/salon.model.js";
import Spa from "../../../models/spa.model.js";
import Schedule from "../../../models/schedule.model.js";

// @desc    Get salon schedule
// @route   GET /api/vendor/schedule
// @access  Private/Vendor
export const getMySchedule = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        // Check for both Salon and Spa
        let salon = await Salon.findOne({ vendor: req.user._id });
        let businessId = salon?._id;

        if (!salon) {
            const spa = await Spa.findOne({ vendor: req.user._id });
            if (spa) {
                businessId = spa._id;
            }
        }

        if (!businessId) {
            return res.status(200).json([]);
        }

        const schedule = await Schedule.find({ salon: businessId }).sort("dayOfWeek");
        res.status(200).json(schedule);
    } catch (error) {
        next(error);
    }
};

// @desc    Update salon schedule
// @route   POST /api/vendor/schedule
// @access  Private/Vendor
export const updateSchedule = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        // Check for both Salon and Spa
        let salon = await Salon.findOne({ vendor: req.user._id });
        let businessId = salon?._id;

        if (!salon) {
            const spa = await Spa.findOne({ vendor: req.user._id });
            if (spa) {
                businessId = spa._id;
            }
        }

        if (!businessId) {
            res.status(400);
            return next(new Error("Please create a salon or spa profile first"));
        }

        const { schedules } = req.body; // Array of schedule items

        const updatedSchedules = [];
        for (const item of schedules) {
            const updated = await Schedule.findOneAndUpdate(
                { salon: businessId, dayOfWeek: item.dayOfWeek },
                { ...item, salon: businessId },
                { upsert: true, new: true }
            );
            updatedSchedules.push(updated);
        }

        res.status(200).json(updatedSchedules);
    } catch (error) {
        next(error);
    }
};
