import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "@/module/user/services/apiClient";
import { toast } from "sonner";

// Types
export interface HeaderCategory {
    _id: string;
    name: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Subcategory {
    _id: string;
    name: string;
    headerCategoryId: string | { _id: string; name: string };
    gender: "MALE" | "FEMALE";
    image: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

interface CategoryState {
    headerCategories: HeaderCategory[];
    subcategories: Subcategory[];
    selectedGender: "MALE" | "FEMALE";
    selectedType: "SALON" | "SPA"; // Add selectedType
    isLoading: boolean;
    error: string | null;

    // Header Category Actions
    fetchHeaderCategories: (type?: "SALON" | "SPA") => Promise<void>;
    createHeaderCategory: (name: string, type: "SALON" | "SPA", order?: number) => Promise<void>;
    updateHeaderCategory: (id: string, name: string, order?: number) => Promise<void>;
    deleteHeaderCategory: (id: string) => Promise<void>;

    // Subcategory Actions
    fetchSubcategories: (gender?: "MALE" | "FEMALE", type?: "SALON" | "SPA") => Promise<void>;
    createSubcategory: (data: {
        name: string;
        headerCategoryId: string;
        gender: "MALE" | "FEMALE";
        image: string;
        type: "SALON" | "SPA"; // Add type
        order?: number;
    }) => Promise<void>;
    updateSubcategory: (
        id: string,
        data: {
            name?: string;
            headerCategoryId?: string;
            gender?: "MALE" | "FEMALE";
            image?: string;
            order?: number;
        }
    ) => Promise<void>;
    deleteSubcategory: (id: string) => Promise<void>;

    // UI State
    setSelectedGender: (gender: "MALE" | "FEMALE") => void;
    setSelectedType: (type: "SALON" | "SPA") => void; // Add setSelectedType
}

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set, get) => ({
            headerCategories: [],
            subcategories: [],
            selectedGender: "MALE",
            selectedType: "SALON",
            isLoading: false,
            error: null,

            // Header Category Actions
            fetchHeaderCategories: async (type) => {
                try {
                    set({ isLoading: true, error: null });
                    const targetType = type || get().selectedType;
                    const headers: HeaderCategory[] = await api.get(`/admin/categories/headers?type=${targetType}`);
                    set({ headerCategories: headers, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                    toast.error("Failed to fetch header categories");
                }
            },

            createHeaderCategory: async (name, type, order = 0) => {
                try {
                    const newHeader: HeaderCategory = await api.post("/admin/categories/headers", {
                        name,
                        type,
                        order,
                    });
                    if (type === get().selectedType) {
                        set((state) => ({
                            headerCategories: [...state.headerCategories, newHeader].sort(
                                (a, b) => a.order - b.order || a.name.localeCompare(b.name)
                            ),
                        }));
                    }
                    toast.success("Header category created");
                } catch (error: any) {
                    toast.error(error.message || "Failed to create header category");
                    throw error;
                }
            },

            updateHeaderCategory: async (id, name, order) => {
                try {
                    const updated: HeaderCategory = await api.put(
                        `/admin/categories/headers/${id}`,
                        { name, order }
                    );
                    set((state) => ({
                        headerCategories: state.headerCategories
                            .map((h) => (h._id === id ? updated : h))
                            .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
                    }));
                    toast.success("Header category updated");
                } catch (error: any) {
                    toast.error(error.message || "Failed to update header category");
                    throw error;
                }
            },

            deleteHeaderCategory: async (id) => {
                try {
                    await api.delete(`/admin/categories/headers/${id}`);
                    set((state) => ({
                        headerCategories: state.headerCategories.filter((h) => h._id !== id),
                    }));
                    toast.success("Header category deleted");
                } catch (error: any) {
                    toast.error(error.message || "Failed to delete header category");
                    throw error;
                }
            },

            // Subcategory Actions
            fetchSubcategories: async (gender, type) => {
                try {
                    set({ isLoading: true, error: null });
                    const genderFilter = gender || get().selectedGender;
                    const typeFilter = type || get().selectedType;
                    const subcategories: Subcategory[] = await api.get(
                        `/admin/categories/subcategories?gender=${genderFilter}&type=${typeFilter}`
                    );
                    set({ subcategories, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                    toast.error("Failed to fetch subcategories");
                }
            },

            createSubcategory: async (data) => {
                try {
                    const newSubcategory: Subcategory = await api.post(
                        "/admin/categories/subcategories",
                        data
                    );
                    if (data.type === get().selectedType && data.gender === get().selectedGender) {
                        set((state) => ({
                            subcategories: [...state.subcategories, newSubcategory].sort(
                                (a, b) => a.order - b.order || a.name.localeCompare(b.name)
                            ),
                        }));
                    }
                    toast.success("Subcategory created");
                } catch (error: any) {
                    toast.error(error.message || "Failed to create subcategory");
                    throw error;
                }
            },

            updateSubcategory: async (id, data) => {
                try {
                    const updated: Subcategory = await api.put(
                        `/admin/categories/subcategories/${id}`,
                        data
                    );
                    set((state) => ({
                        subcategories: state.subcategories
                            .map((s) => (s._id === id ? updated : s))
                            .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
                    }));
                    toast.success("Subcategory updated");
                } catch (error: any) {
                    toast.error(error.message || "Failed to update subcategory");
                    throw error;
                }
            },

            deleteSubcategory: async (id) => {
                try {
                    await api.delete(`/admin/categories/subcategories/${id}`);
                    set((state) => ({
                        subcategories: state.subcategories.filter((s) => s._id !== id),
                    }));
                    toast.success("Subcategory deleted");
                } catch (error: any) {
                    toast.error(error.message || "Failed to delete subcategory");
                    throw error;
                }
            },

            // UI State
            setSelectedGender: (gender) => {
                set({ selectedGender: gender });
                get().fetchSubcategories(gender, get().selectedType);
            },

            setSelectedType: (type) => {
                set({ selectedType: type });
                get().fetchHeaderCategories(type);
                get().fetchSubcategories(get().selectedGender, type);
            },
        }),
        {
            name: "category-management-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selectedGender: state.selectedGender,
            }),
        }
    )
);
