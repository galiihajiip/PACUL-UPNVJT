"use client";

import { ChevronDown } from "lucide-react";

const FILTER_CATEGORIES = ["Energi", "Limbah", "Transportasi", "Pangan"];

const CATEGORY_COLOR: Record<string, string> = {
  Energi: "#F59E0B",
  Limbah: "#10B981",
  Transportasi: "#2D5F3F",
  Pangan: "#7AC74F",
};

const MONTH_OPTIONS = [
  { value: null, label: "Bulan Ini" },
  { value: "Oktober 2026", label: "Oktober 2026" },
  { value: "September 2026", label: "September 2026" },
  { value: "Agustus 2026", label: "Agustus 2026" },
];

export interface MapFiltersProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  activeMonth: string;
  onMonthChange: (month: string) => void;
}

export default function MapFilters({
  activeCategory,
  onCategoryChange,
  activeMonth,
  onMonthChange,
}: MapFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      {/* "Semua" pill */}
      <button
        onClick={() => onCategoryChange(null)}
        className="rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150"
        style={
          activeCategory === null
            ? { backgroundColor: "#2D5F3F", color: "#fff", borderColor: "#2D5F3F" }
            : { backgroundColor: "#fff", color: "#6B7280", borderColor: "#E5E7EB" }
        }
        onMouseEnter={(e) => {
          if (activeCategory !== null) e.currentTarget.style.backgroundColor = "rgba(168,213,186,0.2)";
        }}
        onMouseLeave={(e) => {
          if (activeCategory !== null) e.currentTarget.style.backgroundColor = "#fff";
        }}
      >
        Semua
      </button>

      {/* Category pills */}
      {FILTER_CATEGORIES.map((cat) => {
        const active = activeCategory === cat;
        const color = CATEGORY_COLOR[cat];
        return (
          <button
            key={cat}
            onClick={() => onCategoryChange(active ? null : cat)}
            className="rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150"
            style={
              active
                ? { backgroundColor: color, color: "#fff", borderColor: color }
                : { backgroundColor: "#fff", color: "#6B7280", borderColor: "#E5E7EB" }
            }
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.backgroundColor = "rgba(168,213,186,0.2)";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            {cat}
          </button>
        );
      })}

      {/* Month dropdown */}
      <div className="relative ml-auto">
        <select
          value={activeMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="appearance-none rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 pr-8 text-sm text-gray-600 outline-none focus:border-[#2D5F3F]"
        >
          {MONTH_OPTIONS.map(({ value, label }) => (
            <option key={label} value={value ?? ""}>{label}</option>
          ))}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}
