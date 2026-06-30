"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";

const XP_CURRENT = 2340;
const XP_NEXT_LEVEL = 3000;
const LEVEL = 7;
const xpPct = Math.round((XP_CURRENT / XP_NEXT_LEVEL) * 100);

export default function WelcomeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-[14px] p-6 text-white"
      style={{
        background: "linear-gradient(135deg, #2D5F3F 0%, #1a3d27 60%, #0f2a1a 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        {/* Left: greeting */}
        <div>
          <p className="text-sm font-medium text-white/70">Selamat datang kembali 👋</p>
          <h1 className="mt-0.5 text-2xl font-bold">Aditya Dwi</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/70">
            <TrendingUp size={14} />
            Kamu telah menyelamatkan <span className="font-semibold text-[#7AC74F]">12.4 ton CO₂</span> bulan ini
          </p>
        </div>

        {/* Right: XP level card */}
        <div className="min-w-[200px] rounded-[10px] bg-white/10 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-yellow-300" fill="#FDE047" />
              <span className="text-xs font-semibold text-white/80">Level {LEVEL}</span>
            </div>
            <span className="text-xs text-white/60">{XP_CURRENT.toLocaleString("id-ID")} / {XP_NEXT_LEVEL.toLocaleString("id-ID")} XP</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full bg-[#7AC74F]"
            />
          </div>
          <p className="mt-1.5 text-[10px] text-white/50">{XP_NEXT_LEVEL - XP_CURRENT} XP lagi ke level {LEVEL + 1}</p>
        </div>
      </div>
    </motion.div>
  );
}
