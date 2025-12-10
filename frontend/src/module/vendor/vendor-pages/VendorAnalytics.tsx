import { useState, useRef, useEffect } from 'react';
import { TrendingUp, IndianRupee, Users, Calendar, ArrowUp, ArrowDown, BarChart3, Target, Star, Clock, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

// Mock chart data
const revenueChartData = [
  { day: 'Mon', revenue: 1200 },
  { day: 'Tue', revenue: 1800 },
  { day: 'Wed', revenue: 1500 },
  { day: 'Thu', revenue: 2200 },
  { day: 'Fri', revenue: 1900 },
  { day: 'Sat', revenue: 2450 },
  { day: 'Sun', revenue: 2100 },
];

const bookingsChartData = [
  { day: 'Mon', bookings: 8 },
  { day: 'Tue', bookings: 12 },
  { day: 'Wed', bookings: 10 },
  { day: 'Thu', bookings: 15 },
  { day: 'Fri', bookings: 13 },
  { day: 'Sat', bookings: 18 },
  { day: 'Sun', bookings: 12 },
];

const topServices = [
  { service: 'Haircut & Styling', bookings: 45, revenue: 22455, percentage: 35 },
  { service: 'Hair Color & Treatment', bookings: 28, revenue: 36372, percentage: 58 },
  { service: 'Facial Treatment', bookings: 32, revenue: 28768, percentage: 46 },
  { service: 'Beard Trim', bookings: 38, revenue: 11362, percentage: 18 },
];

const performanceMetrics = [
  { label: 'Completion Rate', value: 94.5, icon: Target },
  { label: 'Customer Satisfaction', value: 96, icon: Star },
  { label: 'Response Time', value: 88, icon: Clock },
  { label: 'Retention Rate', value: 78, icon: Users },
];

export function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const timeRangeRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const activeButton = timeRangeRefs.current[timeRange];
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [timeRange]);

  const data = mockAnalytics[timeRange];

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `₹${data.revenue.current.toLocaleString()}`,
      change: data.revenue.change,
      icon: IndianRupee,
    },
    {
      title: 'Total Bookings',
      value: data.bookings.current.toString(),
      change: data.bookings.change,
      icon: Calendar,
    },
    {
      title: 'Active Customers',
      value: data.customers.current.toString(),
      change: data.customers.change,
      icon: Users,
    },
    {
      title: 'Average Order Value',
      value: `₹${data.averageOrder.current}`,
      change: data.averageOrder.change,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3">
          {/* Time Range Selector */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {(['today', 'week', 'month', 'year'] as TimeRange[]).map((range) => {
                const isActive = timeRange === range;
                return (
                  <button
                    key={range}
                    ref={(el) => { timeRangeRefs.current[range] = el; }}
                    onClick={() => setTimeRange(range)}
                    className={cn(
                      'relative px-2 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                    {isActive && (
                      <motion.div
                        layoutId="activeTimeRange"
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
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
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
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                    isPositive ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
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
                  <p className="text-xs text-muted-foreground mb-1 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Revenue Trend</h2>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  stroke="#a0a0a0"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#a0a0a0"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#202020',
                    border: '1px solid #3a3a3a',
                    borderRadius: '8px',
                    color: '#f5f5f5',
                  }}
                  labelStyle={{ color: '#f5f5f5' }}
                  formatter={(value: number) => [`₹${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {revenueChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#fbbf24" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Bookings Trend</h2>
            </div>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" opacity={0.3} />
                <XAxis 
                  dataKey="day" 
                  stroke="#a0a0a0"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#a0a0a0"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#202020',
                    border: '1px solid #3a3a3a',
                    borderRadius: '8px',
                    color: '#f5f5f5',
                  }}
                  labelStyle={{ color: '#f5f5f5' }}
                  formatter={(value: number) => [`${value}`, 'Bookings']}
                />
                <Bar dataKey="bookings" radius={[8, 8, 0, 0]}>
                  {bookingsChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#fbbf24" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Performance Metrics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">{metric.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Top Services</h2>
          </div>
          <div className="space-y-3">
            {topServices.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-muted/20 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm mb-1">{item.service}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{item.bookings} bookings</span>
                      <span>•</span>
                      <span>₹{item.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{item.percentage}%</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Performance Summary</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Completion Rate', value: '94.5%', icon: CheckCircle2 },
              { label: 'Cancellation Rate', value: '3.2%', icon: XCircle },
              { label: 'Customer Retention', value: '78%', icon: Users },
              { label: 'Average Rating', value: '4.7 ⭐', icon: Star },
              { label: 'Response Time', value: '<5 min', icon: Clock },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
