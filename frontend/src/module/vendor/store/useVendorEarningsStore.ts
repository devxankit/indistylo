import { create } from "zustand";
import { api } from "../../user/services/apiClient";

interface PayoutHistory {
  _id: string;
  amount: number;
  status: "pending" | "processed" | "rejected";
  createdAt: string;
}

interface VendorEarningsState {
  totalEarnings: number;
  totalWithdrawn: number;
  totalPending: number;
  availableBalance: number;
  commissionRate: number;
  payoutHistory: PayoutHistory[];
  loading: boolean;
  error: string | null;
  fetchEarnings: () => Promise<void>;
  requestPayout: (amount: number) => Promise<void>;
}

export const useVendorEarningsStore = create<VendorEarningsState>((set) => ({
  totalEarnings: 0,
  totalWithdrawn: 0,
  totalPending: 0,
  availableBalance: 0,
  commissionRate: 10,
  payoutHistory: [],
  loading: false,
  error: null,

  fetchEarnings: async () => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.get("/vendor/earnings");
      set({
        totalEarnings: response.totalEarnings || 0,
        totalWithdrawn: response.totalWithdrawn || 0,
        totalPending: response.totalPending || 0,
        availableBalance: response.availableBalance || 0,
        commissionRate: response.commissionRate || 10,
        payoutHistory: response.payouts || [],
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch earnings",
        loading: false,
      });
    }
  },

  requestPayout: async (amount: number) => {
    set({ loading: true, error: null });
    try {
      await api.post("/vendor/earnings/payouts", { amount });
      // Refresh earnings after payout request
      const response: any = await api.get("/vendor/earnings");
      set({
        totalEarnings: response.totalEarnings || 0,
        totalWithdrawn: response.totalWithdrawn || 0,
        totalPending: response.totalPending || 0,
        availableBalance: response.availableBalance || 0,
        commissionRate: response.commissionRate || 10,
        payoutHistory: response.payouts || [],
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to request payout",
        loading: false,
      });
      throw error;
    }
  },
}));
