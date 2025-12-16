import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Schedule } from "../store/useScheduleStore";
import { TimePicker } from "./TimePicker";
import { BreakItem } from "./BreakItem";

interface DayScheduleCardProps {
  schedule: Schedule;
  onToggleWorking: () => void;
  onUpdateHours: (startTime: string, endTime: string) => void;
  onAddBreak: (breakData: Omit<import("../store/useScheduleStore").Break, "id">) => void;
  onUpdateBreak: (breakId: string, updates: Partial<import("../store/useScheduleStore").Break>) => void;
  onRemoveBreak: (breakId: string) => void;
}

export function DayScheduleCard({
  schedule,
  onToggleWorking,
  onUpdateHours,
  onAddBreak,
  onUpdateBreak,
  onRemoveBreak,
}: DayScheduleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-foreground">
            {schedule.dayName}
          </h3>
          <button
            type="button"
            onClick={onToggleWorking}
            className={cn(
              "relative w-11 h-6 rounded-full transition-colors touch-manipulation",
              schedule.isWorking ? "bg-primary" : "bg-muted"
            )}>
            <span
              className={cn(
                "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                schedule.isWorking ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-muted rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.button>
      </div>

      {/* Working Hours */}
      {schedule.isWorking && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-2 border-t border-border">
              <div className="grid grid-cols-2 gap-3">
                <TimePicker
                  value={schedule.startTime}
                  onChange={(time) => onUpdateHours(time, schedule.endTime)}
                  label="Start Time"
                />
                <TimePicker
                  value={schedule.endTime}
                  onChange={(time) => onUpdateHours(schedule.startTime, time)}
                  label="End Time"
                />
              </div>

              {/* Breaks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Breaks
                  </label>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      onAddBreak({
                        startTime: "14:00",
                        endTime: "15:00",
                        label: "",
                      })
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors touch-manipulation">
                    <Plus className="w-3.5 h-3.5" />
                    Add Break
                  </motion.button>
                </div>

                <AnimatePresence>
                  {schedule.breaks.length > 0 ? (
                    <div className="space-y-2">
                      {schedule.breaks.map((breakItem) => (
                        <BreakItem
                          key={breakItem.id}
                          breakData={breakItem}
                          onUpdate={(updates) =>
                            onUpdateBreak(breakItem.id, updates)
                          }
                          onDelete={() => onRemoveBreak(breakItem.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No breaks scheduled
                    </p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {!schedule.isWorking && (
        <p className="text-xs text-muted-foreground">Closed</p>
      )}
    </motion.div>
  );
}

