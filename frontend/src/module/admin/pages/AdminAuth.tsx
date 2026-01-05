import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function AdminAuth() {
    const navigate = useNavigate();
    const { login } = useAdminStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
            if (email && password) {
                login(email);
                toast.success("Welcome back, Admin!");
                navigate("/admin/dashboard");
            } else {
                toast.error("Invalid credentials");
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-900 grid lg:grid-cols-2">
            {/* Left Side - Brand/Illustration */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-gray-950 border-r border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/50">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">IndiStylo Admin</span>
                </div>

                <div className="space-y-6 max-w-lg">
                    <h1 className="text-5xl font-bold text-white leading-tight">
                        Manage your platform with confidence.
                    </h1>
                    <p className="text-xl text-gray-400">
                        Monitor vendors, track bookings, and oversee system health from one central control tower.
                    </p>
                </div>

                <div className="text-sm text-gray-500">
                    © 2024 IndiStylo Platform. v1.0.0
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold text-foreground">Sign in to Dashboard</h2>
                        <p className="text-muted-foreground">Enter your admin credentials to access the panel.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="admin@indistylo.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 text-base font-bold rounded-xl"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "Access Dashboard"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Restricted Access. Unauthorized attempts will be logged.
                    </p>
                </div>
            </div>
        </div>
    );
}
