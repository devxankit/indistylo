import { create } from "zustand";
import { persist } from "zustand/middleware";
import { popularAtHomeServices, popularAtHomeServicePackages } from "@/module/user/services/mockData";
import type { AtHomeService, AtHomeServicePackage } from "@/module/user/services/types";
import ShopNowImage from "@/assets/heropage/shopnowimage.png";

// Mock initial banners
import carousel1 from "@/assets/heropage/carousel/carousel1.png";
import carousel2 from "@/assets/heropage/carousel/carousel2.png";
import carousel3 from "@/assets/heropage/carousel/carousel3.png";

export interface Banner {
    id: string;
    image: string;
    link?: string;
    active: boolean;
}

export interface Category {
    id: string;
    name: string;
    image?: string;
    subCategories: string[];
}

interface ContentState {
    banners: Banner[];
    categories: Category[];
    featuredServices: AtHomeService[];
    popularPackages: AtHomeServicePackage[];
    promoBanner: string;
    referralConfig: ReferralConfig;

    // Banner Actions
    addBanner: (banner: Omit<Banner, "id" | "active">) => void;
    deleteBanner: (id: string) => void;
    toggleBannerActive: (id: string) => void;

    // Category Actions
    addCategory: (category: Omit<Category, "id">) => void;
    updateCategory: (id: string, category: Partial<Category>) => void;
    deleteCategory: (id: string) => void;

    // Home Page Content Actions
    addFeaturedService: (service: AtHomeService) => void;
    removeFeaturedService: (id: string) => void;
    addPopularPackage: (pkg: AtHomeServicePackage) => void;
    removePopularPackage: (id: string) => void;
    updatePromoBanner: (image: string) => void;

    // Referral Actions
    updateReferralConfig: (config: Partial<ReferralConfig>) => void;
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

// Initial mock data
const initialBanners: Banner[] = [
    { id: "1", image: carousel1, active: true },
    { id: "2", image: carousel2, active: true },
    { id: "3", image: carousel3, active: true },
];

const initialCategories: Category[] = [
    { id: "cat1", name: "Hair", image: "", subCategories: ["Haircut", "Hair Color", "Hair Spa", "Styling"] },
    { id: "cat2", name: "Skin", image: "", subCategories: ["Facial", "Cleanup", "Bleach", "Waxing"] },
    { id: "cat3", name: "Makeup", image: "", subCategories: ["Bridal", "Party", "Engagement"] },
    { id: "cat4", name: "Spa", image: "", subCategories: ["Body Massage", "Body Polishing"] },
    { id: "cat5", name: "Nails", image: "", subCategories: ["Manicure", "Pedicure", "Nail Art"] },
];

const initialReferralConfig: ReferralConfig = {
    steps: [
        { id: '1', title: 'Step 1 Give One Now (Refer Your Friend)', description: 'Get a free haircut and Platinum Discounted Price.' },
        { id: '2', title: 'Step 2 Your Friend Will Book Free Hair Cut.', description: 'Your friend will sign up using referral link & book free hair cut.' },
        { id: '3', title: 'Step 3 You Get Free Hair Cut', description: 'Upon completion of your friends first booking, you will get a free hair cut.' },
        { id: '4', title: 'Step 4 Earn IndiStylo Points (ISP)', description: 'You will earn ISP and platinum discounted offers.' }
    ],
    termsNote: 'You are entitled to one free haircut through our "Give One, Get One" offer. After your first free haircut, you\'ll receive a free ISP with every referral.'
};

export const useContentStore = create<ContentState>()(
    persist(
        (set) => ({
            banners: initialBanners,
            categories: initialCategories,
            featuredServices: popularAtHomeServices,
            popularPackages: popularAtHomeServicePackages,
            promoBanner: ShopNowImage,
            referralConfig: initialReferralConfig,

            addBanner: (banner) => set((state) => ({
                banners: [...state.banners, {
                    ...banner,
                    id: `banner_${Date.now()}`,
                    active: true
                }]
            })),

            deleteBanner: (id) => set((state) => ({
                banners: state.banners.filter((b) => b.id !== id)
            })),

            toggleBannerActive: (id) => set((state) => ({
                banners: state.banners.map((b) =>
                    b.id === id ? { ...b, active: !b.active } : b
                )
            })),

            addCategory: (category) => set((state) => ({
                categories: [...state.categories, {
                    ...category,
                    id: `cat_${Date.now()}`
                }]
            })),

            updateCategory: (id, updates) => set((state) => ({
                categories: state.categories.map((c) =>
                    c.id === id ? { ...c, ...updates } : c
                )
            })),

            deleteCategory: (id) => set((state) => ({
                categories: state.categories.filter((c) => c.id !== id)
            })),

            addFeaturedService: (service) => set((state) => ({
                featuredServices: [...state.featuredServices, service]
            })),

            removeFeaturedService: (id) => set((state) => ({
                featuredServices: state.featuredServices.filter((s) => s.id !== id)
            })),

            addPopularPackage: (pkg) => set((state) => ({
                popularPackages: [...state.popularPackages, pkg]
            })),

            removePopularPackage: (id) => set((state) => ({
                popularPackages: state.popularPackages.filter((p) => p.id !== id)
            })),

            updatePromoBanner: (image) => set(() => ({
                promoBanner: image
            })),

            updateReferralConfig: (config) => set((state) => ({
                referralConfig: { ...state.referralConfig, ...config }
            })),
        }),
        {
            name: "admin-content-storage",
        }
    )
);
