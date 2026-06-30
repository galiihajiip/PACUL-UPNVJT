"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Dot,
} from "recharts";
import { useStepTracker } from "@/hooks/useStepTracker";
import { useStepTrackerStore } from "@/store/stepTracker.store";
import { useAuthStore } from "@/store/auth.store";

/* ── helpers ── */
const DAILY_TARGET = 10_000;
const fmt2 = (n: number) => n.toFixed(2);

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function isDesktop() {
  if (typeof window === "undefined") return false;
  return window.innerWidth > 1024 || typeof DeviceMotionEvent === "undefined";
}

/* ── Circular gauge ── */
const RADIUS = 90;
const CIRC = 2 * Math.PI * RADIUS;

function StepGauge({ steps, target }: { steps: number; target: number }) {
  const pct = Math.min(1, steps / target);
  const offset = CIRC * (1 - pct);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={220} height={220} className="-rotate-90">
        <circle
          cx={110} cy={110} r={RADIUS}
          fill="none" stroke="#2a3d2f" strokeWidth={14}
        />
        <motion.circle
          cx={110} cy={110} r={RADIUS}
          fill="none"
          stroke="#7AC74F"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[52px] font-extrabold leading-none text-white tabular-nums">
          {steps.toLocaleString("id-ID")}
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
          LANGKAH HARI INI
        </span>
        <span className="mt-0.5 text-xs text-[#7AC74F]">
          {Math.round(pct * 100)}% dari target {target.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}

/* ── Confetti ── */
const CONFETTI_COLORS = ["#7AC74F", "#2D5F3F", "#F59E0B", "#10B981", "#A8D5BA", "#ffffff"];
function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-2.5 w-2.5 rounded-sm"
          style={{
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            left: `${(i * 2.5) % 100}%`,
            top: "-12px",
            opacity: 0,
            animation: `confettiFall ${1 + (i % 5) * 0.25}s ease-in ${(i % 10) * 0.1}s forwards`,
            transform: `rotate(${i * 13}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Main ── */
export default function StepTrackerClient() {
  const tracker = useStepTracker();
  const store = useStepTrackerStore();
  const updateUser = useAuthStore((s) => s.updateUser);
  const user = useAuthStore((s) => s.user);

  const [desktop, setDesktop] = useState(false);
  const [needsHttps, setNeedsHttps] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [milestones, setMilestones] = useState({
    m1000: false,
    m5000: false,
    m10000: false,
  });

  /* Detect desktop + HTTPS requirement on mount */
  useEffect(() => {
    setDesktop(isDesktop());
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isHttps = location.protocol === "https:";
    if (isIOS && !isHttps) setNeedsHttps(true);
  }, []);

  /* Sync steps to store */
  const prevStepsRef = useRef(0);
  useEffect(() => {
    const diff = tracker.steps - prevStepsRef.current;
    if (diff > 0) store.addSteps(diff);
    prevStepsRef.current = tracker.steps;
  }, [tracker.steps]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync tracking status to store */
  useEffect(() => {
    store.setIsTracking(tracker.isTracking);
  }, [tracker.isTracking]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Milestone detection */
  useEffect(() => {
    const s = tracker.steps;

    if (s >= 1000 && !milestones.m1000) {
      setMilestones((p) => ({ ...p, m1000: true }));
      toast.success("🎉 Misi selesai! 1,000 langkah pertama +10 XP");
      if (user) updateUser({ xp: (user.xp ?? 0) + 10, totalXP: (user.totalXP ?? 0) + 10 });
      triggerConfetti();
    }
    if (s >= 5000 && !milestones.m5000) {
      setMilestones((p) => ({ ...p, m5000: true }));
      toast.success("🎉 Misi selesai! 5,000 langkah +50 XP");
      if (user) updateUser({ xp: (user.xp ?? 0) + 50, totalXP: (user.totalXP ?? 0) + 50 });
      triggerConfetti();
    }
    if (s >= 10000 && !milestones.m10000) {
      setMilestones((p) => ({ ...p, m10000: true }));
      toast.success("🏆 WALKER HERO! 10,000 langkah +100 XP + Badge");
      if (user) updateUser({ xp: (user.xp ?? 0) + 100, totalXP: (user.totalXP ?? 0) + 100 });
      triggerConfetti();
    }
  }, [tracker.steps]); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2800);
  };

  /* Live steps-per-minute (10s window) */
  const stepLog = useRef<{ t: number; s: number }[]>([]);
  useEffect(() => {
    const now = Date.now();
    stepLog.current.push({ t: now, s: tracker.steps });
    stepLog.current = stepLog.current.filter((e) => now - e.t < 10_000);
  }, [tracker.steps]);

  const stepsPerMin = (() => {
    const log = stepLog.current;
    if (log.length < 2) return 0;
    const span = (log[log.length - 1].t - log[0].t) / 1000;
    const diff = log[log.length - 1].s - log[0].s;
    return span > 0 ? Math.round((diff / span) * 60) : 0;
  })();

  const missions = [
    { label: "1,000 langkah pertama", target: 1000, xp: 10, done: milestones.m1000 },
    { label: "5,000 langkah", target: 5000, xp: 50, done: milestones.m5000 },
    { label: "10,000 langkah hari ini! 🏆", target: 10000, xp: 100, done: milestones.m10000, mega: true },
  ];

  /* Hourly bar data — only show 6am-10pm */
  const hourlyVisible = store.hourlyData.filter((h) => h.hour >= 6 && h.hour <= 22);

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#1a2e1f", color: "#ffffff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {showConfetti && <Confetti />}

      <div className="mx-auto max-w-3xl px-4 py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-white">Langkah Hijau 👣</h1>
          <p className="mt-0.5 text-sm text-white/50">Setiap langkah mengurangi emisi karbon kota</p>
        </div>

        {/* ── Desktop notice ── */}
        {desktop && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-4 py-3">
            <span className="text-lg">💻</span>
            <p className="text-sm text-yellow-200">
              Kamu menggunakan <strong>desktop</strong>. Step tracker berjalan dalam{" "}
              <strong>mode simulasi</strong> untuk demo.
            </p>
          </div>
        )}

        {/* ── HTTPS required (iOS) ── */}
        {needsHttps && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-orange-400/30 bg-orange-400/10 px-4 py-3">
            <span className="text-lg">🔒</span>
            <div>
              <p className="text-sm font-semibold text-orange-200">Sensor gerak butuh HTTPS</p>
              <p className="mt-0.5 text-xs text-orange-200/70">
                iOS Safari memblokir akses sensor di HTTP. Buka lewat URL <strong>https://</strong> atau gunakan mode simulasi.
              </p>
              <button
                onClick={() => tracker.startSimulation()}
                className="mt-2 rounded-lg bg-orange-500/30 px-3 py-1.5 text-xs font-semibold text-orange-100 hover:bg-orange-500/50 transition-colors"
              >
                Gunakan Mode Simulasi
              </button>
            </div>
          </div>
        )}

        {/* ── Permission denied ── */}
        {tracker.hasPermission === false && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-900/30 px-4 py-4">
            <p className="font-semibold text-red-300">⚠️ Akses sensor tidak diizinkan</p>
            <p className="mt-1 text-sm text-red-200/70">
              Untuk tracking langkah nyata, izinkan akses sensor gerak di pengaturan browser/perangkat kamu.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => tracker.startSimulation()}
                className="rounded-lg bg-red-500/30 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/50 transition-colors"
              >
                Gunakan Mode Simulasi
              </button>
            </div>
          </div>
        )}

        {/* ── SECTION 1: Gauge ── */}
        <div
          className="relative mb-6 overflow-hidden rounded-2xl p-6"
          style={{ background: "linear-gradient(135deg, #223b27 0%, #1a2e1f 100%)" }}
        >
          {/* Pulse ring when tracking */}
          {tracker.isTracking && (
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#7AC74F]/30"
              style={{
                width: 240, height: 240,
                animation: "pulseRing 2s ease-out infinite",
                pointerEvents: "none",
              }}
            />
          )}

          <div className="flex flex-col items-center gap-6">
            <StepGauge steps={tracker.steps} target={DAILY_TARGET} />

            {/* 4 mini stats */}
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: "🔥", label: "Kalori", value: `${tracker.calories} kcal` },
                { icon: "📍", label: "Jarak", value: `${fmt2(tracker.distance / 1000)} km` },
                { icon: "🌿", label: "CO₂ Tersimpan", value: `${tracker.co2Saved} kg` },
                { icon: "⭐", label: "XP", value: `+${tracker.xpEarned} XP` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/5 p-3 text-center">
                  <div className="text-xl">{stat.icon}</div>
                  <div className="mt-1 text-sm font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Main CTA button */}
            <div className="relative">
              {tracker.isTracking && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ animation: "ctaPulse 1.5s ease-out infinite", backgroundColor: "#7AC74F", opacity: 0.3 }}
                />
              )}
              {!tracker.isTracking ? (
                <button
                  onClick={() => desktop ? tracker.startSimulation() : tracker.startTracking()}
                  className="relative rounded-full bg-[#7AC74F] px-10 py-4 text-lg font-extrabold text-[#1a2e1f] shadow-lg hover:bg-[#6ab344] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7AC74F]/40"
                >
                  ▶ Mulai Tracking
                </button>
              ) : (
                <button
                  onClick={() => tracker.stopTracking()}
                  className="relative rounded-full px-10 py-4 text-lg font-extrabold text-white shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/40"
                  style={{ backgroundColor: "rgba(239,68,68,0.8)" }}
                >
                  ⏹ Hentikan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Session info ── */}
        <AnimatePresence>
          {tracker.isTracking && tracker.startTime && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3"
            >
              <div className="text-sm">
                <span className="text-white/50">Mulai: </span>
                <span className="font-semibold text-white">
                  {tracker.startTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-white/50">Durasi: </span>
                <span className="font-semibold text-[#7AC74F]">{formatDuration(tracker.duration)}</span>
              </div>
              <div className="text-sm">
                <span className="text-white/50">Kecepatan: </span>
                <span className="font-semibold text-white">{stepsPerMin} langkah/menit</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SECTION 3: Hourly bar chart ── */}
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">
            Riwayat Sesi Hari Ini
          </h2>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={hourlyVisible} margin={{ top: 0, bottom: 0, left: -20, right: 0 }}>
              <XAxis
                dataKey="hour"
                tickFormatter={(v) => `${v}`}
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#1a2e1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                labelFormatter={(v) => `Jam ${v}:00`}
                formatter={(v: number) => [`${v} langkah`, ""]}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="steps" fill="#7AC74F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── SECTION 4: Missions ── */}
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">
            Misi Jalan Kaki
          </h2>
          <div className="flex flex-col gap-3">
            {missions.map((m) => {
              const pct = Math.min(100, Math.round((tracker.steps / m.target) * 100));
              return (
                <div key={m.label} className={`rounded-xl p-4 transition-colors ${m.done ? "bg-[#7AC74F]/15 border border-[#7AC74F]/30" : "bg-white/5"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{m.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${m.done ? "bg-[#7AC74F] text-black" : "bg-white/10 text-white/50"}`}>
                      {m.done ? "✓ SELESAI" : `+${m.xp} XP`}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: m.done ? "#7AC74F" : m.mega ? "#F59E0B" : "#4ade80" }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-white/30">
                    <span>{tracker.steps.toLocaleString("id-ID")}</span>
                    <span>{m.target.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 5: Weekly summary ── */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/60">
            Ringkasan 7 Hari Terakhir
          </h2>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={store.weeklyData} margin={{ top: 8, bottom: 0, left: -20, right: 8 }}>
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#1a2e1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${v.toLocaleString("id-ID")} langkah`, ""]}
                cursor={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <Line
                type="monotone"
                dataKey="steps"
                stroke="#7AC74F"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const achieved = (payload as { steps: number }).steps >= DAILY_TARGET;
                  return (
                    <Dot
                      key={`dot-${cx}-${cy}`}
                      cx={cx} cy={cy}
                      r={achieved ? 5 : 3}
                      fill={achieved ? "#7AC74F" : "#ef4444"}
                      stroke="none"
                    />
                  );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-center text-[10px] text-white/30">
            ● Hijau = target tercapai &nbsp;● Merah = belum tercapai
          </p>
        </div>

        {/* Reset button */}
        {tracker.steps > 0 && !tracker.isTracking && (
          <div className="mt-5 flex justify-center">
            <button
              onClick={tracker.reset}
              className="text-sm text-white/30 hover:text-white/60 transition-colors"
            >
              ↺ Reset sesi
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulseRing {
          0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
        @keyframes ctaPulse {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
