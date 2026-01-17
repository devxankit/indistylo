import type { Request, Response, NextFunction } from "express";
import Notification from "../../../models/notification.model.js";

// @desc    Get all user notifications
// @route   GET /api/user/notifications
// @access  Private
export const getUserNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user._id
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        // Format notifications for frontend
        const formattedNotifications = notifications.map((notif: any) => ({
            id: notif._id.toString(),
            title: notif.title,
            message: notif.message,
            type: mapNotificationType(notif.type),
            timestamp: formatTimestamp(notif.createdAt),
            read: notif.isRead,
            link: notif.data?.link || undefined,
            createdAt: notif.createdAt
        }));

        res.status(200).json(formattedNotifications);
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PATCH /api/user/notifications/:id/read
// @access  Private
export const markAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            res.status(404);
            return next(new Error("Notification not found or access denied"));
        }

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/user/notifications/read-all
// @access  Private
export const markAllAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notification
// @route   DELETE /api/user/notifications/:id
// @access  Private
export const deleteNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user._id
        });

        if (!notification) {
            res.status(404);
            return next(new Error("Notification not found or access denied"));
        }

        res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear all notifications
// @route   DELETE /api/user/notifications/clear-all
// @access  Private
export const clearAllNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await Notification.deleteMany({
            recipient: req.user._id
        });

        res.status(200).json({ message: "All notifications cleared" });
    } catch (error) {
        next(error);
    }
};

// Helper function to map notification types
function mapNotificationType(type: string): "info" | "success" | "warning" | "error" {
    switch (type) {
        case "BOOKING":
        case "ORDER":
            return "success";
        case "OFFER":
            return "info";
        case "POINTS":
            return "success";
        case "SYSTEM":
        default:
            return "info";
    }
}

// Helper function to format timestamp
function formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return new Date(date).toLocaleDateString();
}
