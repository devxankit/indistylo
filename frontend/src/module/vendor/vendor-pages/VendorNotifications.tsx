import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  IndianRupee,
  Users,
  Clock,
  Filter,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, transitions } from '@/lib/animations';
import { useCountUp } from '@/hooks/useCountUp';

type NotificationType = 'booking' | 'payment' | 'system' | 'promotion';
type NotificationStatus = 'read' | 'unread';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  status: NotificationStatus;
  actionUrl?: string;
  amount?: number;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'New Booking Received',
    message: 'Rajesh Kumar booked Haircut & Styling for Jan 15, 10:00 AM',
    timestamp: '2 minutes ago',
    status: 'unread',
    actionUrl: '/vendor/bookings/1',
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of ₹499 received for booking #1234',
    timestamp: '1 hour ago',
    status: 'unread',
    amount: 499,
  },
  {
    id: '3',
    type: 'booking',
    title: 'Booking Cancelled',
    message: 'Amit Singh cancelled Beard Trim booking',
    timestamp: '3 hours ago',
    status: 'read',
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update',
    message: 'Your profile verification is pending. Please complete it.',
    timestamp: '1 day ago',
    status: 'read',
  },
  {
    id: '5',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off on premium features this month!',
    timestamp: '2 days ago',
    status: 'read',
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'booking':
      return Calendar;
    case 'payment':
      return IndianRupee;
    case 'system':
      return AlertCircle;
    case 'promotion':
      return Bell;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'booking':
      return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
    case 'payment':
      return 'bg-green-400/20 text-green-400 border-green-400/30';
    case 'system':
      return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
    case 'promotion':
      return 'bg-purple-400/20 text-purple-400 border-purple-400/30';
  }
};

export function VendorNotifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = useMemo(() => {
    let filtered = mockNotifications;
    
    if (filter !== 'all') {
      filtered = filtered.filter((n) => n.type === filter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [filter, searchQuery]);

  const unreadCount = useMemo(
    () => mockNotifications.filter((n) => n.status === 'unread').length,
    []
  );

  const animatedUnreadCount = useCountUp(unreadCount, { duration: 1000 });

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      }
    },
    [navigate]
  );

  const markAllAsRead = useCallback(() => {
    // Handle mark all as read
    console.log('Mark all as read');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      >
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/vendor/profile')}
              className="p-2 min-w-[44px] min-h-[44px] hover:bg-muted rounded-lg transition-colors touch-manipulation flex items-center justify-center shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </motion.button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-foreground">Notifications</h1>
              <p className="text-xs text-muted-foreground">
                {animatedUnreadCount} unread
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="px-3 py-1.5 min-h-[36px] bg-primary/10 text-primary border border-primary/30 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors touch-manipulation whitespace-nowrap"
            >
              Mark all read
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-4">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full h-11 min-h-[44px] pl-10 pr-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground text-base touch-manipulation"
          />
        </motion.div>

        {/* Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.2 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
        >
          {(['all', 'booking', 'payment', 'system', 'promotion'] as const).map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap touch-manipulation min-h-[36px]',
                filter === f
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type);
                const isUnread = notification.status === 'unread';

                return (
                  <motion.div
                    key={notification.id}
                    variants={staggerItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'bg-card border border-border rounded-xl p-4 cursor-pointer touch-manipulation active:scale-[0.98] transition-all',
                      isUnread && 'border-primary/50 bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        className={cn(
                          'p-2 rounded-lg border min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0',
                          getNotificationColor(notification.type)
                        )}
                        whileHover={{ scale: 1.1 }}
                        transition={transitions.quick}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3
                            className={cn(
                              'text-sm font-semibold text-foreground',
                              isUnread && 'font-bold'
                            )}
                          >
                            {notification.title}
                          </h3>
                          {isUnread && (
                            <motion.div
                              className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">
                              {notification.timestamp}
                            </span>
                          </div>
                          {notification.amount && (
                            <div className="flex items-center gap-1">
                              <IndianRupee className="w-3 h-3 text-green-400" />
                              <span className="text-xs font-bold text-green-400">
                                ₹{notification.amount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={transitions.smooth}
            className="text-center py-12"
          >
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No notifications found
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

