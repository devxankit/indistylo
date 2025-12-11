import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, IndianRupee, CheckCircle2, XCircle, AlertCircle, Phone, Mail, Search, Star, MessageSquare, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type BookingTab = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

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
  paymentMethod: 'cash' | 'online' | 'wallet';
}

const mockBookings: Booking[] = [
  {
    id: '1',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 9876543210',
    customerEmail: 'rajesh@example.com',
    service: 'Haircut & Styling',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'confirmed',
    amount: 499,
    address: '123 Main Street, City, State - 123456',
    duration: '45 min',
    rating: 4.8,
    paymentMethod: 'online',
  },
  {
    id: '2',
    customerName: 'Priya Sharma',
    customerPhone: '+91 9876543211',
    customerEmail: 'priya@example.com',
    service: 'Hair Color & Treatment',
    date: '2024-01-15',
    time: '2:00 PM',
    status: 'pending',
    amount: 1299,
    address: '456 Park Avenue, City, State - 123456',
    duration: '2 hours',
    paymentMethod: 'wallet',
    notes: 'Customer prefers natural hair color',
  },
  {
    id: '3',
    customerName: 'Amit Singh',
    customerPhone: '+91 9876543212',
    service: 'Beard Trim',
    date: '2024-01-16',
    time: '11:00 AM',
    status: 'confirmed',
    amount: 299,
    duration: '30 min',
    paymentMethod: 'cash',
  },
  {
    id: '4',
    customerName: 'Sneha Patel',
    customerPhone: '+91 9876543213',
    customerEmail: 'sneha@example.com',
    service: 'Facial Treatment',
    date: '2024-01-14',
    time: '3:00 PM',
    status: 'completed',
    amount: 899,
    duration: '1 hour',
    rating: 5.0,
    paymentMethod: 'online',
  },
  {
    id: '5',
    customerName: 'Vikram Mehta',
    customerPhone: '+91 9876543214',
    service: 'Haircut',
    date: '2024-01-13',
    time: '4:00 PM',
    status: 'cancelled',
    amount: 399,
    duration: '40 min',
    paymentMethod: 'online',
  },
];

