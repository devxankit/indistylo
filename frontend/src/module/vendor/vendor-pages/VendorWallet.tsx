import { useState, useRef, useEffect } from 'react';
import { Wallet, ArrowDown, ArrowUp, Download, CreditCard, History, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

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

export function VendorWallet() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
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

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  const totalEarnings = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="px-4 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Wallet className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Balance</p>
                <p className="text-4xl font-bold text-foreground mt-1">
                  ₹{balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">IndiStylo Points</p>
              <p className="text-xl font-bold text-foreground">
                {formatPoints(points)} ISP
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Available</p>
              <p className="text-xl font-bold text-primary">
                ₹{balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-2">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold text-foreground text-sm">Withdraw</p>
            <p className="text-xs text-muted-foreground mt-1">Transfer to bank</p>
          </button>
          <button
            className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-2">
              <History className="w-5 h-5 text-primary" />
            </div>
            <p className="font-semibold text-foreground text-sm">History</p>
            <p className="text-xs text-muted-foreground mt-1">View all transactions</p>
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-foreground">Earnings Summary</h3>
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Earnings</span>
              <span className="text-sm font-bold text-green-400">₹{totalEarnings.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Withdrawals</span>
              <span className="text-sm font-bold text-red-400">₹{totalWithdrawals.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Net Balance</span>
              <span className="text-base font-bold text-foreground">₹{balance.toLocaleString()}</span>
            </div>
          </div>
        </div>

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
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-card border border-border rounded-xl p-3 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      'p-2 rounded-lg flex-shrink-0',
                      transaction.type === 'credit'
                        ? 'bg-green-400/10 border border-green-400/20'
                        : 'bg-red-400/10 border border-red-400/20'
                    )}
                  >
                    {transaction.type === 'credit' ? (
                      <ArrowUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>

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
                        <p
                          className={cn(
                            'text-base font-bold',
                            transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                          )}
                        >
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                        </p>
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
                      <span className={cn(
                        "ml-auto px-2 py-0.5 rounded-full text-[10px] font-medium",
                        transaction.status === 'completed' || transaction.status === 'processed'
                          ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                          : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                      )}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowWithdrawModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-background rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Withdraw Funds</h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full h-14 px-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground"
                    max={balance}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Available: ₹{balance.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    console.log('Withdraw:', withdrawAmount);
                    setShowWithdrawModal(false);
                  }}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) > balance}
                  className={cn(
                    "w-full h-14 font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2",
                    !withdrawAmount || parseFloat(withdrawAmount) > balance
                      ? "bg-transparent border-2 border-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                      : "bg-primary/10 border-2 border-primary text-primary hover:bg-primary/20"
                  )}
                >
                  <Download className="w-5 h-5" />
                  Withdraw Now
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
