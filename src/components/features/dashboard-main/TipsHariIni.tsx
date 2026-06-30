"use client";

import { Lightbulb } from "lucide-react";

const tips = [
  {
    text: "Cabut pengisi daya ponsel saat tidak digunakan untuk mengurangi 1% emisi harianmu.",
    impact: "Potensi hemat: 0.3 kg CO₂/hari",
  },
  {
    text: "Ganti perjalanan pendek di bawah 2 km dengan berjalan kaki atau bersepeda.",
    impact: "Potensi hemat: 0.8 kg CO₂/perjalanan",
  },
  {
    text: "Kurangi konsumsi daging merah 2x seminggu untuk menekan emisi dari sektor pangan.",
    impact: "Potensi hemat: 1.2 kg CO₂/minggu",
  },
  {
    text: "Matikan lampu dan perangkat listrik saat meninggalkan ruangan.",
    impact: "Potensi hemat: 0.5 kg CO₂/hari",
  },
  {
    text: "Pilih produk lokal saat berbelanja untuk mengurangi jejak karbon transportasi.",
    impact: "Potensi hemat: 0.4 kg CO₂/belanja",
  },
  {
    text: "Gunakan tas belanja kain agar tidak perlu kantong plastik sekali pakai.",
    impact: "Potensi hemat: 0.1 kg CO₂/hari",
  },
  {
    text: "Atur suhu AC di 25°C dan bersihkan filter secara rutin untuk efisiensi energi.",
    impact: "Potensi hemat: 0.6 kg CO₂/hari",
  },
];

export default function TipsHariIni() {
  const dayIndex = new Date().getDay();
  const tip = tips[dayIndex % tips.length];

  return (
    <div
      className="rounded-[12px] border p-4"
      style={{
        backgroundColor: "rgba(245,158,11,0.05)",
        borderColor: "rgba(245,158,11,0.20)",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb size={15} className="shrink-0 text-[#F59E0B]" />
        <h3 className="text-sm font-semibold text-[#1A1A1A]">Tips Hari Ini</h3>
      </div>

      <p className="text-sm leading-relaxed text-gray-600">{tip.text}</p>

      <p className="mt-2 text-xs font-semibold text-[#F59E0B]">{tip.impact}</p>
    </div>
  );
}
