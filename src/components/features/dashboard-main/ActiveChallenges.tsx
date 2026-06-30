"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const challenges = [
  {
    id: "1",
    title: "Zero Waste 7 Hari",
    category: "Limbah",
    progress: 71,
    daysLeft: 2,
    xp: 500,
    color: "#10B981",
  },
  {
    id: "2",
    title: "Kurangi Listrik 20%",
    category: "Energi",
    progress: 45,
    daysLeft: 5,
    xp: 350,
    color: "#F59E0B",
  },
  {
    id: "3",
    title: "Naik Transportasi Umum 10x",
    category: "Transportasi",
    progress: 30,
    daysLeft: 8,
    xp: 400,
    color: "#2D5F3F",
  },
];

export default function ActiveChallenges() {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">Tantangan Aktif</h3>
        <Link
          href="/dashboard/eco-action"
          className="flex items-center gap-1 text-xs font-medium text-[#2D5F3F] hover:underline"
        >
          Lihat semua <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {challenges.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
          >
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: `${c.color}15`, color: c.color }}
                >
                  {c.category}
                </span>
                <p className="text-sm font-medium text-[#1A1A1A]">{c.title}</p>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <Clock size={10} />
                {c.daysLeft}h lagi
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: c.color }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-xs font-semibold text-gray-500">
                {c.progress}%
              </span>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: `${c.color}15`, color: c.color }}
              >
                +{c.xp} XP
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
