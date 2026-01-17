import express from "express";
import { updateProfile, getUserById } from "../controllers/profile.controller.js";
import { protect, authorize } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.put("/", protect, updateProfile);
router.get("/:id", protect, authorize("ADMIN", "VENDOR"), getUserById);

export default router;
