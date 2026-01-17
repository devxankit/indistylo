import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  ChevronRight,
  TrendingUp,
  Users,
  Star,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomerStore, type Customer } from "../store/useCustomerStore";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const getStatusStyles = (status: Customer["status"]) => {
  switch (status) {
    case "vip":
      return "bg-amber-400/10 text-amber-400 border-amber-400/20";
    case "active":
      return "bg-green-400/10 text-green-400 border-green-400/20";
    case "inactive":
      return "bg-zinc-400/10 text-zinc-400 border-zinc-400/20";
    default:
      return "bg-blue-400/10 text-blue-400 border-blue-400/20";
  }
};

export function VendorCustomers() {
  const navigate = useNavigate();
  const { customers, fetchCustomers, loading, error } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Customer["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "bookings" | "spent" | "lastVisit">("lastVisit");

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery) ||
          c.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === "all" || c.status === activeFilter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "bookings") return b.totalBookings - a.totalBookings;
        if (sortBy === "spent") return b.totalSpent - a.totalSpent;
        if (sortBy === "lastVisit") {
          if (!a.lastVisit) return 1;
          if (!b.lastVisit) return -1;
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        }
        return 0;
      });
  }, [customers, searchQuery, activeFilter, sortBy]);

  const stats = useMemo(() => ({
    total: customers.length,
    vip: customers.filter(c => c.status === 'vip').length,
    active: customers.filter(c => c.status === 'active').length,
    revenue: customers.reduce((acc, c) => acc + c.totalSpent, 0)
  }), [customers]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-xs text-muted-foreground">Manage and track your clientele</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"
          >
            <Users className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Search & Quick Filters */}
        <div className="space-y-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name, phone or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(["all", "vip", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all",
                  activeFilter === f
                    ? "bg-primary text-black border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-muted"
                )}
              >
                {f.charAt(0)?.toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Clients', value: stats.total, icon: Users, color: 'text-blue-400' },
            { label: 'VIP Members', value: stats.vip, icon: Star, color: 'text-amber-400' },
            { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-400' },
            { label: 'Active Now', value: stats.active, icon: TrendingUp, color: 'text-emerald-400' },
          ].map((stat, i) => (
            <motion.div
              hover={{ scale: 1.02 }}
              key={i}
              className="p-3 bg-card border border-border rounded-2xl space-y-2 shadow-sm"
            >
              <div className={cn("w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center", stat.color)}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Error Handling */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl text-red-400 text-sm flex items-center gap-3"
          >
            <span className="flex-1">{error}</span>
            <button
              onClick={() => navigate('/vendor/auth')}
              className="px-4 py-1.5 bg-red-400 text-black rounded-lg font-bold text-xs"
            >
              RELINK ACCOUNT
            </button>
          </motion.div>
        )}

        {/* Customer List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              {filteredCustomers.length} results
            </h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-primary font-medium focus:outline-none cursor-pointer"
            >
              <option value="lastVisit">Recent Visit</option>
              <option value="spent">High Value</option>
              <option value="bookings">Most Bookings</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredCustomers.map((customer) => (
                <motion.div
                  key={customer.id || customer._id}
                  layout
                  variants={staggerItem}
                  transition={transitions.smooth}
                  className="group relative bg-card border border-border rounded-2xl p-4 overflow-hidden hover:border-primary/40 active:scale-[0.98] transition-all shadow-sm"
                  onClick={() => navigate(`/vendor/customers/${customer.id || customer._id}`)}
                >
                  {/* Glass background effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative flex items-center gap-4">
                    {/* Avatar with Status Ring */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary border border-white/5">
                        {customer.name?.charAt(0) || "C"}
                      </div>
                      <div className={cn(
                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card",
                        customer.status === 'vip' ? 'bg-amber-400' :
                          customer.status === 'active' ? 'bg-green-400' : 'bg-zinc-400'
                      )} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {customer.name}
                        </h3>
                        <div className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                          getStatusStyles(customer.status)
                        )}>
                          {customer.status}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-medium text-foreground">₹{customer.totalSpent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{customer.lastVisit ? format(new Date(customer.lastVisit), "MMM dd") : "Never"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                          <span>{customer.totalBookings}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all shrink-0" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {!loading && filteredCustomers.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground opacity-20" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No customers found</h3>
                <p className="text-sm text-muted-foreground px-10">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {loading && customers.length === 0 && (
        <div className="px-4 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 w-full bg-card/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}