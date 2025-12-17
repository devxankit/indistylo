import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  Star,
  Edit3,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";
import { useCustomerStore } from "../store/useCustomerStore";
import { CustomerEditModal } from "../vendor-components/CustomerEditModal";
import { format } from "date-fns";

// Mock booking history for the customer
const getMockBookings = (customerId: string) => {
  const allBookings = [
    {
      id: "b1",
      customerId: "1",
      service: "Haircut & Styling",
      date: "2024-01-15",
      time: "10:00 AM",
      amount: 499,
      status: "completed",
    },
    {
      id: "b2",
      customerId: "1",
      service: "Hair Spa",
      date: "2024-01-10",
      time: "2:00 PM",
      amount: 1099,
      status: "completed",
    },
    {
      id: "b3",
      customerId: "1",
      service: "Beard Trim",
      date: "2024-01-05",
      time: "11:00 AM",
      amount: 299,
      status: "completed",
    },
  ];
  return allBookings.filter((b) => b.customerId === customerId);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-400/20 text-green-400 border-green-400/30";
    case "confirmed":
      return "bg-blue-400/20 text-blue-400 border-blue-400/30";
    case "pending":
      return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30";
    default:
      return "bg-gray-400/20 text-gray-400 border-gray-400/30";
  }
};

export function VendorCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomer, updateCustomer } = useCustomerStore();
  const customer = id ? getCustomer(id) : undefined;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookingHistory] = useState(id ? getMockBookings(id) : []);

  const handleSave = (customerId: string, updates: Parameters<typeof updateCustomer>[1]) => {
    updateCustomer(customerId, updates);
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Customer not found</p>
          <button
            onClick={() => navigate("/vendor/customers")}
            className="mt-4 text-primary hover:underline">
            Go back to customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-2 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/vendor/customers")}
            className="p-2 min-w-[44px] min-h-[44px] hover:bg-muted rounded-lg transition-colors touch-manipulation flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[8px] font-normal text-foreground truncate">
              Customer Details
            </h1>
            <p className="text-[6px] text-muted-foreground truncate">
              {customer.id}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 min-w-[44px] min-h-[44px] bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors touch-manipulation flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Customer Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.smooth}
          className="bg-card border border-border rounded-xl p-4 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-foreground truncate">
                    {customer.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium border",
                        customer.status === "vip"
                          ? "bg-purple-400/20 text-purple-400 border-purple-400/30"
                          : customer.status === "active"
                          ? "bg-green-400/20 text-green-400 border-green-400/30"
                          : "bg-gray-400/20 text-gray-400 border-gray-400/30"
                      )}>
                      {customer.status.toUpperCase()}
                    </span>
                    {customer.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-foreground">
                          {customer.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <a
                href={`tel:${customer.phone}`}
                className="text-sm text-foreground hover:text-primary transition-colors">
                {customer.phone}
              </a>
            </div>
            {customer.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href={`mailto:${customer.email}`}
                  className="text-sm text-foreground hover:text-primary transition-colors">
                  {customer.email}
                </a>
              </div>
            )}
            {customer.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm text-foreground flex-1">{customer.address}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Bookings</p>
            <p className="text-xl font-bold text-foreground">
              {customer.totalBookings}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
            <p className="text-xl font-bold text-primary flex items-center justify-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {customer.totalSpent}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Last Visit</p>
            <p className="text-xs font-medium text-foreground">
              {format(new Date(customer.lastVisit), "MMM dd")}
            </p>
          </motion.div>
        </div>

        {/* Notes */}
        {customer.notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground">{customer.notes}</p>
          </motion.div>
        )}

        {/* Booking History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Booking History
            </h3>
            <span className="text-xs text-muted-foreground">
              {bookingHistory.length} bookings
            </span>
          </div>

          {bookingHistory.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3">
              {bookingHistory.map((booking) => (
                <motion.div
                  key={booking.id}
                  variants={staggerItem}
                  className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        {booking.service}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(booking.date), "MMM dd, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.time}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-medium border shrink-0",
                        getStatusColor(booking.status)
                      )}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {booking.amount}
                    </span>
                    {booking.status === "completed" && (
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">No booking history</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      <CustomerEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSave}
        customer={customer}
      />
    </div>
  );
}

