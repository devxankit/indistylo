import { create } from "zustand";
import { api } from "../services/apiClient";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "BOOKING" | "OFFER" | "SYSTEM" | "POINTS";
  isRead: boolean;
  createdAt: string;
  data?: any;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.get("/notifications");
      set({ notifications: response, loading: false });
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error);
      set({
        error: error.message || "Failed to fetch notifications",
        loading: false,
      });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`, {});
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
      }));
    } catch (error: any) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch("/notifications/read-all", {});
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }));
    } catch (error: any) {
      console.error("Failed to mark all notifications as read:", error);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
      }));
    } catch (error: any) {
      console.error("Failed to delete notification:", error);
    }
  },
}));
