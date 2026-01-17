import { create } from "zustand";
import { api } from "../../user/services/apiClient";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "upcoming"
  | "missed";

export interface Booking {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceName: string;
  date: string;
  time: string;
  status: BookingStatus;
  amount: number;
  duration: string;
  notes?: string;
  address?: string;
  paymentMethod: string;
  type: "at-salon" | "at-home";
  professionalName?: string;
  geo?: {
    type: string;
    coordinates: number[];
  };
}

interface VendorBookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
}

export const useVendorBookingStore = create<VendorBookingState>((set) => ({
  bookings: [],
  loading: false,
  error: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.get("/vendor/bookings");
      // Map backend data to frontend model
      const formattedBookings = response.map((b: any) => ({
        _id: b._id,
        customerName: b.user?.name || "Guest",
        customerPhone: b.user?.phone || "",
        customerEmail: b.user?.email || "",
        serviceName: b.service?.name || b.package?.name || "Unknown Service",
        date: new Date(b.date).toISOString().split("T")[0],
        time: b.timeSlot || b.time || "",
        status: b.status,
        amount: b.price || b.totalPrice || b.amount || 0,
        duration: b.service?.duration || b.package?.duration || "30 min",
        notes: b.notes || "",
        address: b.address || "",
        paymentMethod: b.paymentMethod || "online",
        type: b.type || "at-salon",
        professionalName: b.professional?.name || "Any Professional",
        geo: b.geo,
      }));
      set({ bookings: formattedBookings, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch bookings",
        loading: false,
      });
    }
  },

  updateBookingStatus: async (id: string, status: BookingStatus) => {
    try {
      await api.patch(`/vendor/bookings/${id}`, { status });
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === id ? { ...b, status } : b
        ),
      }));
    } catch (error: any) {
      console.error("Failed to update booking status:", error);
      throw error;
    }
  },
}));
