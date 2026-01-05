import { useState, useMemo } from "react";
import { format, addDays } from "date-fns";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlotPickerProps {
  onSelect: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

export function SlotPicker({
  onSelect,
  selectedDate,
  selectedTime,
}: SlotPickerProps) {
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  }, []);

  const [localDate, setLocalDate] = useState(
    selectedDate || format(dates[0], "yyyy-MM-dd")
  );
  const [localTime, setLocalTime] = useState(selectedTime || "");

  const handleDateSelect = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setLocalDate(formattedDate);
    if (localTime) {
      onSelect(formattedDate, localTime);
    }
  };

  const handleTimeSelect = (time: string) => {
    setLocalTime(time);
    onSelect(localDate, time);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Select Date</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((date) => {
            const isSelected = localDate === format(date, "yyyy-MM-dd");
            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateSelect(date)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl border transition-all",
                  isSelected
                    ? "bg-yellow-400 border-yellow-400 text-white shadow-lg shadow-yellow-400/20"
                    : "bg-yellow-400 border-yellow-400 text-white/80 hover:bg-yellow-500"
                )}>
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {format(date, "EEE")}
                </span>
                <span className="text-lg font-bold">{format(date, "dd")}</span>
                <span className="text-[10px] font-medium">
                  {format(date, "MMM")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Select Time Slot
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {TIME_SLOTS.map((time) => {
            const isSelected = localTime === time;
            return (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={cn(
                  "py-3 rounded-xl border text-sm font-medium transition-all",
                  isSelected
                    ? "bg-yellow-400 border-yellow-400 text-white shadow-md shadow-yellow-400/10"
                    : "bg-yellow-400 border-yellow-400 text-white/80 hover:bg-yellow-500"
                )}>
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
