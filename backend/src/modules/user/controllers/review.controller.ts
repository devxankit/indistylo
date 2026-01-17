import type { Request, Response, NextFunction } from "express";
import Booking from "../../../models/booking.model.js";
import Review from "../../../models/review.model.js";

// @desc    Submit a review for a booking
// @route   POST /api/bookings/:id/review
// @access  Private
export const submitReview = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const { rating, comment, images } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404);
            return next(new Error("Booking not found"));
        }

        if (booking.status !== "completed") {
            res.status(400);
            return next(new Error("You can only review completed bookings"));
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            res.status(401);
            return next(new Error("Not authorized"));
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ booking: booking._id });
        if (existingReview) {
            res.status(400);
            return next(new Error("Review already submitted for this booking"));
        }

        const review = await Review.create({
            user: req.user._id,
            salon: booking.salon,
            ...(booking.service && { service: booking.service }),
            booking: booking._id,
            rating,
            comment,
            images,
        });

        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};

// @desc    Get salon reviews
// @route   GET /api/bookings/salon/:salonId/reviews
// @access  Public
export const getSalonReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { salonId } = req.params;
        const reviews = await Review.find({ salon: salonId as string })
            .populate("user", "name image")
            .populate("service", "name")
            .sort("-createdAt");

        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user reviews
// @route   GET /api/bookings/reviews/user
// @access  Private
export const getUserReviews = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate("salon", "name images")
            .populate("service", "name")
            .populate("booking", "date time status professional")
            .sort("-createdAt");

        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};
