import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InspectBookingModal } from "../components/InspectBookingModal";
import { useState } from "react";
import { Filter } from "lucide-react";

export function BookingManagement() {
    const [bookings, setBookings] = useState([
        { id: "ORD-001", customer: "Rahul S.", vendor: "Glamour Cuts", amount: 899, status: "completed", date: "2 mins ago" },
        { id: "ORD-002", customer: "Priya M.", vendor: "Luxe Spa", amount: 2500, status: "pending", date: "15 mins ago" },
        { id: "ORD-003", customer: "Amit K.", vendor: "Urban Salon", amount: 450, status: "cancelled", date: "1 hour ago" },
        { id: "ORD-004", customer: "Sneha R.", vendor: "Style Studio", amount: 1200, status: "pending", date: "2 hours ago" },
        { id: "ORD-005", customer: "Vikram S.", vendor: "Men's Zone", amount: 350, status: "completed", date: "3 hours ago" },
    ]);

    const [filter, setFilter] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredBookings = bookings.filter(b => filter === "all" || b.status === filter);

    const handleInspect = (booking: any) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = (id: string, newStatus: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

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
                    <h1 className="text-3xl font-bold tracking-tight">Booking Oversight</h1>
                    <p className="text-muted-foreground mt-1">Manage and track live orders across the platform.</p>
                </div>
                <div className="flex flex-wrap gap-2 bg-muted/50 p-1 rounded-lg border border-border/50">
                    {['all', 'pending', 'completed', 'cancelled'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === f
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                } capitalize`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-primary/5 border-primary/20 text-primary font-medium text-center">
                    Total Orders today: 156
                </Card>
                <Card className="p-4 bg-orange-500/10 border-orange-500/20 text-orange-600 font-medium text-center">
                    Pending Dispatch: {bookings.filter(b => b.status === 'pending').length}
                </Card>
                <Card className="p-4 bg-red-500/10 border-red-500/20 text-red-600 font-medium text-center">
                    Disputed / Issues: 3
                </Card>
                <Card className="p-4 bg-green-500/10 border-green-500/20 text-green-600 font-medium text-center">
                    Completed: {bookings.filter(b => b.status === 'completed').length}
                </Card>
            </div>

            <Card className="p-0 border-border overflow-hidden">
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                    <div className="font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        {filter === 'all' ? 'All Orders' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
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
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No bookings found for this filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map(b => (
                                    <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="p-4 font-mono text-sm">{b.id}</td>
                                        <td className="p-4">{b.customer}</td>
                                        <td className="p-4">{b.vendor}</td>
                                        <td className="p-4 font-bold">₹{b.amount}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                            ${b.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button
                                                size="sm"
                                                onClick={() => handleInspect(b)}
                                                className="!bg-primary !text-black hover:!bg-primary/90 shadow-sm"
                                            >
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
