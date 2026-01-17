import { useState, useCallback, memo } from "react";
import {
  Phone,
  Building2,
  User,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  LogIn,
  UserPlus,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useVendorStore } from "../store/useVendorStore";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";
import { toast } from "sonner";
import { LocationPicker } from "../vendor-components/LocationPicker";

type VendorType = "salon" | "freelancer" | "spa" | null;
type AuthMode = "login" | "signup" | null;
type AuthStep =
  | "auth-mode"
  | "type-selection"
  | "phone-input"
  | "otp-verification"
  | "onboarding"
  | "pending-approval";

interface OnboardingFormData {
  businessName: string;
  ownerName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber?: string;
  aadharNumber?: string;
  experience?: string;
  specialization?: string;
  services?: string[];
  geo?: { lat: number; lng: number };
}

// Progress indicator component
const ProgressIndicator = memo(
  ({
    currentStep,
    totalSteps,
  }: {
    currentStep: number;
    totalSteps: number;
  }) => {
    return (
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "h-1.5 rounded-full",
              index < currentStep ? "bg-primary" : "bg-muted"
            )}
            initial={{ width: 0 }}
            animate={{ width: index < currentStep ? "100%" : "20px" }}
            transition={transitions.smooth}
          />
        ))}
      </div>
    );
  }
);

ProgressIndicator.displayName = "ProgressIndicator";

