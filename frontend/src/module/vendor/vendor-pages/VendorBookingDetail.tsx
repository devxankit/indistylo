import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  IndianRupee,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Star,
  MessageSquare,
  ArrowLeft,
  Copy,
  Navigation,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";
import { useTouchFeedback } from "@/lib/touch";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  amount: number;
  address?: string;
  duration: string;
  rating?: number;
  notes?: string;
  paymentMethod: "cash" | "online" | "wallet";
}

// Mock bookings data (in production, this would come from an API)
const mockBookings: Booking[] = [
  {
    id: "1",
    customerName: "Rajesh Kumar",
    customerPhone: "+91 9876543210",
    customerEmail: "rajesh@example.com",
    service: "Haircut & Styling",
    date: "2024-01-15",
    time: "10:00 AM",
    status: "confirmed",
    amount: 499,
    address: "123 Main Street, City, State - 123456",
    duration: "45 min",
    rating: 4.8,
    paymentMethod: "online",
  },
  {
    id: "2",
    customerName: "Priya Sharma",
    customerPhone: "+91 9876543211",
    customerEmail: "priya@example.com",
    service: "Hair Color & Treatment",
    date: "2024-01-15",
    time: "2:00 PM",
    status: "pending",
    amount: 1299,
    address: "456 Park Avenue, City, State - 123456",
    duration: "2 hours",
    paymentMethod: "wallet",
    notes: "Customer prefers natural hair color",
  },
  {
    id: "3",
    customerName: "Amit Singh",
    customerPhone: "+91 9876543212",
    service: "Beard Trim",
    date: "2024-01-16",
    time: "11:00 AM",
    status: "confirmed",
    amount: 299,
    duration: "30 min",
    paymentMethod: "cash",
  },
  {
    id: "4",
    customerName: "Sneha Patel",
    customerPhone: "+91 9876543213",
    customerEmail: "sneha@example.com",
    service: "Facial Treatment",
    date: "2024-01-14",
    time: "3:00 PM",
    status: "completed",
    amount: 899,
    duration: "1 hour",
    rating: 5.0,
    paymentMethod: "online",
  },
  {
    id: "5",
    customerName: "Vikram Mehta",
    customerPhone: "+91 9876543214",
    service: "Haircut",
    date: "2024-01-13",
    time: "4:00 PM",
    status: "cancelled",
    amount: 399,
    duration: "40 min",
    paymentMethod: "online",
  },
];

const getStatusIcon = (status: BookingStatus) => {
  switch (status) {
    case "confirmed":
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case "pending":
      return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
    case "cancelled":
      return <XCircle className="w-4 h-4 text-red-400" />;
  }
};

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case "confirmed":
      return "bg-green-400/20 text-green-400 border-green-400/30";
    case "pending":
      return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30";
    case "completed":
      return "bg-blue-400/20 text-blue-400 border-blue-400/30";
    case "cancelled":
      return "bg-red-400/20 text-red-400 border-red-400/30";
  }
};

