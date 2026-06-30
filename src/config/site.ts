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
