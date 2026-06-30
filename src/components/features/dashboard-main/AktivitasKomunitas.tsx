"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/* ── Types ── */
type ActivityType = "tree" | "challenge" | "community" | "upload" | "badge";

interface Activity {
  id: string;
  user: string;
  initials: string;
  action: string;
  timeAgo: string;
  type: ActivityType;
  xp: number;
}

/* ── Mock seed data ── */
const seedData: Activity[] = [
  {
    id: "1",
    user: "Siti Aminah",
    initials: "SA",
    action: "menanam 5 bibit pohon di Taman Bungkul",
    timeAgo: "2 jam lalu",
    type: "tree",
    xp: 75,
  },
  {
    id: "2",
    user: "Rian Hidayat",
    initials: "RH",
    action: "menyelesaikan tantangan Bebas Plastik 7 Hari",
    timeAgo: "4 jam lalu",
    type: "challenge",
    xp: 150,
  },
  {
    id: "3",
    user: "Dewi Lestari",
    initials: "DL",
    action: "bergabung komunitas Wonokromo Green Team",
    timeAgo: "Kemarin, 16:30",
    type: "community",
    xp: 25,
  },
  {
    id: "4",
    user: "Budi Santoso",
    initials: "BS",
    action: "upload bukti penghematan listrik 20%",
    timeAgo: "Kemarin, 10:00",
    type: "upload",
    xp: 120,
  },
  {
    id: "5",
    user: "Ayu Rahayu",
    initials: "AR",
    action: "mendapatkan badge Tree King",
    timeAgo: "2 hari lalu",
    type: "badge",
    xp: 50,
  },
];

/* ── Poll pool ── */
const pollPool: Omit<Activity, "id" | "timeAgo">[] = [
  { user: "Fajar Zakaria", initials: "FZ", action: "menyelesaikan tantangan Hemat Listrik", type: "challenge", xp: 200 },
  { user: "Nadia Noor", initials: "NN", action: "menanam 3 bibit pohon di Kebun Raya", type: "tree", xp: 60 },
  { user: "Muhammad Karim", initials: "MK", action: "bergabung komunitas Gubeng EcoTeam", type: "community", xp: 25 },
  { user: "Luna Rahayu", initials: "LR", action: "upload bukti zero waste minggu ini", type: "upload", xp: 130 },
  { user: "Yuni Setiawati", initials: "YS", action: "mendapatkan badge Green Warrior", type: "badge", xp: 80 },
];

/* ── Config maps ── */
const TYPE_ICON: Record<ActivityType, string> = {
  tree: "🌱",
  challenge: "🏆",
  community: "👥",
  upload: "📸",
  badge: "🎖️",
};

const TYPE_AVATAR_COLOR: Record<ActivityType, string> = {
  tree: "#10B981",
  challenge: "#F59E0B",
  community: "#2D5F3F",
  upload: "#7AC74F",
  badge: "#F4A261",
};

let pollCounter = 100;

export default function AktivitasKomunitas() {
  const [items, setItems] = useState<Activity[]>(seedData);

  useEffect(() => {
    const timer = setInterval(() => {
      const pick = pollPool[Math.floor(Math.random() * pollPool.length)];
      const newItem: Activity = {
        ...pick,
        id: String(++pollCounter),
        timeAgo: "Baru saja",
      };
      setItems((prev) => [newItem, ...prev].slice(0, 8));
    }, 30_000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">Aktivitas Komunitas Terkini</h3>
        <Link
          href="/dashboard/collaboration"
          className="flex items-center gap-1 text-xs font-medium text-[#2D5F3F] hover:underline"
        >
          Lihat semua <ArrowRight size={11} />
        </Link>
      </div>

      <ul className="flex flex-col">
        <AnimatePresence initial={false}>
          {items.map((act) => (
            <motion.li
              key={act.id}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              layout
              className="group flex cursor-default items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50"
            >
              {/* Avatar */}
              <span
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: TYPE_AVATAR_COLOR[act.type] }}
              >
                {act.initials}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] leading-none shadow-sm">
                  {TYPE_ICON[act.type]}
                </span>
              </span>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-[#1A1A1A]">
                  <span className="font-semibold">{act.user}</span>{" "}
                  <span className="text-gray-700">{act.action}</span>
                </p>
                <p className="mt-0.5 text-[10px] text-gray-400">{act.timeAgo}</p>
              </div>

              {/* XP badge */}
              <span className="shrink-0 rounded-full bg-[#F4A261]/10 px-2 py-0.5 text-[10px] font-semibold text-[#F4A261]">
                +{act.xp} XP
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
