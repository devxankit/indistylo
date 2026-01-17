import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Home, Building2, User } from "lucide-react";


interface BookingCardProps {
  booking: any; // Using any for flexibility with store types
  onReschedule?: () => void;
  onCancel?: () => void;
  onBookAgain?: () => void;
  onReview?: () => void;
  onViewDetails?: () => void;
}

export function BookingCard({
  booking,
  onReschedule,
  onCancel,
  onBookAgain,
  onReview,
  onViewDetails,
}: BookingCardProps) {
  const isUpcoming = booking.status === "upcoming";
  const isCompleted = booking.status === "completed";
  const isCancelled = booking.status === "cancelled";
  const isMissed = booking.status === "missed";

  const salonName = booking.salon?.name || "Salon";
  const serviceName = booking.service?.name || "Service";
  const professionalName = booking.staff?.name;
  const time = booking.timeSlot || booking.time;

  const getStatusColor = () => {
    switch (booking.status) {
      case "upcoming":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "completed":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "cancelled":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "missed":
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <Card
      onClick={onViewDetails}
      className={`border-l-4 bg-[#202020] border-[#3a3a3a] cursor-pointer hover:bg-[#252525] transition-colors ${isUpcoming
          ? "border-l-yellow-400"
          : isCompleted
            ? "border-l-green-500"
            : isCancelled
              ? "border-l-red-500"
              : "border-l-gray-500"
        } ${isCompleted || isCancelled || isMissed ? "opacity-75" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {booking.type === "at-home" ? (
                  <Home className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Building2 className="w-4 h-4 text-yellow-400" />
                )}
                <CardTitle className="text-base text-[#f5f5f5]">
                  {serviceName}
                </CardTitle>
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getStatusColor()}`}>
                {booking.status}
              </span>
            </div>
            <p className="text-sm text-[#f5f5f5]/80 mb-2 text-left">
              {salonName}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#f5f5f5]/60 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-yellow-400/60" />
                <span>{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-yellow-400/60" />
                <span>{time}</span>
              </div>
              {professionalName && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-yellow-400/60" />
                  <span>{professionalName}</span>
                </div>
              )}
            </div>

            {booking.price !== undefined && (
              <div className="flex items-center justify-between border-t border-[#3a3a3a] pt-3 mt-1 mb-3">
                <span className="text-xs text-[#f5f5f5]/40">Total Amount</span>
                <span className="text-sm font-bold text-yellow-400">
                  ₹{booking.price}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {isUpcoming && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#2a2a2a] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onReschedule?.();
              }}>
              Reschedule
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onCancel?.();
              }}>
              Cancel
            </Button>
          </div>
        )}

        {(isCompleted || isCancelled || isMissed) && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-[#3a3a3a] text-[#f5f5f5] hover:bg-[#2a2a2a] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onBookAgain?.();
              }}>
              Book Again
            </Button>
            {isCompleted && (
              <Button
                size="sm"
                className="flex-1 bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold shadow-lg shadow-yellow-400/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onReview?.();
                }}>
                Rate Now
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
