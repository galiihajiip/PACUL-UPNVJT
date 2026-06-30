"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Leaf, Star, Target, Trophy, TrendingUp } from "lucide-react";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import { useUserStore } from "@/store/userStore";

/* ── Shared card shell ── */
const CardShell = forwardRef<
  HTMLDivElement,
  {
    delay: number;
    iconBg: string;
    iconColor: string;
    Icon: React.ElementType;
    children: React.ReactNode;
  }
>(function CardShell({ delay, iconBg, iconColor, Icon, children }, ref) {
  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className="flex gap-2 rounded-[12px] border border-[#E5E7EB] bg-white p-3 shadow-sm transition-shadow duration-200 sm:gap-4 sm:p-5"
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </motion.div>
  );
});

/* ── Card 1: Carbon Saved (animated counter) ── */
function CarbonSavedCard({ delay }: { delay: number }) {
  const carbonSaved = useUserStore((s) => s.carbonSaved);
  const { value, ref } = useCountAnimation(carbonSaved, 1500);
  return (
    <CardShell ref={ref} delay={delay} iconBg="rgba(168,213,186,0.30)" iconColor="#2D5F3F" Icon={Leaf}>
      <p className="text-xs text-gray-500">Total Carbon Saved</p>
      <p className="mt-0.5 text-2xl font-bold text-[#1A1A1A]">{value} kg</p>
      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#10B981]">
        <TrendingUp size={11} /> +12% dari minggu lalu
      </p>
    </CardShell>
  );
}

/* ── Card 2: EcoPoints (animated counter) ── */
function EcoPointsCard({ delay }: { delay: number }) {
  const xp = useUserStore((s) => s.xp);
  const xpToNextLevel = useUserStore((s) => s.xpToNextLevel);
  const { value, ref } = useCountAnimation(xp, 2000);
  return (
    <CardShell ref={ref} delay={delay} iconBg="rgba(245,158,11,0.18)" iconColor="#F59E0B" Icon={Star}>
      <p className="text-xs text-gray-500">EcoPoints Earned</p>
      <p className="mt-0.5 text-2xl font-bold text-[#1A1A1A]">
        {value.toLocaleString("id-ID")} <span className="text-base">⭐</span>
      </p>
      <p className="mt-1 text-xs text-gray-400">Level Up in <span className="font-semibold text-[#F59E0B]">{xpToNextLevel} XP</span></p>
    </CardShell>
  );
}

/* ── Card 3: Active Challenges (dot indicators) ── */
function ChallengesCard({ delay }: { delay: number }) {
  const filled = useUserStore((s) => s.challengesCompleted) % 5 || 3;
  const total = 5;
  return (
    <CardShell delay={delay} iconBg="rgba(245,158,11,0.15)" iconColor="#F59E0B" Icon={Target}>
      <p className="text-xs text-gray-500">Active Challenges</p>
      <p className="mt-0.5 text-2xl font-bold text-[#1A1A1A]">{filled}/{total}</p>
      <div className="mt-1.5 flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: i < filled ? "#2D5F3F" : "#E5E7EB" }}
          />
        ))}
      </div>
    </CardShell>
  );
}

/* ── Card 4: Community Rank ── */
function RankCard({ delay }: { delay: number }) {
  const rank = useUserStore((s) => s.rank);
  return (
    <CardShell delay={delay} iconBg="rgba(16,185,129,0.15)" iconColor="#10B981" Icon={Trophy}>
      <p className="text-xs text-gray-500">Community Rank</p>
      <p className="mt-0.5 text-2xl font-bold text-[#1A1A1A]">#{rank} Surabaya</p>
      <p className="mt-1 text-xs text-gray-400">Top <span className="font-semibold text-[#10B981]">5%</span> in your area</p>
    </CardShell>
  );
}

/* ── Main export ── */
export default function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <CarbonSavedCard delay={0} />
      <EcoPointsCard delay={0.1} />
      <ChallengesCard delay={0.2} />
      <RankCard delay={0.3} />
    </div>
  );
}
