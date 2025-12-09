import { create } from "zustand";

export interface Booking {
  id: string;
  salonName: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'missed';
  type: 'at-salon' | 'at-home';
}

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  addBookings: (bookings: Omit<Booking, 'id'>[]) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  getBookings: () => Booking[];
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  
  addBooking: (booking) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    set({
      bookings: [...get().bookings, newBooking],
    });
  },
  
  addBookings: (bookings) => {
    const newBookings: Booking[] = bookings.map((booking) => ({
      ...booking,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }));
    set({
      bookings: [...get().bookings, ...newBookings],
    });
  },
  
  updateBookingStatus: (id, status) => {
    set({
      bookings: get().bookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      ),
    });
  },
  
  getBookings: () => {
    return get().bookings;
  },
}));

