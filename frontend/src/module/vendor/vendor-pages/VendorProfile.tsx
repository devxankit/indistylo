import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Settings, Bell, LogOut, Building2, Phone, Mail, MapPin, IndianRupee, Shield, FileText, Calendar, Users } from 'lucide-react';
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
    pincode 
  } = useVendorStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

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
      onClick: () => console.log('Settings clicked'),
    },
    {
      icon: Bell,
      label: 'Notifications',
      onClick: () => console.log('Notifications clicked'),
    },
    {
      icon: FileText,
      label: 'Terms & Conditions',
      onClick: () => console.log('Terms clicked'),
    },
    {
      icon: Shield,
      label: 'Privacy Policy',
      onClick: () => console.log('Privacy clicked'),
    },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: () => {
        // Handle logout
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

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Section */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">👤</span>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gray-900 border-2 border-background flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <Pencil className="h-4 w-4 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 pt-2">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold text-foreground">
                {businessName || 'Business Name'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{getVendorTypeLabel()}</p>
            {ownerName && (
              <p className="text-sm text-muted-foreground mt-1">Owner: {ownerName}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h2 className="text-base font-semibold text-foreground mb-3">Contact Information</h2>
          
          <div className="space-y-3">
            {phoneNumber && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{phoneNumber}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{email}</span>
              </div>
            )}
            {address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{address}</p>
                  {(city || state || pincode) && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {[city, state, pincode].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              // Navigate to edit profile
              console.log('Edit profile clicked');
            }}
            className="w-full mt-4 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-lg text-sm font-medium hover:bg-yellow-400/20 transition-colors flex items-center justify-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Business Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <IndianRupee className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-lg font-bold text-foreground">₹12.5k</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Bookings</p>
            <p className="text-lg font-bold text-foreground">156</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Customers</p>
            <p className="text-lg font-bold text-foreground">89</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {profileMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className={cn(
                  'w-full flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors text-left',
                  item.variant === 'destructive' && 'border-red-400/30 hover:border-red-400/50'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5',
                  item.variant === 'destructive' ? 'text-red-400' : 'text-muted-foreground'
                )} />
                <span className={cn(
                  'text-sm font-medium flex-1',
                  item.variant === 'destructive' ? 'text-red-400' : 'text-foreground'
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

