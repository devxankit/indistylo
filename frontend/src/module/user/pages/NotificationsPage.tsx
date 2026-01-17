import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Bell, BellOff, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "../store/useNotificationStore";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-yellow-400 hover:text-yellow-500 font-bold"
            onClick={markAllAsRead}
          >
            Mark all read
          </Button>
        )}
      </header>

      <main className="p-4 space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl border border-border flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/6" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-2xl border transition-all ${
                notification.isRead
                  ? "bg-card border-border"
                  : "bg-yellow-400/5 border-yellow-400"
              } flex gap-4 relative group`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notification.isRead
                    ? "bg-muted text-muted-foreground"
                    : "bg-yellow-400 text-gray-900"
                }`}
              >
                {notification.isRead ? (
                  <BellOff className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start pr-6">
                  <h3
                    className={`text-sm font-bold ${
                      notification.isRead ? "text-foreground" : "text-yellow-400"
                    }`}
                  >
                    {notification.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-[10px] font-bold text-yellow-400 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Mark as read
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteNotification(notification._id)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </main>
    </div>
  );
}

