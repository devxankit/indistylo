import express from "express";
import {
    getServices,
    getSalons,
    getServiceById,
    getSalonById,
    getSalonStaff,
    getSalonSchedule,
} from "../controllers/service.controller.js";

const router = express.Router();

// Public routes - no authentication required
router.get("/", getServices);
router.get("/salons", getSalons);
router.get("/:id", getServiceById);
router.get("/salon/:id", getSalonById);
router.get("/salon/:id/staff", getSalonStaff);
router.get("/salon/:id/schedule", getSalonSchedule);

export default router;
