"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Pencil, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { useUserStore } from "@/store/userStore";

export default function ProfileHeader() {
  const router = useRouter();
  const storeUser = useAuthStore((s) => s.user);
  const ecoPoints = useUserStore((s) => s.xp);

  const displayUser = storeUser ?? {
    avatarInitials: "AP",
    name: "Aditya Pratama",
    location: "Surabaya, Indonesia",
    level: 12,
    xp: 750,
    totalXP: 1000,
    joinedAt: "2026-10-01",
    avatarColor: undefined as string | undefined,
  };

  const level = storeUser?.level ?? 12;
  const xpCurrent = storeUser?.xp ?? 750;
  const xpNext = 1000;
  const xpPct = Math.min(100, Math.round((xpCurrent / xpNext) * 100));
  const joined = storeUser?.joinedAt
    ? new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(new Date(storeUser.joinedAt))
    : "Okt 2026";

  const miniStats = [
    { label: `${ecoPoints.toLocaleString("id-ID")} EcoPoints` },
    { label: `Level ${level}` },
    { label: `Bergabung ${joined}` },
  ];

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://pacul.app";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Profil PACUL", url });
        return;
      } catch { /* user cancelled */ }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link profil disalin! 🔗");
  };

  return (
    <div
      className="relative overflow-hidden rounded-[14px] p-7 text-white"
      style={{
        background: "linear-gradient(135deg, #2D5F3F 0%, #1a3d27 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-10 right-32 h-36 w-36 rounded-full bg-white/5" />

      <div className="relative flex flex-wrap items-center justify-between gap-8">

        {/* ── LEFT: Avatar + name + buttons ── */}
        <div className="flex items-center gap-5">
          {/* Avatar circle */}
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{
              backgroundColor: displayUser.avatarColor ?? "rgba(255,255,255,0.15)",
              border: "3px solid #F4A261",
            }}
          >
            {displayUser.avatarInitials}
          </div>

          {/* Name + location + buttons */}
          <div>
            <h1 className="text-xl font-bold leading-tight">{displayUser.name}</h1>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-white/70">
              <MapPin size={13} />
              {displayUser.location}
            </p>

            {/* Action buttons */}
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => router.push("/dashboard/profile/edit")}
                className="flex items-center gap-1.5 rounded-md border border-white/40 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:border-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Pencil size={13} />
                Edit Profil
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                style={{ backgroundColor: "#F4A261" }}
              >
                <Share2 size={13} />
                Bagikan
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Level progress ── */}
        <div className="min-w-[280px] flex-1">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
            Current Status
          </p>
          <p className="text-2xl font-bold">Level {level}</p>
          <p className="mt-0.5 text-sm text-white/70">
            {xpNext - xpCurrent} XP lagi untuk Level {level + 1}!
          </p>

          {/* Progress bar */}
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full"
              style={{ backgroundColor: "#F4A261" }}
            />
          </div>

          {/* XP range labels */}
          <div className="mt-1 flex justify-between text-[10px] text-white/50">
            <span>0 XP</span>
            <span>{xpNext.toLocaleString("id-ID")} XP</span>
          </div>

          {/* Mini stats row */}
          <div className="mt-4 flex items-center gap-0 divide-x divide-white/20">
            {miniStats.map((s, i) => (
              <span
                key={i}
                className="px-3 text-xs text-white/70 first:pl-0 last:pr-0"
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
