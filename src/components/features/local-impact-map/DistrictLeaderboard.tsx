"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DistrictRank {
  rank: number;
  name: string;
  co2: number;
  actions: number;
  trend: "up" | "down";
}

const districtRanking: DistrictRank[] = [
  { rank: 1, name: "Wonokromo", co2: 42.8, actions: 1284, trend: "up" },
  { rank: 2, name: "Gubeng", co2: 28.3, actions: 920, trend: "up" },
  { rank: 3, name: "Tegalsari", co2: 38.9, actions: 1100, trend: "down" },
];

const RANK_STYLE: Record<number, { bg: string; color: string }> = {
  1: { bg: "rgba(45,95,63,0.12)", color: "#2D5F3F" },
  2: { bg: "rgba(168,213,186,0.25)", color: "#2D8B56" },
  3: { bg: "rgba(122,199,79,0.12)", color: "#5B9E2A" },
};

export default function DistrictLeaderboard() {
  return (
    <div
      className="rounded-[12px] border border-[#E5E7EB] shadow-sm"
      style={{ backgroundColor: "rgba(168,213,186,0.08)" }}
    >
      {/* Header */}
      <div className="border-b border-[#E5E7EB] px-5 py-3.5">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">🏆 Top Distrik Aktif</h3>
      </div>

      <ul className="flex flex-col gap-1 p-3">
        {districtRanking.map((entry, i) => {
          const rankStyle = RANK_STYLE[entry.rank];
          return (
            <motion.li
              key={entry.rank}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.07 }}
              className="flex cursor-default items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[rgba(168,213,186,0.15)]"
            >
              {/* Rank badge */}
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ backgroundColor: rankStyle.bg, color: rankStyle.color }}
              >
                #{entry.rank}
              </span>

              {/* Name + meta */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#1A1A1A]">{entry.name}</p>
                <p className="text-[10px] text-gray-400">
                  {entry.co2} ton · {entry.actions.toLocaleString("id-ID")} aksi
                </p>
              </div>

              {/* Trend icon */}
              {entry.trend === "up" ? (
                <TrendingUp size={15} className="shrink-0 text-[#10B981]" />
              ) : (
                <TrendingDown size={15} className="shrink-0 text-[#EF4444]" />
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
