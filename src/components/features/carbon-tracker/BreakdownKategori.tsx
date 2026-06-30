"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

/* ── Data — value is actual kg CO₂ per category ── */
const breakdownData = [
  { name: "Energi",        value: 225, color: "#F59E0B", pct: 50 },
  { name: "Transportasi",  value: 135, color: "#2D5F3F", pct: 30 },
  { name: "Pangan",        value:  54, color: "#7AC74F", pct: 12 },
  { name: "Limbah",        value:  36, color: "#10B981", pct:  8 },
];

const TOTAL = breakdownData.reduce((sum, d) => sum + d.value, 0);

/* ── Custom Tooltip ── */
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: typeof breakdownData[number] }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-[#1A1A1A]">{item.name}</p>
      <p className="text-gray-600">{item.value} kg CO₂</p>
      <p className="text-gray-400">{item.pct}% dari total</p>
    </div>
  );
}

export default function BreakdownKategori() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <h3 className="mb-4 text-sm font-semibold text-[#1A1A1A]">Breakdown Kategori</h3>

      {/* Chart + center overlay */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={breakdownData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={88}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              animationBegin={0}
              animationDuration={900}
              labelLine={false}
            >
              {breakdownData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="white" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text — CSS overlay, renders exactly once */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[22px] font-bold leading-none text-[#1A1A1A]">{TOTAL}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">kg CO₂</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <ul className="mt-3 flex flex-col gap-2">
        {breakdownData.map(({ name, value, color, pct }) => (
          <li key={name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[#1A1A1A]">{name}</span>
            </div>
            <div className="text-right">
              <span className="font-medium text-[#1A1A1A]">{value} kg</span>
              <span className="ml-1.5 text-xs text-gray-400">{pct}%</span>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
