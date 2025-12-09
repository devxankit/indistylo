import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookingsHeaderProps {
  onSortClick?: () => void
}

export function BookingsHeader({ onSortClick }: BookingsHeaderProps) {
  return (
    <div className="bg-[#060606] border-b border-[#3a3a3a] md:mt-16">
      <div className="flex items-center justify-between px-4 py-3">
        <h4 className="text-lg md:text-2xl font-bold text-[#f5f5f5]">Bookings</h4>
        
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSortClick}
            className="h-9 w-9 text-[#f5f5f5] hover:text-yellow-400"
            aria-label="Sort"
          >
            <ArrowUpDown className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

