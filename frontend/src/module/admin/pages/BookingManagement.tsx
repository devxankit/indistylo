import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InspectBookingModal } from "../components/InspectBookingModal";
import { useState, useEffect } from "react";
import { Filter, Loader2 } from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";

export function BookingManagement() {
  const { allBookings, fetchAllBookings, isLoading } = useAdminStore();
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllBookings(filter === "all" ? {} : { status: filter });
  }, [filter]);

  const handleInspect = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (_id: string, _newStatus: string) => {
    fetchAllBookings(filter === "all" ? {} : { status: filter });
  };

  if (isLoading && allBookings.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InspectBookingModal
        booking={selectedBooking}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onStatusUpdate={handleStatusUpdate}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Booking Oversight
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track live orders across the platform.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 bg-muted/50 p-1 rounded-lg border border-border/50">
          {["all", "pending", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === f
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              } capitalize`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-primary/5 border-primary/20 text-primary font-medium text-center">
          Total Bookings: {allBookings.length}
        </Card>
        <Card className="p-4 bg-orange-500/10 border-orange-500/20 text-orange-600 font-medium text-center">
          Pending:{" "}
          {allBookings.filter((b: any) => b.status === "pending").length}
        </Card>
        <Card className="p-4 bg-red-500/10 border-red-500/20 text-red-600 font-medium text-center">
          Cancelled:{" "}
          {allBookings.filter((b: any) => b.status === "cancelled").length}
        </Card>
        <Card className="p-4 bg-green-500/10 border-green-500/20 text-green-600 font-medium text-center">
          Completed:{" "}
          {allBookings.filter((b: any) => b.status === "completed").length}
        </Card>
      </div>

      <Card className="p-0 border-border overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {filter === "all"
              ? "All Orders"
              : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-muted-foreground">Live Updates</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold text-muted-foreground bg-muted/50 text-left uppercase">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground">
                    No bookings found for this filter.
                  </td>
                </tr>
              ) : (
                allBookings.map((b: any) => (
                  <tr
                    key={b._id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-mono text-sm">
                      #{b._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-4">{b.user?.name || "N/A"}</td>
                    <td className="p-4">{b.salon?.name || "N/A"}</td>
                    <td className="p-4 font-bold">₹{b.price}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                            ${
                              b.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : b.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleInspect(b)}
                        className="!bg-primary !text-black hover:!bg-primary/90 shadow-sm">
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
