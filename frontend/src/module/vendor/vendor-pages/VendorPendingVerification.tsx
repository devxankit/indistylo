import { motion } from "framer-motion";
import { Clock, MessageSquare, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useVendorStore } from "../store/useVendorStore";
import { transitions } from "@/lib/animations";

export default function VendorPendingVerification() {
    const navigate = useNavigate();
    const { reset, fetchProfile, status } = useVendorStore();

    useEffect(() => {
        // Initial check
        fetchProfile();

        // Poll every 5 seconds
        const interval = setInterval(() => {
            fetchProfile();
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchProfile]);

    useEffect(() => {
        if (status === "active") {
            navigate("/vendor/home");
        }
    }, [status, navigate]);

    const handleLogout = () => {
        reset();
        navigate("/vendor/auth");
    };

    return (
        <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={transitions.spring}
                className="relative z-10 max-w-sm mx-auto space-y-8">

                {/* Animated Icon */}
                <div className="relative">
                    <motion.div
                        className="w-24 h-24 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}>
                        <Clock className="w-12 h-12 text-yellow-400" />
                    </motion.div>
                    <motion.div
                        className="absolute -top-1 -right-1 w-8 h-8 bg-background rounded-full flex items-center justify-center p-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}>
                        <div className="w-full h-full bg-yellow-400 rounded-full animate-pulse" />
                    </motion.div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-foreground">
                        Verification Pending
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground leading-relaxed">
                        Your account is currently under review by our team. This process usually takes 24-48 hours. We'll notify you once your account is approved.
                    </motion.p>
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3 pt-4">
                    <button className="w-full h-14 bg-card border border-border rounded-xl flex items-center justify-between px-6 hover:border-primary/50 transition-colors group">
                        <span className="flex items-center gap-3 font-medium text-foreground">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Contact Support
                        </span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full h-14 bg-transparent border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
