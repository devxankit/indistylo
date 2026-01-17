import express from "express";
import { adminProtect } from "./auth/admin.middleware.js";
import { getPublicContent } from "./controllers/content.controller.js";
import { getPublicSubcategories } from "./controllers/category.controller.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import payoutRoutes from "./routes/payout.routes.js";
import contentRoutes from "./routes/content.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import uploadRoutes from "../../shared/routes/upload.routes.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/content", getPublicContent);
router.get("/public/categories/subcategories", getPublicSubcategories);

// All routes below require authentication and ADMIN role
router.use(adminProtect);

// Mount admin sub-routes
router.use("/stats", dashboardRoutes);
router.use("/vendors", vendorRoutes);
router.use("/customers", customerRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payouts", payoutRoutes);
router.use("/content", contentRoutes);
router.use("/settings", settingsRoutes);
router.use("/categories", categoryRoutes);
router.use("/notifications", notificationRoutes);
router.use("/upload", uploadRoutes);

export default router;
