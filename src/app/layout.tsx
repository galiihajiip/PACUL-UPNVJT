import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/common/providers";
import { PWAInstallBanner } from "@/components/common/PWAInstallBanner";
import "@/styles/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PACUL — Platform Aksi Kolektif untuk Lingkungan",
  description:
    "Platform web inovatif yang memberdayakan komunitas lokal dalam mengambil tindakan nyata terhadap perubahan iklim. Lacak jejak karbon, ikuti tantangan hijau, dan berkolaborasi bersama komunitas.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "PACUL" },
};

export const viewport = {
  themeColor: "#2D5F3F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <Providers>{children}</Providers>
        <PWAInstallBanner />
      </body>
    </html>
  );
}
