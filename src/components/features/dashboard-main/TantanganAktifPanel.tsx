"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEcoActionStore } from "@/store/ecoAction.store";

export default function TantanganAktifPanel() {
  const allChallenges = useEcoActionStore((s) => s.challenges);
  const active = allChallenges.filter((c) => c.isJoined && !c.isCompleted);
  const allDone = allChallenges.filter((c) => c.isJoined).every((c) => c.isCompleted);

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">Tantangan Aktif</h3>
        <Link
          href="/dashboard/eco-action"
          className="flex items-center gap-1 text-sm font-medium text-[#2D5F3F] hover:underline"
        >
          Lihat Semua <ArrowRight size={13} />
        </Link>
      </div>

      {/* Empty / all-done state */}
      {active.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          {allDone ? (
            <>
              <p className="text-2xl">🎉</p>
              <p className="text-sm font-semibold text-[#1A1A1A]">Semua tantangan selesai!</p>
              <Link
                href="/dashboard/eco-action"
                className="mt-1 text-xs font-medium text-[#2D5F3F] hover:underline"
              >
                Ikuti tantangan baru →
              </Link>
            </>
          ) : (
            <>
              <p className="text-2xl">🌱</p>
              <p className="text-sm font-semibold text-gray-500">Belum ada tantangan aktif</p>
              <Link
                href="/dashboard/eco-action"
                className="mt-1 text-xs font-medium text-[#2D5F3F] hover:underline"
              >
                Ikut tantangan sekarang →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {active.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#1A1A1A]">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.timeLeftDays} hari lagi · +{c.xpReward} XP</p>
                </div>
                <span className="ml-3 shrink-0 text-sm font-bold" style={{ color: c.iconColor }}>
                  {c.currentProgress}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: c.iconColor }}
                  animate={{ width: `${c.currentProgress}%` }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
