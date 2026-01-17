import express from "express";
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../controllers/notification.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

// All notification routes require authentication
router.use(protect);

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

export default router;
