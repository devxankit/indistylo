import { useState, useRef, useEffect, useMemo, memo, useCallback } from 'react';
import { TrendingUp, IndianRupee, Users, Calendar, ArrowUp, ArrowDown, BarChart3, Target, Star, Clock, Activity, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line, Area, AreaChart } from 'recharts';
import { staggerContainer, staggerItem, transitions } from '@/lib/animations';
import { useCountUp } from '@/hooks/useCountUp';
import { useSwipe } from '@/lib/touch';
import { CardSkeleton } from '@/components/ui/skeleton';

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
  { service: 'Haircut & Styling', bookings: 45, revenue: 22455, percentage: 35, fill: '#fbbf24' },
  { service: 'Hair Color & Treatment', bookings: 28, revenue: 36372, percentage: 58, fill: '#f59e0b' },
  { service: 'Facial Treatment', bookings: 32, revenue: 28768, percentage: 46, fill: '#d97706' },
  { service: 'Beard Trim', bookings: 38, revenue: 11362, percentage: 18, fill: '#b45309' },
];

const performanceMetrics = [
  { label: 'Completion Rate', value: 94.5, icon: Target },
  { label: 'Customer Satisfaction', value: 96, icon: Star },
  { label: 'Response Time', value: 88, icon: Clock },
  { label: 'Retention Rate', value: 78, icon: Users },
];

