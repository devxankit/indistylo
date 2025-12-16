import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TimePickerProps {
  value: string; // "HH:MM" format
  onChange: (time: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  label,
  disabled = false,
  className,
}: TimePickerProps) {
  const [hours, setHours] = useState(value.split(":")[0] || "09");
  const [minutes, setMinutes] = useState(value.split(":")[1] || "00");
  const [isOpen, setIsOpen] = useState(false);

  // Sync local state when value prop changes externally
  useEffect(() => {
    const [newHours, newMinutes] = value.split(":");
    if (newHours && newMinutes) {
      setHours(newHours);
      setMinutes(newMinutes);
    }
  }, [value]);

  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="block text-xs font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full h-11 px-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base flex items-center gap-2 touch-manipulation",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
        <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="flex-1 text-left">
          {hours.padStart(2, "0")}:{minutes.padStart(2, "0")}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 p-3 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {/* Hours */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                    Hours
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {hourOptions.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => {
                          setHours(hour);
                          setIsOpen(false);
                          onChange(`${hour.padStart(2, "0")}:${minutes.padStart(2, "0")}`);
                        }}
                        className={cn(
                          "w-full py-2 px-3 rounded text-sm transition-colors touch-manipulation",
                          hours === hour
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                        )}>
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minutes */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                    Minutes
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {minuteOptions
                      .filter((_, i) => i % 5 === 0) // Show only 5-minute intervals
                      .map((minute) => (
                        <button
                          key={minute}
                          type="button"
                          onClick={() => {
                            setMinutes(minute);
                            setIsOpen(false);
                            onChange(`${hours.padStart(2, "0")}:${minute.padStart(2, "0")}`);
                          }}
                          className={cn(
                            "w-full py-2 px-3 rounded text-sm transition-colors touch-manipulation",
                            minutes === minute
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground hover:bg-muted"
                          )}>
                          {minute}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

