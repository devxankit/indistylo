import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RewardsSummaryCardProps {
  totalRewards: number
  referralCode: string
}

export function RewardsSummaryCard({ totalRewards, referralCode }: RewardsSummaryCardProps) {
  const formatPoints = (points: number) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(points >= 995 ? 0 : 1)}k`
    }
    return points.toString()
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    // You can add a toast notification here
  }

  return (
    <div className="relative bg-yellow-400 rounded-xl p-6 mx-4 mt-4 overflow-hidden">
      {/* Background Logo */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <div className="relative w-24 h-24">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1 font-serif">IS</div>
              <div className="text-[8px] text-white font-medium leading-tight">INDISTYLO<br />POINTS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-left">
        <p className="text-white text-sm mb-2 text-left">Total Rewards Earned</p>
        <p className="text-white text-4xl font-bold mb-6 text-left">{formatPoints(totalRewards)}</p>

        {/* Referral Code Section */}
        <div className="bg-white rounded-sm p-[2px] flex items-center justify-start gap-[2px] w-fit">
          <span className="text-[#060606] text-[7px] font-medium leading-tight">{referralCode}</span>
          <Button
            onClick={handleCopyCode}
            className="bg-white text-yellow-400 hover:bg-gray-100 text-[6px] font-medium px-[3px] py-0 h-auto flex items-center gap-[2px] border border-yellow-400 rounded-sm"
          >
            <span className="leading-tight">Share Code</span>
            <Copy className="w-[10px] h-[10px]" />
          </Button>
        </div>
      </div>
    </div>
  )
}

