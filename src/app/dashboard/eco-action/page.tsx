import type { Metadata } from "next";
import PageWrapper from "@/components/common/PageWrapper";
import BuktikanAksimu from "@/components/features/eco-action/BuktikanAksimu";
import TantanganAktif from "@/components/features/eco-action/TantanganAktif";
import Leaderboard from "@/components/features/eco-action/Leaderboard";
import Pencapaian from "@/components/features/eco-action/Pencapaian";
import { MarketplaceCTA } from "@/components/features/eco-action/MarketplaceCTA";

export const metadata: Metadata = {
  title: "EcoAction — PACUL",
  description: "Upload bukti aksi hijau, kumpulkan XP, dan redeem reward di Green Marketplace.",
};

export default function EcoActionPage() {
  return (
    <PageWrapper>
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-[#1A1A1A] sm:text-2xl">EcoAction</h1>
        <p className="mt-1 text-sm text-gray-500">Gamifikasi aksi hijau komunitasmu</p>
      </div>

      {/* Upload bukti — full width */}
      <BuktikanAksimu />

      {/* Tantangan Aktif — full width */}
      <TantanganAktif />

      {/* Leaderboard */}
      <Leaderboard />

      {/* Pencapaian badges */}
      <Pencapaian />

      {/* Marketplace CTA — redirects to /dashboard/marketplace */}
      <MarketplaceCTA />
    </div>
    </PageWrapper>
  );
}
