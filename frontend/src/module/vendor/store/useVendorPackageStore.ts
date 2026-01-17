import { create } from "zustand";
import { api } from "../../user/services/apiClient";

interface Service {
    _id: string;
    name: string;
    price: number;
    duration: number;
    image?: string;
    category: string;
}

interface Package {
    _id: string;
    name: string;
    image: string;
    type: "at-salon" | "at-home";
    gender: "male" | "female" | "unisex";
    description: string;
    services: Service[];
    price: number;
    isActive: boolean;
    createdAt: string;
}

interface VendorPackageState {
    packages: Package[];
    loading: boolean;
    error: string | null;

    // Actions
    createPackage: (data: any) => Promise<boolean>;
    fetchPackages: () => Promise<void>;
    deletePackage: (id: string) => Promise<boolean>;

    // Helper to fetch services for selection
    vendorServices: Service[];
    fetchVendorServices: () => Promise<void>;
}

export const useVendorPackageStore = create<VendorPackageState>((set) => ({
    packages: [],
    loading: false,
    error: null,
    vendorServices: [],

    fetchVendorServices: async () => {
        set({ loading: true, error: null });
        try {
            // Assuming there is an endpoint for vendor to get their own services
            // Usually /vendor/services
            const response: any = await api.get("/vendor/services");
            // Verify response structure. Usually it's an array of services.
            set({ vendorServices: response, loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to fetch services" });
        }
    },

    createPackage: async (data) => {
        set({ loading: true, error: null });
        try {
            await api.post("/vendor/packages", data);
            set({ loading: false });
            return true;
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to create package" });
            return false;
        }
    },

    fetchPackages: async () => {
        set({ loading: true, error: null });
        try {
            const response: any = await api.get("/vendor/packages");
            set({ packages: response, loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to fetch packages" });
        }
    },

    deletePackage: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/vendor/packages/${id}`);
            set((state) => ({
                packages: state.packages.filter((pkg) => pkg._id !== id),
                loading: false,
            }));
            return true;
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to delete package" });
            return false;
        }
    },
}));
