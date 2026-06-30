import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HourlyStep {
  hour: number;
  steps: number;
}

export interface DailySummary {
  date: string;
  steps: number;
}

interface StepTrackerStore {
  isTracking: boolean;
  todaySteps: number;
  hourlyData: HourlyStep[];
  weeklyData: DailySummary[];
  setIsTracking: (v: boolean) => void;
  addSteps: (steps: number) => void;
  resetToday: () => void;
}

const INITIAL_HOURLY: HourlyStep[] = Array.from({ length: 24 }, (_, h) => ({
  hour: h,
  steps: 0,
}));

const MOCK_WEEKLY: DailySummary[] = [
  { date: "Senin", steps: 8200 },
  { date: "Selasa", steps: 11350 },
  { date: "Rabu", steps: 6800 },
  { date: "Kamis", steps: 9500 },
  { date: "Jumat", steps: 12100 },
  { date: "Sabtu", steps: 5300 },
  { date: "Minggu", steps: 0 },
];

export const useStepTrackerStore = create<StepTrackerStore>()(
  persist(
    (set) => ({
      isTracking: false,
      todaySteps: 0,
      hourlyData: INITIAL_HOURLY,
      weeklyData: MOCK_WEEKLY,

      setIsTracking: (v) => set({ isTracking: v }),

      addSteps: (steps) =>
        set((state) => {
          const hour = new Date().getHours();
          const updated = state.hourlyData.map((h) =>
            h.hour === hour ? { ...h, steps: h.steps + steps } : h
          );
          return {
            todaySteps: state.todaySteps + steps,
            hourlyData: updated,
          };
        }),

      resetToday: () =>
        set({ todaySteps: 0, hourlyData: INITIAL_HOURLY }),
    }),
    {
      name: "pacul-step-tracker",
      partialize: (s) => ({
        todaySteps: s.todaySteps,
        hourlyData: s.hourlyData,
        weeklyData: s.weeklyData,
      }),
    }
  )
);
