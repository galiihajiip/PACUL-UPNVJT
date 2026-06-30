import { api } from "./api";
import type { Hotspot } from "@/components/features/local-impact-map/MapContainer";

export interface DistrictDetail {
  id: string;
  name: string;
  totalActions: number;
  totalEmissionReduced: number;
  rank: number;
  topCategory: string;
  members: number;
  weeklyTrend: { day: string; value: number }[];
}

const MOCK_HOTSPOTS: Hotspot[] = [
  { id: "1", lat: -7.2575, lng: 112.7521, district: "Wonokromo", category: "Energi", intensity: "high", value: 42.8, actions: 1284, members: 850 },
  { id: "2", lat: -7.2499, lng: 112.7688, district: "Gubeng", category: "Limbah", intensity: "medium", value: 28.3, actions: 920, members: 620 },
  { id: "3", lat: -7.2316, lng: 112.7376, district: "Genteng", category: "Transportasi", intensity: "low", value: 15.6, actions: 540, members: 310 },
  { id: "4", lat: -7.2754, lng: 112.7183, district: "Wiyung", category: "Energi", intensity: "medium", value: 31.2, actions: 780, members: 480 },
  { id: "5", lat: -7.2130, lng: 112.7388, district: "Tegalsari", category: "Limbah", intensity: "high", value: 38.9, actions: 1100, members: 720 },
];

const MOCK_DISTRICT_DETAIL: DistrictDetail = {
  id: "wonokromo",
  name: "Wonokromo",
  totalActions: 1284,
  totalEmissionReduced: 42.8,
  rank: 1,
  topCategory: "Energi",
  members: 850,
  weeklyTrend: [
    { day: "SEN", value: 38 }, { day: "SEL", value: 44 }, { day: "RAB", value: 41 },
    { day: "KAM", value: 50 }, { day: "JUM", value: 36 }, { day: "SAB", value: 28 }, { day: "MIN", value: 33 },
  ],
};

export const mapService = {
  getMapData: async (category?: string, month?: string): Promise<Hotspot[]> => {
    try {
      return await api.get<Hotspot[]>("/map/data", { params: { category, month } });
    } catch {
      return category
        ? MOCK_HOTSPOTS.filter((h) => h.category === category)
        : MOCK_HOTSPOTS;
    }
  },

  getDistrictDetail: async (districtId: string): Promise<DistrictDetail> => {
    try {
      return await api.get<DistrictDetail>(`/map/district/${districtId}`);
    } catch {
      return { ...MOCK_DISTRICT_DETAIL, id: districtId };
    }
  },
};
