import type { Response } from "express";
import * as notificationService from "../services/notification.service.js";

export const getNotifications = async (req: any, res: Response) => {
    try {
        const notifications = await notificationService.getNotifications(req.user.id);
        res.status(200).json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markAsRead = async (req: any, res: Response) => {
    try {
        const notification = await notificationService.markAsRead(
            req.params.id,
            req.user.id
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json(notification);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markAllAsRead = async (req: any, res: Response) => {
    try {
        await notificationService.markAllAsRead(req.user.id);
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteNotification = async (req: any, res: Response) => {
    try {
        const notification = await notificationService.deleteNotification(
            req.params.id,
            req.user.id
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json({ message: "Notification deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
