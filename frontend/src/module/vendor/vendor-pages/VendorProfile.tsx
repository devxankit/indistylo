import { useState, useRef, useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Settings, Bell, LogOut, Building2, Phone, Mail, MapPin, IndianRupee, Shield, FileText, Calendar, Users, Star, Award, Edit3, Target, ChevronRight, Camera } from 'lucide-react';
import { useVendorStore } from '../store/useVendorStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, transitions } from '@/lib/animations';
import { useCountUp } from '@/hooks/useCountUp';
import { useTouchFeedback } from '@/lib/touch';

// Memoized stat card component
const ProfileStatCard = memo(({ item, index }: { item: typeof achievements[0] | typeof stats[0]; index: number }) => {
  const Icon = item.icon;
  const { isActive, ...touchHandlers } = useTouchFeedback();
  
  // Parse numeric value if possible
  const numericValue = useMemo(() => {
    const match = item.value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }, [item.value]);
  
  const animatedValue = useCountUp(numericValue, { duration: 1500, decimals: item.value.includes('.') ? 1 : 0 });
  const displayValue = item.value.includes('₹')
    ? `₹${animatedValue.toLocaleString()}`
    : item.value.replace(/[\d.]+/, animatedValue.toString());

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-4 min-h-[100px] flex flex-col justify-between touch-manipulation active:scale-[0.98]"
      {...touchHandlers}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground flex-1">{item.label}</p>
      </div>
      <motion.p
        key={animatedValue}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={transitions.quick}
        className="text-lg font-bold text-foreground"
      >
        {displayValue}
      </motion.p>
    </motion.div>
  );
});

ProfileStatCard.displayName = 'ProfileStatCard';

