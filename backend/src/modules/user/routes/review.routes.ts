import express from "express";
import { submitReview, getSalonReviews, getUserReviews } from "../controllers/review.controller.js";
import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/salon/:salonId", getSalonReviews);

// Protected routes
router.post("/:id", protect, submitReview);
router.get("/user", protect, getUserReviews);

export default router;
