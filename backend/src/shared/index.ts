import express from "express";
import serviceRoutes from "./routes/service.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const router = express.Router();

// Mount shared routes
router.use("/services", serviceRoutes);
router.use("/notifications", notificationRoutes);
router.use("/upload", uploadRoutes);

export default router;

// Also export individual routes for backward compatibility
export { serviceRoutes, notificationRoutes, uploadRoutes };
