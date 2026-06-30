"use client";

import { motion } from "framer-motion";

const AVATAR_COLORS = ["#2D5F3F", "#7AC74F", "#10B981"];

const events = [
  { name: "Webinar Carbon Credit", date: "12 Nov 2026", mode: "Online" },
  { name: "Workshop Urban Farming", date: "15 Nov 2026", mode: "Offline" },
];

export default function InitiatifUnggulan() {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-[#1A1A1A]">🚀 Inisiatif Unggulan</h3>

      {/* Featured initiative card */}
      <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FFF9] p-4">
        <p className="text-sm font-semibold text-[#1A1A1A]">Kompos Komunal Gubeng</p>
        <p className="mt-0.5 text-xs text-gray-500">Mengolah 500kg sampah organik/minggu</p>

        {/* Progress */}
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span className="font-semibold text-[#2D5F3F]">65%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "65%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-[#2D5F3F]"
            />
          </div>
          <p className="mt-1 text-[10px] text-gray-400">65% target tercapai</p>
        </div>

        {/* Members avatar stack */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {AVATAR_COLORS.map((color, i) => (
              <span
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {["DL", "RH", "SA"][i]}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">142 anggota</span>
        </div>

        <button
          className="mt-3 w-full rounded-md py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2D5F3F" }}
        >
          Bergabung
        </button>
      </div>

      {/* Upcoming events */}
      <div className="mt-4">
        <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          📅 Upcoming Events
        </p>
        <ul className="flex flex-col divide-y divide-[#F3F4F6]">
          {events.map((ev) => (
            <li key={ev.name} className="flex items-center justify-between py-2.5">
              <div className="min-w-0 pr-2">
                <p className="truncate text-xs font-medium text-[#1A1A1A]">{ev.name}</p>
                <p className="text-[10px] text-gray-400">{ev.date}</p>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={
                  ev.mode === "Online"
                    ? { backgroundColor: "rgba(16,185,129,0.10)", color: "#10B981" }
                    : { backgroundColor: "rgba(245,158,11,0.10)", color: "#F59E0B" }
                }
              >
                {ev.mode}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
