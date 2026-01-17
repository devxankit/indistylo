import { useState, useEffect, useMemo, memo } from "react";
import {
  Search,
  TrendingUp,
  Calendar,
  Users,
  IndianRupee,
  ChevronRight,
  Clock,
  X,
  Grid3x3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";
import { useVendorStore } from "../store/useVendorStore";
import { useVendorBookingStore } from "../store/useVendorBookingStore";
import { useVendorEarningsStore } from "../store/useVendorEarningsStore";
import { useVendorAnalyticsStore } from "../store/useVendorAnalyticsStore";
import { useCountUp } from "@/hooks/useCountUp";
import { useTouchFeedback } from "@/lib/touch";
import { CardSkeleton } from "@/components/ui/skeleton";
import { isToday } from "date-fns";
import { toast } from "sonner";

// Search terms for placeholder animation
const searchTerms = [
  "bookings",
  "customers",
  "services",
  "dates",
  "appointments",
];

// Memoized stat card component for performance
const StatCard = memo(({ stat }: { stat: any; index: number }) => {
  const Icon = stat.icon;
  const { isActive, ...touchHandlers } = useTouchFeedback();

  // Parse numeric value for animation
  const numericValue = useMemo(() => {
    const match = stat.value.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, "")) : 0;
  }, [stat.value]);

  const animatedValue = useCountUp(numericValue, { duration: 1500 });
  const displayValue = stat.value.includes("₹")
    ? `₹${animatedValue.toLocaleString()}`
    : stat.value.replace(/[\d,]+/, animatedValue.toLocaleString());

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      className={cn(
        "bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-4 space-y-2",
        "hover:border-primary/50 transition-all cursor-pointer",
        "active:scale-[0.98] touch-manipulation",
        "min-h-[120px] flex flex-col justify-between"
      )}
      style={{ minHeight: "120px" }}
      {...touchHandlers}>
      <div className="flex items-center justify-between">
        <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <motion.span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            stat.trend === "up"
              ? "bg-green-400/20 text-green-400"
              : "bg-red-400/20 text-red-400"
          )}
          animate={stat.trend === "up" ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}>
          {stat.change}
        </motion.span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">{stat.title}</p>
        <motion.p
          className="text-xl font-bold text-foreground mt-1"
          key={animatedValue}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={transitions.quick}>
          {displayValue}
        </motion.p>
      </div>
    </motion.div>
  );
});

StatCard.displayName = "StatCard";

