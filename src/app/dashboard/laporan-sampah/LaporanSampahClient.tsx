"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/common/PageWrapper";
import WasteReportMap from "@/components/features/waste-report/WasteReportMap";
import CreateWasteReport from "@/components/features/waste-report/CreateWasteReport";
import ReportDetailModal from "@/components/features/waste-report/ReportDetailModal";
import { cn } from "@/utils/cn";
import type { WasteReport } from "@/store/wasteReport.store";

type ActiveTab = "map" | "create";

export default function LaporanSampahClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("map");
  const [detailReport, setDetailReport] = useState<WasteReport | null>(null);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <h1 className="text-xl font-extrabold text-[#1A1A1A] sm:text-2xl">🗑️ Laporan Sampah</h1>
          <p className="mt-0.5 text-sm text-gray-500">Laporkan masalah sampah di lingkunganmu — warga bisa bantu warga</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-1">
          {([
            { id: "map",    label: "🗺️ Peta Laporan" },
            { id: "create", label: "📋 Buat Laporan" },
          ] as { id: ActiveTab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-xs font-semibold transition-colors",
                activeTab === t.id ? "bg-white text-[#2D5F3F] shadow-sm" : "text-gray-500 hover:text-[#2D5F3F]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "map" && (
          <WasteReportMap onDetail={(r) => setDetailReport(r)} />
        )}

        {activeTab === "create" && (
          <CreateWasteReport onSuccess={() => setActiveTab("map")} />
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {detailReport && (
          <ReportDetailModal report={detailReport} onClose={() => setDetailReport(null)} />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
