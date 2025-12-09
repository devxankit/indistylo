import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Settings, Bell, LogOut, Building2, Phone, Mail, MapPin, IndianRupee, Shield, FileText, Calendar, Users, Star, Award, Edit3, Target, ChevronRight } from 'lucide-react';
import { useVendorStore } from '../store/useVendorStore';
import { cn } from '@/lib/utils';

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const profileMenuItems = [
    {
      icon: Settings,
      label: 'Settings',
      description: 'Manage app settings',
      onClick: () => console.log('Settings clicked'),
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Notification preferences',
      onClick: () => console.log('Notifications clicked'),
    },
    {
      icon: FileText,
      label: 'Terms & Conditions',
      description: 'Read terms and conditions',
      onClick: () => console.log('Terms clicked'),
    },
    {
      icon: Shield,
      label: 'Privacy Policy',
      description: 'Privacy and data policy',
      onClick: () => console.log('Privacy clicked'),
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
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-background">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
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
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 bg-muted/50 border border-border rounded-lg hover:border-primary/50 transition-colors flex-shrink-0"
                >
                  <Edit3 className="w-4 h-4 text-foreground" />
                </button>
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
        </div>

        {/* Stats Grid - Combined Achievements and Business Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[...achievements, ...stats].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-4"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground flex-1">{item.label}</p>
                </div>
                <p className="text-lg font-bold text-foreground">{item.value}</p>
              </div>
            );
          })}
        </div>

        {/* Contact Information */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Contact Information</h2>
          <div className="space-y-2">
            {phoneNumber && (
              <div className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground flex-1">{phoneNumber}</span>
                {isEditing && <Pencil className="w-3.5 h-3.5 text-muted-foreground" />}
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2.5 p-2.5 bg-muted/30 rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground flex-1 truncate">{email}</span>
                {isEditing && <Pencil className="w-3.5 h-3.5 text-muted-foreground" />}
              </div>
            )}
            {address && (
              <div className="flex items-start gap-2.5 p-2.5 bg-muted/30 rounded-lg">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{address}</p>
                  {(city || state || pincode) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[city, state, pincode].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                {isEditing && <Pencil className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
              </div>
            )}
          </div>
        </div>

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
        <div className="space-y-2">
          {profileMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className={cn(
                  'w-full flex items-center gap-3 p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors text-left group',
                  item.variant === 'destructive' && 'border-red-400/30 hover:border-red-400/50'
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg",
                  item.variant === 'destructive' ? 'bg-red-400/10' : 'bg-primary/10 group-hover:bg-primary/20 transition-colors'
                )}>
                  <Icon className={cn(
                    'w-4 h-4',
                    item.variant === 'destructive' ? 'text-red-400' : 'text-primary'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-semibold',
                    item.variant === 'destructive' ? 'text-red-400' : 'text-foreground'
                  )}>
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform group-hover:translate-x-1 flex-shrink-0",
                  item.variant === 'destructive' ? 'text-red-400' : 'text-muted-foreground'
                )} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
