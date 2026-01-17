import { create } from "zustand";
import type {
  AdminUser,
  AdminVendorListItem,
  AdminStats,
} from "../services/types";
import { persist, createJSONStorage } from "zustand/middleware";
import { api as apiClient } from "../../user/services/apiClient";
import { toast } from "sonner";

interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  currentUser: AdminUser | null;
  stats: AdminStats;
  chartData: any[];
  pendingVendors: AdminVendorListItem[];
  activeVendors: AdminVendorListItem[];
  recentBookings: any[];
  allBookings: any[];
  payouts: any[];
  users: any[];
  commissionRate: number;
  notifications: AdminNotification[];
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchStats: () => Promise<void>;
  fetchVendors: () => Promise<void>;
  fetchAllBookings: (filters?: any) => Promise<void>;
  fetchPayouts: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchCommissionRate: () => Promise<void>;
  updateCommissionRate: (rate: number) => Promise<void>;
  processPayout: (payoutId: string, data: any) => Promise<void>;
  approveVendor: (vendorId: string) => Promise<void>;
  rejectVendor: (vendorId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notification: AdminNotification) => void;
  addCustomer: (data: any) => Promise<void>;
  addVendor: (data: any) => Promise<void>;
  verifyDocument: (
    vendorId: string,
    documentId: string,
    status: "verified" | "rejected"
  ) => Promise<void>;
  selectedVendor: any | null;
  fetchVendorDetails: (id: string) => Promise<void>;
  getUserHistory: (userId: string) => Promise<any[]>;
}

// Notification Types
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
  link?: string;
}

