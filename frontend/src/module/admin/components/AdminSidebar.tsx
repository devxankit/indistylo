import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Store,
    Users,
    CalendarCheck,
    IndianRupee,
    Settings,
    LogOut,
    Files,
    UserPlus,
    X,
    Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "../store/useAdminStore";

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const location = useLocation();
    const { logout } = useAdminStore();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
        { icon: UserPlus, label: "Approve Vendor", path: "/admin/vendors/pending" },
        { icon: Store, label: "Active Vendor", path: "/admin/vendors/active" },
        { icon: Users, label: "Users", path: "/admin/users" },
        { icon: CalendarCheck, label: "Bookings", path: "/admin/bookings" },
        { icon: IndianRupee, label: "Finance", path: "/admin/finance" },
        { icon: Layers, label: "Salon Categories", path: "/admin/salon-categories" },
        { icon: Layers, label: "Spa Categories", path: "/admin/spa-categories" },
        { icon: Files, label: "Content", path: "/admin/content" },
        { icon: Settings, label: "Settings", path: "/admin/settings" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex items-center justify-between border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold">I</span>
                        </div>
                        <span className="font-bold text-xl">IndiStylo</span>
                    </div>
                    <button onClick={onClose} className="md:hidden">
                        <X className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose?.()}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                                    isActive
                                        ? "bg-primary !text-black shadow-md shadow-primary/20"
                                        : "!text-muted-foreground hover:bg-muted hover:!text-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
