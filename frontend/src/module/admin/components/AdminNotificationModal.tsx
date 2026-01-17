import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Bell,
    CheckCheck,
    Info,
    AlertTriangle,
    CheckCircle2,
    Trash2,
} from "lucide-react";
import { useAdminStore, type AdminNotification } from "../store/useAdminStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AdminNotificationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AdminNotificationModal({ open, onOpenChange }: AdminNotificationModalProps) {
    const { notifications, markAsRead, markAllAsRead, clearNotifications, deleteNotification } = useAdminStore();
    const navigate = useNavigate();

    const getIcon = (type: AdminNotification['type']) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'info':
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const handleNotificationClick = (notification: AdminNotification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.link) {
            navigate(notification.link);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b border-border bg-muted/40 flex flex-row items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Bell className="w-5 h-5 text-primary" />
                            {notifications.some(n => !n.read) && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold">Notifications</DialogTitle>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-muted-foreground hover:text-primary"
                                onClick={markAllAsRead}
                                title="Mark all as read"
                            >
                                <CheckCheck className="w-4 h-4 mr-1.5" /> Mark all read
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="h-[500px] w-full overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 text-muted-foreground">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-lg font-medium text-foreground">All caught up!</p>
                            <p className="text-sm mt-1 max-w-[200px]">
                                You don't have any new notifications at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={cn(
                                        "flex gap-4 p-4 transition-all hover:bg-muted/50 cursor-pointer group relative",
                                        !notification.read ? "bg-primary/5" : "bg-transparent"
                                    )}
                                >
                                    <div className={cn(
                                        "mt-1 p-2 rounded-full border shadow-sm shrink-0 h-fit",
                                        !notification.read ? "bg-background border-primary/20" : "bg-muted border-transparent"
                                    )}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1 pr-8">
                                        <div className="flex justify-between items-start">
                                            <p className={cn("text-sm font-medium leading-none", !notification.read && "text-primary")}>
                                                {notification.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                {notification.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(notification.id);
                                        }}
                                        title="Delete notification"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                    {!notification.read && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="p-3 border-t border-border bg-muted/40 flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive w-full hover:bg-destructive/10"
                            onClick={clearNotifications}
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Clear all notifications
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
