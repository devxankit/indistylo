import { create } from "zustand";
import { api } from "../services/apiClient";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  highlights: string[];
  category: string;
  gender: "male" | "female" | "unisex";
  type: "at-salon" | "at-home";
  image?: string;
  isActive: boolean;
  salon: {
    _id: string;
    name: string;
    location: string;
    rating: number;
    geo: {
      type: string;
      coordinates: [number, number];
    };
    images: string[];
  };
}

interface ServiceState {
  services: Service[];
  loading: boolean;
  error: string | null;
  fetchServices: (filters?: any) => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  loading: false,
  error: null,

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
}));