export function VendorBookings() {
  const [activeTab, setActiveTab] = useState<BookingTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const activeButton = tabRefs.current[activeTab];
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'pending':
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'completed':
        return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
      case 'cancelled':
        return 'bg-red-400/20 text-red-400 border-red-400/30';
    }
  };

  const filteredBookings = mockBookings.filter(booking => {
    const matchesTab = activeTab === 'all' || booking.status === activeTab;
    const matchesSearch = searchQuery === '' || 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerPhone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    // Handle status change
    console.log('Status change', bookingId, newStatus);
  };

  const stats = {
    total: mockBookings.length,
    pending: mockBookings.filter(b => b.status === 'pending').length,
    confirmed: mockBookings.filter(b => b.status === 'confirmed').length,
    completed: mockBookings.filter(b => b.status === 'completed').length,
    revenue: mockBookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.amount, 0),
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-3 sm:px-4 py-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings..."
              className="w-full h-11 pl-9 sm:pl-10 pr-4 rounded-xl bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 py-4 sm:py-6">
        {/* Stats Banner */}
        <div className="bg-card border border-border rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <p className="text-base sm:text-lg font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Pending</p>
              <p className="text-base sm:text-lg font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Confirmed</p>
              <p className="text-base sm:text-lg font-bold text-green-400">{stats.confirmed}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Revenue</p>
              <p className="text-base sm:text-lg font-bold text-primary">₹{stats.revenue}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative mb-4 sm:mb-6">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-3 sm:-mx-4 px-3 sm:px-4">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as BookingTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  ref={(el) => { tabRefs.current[tab] = el; }}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'relative px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab !== 'all' && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-full text-xs font-medium",
                        isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      )}>
                        {mockBookings.filter(b => b.status === tab).length}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeBookingTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{
                        type: 'tween',
                        ease: [0.4, 0, 0.2, 1],
                        duration: 0.4,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {/* Scroll Hint - Right fade */}
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="bg-card border border-border rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4 hover:border-primary/50 transition-colors cursor-pointer"
              >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg sm:text-xl shrink-0">
                        {booking.customerName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{booking.customerName}</h3>
                          {booking.status === 'completed' && booking.rating && (
                            <div className="flex items-center gap-0.5 shrink-0">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium text-foreground">{booking.rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{booking.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <div className={cn(
                        'px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border flex items-center gap-1 sm:gap-1.5 text-xs font-medium',
                        getStatusColor(booking.status)
                      )}>
                        {getStatusIcon(booking.status)}
                        <span className="hidden sm:inline">{booking.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground truncate">{booking.service}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1 sm:gap-1.5">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span className="whitespace-nowrap">{booking.date} • {booking.time}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        {booking.duration}
                      </span>
                    </div>
                    {booking.address && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-foreground break-words">{booking.address}</span>
                      </div>
                    )}
                    {booking.notes && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm bg-muted/30 rounded-lg p-2">
                        <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-foreground break-words">{booking.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Amount and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                      <span className="text-lg sm:text-xl font-bold text-primary">₹{booking.amount}</span>
                      <span className="text-xs text-muted-foreground">
                        ({booking.paymentMethod})
                      </span>
                    </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(booking.id, 'confirmed');
                          }}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/30 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-400/20 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(booking.id, 'cancelled');
                          }}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-400/10 text-red-400 border border-red-400/30 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-400/20 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(booking.id, 'completed');
                        }}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(booking);
                      }}
                      className="p-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors shrink-0"
                    >
                      <Eye className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
              <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-xs sm:text-sm">
              No {activeTab === 'all' ? '' : activeTab} bookings found
            </p>
          </div>
        )}
      </div>

      {/* Booking Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedBooking(null)}
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ 
                type: 'spring',
                damping: 25,
                stiffness: 200
              }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border-t border-border sm:max-w-lg sm:mx-auto sm:rounded-xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:max-h-[85vh]"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-2.5 pb-2 sm:hidden">
                <div className="w-12 h-1 bg-muted-foreground/40 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
                <h2 className="text-base sm:text-lg font-bold text-foreground">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
                {/* Customer Info */}
                <div className="bg-muted/30 border border-border rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary shrink-0" />
                    <h3 className="font-semibold text-foreground text-sm">Customer</h3>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Name</span>
                      <span className="text-xs sm:text-sm font-medium text-foreground text-right break-words">{selectedBooking.customerName}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground text-right break-all">{selectedBooking.customerPhone}</span>
                    </div>
                    {selectedBooking.customerEmail && (
                      <div className="flex items-center justify-between gap-2">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-xs sm:text-sm text-foreground text-right break-all">{selectedBooking.customerEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                <div className="bg-muted/30 border border-border rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <h3 className="font-semibold text-foreground text-sm">Service</h3>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Service</span>
                      <span className="text-xs sm:text-sm font-medium text-foreground text-right break-words">{selectedBooking.service}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Date & Time</span>
                      <span className="text-xs sm:text-sm font-medium text-foreground text-right whitespace-nowrap">{selectedBooking.date} • {selectedBooking.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Duration</span>
                      <span className="text-xs sm:text-sm font-medium text-foreground">{selectedBooking.duration}</span>
                    </div>
                    {selectedBooking.address && (
                      <div className="flex items-start justify-between gap-2 pt-1.5 border-t border-border">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-xs text-foreground text-right flex-1 ml-2 break-words">{selectedBooking.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-muted/30 border border-border rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-4 h-4 text-primary shrink-0" />
                    <h3 className="font-semibold text-foreground text-sm">Payment</h3>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Amount</span>
                      <span className="text-base sm:text-lg font-bold text-primary">₹{selectedBooking.amount}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">Method</span>
                      <span className="text-xs sm:text-sm font-medium text-foreground capitalize">{selectedBooking.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                        className="flex-1 h-11 bg-green-400/10 text-green-400 border border-green-400/30 rounded-xl text-xs sm:text-sm font-medium hover:bg-green-400/20 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                        className="flex-1 h-11 bg-red-400/10 text-red-400 border border-red-400/30 rounded-xl text-xs sm:text-sm font-medium hover:bg-red-400/20 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                      className="w-full h-11 bg-primary/10 text-primary border border-primary/30 rounded-xl text-xs sm:text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
