import { useState } from 'react';
import { TrendingUp, IndianRupee, Users, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeRange = 'today' | 'week' | 'month' | 'year';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  bookings: {
    current: number;
    previous: number;
    change: number;
  };
  customers: {
    current: number;
    previous: number;
    change: number;
  };
  averageOrder: {
    current: number;
    previous: number;
    change: number;
  };
}

const mockAnalytics: Record<TimeRange, AnalyticsData> = {
  today: {
    revenue: { current: 2450, previous: 2100, change: 16.67 },
    bookings: { current: 12, previous: 10, change: 20 },
    customers: { current: 8, previous: 7, change: 14.29 },
    averageOrder: { current: 204, previous: 210, change: -2.86 },
  },
  week: {
    revenue: { current: 15200, previous: 13800, change: 10.14 },
    bookings: { current: 68, previous: 62, change: 9.68 },
    customers: { current: 45, previous: 41, change: 9.76 },
    averageOrder: { current: 224, previous: 223, change: 0.45 },
  },
  month: {
    revenue: { current: 62500, previous: 58000, change: 7.76 },
    bookings: { current: 280, previous: 260, change: 7.69 },
    customers: { current: 156, previous: 145, change: 7.59 },
    averageOrder: { current: 223, previous: 223, change: 0 },
  },
  year: {
    revenue: { current: 750000, previous: 680000, change: 10.29 },
    bookings: { current: 3360, previous: 3050, change: 10.16 },
    customers: { current: 1872, previous: 1700, change: 10.12 },
    averageOrder: { current: 223, previous: 223, change: 0 },
  },
};

export function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const data = mockAnalytics[timeRange];

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `₹${data.revenue.current.toLocaleString()}`,
      change: data.revenue.change,
      icon: IndianRupee,
      color: 'text-green-400',
    },
    {
      title: 'Total Bookings',
      value: data.bookings.current.toString(),
      change: data.bookings.change,
      icon: Calendar,
      color: 'text-blue-400',
    },
    {
      title: 'Active Customers',
      value: data.customers.current.toString(),
      change: data.customers.change,
      icon: Users,
      color: 'text-purple-400',
    },
    {
      title: 'Average Order Value',
      value: `₹${data.averageOrder.current}`,
      change: data.averageOrder.change,
      icon: TrendingUp,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3">
          {/* Time Range Selector */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {(['today', 'week', 'month', 'year'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                  timeRange === range
                    ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30'
                    : 'bg-card text-muted-foreground border border-border hover:border-primary/50'
                )}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className={cn('w-5 h-5', stat.color)} />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 text-xs font-medium',
                    isPositive ? 'text-green-400' : 'text-red-400'
                  )}>
                    {isPositive ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    {Math.abs(stat.change).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.title}</p>
                  <p className={cn('text-xl font-bold', stat.color)}>{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Revenue Trend</h2>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Chart visualization will be added here</p>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Services</h2>
          <div className="space-y-3">
            {[
              { service: 'Haircut & Styling', bookings: 45, revenue: 22455 },
              { service: 'Hair Color & Treatment', bookings: 28, revenue: 36372 },
              { service: 'Facial Treatment', bookings: 32, revenue: 28768 },
              { service: 'Beard Trim', bookings: 38, revenue: 11362 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{item.service}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">₹{item.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completion Rate</span>
              <span className="text-sm font-semibold text-foreground">94.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cancellation Rate</span>
              <span className="text-sm font-semibold text-foreground">3.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Customer Retention</span>
              <span className="text-sm font-semibold text-foreground">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Rating</span>
              <span className="text-sm font-semibold text-foreground">4.7 ⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