export function VendorAuth() {
  const navigate = useNavigate();
  const {
    vendorType,
    phoneNumber,
    setVendorType,
    setPhoneNumber,
    sendOtp,
    verifyOtp,
    updateProfile,
    uploadFile,
    error,
  } = useVendorStore();
  const [step, setStep] = useState<AuthStep>("auth-mode");

  const [aadharFront, setAadharFront] = useState<File | null>(null);
  const [aadharBack, setAadharBack] = useState<File | null>(null);
  const [gstCertificate, setGstCertificate] = useState<File | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormData>({
    businessName: "",
    ownerName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    aadharNumber: "",
    experience: "",
    specialization: "",
    services: [],
    geo: undefined,
  });

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      const success = await sendOtp(phoneNumber);
      if (success) {
        setStep("otp-verification");
        toast.success("OTP sent successfully");
      } else {
        toast.error(error || "Failed to send OTP");
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpVerify = useCallback(async () => {
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      try {
        const success = await verifyOtp(phoneNumber, otpValue);
        if (success) {
          setOtpError(false);
          if (authMode === "login") {
            navigate("/vendor/home");
            toast.success("Logged in successfully");
          } else {
            setStep("onboarding");
          }
        } else {
          setOtpError(true);
          // @ts-ignore
          if (useVendorStore.getState().error?.includes("pending approval")) {
            setStep("pending-approval");
          } else {
            toast.error(error || "Invalid OTP");
          }
        }
      } catch (err: any) {
        setOtpError(true);
        if (err.message.includes("pending approval") || (err.response && err.response.status === 403 && err.response.data?.message?.includes("Account pending approval"))) {
          setStep("pending-approval");
        } else {
          toast.error(error || "Invalid OTP");
        }
      }
    } else {
      setOtpError(true);
    }
  }, [otp, authMode, verifyOtp, phoneNumber, navigate, error]);

  const handleFormChange = (
    field: keyof OnboardingFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Upload documents
      const docs: any[] = [];

      if (aadharFront) {
        const url = await uploadFile(aadharFront);
        if (url) docs.push({ type: "aadhar_front", url, status: "pending" });
      }

      if (aadharBack) {
        const url = await uploadFile(aadharBack);
        if (url) docs.push({ type: "aadhar_back", url, status: "pending" });
      }

      if (gstCertificate) {
        const url = await uploadFile(gstCertificate);
        if (url) docs.push({ type: "gst_certificate", url, status: "pending" });
      }

      // 2. Submit profile with docs
      await updateProfile({
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        description: "",
        address: formData.address,
        email: formData.email, // Note: Store might not have businessEmail, check if it maps to email
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        category: "",
        gender: "" as any,
        gstNumber: formData.gstNumber,
        aadharNumber: formData.aadharNumber,
        experience: formData.experience,
        specialization: formData.specialization,
        verificationDocuments: docs.length > 0 ? docs : undefined,
        geo: formData.geo ? { type: "Point", coordinates: [formData.geo.lng, formData.geo.lat] } : undefined,
      });
      // Navigate to verification pending page
      navigate("/vendor/verification-pending");
      toast.success("Profile created successfully");
    } catch (error) {
      console.error("Onboarding failed:", error);
      toast.error("Failed to create profile");
    }
  };

  const vendorTypeOptions = [
    {
      type: "salon" as VendorType,
      title: "Salon Owner",
      description: "Own a salon or barbershop",
      icon: Building2,
      color: "bg-blue-500/10 text-blue-400 border-blue-400/20",
    },
    {
      type: "freelancer" as VendorType,
      title: "Freelancer",
      description: "Independent service provider",
      icon: User,
      color: "bg-purple-500/10 text-purple-400 border-purple-400/20",
    },
    {
      type: "spa" as VendorType,
      title: "SPA Owner",
      description: "Own a spa or wellness center",
      icon: Sparkles,
      color: "bg-pink-500/10 text-pink-400 border-pink-400/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        {step !== "auth-mode" && (
          <div className="px-4 py-3 flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (step === "phone-input") {
                  if (authMode === "login") {
                    setStep("auth-mode");
                  } else {
                    setStep("type-selection");
                  }
                } else if (step === "otp-verification") {
                  setStep("phone-input");
                } else if (step === "type-selection") {
                  setStep("auth-mode");
                } else if (step === "onboarding") {
                  setStep("otp-verification");
                }
              }}
              className="p-2 min-w-[44px] min-h-[44px] hover:bg-muted rounded-lg transition-colors touch-manipulation flex items-center justify-center"
              aria-label="Go back">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        )}
      </div>

      <div className="px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Auth Mode Selection (Login or Sign Up) */}
          {step === "auth-mode" && (
            <motion.div
              key="auth-mode"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={transitions.smooth}
              className="space-y-6 max-w-md mx-auto">
              <div className="text-center mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transitions.smooth, delay: 0.1 }}
                  className="text-2xl font-bold text-foreground mb-2">
                  Welcome to IndiStylo
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...transitions.smooth, delay: 0.2 }}
                  className="text-muted-foreground text-sm">
                  Choose an option to continue
                </motion.p>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3">
                <motion.button
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setAuthMode("login");
                    setStep("phone-input");
                  }}
                  className={cn(
                    "w-full p-5 min-h-[100px] rounded-xl border-2 transition-all text-left touch-manipulation",
                    authMode === "login"
                      ? "bg-blue-500/10 text-blue-400 border-blue-400 border-current"
                      : "bg-card border-border hover:border-primary/50 hover:bg-card/80"
                  )}>
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={cn(
                        "p-3 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center",
                        authMode === "login"
                          ? "bg-blue-400/20 scale-110"
                          : "bg-muted"
                      )}
                      animate={
                        authMode === "login" ? { rotate: [0, 10, -10, 0] } : {}
                      }
                      transition={{ duration: 0.5 }}>
                      <LogIn
                        className={cn(
                          "w-6 h-6 transition-colors",
                          authMode === "login"
                            ? "text-blue-400"
                            : "text-muted-foreground"
                        )}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 text-base">
                        Login
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Sign in to your existing account
                      </p>
                    </div>
                    <AnimatePresence>
                      {authMode === "login" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={transitions.quick}>
                          <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                <motion.button
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setAuthMode("signup");
                    setStep("type-selection");
                  }}
                  className={cn(
                    "w-full p-5 min-h-[100px] rounded-xl border-2 transition-all text-left touch-manipulation",
                    authMode === "signup"
                      ? "bg-purple-500/10 text-purple-400 border-purple-400 border-current"
                      : "bg-card border-border hover:border-primary/50 hover:bg-card/80"
                  )}>
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={cn(
                        "p-3 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center",
                        authMode === "signup"
                          ? "bg-purple-400/20 scale-110"
                          : "bg-muted"
                      )}
                      animate={
                        authMode === "signup" ? { rotate: [0, -10, 10, 0] } : {}
                      }
                      transition={{ duration: 0.5 }}>
                      <UserPlus
                        className={cn(
                          "w-6 h-6 transition-colors",
                          authMode === "signup"
                            ? "text-purple-400"
                            : "text-muted-foreground"
                        )}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 text-base">
                        Sign Up
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Create a new vendor account
                      </p>
                    </div>
                    <AnimatePresence>
                      {authMode === "signup" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={transitions.quick}>
                          <CheckCircle2 className="w-6 h-6 text-purple-400 shrink-0" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Vendor Type Selection (only for signup) */}
          {step === "type-selection" && (
            <motion.div
              key="type-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={transitions.smooth}
              className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={transitions.smooth}
                  className="text-foreground text-base mb-2">
                  Welcome to IndiStylo
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...transitions.smooth, delay: 0.1 }}
                  className="text-muted-foreground text-sm">
                  Select your vendor type to get started
                </motion.p>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3 mb-8">
                {vendorTypeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = vendorType === option.type;
                  return (
                    <motion.button
                      key={option.type}
                      variants={staggerItem}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setVendorType(option.type)}
                      className={cn(
                        "w-full p-5 min-h-[100px] rounded-xl border-2 transition-all text-left touch-manipulation",
                        isSelected
                          ? `${option.color} border-current`
                          : "bg-card border-border hover:border-primary/50 hover:bg-card/80"
                      )}>
                      <div className="flex items-start gap-4">
                        <motion.div
                          className={cn(
                            "p-3 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center",
                            isSelected ? "bg-current/20 scale-110" : "bg-muted"
                          )}
                          animate={
                            isSelected
                              ? {
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                              }
                              : {}
                          }
                          transition={{ duration: 0.5 }}>
                          <Icon
                            className={cn(
                              "w-6 h-6 transition-colors",
                              isSelected
                                ? "text-current"
                                : "text-muted-foreground"
                            )}
                          />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1 text-base">
                            {option.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={transitions.quick}>
                              <CheckCircle2 className="w-6 h-6 text-current shrink-0" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Phone Number Input */}
          {step === "phone-input" && (
            <motion.div
              key="phone-input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={transitions.smooth}
              className="space-y-6 max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={transitions.spring}
                className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}>
                  <Phone className="w-8 h-8 text-primary" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...transitions.smooth, delay: 0.2 }}
                  className="text-muted-foreground text-sm">
                  {authMode === "login"
                    ? "Enter your phone number to login"
                    : "We'll send you a verification code via SMS"}
                </motion.p>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transitions.smooth, delay: 0.3 }}>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-3 bg-card border border-border rounded-xl text-foreground font-medium min-w-[60px] text-center min-h-[44px] flex items-center justify-center">
                      +91
                    </div>
                    <motion.input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setPhoneNumber(value);
                      }}
                      placeholder="Enter 10-digit number"
                      className="flex-1 h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                      maxLength={10}
                      autoFocus
                      whileFocus={{ scale: 1.02 }}
                      transition={transitions.quick}
                    />
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ...transitions.smooth, delay: 0.4 }}
                    className="text-xs text-muted-foreground mt-3 text-center">
                    By continuing, you agree to our Terms & Conditions
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 4: OTP Verification */}
          {step === "otp-verification" && (
            <motion.div
              key="otp-verification"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={transitions.smooth}
              className="space-y-6 max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={transitions.spring}
                className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...transitions.smooth, delay: 0.2 }}
                  className="text-muted-foreground text-sm">
                  Enter the 4-digit code sent to <br />
                  <span className="font-medium text-foreground">
                    +91 {phoneNumber}
                  </span>
                </motion.p>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...transitions.smooth, delay: 0.3 }}
                  className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        handleOtpChange(index, e.target.value);
                        setOtpError(false);
                      }}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={cn(
                        "w-14 h-16 min-w-[56px] min-h-[64px] text-center text-2xl font-bold bg-card border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all touch-manipulation",
                        otpError
                          ? "border-red-400 focus:border-red-400"
                          : "border-border focus:border-primary"
                      )}
                      autoFocus={index === 0}
                      whileFocus={{ scale: 1.05 }}
                      animate={
                        otpError && index === otp.length - 1
                          ? {
                            x: [0, -10, 10, -10, 0],
                          }
                          : {}
                      }
                      transition={otpError && index === otp.length - 1 ? { duration: 0.5 } : transitions.quick}
                    />
                  ))}
                </motion.div>

                {otpError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-400 text-center">
                    Please enter all 4 digits
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...transitions.smooth, delay: 0.4 }}
                  className="text-center space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setStep("phone-input");
                    }}
                    className="text-sm text-primary hover:text-primary/80 font-medium min-h-[44px] px-4 touch-manipulation">
                    Resend OTP
                  </motion.button>
                  <p className="text-xs text-muted-foreground">
                    Code expires in 2:00
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Onboarding Form (only for signup) */}
          {step === "onboarding" && (
            <motion.form
              key="onboarding"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={transitions.smooth}
              onSubmit={handleOnboardingSubmit}
              className="space-y-6 max-w-2xl mx-auto pb-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transitions.smooth}
                className="text-center mb-6">
                <p className="text-muted-foreground text-sm">
                  {vendorType === "salon" && "Tell us about your salon"}
                  {vendorType === "freelancer" && "Tell us about yourself"}
                  {vendorType === "spa" && "Tell us about your spa"}
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-5">

                {/* Location Picker */}
                <motion.div variants={staggerItem} className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">
                    Pin Your Location (Move map to adjust)
                  </label>
                  <LocationPicker
                    onLocationSelect={(loc) => setFormData(prev => ({ ...prev, geo: loc }))}
                  />
                  {formData.geo && (
                    <p className="text-xs text-green-500">
                      Location pinned: {formData.geo.lat.toFixed(4)}, {formData.geo.lng.toFixed(4)}
                    </p>
                  )}
                </motion.div>

                {/* Business/Owner Name */}
                <motion.div variants={staggerItem}>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {vendorType === "freelancer"
                      ? "Your Name"
                      : "Business Name"}{" "}
                    *
                  </label>
                  <motion.input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleFormChange("businessName", e.target.value)
                    }
                    required
                    className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                    placeholder={
                      vendorType === "freelancer"
                        ? "Enter your full name"
                        : "Enter business name"
                    }
                    whileFocus={{ scale: 1.02 }}
                    transition={transitions.quick}
                  />
                </motion.div>

                {/* Owner Name (for salon and spa) */}
                {vendorType !== "freelancer" && (
                  <motion.div variants={staggerItem}>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Owner Name *
                    </label>
                    <motion.input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) =>
                        handleFormChange("ownerName", e.target.value)
                      }
                      required
                      className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                      placeholder="Enter owner's full name"
                      whileFocus={{ scale: 1.02 }}
                      transition={transitions.quick}
                    />
                  </motion.div>
                )}

                {/* Email */}
                <motion.div variants={staggerItem}>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Email Address *
                  </label>
                  <motion.input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    required
                    className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                    placeholder="Enter email address"
                    whileFocus={{ scale: 1.02 }}
                    transition={transitions.quick}
                  />
                </motion.div>

                {/* Address */}
                <motion.div variants={staggerItem}>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Address *
                  </label>
                  <motion.textarea
                    value={formData.address}
                    onChange={(e) =>
                      handleFormChange("address", e.target.value)
                    }
                    required
                    rows={3}
                    className="w-full min-h-[100px] px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground resize-none text-base touch-manipulation"
                    placeholder="Enter complete address"
                    whileFocus={{ scale: 1.01 }}
                    transition={transitions.quick}
                  />
                </motion.div>

                {/* City, State, Pincode */}
                <motion.div
                  variants={staggerItem}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      City *
                    </label>
                    <motion.input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleFormChange("city", e.target.value)}
                      required
                      className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                      placeholder="City"
                      whileFocus={{ scale: 1.02 }}
                      transition={transitions.quick}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      State *
                    </label>
                    <motion.input
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        handleFormChange("state", e.target.value)
                      }
                      required
                      className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                      placeholder="State"
                      whileFocus={{ scale: 1.02 }}
                      transition={transitions.quick}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Pincode *
                    </label>
                    <motion.input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        handleFormChange("pincode", value);
                      }}
                      required
                      maxLength={6}
                      className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                      placeholder="Pincode"
                      whileFocus={{ scale: 1.02 }}
                      transition={transitions.quick}
                    />
                  </div>
                </motion.div>

                {/* GST Number (for salon and spa) */}
                {vendorType !== "freelancer" && (
                  <>
                    <motion.div variants={staggerItem}>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        GST Number (Optional)
                      </label>
                      <motion.input
                        type="text"
                        value={formData.gstNumber}
                        onChange={(e) =>
                          handleFormChange("gstNumber", e.target.value)
                        }
                        className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                        placeholder="Enter GST number if available"
                        whileFocus={{ scale: 1.02 }}
                        transition={transitions.quick}
                      />
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        GST Certificate (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => e.target.files && setGstCertificate(e.target.files[0])}
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      />
                    </motion.div>
                  </>
                )}

                {/* Aadhar Number (All Vendors) */}
                <motion.div variants={staggerItem}>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Aadhar Number *
                  </label>
                  <motion.input
                    type="text"
                    value={formData.aadharNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 12);
                      handleFormChange("aadharNumber", value);
                    }}
                    required
                    maxLength={12}
                    className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                    placeholder="Enter 12-digit Aadhar number"
                    whileFocus={{ scale: 1.02 }}
                    transition={transitions.quick}
                  />
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div variants={staggerItem}>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Aadhar Card Front *
                    </label>
                    <input
                      type="file"
                      required
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files && setAadharFront(e.target.files[0])}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Aadhar Card Back *
                    </label>
                    <input
                      type="file"
                      required
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files && setAadharBack(e.target.files[0])}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </motion.div>
                </div>

                {/* Experience (for freelancer) */}
                {vendorType === "freelancer" && (
                  <motion.div variants={staggerItem}>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Years of Experience *
                    </label>
                    <motion.input
                      type="text"
                      value={formData.experience}
                      onChange={(e) =>
                        handleFormChange("experience", e.target.value)
                      }
                      required
                      className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                      placeholder="e.g., 5 years"
                      whileFocus={{ scale: 1.02 }}
                      transition={transitions.quick}
                    />
                  </motion.div>
                )}

                {/* Specialization (for freelancer) */}
                {vendorType === "freelancer" && (
                  <motion.div variants={staggerItem}>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Specialization *
                    </label>
                    <motion.input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) =>
                        handleFormChange("specialization", e.target.value)
                      }
                      required
                      className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
                      placeholder="e.g., Hair Styling, Makeup, etc."
                      whileFocus={{ scale: 1.02 }}
                      transition={transitions.quick}
                    />
                  </motion.div>
                )}
              </motion.div>
            </motion.form>
          )}

          {step === "pending-approval" && (
            <motion.div
              key="pending-approval"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center space-y-6">
              <div className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-yellow-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Application Under Review
                </h2>
                <p className="text-muted-foreground w-11/12 mx-auto">
                  Your vendor application is currently pending approval from our admin team.
                  We will notify you once your account is activated.
                </p>
              </div>

              <div className="p-4 bg-muted/20 border border-border rounded-xl text-left space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Profile Details Submitted</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Documents Uploaded</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
                  <span className="text-sm font-medium text-yellow-500">Awaiting Admin Verification</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep("phone-input");
                  setPhoneNumber("");
                  setOtp(["", "", "", ""]);
                }}
                className="w-full h-14 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl transition-all active:scale-[0.98]">
                Back to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Button for all steps */}
      {
        step !== "pending-approval" && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-area-bottom">
            {step === "auth-mode" && (
              <button
                onClick={() => {
                  if (authMode === "login") {
                    setStep("phone-input");
                  } else if (authMode === "signup") {
                    setStep("type-selection");
                  }
                }}
                disabled={!authMode}
                className={cn(
                  "w-full h-14 min-h-[44px] font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation",
                  !authMode
                    ? "bg-transparent border-2 border-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-yellow-400/10 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-500 hover:text-yellow-300 active:scale-[0.98]"
                )}>
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {step === "type-selection" && (
              <button
                onClick={() => vendorType && setStep("phone-input")}
                disabled={!vendorType}
                className={cn(
                  "w-full h-14 min-h-[44px] font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation",
                  !vendorType
                    ? "bg-transparent border-2 border-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-yellow-400/10 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-500 hover:text-yellow-300 active:scale-[0.98]"
                )}>
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {step === "phone-input" && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (phoneNumber.length === 10) {
                    handlePhoneSubmit(e as any);
                  }
                }}
                disabled={phoneNumber.length !== 10}
                className={cn(
                  "w-full h-14 min-h-[44px] font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation",
                  phoneNumber.length !== 10
                    ? "bg-transparent border-2 border-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-yellow-400/10 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-500 hover:text-yellow-300 active:scale-[0.98]"
                )}>
                {authMode === "login" ? "Login" : "Send OTP"}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {step === "otp-verification" && (
              <button
                onClick={handleOtpVerify}
                disabled={otp.join("").length !== 4}
                className={cn(
                  "w-full h-14 min-h-[44px] font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation",
                  otp.join("").length !== 4
                    ? "bg-transparent border-2 border-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-yellow-400/10 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-500 hover:text-yellow-300 active:scale-[0.98]"
                )}>
                {authMode === "login" ? "Login" : "Verify & Continue"}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {step === "onboarding" && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleOnboardingSubmit(e as any);
                }}
                className="w-full h-14 min-h-[44px] bg-yellow-400/10 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-500 hover:text-yellow-300 active:scale-[0.98] font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation">
                Complete Registration
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )
      }
    </div >
  );
}
