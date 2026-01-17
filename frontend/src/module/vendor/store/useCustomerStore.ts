import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../../user/services/apiClient";

export interface Customer {
  id: string;
  _id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  address?: string;
  status: "active" | "inactive" | "vip";
  notes?: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string | null;
  averageOrderValue?: number;
  preferredServices?: string[];
  bookings?: any[];
}

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchCustomers: () => Promise<void>;
  fetchCustomerDetail: (id: string) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  clearError: () => void;
  resetSelectedCustomer: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: [],
      selectedCustomer: null,
      loading: false,
      error: null,

      clearError: () => set({ error: null }),
      resetSelectedCustomer: () => set({ selectedCustomer: null }),

      fetchCustomers: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get<Customer[]>("/vendor/customers");
          set({ customers: response, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      fetchCustomerDetail: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get<Customer>(`/vendor/customers/${id}`);
          set({ selectedCustomer: response, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      updateCustomer: async (id: string, updates: Partial<Customer>) => {
        set({ loading: true, error: null });
        try {
          await api.patch(`/vendor/customers/${id}`, updates);

          // Refresh local state
          const { selectedCustomer, customers } = get();

          if (selectedCustomer && (selectedCustomer.id === id || selectedCustomer._id === id)) {
            set({ selectedCustomer: { ...selectedCustomer, ...updates } });
          }

          set({
            customers: customers.map((c) =>
              c.id === id || c._id === id ? { ...c, ...updates } : c
            ),
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
    }),
    {
      name: "vendor-customer-storage",
      partialize: (state) => ({
        customers: state.customers
      }),
    }
  )
);
