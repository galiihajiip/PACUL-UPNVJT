"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart2, Trophy, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CTABlock {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  accentColor: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonBg: string;
  href: string;
}

const BLOCKS: CTABlock[] = [
  {
    icon: BarChart2,
    iconColor: "#2D5F3F",
    iconBg: "rgba(45,95,63,0.1)",
    accentColor: "#2D5F3F",
    title: "Daftar & Pantau Emisimu",
    description:
      "Mulai track jejak karbon harianmu dan lihat progres bersama komunitas.",
    buttonLabel: "Mulai Sekarang",
    buttonBg: "#2D5F3F",
    href: "/dashboard",
  },
  {
    icon: Trophy,
    iconColor: "#7AC74F",
    iconBg: "rgba(122,199,79,0.1)",
    accentColor: "#7AC74F",
    title: "Ikuti Tantangan Hijau",
    description:
      "Selesaikan misi, kumpulkan XP, dan bersaing di leaderboard komunitas.",
    buttonLabel: "Ikut Tantangan",
    buttonBg: "#7AC74F",
    href: "/dashboard/eco-action",
  },
  {
    icon: Globe,
    iconColor: "#10B981",
    iconBg: "rgba(16,185,129,0.1)",
    accentColor: "#10B981",
    title: "Lihat Dampak Nyata",
    description:
      "Pantau kontribusi wilayahmu di peta interaktif Jawa Timur.",
    buttonLabel: "Lihat Peta",
    buttonBg: "#10B981",
    href: "/dashboard/map",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function CTABlocks() {
  return (
    <section className="w-full bg-[#F5F5F5] px-4 py-6 sm:px-6 sm:py-12 md:px-[120px] md:py-20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {BLOCKS.map((block, i) => (
          <CTACard key={block.title} block={block} index={i} />
        ))}
      </div>
    </section>
  );
}

function CTACard({ block, index }: { block: CTABlock; index: number }) {
  const {
    icon: Icon,
    iconColor,
    iconBg,
    accentColor,
    title,
    description,
    buttonLabel,
    buttonBg,
    href,
  } = block;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="group flex flex-col rounded-[12px] bg-white p-8 shadow-sm transition-all duration-[250ms] ease-in-out hover:-translate-y-1 hover:shadow-md"
      style={{ borderLeft: `4px solid ${accentColor}` }}
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
      <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500">
        {description}
      </p>

      {/* Button */}
      <Link
        href={href}
        className="inline-block w-fit rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: buttonBg }}
      >
        {buttonLabel}
      </Link>
    </motion.div>
  );
}
