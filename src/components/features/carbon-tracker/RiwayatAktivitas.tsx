"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Train, Zap, Trash2, Leaf, Bike } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { EmissionCategory } from "@/types/carbon";

/* ── Types ── */
interface RiwayatItem {
  id: string;
  icon: LucideIcon;
  activity: string;
  category: EmissionCategory;
  date: string;
  impactLabel: string;
  points: number;
}

/* ── Category config ── */
const CATEGORY_COLOR: Record<EmissionCategory, string> = {
  Transportasi: "#2D5F3F",
  Energi: "#F59E0B",
  Limbah: "#10B981",
  Pangan: "#7AC74F",
};

/* ── Mock data ── */
const mockRiwayat: RiwayatItem[] = [
  {
    id: "1",
    icon: Train,
    activity: "Naik KRL Commuter Line",
    category: "Transportasi",
    date: "26 Okt 2026",
    impactLabel: "-2.4 kg CO₂",
    points: 50,
  },
  {
    id: "2",
    icon: Zap,
    activity: "Bayar Tagihan Listrik Rendah",
    category: "Energi",
    date: "25 Okt 2026",
    impactLabel: "-8.1 kg CO₂",
    points: 120,
  },
  {
    id: "3",
    icon: Trash2,
    activity: "Daur Ulang Sampah Plastik",
    category: "Limbah",
    date: "24 Okt 2026",
    impactLabel: "-1.8 kg CO₂",
    points: 35,
  },
  {
    id: "4",
    icon: Leaf,
    activity: "Konsumsi Sayur Organik Lokal",
    category: "Pangan",
    date: "23 Okt 2026",
    impactLabel: "-0.9 kg CO₂",
    points: 20,
  },
  {
    id: "5",
    icon: Bike,
    activity: "Bersepeda ke Kampus",
    category: "Transportasi",
    date: "22 Okt 2026",
    impactLabel: "-3.2 kg CO₂",
    points: 65,
  },
];

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.05, ease: "easeOut" },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

interface RiwayatAktivitasProps {
  items?: RiwayatItem[];
}

export default function RiwayatAktivitas({
  items = mockRiwayat,
}: RiwayatAktivitasProps) {
  const [expanded, setExpanded] = useState(false);
  const INITIAL_COUNT = 5;
  const visibleItems = expanded ? items : items.slice(0, INITIAL_COUNT);
  const canExpand = items.length > INITIAL_COUNT;

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      {/* Card header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#1A1A1A]">
          Riwayat Aktivitas
        </h3>
        {canExpand && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-sm font-medium text-[#2D5F3F] hover:underline transition-colors"
          >
            {expanded ? "Sembunyikan ↑" : "Lihat Semua ›"}
          </button>
        )}
      </div>

      {/* Table wrapper */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              {["Aktivitas", "Tanggal", "Dampak", "Points"].map((h) => (
                <th
                  key={h}
                  className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {visibleItems.map((item, i) => (
                <motion.tr
                  key={item.id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="group border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors"
                >
                  {/* Aktivitas */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      {/* Icon circle */}
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${CATEGORY_COLOR[item.category]}18`,
                        }}
                      >
                        <item.icon
                          size={15}
                          style={{ color: CATEGORY_COLOR[item.category] }}
                        />
                      </span>

                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-[#1A1A1A] leading-tight">
                          {item.activity}
                        </span>
                        {/* Category badge */}
                        <span
                          className="w-fit rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: `${CATEGORY_COLOR[item.category]}15`,
                            color: CATEGORY_COLOR[item.category],
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Tanggal */}
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">
                    {item.date}
                  </td>

                  {/* Dampak */}
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="font-medium text-[#10B981]">
                      {item.impactLabel}
                    </span>
                  </td>

                  {/* Points */}
                  <td className="py-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(122,199,79,0.12)",
                        color: "#7AC74F",
                      }}
                    >
                      +{item.points} XP
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
