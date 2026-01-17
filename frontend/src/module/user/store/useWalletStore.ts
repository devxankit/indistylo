import { create } from "zustand";
import { api } from "../services/apiClient";

export interface WalletTransaction {
    _id: string;
    amount: number;
    type: "credit" | "debit";
    description: string;
    createdAt: string;
    status: "success" | "pending" | "failed";
}

interface WalletState {
    balance: number;
    transactions: WalletTransaction[];
    loading: boolean;
    error: string | null;
    fetchBalance: () => Promise<void>;
    fetchTransactions: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
    balance: 0,
    transactions: [],
    loading: false,
    error: null,

    fetchBalance: async () => {
        set({ loading: true, error: null });
        try {
            const response: any = await api.get("/user/wallet/balance");
            // Assuming response is { balance: number }
            set({ balance: response.balance || 0, loading: false });
        } catch (error: any) {
            console.error("Failed to fetch wallet balance:", error);
            set({
                error: error.message || "Failed to fetch wallet balance",
                loading: false,
            });
        }
    },

    fetchTransactions: async () => {
        set({ loading: true, error: null });
        try {
            const response: any = await api.get("/user/wallet/transactions");
            // Assuming response is WalletTransaction[]
            set({ transactions: response, loading: false });
        } catch (error: any) {
            console.error("Failed to fetch wallet transactions:", error);
            set({
                error: error.message || "Failed to fetch wallet transactions",
                loading: false,
            });
        }
    },
}));
