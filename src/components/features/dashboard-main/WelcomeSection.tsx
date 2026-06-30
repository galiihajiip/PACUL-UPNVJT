"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";
import { getFirstName } from "@/utils/formatters";

export default function WelcomeSection() {
  const userName = useAuthStore((s) => s.user?.name);
  const firstName = getFirstName(userName);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Halo, {firstName}! 👋</h2>
        <p className="mt-1 text-sm text-gray-600">
          Kamu sudah mengurangi <span className="font-semibold text-[#2D5F3F]">12 kg CO₂</span> minggu ini 🍃 Teruskan!
        </p>
      </div>
      <span className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm">
        {today}
      </span>
    </div>
  );
}
