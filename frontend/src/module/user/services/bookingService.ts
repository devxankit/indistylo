
import type { Booking } from "./types";
import { mockBookings } from "./mockData";

export const bookingService = {
  /**
   * Fetch all bookings for the current user
   */
  async getBookings(): Promise<Booking[]> {
    try {
      // In a real app, this would be:
      // const response = await api.get<Booking[]>('/bookings');
      // return response;

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockBookings;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    try {
      // await api.post(`/bookings/${bookingId}/cancel`, {});
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Booking ${bookingId} cancelled`);
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
      // await api.post(`/bookings/${bookingId}/reschedule`, { date: newDate, time: newTime });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(
        `Booking ${bookingId} rescheduled to ${newDate} at ${newTime}`
      );
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
      // await api.post(`/bookings/${bookingId}/review`, review);
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Review submitted for booking ${bookingId}:`, review);
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  },
};