// Mock data removed

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      currentUser: null,
      stats: {
        totalCustomers: 0,
        totalVendors: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingApprovals: 0,
      },
      chartData: [],
      pendingVendors: [],
      activeVendors: [],
      recentBookings: [],
      allBookings: [],
      payouts: [],
      users: [],
      commissionRate: 10,
      notifications: [],
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response: any = await apiClient.post("/auth/login", {
            email,
            password,
          });

          if (response.user.role !== "ADMIN") {
            throw new Error("Unauthorized access. Admin role required.");
          }

          set({
            isAuthenticated: true,
            token: response.token,
            currentUser: {
              id: response.user._id,
              name: response.user.name,
              email: response.user.email,
              role: response.user.role,
              avatar: response.user.avatar || "https://github.com/shadcn.png",
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || "Login failed",
            isLoading: false,
            isAuthenticated: false,
            token: null,
          });
          throw error;
        }
      },

      logout: () =>
        set({ isAuthenticated: false, token: null, currentUser: null }),

      fetchStats: async () => {
        set({ isLoading: true });
        try {
          const response: any = await apiClient.get("/admin/stats");
          set({
            stats: response.stats,
            chartData: response.chartData || [],
            recentBookings: response.recentBookings || [],
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast.error("Failed to fetch dashboard stats");
        }
      },

      fetchVendors: async () => {
        set({ isLoading: true });
        try {
          const response: any = await apiClient.get("/admin/vendors");
          const vendors = response; // Handle if wrapped or array

          // Map backend vendors to AdminVendorListItem
          const mappedVendors: AdminVendorListItem[] = vendors.map(
            (v: any) => ({
              id: v._id,
              businessName:
                v.vendorProfile?.businessName || v.salon?.name || "N/A",
              ownerName: v.vendorProfile?.ownerName || v.name || "N/A",
              type: v.type || "salon",
              location: v.vendorProfile
                ? `${v.vendorProfile.address}, ${v.vendorProfile.city}, ${v.vendorProfile.state} - ${v.vendorProfile.pincode}`
                : v.salon?.location || "N/A",
              phone: v.phone || "N/A",
              email: v.vendorProfile?.email || v.email || "N/A",
              verificationDocuments:
                v.vendorProfile?.verificationDocuments ||
                v.verificationDocuments ||
                [],
              status: v.vendorProfile?.status || v.status,
              joinedDate:
                v.createdAt?.split("T")[0] ||
                new Date().toISOString().split("T")[0],
              documentsVerified:
                v.vendorProfile?.isVerified || v.isVerified || false,
            })
          );

          set({
            pendingVendors: mappedVendors.filter((v) => v.status === "pending"),
            activeVendors: mappedVendors.filter((v) => v.status === "active"),
            stats: {
              ...get().stats,
              pendingApprovals: mappedVendors.filter(
                (v) => v.status === "pending"
              ).length,
              totalVendors: mappedVendors.filter((v) => v.status === "active")
                .length,
            },
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast.error("Failed to fetch vendors");
        }
      },

      verifyDocument: async (
        vendorId: string,
        documentId: string,
        status: "verified" | "rejected"
      ) => {
        try {
          await apiClient.patch(`/admin/vendors/${vendorId}/verify-document`, {
            documentId,
            status,
          });
          toast.success(`Document marked as ${status}`);
          // Refresh vendor list to reflect changes
          get().fetchVendors();
        } catch (error: any) {
          toast.error(error.message || "Failed to update document status");
        }
      },

      fetchAllBookings: async (filters = {}) => {
        set({ isLoading: true });
        try {
          const params = new URLSearchParams(filters).toString();
          const response: any = await apiClient.get(
            `/admin/bookings?${params}`
          );
          set({
            allBookings: response,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast.error("Failed to fetch bookings");
        }
      },

      getUserHistory: async (userId: string) => {
        try {
          const response: any = await apiClient.get(
            `/admin/bookings?user=${userId}`
          );
          return response;
        } catch (error: any) {
          toast.error("Failed to fetch user history");
          return [];
        }
      },

      fetchPayouts: async () => {
        set({ isLoading: true });
        try {
          const response: any = await apiClient.get("/admin/payouts");
          set({
            payouts: response,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast.error("Failed to fetch payouts");
        }
      },

      fetchUsers: async () => {
        set({ isLoading: true });
        try {
          // FIX: Changed from /admin/users to /admin/customers as per backend routes
          const response: any = await apiClient.get("/admin/customers");
          const mappedUsers = response.map((user: any) => ({
            ...user,
            name: user.profile?.name || user.name || "Anonymous",
            email: user.profile?.email || user.email || "",
            address:
              (user.savedAddress
                ? `${user.savedAddress.addressLine1}, ${user.savedAddress.city}`
                : "") ||
              user.profile?.address ||
              "No address",
          }));

          set({
            users: mappedUsers,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast.error("Failed to fetch users");
        }
      },

      fetchCommissionRate: async () => {
        try {
          const response: any = await apiClient.get("/admin/settings/commission");
          set({ commissionRate: response.commissionRate });
        } catch (error: any) {
          toast.error("Failed to fetch commission rate");
        }
      },

      updateCommissionRate: async (rate: number) => {
        try {
          const response: any = await apiClient.post("/admin/settings/commission", {
            commissionRate: rate,
          });
          set({ commissionRate: response.commissionRate });
          toast.success("Commission rate updated");
        } catch (error: any) {
          toast.error("Failed to update commission rate");
        }
      },

      processPayout: async (payoutId, data) => {
        try {
          await apiClient.patch(`/admin/payouts/${payoutId}`, data);
          toast.success("Payout processed successfully");
          get().fetchPayouts();
          get().fetchStats();
        } catch (error: any) {
          toast.error("Failed to process payout");
        }
      },

      selectedVendor: null,

      fetchVendorDetails: async (id: string) => {
        set({ isLoading: true });
        try {
          const response: any = await apiClient.get(`/admin/vendors/${id}`);
          const vendor = {
            id: response._id,
            businessName:
              response.vendorProfile?.businessName ||
              response.salon?.name ||
              "N/A",
            ownerName:
              response.vendorProfile?.ownerName || response.name || "N/A",
            type: response.salon?.type || "salon",
            location: response.vendorProfile
              ? `${response.vendorProfile.address}, ${response.vendorProfile.city}, ${response.vendorProfile.state} - ${response.vendorProfile.pincode}`
              : response.salon?.location || "N/A",
            phone: response.phone || "N/A",
            email: response.vendorProfile?.email || response.email || "N/A",
            verificationDocuments:
              response.vendorProfile?.verificationDocuments ||
              response.verificationDocuments ||
              [],
            status:
              response.vendorProfile?.status || response.status || "pending",
            joinedDate:
              response.createdAt?.split("T")[0] ||
              new Date().toISOString().split("T")[0],
            documentsVerified:
              response.vendorProfile?.isVerified ||
              response.isVerified ||
              false,
            stats: response.stats, // Contains real data from backend
            services: response.services || [],
            packages: response.packages || [],
            recentBookings: response.recentBookings || [],
            payouts: response.payouts || [],
          };
          set({ selectedVendor: vendor, isLoading: false, error: null });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          toast.error("Failed to fetch vendor details");
        }
      },

      approveVendor: async (vendorId) => {
        try {
          await apiClient.patch(`/admin/vendors/${vendorId}/status`, {
            status: "active",
            isVerified: true,
          });

          toast.success("Vendor approved successfully");
          // Refresh data
          get().fetchVendors();
          get().fetchStats();
        } catch (error: any) {
          toast.error("Failed to approve vendor");
        }
      },

      rejectVendor: async (vendorId) => {
        try {
          await apiClient.patch(`/admin/vendors/${vendorId}/status`, {
            status: "rejected",
            isVerified: false,
          });

          toast.success("Vendor rejected");
          // Refresh data
          get().fetchVendors();
          get().fetchStats();
        } catch (error: any) {
          toast.error("Failed to reject vendor");
        }
      },

      fetchNotifications: async () => {
        try {
          const response: any = await apiClient.get("/admin/notifications");
          set({ notifications: response });
        } catch (error) {
          console.error("Failed to fetch notifications");
        }
      },

      markAsRead: async (id) => {
        try {
          // Optimistic update
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
          }));
          await apiClient.patch(`/admin/notifications/${id}/read`, {});
        } catch (error) {
          console.error("Failed to mark as read");
        }
      },

      markAllAsRead: async () => {
        try {
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
          }));
          await apiClient.patch("/admin/notifications/read-all", {});
        } catch (error) {
          console.error("Failed to mark all as read");
        }
      },

      deleteNotification: async (id) => {
        try {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
          await apiClient.delete(`/admin/notifications/${id}`);
        } catch (error) {
          console.error("Failed to delete notification");
          get().fetchNotifications();
        }
      },

      clearNotifications: async () => {
        try {
          set({ notifications: [] });
          await apiClient.delete("/admin/notifications/clear-all");
        } catch (error) {
          console.error("Failed to clear notifications");
          get().fetchNotifications();
        }
      },

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      addCustomer: async (data) => {
        set({ isLoading: true });
        try {
          await apiClient.post("/admin/customers", data);
          toast.success("Customer added successfully");
          await get().fetchUsers();
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || "Failed to add customer");
          throw error;
        }
      },

      addVendor: async (data) => {
        set({ isLoading: true });
        try {
          await apiClient.post("/admin/vendors", data);
          toast.success("Vendor added successfully");
          await get().fetchVendors();
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.message || "Failed to add vendor");
          throw error;
        }
      },
    }),
    {
      name: "admin-storage-v2", // Versioned to invalidate stale cache
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        commissionRate: state.commissionRate,
      }),
    }
  )
);
