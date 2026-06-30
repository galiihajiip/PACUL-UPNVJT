import type { Metadata } from "next";
import LaporanSampahClient from "./LaporanSampahClient";

export const metadata: Metadata = {
  title: "Laporan Sampah — PACUL",
  description: "Laporkan masalah sampah di lingkunganmu dengan GPS pin real-time",
};

export default function LaporanSampahPage() {
  return <LaporanSampahClient />;
}
