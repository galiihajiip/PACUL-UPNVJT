import Link from "next/link";
import Image from "next/image";
import { Github, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { teamConfig } from "@/config/site";

const FEATURE_LINKS = [
  { label: "Carbon Tracker", href: "/dashboard/tracker" },
  { label: "EcoAction", href: "/dashboard/eco-action" },
  { label: "Local Impact Map", href: "/dashboard/map" },
  { label: "Collaboration Wall", href: "/dashboard/collaboration" },
  { label: "Dashboard", href: "/dashboard" },
];

const ABOUT_LINKS = [
  { label: "Tentang PACUL", href: "#" },
  { label: teamConfig.competition, href: "#" },
  { label: `Subtema: ${teamConfig.subTheme}`, href: "#" },
  { label: teamConfig.name, href: "#" },
  { label: teamConfig.university, href: "#" },
];

const SDGS = [
  { label: "SDGs 7", color: "#F59E0B" },
  { label: "SDGs 11", color: "#10B981" },
  { label: "SDGs 13", color: "#7AC74F" },
];

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com/galiihajiip/pacul-titiknadir", label: "GitHub" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const linkClass =
  "text-sm text-white/70 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer
      className="w-full border-t border-white/10"
      style={{ backgroundColor: "#1a3d27" }}
    >
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 md:px-[120px] md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center w-fit">
              <Image src="/logo-white.png" alt="PACUL" width={120} height={40} className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm italic text-white/60 leading-relaxed">
              &ldquo;Ubah Aksi Jadi Dampak Nyata&rdquo;
            </p>
            <p className="text-xs text-white/50 leading-relaxed">
              Platform Aksi Kolektif untuk Lingkungan<br />
              {teamConfig.university} · Jawa Timur
            </p>
            <p className="text-[11px] font-medium text-white/40">
              {teamConfig.competition}
            </p>
            <p className="text-[11px] text-white/35">
              Subtema: {teamConfig.subTheme}
            </p>
            {/* SDGs badges */}
            <div className="flex flex-wrap gap-2 mt-1">
              {SDGS.map(({ label, color }) => (
                <span
                  key={label}
                  className="rounded-full px-3 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: `${color}22`,
                    color,
                    border: `1px solid ${color}44`,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2 — Fitur */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">Fitur</h4>
            <ul className="flex flex-col gap-2">
              {FEATURE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Tim */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">{teamConfig.name}</h4>
            <ul className="flex flex-col gap-2.5">
              {teamConfig.members.map((member) => (
                <li key={member.name} className="text-sm text-white/70">
                  <p className="font-medium text-white/85">{member.name}</p>
                  <p className="text-xs text-white/50">{member.role}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Tentang */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">Tentang</h4>
            <ul className="flex flex-col gap-2">
              {ABOUT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Kontak */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white">Kontak</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:pacul@upnjatim.ac.id"
                  className={`flex items-center gap-2 ${linkClass}`}
                >
                  <Mail size={14} className="shrink-0" />
                  pacul@upnjatim.ac.id
                </a>
              </li>
              <li>
                <span className={`flex items-center gap-2 ${linkClass}`}>
                  <MapPin size={14} className="shrink-0" />
                  Surabaya, Jawa Timur
                </span>
              </li>
            </ul>
            {/* Social links */}
            <div className="mt-2 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/50 sm:flex-row sm:gap-3 sm:px-6 md:px-[120px]">
          <p>© 2026 PACUL — {teamConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="cursor-default text-white/40">Privacy Policy</span>
            <span className="text-white/20">|</span>
            <span className="cursor-default text-white/40">Terms of Use</span>
          </div>
          <p>Made with 💚 for {teamConfig.competition}</p>
        </div>
      </div>
    </footer>
  );
}
