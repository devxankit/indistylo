import { create } from "zustand";
import { api } from "../services/apiClient";

export type ServicePreference = "at-home" | "at-salon";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "vendor" | "admin";
  membershipId?: string;
  avatarUrl?: string | null;
  servicePreference?: ServicePreference;
  walletBalance?: number;
  referralCode?: string;
}

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateServicePreference: (preference: ServicePreference) => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.get("/auth/me");
      // Map backend 'avatar' to frontend 'avatarUrl' if needed, or just use response
      // Backend returns: _id, name, email, phone, role, avatar, location
      const profileData = {
        ...response,
        avatarUrl: response.avatar || response.avatarUrl,
      };
      set({ profile: profileData, loading: false });
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      set({ error: error.message || "Failed to fetch profile", loading: false });
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.put("/user/profile", updates);
      set({ profile: response, loading: false });
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      set({ error: error.message || "Failed to update profile", loading: false });
      throw error;
    }
  },

  updateServicePreference: async (preference) => {
    try {
      await get().updateProfile({ servicePreference: preference });
    } catch (error) {
      console.error("Failed to update service preference:", error);
    }
  },

  updateAvatar: async (avatarUrl) => {
    try {
      await get().updateProfile({ avatarUrl });
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
  },
}));

