import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminStore } from "../store/useAdminStore";
import { Bell, Search, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminNotificationModal } from "./AdminNotificationModal";

export function AdminLayout() {
    const { isAuthenticated, currentUser, notifications, fetchNotifications } = useAdminStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
        }
    }, [isAuthenticated, fetchNotifications]);

    if (!isAuthenticated) {
        return <Navigate to="/admin/auth" replace />;
    }

    const hasUnread = notifications?.some(n => !n.read);

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <AdminNotificationModal open={showNotifications} onOpenChange={setShowNotifications} />

            <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border h-16 px-4 md:px-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 hover:bg-muted rounded-lg md:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="relative w-full max-w-sm hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Global search..."
                                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-transparent rounded-lg focus:bg-background focus:border-primary/50 focus:outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowNotifications(true)}
                            className="relative p-2 hover:bg-muted rounded-full transition-colors"
                        >
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            {hasUnread && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
                            )}
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                                <p className="text-xs text-muted-foreground mt-1 capitalize">{currentUser?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-border">
                                <img src={currentUser?.avatar} alt="Admin" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
