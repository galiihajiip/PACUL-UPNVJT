"use client";

import { useState } from "react";
import Link from "next/link";

const PALETTE = ["#2D5F3F", "#7AC74F", "#10B981", "#F59E0B", "#2D8B56", "#A8D5BA", "#5B9E2A", "#1a3d27", "#6EBF8B", "#3D7A56"];

const members = [
  { initials: "DL", name: "Dewi Lestari" },
  { initials: "RH", name: "Rian Hidayat" },
  { initials: "SA", name: "Siti Aminah" },
  { initials: "AP", name: "Aditya Pratama" },
  { initials: "BS", name: "Budi Santoso" },
  { initials: "NN", name: "Nadia Noor" },
  { initials: "FZ", name: "Fajar Zakaria" },
  { initials: "LR", name: "Luna Rahayu" },
  { initials: "MK", name: "Muhammad Karim" },
  { initials: "YS", name: "Yuni Setiawati" },
];

export default function AnggotaAktif() {
  const [tooltip, setTooltip] = useState<string | null>(null);

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">👥 Anggota Aktif</h3>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ backgroundColor: "rgba(16,185,129,0.10)", color: "#10B981" }}
        >
          142 online
        </span>
      </div>

      {/* 5×2 avatar grid */}
      <div className="grid grid-cols-5 gap-3">
        {members.map((m, i) => (
          <div key={m.initials} className="relative flex justify-center">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white transition-transform hover:scale-110"
              style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
              onMouseEnter={() => setTooltip(m.name)}
              onMouseLeave={() => setTooltip(null)}
            >
              {m.initials}
            </button>

            {/* Tooltip */}
            {tooltip === m.name && (
              <div className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1A1A1A] px-2 py-1 text-[10px] font-medium text-white shadow-lg">
                {m.name}
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer link */}
      <Link
        href="/dashboard/collaboration"
        className="mt-4 block w-full text-center text-sm font-medium text-[#2D5F3F] hover:underline transition-colors"
      >
        Lihat Semua Anggota →
      </Link>
    </div>
  );
}
