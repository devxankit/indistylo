import express from "express";
import { forgotPassword, resetPassword } from "../controllers/password.controller.js";

const router = express.Router();

// Password routes - Public
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);

export default router;
