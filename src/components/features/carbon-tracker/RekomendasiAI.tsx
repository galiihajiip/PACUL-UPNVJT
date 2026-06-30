"use client";

import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";

const REKOMENDASI_TEXT =
  "Kamu sudah 12% di bawah rata-rata Jawa Timur! Coba ganti perjalanan Selasa dengan KRL untuk kurangi 4.2 kg CO₂ minggu ini.";

export default function RekomendasiAI() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1600);
  };

  return (
    <div
      className="relative overflow-hidden rounded-[12px] border border-[#A8D5BA] p-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(45,95,63,0.05) 0%, rgba(122,199,79,0.05) 100%)",
      }}
    >
      {/* Decorative leaf background */}
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute -right-3 -top-3 h-20 w-20 rotate-12 opacity-[0.05]"
        fill="#2D5F3F"
        aria-hidden="true"
      >
        <path d="M12 2C6 2 3 8 3 12c0 3.5 2.5 6.5 6 7.5V22h2v-2.5c3.5-1 6-4 6-7.5 0-4-3-10-5-10z" />
      </svg>

      {/* Header row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles
            size={18}
            style={{ color: "#2D5F3F", animation: "sparkPulse 2s ease-in-out infinite" }}
          />
          <span className="text-sm font-semibold text-[#2D5F3F]">Rekomendasi AI</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          aria-label="Refresh rekomendasi"
          className="rounded-full p-1 text-[#2D5F3F]/60 hover:text-[#2D5F3F] hover:bg-[#2D5F3F]/10 transition-colors disabled:opacity-40"
        >
          <RefreshCw
            size={13}
            className={isRefreshing ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* Body */}
      {isRefreshing ? (
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>
      ) : (
        <>
          <p
            className="mb-3 text-gray-700 leading-relaxed"
            style={{ fontSize: "13px" }}
          >
            {REKOMENDASI_TEXT}
          </p>
          <a
            href="https://maps.google.com/maps?q=rute+KRL+Surabaya"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#2D5F3F] hover:underline transition-colors"
          >
            Lihat Rute KRL →
          </a>
        </>
      )}

      {/* Sparkle pulse keyframe */}
      <style>{`
        @keyframes sparkPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
