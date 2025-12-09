import { create } from "zustand";

interface VendorState {
  name: string;
  setName: (name: string) => void;
}

export const useVendorStore = create<VendorState>((set) => ({
  name: "",
  setName: (name) => set({ name }),
}));
