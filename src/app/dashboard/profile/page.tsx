import type { Metadata } from "next";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "Profile — PACUL",
  description: "Lihat progres CO₂ yang telah kamu hemat, badge pencapaian, dan riwayat aktivitas hijau komunitasmu.",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}

