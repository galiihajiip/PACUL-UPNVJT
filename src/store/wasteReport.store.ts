import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WasteCategory = "sampah_menumpuk" | "tpa_liar" | "sampah_sungai" | "sampah_jalan" | "b3_berbahaya";
export type WasteSeverity = "rendah" | "sedang" | "tinggi" | "kritis";
export type WasteStatus = "dilaporkan" | "diproses" | "selesai" | "ditolak";

export interface WasteReport {
  id: string;
  userId?: string;
  title: string;
  description: string;
  category: WasteCategory;
  severity: WasteSeverity;
  lat: number;
  lng: number;
  address: string;
  district: string;
  photoUrls: string[];
  status: WasteStatus;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  xpAwarded: number;
  upvotes: number;
  isUpvotedByMe?: boolean;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_CONFIG: Record<WasteCategory, { emoji: string; label: string }> = {
  sampah_menumpuk: { emoji: "🗑️", label: "Sampah Menumpuk" },
  tpa_liar:        { emoji: "🏚️", label: "TPA Liar" },
  sampah_sungai:   { emoji: "🌊", label: "Sampah Sungai" },
  sampah_jalan:    { emoji: "🛣️", label: "Sampah Jalan" },
  b3_berbahaya:    { emoji: "☣️", label: "Limbah B3" },
};

export const SEVERITY_CONFIG: Record<WasteSeverity, { color: string; bg: string; label: string; emoji: string }> = {
  rendah:  { color: "#16a34a", bg: "#dcfce7", label: "Rendah",  emoji: "🟢" },
  sedang:  { color: "#ca8a04", bg: "#fef9c3", label: "Sedang",  emoji: "🟡" },
  tinggi:  { color: "#ea580c", bg: "#ffedd5", label: "Tinggi",  emoji: "🟠" },
  kritis:  { color: "#dc2626", bg: "#fee2e2", label: "Kritis",  emoji: "🔴" },
};

export const STATUS_CONFIG: Record<WasteStatus, { color: string; bg: string; label: string }> = {
  dilaporkan: { color: "#2563eb", bg: "#dbeafe", label: "Dilaporkan" },
  diproses:   { color: "#d97706", bg: "#fef3c7", label: "Diproses"   },
  selesai:    { color: "#16a34a", bg: "#dcfce7", label: "Selesai"    },
  ditolak:    { color: "#dc2626", bg: "#fee2e2", label: "Ditolak"    },
};

const now = new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400_000).toISOString();

export const MOCK_REPORTS: WasteReport[] = [
  { id: "r1", title: "Timbunan sampah besar di pinggir Jl. Diponegoro", description: "Ada tumpukan sampah setinggi 1 meter lebih di bahu jalan, sudah seminggu tidak diangkut. Bau sangat menyengat.", category: "sampah_menumpuk", severity: "tinggi", lat: -7.2651, lng: 112.7379, address: "Jl. Diponegoro, Darmo, Surabaya", district: "Darmo", photoUrls: [], status: "diproses", assignedTo: "Dinas Kebersihan Wonokromo", xpAwarded: 50, upvotes: 14, reportedBy: "Aditya P.", createdAt: daysAgo(3), updatedAt: daysAgo(1) },
  { id: "r2", title: "TPA liar di tepi Kali Mas belakang pasar", description: "Warga membuang sampah sembarangan di tepi sungai, mengancam ekosistem air dan kesehatan.", category: "sampah_sungai", severity: "kritis", lat: -7.2450, lng: 112.7380, address: "Kali Mas, Semampir, Surabaya", district: "Semampir", photoUrls: [], status: "dilaporkan", xpAwarded: 50, upvotes: 22, reportedBy: "Siti R.", createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: "r3", title: "Sampah plastik menumpuk di area Taman Bungkul", description: "Setelah weekend, banyak sampah berserakan di sekitar taman yang tidak dibersihkan.", category: "sampah_jalan", severity: "sedang", lat: -7.2927, lng: 112.7390, address: "Taman Bungkul, Gubeng, Surabaya", district: "Gubeng", photoUrls: [], status: "selesai", assignedTo: "DLHK Kota Surabaya", resolutionNotes: "Sudah dibersihkan oleh tim kebersihan.", resolvedAt: daysAgo(0), xpAwarded: 150, upvotes: 8, reportedBy: "Budi S.", createdAt: daysAgo(5), updatedAt: now },
  { id: "r4", title: "Drum kimia berisi cairan tidak dikenal di lahan kosong", description: "Ada 4 drum besar berisi cairan merah, bau kimia tajam, berbahaya untuk warga sekitar.", category: "b3_berbahaya", severity: "kritis", lat: -7.2730, lng: 112.7600, address: "Jl. Rungkut Industri, Rungkut, Surabaya", district: "Rungkut", photoUrls: [], status: "diproses", assignedTo: "BPLHD Surabaya", xpAwarded: 50, upvotes: 31, reportedBy: "Dewi M.", createdAt: daysAgo(2), updatedAt: daysAgo(1) },
  { id: "r5", title: "Pembuangan sampah liar di lahan kosong Wonokromo", description: "Lahan kosong berubah jadi TPA liar seluas 200m², perlu penanganan segera.", category: "tpa_liar", severity: "tinggi", lat: -7.3100, lng: 112.7290, address: "Jl. Ahmad Yani, Wonokromo, Surabaya", district: "Wonokromo", photoUrls: [], status: "dilaporkan", xpAwarded: 50, upvotes: 6, reportedBy: "Rizki A.", createdAt: daysAgo(0), updatedAt: now },
  { id: "r6", title: "Sampah berserakan di pinggir Jl. Kenjeran", description: "Sepanjang 100m jalan banyak plastik dan styrofoam tidak terangkut sudah 2 hari.", category: "sampah_jalan", severity: "rendah", lat: -7.2250, lng: 112.7700, address: "Jl. Kenjeran, Kenjeran, Surabaya", district: "Kenjeran", photoUrls: [], status: "dilaporkan", xpAwarded: 50, upvotes: 3, reportedBy: "Mega S.", createdAt: daysAgo(0), updatedAt: now },
];

interface WasteReportStore {
  reports: WasteReport[];
  addReport: (r: Omit<WasteReport, "id" | "createdAt" | "updatedAt" | "upvotes" | "isUpvotedByMe" | "xpAwarded" | "status">) => WasteReport;
  toggleUpvote: (id: string) => void;
}

export const useWasteReportStore = create<WasteReportStore>()(
  persist(
    (set, get) => ({
      reports: MOCK_REPORTS,

      addReport: (data) => {
        const report: WasteReport = {
          ...data,
          id: `r-${Date.now()}`,
          status: "dilaporkan",
          upvotes: 0,
          isUpvotedByMe: false,
          xpAwarded: 50,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ reports: [report, ...s.reports] }));
        return report;
      },

      toggleUpvote: (id) =>
        set((s) => ({
          reports: s.reports.map((r) =>
            r.id === id
              ? { ...r, upvotes: r.isUpvotedByMe ? r.upvotes - 1 : r.upvotes + 1, isUpvotedByMe: !r.isUpvotedByMe }
              : r
          ),
        })),
    }),
    { name: "pacul-waste-reports", partialize: (s) => ({ reports: s.reports }) }
  )
);
