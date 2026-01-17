import express from "express";
import { requestOTP, verifyOTP } from "../controllers/otp.controller.js";

const router = express.Router();

// OTP routes - Public
router.post("/send-otp", requestOTP);
router.post("/verify-otp", verifyOTP);

export default router;
