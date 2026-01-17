import { create } from "zustand";
import { api } from "../services/apiClient";
import type { Salon } from "../services/types";

interface SalonState {
  salons: Salon[];
  currentSalon: Salon | null;
  services: any[];
  staff: any[];
  loading: boolean;
  error: string | null;
  fetchSalons: (filters?: any) => Promise<void>;
  fetchSalonById: (id: string) => Promise<void>;
  fetchServices: (filters?: any) => Promise<void>;
  fetchStaff: (salonId: string) => Promise<any[]>;
  fetchSchedule: (salonId: string) => Promise<any[]>;
}

export const useSalonStore = create<SalonState>((set) => ({
  salons: [],
  currentSalon: null,
  services: [],
  staff: [],
  loading: false,
  error: null,

  fetchSalons: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams(filters).toString();
      const response: any = await api.get(`/services/salons?${params}`);
      set({ salons: response, loading: false });
    } catch (error: any) {
      console.error("Failed to fetch salons:", error);
      set({ error: error.message || "Failed to fetch salons", loading: false });
    }
  },

  fetchSalonById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.get(`/services/salon/${id}`);
      set({ currentSalon: response, loading: false });
    } catch (error: any) {
      console.error("Failed to fetch salon details:", error);
      set({
        error: error.message || "Failed to fetch salon details",
        loading: false,
      });
    }
  },

  fetchServices: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams(filters).toString();
      const response: any = await api.get(`/services?${params}`);
      set({ services: response, loading: false });
    } catch (error: any) {
      console.error("Failed to fetch services:", error);
      set({
        error: error.message || "Failed to fetch services",
        loading: false,
      });
    }
  },

  fetchStaff: async (salonId) => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.get(`/services/salon/${salonId}/staff`);
      set({ staff: response, loading: false });
      return response;
    } catch (error: any) {
      console.error("Failed to fetch staff:", error);
      set({
        error: error.message || "Failed to fetch staff",
        loading: false,
      });
      return [];
    }
  },
  fetchSchedule: async (salonId) => {
    try {
      const response: any = await api.get(`/services/salon/${salonId}/schedule`);
      return response;
    } catch (error: any) {
      console.error("Failed to fetch schedule:", error);
      return [];
    }
  },
}));
