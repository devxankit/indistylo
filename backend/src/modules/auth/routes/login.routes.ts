import express from "express";
import { phoneLogin, login, refresh, logout, logoutAll, getMe } from "../controllers/login.controller.js";
import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

// Login routes
router.post("/phone-login", phoneLogin);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout); // No auth needed - uses cookie
router.post("/logout-all", protect, logoutAll);
router.get("/me", protect, getMe);

export default router;
