import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Settings,
  Bell,
  FileText,
  Shield,
  LogOut,
  ChevronRight,
  Star,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  Grid3x3,
  Loader2,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";
import { useVendorStore } from "../store/useVendorStore";
import { ImageUpload } from "../vendor-components/ImageUpload";
import { LocationPicker } from "../vendor-components/LocationPicker";
import { useVendorAnalyticsStore } from "../store/useVendorAnalyticsStore";
import { format } from "date-fns";
import { toast } from "sonner";



const menuItems = [
  {
    id: "services",
    label: "Services",
    description: "Manage your services",
    icon: Grid3x3,
    path: "/vendor/services",
  },
  {
    id: "packages",
    label: "My Packages",
    description: "Create and manage packages",
    icon: Package,
    path: "/vendor/packages",
  },
  {
    id: "customers",
    label: "Customers",
    description: "Manage your customers",
    icon: Users,
    path: "/vendor/customers",
  },
  {
    id: "reviews",
    label: "Reviews",
    description: "View and respond to reviews",
    icon: MessageSquare,
    path: "/vendor/reviews",
  },
  {
    id: "professionals",
    label: "Manage Professionals",
    description: "Manage your salon staff",
    icon: Users,
    path: "/vendor/professionals",
  },
  {
    id: "schedule",
    label: "Schedule",
    description: "Manage working hours and breaks",
    icon: Clock,
    path: "/vendor/schedule",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Manage app preferences",
    icon: Settings,
    path: "/vendor/settings",
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage your notifications",
    icon: Bell,
    path: "/vendor/notifications",
  },
  {
    id: "terms",
    label: "Terms & Conditions",
    description: "Read our terms",
    icon: FileText,
    path: "/vendor/terms",
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    description: "Read our privacy policy",
    icon: Shield,
    path: "/vendor/privacy",
  },
];

export function VendorProfile() {
  const navigate = useNavigate();
  const {
    businessName,
    ownerName,
    email,
    phoneNumber,
    address,
    profileImage,
    galleryImages,
    loading,
    rating,
    joinedAt,
    geo,
    fetchProfile,
    updateProfile,
  } = useVendorStore();

  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationSave = async () => {
    if (newLocation) {
      try {
        await updateProfile({
          geo: { type: 'Point', coordinates: [newLocation.lng, newLocation.lat] }
        });
        setIsEditingLocation(false);
        toast.success("Location updated successfully");
      } catch (error) {
        toast.error("Failed to update location");
      }
    }
  };

  const { summary, fetchAnalytics } = useVendorAnalyticsStore();

  useEffect(() => {
    fetchProfile();
    fetchAnalytics();
  }, [fetchProfile, fetchAnalytics]);

  const stats = [
    {
      label: "Total Bookings",
      value: summary?.bookings.current.toString() || "0",
      icon: Calendar,
      color: "text-blue-400",
    },
    {
      label: "Average Rating",
      value: rating ? rating.toFixed(1) : "0.0", // Use rating from vendor store or performance
      icon: Star,
      color: "text-yellow-400",
    },
    {
      label: "Growth",
      value: summary ? `${summary.revenue.change >= 0 ? "+" : ""}${summary.revenue.change.toFixed(0)}%` : "0%",
      icon: TrendingUp,
      color: "text-green-400",
    },
  ];

  const handleLogout = () => {
    // Handle logout logic
    navigate("/vendor/auth");
  };

  const handleImageUpdate = async (type: "profile" | "gallery", val: string | string[]) => {
    try {
      if (type === "profile") {
        await updateProfile({ profileImage: val as string });
      } else {
        await updateProfile({ galleryImages: val as string[] });
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading && !businessName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
        className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="px-4 py-8 space-y-6">
          {/* Profile Image and Edit */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 mx-auto">
              <ImageUpload
                value={profileImage || ""}
                onChange={(val) => handleImageUpdate("profile", val)}
                label="Profile Photo"
                maxSizeMB={5}
                disabled={loading}
              />
            </div>

            {/* Vendor Info */}
            <div className="text-center">
              <h2 className="text-xl font-bold font-size-2 text-foreground">
                {businessName || "Your Business Name"}
              </h2>
              <p className="text-sm font-medium text-foreground/80 mt-1">
                {ownerName || "Owner Name"}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                {loading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                <p className="text-xs text-muted-foreground">
                  Joined {joinedAt ? format(new Date(joinedAt), "MMMM yyyy") : "..."}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="bg-card border border-border rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <div className="px-4 py-6 space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="space-y-3">
          {/* Salon Gallery */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitions.smooth, delay: 0.05 }}
            className="space-y-3 pb-6 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">
              Salon Gallery
            </h2>
            <ImageUpload
              value={galleryImages || []}
              onChange={(val) => handleImageUpdate("gallery", val)}
              multiple
              maxFiles={10}
              label="Add Salon Photos"
              disabled={loading}
            />
          </motion.section>

          <h2 className="text-base font-semibold text-foreground">
            Contact Information
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2">
            {/* Email */}
            <motion.div
              variants={staggerItem}
              className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {email}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              variants={staggerItem}
              className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">
                    {phoneNumber}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div
              variants={staggerItem}
              className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium text-foreground">
                    {address}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Shop Location */}
            <motion.div
              variants={staggerItem}
              className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Shop Location</p>
                    <p className="text-sm font-medium text-foreground">
                      {geo ? "Location Set" : "Location Not Set"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingLocation(!isEditingLocation)}
                  className="text-xs font-semibold text-primary hover:underline">
                  {isEditingLocation ? "Cancel" : "Update"}
                </button>
              </div>

              {isEditingLocation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3 pt-2">
                  <LocationPicker
                    initialLocation={geo ? { lat: geo.coordinates[1], lng: geo.coordinates[0] } : undefined}
                    onLocationSelect={setNewLocation}
                  />
                  <button
                    onClick={handleLocationSave}
                    disabled={!newLocation || loading}
                    className="w-full h-10 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save New Location"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Menu Items */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.2 }}
          className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            More Options
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className="w-full bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-all touch-manipulation">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.3 }}
          className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full h-14 min-h-[44px] bg-red-500/10 text-red-500 border-2 border-red-500/20 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-colors touch-manipulation flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            Log Out
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
