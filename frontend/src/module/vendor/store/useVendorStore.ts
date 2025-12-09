import { create } from "zustand";

export type VendorType = 'salon' | 'freelancer' | 'spa';

interface VendorState {
  vendorType: VendorType | null;
  phoneNumber: string;
  isAuthenticated: boolean;
  businessName: string;
  ownerName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber?: string;
  aadharNumber?: string;
  experience?: string;
  specialization?: string;
  setVendorType: (type: VendorType | null) => void;
  setPhoneNumber: (phone: string) => void;
  setAuthenticated: (auth: boolean) => void;
  setProfile: (profile: Partial<VendorState>) => void;
  reset: () => void;
}

const initialState = {
  vendorType: null,
  phoneNumber: "",
  isAuthenticated: false,
  businessName: "",
  ownerName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  gstNumber: "",
  aadharNumber: "",
  experience: "",
  specialization: "",
};

export const useVendorStore = create<VendorState>((set) => ({
  ...initialState,
  setVendorType: (type) => set({ vendorType: type }),
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setProfile: (profile) => set((state) => ({ ...state, ...profile })),
  reset: () => set(initialState),
}));
