import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { api } from "@/module/user/services/apiClient";
import { toast } from "sonner";

// Extended interface for featured services
// Generic featured service (not linked to a specific vendor service)
export interface FeaturedService {
  _id?: string;
  id?: string;
  name: string; // This will become the "Sub Category" name or display name
  image: string;
  gender: string;
  category: string;
  subCategory: string; // The selected subcategory
  displayName?: string; // Optional override
}

// Types for content management
export interface Banner {
  _id: string;
  id?: string;
  image: string;
  link?: string;
  active: boolean;
}

export interface Category {
  _id: string;
  id?: string;
  name: string;
  image?: string;
  subCategories: string[];
}

interface ContentState {
  banners: Banner[];
  categories: Category[];
  featuredServices: FeaturedService[];
  salonFeaturedServices: FeaturedService[];

  deals: any[];
  promoBanner: string;
  referralConfig: ReferralConfig;
  error: string | null;

  // Banner Actions
  addBanner: (banner: Omit<Banner, "_id" | "id" | "active">) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  toggleBannerActive: (id: string, currentStatus: boolean) => Promise<void>;

  // Deal Actions
  addDeal: (deal: any) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;

  // Category Actions
  addCategory: (category: Omit<Category, "_id" | "id">) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Home Page Content Actions
  addFeaturedService: (service: FeaturedService) => Promise<void>;
  removeFeaturedService: (id: string) => Promise<void>;
  setFeaturedServices: (services: FeaturedService[]) => void;

  // Salon Featured Services Actions
  addSalonFeaturedService: (service: FeaturedService) => Promise<void>;
  removeSalonFeaturedService: (id: string) => Promise<void>;
  setSalonFeaturedServices: (services: FeaturedService[]) => void;

  updatePromoBanner: (image: string) => Promise<void>;

  // Referral Actions
  updateReferralConfig: (config: Partial<ReferralConfig>) => Promise<void>;

  // Fetching
  fetchContent: () => Promise<void>;
}

export interface ReferralStep {
  id: string;
  title: string;
  description: string;
}

export interface ReferralConfig {
  steps: ReferralStep[];
  termsNote: string;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      banners: [],
      categories: [],
      featuredServices: [],
      salonFeaturedServices: [],

      deals: [],
      promoBanner: "",
      referralConfig: { steps: [], termsNote: "" },
      error: null,

      addBanner: async (banner) => {
        try {
          const payload = {
            type: "banner",
            data: {
              ...banner,
              id: `banner_${Date.now()}`,
            },
            isActive: true,
          };
          const response: any = await api.post("/admin/content", payload);
          const newBanner: Banner = {
            ...response.data,
            _id: response._id,
            active: response.isActive,
          };

          set((state) => ({
            banners: [...state.banners, newBanner],
          }));
          toast.success("Banner added successfully");
        } catch (error: any) {
          toast.error("Failed to add banner");
        }
      },

      deleteBanner: async (id) => {
        try {
          await api.delete(`/admin/content/${id}`);
          set((state) => ({
            banners: state.banners.filter((b) => b._id !== id),
          }));
          toast.success("Banner removed");
        } catch (error: any) {
          toast.error("Failed to remove banner");
        }
      },

      toggleBannerActive: async (id, currentStatus) => {
        try {
          await api.put(`/admin/content/${id}`, { isActive: !currentStatus });
          set((state) => ({
            banners: state.banners.map((b) =>
              b._id === id ? { ...b, active: !currentStatus } : b
            ),
          }));
          toast.success("Banner status updated");
        } catch (error) {
          toast.error("Failed to update status");
        }
      },

      addDeal: async (deal) => {
        try {
          const payload = {
            type: "deal",
            data: { ...deal, id: `deal_${Date.now()}` },
            isActive: true,
          };
          const response: any = await api.post("/admin/content", payload);
          const newDeal = { ...response.data, _id: response._id };
          set((state) => ({
            deals: [...state.deals, newDeal],
          }));
          toast.success("Deal added");
        } catch (error) {
          toast.error("Failed to add deal");
        }
      },

      deleteDeal: async (id) => {
        try {
          await api.delete(`/admin/content/${id}`);
          set((state) => ({
            deals: state.deals.filter((d) => d._id !== id),
          }));
          toast.success("Deal removed");
        } catch (error) {
          toast.error("Failed to remove deal");
        }
      },

