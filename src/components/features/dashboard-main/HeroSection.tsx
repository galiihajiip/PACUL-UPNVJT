"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Users, Leaf, TrendingDown, ArrowDown, X } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

/* ── mini animation variants ── */
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay },
  }),
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: "easeOut" },
  }),
};

const slideRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.3, ease: "easeOut" },
  },
};

/* ── mini stats ── */
const STATS = [
  { icon: CheckCircle, value: "1.200", label: "aksi nyata" },
  { icon: Users, value: "38", label: "komunitas" },
  { icon: Leaf, value: "2.4 ton", label: "CO₂ saved" },
];

/* ── tiny KPI cards for mockup ── */
const KPI_CARDS = [
  { label: "Emisi Total", value: "450 kg", color: "#7AC74F" },
  { label: "Total XP", value: "12,402", color: "#F59E0B" },
  { label: "Tantangan", value: "3/5", color: "#90E0EF" },
  { label: "Peringkat", value: "#12", color: "#A8D5BA" },
];

/* ── Browser Mockup (pure CSS/SVG) ── */
function BrowserMockup() {
  return (
    <div
      className="w-full overflow-hidden rounded-xl shadow-2xl"
      style={{ border: "1px solid rgba(255,255,255,0.12)" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-3 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
        <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
        <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        <div className="mx-auto flex h-5 w-48 items-center rounded bg-[#2a2a2a] px-2">
          <span className="text-[9px] text-gray-400">pacul.app/dashboard</span>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="bg-[#F5F5F5] p-3">
        {/* Navbar strip */}
        <div className="mb-3 flex h-7 items-center rounded bg-[#2D5F3F] px-3 gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7AC74F]" />
          <span className="text-[8px] font-bold text-white">PACUL</span>
          <div className="ml-auto flex gap-2">
            {["Home", "Tracker", "Map"].map((l) => (
              <span key={l} className="text-[7px] text-white/60">{l}</span>
            ))}
          </div>
        </div>

        {/* KPI grid */}
        <div className="mb-3 grid grid-cols-4 gap-1.5">
          {KPI_CARDS.map(({ label, value, color }) => (
            <div key={label} className="rounded-md bg-white p-2 shadow-sm">
              <p className="text-[7px] text-gray-400">{label}</p>
              <p className="text-[10px] font-bold" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Mini chart placeholder */}
        <div className="rounded-md bg-white p-2 shadow-sm">
          <p className="mb-1.5 text-[7px] text-gray-400">Emisi Mingguan (kg)</p>
          <div className="flex h-12 items-end gap-1">
            {[60, 45, 70, 40, 55, 35, 50].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{
                height: `${h}%`,
                backgroundColor: i === 5 ? "#7AC74F" : "#A8D5BA",
              }} />
            ))}
          </div>
          <div className="mt-1 flex justify-between">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
              <span key={d} className="text-[6px] text-gray-300">{d}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Demo Modal ── */
function DemoModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl bg-[#1a1a1a] p-1 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Tutup demo"
          className="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
        >
          <X size={16} />
        </button>
        <div className="flex flex-col items-center gap-4 rounded-xl bg-[#0f1a0f] p-8 text-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2D5F3F]">
            <Leaf size={28} className="text-[#7AC74F]" />
          </div>
          <h3 className="text-xl font-bold">PACUL Platform Preview</h3>
          <p className="text-center text-sm text-white/60">Cara kerja platform aksi komunitas untuk lingkungan hidup</p>
          <div className="grid w-full grid-cols-3 gap-3 text-center">
            {[
              { emoji: "📊", title: "Carbon Tracker", desc: "Lacak emisi harianmu" },
              { emoji: "🏆", title: "EcoAction", desc: "Tantangan & reward" },
              { emoji: "🗺️", title: "Impact Map", desc: "Dampak per wilayah" },
            ].map((f) => (
              <div key={f.title} className="rounded-xl bg-white/5 p-4">
                <div className="mb-2 text-2xl">{f.emoji}</div>
                <p className="text-xs font-semibold">{f.title}</p>
                <p className="mt-0.5 text-[10px] text-white/50">{f.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/register"
            onClick={onClose}
            className="mt-2 rounded-lg bg-[#7AC74F] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#6ab344] transition-colors"
          >
            Mulai Gratis Sekarang →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main HeroSection ── */
export default function HeroSection() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [showDemo, setShowDemo] = useState(false);

  const handleStart = () => {
    router.push(isAuthenticated ? "/dashboard" : "/register");
  };

  return (
    <section
      className="relative flex min-h-[90vh] w-full items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2D5F3F 0%, #1a3d27 60%, #0f2518 100%)",
      }}
    >
      {/* Noise / texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Subtle animated radial glow */}
      <div
        className="pointer-events-none absolute left-1/3 top-1/4 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: "#7AC74F", animation: "pulse 6s ease-in-out infinite" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-20 md:py-20">
        <div className="grid items-center gap-8 md:gap-12 md:grid-cols-[55fr_45fr]">

          {/* ── Left: Text ── */}
          <div className="flex flex-col">

            {/* Badge */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="mb-6 w-fit"
            >
              <span
                className="flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold tracking-wider"
                style={{
                  backgroundColor: "rgba(122,199,79,0.15)",
                  color: "#7AC74F",
                  border: "1px solid rgba(122,199,79,0.3)",
                }}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-[#7AC74F]" aria-hidden="true">
                  <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3l2.5 5 5.5.8-4 3.9.9 5.5L12 17.5l-4.9 2.7.9-5.5-4-3.9 5.5-.8L12 5z" />
                </svg>
                GERAKAN IKLIM KOLEKTIF
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={slideUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-[52px]"
            >
              <span className="text-white">Ubah Aksi Jadi</span>
              <br />
              <span style={{ color: "#7AC74F" }}>Dampak Nyata</span>
            </motion.h1>

            {/* Sub-text */}
            <motion.p
              variants={slideUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="mb-6 max-w-[480px] text-base leading-relaxed md:mb-8 md:text-lg"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Berdayakan komunitasmu dengan platform berbasis data untuk memantau,
              berkolaborasi, dan mempercepat transisi energi hijau di Indonesia.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={handleStart}
                className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#7AC74F" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6ab344")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7AC74F")}
              >
                Mulai Sekarang
              </button>
              <button
                onClick={() => setShowDemo(true)}
                className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors"
                style={{ border: "2px solid rgba(255,255,255,0.5)", backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Lihat Demo
              </button>
            </motion.div>

            {/* Mini Stats */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.6}
              className="mt-12 flex flex-wrap gap-8"
            >
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={18} style={{ color: "#7AC74F" }} />
                  <div>
                    <span className="text-sm font-bold text-white">{value} </span>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Visual ── */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            animate="visible"
            className="relative hidden md:block max-w-[520px] mx-auto w-full"
          >
            {/* Float animation wrapper */}
            <div className="animate-float">
              <BrowserMockup />
            </div>

            {/* Floating card top-left: emission target */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="absolute -left-8 -top-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-lg"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(122,199,79,0.15)" }}
              >
                <ArrowDown size={16} style={{ color: "#7AC74F" }} />
              </span>
              <div>
                <p className="text-xs text-gray-400">Target Emisi</p>
                <p className="text-sm font-bold text-[#2D5F3F]">−31.9%</p>
              </div>
            </motion.div>

            {/* Floating card bottom-right: communities */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.4 }}
              className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-lg"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(45,95,63,0.1)" }}
              >
                <Users size={16} style={{ color: "#2D5F3F" }} />
              </span>
              <div>
                <p className="text-xs text-gray-400">Bergabung</p>
                <p className="text-sm font-bold text-[#2D5F3F]">5.100+ komunitas</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      </AnimatePresence>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50%       { opacity: 0.18; transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
}
