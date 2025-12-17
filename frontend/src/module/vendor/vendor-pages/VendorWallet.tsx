import { useState, useRef, useEffect, useMemo, memo } from 'react';
import { Wallet, ArrowDown, ArrowUp, Download, CreditCard, History, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { staggerContainer, staggerItem, transitions } from '@/lib/animations';
import { useSwipe } from '@/lib/touch';
import { useCountUp } from '@/hooks/useCountUp';
import { ListItemSkeleton } from '@/components/ui/skeleton';

const formatPoints = (points: number) => {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(points >= 995 ? 0 : 1)}k`;
  }
  return points.toString();
};

const transactions = [
  {
    id: '1',
    type: 'credit',
    amount: 500,
    description: 'Service completed - Haircut & Styling',
    date: '2024-01-15',
    time: '10:30 AM',
    customer: 'Rajesh Kumar',
    status: 'completed',
  },
  {
    id: '2',
    type: 'credit',
    amount: 300,
    description: 'Service completed - Beard Trim',
    date: '2024-01-14',
    time: '2:15 PM',
    customer: 'Amit Singh',
    status: 'completed',
  },
  {
    id: '3',
    type: 'debit',
    amount: 200,
    description: 'Withdrawal to bank account',
    date: '2024-01-13',
    time: '11:00 AM',
    customer: null,
    status: 'processed',
  },
  {
    id: '4',
    type: 'credit',
    amount: 1299,
    description: 'Service completed - Hair Color & Treatment',
    date: '2024-01-12',
    time: '3:45 PM',
    customer: 'Priya Sharma',
    status: 'completed',
  },
  {
    id: '5',
    type: 'credit',
    amount: 899,
    description: 'Service completed - Facial Treatment',
    date: '2024-01-11',
    time: '1:20 PM',
    customer: 'Sneha Patel',
    status: 'completed',
  },
];

type FilterType = 'all' | 'credit' | 'debit';

// Memoized transaction card component
const TransactionCard = memo(({ 
  transaction,
  onSwipeLeft 
}: { 
  transaction: typeof transactions[0];
  onSwipeLeft?: () => void;
}) => {
  const swipeHandlers = useSwipe({
    onSwipeLeft,
    threshold: 50,
  });

  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      animate="visible"
      {...swipeHandlers}
      className="bg-card border border-border rounded-xl p-3 hover:border-primary/50 transition-all cursor-pointer touch-manipulation active:scale-[0.98] shadow-sm hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <motion.div
          className={cn(
            'p-2 rounded-lg flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center',
            transaction.type === 'credit'
              ? 'bg-green-400/10 border border-green-400/20'
              : 'bg-red-400/10 border border-red-400/20'
          )}
          whileHover={{ scale: 1.1 }}
          transition={transitions.quick}
        >
          {transaction.type === 'credit' ? (
            <ArrowUp className="w-4 h-4 text-green-400" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-400" />
          )}
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Amount Row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm leading-tight">
                {transaction.description}
              </p>
              {transaction.customer && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {transaction.customer}
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <motion.p
                className={cn(
                  'text-base font-bold',
                  transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                )}
                key={transaction.amount}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={transitions.quick}
              >
                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
              </motion.p>
            </div>
          </div>

          {/* Meta Info Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{transaction.date}</span>
            </div>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{transaction.time}</span>
            <motion.span
              className={cn(
                "ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium",
                transaction.status === 'completed' || transaction.status === 'processed'
                  ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                  : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
              )}
              animate={transaction.status !== 'completed' && transaction.status !== 'processed' ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {transaction.status}
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

TransactionCard.displayName = 'TransactionCard';

export function VendorWallet() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading] = useState(false);
  const filterRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const activeButton = filterRefs.current[filter];
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [filter]);

  const balance = 12500;
  const points = Math.floor(balance / 10);

  const filteredTransactions = useMemo(() => 
    filter === 'all' 
    ? transactions 
      : transactions.filter(t => t.type === filter),
    [filter]
  );

  const totalEarnings = useMemo(() =>
    transactions
    .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0),
    []
  );

  const totalWithdrawals = useMemo(() =>
    transactions
    .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0),
    []
  );

  const animatedBalance = useCountUp(balance, { duration: 1500 });
  const animatedEarnings = useCountUp(totalEarnings, { duration: 1500 });
  const animatedWithdrawals = useCountUp(totalWithdrawals, { duration: 1500 });
  const animatedPoints = useCountUp(points, { duration: 1500 });

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Balance Card with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.smooth}
          className="relative bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border border-border/50 rounded-xl p-6 shadow-lg overflow-hidden"
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
          
          <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <motion.div
                  className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                <Wallet className="w-7 h-7 text-primary" />
                </motion.div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Balance</p>
                  <motion.p
                    key={animatedBalance}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={transitions.quick}
                    className="text-4xl font-bold text-foreground mt-1"
                  >
                    ₹{animatedBalance.toLocaleString()}
                  </motion.p>
              </div>
            </div>
          </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transitions.smooth, delay: 0.1 }}
              >
              <p className="text-xs text-muted-foreground mb-1">IndiStylo Points</p>
                <motion.p
                  key={animatedPoints}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={transitions.quick}
                  className="text-xl font-bold text-foreground"
                >
                  {formatPoints(animatedPoints)} ISP
                </motion.p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transitions.smooth, delay: 0.2 }}
              >
              <p className="text-xs text-muted-foreground mb-1">Available</p>
                <motion.p
                  key={animatedBalance}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={transitions.quick}
                  className="text-xl font-bold text-primary"
                >
                  ₹{animatedBalance.toLocaleString()}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowWithdrawModal(true)}
            className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-all min-h-[120px] touch-manipulation flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="p-2 bg-primary/10 rounded-lg w-fit mb-2"
            >
              <Download className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <p className="font-semibold text-foreground text-sm">Withdraw</p>
              <p className="text-xs text-muted-foreground mt-1">Transfer to bank</p>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-all min-h-[120px] touch-manipulation flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="p-2 bg-primary/10 rounded-lg w-fit mb-2"
            >
              <History className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <p className="font-semibold text-foreground text-sm">History</p>
              <p className="text-xs text-muted-foreground mt-1">View all transactions</p>
            </div>
          </motion.button>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitions.smooth}
          className="bg-card border border-border rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-foreground">Earnings Summary</h3>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
            >
            <CreditCard className="w-5 h-5 text-primary" />
            </motion.div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Earnings</span>
              <motion.span
                key={animatedEarnings}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={transitions.quick}
                className="text-sm font-bold text-green-400"
              >
                ₹{animatedEarnings.toLocaleString()}
              </motion.span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Withdrawals</span>
              <motion.span
                key={animatedWithdrawals}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={transitions.quick}
                className="text-sm font-bold text-red-400"
              >
                ₹{animatedWithdrawals.toLocaleString()}
              </motion.span>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Net Balance</span>
              <motion.span
                key={animatedBalance}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={transitions.quick}
                className="text-base font-bold text-foreground"
              >
                ₹{animatedBalance.toLocaleString()}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Transaction Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Transactions</h2>
              <p className="text-xs text-muted-foreground">View your earnings and withdrawals</p>
            </div>
          </div>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {(['all', 'credit', 'debit'] as FilterType[]).map((f) => {
                const isActive = filter === f;
                return (
                  <button
                    key={f}
                    ref={(el) => { filterRefs.current[f] = el; }}
                    onClick={() => setFilter(f)}
                    className={cn(
                      'relative px-2 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {f === 'all' ? 'All' : f === 'credit' ? 'Earnings' : 'Withdrawals'}
                    {isActive && (
                      <motion.div
                        layoutId="activeFilter"
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

        {/* Transactions List */}
        {isLoading ? (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((transaction) => (
                <TransactionCard
                key={transaction.id}
                  transaction={transaction}
                  onSwipeLeft={() => {
                    // Handle swipe action
                    console.log('Swipe left on transaction', transaction.id);
                  }}
                />
            ))}
          </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitions.quick}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowWithdrawModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={transitions.spring}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-0 left-0 right-0 z-50 w-full bg-background rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              {/* Drag Handle */}
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1.5 bg-muted-foreground/40 rounded-full" />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Withdraw Funds</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-2 min-w-[44px] min-h-[44px] hover:bg-muted rounded-lg transition-colors touch-manipulation flex items-center justify-center"
                  aria-label="Close"
                >
                  ×
                </motion.button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount (₹)
                  </label>
                  <motion.input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full h-14 min-h-[44px] px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground text-base touch-manipulation"
                    max={balance}
                    whileFocus={{ scale: 1.02 }}
                    transition={transitions.quick}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Available: ₹{animatedBalance.toLocaleString()}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    console.log('Withdraw:', withdrawAmount);
                    setShowWithdrawModal(false);
                  }}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) > balance}
                  className={cn(
                    "w-full h-14 min-h-[44px] font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation",
                    !withdrawAmount || parseFloat(withdrawAmount) > balance
                      ? "bg-transparent border-2 border-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                      : "bg-primary/10 border-2 border-primary text-primary hover:bg-primary/20"
                  )}
                >
                  <Download className="w-5 h-5" />
                  Withdraw Now
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
