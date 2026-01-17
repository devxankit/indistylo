import { create } from "zustand";
import { api } from "../services/apiClient";

interface Service {
    _id: string;
    name: string;
    duration: number;
    price: number;
}

interface Vendor {
    _id: string;
    businessName: string;
    address: string;
    city: string;
}

export interface Package {
    _id: string;
    name: string;
    image: string;
    type: "at-salon" | "at-home";
    gender: "male" | "female" | "unisex";
    description: string;
    services: Service[];
    vendor: Vendor;
    price: number;
    isActive: boolean;
}

interface PackageStore {
    packages: Package[];
    loading: boolean;
    error: string | null;

    fetchPackages: (filters?: { type?: string; gender?: string; salonId?: string }) => Promise<void>;
}

export const usePackageStore = create<PackageStore>((set) => ({
    packages: [],
    loading: false,
    error: null,

    fetchPackages: async (filters) => {
        set({ loading: true, error: null });
        try {
            const queryParams = new URLSearchParams();
            if (filters?.type) queryParams.append("type", filters.type);
            if (filters?.gender) queryParams.append("gender", filters.gender);
            if (filters?.salonId) queryParams.append("salonId", filters.salonId);

            const response: any = await api.get(`/packages?${queryParams.toString()}`);
            set({ packages: response, loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.message || "Failed to fetch packages" });
        }
    },
}));
