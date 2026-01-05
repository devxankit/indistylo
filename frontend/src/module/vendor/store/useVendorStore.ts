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
  status: 'pending' | 'active' | 'rejected' | 'suspended';
  profileImage?: string;
  galleryImages: string[];
  setVendorType: (type: VendorType | null) => void;
  setPhoneNumber: (phone: string) => void;
  setAuthenticated: (auth: boolean) => void;
  setProfile: (profile: Partial<VendorState>) => void;
  setStatus: (status: VendorState['status']) => void;
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
  status: 'pending' as const,
  profileImage: "",
  galleryImages: [],
};

export const useVendorStore = create<VendorState>((set) => ({
  ...initialState,
  setVendorType: (type) => set({ vendorType: type }),
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setProfile: (profile) => set((state) => ({ ...state, ...profile })),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));
