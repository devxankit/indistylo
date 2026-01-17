import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api as apiClient } from "../services/apiClient";

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

interface User {
  _id: string;
  phone: string;
  role: string;
  email?: string;
  status?: string;
}

interface CustomerProfile {
  _id: string;
  name: string;
  email?: string;
  walletBalance?: number;
  referralCode?: string;
}

interface UserState {
  user: User | null;
  customerProfile: CustomerProfile | null;
  token: string | null;
  name: string;
  location: string;
  points: number;
  cartCount: number;
  notifications: UserNotification[];
  notificationsCount: number;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearNotifications: () => Promise<void>;
  currentPage: string;
  isLoggedIn: boolean;
  userPhone: string;

  setToken: (token: string | null) => void;
  setUser: (user: User | null, profile?: CustomerProfile | null) => void;
  setName: (name: string) => void;
  setLocation: (location: string) => void;
  setCurrentPage: (page: string) => void;
  setCartCount: (count: number) => void;
  setNotificationsCount: (count: number) => void;
  login: (user: User, token: string, profile?: CustomerProfile | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      customerProfile: null,
      token: null,
      name: "User",
      location: "New Palasia",
      points: 0,
      cartCount: 0,
      notifications: [],
      notificationsCount: 0,
      currentPage: "home",
      isLoggedIn: false,
      userPhone: "",

      setToken: (token) => set({ token, isLoggedIn: !!token }),
      setUser: (user, profile = null) =>
        set({
          user,
          customerProfile: profile,
          name: profile?.name || "User",
          userPhone: user?.phone || "",
          location: "New Palasia",
          points: 0, // Points can be added to CustomerProfile if needed
        }),
      setName: (name) => set((state) => ({
        name,
        customerProfile: state.customerProfile ? { ...state.customerProfile, name } : null
      })),
      setLocation: (location) => set({ location }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setCartCount: (count) => set({ cartCount: count }),
      setNotificationsCount: (count) => set({ notificationsCount: count }),

      fetchNotifications: async () => {
        try {
          const notifications: UserNotification[] = await apiClient.get("/user/notifications");
          const unreadCount = notifications.filter(n => !n.read).length;
          set({ notifications, notificationsCount: unreadCount });
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      },

      markAsRead: async (id) => {
        // Optimistic update
        set((state) => {
          const updatedNotifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          return { notifications: updatedNotifications, notificationsCount: unreadCount };
        });

        try {
          await apiClient.patch(`/user/notifications/${id}/read`, {});
        } catch (error) {
          console.error("Failed to mark notification as read:", error);
        }
      },

      markAllAsRead: async () => {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) => ({ ...n, read: true }));
          return { notifications: updatedNotifications, notificationsCount: 0 };
        });

        try {
          await apiClient.patch("/user/notifications/read-all", {});
        } catch (error) {
          console.error("Failed to mark all as read:", error);
        }
      },

      deleteNotification: async (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.filter((n) => n.id !== id);
          const unreadCount = updatedNotifications.filter(n => !n.read).length;
          return { notifications: updatedNotifications, notificationsCount: unreadCount };
        });

        try {
          await apiClient.delete(`/user/notifications/${id}`);
        } catch (error) {
          console.error("Failed to delete notification:", error);
        }
      },

      clearNotifications: async () => {
        set({ notifications: [], notificationsCount: 0 });
        try {
          await apiClient.delete("/user/notifications/clear-all");
        } catch (error) {
          console.error("Failed to clear notifications:", error);
        }
      },
      login: (user, token, profile = null) =>
        set({
          user,
          customerProfile: profile,
          token,
          isLoggedIn: true,
          name: profile?.name || "User",
          userPhone: user.phone,
          location: "New Palasia",
          points: 0,
        }),
      logout: () =>
        set({
          user: null,
          customerProfile: null,
          token: null,
          isLoggedIn: false,
          name: "User",
          userPhone: "",
          location: "New Palasia",
          points: 0,
        }),
    }),
    {
      name: "user-storage",
    }
  )
);
