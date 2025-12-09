import { useState } from 'react';
import { Phone, Building2, User, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useVendorStore } from '../store/useVendorStore';

type VendorType = 'salon' | 'freelancer' | 'spa' | null;
type AuthStep = 'type-selection' | 'phone-input' | 'otp-verification' | 'onboarding';

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
}

export function VendorAuth() {
  const navigate = useNavigate();
  const { vendorType, phoneNumber, setVendorType, setPhoneNumber, setAuthenticated, setProfile } = useVendorStore();
  const [step, setStep] = useState<AuthStep>('type-selection');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState<OnboardingFormData>({
    businessName: '',
    ownerName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    aadharNumber: '',
    experience: '',
    specialization: '',
    services: [],
  });

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      // Simulate OTP sending
      setStep('otp-verification');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpVerify = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      // Simulate OTP verification
      setStep('onboarding');
    }
  };

  const handleFormChange = (field: keyof OnboardingFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile to store
    setProfile({
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      gstNumber: formData.gstNumber,
      aadharNumber: formData.aadharNumber,
      experience: formData.experience,
      specialization: formData.specialization,
    });
    setAuthenticated(true);
    navigate('/vendor/home');
  };

  const vendorTypeOptions = [
    {
      type: 'salon' as VendorType,
      title: 'Salon Owner',
      description: 'Own a salon or barbershop',
      icon: Building2,
      color: 'bg-blue-500/10 text-blue-400 border-blue-400/20',
    },
    {
      type: 'freelancer' as VendorType,
      title: 'Freelancer',
      description: 'Independent service provider',
      icon: User,
      color: 'bg-purple-500/10 text-purple-400 border-purple-400/20',
    },
    {
      type: 'spa' as VendorType,
      title: 'SPA Owner',
      description: 'Own a spa or wellness center',
      icon: Sparkles,
      color: 'bg-pink-500/10 text-pink-400 border-pink-400/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      </div>

      <div className="px-4 py-6">
        {/* Step 1: Vendor Type Selection */}
        {step === 'type-selection' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <p className="text-foreground text-base mb-2">
                Welcome to IndiStylo
              </p>
              <p className="text-muted-foreground text-sm">
                Select your vendor type to get started
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {vendorTypeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = vendorType === option.type;
                return (
                  <button
                    key={option.type}
                    onClick={() => setVendorType(option.type)}
                    className={cn(
                      'w-full p-5 rounded-xl border-2 transition-all text-left hover:scale-[1.02] active:scale-[0.98]',
                      isSelected
                        ? `${option.color} border-current`
                        : 'bg-card border-border hover:border-primary/50 hover:bg-card/80'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'p-3 rounded-lg transition-all',
                          isSelected ? 'bg-current/20 scale-110' : 'bg-muted'
                        )}
                      >
                        <Icon className={cn('w-6 h-6 transition-colors', isSelected ? 'text-current' : 'text-muted-foreground')} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1 text-base">{option.title}</h3>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-current shrink-0 animate-in fade-in zoom-in duration-200" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Phone Number Input */}
        {step === 'phone-input' && (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">
                We'll send you a verification code via SMS
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Phone Number
                </label>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-3 bg-card border border-border rounded-xl text-foreground font-medium min-w-[60px] text-center">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhoneNumber(value);
                    }}
                    placeholder="Enter 10-digit number"
                    className="flex-1 h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                    maxLength={10}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  By continuing, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: OTP Verification */}
        {step === 'otp-verification' && (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">
                Enter the 6-digit code sent to <br />
                <span className="font-medium text-foreground">+91 {phoneNumber}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-14 h-16 text-center text-2xl font-bold bg-card border-2 border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <div className="text-center space-y-2">
                <button
                  type="submit" form="onboarding-form"
                  onClick={() => {
                    setStep('phone-input');
                  }}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Resend OTP
                </button>
                <p className="text-xs text-muted-foreground">Code expires in 2:00</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Onboarding Form */}
        {step === 'onboarding' && (
          <form id="onboarding-form" onSubmit={handleOnboardingSubmit} className="space-y-6 max-w-2xl mx-auto pb-6">
            <div className="text-center mb-6">
              <p className="text-muted-foreground text-sm">
                {vendorType === 'salon' && 'Tell us about your salon'}
                {vendorType === 'freelancer' && 'Tell us about yourself'}
                {vendorType === 'spa' && 'Tell us about your spa'}
              </p>
            </div>

            <div className="space-y-5">
              {/* Business/Owner Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {vendorType === 'freelancer' ? 'Your Name' : 'Business Name'} *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleFormChange('businessName', e.target.value)}
                  required
                  className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                  placeholder={vendorType === 'freelancer' ? 'Enter your full name' : 'Enter business name'}
                />
              </div>

              {/* Owner Name (for salon and spa) */}
              {vendorType !== 'freelancer' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleFormChange('ownerName', e.target.value)}
                    required
                    className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                    placeholder="Enter owner's full name"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  required
                  className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                  placeholder="Enter email address"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground resize-none text-base"
                  placeholder="Enter complete address"
                />
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleFormChange('city', e.target.value)}
                    required
                    className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleFormChange('state', e.target.value)}
                    required
                    className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleFormChange('pincode', value);
                    }}
                    required
                    maxLength={6}
                    className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                    placeholder="Pincode"
                  />
                </div>
              </div>

              {/* GST Number (for salon and spa) */}
              {vendorType !== 'freelancer' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => handleFormChange('gstNumber', e.target.value)}
                    className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                    placeholder="Enter GST number if available"
                  />
                </div>
              )}

              {/* Aadhar Number (for freelancer) */}
              {vendorType === 'freelancer' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Aadhar Number *
                  </label>
                  <input
                    type="text"
                    value={formData.aadharNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                      handleFormChange('aadharNumber', value);
                    }}
                    required
                    maxLength={12}
                    className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                    placeholder="Enter 12-digit Aadhar number"
                  />
                </div>
              )}

              {/* Experience (for freelancer) */}
              {vendorType === 'freelancer' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Years of Experience *
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => handleFormChange('experience', e.target.value)}
                    required
                    className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                    placeholder="e.g., 5 years"
                  />
                </div>
              )}

              {/* Specialization (for freelancer) */}
              {vendorType === 'freelancer' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => handleFormChange('specialization', e.target.value)}
                    required
                    className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base"
                    placeholder="e.g., Hair Styling, Makeup, etc."
                  />
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Fixed Bottom Button for all steps */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-area-bottom">
        {step === 'type-selection' && (
          <button
            onClick={() => vendorType && setStep('phone-input')}
            disabled={!vendorType}
            className={cn(
              "w-full h-14 font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2",
              !vendorType
                ? "bg-transparent border-2 border-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-yellow-400/10 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-500 hover:text-yellow-300 active:scale-[0.98]"
            )}
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
        {step === 'phone-input' && (
          <button
            type="submit" form="onboarding-form"
            onClick={(e) => {
              e.preventDefault();
              if (phoneNumber.length === 10) {
                handlePhoneSubmit(e as any);
              }
            }}
            disabled={phoneNumber.length !== 10}
            className={cn(
              "w-full h-14 font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2",
              phoneNumber.length !== 10
                ? "bg-transparent border-2 border-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-yellow-400/10 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-500 hover:text-yellow-300 active:scale-[0.98]"
            )}
          >
            Send OTP
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
        {step === 'otp-verification' && (
          <button
            onClick={handleOtpVerify}
            disabled={otp.join('').length !== 6}
            className={cn(
              "w-full h-14 font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2",
              otp.join('').length !== 6
                ? "bg-transparent border-2 border-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-yellow-400/10 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-500 hover:text-yellow-300 active:scale-[0.98]"
            )}
          >
            Verify & Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
        {step === 'onboarding' && (
          <button
            type="submit" form="onboarding-form"
            className="w-full h-14 bg-yellow-400/10 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:border-yellow-500 hover:text-yellow-300 active:scale-[0.98] font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Complete Registration
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}





