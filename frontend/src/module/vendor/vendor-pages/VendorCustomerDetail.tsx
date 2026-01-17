import { useState, useEffect } from "react";
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
  Clock,
  TrendingUp,
  History,
  AlertCircle,
  User,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { transitions } from "@/lib/animations";
import { useCustomerStore, type Customer } from "../store/useCustomerStore";
import { CustomerEditModal } from "../vendor-components/CustomerEditModal";
import { format } from "date-fns";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "text-green-400 bg-green-400/10 border-green-400/20";
    case "cancelled":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    case "active":
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "vip":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    default:
      return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
  }
};

export function VendorCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedCustomer: customer, loading, error, fetchCustomerDetail, updateCustomer, resetSelectedCustomer } = useCustomerStore();
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "insights">("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id && id !== "undefined") {
      fetchCustomerDetail(id);
    }
    return () => resetSelectedCustomer();
  }, [id, fetchCustomerDetail, resetSelectedCustomer]);

  const handleSave = async (userId: string, updates: Partial<Customer>) => {
    try {
      await updateCustomer(userId, updates);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading && !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Crafting Profile...</p>
      </div>
    );
  }

  if (error || (!loading && !customer)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-400/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Customer Not Found</h2>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed max-w-xs mx-auto">
          {error || "We couldn't locate the profile you were looking for. It may have been moved."}
        </p>
        <button
          onClick={() => navigate("/vendor/customers")}
          className="px-8 py-3 bg-primary text-black rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  // TypeScript null safety: customer is guaranteed to be non-null here
  if (!customer) return null;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Dynamic Header */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,184,0,0.1),transparent)] flex items-end px-4 pb-4">
          <button
            onClick={() => navigate("/vendor/customers")}
            className="absolute top-6 left-4 w-10 h-10 rounded-full bg-background/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar Positioned Overlap */}
        <div className="absolute -bottom-10 left-6 flex items-end gap-5">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[32px] bg-card border-[3px] border-background shadow-2xl flex items-center justify-center text-3xl font-bold text-primary transition-transform group-hover:scale-105 overflow-hidden">
              {customer.avatar ? (
                <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
              ) : (
                customer.name?.charAt(0) || "C"
              )}
            </div>
            <div className={cn(
              "absolute -right-1 -bottom-1 w-6 h-6 rounded-full border-[3px] border-background",
              customer.status === 'vip' ? 'bg-amber-400' : 'bg-green-400'
            )} />
          </div>
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-2xl font-bold text-foreground leading-tight">{customer.name}</h1>
              {customer.status === 'vip' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
            </div>
            <div className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border inline-flex", getStatusColor(customer.status))}>
              {customer.status} Member
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute -bottom-6 right-6 w-12 h-12 rounded-2xl bg-primary text-black shadow-lg shadow-primary/20 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-16 px-4 space-y-6">
        {/* Analytics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-card border border-border rounded-2xl space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total Spend</p>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold">₹{customer.totalSpent.toLocaleString()}</span>
            </div>
          </div>
          <div className="p-4 bg-card border border-border rounded-2xl space-y-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Visits</p>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-400" />
              <span className="text-xl font-bold">{customer.totalBookings}</span>
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex gap-4 border-b border-border overflow-x-auto no-scrollbar pt-2">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "history", label: "Bookings", icon: Calendar },
            { id: "insights", label: "Insights", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-1 pb-3 text-sm font-bold transition-all relative whitespace-nowrap",
                activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={transitions.smooth}
          >
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone</p>
                      <p className="text-sm font-semibold truncate hover:text-primary transition-colors cursor-pointer" onClick={() => window.open(`tel:${customer.phone}`)}>
                        {customer.phone}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/30" />
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center text-blue-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</p>
                      <p className="text-sm font-semibold truncate">
                        {customer.email || "No email linked"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Address</p>
                      <p className="text-sm font-semibold">
                        {customer.address || "Unspecified location"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-400/5 border border-amber-400/10 rounded-2xl p-4 space-y-2">
                  <h3 className="text-sm font-bold text-amber-400/90 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400" /> Private Vendor Notes
                  </h3>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">
                    "{customer.notes || "No notes captured yet. Add notes to better serve your customer."}"
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                {customer.bookings && customer.bookings.length > 0 ? (
                  customer.bookings.map((booking) => (
                    <div key={booking._id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary/30 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-border flex flex-col items-center justify-center leading-none">
                        <span className="text-[10px] font-bold text-primary uppercase">{format(new Date(booking.date), "MMM")}</span>
                        <span className="text-lg font-bold">{format(new Date(booking.date), "dd")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{booking.service}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{booking.time}</span>
                          <span className="bullet text-[16px]">•</span>
                          <span className="font-bold text-foreground">₹{booking.amount}</span>
                        </div>
                      </div>
                      <div className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold border", getStatusColor(booking.status))}>
                        {booking.status}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center space-y-3">
                    <History className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                    <p className="text-muted-foreground font-medium">No booking history yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">Top Services</h3>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                      {(customer.preferredServices || ['Style Cut', 'Beard Grooming']).map((serv, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-sm font-medium">{serv}</span>
                          <span className="text-xs text-muted-foreground">Used {3 - i}x</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Avg Ticket Price</p>
                      <p className="text-xl font-bold">₹{customer.averageOrderValue || 0}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Member Since</p>
                      <p className="text-xl font-bold">Jan 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <CustomerEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSave}
        customer={customer}
      />
    </div>
  );
}
