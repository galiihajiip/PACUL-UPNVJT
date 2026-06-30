# 🌿 PACUL — Platform Aksi Komunitas Untuk Lingkungan

**3 Sushi Rolls Team · National PEKAN IT Competition 2026**  
**Sub-theme: Social Innovation & Community-Based Applications**

---

## 📖 Tentang PACUL

PACUL (Platform Aksi Komunitas Untuk Lingkungan) adalah platform web progresif (PWA) yang memberdayakan komunitas lokal untuk mengambil tindakan nyata terhadap perubahan iklim. Dengan menggabungkan gamifikasi, AI, dan visualisasi data, PACUL memudahkan masyarakat untuk:

- 📊 **Melacak jejak karbon** dari aktivitas sehari-hari secara personal
- ⚡ **Scan struk listrik PLN** otomatis menggunakan Google Cloud Vision OCR
- 👣 **Menghitung langkah kaki** lewat sensor akselerometer perangkat (mobile)
- 🎯 **Berpartisipasi dalam tantangan aksi hijau** dengan sistem XP & badge
- 🗺️ **Memvisualisasikan dampak lingkungan** per kecamatan melalui peta interaktif
- 🤝 **Berkolaborasi dengan komunitas** melalui dinding kolaborasi berbasis aksi
- 🏛️ **Portal Pemerintah** untuk monitoring laporan sampah dan aksi komunitas

---

## 🚀 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| Charts | Recharts |
| Maps | Leaflet.js + React Leaflet + Google Maps API |
| State Management | Zustand (persisted) |
| Data Fetching | TanStack Query v5 (React Query) |
| HTTP Client | Axios |
| Animations | Framer Motion |
| Form Handling | React Hook Form + Zod |
| OCR | Google Cloud Vision API |
| PWA | next-pwa + Web Push Notifications |
| Auth | Cookie-based middleware (js-cookie) |
| Notifications | Sonner (toast) |
| Image Processing | sharp |
| Linting | ESLint + TypeScript strict |

---

## 🗂️ Struktur Proyek

```
pacul-titiknadir/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Register
│   │   ├── (landing)/          # Landing page publik
│   │   ├── api/
│   │   │   └── ocr/scan-bill/  # Next.js API route — Google Vision OCR
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Dashboard utama
│   │   │   ├── tracker/        # Carbon Tracker
│   │   │   ├── step-tracker/   # Langkah Hijau (pedometer)
│   │   │   ├── eco-action/     # EcoAction & tantangan
│   │   │   ├── map/            # Peta dampak lokal
│   │   │   ├── collaboration/  # Dinding kolaborasi
│   │   │   ├── laporan-sampah/ # Laporan sampah warga
│   │   │   ├── marketplace/    # Green Marketplace
│   │   │   └── profile/        # Profil & pengaturan
│   │   └── gov/                # Portal pemerintah
│   │       ├── login/
│   │       └── dashboard/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui base components
│   │   ├── layout/             # Navbar, Sidebar, Footer
│   │   ├── common/             # ErrorBoundary, shared components
│   │   └── features/           # Feature-specific components
│   │       ├── carbon-tracker/
│   │       ├── dashboard-main/
│   │       ├── eco-action/
│   │       ├── collaboration-wall/
│   │       ├── local-impact-map/
│   │       └── waste-report/
│   ├── store/                  # Zustand state stores
│   ├── services/               # API service layer
│   ├── hooks/                  # Custom React hooks
│   ├── config/                 # Navigation, site config
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utilities & helpers
├── public/
│   ├── icons/                  # PWA icons (72px–512px)
│   ├── manifest.json           # Web App Manifest
│   ├── sw.js                   # Service Worker
│   └── favicon.png
└── ...config files
```

---

## 📋 Fitur Utama

### 1. 🌱 Carbon Tracker
- Input aktivitas harian: transportasi, energi, makanan, belanja
- **Scan struk listrik PLN** otomatis via Google Cloud Vision OCR (AI)
- Visualisasi tren emisi mingguan/bulanan dengan chart interaktif
- Breakdown kategori emisi dengan donut chart
- Rekomendasi AI personal untuk mengurangi emisi

