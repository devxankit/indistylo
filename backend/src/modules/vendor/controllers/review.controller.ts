import type { Response, NextFunction } from "express";
import Salon from "../../../models/salon.model.js";
import Review from "../../../models/review.model.js";

// @desc    Get reviews for vendor's salon
// @route   GET /api/vendor/reviews
// @access  Private/Vendor
export const getVendorReviews = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const salon = await Salon.findOne({ vendor: req.user._id });
        if (!salon) {
            return res.status(200).json([]);
        }
        const reviews = await Review.find({ salon: salon._id })
            .populate("user", "name")
            .populate("service", "name")
            .sort("-createdAt");

        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

// @desc    Reply to a review
// @route   POST /api/vendor/reviews/:id/reply
// @access  Private/Vendor
export const replyToReview = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { reply } = req.body;
        const review = await Review.findById(req.params.id).populate("salon");

        if (!review) {
            res.status(404);
            return next(new Error("Review not found"));
        }

        // Verify ownership
        const salon = review.salon as any;
        if (salon.vendor.toString() !== req.user._id.toString()) {
            res.status(401);
            return next(new Error("Not authorized"));
        }

        review.reply = {
            text: reply,
            createdAt: new Date(),
        };
        await review.save();

        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
};
