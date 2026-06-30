// TODO: Site-wide configuration constants

export const siteConfig = {
  name: "PACUL",
  fullName: "Platform Aksi Komunitas Untuk Lingkungan",
  description:
    "Platform web inovatif yang memberdayakan komunitas lokal dalam mengambil tindakan nyata terhadap perubahan iklim.",
  url: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  mapTileUrl:
    process.env.NEXT_PUBLIC_MAP_TILE_URL ??
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};

export const teamConfig = {
  name: "3 Sushi Rolls Team",
  competition: "National PEKAN IT Competition 2026",
  subTheme: "Lingkungan, Energi, dan Keberlanjutan",
  university: "UPN Veteran Jawa Timur",
  members: [
    { name: "Galih Aji Pangestu", role: "Lead Developer" },
    { name: "Nashwa Atika Kusuma Ramadhani", role: "UI/UX Designer" },
    { name: "Adristha Arshanti Widyadhari", role: "Fullstack Web Developer" },
  ],
} as const;
