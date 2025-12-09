import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useUserStore } from '../store/useUserStore'

export function ReferEarnHeader() {
  const navigate = useNavigate()
  const { points } = useUserStore()

  const formatPoints = (points: number) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(points >= 995 ? 0 : 1)}k`
    }
    return points.toString()
  }

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

        <h2 className="text-xs font-normal text-[#f5f5f5] leading-tight">Give One & Get One</h2>

        <div className="ml-auto">
          <button
            onClick={() => navigate('/refer-earn-details')}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-yellow-400 flex items-center justify-center bg-transparent hover:bg-yellow-400/10 cursor-pointer transition-colors"
            aria-label={`Points: ${points}`}
          >
            <span className="text-[10px] sm:text-[11px] font-bold text-yellow-400 leading-none">
              {formatPoints(points)}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

