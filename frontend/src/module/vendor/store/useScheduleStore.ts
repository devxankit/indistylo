import { create } from "zustand";

export interface Break {
  id: string;
  startTime: string; // "14:00"
  endTime: string; // "15:00"
  label?: string;
}

export interface Schedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  dayName: string; // "Sunday", "Monday", etc.
  isWorking: boolean;
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  breaks: Break[];
}

interface ScheduleState {
  schedules: Schedule[];
  updateWorkingHours: (dayOfWeek: number, startTime: string, endTime: string) => void;
  toggleDay: (dayOfWeek: number) => void;
  addBreak: (dayOfWeek: number, breakData: Omit<Break, "id">) => void;
  removeBreak: (dayOfWeek: number, breakId: string) => void;
  updateBreak: (dayOfWeek: number, breakId: string, updates: Partial<Break>) => void;
  getSchedule: (dayOfWeek: number) => Schedule | undefined;
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Initial schedule - all days working 9 AM to 6 PM
const initialSchedules: Schedule[] = dayNames.map((dayName, index) => ({
  dayOfWeek: index,
  dayName,
  isWorking: index !== 0, // Sunday closed by default
  startTime: "09:00",
  endTime: "18:00",
  breaks: [],
}));

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: initialSchedules,

  updateWorkingHours: (dayOfWeek, startTime, endTime) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.dayOfWeek === dayOfWeek
          ? { ...schedule, startTime, endTime }
          : schedule
      ),
    }));
  },

  toggleDay: (dayOfWeek) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.dayOfWeek === dayOfWeek
          ? { ...schedule, isWorking: !schedule.isWorking }
          : schedule
      ),
    }));
  },

  addBreak: (dayOfWeek, breakData) => {
    const newBreak: Break = {
      ...breakData,
      id: `break_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.dayOfWeek === dayOfWeek
          ? { ...schedule, breaks: [...schedule.breaks, newBreak] }
          : schedule
      ),
    }));
  },

  removeBreak: (dayOfWeek, breakId) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.dayOfWeek === dayOfWeek
          ? {
              ...schedule,
              breaks: schedule.breaks.filter((b) => b.id !== breakId),
            }
          : schedule
      ),
    }));
  },

  updateBreak: (dayOfWeek, breakId, updates) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.dayOfWeek === dayOfWeek
          ? {
              ...schedule,
              breaks: schedule.breaks.map((b) =>
                b.id === breakId ? { ...b, ...updates } : b
              ),
            }
          : schedule
      ),
    }));
  },

  getSchedule: (dayOfWeek) => {
    return get().schedules.find((schedule) => schedule.dayOfWeek === dayOfWeek);
  },
}));