export function VendorBookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const booking = useMemo(() => {
    return mockBookings.find((b) => b.id === id);
  }, [id]);

  useEffect(() => {
    if (!booking) {
      // Redirect to bookings list if booking not found
      navigate("/vendor/bookings");
    }
  }, [booking, navigate]);

  const handleStatusChange = useCallback(
    (newStatus: BookingStatus) => {
      // Handle status change
      console.log("Status change", id, newStatus);
      // In production, this would make an API call
      // After success, you might navigate back or show a success message
    },
    [id]
  );

  const copyToClipboard = useCallback((text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const handleCall = useCallback(() => {
    if (booking?.customerPhone) {
      window.location.href = `tel:${booking.customerPhone}`;
    }
  }, [booking]);

  const handleMessage = useCallback(() => {
    if (booking?.customerPhone) {
      window.location.href = `sms:${booking.customerPhone}`;
    }
  }, [booking]);

  const handleNavigate = useCallback(() => {
    if (booking?.address) {
      const encodedAddress = encodeURIComponent(booking.address);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        "_blank"
      );
    }
  }, [booking]);

  if (!booking) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-3 py-2 flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/vendor/bookings")}
            className="p-1.5 min-w-[36px] min-h-[36px] hover:bg-muted rounded-lg transition-colors touch-manipulation flex items-center justify-center"
            aria-label="Go back">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[2px] font-normal text-foreground truncate">
              Booking Details
            </h1>
            <p className="text-[1px] text-muted-foreground truncate">
              ID: {booking.id}
            </p>
          </div>
          <motion.div
            className={cn(
              "px-2 py-1 rounded-lg border flex items-center gap-1 text-[10px] font-medium min-h-[28px] shrink-0",
              getStatusColor(booking.status)
            )}
            animate={
              booking.status === "pending"
                ? {
                    scale: [1, 1.05, 1],
                  }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity }}>
            {getStatusIcon(booking.status)}
            <span className="capitalize hidden xs:inline">
              {booking.status}
            </span>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-4">
        {/* Customer Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl font-bold min-w-[64px] min-h-[64px]"
              whileHover={{ scale: 1.1 }}
              transition={transitions.quick}>
              {booking.customerName.charAt(0)}
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground truncate">
                  {booking.customerName}
                </h2>
                {booking.status === "completed" && booking.rating && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-foreground">
                      {booking.rating}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCall}
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors touch-manipulation min-h-[44px]">
                  <Phone className="w-4 h-4" />
                  Call
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMessage}
                  className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors touch-manipulation min-h-[44px]">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </motion.button>
              </div>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-2 pt-4 border-t border-border">
            <motion.div
              variants={staggerItem}
              className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">Phone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {booking.customerPhone}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    copyToClipboard(booking.customerPhone, "phone")
                  }
                  className="p-1.5 min-w-[32px] min-h-[32px] hover:bg-muted rounded transition-colors touch-manipulation flex items-center justify-center"
                  aria-label="Copy phone">
                  {copiedField === "phone" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {booking.customerEmail && (
              <motion.div
                variants={staggerItem}
                className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                    {booking.customerEmail}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      copyToClipboard(booking.customerEmail!, "email")
                    }
                    className="p-1.5 min-w-[32px] min-h-[32px] hover:bg-muted rounded transition-colors touch-manipulation flex items-center justify-center shrink-0"
                    aria-label="Copy email">
                    {copiedField === "email" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Service Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold text-foreground">
              Service Details
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3">
            <motion.div variants={staggerItem} className="space-y-1">
              <span className="text-xs text-muted-foreground">Service</span>
              <p className="text-base font-semibold text-foreground">
                {booking.service}
              </p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground">Date</span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {booking.date}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground">Time</span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {booking.time}
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="pt-3 border-t border-border">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">Duration</span>
              </div>
              <p className="text-sm font-medium text-foreground">
                {booking.duration}
              </p>
            </motion.div>

            {booking.address && (
              <motion.div
                variants={staggerItem}
                className="pt-3 border-t border-border">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground block mb-1">
                        Address
                      </span>
                      <p className="text-sm font-medium text-foreground break-words">
                        {booking.address}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNavigate}
                    className="p-2 min-w-[44px] min-h-[44px] bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors touch-manipulation flex items-center justify-center shrink-0"
                    aria-label="Navigate to address">
                    <Navigation className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {booking.notes && (
              <motion.div
                variants={staggerItem}
                className="pt-3 border-t border-border">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground block mb-1">
                      Notes
                    </span>
                    <p className="text-sm text-foreground bg-muted/30 rounded-lg p-2 break-words">
                      {booking.notes}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Payment Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.3 }}
          className="bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-lg font-semibold text-foreground">
              Payment Information
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3">
            <motion.div
              variants={staggerItem}
              className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">Amount</span>
              <motion.p
                key={booking.amount}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={transitions.quick}
                className="text-2xl font-bold text-primary">
                ₹{booking.amount}
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Payment Method
              </span>
              <span className="text-sm font-medium text-foreground capitalize">
                {booking.paymentMethod}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.4 }}
          className="space-y-3 pt-2">
          {booking.status === "pending" && (
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusChange("confirmed")}
                className="h-14 min-h-[44px] bg-green-400/10 text-green-400 border border-green-400/30 rounded-xl text-sm font-semibold hover:bg-green-400/20 transition-colors touch-manipulation flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Accept
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusChange("cancelled")}
                className="h-14 min-h-[44px] bg-red-400/10 text-red-400 border border-red-400/30 rounded-xl text-sm font-semibold hover:bg-red-400/20 transition-colors touch-manipulation flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" />
                Reject
              </motion.button>
            </div>
          )}

          {booking.status === "confirmed" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStatusChange("completed")}
              className="w-full h-14 min-h-[44px] bg-primary/10 text-primary border border-primary/30 rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors touch-manipulation flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Mark as Completed
            </motion.button>
          )}

          {(booking.status === "completed" ||
            booking.status === "cancelled") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                {booking.status === "completed"
                  ? "This booking has been completed"
                  : "This booking has been cancelled"}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
