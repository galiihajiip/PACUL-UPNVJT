"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Leaf, Trophy, Star, CheckCircle, Lock, Award, Users } from "lucide-react";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import PageWrapper from "@/components/common/PageWrapper";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import { useUserStore } from "@/store/userStore";

const STATS_META = [
  { icon: Leaf,   label: "CO₂ SAVED",        suffix: " kg", iconBg: "rgba(45,95,63,0.12)",   iconColor: "#2D5F3F", duration: 1600, key: "carbonSaved"          as const },
  { icon: Trophy, label: "TANTANGAN SELESAI", suffix: "",   iconBg: "rgba(245,158,11,0.12)", iconColor: "#F59E0B", duration: 1200, key: "challengesCompleted"   as const },
  { icon: Star,   label: "ECOPOINTS EARNED", suffix: "",   iconBg: "rgba(244,162,97,0.15)", iconColor: "#F4A261", duration: 2000, key: "totalXpEarned"         as const },
];

const profileBadges = [
  { name: "Early Bird", emoji: "🌅", earned: true },
  { name: "Tree Planter", emoji: "🌳", earned: true },
  { name: "Waste Warrior", emoji: "⚔️", earned: true },
  { name: "Energy Saver", emoji: "⚡", earned: true },
  { name: "Water Hero", emoji: "💧", earned: false },
  { name: "Leader", emoji: "👑", earned: false },
  { name: "Speaker", emoji: "📢", earned: false },
  { name: "Zero Hero", emoji: "♻️", earned: false },
];

const recentActivities = [
  { icon: Trophy, iconBg: "rgba(245,158,11,0.12)", iconColor: "#F59E0B", label: "Menyelesaikan Tantangan Transportasi Publik Selama 7 Hari", time: "2 jam lalu" },
  { icon: Users, iconBg: "rgba(45,95,63,0.12)", iconColor: "#2D5F3F", label: "Bergabung Kolaborasi Aksi Bersih Pantai Kenjeran", time: "Kemarin, 14:20" },
  { icon: Award, iconBg: "rgba(122,199,79,0.12)", iconColor: "#7AC74F", label: "Mendapatkan Badge Waste Warrior", time: "3 hari lalu" },
];

function StatCard({
  icon: Icon, label, target, suffix, iconBg, iconColor, duration, delay,
}: { icon: React.ElementType; label: string; target: number; suffix: string; iconBg: string; iconColor: string; duration: number; delay: number }) {
  const { value, ref } = useCountAnimation(target, duration);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex flex-col items-center rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center shadow-sm"
      aria-label={`${label}: ${value.toLocaleString("id-ID")}${suffix}`}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: iconBg }}>
        <Icon size={20} style={{ color: iconColor }} aria-hidden="true" />
      </div>
      <p className="text-3xl font-extrabold text-[#1A1A1A]" aria-hidden="true">
        {value.toLocaleString("id-ID")}{suffix}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-500">{label}</p>
    </motion.div>
  );
}

export default function ProfilePageClient() {
  const carbonSaved        = useUserStore((s) => s.carbonSaved);
  const challengesCompleted = useUserStore((s) => s.challengesCompleted);
  const totalXpEarned      = useUserStore((s) => s.totalXpEarned);
  const storeValues = { carbonSaved, challengesCompleted, totalXpEarned };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <ProfileHeader />
        </motion.div>

        <section aria-label="Statistik profil">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS_META.map(({ key: storeKey, ...s }, i) => (
              <StatCard key={s.label} {...s} target={storeValues[storeKey]} delay={0.1 + i * 0.1} />
            ))}
          </div>
        </section>

        <div className="grid gap-4 lg:gap-6 lg:grid-cols-[60fr_40fr]">
          <section aria-label="Badge pencapaian" className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Pencapaian</h2>
              <span className="text-xs text-gray-400" aria-label={`${profileBadges.filter((b) => b.earned).length} dari ${profileBadges.length} badge diraih`}>
                {profileBadges.filter((b) => b.earned).length}/{profileBadges.length} diraih
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" role="list" aria-label="Daftar badge">
              {profileBadges.map((badge, i) => (
                <div key={badge.name} className="group relative flex flex-col items-center gap-1.5" role="listitem">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                    className="relative flex h-20 w-20 cursor-default items-center justify-center rounded-full border-2 text-3xl"
                    aria-label={`${badge.name}: ${badge.earned ? "sudah diraih" : "belum terbuka"}`}
                    style={
                      badge.earned
                        ? { background: "radial-gradient(circle, #e6f4eb, #c8e6c9)", borderColor: "#2D5F3F" }
                        : { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB", filter: "grayscale(1)", opacity: 0.5 }
                    }
                  >
                    <span aria-hidden="true">{badge.emoji}</span>
                    {badge.earned ? (
                      <CheckCircle size={16} className="absolute -bottom-1 -right-1 text-[#2D5F3F]" fill="white" aria-hidden="true" />
                    ) : (
                      <Lock size={12} className="absolute -bottom-1 -right-1 text-gray-400" aria-hidden="true" />
                    )}
                  </motion.div>

                  <p className="text-center text-[10px] font-medium text-gray-600">{badge.name}</p>

                  <div className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-50 hidden w-32 -translate-x-1/2 rounded-[8px] bg-[#1A1A1A] p-2 text-[10px] text-white shadow-lg group-hover:block" aria-hidden="true">
                    <p className="font-semibold">{badge.name}</p>
                    <p className="mt-1 font-medium" style={{ color: badge.earned ? "#7AC74F" : "#EF4444" }}>
                      {badge.earned ? "Sudah diraih ✓" : "Belum terbuka 🔒"}
                    </p>
                    <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]" />
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/marketplace"
              className="mt-4 inline-block text-xs font-medium text-[#2D5F3F] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-2 rounded"
            >
              Lihat Semua di Marketplace →
            </Link>
          </section>

          <section aria-label="Aktivitas terkini" className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-[#1A1A1A]">Aktivitas Terkini</h2>
            <ul className="flex flex-col" aria-label="Riwayat aktivitas terkini">
              {recentActivities.map((act, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
                  className={`flex items-start gap-3 py-3.5 ${i < recentActivities.length - 1 ? "border-b border-[#F3F4F6]" : ""}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: act.iconBg }} aria-hidden="true">
                    <act.icon size={16} style={{ color: act.iconColor }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-[#1A1A1A]">{act.label}</p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      <time>{act.time}</time>
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}
