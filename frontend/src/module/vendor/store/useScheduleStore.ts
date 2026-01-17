import { create } from "zustand";
import { api } from "../../user/services/apiClient";

export interface Break {
  _id: string;
  startTime: string; // "14:00"
  endTime: string; // "15:00"
  label?: string;
}

export interface Schedule {
  _id?: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  dayName: string; // "Sunday", "Monday", etc.
  isWorking: boolean;
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  breaks: Break[];
}

interface ScheduleState {
  schedules: Schedule[];
  loading: boolean;
  fetchSchedule: () => Promise<void>;
  saveSchedule: () => Promise<void>;
  updateWorkingHours: (
    dayOfWeek: number,
    startTime: string,
    endTime: string
  ) => void;
  toggleDay: (dayOfWeek: number) => void;
  addBreak: (dayOfWeek: number, breakData: any) => void;
  removeBreak: (dayOfWeek: number, breakId: string) => void;
  updateBreak: (dayOfWeek: number, breakId: string, updates: any) => void;
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
  schedules: [],
  loading: false,

  fetchSchedule: async () => {
    set({ loading: true });
    try {
      const response: any = await api.get("/vendor/schedule");
      // Map dayOfWeek to include dayName
      const schedules =
        response.length > 0
          ? response.map((s: any) => ({
              ...s,
              dayName: dayNames[s.dayOfWeek],
            }))
          : initialSchedules;
      set({ schedules, loading: false });
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
      set({ loading: false, schedules: initialSchedules });
    }
  },

  saveSchedule: async () => {
    set({ loading: true });
    try {
      const { schedules } = get();
      const response: any = await api.post("/vendor/schedule", { schedules });
      const updatedSchedules = response.map((s: any) => ({
        ...s,
        dayName: dayNames[s.dayOfWeek],
      }));
      set({ schedules: updatedSchedules, loading: false });
    } catch (error) {
      console.error("Failed to save schedule:", error);
      set({ loading: false });
      throw error;
    }
  },

  updateWorkingHours: (dayOfWeek, startTime, endTime) => {
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, startTime, endTime } : s
      ),
    }));
  },

  toggleDay: (dayOfWeek) => {
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, isWorking: !s.isWorking } : s
      ),
    }));
  },

  addBreak: (dayOfWeek, breakData) => {
    const newBreak = {
      ...breakData,
      _id: Math.random().toString(36).substr(2, 9), // Temporary ID until saved
    };
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.dayOfWeek === dayOfWeek
          ? { ...s, breaks: [...s.breaks, newBreak] }
          : s
      ),
    }));
  },

  removeBreak: (dayOfWeek, breakId) => {
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.dayOfWeek === dayOfWeek
          ? { ...s, breaks: s.breaks.filter((b) => b._id !== breakId) }
          : s
      ),
    }));
  },

  updateBreak: (dayOfWeek, breakId, updates) => {
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.dayOfWeek === dayOfWeek
          ? {
              ...s,
              breaks: s.breaks.map((b) =>
                b._id === breakId ? { ...b, ...updates } : b
              ),
            }
          : s
      ),
    }));
  },

  getSchedule: (dayOfWeek) => {
    return get().schedules.find((schedule) => schedule.dayOfWeek === dayOfWeek);
  },
}));
