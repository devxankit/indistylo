import Notification from "../../models/notification.model.js";

export const getNotifications = async (userId: string) => {
    return await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
};

export const markAsRead = async (notificationId: string, userId: string) => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true },
        { new: true }
    );
};

export const markAllAsRead = async (userId: string) => {
    return await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
    );
};

export const createNotification = async (data: {
    recipient: string;
    title: string;
    message: string;
    type?: string;
    data?: any;
}) => {
    return await Notification.create(data);
};

export const deleteNotification = async (notificationId: string, userId: string) => {
    return await Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
};
