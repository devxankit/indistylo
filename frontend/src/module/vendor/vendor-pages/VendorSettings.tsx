import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Moon,
  Volume2,
  Shield,
  Lock,
  Save,
  Globe,
  Languages,
  Smartphone,
  Mail,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";

interface SettingItem {
  id: string;
  label: string;
  description: string;
  type: "toggle" | "select" | "button";
  value?: boolean | string;
  options?: { label: string; value: string }[];
  icon?: typeof Bell;
  action?: () => void;
}

export function VendorSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    soundEnabled: true,
    darkMode: true,
    language: "en",
    currency: "INR",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = useCallback((key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSelect = useCallback(
    (key: keyof typeof settings, value: string | boolean) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSave = useCallback(() => {
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const notificationSettings: SettingItem[] = useMemo(
    () => [
      {
        id: "push",
        label: "Push Notifications",
        description: "Receive push notifications on your device",
        type: "toggle",
        value: settings.pushNotifications,
        icon: Bell,
        action: () => handleToggle("pushNotifications"),
      },
      {
        id: "email",
        label: "Email Notifications",
        description: "Receive notifications via email",
        type: "toggle",
        value: settings.emailNotifications,
        icon: Mail,
        action: () => handleToggle("emailNotifications"),
      },
      {
        id: "sms",
        label: "SMS Notifications",
        description: "Receive notifications via SMS",
        type: "toggle",
        value: settings.smsNotifications,
        icon: MessageSquare,
        action: () => handleToggle("smsNotifications"),
      },
    ],
    [
      settings.pushNotifications,
      settings.emailNotifications,
      settings.smsNotifications,
      handleToggle,
    ]
  );

  const appSettings: SettingItem[] = useMemo(
    () => [
      {
        id: "sound",
        label: "Sound Effects",
        description: "Play sounds for notifications",
        type: "toggle",
        value: settings.soundEnabled,
        icon: Volume2,
        action: () => handleToggle("soundEnabled"),
      },
      {
        id: "theme",
        label: "Dark Mode",
        description: "Use dark theme",
        type: "toggle",
        value: settings.darkMode,
        icon: Moon,
        action: () => handleToggle("darkMode"),
      },
      {
        id: "language",
        label: "Language",
        description: "Select your preferred language",
        type: "select",
        value: settings.language,
        options: [
          { label: "English", value: "en" },
          { label: "Hindi", value: "hi" },
          { label: "Gujarati", value: "gu" },
          { label: "Marathi", value: "mr" },
        ],
        icon: Languages,
      },
      {
        id: "currency",
        label: "Currency",
        description: "Select your preferred currency",
        type: "select",
        value: settings.currency,
        options: [
          { label: "Indian Rupee (₹)", value: "INR" },
          { label: "US Dollar ($)", value: "USD" },
        ],
        icon: Globe,
      },
    ],
    [
      settings.soundEnabled,
      settings.darkMode,
      settings.language,
      settings.currency,
      handleToggle,
    ]
  );

  const securitySettings: SettingItem[] = useMemo(
    () => [
      {
        id: "change-password",
        label: "Change Password",
        description: "Update your account password",
        type: "button",
        icon: Lock,
        action: () => console.log("Change password"),
      },
      {
        id: "two-factor",
        label: "Two-Factor Authentication",
        description: "Add an extra layer of security",
        type: "toggle",
        value: false,
        icon: Shield,
        action: () => console.log("Toggle 2FA"),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-3 py-2 flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/vendor/profile")}
            className="p-2 min-w-[44px] min-h-[44px] hover:bg-muted rounded-lg transition-colors touch-manipulation flex items-center justify-center"
            aria-label="Go back">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your app preferences
            </p>
          </div>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex items-center gap-1 text-green-400">
              <CheckCircle2 className="w-4 h-4" />
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Notification Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="space-y-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2">
            {notificationSettings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <motion.div
                  key={setting.id}
                  variants={staggerItem}
                  className="bg-card border border-border rounded-xl p-4 touch-manipulation">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {Icon && (
                        <div className="p-2 bg-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {setting.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={setting.action}
                      className={cn(
                        "relative w-12 h-6 rounded-full transition-colors min-w-[48px] min-h-[24px] touch-manipulation",
                        setting.value ? "bg-primary" : "bg-muted"
                      )}
                      aria-label={`Toggle ${setting.label}`}>
                      <motion.div
                        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{ x: setting.value ? 20 : 0 }}
                        transition={transitions.quick}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* App Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.2 }}
          className="space-y-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            App Preferences
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2">
            {appSettings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <motion.div
                  key={setting.id}
                  variants={staggerItem}
                  className="bg-card border border-border rounded-xl p-4 touch-manipulation">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {Icon && (
                        <div className="p-2 bg-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {setting.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    {setting.type === "toggle" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={setting.action}
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-colors min-w-[48px] min-h-[24px] touch-manipulation",
                          setting.value ? "bg-primary" : "bg-muted"
                        )}
                        aria-label={`Toggle ${setting.label}`}>
                        <motion.div
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{ x: setting.value ? 20 : 0 }}
                          transition={transitions.quick}
                        />
                      </motion.button>
                    )}
                    {setting.type === "select" && (
                      <select
                        value={setting.value as string}
                        onChange={(e) =>
                          handleSelect(
                            setting.id as keyof typeof settings,
                            e.target.value
                          )
                        }
                        className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[36px] touch-manipulation">
                        {setting.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Security Settings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.3 }}
          className="space-y-3">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2">
            {securitySettings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <motion.button
                  key={setting.id}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={setting.action}
                  className="w-full bg-card border border-border rounded-xl p-4 text-left touch-manipulation">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {Icon && (
                        <div className="p-2 bg-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {setting.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    {setting.type === "toggle" && (
                      <motion.div
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-colors min-w-[48px] min-h-[24px]",
                          setting.value ? "bg-primary" : "bg-muted"
                        )}>
                        <motion.div
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{ x: setting.value ? 20 : 0 }}
                          transition={transitions.quick}
                        />
                      </motion.div>
                    )}
                    {setting.type === "button" && (
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}>
                        <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.4 }}
          className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full h-14 min-h-[44px] bg-primary/10 text-primary border-2 border-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors touch-manipulation flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            Save Changes
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
