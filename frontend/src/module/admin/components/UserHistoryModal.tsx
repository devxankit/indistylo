
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, History, Search, FileClock } from "lucide-react";
import { useState } from "react";

// Mock Data
// Mock Data
const mockHistory = [
    { id: "ORD - 001", date: "2024-01-15", vendor: "Luxe Salon", service: "Haircut", amount: 450, status: "completed" },
    { id: "ORD - 002", date: "2023-12-20", vendor: "Glamour Spa", service: "Full Body Massage", amount: 1200, status: "completed" },
    { id: "ORD - 003", date: "2023-11-05", vendor: "Style Studio", service: "Manicure", amount: 300, status: "cancelled" },
    { id: "ORD - 004", date: "2023-10-12", vendor: "Luxe Salon", service: "Hair Color", amount: 2500, status: "completed" },
];

interface UserHistoryModalProps {
    user: { name: string; email: string } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserHistoryModal({ user, open, onOpenChange }: UserHistoryModalProps) {
    const [searchTerm, setSearchTerm] = useState("");

    if (!user) return null;

    const filteredHistory = mockHistory.filter(order =>
        order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-full">
                            <History className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight">Order History</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Viewing past orders for <span className="font-medium text-foreground">{user.name}</span>
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by order ID, vendor or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex h-11 w-full rounded-lg border border-input bg-muted/30 pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all"
                        />
                    </div>

                    <div className="rounded-xl border border-border/50 overflow-hidden bg-card/50">
                        <div className="max-h-[400px] overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                                    <tr>
                                        <th className="px-4 py-3 w-[100px]">Order ID</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Details</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        <th className="px-4 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileClock className="w-8 h-8 text-muted-foreground/50" />
                                                    <p>No orders found fitting your criteria</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredHistory.map((order) => (
                                            <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-medium font-mono text-xs">{order.id}</td>
                                                <td className="px-4 py-3 text-muted-foreground text-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {order.date}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-medium text-foreground">{order.service}</span>
                                                        <span className="text-xs text-muted-foreground">{order.vendor}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-sm">₹{order.amount}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border
                                                        ${order.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                            order.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="h-10 px-8 !bg-primary !text-black hover:!bg-primary/90 font-medium w-full sm:w-auto"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
