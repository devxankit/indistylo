import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../../user/services/apiClient";

export type VendorType = "salon" | "freelancer" | "spa";

interface VendorState {
  vendorId?: string;
  vendorType: VendorType | null;
  phoneNumber: string;
  token: string | null;
  isAuthenticated: boolean;
  businessName: string;
  ownerName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  description: string;
  category: string;
  gender: "male" | "female" | "unisex";
  gstNumber?: string;
  aadharNumber?: string;
  experience?: string;
  specialization?: string;
  status: "pending" | "active" | "rejected" | "suspended";
  profileImage?: string;
  galleryImages: string[];
  geo?: { type: string; coordinates: number[] };
  rating: number;
  joinedAt: string;
  loading: boolean;
  error: string | null;

  // Actions
  setVendorType: (type: VendorType | null) => void;
  setPhoneNumber: (phone: string) => void;
  setAuthenticated: (auth: boolean) => void;
  setProfile: (profile: Partial<VendorState>) => void;
  setStatus: (status: VendorState["status"]) => void;
  reset: () => void;
  logout: () => void;

  // API Actions
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  updateProfile: (
    data?: Partial<VendorState> & { verificationDocuments?: any[] }
  ) => Promise<void>;
  uploadFile: (file: File) => Promise<string | null>;
}

const initialState = {
  vendorType: null,
  phoneNumber: "",
  token: null,
  isAuthenticated: false,
  businessName: "",
  ownerName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  description: "",
  category: "Hair",
  gender: "unisex" as const,
  gstNumber: "",
  aadharNumber: "",
  experience: "",
  specialization: "",
  status: "pending" as const,
  profileImage: "",
  galleryImages: [],
  geo: undefined,
  rating: 0,
  joinedAt: "",
  loading: false,
  error: null,
};

export const useVendorStore = create<VendorState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setVendorType: (type) => set({ vendorType: type }),
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),
      setProfile: (profile) => set((state) => ({ ...state, ...profile })),
      setStatus: (status) => set({ status }),
      reset: () => set(initialState),
      logout: () => set(initialState),

      sendOtp: async (phone: string) => {
        console.log("useVendorStore: sendOtp called with phone:", phone);
        set({ loading: true, error: null });
        try {
          const response = await api.post("/auth/send-otp", { phone });
          console.log("useVendorStore: sendOtp response:", response);
          set({ loading: false });
          return true;
        } catch (error: any) {
          console.error("useVendorStore: sendOtp error:", error);
          set({
            loading: false,
            error: error.message || "Failed to send OTP",
          });
          return false;
        }
      },

      verifyOtp: async (phone: string, otp: string) => {
        console.log(
          "useVendorStore: verifyOtp called with phone:",
          phone,
          "otp:",
          otp
        );
        set({ loading: true, error: null });
        try {
          const response: any = await api.post("/auth/verify-otp", {
            phone,
            otp,
            role: "VENDOR",
          });
          console.log("useVendorStore: verifyOtp response:", response);
          if (response && response.token) {
            const profile = response.vendorProfile || {};
            set({
              token: response.token,
              isAuthenticated: true,
              vendorId: response.user._id,
              phoneNumber: response.user.phone,
              businessName: profile.businessName || "",
              ownerName: profile.ownerName || "",
              email: profile.email || "",
              status: profile.status || "pending",
              loading: false,
            });
            return true;
          }
          set({ loading: false });
          return false;
        } catch (error: any) {
          set({
            loading: false,
            error: error.message || "Invalid OTP",
          });
          return false;
        }
      },

      fetchProfile: async () => {
        set({ loading: true });
        try {
          const response: any = await api.get("/vendor/salon");
          if (response) {
            // response might be the salon or the vendor profile depending on the endpoint
            // But usually /vendor/salon returns the salon linked to the vendor
            set({
              vendorId: response._id,
              businessName: response.name,
              ownerName: response.ownerName,
              description: response.description,
              address: response.location,
              category: response.category,
              gender: response.gender,
              status: response.status || "active",
              profileImage: response.images?.[0] || "",
              galleryImages: response.images || [],
              rating: response.rating || 0,
              joinedAt: response.createdAt || new Date().toISOString(),
              email: response.email || get().email || "",
              phoneNumber: response.phone || get().phoneNumber || "",
              vendorType: response.vendorType || get().vendorType || "salon",
              loading: false,
            });
          }
        } catch (error) {
          console.error("Failed to fetch vendor profile:", error);
          set({ loading: false });
        }
      },

      updateProfile: async (data) => {
        set({ loading: true });
        try {
          const state = get();
          const payload = {
            name: data?.businessName || state.businessName,
            description: data?.description || state.description,
            location: data?.address || state.address,
            category: data?.category || state.category,
            gender: data?.gender || state.gender,
            images: data?.galleryImages || state.galleryImages,
            ownerName: data?.ownerName || state.ownerName,
            verificationDocuments: data?.verificationDocuments,
            email: data?.email || state.email,
            address: data?.address || state.address,
            city: data?.city || state.city,
            state: data?.state || state.state,
            pincode: data?.pincode || state.pincode,
            gstNumber: data?.gstNumber || state.gstNumber,
            aadharNumber: data?.aadharNumber || state.aadharNumber,
            vendorType: data?.vendorType || state.vendorType,
            geo: data?.geo // Use data.geo if provided, otherwise let backend handle defaults or keep existing
          };

          // If profile image was updated, ensure it's in the images array
          if (data?.profileImage) {
            payload.images = [
              data.profileImage,
              ...payload.images.filter((img) => img !== data.profileImage),
            ];
          }

          const response: any = await api.post("/vendor/salon", payload);
          if (response) {
            set({
              businessName: response.name,
              description: response.description,
              address: response.location,
              category: response.category,
              gender: response.gender,
              profileImage: response.images?.[0] || "",
              galleryImages: response.images || [],
              vendorType: response.vendorType || get().vendorType || "salon",
              loading: false,
            });
          }
        } catch (error) {
          console.error("Failed to update vendor profile:", error);
          set({ loading: false });
          throw error;
        }
      },

      uploadFile: async (file: File) => {
        try {
          const { token } = get();
          const formData = new FormData();
          formData.append("image", file);
          const response: any = await api.post("/upload", formData, {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          return response.url;
        } catch (error) {
          console.error("File upload failed:", error);
          return null;
        }
      },
    }),
    {
      name: "vendor-storage",
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        vendorId: state.vendorId,
        businessName: state.businessName,
        vendorType: state.vendorType,
        status: state.status,
      }),
    }
  )
);
