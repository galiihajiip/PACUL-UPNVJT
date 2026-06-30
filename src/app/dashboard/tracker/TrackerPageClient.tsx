"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/common/PageWrapper";
import TrendEmisiChart from "@/components/features/carbon-tracker/TrendEmisiChart";
import CatatAktivitasBaru from "@/components/features/carbon-tracker/CatatAktivitasBaru";
import DataListrik from "@/components/features/carbon-tracker/DataListrik";
import RiwayatAktivitas from "@/components/features/carbon-tracker/RiwayatAktivitas";
import BreakdownKategori from "@/components/features/carbon-tracker/BreakdownKategori";
import RekomendasiAI from "@/components/features/carbon-tracker/RekomendasiAI";
import type { EmisiData } from "@/types/carbon";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { cn } from "@/utils/cn";

type TrackerTab = "aktivitas" | "listrik" | "riwayat";

const TABS: { id: TrackerTab; label: string }[] = [
  { id: "aktivitas", label: "📝 Catat Aktivitas" },
  { id: "listrik",   label: "⚡ Data Listrik" },
  { id: "riwayat",   label: "📋 Riwayat" },
];

export default function TrackerPageClient() {
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const [activeTab, setActiveTab] = useState<TrackerTab>("aktivitas");
  const emptyData: EmisiData[] = [];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-4 lg:gap-6">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A] sm:text-2xl">Carbon Tracker</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor jejak karbon komunitasmu</p>
        </div>

        {/* Top-level tab bar — full width */}
        <div className="flex overflow-x-auto rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-1 gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex-1 whitespace-nowrap rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-1",
                activeTab === t.id
                  ? "bg-white text-[#2D5F3F] shadow-sm"
                  : "text-gray-500 hover:text-[#2D5F3F]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Riwayat tab — full width, no chart */}
        <AnimatePresence mode="wait">
          {activeTab === "riwayat" && (
            <motion.div
              key="riwayat"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <RiwayatAktivitas />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Aktivitas + Listrik tabs — chart left, panel right */}
        {activeTab !== "riwayat" && (
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-[60fr_40fr]">
            {/* Left: chart + breakdown + AI */}
            <div className="flex flex-col gap-6">
              <ErrorBoundary>
                <TrendEmisiChart
                  data={emptyData}
                  view={chartView}
                  onViewChange={setChartView}
                />
              </ErrorBoundary>
              <BreakdownKategori />
              <RekomendasiAI />
            </div>

            {/* Right: tab panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "aktivitas" && (
                  <CatatAktivitasBaru
                    onGoToListrik={() => setActiveTab("listrik")}
                  />
                )}
                {activeTab === "listrik" && <DataListrik />}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
