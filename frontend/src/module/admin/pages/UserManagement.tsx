import { Search, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { UserHistoryModal } from "../components/UserHistoryModal";
import { AddCustomerModal } from "../components/AddCustomerModal";
import { useAdminStore } from "../store/useAdminStore";

export function UserManagement() {
  const { users, fetchUsers, isLoading } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const handleViewHistory = (user: any) => {
    setSelectedUser(user);
    setShowHistoryModal(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );

  if (isLoading && users.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserHistoryModal
        user={selectedUser}
        open={showHistoryModal}
        onOpenChange={setShowHistoryModal}
      />
      <AddCustomerModal
        open={showAddCustomerModal}
        onOpenChange={setShowAddCustomerModal}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <div className="flex gap-2">
          <Button
            className="!bg-primary !text-black hover:!bg-primary/90"
            onClick={() => setShowAddCustomerModal(true)}>
            Add Customer
          </Button>
          <Button
            variant="outline"
            className="!bg-white !text-black hover:!bg-gray-200"
            onClick={() => toast.success("User data export started.")}>
            Export User Data
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users by name, phone or email..."
          className="flex-1 bg-transparent border-none outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-left text-sm font-medium text-muted-foreground">
                <th className="p-4 pl-6">User Details</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-8 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-muted/20">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {user.name || "Anonymous"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.email} • {user.phone || "No phone"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {user.address || "No address"}
                      </div>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:!bg-primary hover:!text-black"
                        onClick={() => handleViewHistory(user)}>
                        View History
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
