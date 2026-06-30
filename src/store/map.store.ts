import { create } from "zustand";
import type { Hotspot } from "@/components/features/local-impact-map/MapContainer";

interface MapStore {
  selectedCategory: string | null;
  selectedMonth: string;
  mapData: Hotspot[];
  selectedDistrict: Hotspot | null;
  isLoading: boolean;
  setCategory: (cat: string | null) => void;
  setMonth: (month: string) => void;
  setSelectedDistrict: (district: Hotspot | null) => void;
  fetchMapData: () => Promise<void>;
}

const MOCK_HOTSPOTS: Hotspot[] = [
  { id: "1", lat: -7.2575, lng: 112.7521, district: "Wonokromo", category: "Energi", intensity: "high", value: 42.8, actions: 1284, members: 850 },
  { id: "2", lat: -7.2499, lng: 112.7688, district: "Gubeng", category: "Limbah", intensity: "medium", value: 28.3, actions: 920, members: 620 },
  { id: "3", lat: -7.2316, lng: 112.7376, district: "Genteng", category: "Transportasi", intensity: "low", value: 15.6, actions: 540, members: 310 },
  { id: "4", lat: -7.2754, lng: 112.7183, district: "Wiyung", category: "Energi", intensity: "medium", value: 31.2, actions: 780, members: 480 },
  { id: "5", lat: -7.2130, lng: 112.7388, district: "Tegalsari", category: "Limbah", intensity: "high", value: 38.9, actions: 1100, members: 720 },
];

export const useMapStore = create<MapStore>((set) => ({
  selectedCategory: null,
  selectedMonth: "Nov 2026",
  mapData: [],
  selectedDistrict: null,
  isLoading: false,

  setCategory: (cat) => set({ selectedCategory: cat }),

  setMonth: (month) => set({ selectedMonth: month }),

  setSelectedDistrict: (district) => set({ selectedDistrict: district }),

  fetchMapData: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 500));
    set({ mapData: MOCK_HOTSPOTS, isLoading: false });
  },
}));
