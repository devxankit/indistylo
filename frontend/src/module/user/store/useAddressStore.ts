import { create } from "zustand";
import { api } from "../services/apiClient";

export interface Address {
  _id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  label?: string; // Home, Work, etc.
  isDefault?: boolean;
  geo?: {
    type: string;
    coordinates: number[];
  };
}

interface AddressState {
  addresses: Address[];
  loading: boolean;
  selectedAddressId: string | null;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, "_id">) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setSelectedAddress: (id: string | null) => void;
  setDefaultAddress: (id: string) => Promise<void>;
  getSelectedAddress: () => Address | null;
  getDefaultAddress: () => Address | null;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  loading: false,
  selectedAddressId: null,

  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const response: any = await api.get("/user/addresses");
      set({ addresses: response, loading: false });

      // Set default selected address if none selected
      if (!get().selectedAddressId && response.length > 0) {
        const defaultAddr =
          response.find((a: Address) => a.isDefault) || response[0];
        set({ selectedAddressId: defaultAddr._id });
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      set({ loading: false });
    }
  },

  addAddress: async (address) => {
    try {
      const response: any = await api.post("/user/addresses", address);
      set((state) => ({
        addresses: [...state.addresses, response],
        selectedAddressId: response.isDefault
          ? response._id
          : state.selectedAddressId,
      }));
    } catch (error) {
      console.error("Failed to add address:", error);
      throw error;
    }
  },

  updateAddress: async (id, updates) => {
    try {
      const response: any = await api.put(`/user/addresses/${id}`, updates);
      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr._id === id ? response : addr
        ),
      }));
    } catch (error) {
      console.error("Failed to update address:", error);
      throw error;
    }
  },

  deleteAddress: async (id) => {
    try {
      await api.delete(`/user/addresses/${id}`);
      set((state) => ({
        addresses: state.addresses.filter((addr) => addr._id !== id),
        selectedAddressId:
          state.selectedAddressId === id ? null : state.selectedAddressId,
      }));
    } catch (error) {
      console.error("Failed to delete address:", error);
      throw error;
    }
  },

  setSelectedAddress: (id) => {
    set({ selectedAddressId: id });
  },

  setDefaultAddress: async (id) => {
    try {
      await api.patch(`/user/addresses/${id}/default`, {});
      set((state) => ({
        addresses: state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === id,
        })),
      }));
    } catch (error) {
      console.error("Failed to set default address:", error);
      throw error;
    }
  },

  getSelectedAddress: () => {
    const { addresses, selectedAddressId } = get();
    return addresses.find((addr) => addr._id === selectedAddressId) || null;
  },

  getDefaultAddress: () => {
    return get().addresses.find((addr) => addr.isDefault) || null;
  },
}));
