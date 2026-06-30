"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Star } from "lucide-react";
import { useUserStore } from "@/store/userStore";

const PREVIEW_ITEMS = [
  "🥦 Voucher Organik",
  "🌱 Indoor Plant",
  "🚌 Suroboyo Bus",
];

export function MarketplaceCTA() {
  const xp = useUserStore((s) => s.xp);

  return (
    <div className="rounded-[12px] bg-gradient-to-r from-[#2D5F3F] to-[#1a3d27] p-6 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-2">
              <ShoppingBag size={22} className="text-[#7AC74F]" />
            </div>
            <h3 className="text-lg font-bold">Green Marketplace 🌱</h3>
          </div>

          <p className="mb-3 text-sm text-white/70">
            Tukarkan EcoPoints kamu dengan voucher dan reward dari partner PACUL.
          </p>

          <div className="mb-4 flex items-center gap-2">
            <Star size={14} className="text-[#7AC74F]" />
            <span className="text-sm font-medium">
              Saldo kamu:{" "}
              <span className="font-bold text-[#7AC74F]">
                {xp.toLocaleString("id-ID")} XP
              </span>
            </span>
          </div>

          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 rounded-lg bg-[#7AC74F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6ab344]"
          >
            Lihat Semua Reward
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Decorative voucher preview — hidden on small screens */}
        <div className="hidden flex-col gap-2 md:flex shrink-0">
          {PREVIEW_ITEMS.map((item, i) => (
            <div
              key={i}
              className="whitespace-nowrap rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/80"
            >
              {item}
            </div>
          ))}
          <p className="text-center text-xs text-white/50">+5 lainnya →</p>
        </div>
      </div>
    </div>
  );
}
