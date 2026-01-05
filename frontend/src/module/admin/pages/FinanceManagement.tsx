import { TrendingUp, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { CommissionSettingsModal } from "../components/CommissionSettingsModal";
import { PayoutDetailsModal } from "../components/PayoutDetailsModal";

export function FinanceManagement() {
    const [payouts, setPayouts] = useState([
        { id: "PAY-001", vendor: "Glamour Cuts Studio", amount: 15400, requested: "2024-01-02", status: "pending" },
        { id: "PAY-002", vendor: "Priya Mehandi Art", amount: 4200, requested: "2024-01-01", status: "processed" },
    ]);

    // Commission State
    const [commissionRate, setCommissionRate] = useState(10);
    const [showCommissionModal, setShowCommissionModal] = useState(false);

    // Payout Logic
    const [selectedPayout, setSelectedPayout] = useState<any>(null);
    const [showPayoutModal, setShowPayoutModal] = useState(false);

    const handleOpenPayout = (payout: any) => {
        setSelectedPayout(payout);
        setShowPayoutModal(true);
    };

    const handleProcessPayout = (id: string, status: 'processed' | 'rejected') => {
        setPayouts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };

    return (
        <div className="space-y-6">
            <CommissionSettingsModal
                open={showCommissionModal}
                onOpenChange={setShowCommissionModal}
                currentRate={commissionRate}
                onRateUpdate={setCommissionRate}
            />
            <PayoutDetailsModal
                payout={selectedPayout}
                open={showPayoutModal}
                onOpenChange={setShowPayoutModal}
                onProcess={handleProcessPayout}
            />

            <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Platform Revenue</h3>
                    <div className="text-3xl font-bold flex items-center gap-2">
                        ₹4,52,000 <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                </Card>
                <Card className="p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Payouts</h3>
                    <div className="text-3xl font-bold text-orange-500">
                        ₹{payouts.filter(p => p.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                    </div>
                </Card>
                <Card
                    className="p-6 cursor-pointer hover:bg-muted/50 transition-colors border-blue-200 hover:border-blue-400 group"
                    onClick={() => setShowCommissionModal(true)}
                >
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Commission Rate</h3>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-500">{commissionRate}%</div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Payout Requests</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.success("Finance report downloaded")}
                        >
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {payouts.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                                <div>
                                    <div className="font-semibold">{p.vendor}</div>
                                    <div className="text-xs text-muted-foreground">Req Date: {p.requested}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-lg">₹{p.amount.toLocaleString()}</div>
                                    {p.status === 'pending' ? (
                                        <Button
                                            size="sm"
                                            className="mt-1 h-7 !bg-primary !text-black hover:!bg-primary/90"
                                            onClick={() => handleOpenPayout(p)}
                                        >
                                            Process
                                        </Button>
                                    ) : (
                                        <span className={`text-xs font-medium ${p.status === 'processed' ? 'text-green-600' : 'text-red-600'}`}>
                                            {p.status === 'processed' ? 'Paid' : 'Rejected'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4">Commission Logs (Recent)</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm py-2 border-b">
                            <span>Order #12345 (Haircut)</span>
                            <span className="font-medium text-green-600">+ ₹{450 * (commissionRate / 100)}</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b">
                            <span>Order #12346 (Spa)</span>
                            <span className="font-medium text-green-600">+ ₹{1200 * (commissionRate / 100)}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

