// TODO: Map types — BLOK map

export type MapActionCategory = "penghijauan" | "daur-ulang" | "energi" | "air" | "lainnya";

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  category: MapActionCategory;
  title: string;
  description: string;
  userId: string;
  userName: string;
  impactScore: number;
  createdAt: string;
}

export interface DistrictStats {
  districtId: string;
  name: string;
  totalActions: number;
  totalEmissionReduced: number;
  rank: number;
}
