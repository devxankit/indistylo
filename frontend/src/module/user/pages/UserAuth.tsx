import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "../store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../services/authService";
import { toast } from "sonner";

export function UserAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUserStore();
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [name, setNameInput] = useState("");
  const [email, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tempAuthData, setTempAuthData] = useState<{
    user: any;
    token: string;
  } | null>(null);

  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setIsLoading(true);
      try {
        await authService.sendOTP(phone);
        setStep("otp");
      } catch (error: any) {
        toast.error(error.message || "Failed to send OTP");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 4) {
      setIsLoading(true);
      try {
        const response: any = await authService.verifyOTP(phone, enteredOtp, "CUSTOMER");
        if (response.isNewUser) {
          setTempAuthData({ user: response.user, token: response.token });
          setStep("profile");
        } else {
          login(response.user, response.token, response.customerProfile);
          toast.success("Logged in successfully!");
          navigate(from, { replace: true });
        }
      } catch (error: any) {
        toast.error(error.message || "Invalid OTP");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setIsLoading(true);
    try {
      if (tempAuthData) {
        // Log in first to set the token in localStorage for subsequent requests
        login(tempAuthData.user, tempAuthData.token);

        // Now update the profile with the token in place
        const profileResponse: any = await authService.updateProfile({ name, email });

        login(tempAuthData.user, tempAuthData.token, profileResponse.profile || profileResponse); // Update store with full details

        toast.success("Profile completed successfully!");
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
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

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="w-full h-14 bg-muted/50 border-none rounded-2xl pl-14 pr-4 text-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-lg font-semibold"
                  disabled={phone.length !== 10 || isLoading}>
                  {isLoading ? "Sending..." : "Continue"}
                </Button>
              </form>
            </motion.div>
          ) : step === "otp" ? (
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
                  We've sent a code to +91 {phone}
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-14 h-14 bg-muted/50 border-none rounded-2xl text-center text-2xl font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl text-lg font-semibold"
                    disabled={otp.join("").length !== 4 || isLoading}>
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="w-full text-center text-primary font-medium">
                    Resend Code
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Complete Your Profile
                </h1>
                <p className="text-muted-foreground">
                  Just a few more details to get started
                </p>
              </div>

              <form onSubmit={handleCompleteProfile} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full h-14 bg-muted/50 border-none rounded-2xl px-4 text-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full h-14 bg-muted/50 border-none rounded-2xl px-4 text-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-lg font-semibold mt-4"
                  disabled={!name.trim() || isLoading}>
                  {isLoading ? "Saving..." : "Get Started"}
                </Button>
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
