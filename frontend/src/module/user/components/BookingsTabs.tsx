import { cn } from '@/lib/utils'

export type BookingTabType = 'Upcoming' | 'Completed' | 'Cancelled' | 'Missed'

interface BookingsTabsProps {
  activeTab: BookingTabType
  onTabChange: (tab: BookingTabType) => void
}

export function BookingsTabs({ activeTab, onTabChange }: BookingsTabsProps) {
  const tabs: BookingTabType[] = ['Upcoming', 'Completed', 'Cancelled', 'Missed']

  return (
    <div className="flex gap-4 border-b border-[#3a3a3a] overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            'pb-3 text-sm font-medium transition-colors relative whitespace-nowrap',
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

