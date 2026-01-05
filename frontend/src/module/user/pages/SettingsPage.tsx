import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Shield, Lock, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsPage() {
  const navigate = useNavigate();

  interface SettingsItem {
    icon: any;
    label: string;
    path?: string;
    danger?: boolean;
    type?: "toggle";
    value?: boolean;
  }

  interface SettingsGroup {
    group: string;
    items: SettingsItem[];
  }

  const settingsOptions: SettingsGroup[] = [
    {
      group: "Account",
      items: [
        { icon: Shield, label: "Privacy Settings", path: "/settings/privacy" },
        { icon: Lock, label: "Security & Password", path: "/settings/security" },
      ]
    },
    {
      group: "Preferences",
      items: [
        { icon: Moon, label: "Dark Mode", type: "toggle", value: true },
        { icon: Sun, label: "Light Mode", type: "toggle", value: false },
      ]
    },
    {
      group: "Danger Zone",
      items: [
        { icon: Trash2, label: "Delete Account", path: "/settings/delete", danger: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Settings</h1>
      </header>

      <main className="p-4 space-y-8">
        {settingsOptions.map((group) => (
          <div key={group.group} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
              {group.group}
            </h2>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {group.items.map((item, index) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${index !== group.items.length - 1 ? "border-b border-border" : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${item.danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-medium ${item.danger ? "text-destructive" : "text-foreground"}`}>
                      {item.label}
                    </span>
                  </div>
                  {item.type === "toggle" ? (
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${item.value ? "bg-yellow-400" : "bg-muted"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.value ? "right-1" : "left-1"}`} />
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center py-4">
          <p className="text-[10px] text-muted-foreground">App Version 1.0.0 (Build 2026.01)</p>
        </div>
      </main>
    </div>
  );
}
