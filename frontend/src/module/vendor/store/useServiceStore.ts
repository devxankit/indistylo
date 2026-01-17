import { create } from "zustand";
import { api } from "../../user/services/apiClient";

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  gender?: string;
  price: number;
  duration: number; // in minutes
  description: string;
  isActive: boolean;
  rating?: number;
  bookings?: number;
  image?: string;
  pricingTiers?: PricingTier[];
  tags?: string[];
  type?: "at-salon" | "at-home" | "spa";
}

interface ServiceState {
  services: Service[];
  categories: any[];
  categoryTree: { headerName: string; subcategories: any[] }[]; // Add categoryTree
  loading: boolean;
  fetchServices: () => Promise<void>;
  fetchCategories: (gender: string, type?: string) => Promise<void>; // Add fetchCategories
  fetchPublicContent: () => Promise<void>;
  addService: (service: any) => Promise<void>;
  updateService: (id: string, service: any) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
  getService: (id: string) => Service | undefined;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  loading: false,

  categories: [],
  categoryTree: [],

  fetchCategories: async (gender, type = "SALON") => {
    try {
      // Use the public endpoint that returns headers grouped with subcategories
      const response: any = await api.get(
        `/admin/public/categories/subcategories?gender=${gender.toUpperCase()}&type=${type.toUpperCase()}`
      );
      set({ categoryTree: response });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      set({ categoryTree: [] });
    }
  },

  fetchPublicContent: async () => {
    try {
      const response: any = await api.get("/admin/content");
      // admin public content returns categories and other info
      // based on admin.controller.ts getPublicContent structure

      const content = response.content || response; // Handle potentially unwrapped response

      set({
        categories: content.categories || [],
      });
    } catch (error) {
      console.error("Failed to fetch public content:", error);
    }
  },

  fetchServices: async () => {
    set({ loading: true });
    try {
      const response: any = await api.get("/vendor/services");
      set({ services: response, loading: false });
    } catch (error) {
      console.error("Failed to fetch services:", error);
      set({ loading: false });
    }
  },

  addService: async (serviceData) => {
    try {
      const response: any = await api.post("/vendor/services", serviceData);
      set((state) => ({
        services: [...state.services, response],
      }));
    } catch (error) {
      console.error("Failed to add service:", error);
      throw error;
    }
  },

  updateService: async (id, updates) => {
    try {
      const response: any = await api.put(`/vendor/services/${id}`, updates);
      set((state) => ({
        services: state.services.map((service) =>
          service._id === id ? response : service
        ),
      }));
    } catch (error) {
      console.error("Failed to update service:", error);
      throw error;
    }
  },

  deleteService: async (id) => {
    try {
      await api.delete(`/vendor/services/${id}`);
      set((state) => ({
        services: state.services.filter((service) => service._id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete service:", error);
      throw error;
    }
  },

  toggleActive: async (id) => {
    const service = get().services.find((s) => s._id === id);
    if (service) {
      await get().updateService(id, { isActive: !service.isActive });
    }
  },

  getService: (id) => {
    return get().services.find((service) => service._id === id);
  },
}));
