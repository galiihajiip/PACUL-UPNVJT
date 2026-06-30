import type { Metadata } from "next";
import PageWrapper from "@/components/common/PageWrapper";
import WelcomeSection from "@/components/features/dashboard-main/WelcomeSection";
import KpiCards from "@/components/features/dashboard-main/KpiCards";
import EmisiMingguanChart from "@/components/features/dashboard-main/EmisiMingguanChart";
import TantanganAktifPanel from "@/components/features/dashboard-main/TantanganAktifPanel";
import AktivitasKomunitas from "@/components/features/dashboard-main/AktivitasKomunitas";
import TipsHariIni from "@/components/features/dashboard-main/TipsHariIni";

export const metadata: Metadata = {
  title: "Dashboard — PACUL",
  description: "Pantau ringkasan aktivitas, emisi karbon, dan poin hijau komunitasmu.",
};

export default function DashboardPage() {
  return (
    <PageWrapper>
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Welcome greeting */}
      <WelcomeSection />

      {/* KPI cards — 4 columns */}
      <KpiCards />

      {/* Grid 1: Emisi chart (60%) | Tantangan + Tips (40%) */}
      <div className="grid gap-6 lg:grid-cols-[60fr_40fr]">
        <EmisiMingguanChart />
        <div className="flex flex-col gap-4">
          <TantanganAktifPanel />
          <TipsHariIni />
        </div>
      </div>

      {/* Grid 2: Community activity full width */}
      <AktivitasKomunitas />
    </div>
    </PageWrapper>
  );
}
