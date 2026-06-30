"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Zap, Map, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureCard {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  accentColor: string;
  title: string;
  description: string;
  href: string;
}

const CARDS: FeatureCard[] = [
  {
    icon: Activity,
    iconColor: "#2D5F3F",
    iconBg: "rgba(168,213,186,0.3)",
    accentColor: "#2D5F3F",
    title: "Carbon Tracker",
    description:
      "Monitor jejak karbon komunitasmu secara real-time dengan grafik interaktif dan perbandingan rata-rata Jawa Timur.",
    href: "/dashboard/tracker",
  },
  {
    icon: Zap,
    iconColor: "#7AC74F",
    iconBg: "rgba(122,199,79,0.2)",
    accentColor: "#7AC74F",
    title: "EcoAction",
    description:
      "Upload bukti aksi hijau, dapatkan XP, dan redeem reward di Green Marketplace melalui sistem gamifikasi terukur.",
    href: "/dashboard/eco-action",
  },
  {
    icon: Map,
    iconColor: "#10B981",
    iconBg: "rgba(16,185,129,0.2)",
    accentColor: "#10B981",
    title: "Local Impact Map",
    description:
      "Visualisasikan distribusi dampak aksi komunitas per wilayah di Jawa Timur dengan peta spasial interaktif.",
    href: "/dashboard/map",
  },
  {
    icon: Users,
    iconColor: "#F59E0B",
    iconBg: "rgba(245,158,11,0.2)",
    accentColor: "#F59E0B",
    title: "Collaboration Wall",
    description:
      "Bagikan ide, koordinasikan gerakan, dan diskusikan aksi bersama komunitas dalam forum terstruktur berbasis aksi.",
    href: "/dashboard/collaboration",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function FeatureCards() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:px-[120px] md:py-20">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold text-[#2D5F3F] md:text-[28px]">
          Satu Platform, Empat Kekuatan
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-gray-500 leading-relaxed">
          PACUL mengintegrasikan empat modul yang saling terhubung untuk aksi
          komunitas yang terukur
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card, i) => (
          <FeatureCardItem key={card.title} card={card} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureCardItem({
  card,
  index,
}: {
  card: FeatureCard;
  index: number;
}) {
  const { icon: Icon, iconColor, iconBg, accentColor, title, description, href } =
    card;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="group flex flex-col rounded-[12px] border border-[#E5E7EB] bg-white p-7 transition-all duration-[250ms] ease-in-out hover:-translate-y-1 hover:border-[#A8D5BA] hover:shadow-[0_8px_24px_rgba(0,0,0,0.09)]"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      {/* Icon */}
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={24} style={{ color: iconColor }} />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-bold text-[#1A1A1A]">{title}</h3>

      {/* Description */}
      <p className="flex-1 text-sm leading-relaxed text-gray-500">{description}</p>

      {/* Link */}
      <Link
        href={href}
        className="mt-5 inline-flex items-center text-sm font-semibold transition-colors"
        style={{ color: accentColor }}
      >
        Pelajari{" "}
        <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </motion.div>
  );
}
