import { api } from "./apiClient";
import type { Booking } from "./types";

export const bookingService = {
  /**
   * Fetch all bookings for the current user
   */
  async getBookings(): Promise<Booking[]> {
    try {
      const response: any = await api.get("/bookings");
      return response;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  /**
   * Create a new order (multiple bookings)
   */
  async createOrder(orderData: any): Promise<any> {
    try {
      const response = await api.post("/user/orders", orderData);
      return response;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`, {});
    } catch (error) {
      console.error("Error cancelling booking:", error);
      throw error;
    }
  },

  /**
   * Reschedule a booking
   */
  async rescheduleBooking(
    bookingId: string,
    newDate: string,
    newTime: string
  ): Promise<void> {
    try {
      await api.patch(`/bookings/${bookingId}`, {
        bookingDate: newDate,
        bookingTime: newTime,
      });
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      throw error;
    }
  },

  /**
   * Submit a review for a booking
   */
  async submitReview(
    bookingId: string,
    review: { rating: number; comment: string }
  ): Promise<void> {
    try {
      await api.post(`/bookings/${bookingId}/review`, review);
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  },
};
