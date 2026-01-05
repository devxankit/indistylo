import { create } from 'zustand';
import type { AdminUser, AdminVendorListItem, AdminStats } from '../services/types';

interface AdminState {
    isAuthenticated: boolean;
    currentUser: AdminUser | null;
    stats: AdminStats;
    pendingVendors: AdminVendorListItem[];
    activeVendors: AdminVendorListItem[];
    notifications: AdminNotification[];

    login: (email: string) => void;
    logout: () => void;
    approveVendor: (vendorId: string) => void;
    rejectVendor: (vendorId: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    addNotification: (notification: AdminNotification) => void;
}

// Mock Initial Data
const mockPendingVendors: AdminVendorListItem[] = [
    {
        id: 'v_new_1',
        businessName: 'Glamour Cuts Studio',
        ownerName: 'Suresh Raina',
        type: 'salon',
        location: 'Sector 45, Gurgaon',
        phone: '+91 9876543210',
        status: 'pending',
        joinedDate: '2024-01-02',
        documentsVerified: false,
    },
    {
        id: 'v_new_2',
        businessName: 'Priya Mehandi Art',
        ownerName: 'Priya Singh',
        type: 'freelancer',
        location: 'DLF Phase 3, Gurgaon',
        phone: '+91 9876543211',
        status: 'pending',
        joinedDate: '2024-01-03',
        documentsVerified: false,
    },
];

const mockActiveVendors: AdminVendorListItem[] = [
    {
        id: 'v_active_1',
        businessName: 'Luxe Salon',
        ownerName: 'Amit Verma',
        type: 'salon',
        location: 'Sector 29, Gurgaon',
        phone: '+91 9898989898',
        status: 'active',
        joinedDate: '2023-11-15',
        documentsVerified: true,
    }
];

import { persist, createJSONStorage } from 'zustand/middleware';

// Notification Types
export interface AdminNotification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
    link?: string;
}

const mockNotifications: AdminNotification[] = [
    {
        id: 'n1',
        title: 'New Vendor Registration',
        message: 'Glamour Cuts Studio has registered and is waiting for approval.',
        type: 'info',
        timestamp: '2 mins ago',
        read: false,
        link: '/admin/vendors/pending'
    },
    {
        id: 'n2',
        title: 'High Order Volume',
        message: 'Order volume has increased by 50% in the last hour.',
        type: 'success',
        timestamp: '1 hour ago',
        read: false
    },
    {
        id: 'n3',
        title: 'System Alert',
        message: 'Database backup completed successfully.',
        type: 'info',
        timestamp: '3 hours ago',
        read: true
    }
];

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            currentUser: null,
            stats: {
                totalUsers: 1245,
                totalVendors: 48,
                pendingApprovals: 2,
                activeOrders: 15,
                totalRevenue: 452000,
            },
            pendingVendors: mockPendingVendors,
            activeVendors: mockActiveVendors,
            notifications: mockNotifications,

            login: (email) => set({
                isAuthenticated: true,
                currentUser: {
                    id: 'admin_1',
                    name: 'Super Admin',
                    email: email,
                    role: 'super_admin',
                    avatar: 'https://github.com/shadcn.png'
                }
            }),

            logout: () => set({ isAuthenticated: false, currentUser: null }),

            approveVendor: (vendorId) => set((state) => {
                const vendorToApprove = state.pendingVendors.find(v => v.id === vendorId);
                if (!vendorToApprove) return state;

                return {
                    pendingVendors: state.pendingVendors.filter(v => v.id !== vendorId),
                    activeVendors: [...state.activeVendors, { ...vendorToApprove, status: 'active' }],
                    stats: {
                        ...state.stats,
                        pendingApprovals: state.stats.pendingApprovals - 1,
                        totalVendors: state.stats.totalVendors + 1
                    }
                };
            }),

            rejectVendor: (vendorId) => set((state) => ({
                pendingVendors: state.pendingVendors.filter(v => v.id !== vendorId),
                stats: {
                    ...state.stats,
                    pendingApprovals: state.stats.pendingApprovals - 1
                }
            })),

            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                )
            })),

            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true }))
            })),

            clearNotifications: () => set({ notifications: [] }),

            addNotification: (notification) => set((state) => ({
                notifications: [notification, ...state.notifications]
            })),
        }),
        {
            name: 'admin-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
