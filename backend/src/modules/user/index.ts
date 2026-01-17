import express from "express";
import { userProtect } from "./auth/user.middleware.js";
import profileRoutes from "./routes/profile.routes.js";
import addressRoutes from "./routes/address.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const router = express.Router();

// All user routes require authentication
router.use(userProtect);

// Mount user sub-routes
router.use("/profile", profileRoutes);
router.use("/addresses", addressRoutes);
router.use("/wallet", walletRoutes);
router.use("/orders", orderRoutes);
router.use("/notifications", notificationRoutes);

export default router;

// Also export booking and review routes for separate mounting
export { bookingRoutes, reviewRoutes, orderRoutes };
