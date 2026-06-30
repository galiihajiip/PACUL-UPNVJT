"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Sen", emisi: 4.2 },
  { day: "Sel", emisi: 3.8 },
  { day: "Rab", emisi: 5.1 },
  { day: "Kam", emisi: 3.2 },
  { day: "Jum", emisi: 2.9 },
  { day: "Sab", emisi: 1.8 },
  { day: "Min", emisi: 2.4 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-[#1A1A1A]">{label}</p>
      <p className="text-[#2D5F3F]">
        {payload[0].value} <span className="text-gray-400">ton CO₂</span>
      </p>
    </div>
  );
}

export default function WeeklyChart() {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#1A1A1A]">Emisi Mingguan</h3>
          <p className="text-xs text-gray-400">7 hari terakhir · ton CO₂</p>
        </div>
        <span className="rounded-full bg-[#2D5F3F]/10 px-2.5 py-1 text-xs font-semibold text-[#2D5F3F]">
          Minggu Ini
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="emisiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2D5F3F" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2D5F3F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="emisi"
            stroke="#2D5F3F"
            strokeWidth={2}
            fill="url(#emisiGrad)"
            dot={{ r: 4, fill: "#2D5F3F", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#2D5F3F" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