### 2. 👣 Langkah Hijau (Step Tracker)
- Pedometer berbasis sensor akselerometer perangkat mobile
- Low-pass filter untuk menghilangkan gravity, deteksi langkah akurat
- Milestone XP: 1.000 / 5.000 / 10.000 langkah
- Grafik riwayat langkah per jam dan per 7 hari
- Mode simulasi untuk desktop / iOS HTTP

### 3. ⚡ EcoAction
- Tantangan aktif dengan progress tracker dan reward XP
- Leaderboard komunitas
- Green Marketplace untuk penukaran poin XP
- Sistem achievement badge (locked/unlocked)
- Pencapaian personal

### 4. 🗺️ Local Impact Map
- Peta interaktif berbasis Leaflet.js
- Filter berdasarkan kategori aksi (penghijauan, daur ulang, energi, air)
- Visualisasi intensitas dampak per kecamatan di Jawa Timur
- Statistik dan leaderboard distrik

### 5. 🤝 Collaboration Wall
- Feed postingan komunitas dengan engagement (like, komentar)
- Tag badge berdasarkan jenis aksi
- Sidebar anggota aktif dan trending topics

### 6. 🗑️ Laporan Sampah
- Form pelaporan dengan upload foto dan geolokasi Google Maps
- Status tracking laporan (pending, diproses, selesai)

### 7. 📊 Dashboard Utama
- Welcome section dengan counter XP dan level
- KPI cards: total emisi, aksi selesai, poin, rank komunitas
- Grafik emisi mingguan dan tantangan aktif

### 8. 👤 Profil Pengguna
- Avatar, progress bar level XP, statistik personal
- Grid achievement badge
- Edit profil & ganti password

### 9. 🏛️ Portal Pemerintah
- Login khusus akun pemerintah
- Dashboard monitoring laporan sampah dan aktivitas komunitas

---

## 🔑 Environment Variables

Buat file `.env.local` di root project:

```env
# Google Maps (client-side)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY=your_geocoding_api_key

# Google Vision OCR (server-side)
GOOGLE_VISION_API_KEY=your_vision_api_key

# Backend API (opsional — app berjalan tanpa backend)
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

> ⚠️ **Pastikan Cloud Vision API sudah di-enable** di Google Cloud Console untuk key yang digunakan.

---

## 🛠️ Cara Menjalankan

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Instalasi

```bash
# Clone repository
git clone https://github.com/galiihajiip/pacul-titiknadir.git
cd pacul-titiknadir

# Install dependencies
npm install

# Buat file environment
cp .env.example .env.local
# Isi API key di .env.local

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Login Demo

| Mode | Email | Password |
|------|-------|----------|
| Demo | `demo@pacul.app` | `Demo1234!` |
| Tamu | Klik tombol **"Masuk sebagai Tamu"** | — |

### Build Production

```bash
npm run build
npm run start
```

---

## 🎨 Design System

| Token | Warna | Keterangan |
|-------|-------|------------|
| Primary | `#2D5F3F` | Hijau hutan — warna utama |
| Accent | `#7AC74F` | Hijau terang — highlight & CTA |
| Background | `#F5F5F5` | Abu terang — background utama |
| Dark BG | `#1a2e1f` | Hijau gelap — tracker & dark sections |

---

## 📱 PWA

PACUL dapat diinstall sebagai aplikasi di perangkat mobile maupun desktop:

- Manifest lengkap dengan icon 72px – 512px
- Service Worker untuk offline support
- Web Push Notifications
- Orientasi portrait-primary

---

## 👥 3 Sushi Rolls Team

| Nama | Role |
|------|------|
| Galih Aji Pangestu | Lead Developer |
| Nashwa Atika Kusuma Ramadhani | UI/UX Designer |
| Adristha Arshanti Widyadhari | Fullstack Web Developer |

---

## 📄 Lisensi

© 2026 3 Sushi Rolls Team. All rights reserved.  
Built with 💚 for National PEKAN IT Competition 2026 · UPN Veteran Jawa Timur.