      addCategory: async (category) => {
        try {
          const payload = {
            type: "category",
            data: { ...category, id: `cat_${Date.now()}` },
            isActive: true,
          };
          const response: any = await api.post("/admin/content", payload);
          const newCategory = { ...response.data, _id: response._id };
          set((state) => ({
            categories: [...state.categories, newCategory],
          }));
          toast.success("Category added");
        } catch (error) {
          toast.error("Failed to add category");
        }
      },

      updateCategory: async (id, updates) => {
        try {
          const currentCat = get().categories.find((c) => c._id === id);
          if (!currentCat) return;

          const payload = {
            data: { ...currentCat, ...updates },
          };

          await api.put(`/admin/content/${id}`, payload);

          set((state) => ({
            categories: state.categories.map((c) =>
              c._id === id ? { ...c, ...updates } : c
            ),
          }));
          toast.success("Category updated");
        } catch (error) {
          toast.error("Failed to update category");
        }
      },

      deleteCategory: async (id) => {
        try {
          await api.delete(`/admin/content/${id}`);
          set((state) => ({
            categories: state.categories.filter((c) => c._id !== id),
          }));
          toast.success("Category deleted");
        } catch (error) {
          toast.error("Failed to delete category");
        }
      },

      addFeaturedService: async (service) => {
        try {
          const payload = {
            type: "featuredService",
            data: service,
            isActive: true,
          };
          const response: any = await api.post("/admin/content", payload);
          const newService = { ...response.data, _id: response._id };
          set((state) => ({
            featuredServices: [...state.featuredServices, newService],
          }));
          toast.success("Service added to featured");
        } catch (error) {
          toast.error("Failed to add service");
        }
      },

      removeFeaturedService: async (id) => {
        try {
          await api.delete(`/admin/content/${id}`);
          set((state) => ({
            featuredServices: state.featuredServices.filter(
              (s) => s._id !== id
            ),
          }));
          toast.success("Service removed");
        } catch (error) {
          toast.error("Failed to remove service");
        }
      },

      addSalonFeaturedService: async (service) => {
        try {
          const payload = {
            type: "salonFeaturedService",
            data: service,
            isActive: true,
          };
          const response: any = await api.post("/admin/content", payload);
          const newService = { ...response.data, _id: response._id };
          set((state) => ({
            salonFeaturedServices: [...state.salonFeaturedServices, newService],
          }));
          toast.success("Service added to At Salon featured");
        } catch (error) {
          toast.error("Failed to add service");
        }
      },

      removeSalonFeaturedService: async (id) => {
        try {
          await api.delete(`/admin/content/${id}`);
          set((state) => ({
            salonFeaturedServices: state.salonFeaturedServices.filter(
              (s) => s._id !== id
            ),
          }));
          toast.success("Service removed");
        } catch (error) {
          toast.error("Failed to remove service");
        }
      },

      updatePromoBanner: async (image) => {
        try {
          const payload = {
            type: "promo",
            data: image,
            isActive: true,
          };
          await api.post("/admin/content", payload);
          set(() => ({
            promoBanner: image,
          }));
          toast.success("Promo banner updated");
        } catch (error) {
          toast.error("Failed to update promo");
        }
      },

      updateReferralConfig: async (config) => {
        set((state) => ({
          referralConfig: { ...state.referralConfig, ...config },
        }));
      },

      fetchContent: async () => {
        try {
          set({ error: null });
          const response: any = await api.get("/admin/content");
          const content = response;
          if (content) {
            set({
              banners: content.banners || [],
              categories: content.categories || [],
              deals: content.deals || [],
              featuredServices: content.featuredServices || [],
              salonFeaturedServices: content.salonFeaturedServices || [],
              referralConfig: content.referral || { steps: [], termsNote: "" },
              promoBanner: content.promoBanner || "",
            });
          }
        } catch (error: any) {
          console.error("Failed to fetch content:", error);
          set({ error: error.message || "Failed to fetch content" });
        }
      },

      setFeaturedServices: (services) => set({ featuredServices: services }),
      setSalonFeaturedServices: (services) =>
        set({ salonFeaturedServices: services }),
    }),
    {
      name: "admin-content-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
