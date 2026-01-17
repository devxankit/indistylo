import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import {
    Search,
    UserPlus,
    Store,
    Building2,
    User,
    Eye,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AddVendorModal } from "../components/AddVendorModal";

export function VendorManagement() {
    const { pendingVendors, activeVendors, fetchVendors, isLoading } = useAdminStore();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchVendors();
    }, []);

    const isPendingView = location.pathname.includes("pending");

    const filteredVendors = (isPendingView ? pendingVendors : activeVendors).filter(vendor => {
        const matchesSearch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (isLoading && filteredVendors.length === 0) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AddVendorModal open={showAddModal} onOpenChange={setShowAddModal} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {isPendingView ? (
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <UserPlus className="w-6 h-6 text-orange-600" />
                        </div>
                    ) : (
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Store className="w-6 h-6 text-green-600" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isPendingView ? "Vendor Requests" : "Active Vendors"}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {isPendingView
                                ? "Manage incoming vendor registration requests"
                                : "View and manage active vendor accounts"}
                        </p>
                    </div>
                </div>
                {!isPendingView && (
                    <Button
                        className="font-bold !bg-primary !text-black hover:!bg-primary/90 w-full md:w-auto"
                        onClick={() => setShowAddModal(true)}
                    >
                        Add New Vendor
                    </Button>
                )}
            </div>

            <Card className="p-4">
                {/* Search */}
                <div className="flex gap-4 justify-between items-center mb-6">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name or business..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    <th className="px-6 py-4">Vendor Info</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Joined Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {filteredVendors.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            No vendors found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <tr key={vendor.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {vendor.businessName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-foreground">{vendor.businessName}</div>
                                                        <div className="text-xs text-muted-foreground">{vendor.ownerName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    {vendor.type === 'salon' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                                    <span className="capitalize">{vendor.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-muted-foreground">{vendor.location}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-muted-foreground">{vendor.joinedDate}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={cn(
                                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                    vendor.status === 'active'
                                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                        : vendor.status === 'pending'
                                                            ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                                            : "bg-red-500/10 text-red-500 border-red-500/20"
                                                )}>
                                                    {vendor.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <Link
                                                    to={`/admin/vendors/${vendor.id}`}
                                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium bg-primary !text-black rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                                                >
                                                    <Eye className="w-3 h-3 mr-1.5" />
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
}
