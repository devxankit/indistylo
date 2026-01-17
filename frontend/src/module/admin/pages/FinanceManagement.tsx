import { TrendingUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import { CommissionSettingsModal } from "../components/CommissionSettingsModal";

import { useAdminStore } from "../store/useAdminStore";

export function FinanceManagement() {
  const {
    stats,
    payouts,
    allBookings,
    commissionRate,
    fetchStats,
    fetchPayouts,
    fetchAllBookings,
    fetchCommissionRate,
    updateCommissionRate,

    isLoading,
  } = useAdminStore();

  useEffect(() => {
    fetchStats();
    fetchPayouts();
    fetchCommissionRate();
    fetchAllBookings();
  }, []);

  // Safe commission rate handling for legacy/corrupt state
  const safeCommissionRate =
    typeof commissionRate === "object"
      ? (commissionRate as any).commissionRate
      : commissionRate;

  // Calculate total processed payouts
  const totalProcessedPayouts = payouts
    .filter((p: any) => p.status === "processed")
    .reduce((acc: number, curr: any) => acc + curr.amount, 0);

  // Payout Logic
  const [showCommissionModal, setShowCommissionModal] = useState(false);



  if (isLoading && payouts.length === 0) {
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


      <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Total Platform Revenue
          </h3>
          <div className="text-3xl font-bold flex items-center gap-2">
            ₹{stats.totalRevenue.toLocaleString()}{" "}
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Pending Payouts
          </h3>
          <div className="text-3xl font-bold text-orange-500">
            {Math.max(
              0,
              stats.totalRevenue - (stats.adminWallet || 0) - totalProcessedPayouts
            ).toLocaleString()}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Total Earnings (Admin Wallet)
          </h3>
          <div className="text-3xl font-bold flex items-center gap-2 text-green-600">
            ₹{(stats.adminWallet || 0).toLocaleString()}{" "}
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
        </Card>
        <Card
          className="p-6 cursor-pointer hover:bg-muted/50 transition-colors border-blue-200 hover:border-blue-400 group"
          onClick={() => setShowCommissionModal(true)}>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Commission Rate
            </h3>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              Edit
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-500">
            {safeCommissionRate}%
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Payout Requests</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
                onClick={() => window.open("/admin/finance/payouts", "_self")}
              >
                View All →
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                <span className="text-sm text-muted-foreground">Pending Requests</span>
                <span className="font-bold text-lg">
                  {payouts.filter((p: any) => p.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Processed</span>
                <span className="font-bold text-lg">
                  {payouts.filter((p: any) => p.status === 'processed').length}
                </span>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-4"
            variant="outline"
            onClick={() => window.open("/admin/finance/payouts", "_self")}
          >
            Manage Payouts
          </Button>
        </Card>

        <Card className="p-6 flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Commission Logs</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
                onClick={() => window.open("/admin/finance/commission-logs", "_self")}
              >
                View All →
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                <span className="text-sm text-muted-foreground">Recent Transactions</span>
                <span className="font-bold text-lg">
                  {allBookings.filter((b: any) => b.status === "completed").length}
                </span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Latest Commission</div>
                <div className="font-medium truncate">
                  {allBookings.filter((b: any) => b.status === "completed")[0]
                    ? `+ ₹${(allBookings.filter((b: any) => b.status === "completed")[0].price * (safeCommissionRate / 100)).toFixed(2)}`
                    : "No recent activity"}
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-4"
            variant="outline"
            onClick={() => window.open("/admin/finance/commission-logs", "_self")}
          >
            View Detailed Logs
          </Button>
        </Card>
      </div>
    </div>
  );
}

