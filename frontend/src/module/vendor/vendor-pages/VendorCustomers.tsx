import { useState, useMemo, useCallback } from "react";
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  Star,
  ArrowLeft,
  User,
  Users,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";
import { useCountUp } from "@/hooks/useCountUp";
import { useCustomerStore, type Customer } from "../store/useCustomerStore";

const getStatusColor = (status: Customer["status"]) => {
  switch (status) {
    case "vip":
      return "bg-purple-400/20 text-purple-400 border-purple-400/30";
    case "active":
      return "bg-green-400/20 text-green-400 border-green-400/30";
    case "inactive":
      return "bg-gray-400/20 text-gray-400 border-gray-400/30";
  }
};

export function VendorCustomers() {
  const navigate = useNavigate();
  const { customers } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Customer["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "bookings" | "spent" | "lastVisit">("name");

  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery) ||
          (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((customer) => customer.status === filter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "bookings":
          return b.totalBookings - a.totalBookings;
        case "spent":
          return b.totalSpent - a.totalSpent;
        case "lastVisit":
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [customers, searchQuery, filter, sortBy]);

  const stats = useMemo(() => {
    return {
      total: customers.length,
      active: customers.filter(c => c.status !== "inactive").length,
      vip: customers.filter(c => c.status === "vip").length,
      totalSpent: customers.reduce((sum, customer) => sum + customer.totalSpent, 0),
    };
  }, [customers]);

  const animatedTotalSpent = useCountUp(stats.totalSpent, { duration: 1500 });

  const handleSort = useCallback((field: typeof sortBy) => {
    setSortBy(field);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24" style={{ paddingBottom: 'max(6rem, env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/vendor/profile')}
            className="p-2 min-w-[44px] min-h-[44px] hover:bg-muted rounded-lg transition-colors touch-manipulation flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">Customers</h2>
            <p className="text-xs text-muted-foreground">
              Manage your customer relationships
            </p>
          </div>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <p className="text-xs text-muted-foreground">Total Customers</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{animatedTotalSpent.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.2 }}
          className="space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm placeholder:text-muted-foreground"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter("all")}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] touch-manipulation",
                filter === "all"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              )}
            >
              All ({stats.total})
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter("active")}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] touch-manipulation",
                filter === "active"
                  ? "bg-green-400/10 text-green-400 border border-green-400/30"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              )}
            >
              Active ({stats.active})
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter("vip")}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] touch-manipulation",
                filter === "vip"
                  ? "bg-purple-400/10 text-purple-400 border border-purple-400/30"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              )}
            >
              VIP ({stats.vip})
            </motion.button>
          </div>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.3 }}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          <span className="text-xs text-muted-foreground whitespace-nowrap">Sort by:</span>
          {[
            { key: "name", label: "Name" },
            { key: "bookings", label: "Bookings" },
            { key: "spent", label: "Spent" },
            { key: "lastVisit", label: "Last Visit" },
          ].map((option) => (
            <motion.button
              key={option.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSort(option.key as typeof sortBy)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all min-h-[32px] touch-manipulation",
                sortBy === option.key
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              )}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Customer List */}
        {filteredCustomers.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filteredCustomers.map((customer) => (
              <motion.div
                key={customer.id}
                variants={staggerItem}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer touch-manipulation active:scale-[0.98] shadow-sm hover:shadow-md"
                onClick={() => navigate(`/vendor/customers/${customer.id}`)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-lg font-semibold min-w-[48px] min-h-[48px]">
                    {customer.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Customer Info */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-sm truncate">
                            {customer.name}
                          </h3>
                          {customer.rating && (
                            <div className="flex items-center gap-1 shrink-0">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium text-foreground">
                                {customer.rating}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <motion.span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            getStatusColor(customer.status)
                          )}
                        >
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </motion.span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </div>
                    
                    {/* Contact Info */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="truncate">{customer.phone}</span>
                      </div>
                      
                      {customer.email && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                      
                      {customer.address && (
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 mt-0.5" />
                          <span className="truncate">{customer.address}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium text-foreground">{customer.totalBookings}</span>
                        <span className="text-muted-foreground">bookings</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium text-foreground">{customer.totalSpent.toLocaleString()}</span>
                        <span className="text-muted-foreground">spent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={transitions.smooth}
            className="text-center py-12 bg-card border border-border rounded-xl"
          >
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-sm">
              {searchQuery || filter !== "all" 
                ? "No customers found matching your criteria" 
                : "No customers yet"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}