import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { transitions, staggerContainer } from "@/lib/animations";
import { useScheduleStore } from "../store/useScheduleStore";
import { DayScheduleCard } from "../vendor-components/DayScheduleCard";

export function VendorSchedule() {
  const navigate = useNavigate();
  const {
    schedules,
    updateWorkingHours,
    toggleDay,
    addBreak,
    removeBreak,
    updateBreak,
  } = useScheduleStore();

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    // In real app, save to backend
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-2 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/vendor/profile")}
            className="p-2 min-w-[44px] min-h-[44px] hover:bg-muted rounded-lg transition-colors touch-manipulation flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold font-size-10 text-foreground">
              Schedule
            </h2>
            <p className="text-[6px] text-muted-foreground truncate">
              Manage working hours
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors touch-manipulation min-h-[44px] flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span className="text-sm">{isSaving ? "Saving..." : "Save"}</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Working Hours
            </h3>
            <p className="text-xs text-muted-foreground">
              Set your availability for each day of the week. Add breaks to
              block out unavailable time slots.
            </p>
          </div>
        </motion.div>

        {/* Schedule Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-3">
          {schedules.map((schedule) => (
            <DayScheduleCard
              key={schedule.dayOfWeek}
              schedule={schedule}
              onToggleWorking={() => toggleDay(schedule.dayOfWeek)}
              onUpdateHours={(startTime, endTime) =>
                updateWorkingHours(schedule.dayOfWeek, startTime, endTime)
              }
              onAddBreak={(breakData) =>
                addBreak(schedule.dayOfWeek, breakData)
              }
              onUpdateBreak={(breakId, updates) =>
                updateBreak(schedule.dayOfWeek, breakId, updates)
              }
              onRemoveBreak={(breakId) =>
                removeBreak(schedule.dayOfWeek, breakId)
              }
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
