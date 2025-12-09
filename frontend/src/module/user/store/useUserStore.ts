import { create } from "zustand";

interface UserState {
  name: string;
  location: string;
  points: number;
  cartCount: number;
  notificationsCount: number;
  currentPage: string;
  setName: (name: string) => void;
  setLocation: (location: string) => void;
  setCurrentPage: (page: string) => void;
  setCartCount: (count: number) => void;
  setNotificationsCount: (count: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: "User",
  location: "New Palasia",
  points: 1000,
  cartCount: 0,
  notificationsCount: 0,
  currentPage: "home",
  setName: (name) => set({ name }),
  setLocation: (location) => set({ location }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setCartCount: (count) => set({ cartCount: count }),
  setNotificationsCount: (count) => set({ notificationsCount: count }),
}));
