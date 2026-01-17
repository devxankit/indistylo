import { create } from "zustand";
import { api } from "../services/apiClient";

export interface Booking {
  _id: string;
  user: any;
  salon: any;
  service: any;
  professional?: any;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled" | "missed";
  type: "at-salon" | "at-home";
  price: number;
  paymentStatus: "pending" | "paid" | "failed";
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: any;
  salon: any;
  service: any;
  booking: any;
  rating: number;
  comment: string;
  images: string[];
  reply?: {
    text: string;
    createdAt: string;
  };
  createdAt: string;
}

interface BookingState {
  bookings: Booking[];
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  fetchUserReviews: () => Promise<void>;
  submitReview: (bookingId: string, reviewData: any) => Promise<void>;
  rescheduleBooking: (
    bookingId: string,
    date: string,
    time: string
  ) => Promise<void>;
  createBooking: (bookingData: any) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;
  createRazorpayOrder: (bookingId: string) => Promise<any>;
  verifyPayment: (paymentData: any) => Promise<void>;
  payWithWallet: (bookingId: string) => Promise<void>;
  payForBooking: (bookingId: string, paymentData: any) => Promise<void>;
  createOrder: (orderData: any) => Promise<any>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  reviews: [],
  loading: false,
  error: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.get("/bookings");
      set({ bookings: response, loading: false });
    } catch (error: any) {
      console.error("Failed to fetch bookings:", error);
      set({
        error: error.message || "Failed to fetch bookings",
        loading: false,
      });
    }
  },

  fetchUserReviews: async () => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.get("/bookings/reviews/user");
      set({ reviews: response, loading: false });
    } catch (error: any) {
      console.error("Failed to fetch user reviews:", error);
      set({
        error: error.message || "Failed to fetch user reviews",
        loading: false,
      });
    }
  },

  submitReview: async (bookingId, reviewData) => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.post(
        `/bookings/${bookingId}/review`,
        reviewData
      );
      set((state) => ({
        reviews: [response, ...state.reviews],
        loading: false,
      }));
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      set({
        error: error.message || "Failed to submit review",
        loading: false,
      });
      throw error;
    }
  },

  rescheduleBooking: async (bookingId, date, time) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/bookings/${bookingId}`, {
        date,
        time,
      });
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === bookingId ? { ...b, date, time } : b
        ),
        loading: false,
      }));
    } catch (error: any) {
      console.error("Failed to reschedule booking:", error);
      set({
        error: error.message || "Failed to reschedule booking",
        loading: false,
      });
      throw error;
    }
  },

  createBooking: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.post("/bookings", bookingData);
      set((state) => ({
        bookings: [response, ...state.bookings],
        loading: false,
      }));
      return response;
    } catch (error: any) {
      console.error("Failed to create booking:", error);
      set({
        error: error.message || "Failed to create booking",
        loading: false,
      });
      throw error;
    }
  },

  cancelBooking: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/bookings/${bookingId}/cancel`, {});
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        ),
        loading: false,
      }));
    } catch (error: any) {
      console.error("Failed to cancel booking:", error);
      set({
        error: error.message || "Failed to cancel booking",
        loading: false,
      });
      throw error;
    }
  },

  createRazorpayOrder: async (bookingId) => {
    try {
      return await api.post(`/bookings/${bookingId}/create-razorpay-order`, {});
    } catch (error) {
      console.error("Failed to create Razorpay order:", error);
      throw error;
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      await api.post("/user/orders/verify-payment", paymentData);
      await get().fetchBookings();
    } catch (error) {
      console.error("Failed to verify payment:", error);
      throw error;
    }
  },

  payWithWallet: async (bookingId) => {
    try {
      await api.post(`/bookings/${bookingId}/pay-wallet`, {});
      await get().fetchBookings();
    } catch (error) {
      console.error("Failed to pay with wallet:", error);
      throw error;
    }
  },

  payForBooking: async (bookingId, paymentData) => {
    try {
      await api.post(`/bookings/${bookingId}/pay`, paymentData);
      await get().fetchBookings();
    } catch (error) {
      console.error("Failed to pay for booking:", error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.post("/user/orders", orderData);
      set((state) => ({
        bookings: [...state.bookings, ...(response.order?.bookings || [])],
        loading: false,
      }));
      return response;
    } catch (error: any) {
      console.error("Failed to create order:", error);
      set({
        error: error.message || "Failed to create order",
        loading: false,
      });
      throw error;
    }
  },
}));
