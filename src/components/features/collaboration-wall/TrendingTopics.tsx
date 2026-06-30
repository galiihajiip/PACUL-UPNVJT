"use client";

import { motion } from "framer-motion";

const topics = [
  { tag: "#KalimasBersih", desc: "1,240 aksi dilakukan minggu ini" },
  { tag: "#SuroboyoCycling", desc: "860 kilometer ditempuh komunitas" },
  { tag: "#SolarPanelSurabaya", desc: "Trending di sektor energi terbarukan" },
  { tag: "#ZeroWasteGubeng", desc: "320 peserta aktif" },
  { tag: "#TransportasiHijau", desc: "580 perjalanan KRL tercatat" },
];

export default function TrendingTopics() {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-[#1A1A1A]">#️⃣ Trending Topics</h3>
      <ul className="flex flex-col gap-3">
        {topics.map((t, i) => (
          <motion.li
            key={t.tag}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
            className="flex items-start gap-3"
          >
            <span className="w-5 shrink-0 text-right text-lg font-bold leading-tight text-gray-200">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p
                className="cursor-pointer text-sm font-medium text-[#2D5F3F] hover:underline"
              >
                {t.tag}
              </p>
              <p className="text-xs text-gray-400">{t.desc}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
