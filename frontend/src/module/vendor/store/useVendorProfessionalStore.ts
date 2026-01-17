import { create } from "zustand";
import { api } from "../../user/services/apiClient";
import { toast } from "sonner";

export interface Professional {
    _id: string;
    name: string;
    role: string;
    specialization: string[];
    gender: "male" | "female" | "other";
    address: string;
    image?: string;
    isActive: boolean;
}

interface VendorProfessionalState {
    professionals: Professional[];
    loading: boolean;
    error: string | null;

    fetchProfessionals: () => Promise<void>;
    addProfessional: (data: Partial<Professional> & { imageFile?: File }) => Promise<void>;
    updateProfessional: (id: string, data: Partial<Professional> & { imageFile?: File }) => Promise<void>;
    deleteProfessional: (id: string) => Promise<void>;
}

export const useVendorProfessionalStore = create<VendorProfessionalState>((set, get) => ({
    professionals: [],
    loading: false,
    error: null,

    fetchProfessionals: async () => {
        set({ loading: true, error: null });
        try {
            const response: any = await api.get("/vendor/staff");
            set({ professionals: response, loading: false });
        } catch (error: any) {
            console.error("Failed to fetch professionals:", error);
            set({ loading: false, error: error.message });
        }
    },

    addProfessional: async (data) => {
        set({ loading: true, error: null });
        try {
            let imageUrl = data.image;

            if (data.imageFile) {
                const formData = new FormData();
                formData.append("image", data.imageFile);
                const uploadResponse: any = await api.post("/upload", formData);
                imageUrl = uploadResponse.url;
            }

            const payload = {
                ...data,
                image: imageUrl,
            };
            delete payload.imageFile;

            const response: any = await api.post("/vendor/staff", payload);
            set((state) => ({
                professionals: [...state.professionals, response],
                loading: false,
            }));
            toast.success("Professional added successfully");
        } catch (error: any) {
            console.error("Failed to add professional:", error);
            set({ loading: false, error: error.message });
            toast.error(error.message || "Failed to add professional");
            throw error;
        }
    },

    updateProfessional: async (id, data) => {
        set({ loading: true, error: null });
        try {
            let imageUrl = data.image;

            if (data.imageFile) {
                const formData = new FormData();
                formData.append("image", data.imageFile);
                const uploadResponse: any = await api.post("/upload", formData);
                imageUrl = uploadResponse.url;
            }

            const payload = {
                ...data,
                image: imageUrl,
            };
            delete payload.imageFile;

            const response: any = await api.put(`/vendor/staff/${id}`, payload);
            set((state) => ({
                professionals: state.professionals.map((p) =>
                    p._id === id ? response : p
                ),
                loading: false,
            }));
            toast.success("Professional updated successfully");
        } catch (error: any) {
            console.error("Failed to update professional:", error);
            set({ loading: false, error: error.message });
            toast.error(error.message || "Failed to update professional");
            throw error;
        }
    },

    deleteProfessional: async (id) => {
        set({ loading: true, error: null });
        try {
            await api.delete(`/vendor/staff/${id}`);
            set((state) => ({
                professionals: state.professionals.filter((p) => p._id !== id),
                loading: false,
            }));
            toast.success("Professional deleted successfully");
        } catch (error: any) {
            console.error("Failed to delete professional:", error);
            set({ loading: false, error: error.message });
            toast.error(error.message || "Failed to delete professional");
        }
    },
}));
