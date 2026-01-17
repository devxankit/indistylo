import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
} from "lucide-react";
import type { Booking } from "../services/types";
import { MapRoute } from "./MapRoute";

interface BookingDetailDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
  onReschedule?: () => void;
}

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
  onCancel,
  onReschedule,
}: BookingDetailDialogProps) {
  if (!booking) return null;

  const isUpcoming = booking.status === "upcoming";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-[#1a1a1a] border-[#333] text-white p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b border-[#333]">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-bold">
                {booking.service?.name || "Service"}
              </DialogTitle>
              <p className="text-sm text-[#f5f5f5]/60 mt-1">
                {booking.salon?.name || "Salon"}
              </p>
            </div>
            <span
              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${booking.status === "upcoming"
                ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/10"
                : booking.status === "completed"
                  ? "text-green-500 border-green-500/20 bg-green-500/10"
                  : "text-gray-500 border-gray-500/20 bg-gray-500/10"
                }`}>
              {booking.status}
            </span>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#f5f5f5]/40">
              Appointment Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#252525] p-3 rounded-2xl border border-[#333]">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase">Date</span>
                </div>
                <p className="text-sm font-medium">{booking.date}</p>
              </div>
              <div className="bg-[#252525] p-3 rounded-2xl border border-[#333]">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase">Time</span>
                </div>
                <p className="text-sm font-medium">{booking.time}</p>
              </div>
            </div>
          </div>

          {/* Professional & Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#f5f5f5]/40">
              Service Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-[#f5f5f5]/40">Professional</p>
                  <p className="text-sm font-medium">
                    {(booking.professional as any)?.name || "Any Professional"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-[#f5f5f5]/40">Location</p>
                  <p className="text-sm font-medium leading-snug">
                    {booking.type === "at-home"
                      ? booking.address || "Home Address"
                      : (booking.salon as any).location || "Salon Address"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Route */}
          {isUpcoming && (booking.salon as any)?.geo?.coordinates && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#f5f5f5]/40">
                Live Route
              </h3>
              <MapRoute
                destination={{
                  lat: (booking.salon as any).geo.coordinates[1],
                  lng: (booking.salon as any).geo.coordinates[0]
                }}
              />
            </div>
          )}

          {/* Payment Summary */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#f5f5f5]/40">
              Payment Summary
            </h3>
            <div className="bg-[#252525] rounded-2xl border border-[#333] overflow-hidden text-sm">
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#f5f5f5]/60">Service Amount</span>
                  <span>₹{booking.price || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#f5f5f5]/60">Taxes & Fees</span>
                  <span>₹{Math.round((booking.price || 0) * 0.18)}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-[#333] flex justify-between font-bold text-yellow-400">
                  <span>Total Paid</span>
                  <span>₹{Math.round((booking.price || 0) * 1.18)}</span>
                </div>
              </div>
              <div className="bg-green-500/5 px-4 py-2 border-t border-green-500/10 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[10px] text-green-500 font-medium uppercase tracking-wider">
                  Paid via Credit Card
                </span>
              </div>
            </div>
          </div>
        </div>

        {isUpcoming && (
          <div className="p-6 border-t border-[#333] bg-[#1a1a1a]/80 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="border-red-500/20 text-red-500 hover:bg-red-500/5 hover:border-red-500/40 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={onReschedule}
                className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                Reschedule
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
