"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Zap, Users, Activity } from "lucide-react";
import type { Hotspot } from "./MapContainer";

const CATEGORY_COLOR: Record<string, string> = {
  Energi: "#F59E0B",
  Limbah: "#10B981",
  Transportasi: "#2D5F3F",
};

const INTENSITY_LABEL: Record<string, string> = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

const INTENSITY_COLOR: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <MapPin size={36} className="mb-3 text-gray-300" />
      <p className="text-sm font-medium text-gray-500">Pilih marker di peta</p>
      <p className="mt-1 text-xs text-gray-400">untuk melihat detail kecamatan</p>
    </div>
  );
}

export default function DistrictPanel({ district }: { district: Hotspot | null }) {
  return (
    <div className="flex h-full flex-col rounded-[12px] border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] bg-[#2D5F3F] px-5 py-4">
        <h3 className="text-sm font-semibold text-white">Info Kecamatan</h3>
        <p className="mt-0.5 text-xs text-white/60">Klik marker untuk detail</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          {!district ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState />
            </motion.div>
          ) : (
            <motion.div
              key={district.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              {/* District name */}
              <div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} style={{ color: "#2D5F3F" }} />
                  <h4 className="text-base font-bold text-[#1A1A1A]">{district.district}</h4>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: `${CATEGORY_COLOR[district.category]}15`,
                      color: CATEGORY_COLOR[district.category],
                    }}
                  >
                    {district.category}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: `${INTENSITY_COLOR[district.intensity]}15`,
                      color: INTENSITY_COLOR[district.intensity],
                    }}
                  >
                    Intensitas: {INTENSITY_LABEL[district.intensity]}
                  </span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Activity, label: "CO₂ Saved", value: `${district.value} ton`, color: "#10B981" },
                  { icon: Zap, label: "Total Aksi", value: district.actions.toLocaleString("id-ID"), color: "#F59E0B" },
                  { icon: Users, label: "Anggota Aktif", value: district.members.toLocaleString("id-ID"), color: "#2D5F3F" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-3"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${color}12` }}
                    >
                      <Icon size={16} style={{ color }} />
                    </span>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-bold text-[#1A1A1A]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CO2 intensity bar */}
              <div>
                <div className="mb-1 flex justify-between text-xs text-gray-500">
                  <span>Tingkat Emisi</span>
                  <span className="font-medium" style={{ color: INTENSITY_COLOR[district.intensity] }}>
                    {INTENSITY_LABEL[district.intensity]}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: district.intensity === "high" ? "85%" : district.intensity === "medium" ? "55%" : "25%",
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: INTENSITY_COLOR[district.intensity] }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
