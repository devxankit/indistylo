import express from "express";
import otpRoutes from "./routes/otp.routes.js";
import loginRoutes from "./routes/login.routes.js";
import passwordRoutes from "./routes/password.routes.js";

const router = express.Router();

// Mount auth sub-routes
router.use("/", otpRoutes);
router.use("/", loginRoutes);
router.use("/", passwordRoutes);

export default router;
