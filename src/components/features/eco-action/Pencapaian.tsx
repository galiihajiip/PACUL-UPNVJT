"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: boolean;
  earnedDate: string | null;
  isNew?: boolean;
}

const badges: Badge[] = [
  { id: "1", name: "SEEDLING", emoji: "🌱", description: "Pertama kali catat aktivitas", earned: true, earnedDate: "1 Okt 2026" },
  { id: "2", name: "WATT SAVER", emoji: "⚡", description: "Hemat listrik 20% dalam sebulan", earned: true, earnedDate: "15 Okt 2026" },
  { id: "3", name: "TREE KING", emoji: "🌳", description: "Tanam 5 pohon", earned: true, earnedDate: "20 Okt 2026" },
  { id: "4", name: "AQUA GUARD", emoji: "💧", description: "Hemat air 30% dalam seminggu", earned: false, earnedDate: null },
  { id: "5", name: "SPEAKER", emoji: "📢", description: "Post 10 ide di Collaboration Wall", earned: false, earnedDate: null },
  { id: "6", name: "LEADER", emoji: "👑", description: "Masuk Top 3 Leaderboard", earned: false, earnedDate: null },
  { id: "7", name: "ZERO HERO", emoji: "♻️", description: "Selesaikan Zero Waste 7 Hari", earned: false, earnedDate: null },
];

/* ── Tooltip ── */
function Tooltip({ badge, visible }: { badge: Badge; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 w-44 -translate-x-1/2 rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-lg"
        >
          <p className="text-xs font-bold text-[#1A1A1A]">{badge.name}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">{badge.description}</p>
          <p className="mt-1.5 text-[10px] font-medium" style={{ color: badge.earned ? "#10B981" : "#9CA3AF" }}>
            {badge.earned ? `Diraih: ${badge.earnedDate}` : "Belum terbuka"}
          </p>
          {/* Arrow */}
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-px border-4 border-transparent border-t-[#E5E7EB]" />
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[3px] border-4 border-transparent border-t-white" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Single Badge ── */
function BadgeItem({ badge }: { badge: Badge }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center gap-2">
      <Tooltip badge={badge} visible={hovered} />

      <motion.div
        initial={badge.isNew ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={badge.isNew ? { scale: [0, 1.2, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={badge.isNew ? { duration: 0.6, times: [0, 0.6, 1] } : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
        style={
          badge.earned
            ? {
                background: "radial-gradient(circle, rgba(122,199,79,0.3) 0%, rgba(168,213,186,0.5) 100%)",
                border: "2px solid #7AC74F",
                boxShadow: badge.isNew ? "0 0 20px rgba(122,199,79,0.5)" : undefined,
              }
            : {
                backgroundColor: "#F3F4F6",
                border: "2px solid #E5E7EB",
              }
        }
      >
        {/* Emoji */}
        <span
          style={{
            fontSize: "28px",
            lineHeight: 1,
            filter: badge.earned ? "none" : "grayscale(100%) opacity(40%)",
          }}
        >
          {badge.emoji}
        </span>

        {/* Lock icon for locked badges */}
        {!badge.earned && (
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300">
            <Lock size={10} className="text-gray-500" />
          </span>
        )}
      </motion.div>

      {/* Label */}
      <p
        className="max-w-[80px] text-center text-[10px] font-bold leading-tight"
        style={{ color: badge.earned ? "#2D5F3F" : "#9CA3AF" }}
      >
        {badge.name}
      </p>
    </div>
  );
}

/* ── Main ── */
export default function Pencapaian() {
  const earned = badges.filter((b) => b.earned).length;

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#1A1A1A]">Pencapaianmu</h3>
          <p className="mt-0.5 text-xs text-gray-400">
            {earned}/{badges.length} badge diraih
          </p>
        </div>
        <Link
          href="/dashboard/marketplace"
          className="text-sm font-medium text-[#2D5F3F] hover:underline transition-colors"
        >
          Lihat Semua →
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(earned / badges.length) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-[#7AC74F]"
        />
      </div>

      {/* Badge grid */}
      <div className="flex flex-wrap justify-start gap-6">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
          >
            <BadgeItem badge={badge} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
