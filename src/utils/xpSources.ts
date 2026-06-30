export const XP_SOURCES = {
  ADD_EMISSION:            { amount: 25,  label: "Aktivitas dicatat" },
  UPLOAD_PROOF:            { amount: 50,  label: "Bukti aksi diupload" },
  CHALLENGE_JOIN:          { amount: 10,  label: "Bergabung tantangan" },
  CHALLENGE_COMPLETE:      { amount: 150, label: "Tantangan diselesaikan" },
  STEP_1000:               { amount: 10,  label: "1.000 langkah pertama" },
  STEP_5000:               { amount: 50,  label: "5.000 langkah hari ini" },
  STEP_10000:              { amount: 100, label: "Target 10.000 langkah!" },
  ELECTRICITY_HEMAT:       { amount: 100, label: "Listrik hemat bulan ini" },
  ELECTRICITY_SANGAT_HEMAT:{ amount: 200, label: "Listrik sangat hemat!" },
  WASTE_REPORT:            { amount: 50,  label: "Laporan sampah dikirim" },
  SCAN_STRUK:              { amount: 30,  label: "Struk listrik discan" },
  DAILY_LOGIN:             { amount: 5,   label: "Login harian" },
} as const;

export type XPSourceKey = keyof typeof XP_SOURCES;
