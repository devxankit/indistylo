import { api } from "./apiClient";

export const authService = {
  sendOTP: async (phone: string) => {
    return api.post("/auth/send-otp", { phone });
  },

  verifyOTP: async (phone: string, otp: string, role?: string) => {
    return api.post("/auth/verify-otp", { phone, otp, role });
  },

  getProfile: async () => {
    return api.get("/user/profile");
  },

  updateProfile: async (data: any) => {
    return api.put("/user/profile", data);
  },
};
