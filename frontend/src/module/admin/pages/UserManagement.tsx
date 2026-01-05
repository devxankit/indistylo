import { Search, MapPin, History } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserHistoryModal } from "../components/UserHistoryModal";

export function UserManagement() {
    const users = [
        { id: 1, name: "Rahul Sharma", phone: "+91 9876543210", email: "rahul@gmail.com", location: "Sector 15, Gurgaon", orders: 12 },
        { id: 2, name: "Sneha Gupta", phone: "+91 9876543211", email: "sneha@yahoo.com", location: "DLF Phase 3", orders: 5 },
    ];

    const [selectedUser, setSelectedUser] = useState<{ name: string; email: string } | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    const handleViewHistory = (user: { name: string; email: string }) => {
        setSelectedUser(user);
        setShowHistoryModal(true);
    };

    return (
        <div className="space-y-6">
            <UserHistoryModal
                user={selectedUser}
                open={showHistoryModal}
                onOpenChange={setShowHistoryModal}
            />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <Button
                    variant="outline"
                    className="!bg-white !text-black hover:!bg-gray-200"
                    onClick={() => toast.success("User data export started.")}
                >
                    Export User Data
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input type="text" placeholder="Search users by name, phone or email..." className="flex-1 bg-transparent border-none outline-none" />
            </div>

            <Card className="overflow-hidden border-border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr className="text-left text-sm font-medium text-muted-foreground">
                                <th className="p-4 pl-6">User Details</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Orders</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/20">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.email} • {user.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3 h-3 text-muted-foreground" />
                                            {user.location}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-medium">
                                            <History className="w-3 h-3 mr-1" />
                                            {user.orders} Orders
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:!bg-primary hover:!text-black"
                                            onClick={() => handleViewHistory(user)}
                                        >
                                            View History
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
