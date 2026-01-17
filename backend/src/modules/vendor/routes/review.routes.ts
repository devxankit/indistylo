import express from "express";
import { getVendorReviews, replyToReview } from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", getVendorReviews);
router.post("/:id/reply", replyToReview);

export default router;