export function VendorHome() {
  const navigate = useNavigate();
  const { fetchProfile } = useVendorStore();
  const {
    bookings,
    fetchBookings,
    loading: bookingsLoading,
  } = useVendorBookingStore();
  const {
    availableBalance,
    fetchEarnings,
    loading: earningsLoading,
  } = useVendorEarningsStore();
  const {
    summary,
    fetchAnalytics,
    loading: analyticsLoading,
  } = useVendorAnalyticsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          fetchProfile(),
          fetchBookings(),
          fetchEarnings(),
          fetchAnalytics("month"),
        ]);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      }
    };
    init();
  }, []);

  const recentBookings = useMemo(() => bookings.slice(0, 3), [bookings]);
  const todaySchedule = useMemo(
    () => bookings.filter((b) => isToday(new Date(b.date))).slice(0, 3),
    [bookings]
  );

  const statsCards = useMemo(
    () => [
      {
        title: "Available Balance",
        value: `₹${availableBalance.toLocaleString()}`,
        change: summary
          ? `${summary.revenue.change >= 0 ? "+" : ""
          }${summary.revenue.change.toFixed(1)}%`
          : "0%",
        icon: IndianRupee,
        trend: !summary || summary.revenue.change >= 0 ? "up" : "down",
      },
      {
        title: "Total Bookings",
        value: summary
          ? summary.bookings.current.toString()
          : bookings.length.toString(),
        change: summary
          ? `${summary.bookings.change >= 0 ? "+" : ""
          }${summary.bookings.change.toFixed(1)}%`
          : "0%",
        icon: Calendar,
        trend: !summary || summary.bookings.change >= 0 ? "up" : "down",
      },
      {
        title: "Active Customers",
        value: summary ? summary.customers.current.toString() : "0",
        change: summary
          ? `${summary.customers.change >= 0 ? "+" : ""
          }${summary.customers.change.toFixed(1)}%`
          : "0%",
        icon: Users,
        trend: !summary || summary.customers.change >= 0 ? "up" : "down",
      },
      {
        title: "Growth Rate",
        value: summary ? `${summary.revenue.change.toFixed(1)}%` : "0%",
        change: summary
          ? `${summary.revenue.change >= 0 ? "+" : ""
          }${summary.revenue.change.toFixed(1)}%`
          : "0%",
        icon: TrendingUp,
        trend: !summary || summary.revenue.change >= 0 ? "up" : "down",
      },
    ],
    [availableBalance, bookings, summary]
  );

  const isLoading = bookingsLoading || earningsLoading || analyticsLoading;

  useEffect(() => {
    if (searchQuery.length > 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % searchTerms.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 min-h-[44px] pl-10 pr-10 rounded-xl bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground transition-all text-base"
              placeholder=""
            />
            {searchQuery.length === 0 && (
              <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
                <span className="text-muted-foreground">Search</span>
                <div
                  className="relative h-5 overflow-hidden"
                  style={{ minWidth: "90px" }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={transitions.smooth}
                      className="absolute inset-0 flex items-center text-muted-foreground">
                      {searchTerms[currentIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            )}
            {searchQuery.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-muted transition-colors touch-manipulation"
                aria-label="Clear search">
                <X className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-8">
        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4">
          {statsCards.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Recent Bookings Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Bookings
            </h2>
            <button
              onClick={() => navigate("/vendor/bookings")}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium min-h-[44px] min-w-[44px] px-2 touch-manipulation active:scale-95">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3">
              {recentBookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  variants={staggerItem}
                  onClick={() => navigate(`/vendor/bookings/${booking._id}`)}
                  className="bg-card border border-border rounded-xl p-4 space-y-3 hover:border-primary/50 hover:-translate-y-0.5 transition-all cursor-pointer touch-manipulation active:scale-[0.98] shadow-sm hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {booking.customerName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {booking.serviceName}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.time}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ₹{booking.amount}
                      </p>
                      <motion.span
                        className={cn(
                          "inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          booking.status === "confirmed" || booking.status === "upcoming"
                            ? "bg-green-400/20 text-green-400"
                            : "bg-yellow-400/20 text-yellow-400"
                        )}
                        animate={
                          booking.status === "pending"
                            ? {
                              scale: [1, 1.05, 1],
                              opacity: [1, 0.8, 1],
                            }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}>
                        {booking.status}
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Today's Schedule */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Today's Schedule
            </h2>
            <button
              onClick={() => navigate("/vendor/bookings")}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium min-h-[44px] min-w-[44px] px-2 touch-manipulation active:scale-95">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {todaySchedule.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3">
              {todaySchedule.map((appointment, index) => {
                // const isPast = false; // Can calculate based on current time
                const isNext = index === 0;

                return (
                  <motion.div
                    key={appointment._id}
                    variants={staggerItem}
                    className={cn(
                      "bg-card border rounded-xl p-4 space-y-3 transition-all cursor-pointer touch-manipulation active:scale-[0.98] shadow-sm hover:shadow-md",
                      isNext
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => navigate("/vendor/bookings")}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <motion.div
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-lg shrink-0"
                          whileHover={{ scale: 1.1 }}
                          transition={transitions.quick}>
                          {appointment.customerName.charAt(0)}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground text-sm truncate">
                            {appointment.customerName}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {appointment.serviceName}
                          </p>
                        </div>
                      </div>
                      {isNext && (
                        <motion.span
                          className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30 shrink-0"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}>
                          Next
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.time}
                      </span>
                      <span>{appointment.duration}</span>
                      <motion.span
                        className={cn(
                          "ml-auto px-2 py-0.5 rounded-full font-medium",
                          appointment.status === "confirmed" || appointment.status === "upcoming"
                            ? "bg-green-400/20 text-green-400"
                            : "bg-yellow-400/20 text-yellow-400"
                        )}>
                        {appointment.status}
                      </motion.span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={transitions.smooth}
              className="text-center py-8 bg-card border border-border rounded-xl">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground text-sm">
                No appointments scheduled for today
              </p>
            </motion.div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/vendor/bookings")}
              className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-all min-h-[120px] touch-manipulation flex flex-col justify-between shadow-sm hover:shadow-md">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}>
                <Calendar className="w-6 h-6 text-primary mb-2" />
              </motion.div>
              <div>
                <p className="font-medium text-foreground">Manage Bookings</p>
                <p className="text-xs text-muted-foreground mt-1">
                  View and update bookings
                </p>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/vendor/services")}
              className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-all min-h-[120px] touch-manipulation flex flex-col justify-between shadow-sm hover:shadow-md">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}>
                <Grid3x3 className="w-6 h-6 text-primary mb-2" />
              </motion.div>
              <div>
                <p className="font-medium text-foreground">Manage Services</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add and edit services
                </p>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/vendor/analytics")}
              className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-all min-h-[120px] touch-manipulation flex flex-col justify-between shadow-sm hover:shadow-md">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}>
                <TrendingUp className="w-6 h-6 text-primary mb-2" />
              </motion.div>
              <div>
                <p className="font-medium text-foreground">View Analytics</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Track your performance
                </p>
              </div>
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
}
