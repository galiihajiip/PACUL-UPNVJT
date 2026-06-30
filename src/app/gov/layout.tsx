import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Pemerintah — PACUL",
  description: "Dashboard administrasi pengelolaan laporan sampah Kota Surabaya",
};

export default function GovLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F1A2E] text-white">
      {children}
    </div>
  );
}
