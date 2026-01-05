import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, BellOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockNotifications = [
  {
    id: "1",
    title: "Booking Confirmed",
    message: "Your haircut appointment with Dasho Salon is confirmed for tomorrow at 10:00 AM.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Exclusive Offer",
    message: "Get 20% off on your next spa session! Use code SPA20.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "3",
    title: "Points Earned",
    message: "You've earned 50 ISP points for your last referral.",
    time: "1 day ago",
    read: true,
  },
];

export function NotificationsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Notifications</h1>
      </header>

      <main className="p-4 space-y-4">
        {mockNotifications.length > 0 ? (
          mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-2xl border ${
                notification.read ? "bg-card border-border" : "bg-yellow-400/5 border-yellow-400"
              } flex gap-4`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notification.read ? "bg-muted text-muted-foreground" : "bg-yellow-400 text-gray-900"
              }`}>
                {notification.read ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className={`text-sm font-bold ${notification.read ? "text-foreground" : "text-yellow-400"}`}>
                    {notification.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{notification.message}</p>
                {!notification.read && (
                  <button className="text-[10px] font-bold text-yellow-400 flex items-center gap-1 mt-2">
                    <Check className="w-3 h-3" /> Mark as read
                  </button>
                )}
              </div>
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
