import { useEffect, useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Download, Search } from "lucide-react";
import { PayoutDetailsModal } from "../components/PayoutDetailsModal";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

export function PayoutsPage() {
    const navigate = useNavigate();
    const { payouts, fetchPayouts, processPayout, isLoading } = useAdminStore();

    const [selectedPayout, setSelectedPayout] = useState<any>(null);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchPayouts();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleOpenPayout = (payout: any) => {
        setSelectedPayout(payout);
        setShowPayoutModal(true);
    };

    const handleProcessPayout = async (
        id: string,
        status: "processed" | "rejected",
        transactionId?: string
    ) => {
        await processPayout(id, { status, transactionId });
    };

    const filteredPayouts = payouts.filter((p: any) =>
        p.salonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading && payouts.length === 0) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/finance")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payout Requests</h1>
                    <p className="text-muted-foreground">Manage and process vendor withdrawal requests</p>
                </div>
            </div>

            <PayoutDetailsModal
                payout={selectedPayout}
                open={showPayoutModal}
                onOpenChange={setShowPayoutModal}
                onProcess={handleProcessPayout}
            />

            <Card className="p-6">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by vendor or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => toast.success("Payouts report downloaded")}
                    >
                        <Download className="w-4 h-4 mr-2" /> Export Report
                    </Button>
                </div>

                <div className="rounded-lg border border-border overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm border-b border-border min-w-[800px]">
                        <div className="col-span-3">Vendor / Salon</div>
                        <div className="col-span-2">Amount</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Platform Fee</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Action</div>
                    </div>

                    <div className="divide-y divide-border min-w-[800px]">
                        {filteredPayouts.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No payout requests found matching your search.
                            </div>
                        ) : (
                            filteredPayouts.map((p: any) => (
                                <div key={p._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/20 transition-colors text-sm">
                                    <div className="col-span-3">
                                        <div className="font-semibold text-foreground">
                                            {p.vendor?._id ? (
                                                <Link
                                                    to={`/admin/vendors/${p.vendor._id}`}
                                                    className="hover:text-primary hover:underline transition-colors"
                                                >
                                                    {p.salonName || "N/A"}
                                                </Link>
                                            ) : (
                                                p.salonName || "N/A"
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">{p._id}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {p.vendorEmail && p.vendorEmail !== "N/A" && (
                                                <div>{p.vendorEmail}</div>
                                            )}
                                            {p.vendorPhone && p.vendorPhone !== "N/A" && (
                                                <div>{p.vendorPhone}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-2 font-bold">
                                        ₹{p.amount.toLocaleString()}
                                    </div>
                                    <div className="col-span-2 text-muted-foreground">
                                        {new Date(p.requestedAt).toLocaleDateString()}
                                        <div className="text-xs">{new Date(p.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                    <div className="col-span-2 text-muted-foreground">
                                        -
                                    </div>
                                    <div className="col-span-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === "processed"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : p.status === "rejected"
                                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                }`}
                                        >
                                            {p.status === "processed" ? "Paid" : p.status === "rejected" ? "Rejected" : "Pending"}
                                        </span>
                                    </div>
                                    <div className="col-span-1 text-right">
                                        {p.status === "pending" ? (
                                            <Button
                                                size="sm"
                                                className="h-8 w-full !bg-primary !text-black hover:!bg-primary/90"
                                                onClick={() => handleOpenPayout(p)}
                                            >
                                                Process
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="sm" className="h-8 w-full" disabled>
                                                Done
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