// Memoized chart component for performance
const RevenueChart = memo(({ data }: { data: typeof revenueChartData }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="h-64 relative">
      {!isLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <CardSkeleton className="w-full h-full" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transitions.smooth}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" opacity={0.2} />
              <XAxis 
                dataKey="day" 
                stroke="#a0a0a0"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis 
                stroke="#a0a0a0"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #3a3a3a',
                  borderRadius: '12px',
                  color: '#f5f5f5',
                  padding: '8px 12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
                labelStyle={{ 
                  color: '#f5f5f5',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                animationDuration={200}
                cursor={{ stroke: '#fbbf24', strokeWidth: 2, strokeDasharray: '5 5' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#fbbf24"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                animationDuration={1500}
                dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#fbbf24', strokeWidth: 2, fill: '#1a1a1a' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
});

RevenueChart.displayName = 'RevenueChart';

const BookingsChart = memo(({ data }: { data: typeof bookingsChartData }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="h-64 relative">
      {!isLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <CardSkeleton className="w-full h-full" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transitions.smooth}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                animationDuration={200}
              />
              <Bar dataKey="bookings" radius={[8, 8, 0, 0]} animationDuration={1000}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#fbbf24" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
});

BookingsChart.displayName = 'BookingsChart';

// Memoized stat card component
const StatCard = memo(({ stat, index }: { stat: typeof statsCards[0]; index: number }) => {
  const Icon = stat.icon;
  const isPositive = stat.change >= 0;
  
  // Parse numeric value for animation
  const numericValue = useMemo(() => {
    const match = stat.value.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  }, [stat.value]);
  
  const animatedValue = useCountUp(numericValue, { duration: 1500 });
  const displayValue = stat.value.includes('₹') 
    ? `₹${animatedValue.toLocaleString()}` 
    : stat.value.replace(/[\d,]+/, animatedValue.toLocaleString());

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-4 space-y-3 min-h-[120px] flex flex-col justify-between touch-manipulation active:scale-[0.98]"
    >
      <div className="flex items-center justify-between">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <motion.div
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
            isPositive ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
          )}
          animate={isPositive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          {isPositive ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )}
          {Math.abs(stat.change).toFixed(1)}%
        </motion.div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1 font-medium">{stat.title}</p>
        <motion.p
          key={animatedValue}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={transitions.quick}
          className="text-2xl font-bold text-foreground"
        >
          {displayValue}
        </motion.p>
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export function VendorAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const timeRangeRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const tabContainerRef = useRef<HTMLDivElement>(null);

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

  const data = useMemo(() => mockAnalytics[timeRange], [timeRange]);

  const statsCards = useMemo(() => [
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
  ], [data]);

  // Swipe handlers for time range navigation
  const timeRangeSwipeHandlers = useSwipe({
    onSwipeLeft: () => {
      const ranges: TimeRange[] = ['today', 'week', 'month', 'year'];
      const currentIndex = ranges.indexOf(timeRange);
      if (currentIndex < ranges.length - 1) {
        setTimeRange(ranges[currentIndex + 1]);
      }
    },
    onSwipeRight: () => {
      const ranges: TimeRange[] = ['today', 'week', 'month', 'year'];
      const currentIndex = ranges.indexOf(timeRange);
      if (currentIndex > 0) {
        setTimeRange(ranges[currentIndex - 1]);
      }
    },
    threshold: 50,
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3">
          {/* Time Range Selector */}
          <div className="relative" ref={tabContainerRef} {...timeRangeSwipeHandlers}>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              {(['today', 'week', 'month', 'year'] as TimeRange[]).map((range) => {
                const isActive = timeRange === range;
                return (
                  <motion.button
                    key={range}
                    ref={(el) => { timeRangeRefs.current[range] = el; }}
                    onClick={() => setTimeRange(range)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'relative px-2 py-2.5 min-h-[44px] text-sm font-medium whitespace-nowrap transition-colors touch-manipulation snap-center',
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
                        transition={transitions.smooth}
                      />
                    )}
                  </motion.button>
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
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4"
        >
          {statsCards.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </motion.div>

        {/* Revenue Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Revenue Trend</h2>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <RevenueChart data={revenueChartData} />
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
          <BookingsChart data={bookingsChartData} />
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.smooth}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              <Target className="w-5 h-5 text-primary" />
            </motion.div>
            <h2 className="text-lg font-semibold text-foreground">Performance Metrics</h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4"
          >
            {performanceMetrics.map((metric, index) => {
              const Icon = metric.icon;
              const animatedValue = useCountUp(metric.value, { duration: 1500, decimals: 1 });
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="bg-card border border-border rounded-lg p-4 touch-manipulation active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <motion.span
                        key={animatedValue}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={transitions.quick}
                        className="text-lg font-bold text-foreground"
                      >
                        {animatedValue.toFixed(1)}%
                      </motion.span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ ...transitions.smooth, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Top Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.smooth}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <TrendingUp className="w-5 h-5 text-primary" />
            </motion.div>
            <h2 className="text-lg font-semibold text-foreground">Service Distribution</h2>
          </div>
          
          {/* Pie Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topServices}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ service, percentage }) => `${service.split(' ')[0]} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="bookings"
                  animationDuration={1000}
                >
                  {topServices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#202020',
                    border: '1px solid #3a3a3a',
                    borderRadius: '8px',
                    color: '#f5f5f5',
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value} bookings (₹${props.payload.revenue.toLocaleString()})`,
                    props.payload.service
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-3">Service Breakdown</h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {topServices.map((item, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="p-4 bg-muted/20 rounded-lg border border-border hover:border-primary/50 transition-all touch-manipulation active:scale-[0.98] hover:-translate-y-0.5"
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
                    <motion.p
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="text-sm font-bold text-primary"
                    >
                      {item.percentage}%
                    </motion.p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ ...transitions.smooth, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.smooth}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
              <Target className="w-5 h-5 text-primary" />
            </motion.div>
            <h2 className="text-lg font-semibold text-foreground">Performance Summary</h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {[
              { label: 'Completion Rate', value: '94.5%', icon: CheckCircle2 },
              { label: 'Cancellation Rate', value: '3.2%', icon: XCircle },
              { label: 'Customer Retention', value: '78%', icon: Users },
              { label: 'Average Rating', value: '4.7 ⭐', icon: Star },
              { label: 'Response Time', value: '<5 min', icon: Clock },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-all touch-manipulation active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
