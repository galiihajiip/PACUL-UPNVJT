import { api } from "./api";
import type { Emission, EmisiData } from "@/types/carbon";

export interface NewEmissionDTO {
  category: Emission["category"];
  activity: string;
  value: number;
  unit: string;
  impact: number;
  points: number;
}

export interface BreakdownData {
  category: string;
  value: number;
  percentage: number;
}

const MOCK_EMISSIONS: Emission[] = [
  { id: "e1", category: "Transportasi", activity: "Naik motor ke kantor", value: 12.4, unit: "kg", date: new Date(), impact: 12.4, points: 50 },
  { id: "e2", category: "Energi", activity: "Penggunaan AC 8 jam", value: 4.8, unit: "kg", date: new Date(), impact: 4.8, points: 20 },
  { id: "e3", category: "Pangan", activity: "Konsumsi daging sapi", value: 6.2, unit: "kg", date: new Date(), impact: 6.2, points: 30 },
];

const MOCK_WEEKLY: EmisiData[] = [
  { day: "SEN", value: 42 }, { day: "SEL", value: 38 }, { day: "RAB", value: 55 },
  { day: "KAM", value: 29 }, { day: "JUM", value: 63 }, { day: "SAB", value: 31 }, { day: "MIN", value: 45 },
];

const MOCK_MONTHLY: EmisiData[] = [
  { month: "Jan", value: 310 }, { month: "Feb", value: 280 }, { month: "Mar", value: 340 },
  { month: "Apr", value: 295 }, { month: "Mei", value: 320 }, { month: "Jun", value: 260 },
];

const MOCK_BREAKDOWN: BreakdownData[] = [
  { category: "Transportasi", value: 42.8, percentage: 38 },
  { category: "Energi", value: 31.2, percentage: 28 },
  { category: "Pangan", value: 22.4, percentage: 20 },
  { category: "Limbah", value: 15.6, percentage: 14 },
];

export const carbonService = {
  getEmissions: async (): Promise<Emission[]> => {
    try {
      return await api.get<Emission[]>("/carbon/emissions");
    } catch {
      return MOCK_EMISSIONS;
    }
  },

  addEmission: async (data: NewEmissionDTO): Promise<Emission> => {
    try {
      return await api.post<Emission>("/carbon/add", data);
    } catch {
      return { ...data, id: `e_${Date.now()}`, date: new Date() };
    }
  },

  getWeeklyTrend: async (): Promise<EmisiData[]> => {
    try {
      return await api.get<EmisiData[]>("/carbon/trend/weekly");
    } catch {
      return MOCK_WEEKLY;
    }
  },

  getMonthlyTrend: async (): Promise<EmisiData[]> => {
    try {
      return await api.get<EmisiData[]>("/carbon/trend/monthly");
    } catch {
      return MOCK_MONTHLY;
    }
  },

  getBreakdown: async (): Promise<BreakdownData[]> => {
    try {
      return await api.get<BreakdownData[]>("/carbon/breakdown");
    } catch {
      return MOCK_BREAKDOWN;
    }
  },
};
