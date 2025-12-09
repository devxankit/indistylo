import { cn } from '@/lib/utils'

type TabType = 'Earned' | 'Spent' | 'Offers'

interface ReferEarnTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function ReferEarnTabs({ activeTab, onTabChange }: ReferEarnTabsProps) {
  const tabs: TabType[] = ['Earned', 'Spent', 'Offers']

  return (
    <div className="flex gap-6 px-4 border-b border-[#3a3a3a]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            'pb-3 text-sm font-medium transition-colors relative',
            activeTab === tab
              ? 'text-yellow-400'
              : 'text-[#f5f5f5]/60 hover:text-[#f5f5f5]'
          )}
        >
          {tab}
          {activeTab === tab && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
          )}
        </button>
      ))}
    </div>
  )
}

