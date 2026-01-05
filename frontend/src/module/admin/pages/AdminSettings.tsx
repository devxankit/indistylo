import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Bell, Users } from "lucide-react";
import { useState } from "react";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { NotificationSettingsModal } from "../components/NotificationSettingsModal";
import { ReferralSettingsModal } from "../components/ReferralSettingsModal";

export function AdminSettings() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false);

    return (
        <div className="space-y-6">
            <ChangePasswordModal open={showPasswordModal} onOpenChange={setShowPasswordModal} />
            <NotificationSettingsModal open={showNotificationsModal} onOpenChange={setShowNotificationsModal} />
            <ReferralSettingsModal open={showReferralModal} onOpenChange={setShowReferralModal} />

            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Security Settings</h3>
                            <p className="text-sm text-muted-foreground">Manage password and security preferences.</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="!bg-white !text-black hover:!bg-gray-200"
                        onClick={() => setShowPasswordModal(true)}
                    >
                        Change Password
                    </Button>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Bell className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            <p className="text-sm text-muted-foreground">Configure push and email notifications.</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="!bg-white !text-black hover:!bg-gray-200"
                        onClick={() => setShowNotificationsModal(true)}
                    >
                        Manage Notifications
                    </Button>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Referral Program</h3>
                            <p className="text-sm text-muted-foreground">Customize referral steps, rewards text, and terms.</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="!bg-white !text-black hover:!bg-gray-200"
                        onClick={() => setShowReferralModal(true)}
                    >
                        Configure Program
                    </Button>
                </Card>
            </div>
        </div>
    );
}
