"use client";

import { motion } from "framer-motion";

interface LeaderEntry {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  badge: string | null;
}

const leaderboard: LeaderEntry[] = [
  { rank: 1, name: "Siti Aminah", xp: 15420, avatar: "SA", badge: "🥇" },
  { rank: 2, name: "Rian Hidayat", xp: 13800, avatar: "RH", badge: "🥈" },
  { rank: 3, name: "Dewi Lestari", xp: 12402, avatar: "DL", badge: "🥉" },
  { rank: 4, name: "Aditya Pratama", xp: 11200, avatar: "AP", badge: null },
  { rank: 5, name: "Budi Santoso", xp: 9800, avatar: "BS", badge: null },
];

const TOP3_BG: Record<number, string> = {
  1: "rgba(255,215,0,0.06)",
  2: "rgba(192,192,192,0.06)",
  3: "rgba(205,127,50,0.06)",
};

const TOP3_RANK_COLOR: Record<number, string> = {
  1: "#F59E0B",
  2: "#9CA3AF",
  3: "#B45309",
};

export default function Leaderboard() {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      {/* Header */}
      <h3 className="mb-4 text-sm font-semibold text-[#1A1A1A]">
        🏆 Top 5 Surabaya
      </h3>

      <ul className="flex flex-col gap-1">
        {leaderboard.map((entry, i) => (
          <motion.li
            key={entry.rank}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.07, ease: "easeOut" }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
            style={{ backgroundColor: TOP3_BG[entry.rank] ?? "transparent" }}
          >
            {/* Rank */}
            <span
              className="w-5 shrink-0 text-center text-sm font-bold"
              style={{ color: TOP3_RANK_COLOR[entry.rank] ?? "#9CA3AF" }}
            >
              {entry.rank}
            </span>

            {/* Avatar */}
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{ backgroundColor: "#A8D5BA", color: "#2D5F3F" }}
            >
              {entry.avatar}
            </span>

            {/* Name + badge */}
            <div className="flex min-w-0 flex-1 items-center gap-1.5 truncate">
              <span className="truncate text-sm text-[#1A1A1A]">{entry.name}</span>
              {entry.badge && (
                <span className="shrink-0 text-sm">{entry.badge}</span>
              )}
            </div>

            {/* XP pill */}
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: "rgba(122,199,79,0.12)", color: "#7AC74F" }}
            >
              {entry.xp.toLocaleString("id-ID")} XP
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
