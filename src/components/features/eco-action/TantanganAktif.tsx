"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useEcoActionStore, type Challenge } from "@/store/ecoAction.store";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trash2, Bus, Leaf, Clock, Users, CheckCircle, Check, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

/* ── Category → icon map ── */
const CATEGORY_ICON: Record<string, LucideIcon> = {
  Energi: Zap,
  Limbah: Trash2,
  Transportasi: Bus,
  Penghijauan: Leaf,
  Pangan: Leaf,
};

/* ── Card ── */
function ChallengeCard({
  challenge,
  index,
  joiningId,
  onJoin,
  onUpdateProgress,
}: {
  challenge: Challenge;
  index: number;
  joiningId: string | null;
  onJoin: (id: string) => void;
  onUpdateProgress: (id: string, p: number) => void;
}) {
  const Icon = CATEGORY_ICON[challenge.category] ?? Leaf;
  const { id, iconColor, title, description, currentProgress, timeLeftDays, participants, xpReward, category, isJoined, isCompleted } = challenge;

  /* Flash green border on completion */
  const prevCompleted = useRef(isCompleted);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!prevCompleted.current && isCompleted) {
      setFlash(true);
      setTimeout(() => setFlash(false), 1200);
      toast.success(`🎉 +${xpReward} XP — ${title} selesai!`, { duration: 4000 });
    }
    prevCompleted.current = isCompleted;
  }, [isCompleted, xpReward, title]);

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      animate={flash ? { borderColor: ["#E5E7EB", "#10B981", "#10B981", "#E5E7EB"] } : {}}
      className={cn(
        "flex flex-col rounded-[12px] border bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        isCompleted ? "border-emerald-200 bg-emerald-50/30" : "border-[#E5E7EB]"
      )}
      style={{ borderTop: `3px solid ${isCompleted ? "#10B981" : iconColor}` }}
    >
      {/* Top row */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          <Icon size={20} style={{ color: isCompleted ? "#10B981" : iconColor }} />
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
          style={{ backgroundColor: `${iconColor}15`, color: iconColor }}
        >
          {category}
        </span>
      </div>

      {/* Title */}
      <h4 className="mb-1.5 text-sm font-semibold text-[#1A1A1A]">{title}</h4>

      {/* Description */}
      <p
        className="mb-4 flex-1 text-xs leading-relaxed text-gray-600"
        style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {description}
      </p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="font-semibold" style={{ color: isCompleted ? "#10B981" : iconColor }}>
            {currentProgress}%
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-valuenow={currentProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: isCompleted ? "#10B981" : iconColor }}
            animate={{ width: `${currentProgress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Dev progress button */}
      {process.env.NODE_ENV === "development" && isJoined && !isCompleted && (
        <button
          onClick={() => onUpdateProgress(id, currentProgress + 20)}
          className="mb-2 text-left text-[10px] text-gray-300 hover:text-[#2D5F3F] transition-colors"
        >
          [dev] +20% progress
        </button>
      )}

      {/* Footer meta */}
      <div className="mb-4 flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock size={11} /> {timeLeftDays}h lagi
        </span>
        <span className="flex items-center gap-1">
          <Users size={11} /> {participants.toLocaleString("id-ID")}
        </span>
        <span className="ml-auto rounded-full bg-[#7AC74F]/10 px-2 py-0.5 text-[10px] font-semibold text-[#7AC74F]">
          +{xpReward} XP
        </span>
      </div>

      {/* CTA */}
      <AnimatePresence mode="wait">
        {isCompleted ? (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 py-2 text-xs font-semibold text-emerald-700"
          >
            <CheckCircle size={13} /> Tantangan Selesai!
          </motion.div>
        ) : isJoined ? (
          <motion.div
            key="joined"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-[#2D5F3F]/20 bg-[#2D5F3F]/10 py-2 text-xs font-semibold text-[#2D5F3F]"
          >
            <Check size={13} /> Sudah Bergabung
          </motion.div>
        ) : (
          <motion.button
            key="join"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => onJoin(id)}
            disabled={joiningId === id}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2D5F3F] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#245033] disabled:opacity-60"
          >
            {joiningId === id ? (
              <><Loader2 size={13} className="animate-spin" /> Bergabung...</>
            ) : (
              "Ikut Tantangan"
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main ── */
export default function TantanganAktif() {
  const challenges = useEcoActionStore((s) => s.challenges);
  const joinChallenge = useEcoActionStore((s) => s.joinChallenge);
  const updateProgress = useEcoActionStore((s) => s.updateProgress);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const handleJoin = async (id: string) => {
    setJoiningId(id);
    await new Promise((r) => setTimeout(r, 700));
    joinChallenge(id);
    setJoiningId(null);
    const c = challenges.find((ch) => ch.id === id);
    toast.success(`+${10} XP! Bergabung tantangan "${c?.title}" 💪`);
  };

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#1A1A1A]">Tantangan Aktif</h3>
        <Link
          href="/dashboard/eco-action"
          className="text-xs font-medium text-[#2D5F3F] hover:underline transition-colors"
        >
          Lihat Semua ›
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((c, i) => (
          <ChallengeCard
            key={c.id}
            challenge={c}
            index={i}
            joiningId={joiningId}
            onJoin={handleJoin}
            onUpdateProgress={updateProgress}
          />
        ))}
      </div>
    </div>
  );
}
