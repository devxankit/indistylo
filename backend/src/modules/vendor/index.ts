import express from "express";
import { vendorProtect } from "./auth/vendor.middleware.js";
import salonRoutes from "./routes/salon.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import staffRoutes from "./routes/staff.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import earningsRoutes from "./routes/earnings.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import packageRoutes from "./routes/package.routes.js";

const router = express.Router();

// All vendor routes require authentication and VENDOR role
router.use(vendorProtect);

// Mount vendor sub-routes
router.use("/salon", salonRoutes);
router.use("/services", serviceRoutes);
router.use("/schedule", scheduleRoutes);
router.use("/staff", staffRoutes);
router.use("/bookings", bookingRoutes);
router.use("/reviews", reviewRoutes);
router.use("/earnings", earningsRoutes);
router.use("/packages", packageRoutes);
router.use("/", analyticsRoutes);

export default router;
