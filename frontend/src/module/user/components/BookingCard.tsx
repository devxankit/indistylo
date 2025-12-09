import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Home, Building2 } from 'lucide-react'

interface Booking {
  id: string;
  salonName: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'missed';
  type: 'at-salon' | 'at-home';
}

interface BookingCardProps {
  booking: Booking
  onReschedule?: () => void
  onCancel?: () => void
  onBookAgain?: () => void
}

export function BookingCard({ booking, onReschedule, onCancel, onBookAgain }: BookingCardProps) {
  const isUpcoming = booking.status === 'upcoming'
  const isCompleted = booking.status === 'completed'
  const isCancelled = booking.status === 'cancelled'
  const isMissed = booking.status === 'missed'

  return (
    <Card className={`border-l-4 bg-[#202020] border-[#3a3a3a] ${
      isUpcoming ? 'border-l-yellow-400' :
      isCompleted ? 'border-l-green-500' :
      isCancelled ? 'border-l-red-500' :
      'border-l-gray-500'
    } ${isCompleted || isCancelled || isMissed ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {booking.type === 'at-home' ? (
                <Home className="w-4 h-4 text-yellow-400" />
              ) : (
                <Building2 className="w-4 h-4 text-yellow-400" />
              )}
              <CardTitle className="text-base text-[#f5f5f5]">{booking.service}</CardTitle>
            </div>
            <p className="text-sm text-[#f5f5f5]/80 mb-2 text-left">
              {booking.salonName}
            </p>
            <div className="flex items-center gap-4 text-xs text-[#f5f5f5]/60">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{booking.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{booking.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isUpcoming && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#202020]"
              onClick={onReschedule}
            >
              Reschedule
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#202020]"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        )}

        {(isCompleted || isCancelled || isMissed) && (
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#202020]"
            onClick={onBookAgain}
          >
            Book Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

