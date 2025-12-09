import { Wallet, TrendingUp, IndianRupee, ArrowRight } from 'lucide-react';
import { useUserStore } from '../../user/store/useUserStore';
import { cn } from '@/lib/utils';

export function VendorWallet() {
  const { points } = useUserStore();

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
    },
    {
      id: '2',
      type: 'credit',
      amount: 300,
      description: 'Service completed - Beard Trim',
      date: '2024-01-14',
      time: '2:15 PM',
    },
    {
      id: '3',
      type: 'debit',
      amount: 200,
      description: 'Withdrawal to bank account',
      date: '2024-01-13',
      time: '11:00 AM',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-400/10 border-2 border-yellow-400/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-400/20 rounded-xl">
                <Wallet className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  ₹{points * 10 || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-yellow-400/20">
            <div>
              <p className="text-xs text-muted-foreground">IndiStylo Points</p>
              <p className="text-lg font-semibold text-foreground mt-1">
                {formatPoints(points || 0)} ISP
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              // Handle withdraw
              console.log('Withdraw clicked');
            }}
            className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-2">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
            <p className="font-medium text-foreground text-sm">Withdraw</p>
            <p className="text-xs text-muted-foreground mt-1">Transfer to bank</p>
          </button>
          <button
            onClick={() => {
              // Handle transactions
              console.log('Transactions clicked');
            }}
            className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-lg w-fit mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="font-medium text-foreground text-sm">Transactions</p>
            <p className="text-xs text-muted-foreground mt-1">View history</p>
          </button>
        </div>

        {/* Recent Transactions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
            <button
              onClick={() => {
                // View all transactions
                console.log('View all clicked');
              }}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'p-2 rounded-lg',
                          transaction.type === 'credit'
                            ? 'bg-green-400/20'
                            : 'bg-red-400/20'
                        )}
                      >
                        {transaction.type === 'credit' ? (
                          <IndianRupee className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-red-400 rotate-180" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {transaction.date} • {transaction.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'text-lg font-bold',
                        transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                      )}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

