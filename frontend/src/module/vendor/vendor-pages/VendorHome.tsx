import { useState, useEffect } from 'react';
import { Search, TrendingUp, Calendar, Users, IndianRupee, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for vendor dashboard
const recentBookings = [
  {
    id: '1',
    customerName: 'Rajesh Kumar',
    service: 'Haircut & Styling',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'confirmed',
    amount: 499,
  },
  {
    id: '2',
    customerName: 'Priya Sharma',
    service: 'Hair Color & Treatment',
    date: '2024-01-15',
    time: '2:00 PM',
    status: 'pending',
    amount: 1299,
  },
  {
    id: '3',
    customerName: 'Amit Singh',
    service: 'Beard Trim',
    date: '2024-01-16',
    time: '11:00 AM',
    status: 'confirmed',
    amount: 299,
  },
];

const statsCards = [
  {
    title: 'Today\'s Revenue',
    value: '₹2,450',
    change: '+12%',
    icon: IndianRupee,
    trend: 'up',
  },
  {
    title: 'Total Bookings',
    value: '24',
    change: '+5',
    icon: Calendar,
    trend: 'up',
  },
  {
    title: 'Active Customers',
    value: '156',
    change: '+8',
    icon: Users,
    trend: 'up',
  },
  {
    title: 'Growth Rate',
    value: '18%',
    change: '+3%',
    icon: TrendingUp,
    trend: 'up',
  },
];

const searchTerms = [
  'bookings',
  'customers',
  'services',
  'dates',
  'appointments',
];

export function VendorHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground transition-all"
            />
            {searchQuery.length === 0 && (
              <div className="absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5">
                <span className="text-muted-foreground">Search</span>
                <div className="relative h-5 overflow-hidden" style={{ minWidth: '90px' }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ 
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      className="absolute inset-0 flex items-center text-muted-foreground"
                    >
                      {searchTerms[currentIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  )}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Bookings Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Bookings</h2>
            <button
              onClick={() => navigate('/vendor/bookings')}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => navigate(`/vendor/bookings/${booking.id}`)}
                className="bg-card border border-border rounded-xl p-4 space-y-3 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{booking.customerName}</h3>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
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
                    <p className="text-lg font-bold text-primary">₹{booking.amount}</p>
                    <span
                      className={cn(
                        "inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium",
                        booking.status === 'confirmed'
                          ? 'bg-green-400/20 text-green-400'
                          : 'bg-yellow-400/20 text-yellow-400'
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/vendor/bookings')}
              className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-colors"
            >
              <Calendar className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-foreground">Manage Bookings</p>
              <p className="text-xs text-muted-foreground mt-1">View and update bookings</p>
            </button>
            <button
              onClick={() => navigate('/vendor/analytics')}
              className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-colors"
            >
              <TrendingUp className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-foreground">View Analytics</p>
              <p className="text-xs text-muted-foreground mt-1">Track your performance</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
