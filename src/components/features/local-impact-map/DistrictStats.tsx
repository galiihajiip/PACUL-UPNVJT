"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle, Leaf, Users } from "lucide-react";

export interface DistrictData {
  id: string;
  district: string;
  category: string;
  value: number;
  actions: number;
  members: number;
}

const CATEGORY_COLOR: Record<string, string> = {
  Energi: "#F59E0B",
  Limbah: "#10B981",
  Transportasi: "#2D5F3F",
  Pangan: "#7AC74F",
};

const STATS = (d: DistrictData) => [
  {
    icon: CheckCircle,
    label: "Total Aksi",
    value: d.actions.toLocaleString("id-ID"),
    color: "#10B981",
  },
  {
    icon: Leaf,
    label: "CO₂ Terselamatkan",
    value: `${d.value} Ton`,
    color: "#2D5F3F",
  },
  {
    icon: Users,
    label: "Anggota Aktif",
    value: `${d.members.toLocaleString("id-ID")}+`,
    color: "#7AC74F",
  },
];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <MapPin size={32} className="mb-2 text-gray-300" />
      <p className="text-sm font-medium text-gray-500">Klik marker di peta</p>
      <p className="mt-0.5 text-xs text-gray-400">untuk lihat detail district</p>
    </div>
  );
}

export default function DistrictStats({ district }: { district: DistrictData | null }) {
  const catColor = district ? (CATEGORY_COLOR[district.category] ?? "#2D5F3F") : "#2D5F3F";

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-sm">
      {/* Green header */}
      <div className="bg-[#2D5F3F] px-5 py-3.5">
        <h3 className="text-sm font-semibold text-white">Info Kecamatan</h3>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {!district ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState />
            </motion.div>
          ) : (
            <motion.div
              key={district.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              {/* Title + badge */}
              <div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} style={{ color: "#2D5F3F" }} />
                  <h4 className="text-lg font-semibold text-[#1A1A1A]">
                    {district.district}
                  </h4>
                </div>
                <span
                  className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${catColor}15`,
                    color: catColor,
                  }}
                >
                  {district.category}
                </span>
              </div>

              {/* Stats list with dividers */}
              <div className="flex flex-col divide-y divide-[#F3F4F6]">
                {STATS(district).map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon size={14} style={{ color }} />
                      {label}
                    </div>
                    <span className="text-sm font-bold text-[#1A1A1A]">{value}</span>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <button
                className="w-full rounded-md py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#2D5F3F" }}
              >
                Gabung Komunitas
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
