import { useState } from "react";
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
  Camera,
  Star,
  Calendar,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";

// Mock vendor data
const vendorData = {
  name: "Indistylo Salon & Spa",
  email: "vendor@indistylo.com",
  phone: "+91 98765 43210",
  address: "123 MG Road, Pune, Maharashtra 411001",
  rating: 4.8,
  totalBookings: 1250,
  joinedDate: "January 2023",
  profileImage: "",
};

const quickStats = [
  {
    label: "Total Bookings",
    value: "1,250",
    icon: Calendar,
    color: "text-blue-400",
  },
  {
    label: "Average Rating",
    value: "4.8",
    icon: Star,
    color: "text-yellow-400",
  },
  {
    label: "Growth",
    value: "+18%",
    icon: TrendingUp,
    color: "text-green-400",
  },
];

const menuItems = [
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
  const [vendor] = useState(vendorData);

  const handleLogout = () => {
    // Handle logout logic
    navigate("/vendor/auth");
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
        className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="px-4 py-8 space-y-6">
          {/* Profile Image and Edit */}
          <div className="flex flex-col items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-3xl font-bold text-primary border-4 border-background shadow-lg">
                {vendor.profileImage ? (
                  <img
                    src={vendor.profileImage}
                    alt={vendor.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  vendor.name.charAt(0)
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-lg min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation"
                aria-label="Change profile picture">
                <Camera className="w-4 h-4 text-white" />
              </motion.button>
            </motion.div>

            {/* Vendor Info */}
            <div className="text-center">
              <h2 className="text-sm font-medium font-size-2 text-foreground">
                {vendor.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Member since {vendor.joinedDate}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-3">
            {quickStats.map((stat) => {
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
                    {vendor.email}
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
                    {vendor.phone}
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
                    {vendor.address}
                  </p>
                </div>
              </div>
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
