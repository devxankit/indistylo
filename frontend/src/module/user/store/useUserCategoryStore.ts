import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api } from "../services/apiClient";

// Types
export interface CategorySubcategory {
    _id: string;
    name: string;
    image: string;
    order: number;
}

export interface CategoryGroup {
    headerName: string;
    headerOrder: number;
    subcategories: CategorySubcategory[];
}

interface UserCategoryState {
    categories: CategoryGroup[];
    selectedGender: "MALE" | "FEMALE";
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchCategories: (gender?: "MALE" | "FEMALE", type?: "SALON" | "SPA") => Promise<void>;
    setGender: (gender: "MALE" | "FEMALE") => void;
}

export const useUserCategoryStore = create<UserCategoryState>()(
    persist(
        (set, get) => ({
            categories: [],
            selectedGender: "MALE",
            isLoading: false,
            error: null,

            fetchCategories: async (gender, type) => {
                try {
                    set({ isLoading: true, error: null });
                    const genderFilter = gender || get().selectedGender;
                    const typeFilter = type || "SALON";

                    const categories: CategoryGroup[] = await api.get(
                        `/admin/public/categories/subcategories?gender=${genderFilter}&type=${typeFilter}`
                    );

                    set({ categories, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false, categories: [] });
                    console.error("Failed to fetch categories:", error);
                }
            },

            setGender: (gender) => {
                set({ selectedGender: gender });
                get().fetchCategories(gender);
            },
        }),
        {
            name: "user-category-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selectedGender: state.selectedGender,
            }),
        }
    )
);
