import { create } from "zustand";
import type { AtHomeServicePackage } from "../services/types";

export interface CartItem extends AtHomeServicePackage {
  quantity: number;
  category?: "male" | "female";
  salonName?: string;
  type?: "at-home" | "at-salon";
  professionalId?: string;
  professionalName?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (
    item: AtHomeServicePackage,
    quantity: number,
    category?: "male" | "female",
    salonName?: string,
    type?: "at-home" | "at-salon",
    professionalId?: string,
    professionalName?: string
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemTotal: () => number;
  getConvenienceFee: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (
    item,
    quantity,
    category = "male",
    salonName = "Home Service",
    type = "at-home",
    professionalId,
    professionalName
  ) => {
    const existingItem = get().items.find(
      (i) => i.id === item.id && i.professionalId === professionalId
    );
    if (existingItem) {
      set({
        items: get().items.map((i) =>
          i.id === item.id && i.professionalId === professionalId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ),
      });
    } else {
      set({
        items: [
          ...get().items,
          {
            ...item,
            quantity,
            category,
            salonName,
            type,
            professionalId,
            professionalName,
          },
        ],
      });
    }
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
    } else {
      set({
        items: get().items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      });
    }
  },

  removeItem: (itemId) => {
    set({
      items: get().items.filter((item) => item.id !== itemId),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getItemTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  getConvenienceFee: () => {
    return 10; // Fixed convenience fee
  },

  getTotal: () => {
    return get().getItemTotal() + get().getConvenienceFee();
  },
}));
