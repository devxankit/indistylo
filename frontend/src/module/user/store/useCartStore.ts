import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AtHomeServicePackage } from "../services/types";

export interface CartItem extends AtHomeServicePackage {
  quantity: number;
  category?: "male" | "female";
  salonId?: string;
  salonName?: string;
  type?: "at-home" | "at-salon" | "spa";
  professionalId?: string;
  professionalName?: string;
  itemType?: "service" | "package";
}

interface CartState {
  items: CartItem[];
  addItem: (
    item: AtHomeServicePackage,
    quantity: number,
    category?: "male" | "female",
    salonId?: string,
    salonName?: string,
    type?: "at-home" | "at-salon" | "spa",
    professionalId?: string,
    professionalName?: string,
    itemType?: "service" | "package"
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemTotal: () => number;
  getConvenienceFee: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (
        item,
        quantity,
        category = "male",
        salonId,
        salonName = "Home Service",
        type = "at-home",
        professionalId,
        professionalName,
        itemType = "service"
      ) => {
        const itemId = item._id || item.id;
        const existingItem = get().items.find(
          (i) => (i._id || i.id) === itemId && i.professionalId === professionalId
        );
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              (i._id || i.id) === itemId && i.professionalId === professionalId
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
                salonId,
                salonName,
                type,
                professionalId,
                professionalName,
                itemType,
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
              (item._id || item.id) === itemId ? { ...item, quantity } : item
            ),
          });
        }
      },

      removeItem: (itemId) => {
        set({
          items: get().items.filter((item) => (item._id || item.id) !== itemId),
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
    }),
    {
      name: "cart-storage", // unique name
      // getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
