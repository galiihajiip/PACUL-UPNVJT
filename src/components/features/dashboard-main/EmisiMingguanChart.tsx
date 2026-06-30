"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const weeklyEmisi = [
  { day: "SEN", value: 42 },
  { day: "SEL", value: 38 },
  { day: "RAB", value: 55 },
  { day: "KAM", value: 29 },
  { day: "JUM", value: 63 },
  { day: "SAB", value: 31 },
  { day: "MIN", value: 45 },
];

const periodOptions = ["Minggu ini", "Minggu lalu", "2 minggu lalu"];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-semibold text-[#1A1A1A]">{label}</p>
      <p className="text-xs text-[#2D5F3F]">
        {payload[0].value}{" "}
        <span className="text-gray-400">kg CO₂</span>
      </p>
    </div>
  );
}

export default function EmisiMingguanChart() {
  const [period, setPeriod] = useState("Minggu ini");
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#1A1A1A]">Emisi Mingguan</h3>
          <p className="mt-0.5 text-xs text-gray-400">Laporan jejak karbon 7 hari terakhir</p>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm hover:border-[#2D5F3F] hover:text-[#2D5F3F] transition-colors"
          >
            {period}
            <span className="text-[10px]">▾</span>
          </button>

          {open && (
            <ul className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-lg">
              {periodOptions.map((opt) => (
                <li key={opt}>
                  <button
                    onClick={() => { setPeriod(opt); setOpen(false); }}
                    className="w-full px-3 py-2 text-left text-xs text-gray-600 hover:bg-[#F3F4F6] hover:text-[#2D5F3F]"
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={weeklyEmisi}
          margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
        >
          <defs>
            <linearGradient id="emisiGradMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D5F3F" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#2D5F3F" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines only */}
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke="#F3F4F6"
            strokeDasharray=""
          />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y-axis hidden */}
          <YAxis hide />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#2D5F3F"
            strokeWidth={2}
            fill="url(#emisiGradMain)"
            dot={{ r: 3, fill: "#2D5F3F", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#2D5F3F", strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
