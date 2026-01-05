
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, ShoppingBag, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AdminLiveFeedModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FeedItem {
    id: number;
    type: 'order' | 'vendor' | 'alert' | 'system';
    message: string;
    time: string;
}

export function AdminLiveFeedModal({ open, onOpenChange }: AdminLiveFeedModalProps) {
    const [feed, setFeed] = useState<FeedItem[]>([
        { id: 1, type: 'order', message: "New order #12345 received for Glamour Cuts", time: "Just now" },
        { id: 2, type: 'vendor', message: "New vendor 'Urban Spa' registered", time: "2 mins ago" },
        { id: 3, type: 'alert', message: "High server load detected", time: "5 mins ago" },
        { id: 4, type: 'system', message: "Daily backup completed successfully", time: "1 hour ago" },
    ]);

    // Simulate live updates
    useEffect(() => {
        if (!open) return;

        const interval = setInterval(() => {
            const newItem: FeedItem = {
                id: Date.now(),
                type: 'order',
                message: `New order #${Math.floor(Math.random() * 90000) + 10000} received`,
                time: "Just now"
            };
            setFeed(prev => [newItem, ...prev].slice(0, 20)); // Keep last 20
        }, 4000);

        return () => clearInterval(interval);
    }, [open]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <ShoppingBag className="w-4 h-4 text-blue-500" />;
            case 'vendor': return <UserPlus className="w-4 h-4 text-orange-500" />;
            case 'alert': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'system': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <DialogTitle>Live Activity Feed</DialogTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Real-time updates across the platform.
                    </p>
                </DialogHeader>

                <div className="h-[400px] w-full pr-4 overflow-y-auto">
                    <div className="space-y-4">
                        {feed.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-muted/30 border border-border/50 animate-in slide-in-from-left-2 duration-300">
                                <div className="mt-1 bg-background p-2 rounded-full border border-border shadow-sm">
                                    {getIcon(item.type)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{item.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md">
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
