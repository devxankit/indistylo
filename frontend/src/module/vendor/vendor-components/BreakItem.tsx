import { motion } from "framer-motion";
import { Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Break } from "../store/useScheduleStore";
import { TimePicker } from "./TimePicker";

interface BreakItemProps {
  breakData: Break;
  onUpdate: (updates: Partial<Break>) => void;
  onDelete: () => void;
}

export function BreakItem({ breakData, onUpdate, onDelete }: BreakItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-card border border-border rounded-lg p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 grid grid-cols-2 gap-2">
          <TimePicker
            value={breakData.startTime}
            onChange={(time) => onUpdate({ startTime: time })}
            label="Start"
          />
          <TimePicker
            value={breakData.endTime}
            onChange={(time) => onUpdate({ endTime: time })}
            label="End"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0 min-w-[44px] min-h-[44px] touch-manipulation flex items-center justify-center">
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
      {breakData.label && (
        <input
          type="text"
          value={breakData.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Break label (optional)"
          className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm"
        />
      )}
    </motion.div>
  );
}