export function VendorProfile() {
  const navigate = useNavigate();
  const { 
    vendorType, 
    businessName, 
    ownerName, 
    email, 
    phoneNumber,
    address,
    city,
    state,
    pincode,
    gstNumber,
    aadharNumber,
    experience,
    specialization
  } = useVendorStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          setAvatarUrl(reader.result as string);
          setIsUploading(false);
        }, 500); // Simulate upload delay
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const profileMenuItems = [
    {
      icon: Settings,
      label: 'Settings',
      description: 'Manage app settings',
      onClick: () => navigate('/vendor/settings'),
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Notification preferences',
      onClick: () => navigate('/vendor/notifications'),
    },
    {
      icon: FileText,
      label: 'Terms & Conditions',
      description: 'Read terms and conditions',
      onClick: () => navigate('/vendor/terms'),
    },
    {
      icon: Shield,
      label: 'Privacy Policy',
      description: 'Privacy and data policy',
      onClick: () => navigate('/vendor/privacy'),
    },
    {
      icon: LogOut,
      label: 'Logout',
      description: 'Sign out from your account',
      onClick: () => {
        navigate('/vendor/auth');
      },
      variant: 'destructive' as const,
    },
  ];

  const getVendorTypeLabel = () => {
    switch (vendorType) {
      case 'salon':
        return 'Salon Owner';
      case 'freelancer':
        return 'Freelancer';
      case 'spa':
        return 'SPA Owner';
      default:
        return 'Vendor';
    }
  };

  const achievements = [
    { icon: Star, label: 'Rating', value: '4.8' },
    { icon: Award, label: 'Reviews', value: '156' },
    { icon: Target, label: 'Success', value: '98%' },
  ];

  const stats = [
    { icon: IndianRupee, label: 'Total Revenue', value: '₹1,25,000' },
    { icon: Calendar, label: 'Bookings', value: '156' },
    { icon: Users, label: 'Customers', value: '89' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
      </div>

      <div className="px-4 py-6 space-y-5">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.smooth}
          className="bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={transitions.quick}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden border-2 border-background relative min-w-[80px] min-h-[80px]"
                animate={isUploading ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isUploading ? Infinity : 0 }}
              >
                <AnimatePresence mode="wait">
                  {avatarUrl ? (
                    <motion.img
                      key="avatar"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={transitions.smooth}
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <motion.span
                      key="emoji"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={transitions.smooth}
                      className="text-4xl"
                    >
                      👤
                    </motion.span>
                  )}
                </AnimatePresence>
                {isUploading && (
                  <motion.div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 min-w-[44px] min-h-[44px] bg-primary rounded-full flex items-center justify-center border-2 border-background shadow-lg touch-manipulation"
                aria-label="Change avatar"
              >
                <Camera className="w-4 h-4 text-black" />
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <h2 className="text-xl font-bold text-foreground truncate">
                      {businessName || 'Business Name'}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{getVendorTypeLabel()}</p>
                  {ownerName && (
                    <p className="text-xs text-muted-foreground">Owner: {ownerName}</p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 min-w-[44px] min-h-[44px] bg-muted/50 border border-border rounded-lg hover:border-primary/50 transition-colors flex-shrink-0 touch-manipulation flex items-center justify-center"
                  aria-label={isEditing ? "Cancel editing" : "Edit profile"}
                >
                  <motion.div
                    animate={isEditing ? { rotate: 180 } : { rotate: 0 }}
                    transition={transitions.smooth}
                  >
                    <Edit3 className="w-4 h-4 text-foreground" />
                  </motion.div>
                </motion.button>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-base font-semibold text-foreground">4.8</span>
                </div>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">156 reviews</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Combined Achievements and Business Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4"
        >
          {[...achievements, ...stats].map((item, index) => (
            <ProfileStatCard key={index} item={item} index={index} />
          ))}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.smooth}
          className="bg-card border border-border rounded-xl p-4 space-y-3"
        >
          <h2 className="text-sm font-semibold text-foreground">Contact Information</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {phoneNumber && (
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-lg min-h-[44px] touch-manipulation active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground flex-1">{phoneNumber}</span>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 min-w-[32px] min-h-[32px] touch-manipulation"
                    aria-label="Edit phone"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.button>
                )}
              </motion.div>
            )}
            {email && (
              <motion.div
                variants={staggerItem}
                className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-lg min-h-[44px] touch-manipulation active:scale-[0.98]"
              >
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground flex-1 truncate">{email}</span>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 min-w-[32px] min-h-[32px] touch-manipulation"
                    aria-label="Edit email"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.button>
                )}
              </motion.div>
            )}
            {address && (
              <motion.div
                variants={staggerItem}
                className="flex items-start gap-2.5 p-2.5 bg-muted/30 rounded-lg min-h-[44px] touch-manipulation active:scale-[0.98]"
              >
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{address}</p>
                  {(city || state || pincode) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[city, state, pincode].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                {isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 min-w-[32px] min-h-[32px] touch-manipulation flex-shrink-0"
                    aria-label="Edit address"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Business Details */}
        {(gstNumber || aadharNumber || experience || specialization) && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Business Details</h2>
            <div className="space-y-2">
              {gstNumber && (
                <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground">GST Number</span>
                  <span className="text-sm font-medium text-foreground">{gstNumber}</span>
                </div>
              )}
              {aadharNumber && (
                <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground">Aadhar Number</span>
                  <span className="text-sm font-medium text-foreground">{aadharNumber}</span>
                </div>
              )}
              {experience && (
                <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground">Experience</span>
                  <span className="text-sm font-medium text-foreground">{experience}</span>
                </div>
              )}
              {specialization && (
                <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                  <span className="text-xs text-muted-foreground">Specialization</span>
                  <span className="text-sm font-medium text-foreground">{specialization}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {profileMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={index}
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={item.onClick}
                className={cn(
                  'w-full flex items-center gap-3 p-3 min-h-[64px] bg-card border border-border rounded-xl hover:border-primary/50 transition-all text-left group touch-manipulation',
                  item.variant === 'destructive' && 'border-red-400/30 hover:border-red-400/50'
                )}
              >
                <motion.div
                  className={cn(
                    "p-1.5 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center",
                    item.variant === 'destructive' ? 'bg-red-400/10' : 'bg-primary/10 group-hover:bg-primary/20 transition-colors'
                  )}
                  animate={item.variant === 'destructive' ? {} : {
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Icon className={cn(
                    'w-4 h-4',
                    item.variant === 'destructive' ? 'text-red-400' : 'text-primary'
                  )} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-semibold',
                    item.variant === 'destructive' ? 'text-red-400' : 'text-foreground'
                  )}>
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                </div>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform group-hover:translate-x-1 flex-shrink-0",
                    item.variant === 'destructive' ? 'text-red-400' : 'text-muted-foreground'
                  )} />
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
