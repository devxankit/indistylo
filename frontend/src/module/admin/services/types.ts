export type AdminRole = 'super_admin' | 'moderator' | 'support';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    avatar?: string;
}

export type VendorStatus = 'pending' | 'active' | 'rejected' | 'blacklisted';

export interface AdminVendorListItem {
    id: string;
    businessName: string;
    ownerName: string;
    type: 'salon' | 'freelancer' | 'spa';
    location: string;
    phone: string;
    status: VendorStatus;
    joinedDate: string;
    documentsVerified: boolean;
    email: string;
    verificationDocuments: {
        _id: string;
        type: string;
        url: string;
        status: 'pending' | 'verified' | 'rejected';
    }[];
}

export interface AdminBookingListItem {
    id: string;
    customerName: string;
    vendorName: string;
    service: string;
    amount: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    date: string;
}

export interface AdminStats {
    totalCustomers: number;
    totalVendors: number;
    totalBookings: number;
    totalRevenue: number;
    pendingApprovals?: number;
    adminWallet?: number;
}
