import express from "express";
import {
    getAdminNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
} from "../controllers/notification.controller.js";

const router = express.Router();

// Get all notifications
router.get("/", getAdminNotifications);

// Mark single notification as read
router.patch("/:id/read", markAsRead);

// Mark all notifications as read
router.patch("/read-all", markAllAsRead);

// Delete single notification
router.delete("/:id", deleteNotification);

// Clear all notifications
router.delete("/clear-all", clearAllNotifications);

export default router;
