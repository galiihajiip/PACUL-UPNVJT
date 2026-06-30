"use client";

import { useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import dynamic from "next/dynamic";
import MapFilters from "@/components/features/local-impact-map/MapFilters";
import DistrictStats from "@/components/features/local-impact-map/DistrictStats";
import DistrictLeaderboard from "@/components/features/local-impact-map/DistrictLeaderboard";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import type { Hotspot } from "@/components/features/local-impact-map/MapContainer";

const MapContainer = dynamic(
  () => import("@/components/features/local-impact-map/MapContainer"),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[300px] items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-[#F5F5F5] lg:h-[calc(100vh-200px)]"
        role="status"
        aria-label="Memuat peta..."
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#A8D5BA] border-t-[#2D5F3F]" aria-hidden="true" />
          <p className="text-sm text-gray-400">Memuat peta...</p>
        </div>
      </div>
    ),
  }
);

export default function MapPageClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeMonth, setActiveMonth] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<Hotspot | null>(null);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-3 lg:gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A] sm:text-2xl">Local Impact Map</h1>
          <p className="mt-1 text-sm text-gray-500">Visualisasi dampak aksi komunitas per wilayah</p>
        </div>

        <MapFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeMonth={activeMonth}
          onMonthChange={setActiveMonth}
        />

        <div className="grid gap-4 lg:grid-cols-[70fr_30fr]">
          <div className="sticky top-4">
            <ErrorBoundary>
              <div
                role="application"
                aria-label="Peta dampak lokal Surabaya"
              >
                <MapContainer
                  activeCategory={activeCategory}
                  onSelectDistrict={setSelectedDistrict}
                />
              </div>
            </ErrorBoundary>
          </div>

          <div className="flex flex-col gap-4">
            <DistrictStats district={selectedDistrict} />
            <DistrictLeaderboard />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
