export interface HouseholdProfile {
  members: 1 | 2 | 3 | 4 | 5 | 6;
  daya: 450 | 900 | 1300 | 2200 | 3500 | 4400 | 5500;
  type: "apartment" | "rumah_kecil" | "rumah_sedang" | "rumah_besar";
}

export const BENCHMARK_DATA: Record<string, number> = {
  "1_450": 50,
  "1_900": 80,
  "2_900": 110,
  "2_1300": 140,
  "3_1300": 170,
  "3_2200": 220,
  "4_1300": 200,
  "4_2200": 260,
  "4_3500": 340,
  "5_2200": 300,
  "5_3500": 400,
  default: 180,
};

export interface BenchmarkResult {
  yourUsage: number;
  averageUsage: number;
  difference: number;
  percentDiff: number;
  status: "sangat_hemat" | "hemat" | "normal" | "boros" | "sangat_boros";
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  statusIcon: string;
  co2Impact: number;
  xpEarned: number;
  message: string;
  tips: string[];
}

export function analyzePowerUsage(
  usage: number,
  profile: HouseholdProfile
): BenchmarkResult {
  const key = `${profile.members}_${profile.daya}`;
  const average = BENCHMARK_DATA[key] ?? BENCHMARK_DATA["default"];

  const diff = usage - average;
  const percentDiff = (diff / average) * 100;

  let status: BenchmarkResult["status"];
  let statusLabel: string;
  let statusColor: string;
  let statusBg: string;
  let statusIcon: string;
  let xpEarned: number;
  let tips: string[];

  if (percentDiff <= -20) {
    status = "sangat_hemat";
    statusLabel = "Sangat Hemat! 🌟";
    statusColor = "#10B981";
    statusBg = "linear-gradient(135deg,#064e3b,#065f46)";
    statusIcon = "🌟";
    xpEarned = 200;
    tips = [
      "Luar biasa! Kamu adalah role model hemat energi di komunitas.",
      "Bagikan tips hematmu di Collaboration Wall!",
      "Pertahankan kebiasaan ini — kamu menghemat emisi nyata setiap bulan.",
    ];
  } else if (percentDiff <= -5) {
    status = "hemat";
    statusLabel = "Di bawah rata-rata — Hemat! ✅";
    statusColor = "#7AC74F";
    statusBg = "linear-gradient(135deg,#14532d,#166534)";
    statusIcon = "✅";
    xpEarned = 100;
    tips = [
      "Pertahankan kebiasaan baikmu!",
      "Coba tantangan hemat listrik 20% bulan depan.",
      "Matikan lampu ruangan yang tidak dipakai untuk hemat lebih lagi.",
    ];
  } else if (percentDiff <= 10) {
    status = "normal";
    statusLabel = "Normal 📊";
    statusColor = "#F59E0B";
    statusBg = "linear-gradient(135deg,#78350f,#92400e)";
    statusIcon = "📊";
    xpEarned = 30;
    tips = [
      "Penggunaanmu sudah normal.",
      "Matikan AC saat ruangan kosong untuk hemat 15% listrik.",
      "Ganti lampu ke LED untuk hemat 8% per bulan.",
    ];
  } else if (percentDiff <= 30) {
    status = "boros";
    statusLabel = "Di atas rata-rata — Perlu Perhatian ⚠️";
    statusColor = "#F97316";
    statusBg = "linear-gradient(135deg,#7c2d12,#9a3412)";
    statusIcon = "⚠️";
    xpEarned = 0;
    tips = [
      "Cek apakah ada alat elektronik yang standby terus.",
      "AC adalah konsumen listrik terbesar — set suhu 24-26°C.",
      "Gunakan timer untuk alat elektronik.",
    ];
  } else {
    status = "sangat_boros";
    statusLabel = "Sangat Boros 🚨";
    statusColor = "#EF4444";
    statusBg = "linear-gradient(135deg,#7f1d1d,#991b1b)";
    statusIcon = "🚨";
    xpEarned = 0;
    tips = [
      "Audit penggunaan listrik segera!",
      "Pertimbangkan ganti kulkas/AC lama ke model hemat energi.",
      "Cek instalasi listrik — mungkin ada kebocoran arus.",
    ];
  }

  const CO2_FACTOR = 0.87;
  const co2Impact = Math.round(diff * CO2_FACTOR * 100) / 100;
  const absPct = Math.abs(percentDiff).toFixed(1);

  return {
    yourUsage: usage,
    averageUsage: average,
    difference: Math.round(diff),
    percentDiff: Math.round(percentDiff * 10) / 10,
    status,
    statusLabel,
    statusColor,
    statusBg,
    statusIcon,
    co2Impact,
    xpEarned,
    message:
      diff < 0
        ? `Kamu hemat ${Math.abs(Math.round(diff))} kWh (${absPct}%) dibanding rata-rata!`
        : `Kamu menggunakan ${Math.round(diff)} kWh (${absPct}%) lebih dari rata-rata.`,
    tips,
  };
}
