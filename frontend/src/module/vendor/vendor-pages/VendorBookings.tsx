import { useState } from 'react';
import { Calendar, Clock, User, MapPin, IndianRupee, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type BookingTab = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  amount: number;
  address?: string;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 9876543210',
    service: 'Haircut & Styling',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'confirmed',
    amount: 499,
    address: '123 Main Street, City',
  },
  {
    id: '2',
    customerName: 'Priya Sharma',
    customerPhone: '+91 9876543211',
    service: 'Hair Color & Treatment',
    date: '2024-01-15',
    time: '2:00 PM',
    status: 'pending',
    amount: 1299,
    address: '456 Park Avenue, City',
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
  },
  {
    id: '4',
    customerName: 'Sneha Patel',
    customerPhone: '+91 9876543213',
    service: 'Facial Treatment',
    date: '2024-01-14',
    time: '3:00 PM',
    status: 'completed',
    amount: 899,
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
  },
];

export function VendorBookings() {
  const [activeTab, setActiveTab] = useState<BookingTab>('all');

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

  const filteredBookings = activeTab === 'all' 
    ? mockBookings 
    : mockBookings.filter(booking => booking.status === activeTab);

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    // Handle status change
    console.log('Status change', bookingId, newStatus);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
      </div>

      <div className="px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as BookingTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                activeTab === tab
                  ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30'
                  : 'bg-card text-muted-foreground border border-border hover:border-primary/50'
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border border-border rounded-xl p-4 space-y-4 hover:border-primary/50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">{booking.customerName}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                  </div>
                  <div className={cn(
                    'px-3 py-1 rounded-lg border flex items-center gap-1.5 text-xs font-medium',
                    getStatusColor(booking.status)
                  )}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{booking.service}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{booking.date} • {booking.time}</span>
                  </div>
                  {booking.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-foreground">{booking.address}</span>
                    </div>
                  )}
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    <span className="text-xl font-bold text-primary">₹{booking.amount}</span>
                  </div>
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="px-4 py-2 bg-green-400/10 text-green-400 border border-green-400/30 rounded-lg text-sm font-medium hover:bg-green-400/20 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="px-4 py-2 bg-red-400/10 text-red-400 border border-red-400/30 rounded-lg text-sm font-medium hover:bg-red-400/20 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        className="px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-sm">
              No {activeTab === 'all' ? '' : activeTab} bookings found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

