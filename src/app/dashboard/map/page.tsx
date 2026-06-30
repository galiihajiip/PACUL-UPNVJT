import type { Metadata } from "next";
import MapPageClient from "./MapPageClient";

export const metadata: Metadata = {
  title: "Local Impact Map — PACUL",
  description: "Visualisasikan distribusi dampak aksi komunitas per wilayah di Jawa Timur dengan peta spasial interaktif.",
};

export default function MapPage() {
  return <MapPageClient />;
}
