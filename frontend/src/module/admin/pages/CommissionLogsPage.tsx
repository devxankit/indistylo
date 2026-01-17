import { useEffect, useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Download, Search, RefreshCw, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { CommissionSettingsModal } from "../components/CommissionSettingsModal";

export function CommissionLogsPage() {
    const navigate = useNavigate();
    const { allBookings, fetchAllBookings, commissionRate, fetchCommissionRate, updateCommissionRate, isLoading } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [showCommissionModal, setShowCommissionModal] = useState(false);

    useEffect(() => {
        fetchAllBookings();
        fetchCommissionRate();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Filter all paid bookings (regardless of service status) as they generate commission
    const commissionLogs = allBookings.filter((b: any) => b.paymentStatus === "paid");

    const filteredLogs = commissionLogs.filter((b: any) =>
        b._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Safe commission rate handling
    const safeCommissionRate =
        typeof commissionRate === "object"
            ? (commissionRate as any).commissionRate
            : commissionRate;

    const calculateCommission = (booking: any) => {
        // Use stored commission amount if available (prioritize historical accuracy)
        if (typeof booking.commissionAmount === 'number') {
            return booking.commissionAmount;
        }
        // If commission info is missing (Legacy data), assume 0 to match Wallet balance
        return 0;
    };

    const totalCommission = filteredLogs.reduce((acc: number, curr: any) => acc + calculateCommission(curr), 0);

    if (isLoading && allBookings.length === 0) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <CommissionSettingsModal
                open={showCommissionModal}
                onOpenChange={setShowCommissionModal}
                currentRate={safeCommissionRate}
                onRateUpdate={updateCommissionRate}
            />

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/finance")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Commission Logs</h1>
                    <p className="text-muted-foreground">Track platform earnings from bookings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Generated</h3>
                    <div className="text-3xl font-bold text-green-500">
                        ₹{totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Transactions</h3>
                    <div className="text-3xl font-bold text-foreground">
                        {filteredLogs.length}
                    </div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-card to-muted/20 relative group">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Rate</h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setShowCommissionModal(true)}
                        >
                            <Edit2 className="w-3 h-3 text-muted-foreground" />
                        </Button>
                    </div>
                    <div className="text-3xl font-bold text-blue-500">
                        {safeCommissionRate}%
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search order ID, service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => fetchAllBookings()}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => toast.success("Commission report downloaded")}
                        >
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border border-border overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm border-b border-border min-w-[900px]">
                        <div className="col-span-3">Order Details</div>
                        <div className="col-span-3">Customer</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2 text-right">Order Value</div>
                        <div className="col-span-2 text-right">Commission</div>
                    </div>

                    <div className="divide-y divide-border min-w-[900px]">
                        {filteredLogs.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No commission records found.
                            </div>
                        ) : (
                            filteredLogs.map((log: any) => {
                                const comm = calculateCommission(log);
                                return (
                                    <div key={log._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors text-sm">
                                        <div className="col-span-3">
                                            <div className="font-semibold text-foreground">#{log._id.slice(-6).toUpperCase()}</div>
                                            <div className="text-xs text-muted-foreground">{log.service?.name || "Unknown Service"}</div>
                                        </div>
                                        <div className="col-span-3">
                                            <div className="font-medium">{log.user?.name || "Unknown Customer"}</div>
                                            <div className="text-xs text-muted-foreground">{log.user?.phone || "N/A"}</div>
                                        </div>
                                        <div className="col-span-2 text-muted-foreground">
                                            {new Date(log.date).toLocaleDateString()}
                                        </div>
                                        <div className="col-span-2 text-right font-medium">
                                            ₹{log.price.toLocaleString()}
                                        </div>
                                        <div className="col-span-2 text-right font-bold text-green-500">
                                            + ₹{comm.toFixed(2)}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
