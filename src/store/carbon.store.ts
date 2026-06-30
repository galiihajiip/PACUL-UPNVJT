import { create } from "zustand";
import type { Emission, EmisiData } from "@/types/carbon";
import { useUserStore } from "@/store/userStore";

interface CarbonStore {
  emissions: Emission[];
  totalCarbonSaved: number;
  weeklyTrend: EmisiData[];
  monthlyTrend: EmisiData[];
  selectedView: "weekly" | "monthly";
  isLoading: boolean;
  fetchEmissions: () => Promise<void>;
  addEmission: (data: Omit<Emission, "id" | "date">) => Promise<void>;
  setView: (view: "weekly" | "monthly") => void;
}

const MOCK_WEEKLY: EmisiData[] = [
  { day: "SEN", value: 42 },
  { day: "SEL", value: 38 },
  { day: "RAB", value: 55 },
  { day: "KAM", value: 29 },
  { day: "JUM", value: 63 },
  { day: "SAB", value: 31 },
  { day: "MIN", value: 45 },
];

const MOCK_MONTHLY: EmisiData[] = [
  { month: "Jan", value: 310 },
  { month: "Feb", value: 280 },
  { month: "Mar", value: 340 },
  { month: "Apr", value: 295 },
  { month: "Mei", value: 320 },
  { month: "Jun", value: 260 },
];

const MOCK_EMISSIONS: Emission[] = [
  { id: "e1", category: "Transportasi", activity: "Naik motor ke kantor", value: 12.4, unit: "kg", date: new Date(), impact: 12.4, points: 50 },
  { id: "e2", category: "Energi", activity: "Penggunaan AC 8 jam", value: 4.8, unit: "kg", date: new Date(), impact: 4.8, points: 20 },
  { id: "e3", category: "Pangan", activity: "Konsumsi daging sapi", value: 6.2, unit: "kg", date: new Date(), impact: 6.2, points: 30 },
];

let emissionCounter = MOCK_EMISSIONS.length;

export const useCarbonStore = create<CarbonStore>((set, get) => ({
  emissions: [],
  totalCarbonSaved: 124,
  weeklyTrend: MOCK_WEEKLY,
  monthlyTrend: MOCK_MONTHLY,
  selectedView: "weekly",
  isLoading: false,

  fetchEmissions: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ emissions: MOCK_EMISSIONS, isLoading: false });
  },

  addEmission: async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    const newEmission: Emission = {
      ...data,
      id: `e${++emissionCounter}`,
      date: new Date(),
    };
    set((state) => ({
      emissions: [newEmission, ...state.emissions],
      totalCarbonSaved: state.totalCarbonSaved + newEmission.impact,
    }));
    useUserStore.getState().awardXP(25, "add_emission", "Aktivitas dicatat");
    useUserStore.getState().addCarbonSaved(newEmission.impact);
  },

  setView: (view) => set({ selectedView: view }),
}));
