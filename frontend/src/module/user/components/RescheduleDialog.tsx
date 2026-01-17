import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SlotPicker } from "./SlotPicker";
import type { Booking } from "../services/types";

interface RescheduleDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (
    bookingId: string,
    date: string,
    time: string
  ) => Promise<void>;
}

export function RescheduleDialog({
  booking,
  open,
  onOpenChange,
  onReschedule,
}: RescheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleConfirm = async () => {
    if (!booking || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      await onReschedule(booking._id || booking.id || "", selectedDate, selectedTime);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-[#1a1a1a] border-[#333] text-white p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">
            Reschedule Booking
          </DialogTitle>
          {booking && (
            <p className="text-sm text-[#f5f5f5]/60 mt-1">
              Currently scheduled for {booking.date} at {booking.time}
            </p>
          )}
        </DialogHeader>

        <div className="p-6 flex-1 overflow-y-auto">
          <SlotPicker
            onSelect={handleSelect}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </div>

        <DialogFooter className="p-6 pt-0 bg-[#1a1a1a]/80 backdrop-blur-sm">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[#333] text-white hover:bg-white/5"
              disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime || isSubmitting}
              className="flex-1 bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
              {isSubmitting ? "Rescheduling..." : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
