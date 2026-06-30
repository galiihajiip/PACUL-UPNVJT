import type { Metadata } from "next";
import TrackerPageClient from "./TrackerPageClient";

export const metadata: Metadata = {
  title: "Carbon Tracker — PACUL",
  description: "Monitor jejak karbon harianmu secara real-time dengan grafik interaktif dan perbandingan rata-rata Jawa Timur.",
};

export default function TrackerPage() {
  return <TrackerPageClient />;
}
