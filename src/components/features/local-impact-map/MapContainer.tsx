"use client";

import { useEffect, useState } from "react";
import { MapContainer as LeafletMap, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapLegend from "./MapLegend";

/* ── Types ── */
export interface Hotspot {
  id: string;
  lat: number;
  lng: number;
  district: string;
  category: "Energi" | "Limbah" | "Transportasi" | "Pangan";
  intensity: "high" | "medium" | "low";
  value: number;
  actions: number;
  members: number;
}

interface MapContainerProps {
  activeCategory: string | null;
  onSelectDistrict: (h: Hotspot) => void;
}

/* ── Mock data ── */
const hotspots: Hotspot[] = [
  { id: "1", lat: -7.2575, lng: 112.7521, district: "Wonokromo", category: "Energi", intensity: "high", value: 42.8, actions: 1284, members: 850 },
  { id: "2", lat: -7.2499, lng: 112.7688, district: "Gubeng", category: "Limbah", intensity: "medium", value: 28.3, actions: 920, members: 620 },
  { id: "3", lat: -7.2316, lng: 112.7376, district: "Genteng", category: "Transportasi", intensity: "low", value: 15.6, actions: 540, members: 310 },
  { id: "4", lat: -7.2754, lng: 112.7183, district: "Wiyung", category: "Energi", intensity: "medium", value: 31.2, actions: 780, members: 480 },
  { id: "5", lat: -7.2130, lng: 112.7388, district: "Tegalsari", category: "Limbah", intensity: "high", value: 38.9, actions: 1100, members: 720 },
];

const CATEGORY_COLOR: Record<string, string> = {
  Energi: "#F59E0B",
  Limbah: "#10B981",
  Transportasi: "#2D5F3F",
};

const INTENSITY_RADIUS: Record<string, number> = {
  high: 18,
  medium: 12,
  low: 8,
};

const CATEGORY_BG: Record<string, string> = {
  Energi: "rgba(245,158,11,0.15)",
  Limbah: "rgba(16,185,129,0.15)",
  Transportasi: "rgba(45,95,63,0.15)",
};

export default function MapContainer({ activeCategory, onSelectDistrict }: MapContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const visible = hotspots.filter(
    (h) => activeCategory === null || h.category === activeCategory
  );

  return (
    <div
      className="relative rounded-[12px] border border-[#E5E7EB] shadow-sm h-[300px] lg:h-[calc(100vh-200px)]"
      style={{ overflow: "hidden" }}
    >
      <MapLegend />
      <LeafletMap
        center={[-7.2575, 112.7521]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {visible.map((h) => (
          <CircleMarker
            key={h.id}
            center={[h.lat, h.lng]}
            radius={INTENSITY_RADIUS[h.intensity]}
            pathOptions={{
              fillColor: CATEGORY_COLOR[h.category],
              fillOpacity: 0.7,
              color: "#ffffff",
              weight: 2,
            }}
            eventHandlers={{ click: () => onSelectDistrict(h) }}
          >
            <Popup>
              <div className="min-w-[160px] p-1 text-xs">
                <p className="mb-1.5 text-sm font-bold text-[#1A1A1A]">{h.district}</p>
                <span
                  className="mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: CATEGORY_BG[h.category],
                    color: CATEGORY_COLOR[h.category],
                  }}
                >
                  {h.category}
                </span>
                <div className="mt-1 flex flex-col gap-1 text-gray-600">
                  <p>🌿 CO₂ Saved: <strong>{h.value} ton</strong></p>
                  <p>⚡ Aksi: <strong>{h.actions.toLocaleString("id-ID")}</strong></p>
                  <p>👥 Members: <strong>{h.members.toLocaleString("id-ID")}</strong></p>
                </div>
                <button
                  onClick={() => onSelectDistrict(h)}
                  className="mt-2.5 w-full rounded-md py-1.5 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: "#2D5F3F" }}
                >
                  Lihat Detail
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </LeafletMap>
    </div>
  );
}
