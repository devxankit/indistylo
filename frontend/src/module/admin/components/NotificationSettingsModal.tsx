
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Bell, Mail, Shield, Smartphone } from "lucide-react";

interface NotificationSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NotificationSettingsModal({ open, onOpenChange }: NotificationSettingsModalProps) {
    const [settings, setSettings] = useState({
        emailAlerts: true,
        pushNotifications: true,
        securityAlerts: true,
        marketing: false
    });

    const handleSave = () => {
        toast.success("Notification preferences saved");
        onOpenChange(false);
    };

    const ToggleItem = ({
        title,
        description,
        checked,
        onChange,
        icon: Icon
    }: {
        title: string;
        description: string;
        checked: boolean;
        onChange: (checked: boolean) => void;
        icon: any;
    }) => (
        <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-background rounded-lg border border-border/50 shadow-sm mt-0.5">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <p className="font-medium text-sm leading-none">{title}</p>
                    <p className="text-sm text-muted-foreground leading-snug max-w-[260px]">
                        {description}
                    </p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-full">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold tracking-tight">Notification Preferences</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Choose how you want to be notified about activity.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <ToggleItem
                        title="Email Alerts"
                        description="Receive daily summaries and critical system alerts via email."
                        checked={settings.emailAlerts}
                        onChange={(val) => setSettings({ ...settings, emailAlerts: val })}
                        icon={Mail}
                    />
                    <ToggleItem
                        title="Push Notifications"
                        description="Get real-time updates directly on your dashboard."
                        checked={settings.pushNotifications}
                        onChange={(val) => setSettings({ ...settings, pushNotifications: val })}
                        icon={Smartphone}
                    />
                    <ToggleItem
                        title="Security Alerts"
                        description="Immediate notifications for suspicious login attempts."
                        checked={settings.securityAlerts}
                        onChange={(val) => setSettings({ ...settings, securityAlerts: val })}
                        icon={Shield}
                    />
                </div>

                <DialogFooter className="pt-4 gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-10 px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="h-10 px-6 !bg-primary !text-black hover:!bg-primary/90 font-medium"
                    >
                        Save Preferences
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
