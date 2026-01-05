import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "../store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";

export function UserAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUserStore();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setStep("otp");
      }, 1000);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 4) {
      setIsLoading(true);
      // Simulate API verification
      setTimeout(() => {
        setIsLoading(false);
        login(phone);
        navigate(from, { replace: true });
      }, 1000);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <header className="flex items-center gap-4 mb-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === "otp" ? setStep("phone") : navigate(-1))}
          className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === "phone" ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome to Indistylo
                </h1>
                <p className="text-muted-foreground">
                  Enter your phone number to continue
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-8">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3 border-border">
                    <span className="text-foreground font-medium">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="Enter Phone Number"
                    className="w-full pl-20 pr-4 py-4 bg-card border border-border rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  disabled={phone.length !== 10 || isLoading}
                  className="w-full py-7 rounded-2xl text-lg font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-400/20">
                  {isLoading ? "Sending..." : "Continue"}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Verify OTP
                </h1>
                <p className="text-muted-foreground">
                  We've sent a 4-digit code to{" "}
                  <span className="text-foreground font-semibold">
                    +91 {phone}
                  </span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="flex justify-between gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-16 h-16 text-center text-2xl font-bold bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    disabled={otp.some((d) => !d) || isLoading}
                    className="w-full py-7 rounded-2xl text-lg font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-400/20">
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="w-full text-center text-sm text-primary font-medium hover:underline">
                    Resend Code
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto text-center space-y-4 pb-6">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure encryption & privacy protection</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            By continuing, you agree to our <br />
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>
          </p>
        </div>
      </main>
    </div>
  );
}
