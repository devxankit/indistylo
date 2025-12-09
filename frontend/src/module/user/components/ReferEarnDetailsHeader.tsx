import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function ReferEarnDetailsHeader() {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-40 bg-[#060606] border-b border-[#3a3a3a]">
      <div className="flex items-center gap-3 px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-9 w-9 text-[#f5f5f5] hover:text-yellow-400 p-0 min-w-9"
          aria-label="Go back"
        >
          <span className="text-lg font-normal">&lt;</span>
        </Button>

        <h2 className="text-xs font-normal text-[#f5f5f5] leading-tight">Refer & Earn</h2>
      </div>
    </div>
  )
}

