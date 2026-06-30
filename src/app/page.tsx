import type { Metadata } from "next";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import PageWrapper from "@/components/common/PageWrapper";
import HeroSection from "@/components/features/dashboard-main/HeroSection";
import FeatureCards from "@/components/features/dashboard-main/FeatureCards";
import StatsSection from "@/components/features/dashboard-main/StatsSection";
import CTABlocks from "@/components/features/dashboard-main/CTABlocks";

export const metadata: Metadata = {
  title: "PACUL — Platform Aksi Kolektif untuk Lingkungan",
  description:
    "Berdayakan komunitasmu dengan platform berbasis data untuk memantau, berkolaborasi, dan mempercepat transisi energi hijau di Indonesia.",
};

export default function HomePage() {
  return (
    <LayoutWrapper>
      <PageWrapper>
        <HeroSection />
        <FeatureCards />
        <StatsSection />
        <CTABlocks />
      </PageWrapper>
    </LayoutWrapper>
  );
}
