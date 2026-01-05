import { create } from "zustand";

interface UserState {
  name: string;
  location: string;
  points: number;
  cartCount: number;
  notificationsCount: number;
  currentPage: string;
  isLoggedIn: boolean;
  userPhone: string;
  setName: (name: string) => void;
  setLocation: (location: string) => void;
  setCurrentPage: (page: string) => void;
  setCartCount: (count: number) => void;
  setNotificationsCount: (count: number) => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
  setUserPhone: (phone: string) => void;
  login: (phone: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: "User",
  location: "New Palasia",
  points: 1000,
  cartCount: 0,
  notificationsCount: 0,
  currentPage: "home",
  isLoggedIn: true, // Default to true for demo, should be false
  userPhone: "+91 9876543210",
  setName: (name) => set({ name }),
  setLocation: (location) => set({ location }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setCartCount: (count) => set({ cartCount: count }),
  setNotificationsCount: (count) => set({ notificationsCount: count }),
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setUserPhone: (userPhone) => set({ userPhone }),
  login: (phone) => set({ isLoggedIn: true, userPhone: phone }),
  logout: () => set({ isLoggedIn: false, name: "", userPhone: "" }),
}));
