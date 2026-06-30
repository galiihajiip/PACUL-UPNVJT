"use client";

import { useState, memo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";
import type { EmisiData } from "@/types/carbon";

interface TrendEmisiChartProps {
  data: EmisiData[];
  view: "weekly" | "monthly";
  onViewChange: (view: "weekly" | "monthly") => void;
}

const mockWeeklyData: EmisiData[] = [
  { day: "SENIN", value: 45 },
  { day: "SELASA", value: 38 },
  { day: "RABU", value: 52 },
  { day: "KAMIS", value: 28 },
  { day: "JUMAT", value: 61 },
  { day: "SABTU", value: 33 },
  { day: "MINGGU", value: 47 },
];

const mockMonthlyData: EmisiData[] = [
  { month: "Jan", value: 320 },
  { month: "Feb", value: 295 },
  { month: "Mar", value: 410 },
  { month: "Apr", value: 280 },
  { month: "Mei", value: 350 },
  { month: "Jun", value: 390 },
  { month: "Jul", value: 310 },
  { month: "Ags", value: 265 },
  { month: "Sep", value: 430 },
  { month: "Okt", value: 380 },
];

const mockComparisonWeekly = [
  { day: "Sen", kamu: 45, jatim: 55 },
  { day: "Sel", kamu: 38, jatim: 52 },
  { day: "Rab", kamu: 52, jatim: 58 },
  { day: "Kam", kamu: 28, jatim: 50 },
  { day: "Jum", kamu: 61, jatim: 60 },
  { day: "Sab", kamu: 33, jatim: 48 },
  { day: "Min", kamu: 47, jatim: 54 },
];

const TARGET = 380;
const ACTIVE_INDEX = 3;

/* ── Custom Tooltip ── */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#A8D5BA] bg-white px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-[#2D5F3F]">{label}</p>
      <p className="text-gray-600">
        {payload[0].value}{" "}
        <span className="text-gray-400">kg CO₂</span>
      </p>
    </div>
  );
}

const TrendEmisiChart = memo(function TrendEmisiChart({
  data,
  view,
  onViewChange,
}: TrendEmisiChartProps) {
  const chartData =
    data.length > 0
      ? data
      : view === "weekly"
      ? mockWeeklyData
      : mockMonthlyData;

  const xKey = view === "weekly" ? "day" : "month";
  const targetLine = view === "weekly" ? 50 : TARGET;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Main Chart Card ── */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        {/* Card header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1A1A1A]">Trend Emisi</h3>
            <p className="text-xs text-gray-400 mt-0.5">Emisi harian dalam kg CO₂</p>
          </div>
          {/* Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1">
            {(["weekly", "monthly"] as const).map((v) => (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                aria-pressed={view === v}
                className="rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-1"
                style={
                  view === v
                    ? { backgroundColor: "#2D5F3F", color: "#fff" }
                    : { backgroundColor: "transparent", color: "#6b7280" }
                }
              >
                {v === "weekly" ? "Weekly" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div role="img" aria-label={`Grafik batang trend emisi ${view === "weekly" ? "mingguan" : "bulanan"} dalam kg CO₂`}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "kg CO₂",
                angle: -90,
                position: "insideLeft",
                offset: 14,
                style: { fontSize: 9, fill: "#9CA3AF" },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(168,213,186,0.15)" }} />
            <ReferenceLine
              y={targetLine}
              stroke="#EF4444"
              strokeDasharray="6 3"
              label={{
                value: `TARGET: ${targetLine}kg`,
                position: "insideTopRight",
                style: { fontSize: 9, fill: "#EF4444" },
              }}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {chartData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === ACTIVE_INDEX ? "#2D5F3F" : "#A8D5BA"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* ── Comparison Chart Card ── */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1A1A1A]">
            Kamu vs Rata-rata Jawa Timur
          </h4>
          <span className="rounded-full bg-[#A8D5BA]/30 px-2.5 py-0.5 text-[10px] font-medium text-[#2D5F3F]">
            UPDATE TERBARU: 26 OKT
          </span>
        </div>

        <div role="img" aria-label="Grafik perbandingan trend emisi kamu vs rata-rata Jawa Timur">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={mockComparisonWeekly}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 9, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                border: "1px solid #A8D5BA",
                borderRadius: 8,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="kamu"
              name="Kamu"
              stroke="#2D5F3F"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="jatim"
              name="Rata-rata Jatim"
              stroke="#A8D5BA"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

export default TrendEmisiChart;
