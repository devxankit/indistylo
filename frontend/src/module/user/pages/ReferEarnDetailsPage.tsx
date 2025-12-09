import { useState } from 'react'
import { useUserStore } from '../store/useUserStore'
import { ReferEarnDetailsHeader } from '../components/ReferEarnDetailsHeader'
import { RewardsSummaryCard } from '../components/RewardsSummaryCard'
import { ReferEarnTabs } from '../components/ReferEarnTabs'
import { MembershipBonusCard } from '../components/MembershipBonusCard'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

type TabType = 'Earned' | 'Spent' | 'Offers'

export function ReferEarnDetailsPage() {
  const { points } = useUserStore()
  const [activeTab, setActiveTab] = useState<TabType>('Earned')

  // Generate a referral code (in real app, this would come from the backend)
  const referralCode = 'INDISTYLO867C3'

  // Mock data for membership bonus
  const membershipBonus = {
    date: 'Nov 26, 2025',
    time: '12:28 pm',
    points: 1000,
  }

  return (
    <div className="min-h-screen bg-[#060606] text-[#f5f5f5] pb-24">
      <ReferEarnDetailsHeader />

      <div className="space-y-4">
        {/* Rewards Summary Card */}
        <RewardsSummaryCard totalRewards={points} referralCode={referralCode} />

        {/* Tabs */}
        <ReferEarnTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content based on active tab */}
        {activeTab === 'Earned' && (
          <div className="space-y-4 pt-4">
            <MembershipBonusCard
              date={membershipBonus.date}
              time={membershipBonus.time}
              points={membershipBonus.points}
            />
          </div>
        )}

        {activeTab === 'Spent' && (
          <div className="px-4 pt-4">
            <p className="text-sm text-[#f5f5f5]/60 text-center py-8">No spent transactions yet</p>
          </div>
        )}

        {activeTab === 'Offers' && (
          <div className="px-4 pt-4">
            <p className="text-sm text-[#f5f5f5]/60 text-center py-8">No offers available</p>
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#060606] z-30">
        <Button
          className="w-full h-12 bg-[#151515] text-white hover:bg-[#202020] font-semibold text-base rounded-lg border-0 flex items-center justify-center gap-2"
          onClick={() => {
            // Handle share referral code
            navigator.clipboard.writeText(referralCode)
            // You can add a toast notification here
          }}
        >
          <Share2 className="w-4 h-4" />
          Share Referral Code
        </Button>
      </div>
    </div>
  )
}

