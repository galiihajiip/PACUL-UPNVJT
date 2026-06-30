"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  AlertCircle, CheckCircle2, Clock, AlertTriangle, LogOut, RefreshCw,
  Search, Filter, Download, Eye, Edit2, ChevronLeft, ChevronRight,
  X, MapPin, ExternalLink, BarChart2, Map, List, ChevronDown,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { useGovAuthStore } from "@/store/govAuth.store";
import {
  useWasteReportStore,
  CATEGORY_CONFIG, SEVERITY_CONFIG, STATUS_CONFIG,
  type WasteReport, type WasteStatus,
} from "@/store/wasteReport.store";
import { cn } from "@/utils/cn";

/* ─────────────────── CONSTANTS ─────────────────── */
const GOV_UNITS = [
  "Dinas Kebersihan Kota Surabaya",
  "BPLHD Surabaya",
  "PDAM Surya Sembada",
  "Komunitas Peduli Lingkungan",
  "Satuan Polisi Pamong Praja",
  "Dinas Lingkungan Hidup",
];

const COLORS_PIE = ["#2D5F3F", "#7AC74F", "#F59E0B", "#3B82F6", "#EF4444"];

/* ─────────────────── HELPERS ─────────────────── */
function daysAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400_000);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return now;
}

/* ─────────────────── KPI CARD ─────────────────── */
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  alert?: boolean;
}

function KpiCard({ icon, label, value, sub, accent = "#2D5F3F", alert }: KpiCardProps) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border p-5", alert ? "border-red-500/30 bg-red-500/5" : "border-white/10 bg-[#162237]")}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400">{label}</p>
        <div className="rounded-xl p-2" style={{ backgroundColor: `${accent}25` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
      </div>
      <p className={cn("text-3xl font-extrabold", alert ? "text-red-400" : "text-white")}>{value}</p>
      {sub && <p className={cn("text-xs", alert ? "text-red-400" : "text-gray-400")}>{sub}</p>}
    </div>
  );
}

/* ─────────────────── GOV MAP (placeholder or live) ─────────────────── */
function GovMapSection({ reports, onSelect }: { reports: WasteReport[]; onSelect: (r: WasteReport) => void }) {
  const [mapFilter, setMapFilter] = useState<"all" | "kritis" | "dilaporkan" | "diproses">("all");
  const filtered = reports.filter((r) => {
    if (mapFilter === "kritis") return r.severity === "kritis";
    if (mapFilter === "dilaporkan") return r.status === "dilaporkan";
    if (mapFilter === "diproses") return r.status === "diproses";
    return true;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "kritis", "dilaporkan", "diproses"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setMapFilter(f)}
            className={cn("rounded-full px-3 py-1.5 text-xs font-semibold transition-colors", mapFilter === f ? "bg-[#2D5F3F] text-white" : "bg-white/10 text-gray-300 hover:bg-white/20")}
          >
            {f === "all" ? "Semua" : f === "kritis" ? "🔴 Kritis" : f === "dilaporkan" ? "Belum Ditangani" : "Dalam Proses"}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500">{filtered.length} laporan</span>
      </div>

      {/* Map area */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1A2E45]" style={{ height: 360 }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px,#7AC74F 1px,transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="relative flex h-full flex-col items-center justify-center text-center">
          <Map size={40} className="text-[#2D5F3F]" />
          <p className="mt-2 font-bold text-white">Peta Live Laporan Surabaya</p>
          <p className="mt-1 text-xs text-gray-500 max-w-xs">Tambahkan NEXT_PUBLIC_GOOGLE_MAPS_KEY untuk peta interaktif</p>
        </div>
        {/* Floating pins */}
        <div className="absolute inset-x-4 bottom-4 flex flex-wrap justify-center gap-2">
          {filtered.slice(0, 5).map((r) => (
            <button
              key={r.id}
              onClick={() => onSelect(r)}
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0F1A2E]/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:border-[#2D5F3F] hover:bg-[#2D5F3F]/30 transition-colors"
            >
              <span>{SEVERITY_CONFIG[r.severity].emoji}</span>
              <span className="max-w-[120px] truncate">{r.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── DETAIL SIDEBAR ─────────────────── */
function DetailSidebar({ report, onClose }: { report: WasteReport; onClose: () => void }) {
  const [newStatus, setNewStatus] = useState<WasteStatus>(report.status);
  const [assignedTo, setAssignedTo] = useState(report.assignedTo ?? "");
  const [notes, setNotes] = useState(report.resolutionNotes ?? "");
  const [saving, setSaving] = useState(false);
  const reports = useWasteReportStore((s) => s.reports);

  const handleUpdate = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    useWasteReportStore.setState((s) => ({
      reports: s.reports.map((r) =>
        r.id === report.id
          ? { ...r, status: newStatus, assignedTo, resolutionNotes: notes, updatedAt: new Date().toISOString(), resolvedAt: newStatus === "selesai" ? new Date().toISOString() : r.resolvedAt }
          : r
      ),
    }));
    setSaving(false);
    toast.success("Status laporan berhasil diperbarui ✓");
    toast.info(`Notifikasi dikirim ke pelapor: "Laporan kamu sedang ${newStatus}! 🔔"`);
    onClose();
  };

  const sev = SEVERITY_CONFIG[report.severity];
  const sta = STATUS_CONFIG[report.status];
  const cat = CATEGORY_CONFIG[report.category];
  const mapsUrl = `https://maps.google.com/?q=${report.lat},${report.lng}`;

  return (
    <motion.div
      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-white/10 bg-[#162237] shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
        <div className="flex-1 pr-4">
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ color: sta.color, backgroundColor: `${sta.color}25` }}>{sta.label}</span>
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ color: sev.color, backgroundColor: `${sev.color}25` }}>{sev.emoji} {sev.label}</span>
          </div>
          <h2 className="text-sm font-bold leading-snug text-white">{report.title}</h2>
        </div>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10"><X size={18} /></button>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-5">
        {/* Photo */}
        {report.photoUrls.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={report.photoUrls[0]} alt="foto" className="h-40 w-full rounded-xl object-cover" />
        ) : (
          <div className="flex h-32 items-center justify-center rounded-xl bg-white/5 text-5xl">{cat.emoji}</div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            { label: "Pelapor", value: report.reportedBy },
            { label: "Tanggal", value: fmtDate(report.createdAt) },
            { label: "Kategori", value: `${cat.emoji} ${cat.label}` },
            { label: "Upvotes", value: `👍 ${report.upvotes}` },
            { label: "Kecamatan", value: report.district },
            { label: "XP Diberikan", value: `⭐ ${report.xpAwarded}` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-white/5 px-3 py-2">
              <p className="text-[10px] text-gray-500">{label}</p>
              <p className="mt-0.5 font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Map link */}
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-[#7AC74F] hover:border-[#2D5F3F] transition-colors">
          <MapPin size={13} />
          {report.address}
          <ExternalLink size={11} className="ml-auto shrink-0" />
        </a>

        {/* Description */}
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Deskripsi</p>
          <p className="rounded-xl bg-white/5 px-4 py-3 text-xs leading-relaxed text-gray-300">{report.description}</p>
        </div>

        <div className="border-t border-white/10" />

        {/* Update status form */}
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold text-white">Update Status</p>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">Status Baru</label>
            <div className="grid grid-cols-3 gap-2">
              {(["diproses","selesai","ditolak"] as WasteStatus[]).map((s) => (
                <button key={s} onClick={() => setNewStatus(s)}
                  className={cn("rounded-xl py-2 text-xs font-bold transition-all", newStatus === s ? "text-white" : "bg-white/10 text-gray-400 hover:bg-white/20")}
                  style={newStatus === s ? { backgroundColor: STATUS_CONFIG[s].color } : {}}>
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">Ditugaskan ke</label>
            <div className="relative">
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#1E2E45] px-4 py-2.5 pr-8 text-xs text-white outline-none focus:border-[#2D5F3F]"
              >
                <option value="">-- Pilih Unit --</option>
                {GOV_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Catatan Resolusi {(newStatus === "selesai" || newStatus === "ditolak") && <span className="text-red-400">*</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Jelaskan tindakan yang telah diambil..."
              className="w-full resize-none rounded-xl border border-white/10 bg-[#1E2E45] px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#2D5F3F]"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={saving || (["selesai","ditolak"].includes(newStatus) && !notes.trim())}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2D5F3F] py-3 text-sm font-bold text-white disabled:bg-white/10 disabled:text-white/30 hover:bg-[#245033] transition-colors"
          >
            {saving ? <><RefreshCw size={14} className="animate-spin" /> Menyimpan...</> : "✓ Update Status"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────── REPORTS TABLE ─────────────────── */
function ReportsTable({ reports, onSelect }: { reports: WasteReport[]; onSelect: (r: WasteReport) => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WasteStatus | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<WasteReport["severity"] | "all">("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const PER_PAGE = 10;

  const filtered = useMemo(() => reports.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (severityFilter !== "all" && r.severity !== severityFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.district.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [reports, search, statusFilter, severityFilter]);

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const slice = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const toggleAll = () => {
    if (selected.size === slice.length) setSelected(new Set());
    else setSelected(new Set(slice.map((r) => r.id)));
  };

  const handleExportCSV = () => {
    const rows = (selected.size > 0 ? filtered.filter((r) => selected.has(r.id)) : filtered);
    const header = ["ID","Judul","Lokasi","Kategori","Severity","Status","Pelapor","Tanggal","XP"];
    const csv = [header, ...rows.map((r) => [r.id, r.title, r.address, r.category, r.severity, r.status, r.reportedBy, fmtDate(r.createdAt), r.xpAwarded])].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `laporan-sampah-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success(`${rows.length} laporan diekspor ke CSV`);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#162237] p-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Cari judul / lokasi..."
            className="w-full rounded-xl border border-white/10 bg-[#1E2E45] py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 outline-none focus:border-[#2D5F3F]"
          />
        </div>

        {/* Status filter */}
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as WasteStatus | "all"); setPage(0); }}
          className="rounded-xl border border-white/10 bg-[#1E2E45] px-3 py-2 text-xs text-white outline-none focus:border-[#2D5F3F]">
          <option value="all">Semua Status</option>
          {(["dilaporkan","diproses","selesai","ditolak"] as WasteStatus[]).map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>

        {/* Severity filter */}
        <select value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value as WasteReport["severity"] | "all"); setPage(0); }}
          className="rounded-xl border border-white/10 bg-[#1E2E45] px-3 py-2 text-xs text-white outline-none focus:border-[#2D5F3F]">
          <option value="all">Semua Severity</option>
          {(["rendah","sedang","tinggi","kritis"] as const).map((s) => <option key={s} value={s}>{SEVERITY_CONFIG[s].emoji} {SEVERITY_CONFIG[s].label}</option>)}
        </select>

        {selected.size > 0 && (
          <span className="rounded-full bg-[#2D5F3F]/20 px-3 py-1 text-xs text-[#7AC74F]">{selected.size} dipilih</span>
        )}

        <button onClick={handleExportCSV} className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-white/10 transition-colors">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 pr-3">
                <input type="checkbox" checked={selected.size === slice.length && slice.length > 0} onChange={toggleAll} className="accent-[#2D5F3F]" />
              </th>
              {["Judul & Lokasi","Kategori","Severity","Pelapor","Tanggal","Status","Aksi"].map((h) => (
                <th key={h} className="whitespace-nowrap pb-3 pr-4 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r) => {
              const sev = SEVERITY_CONFIG[r.severity];
              const sta = STATUS_CONFIG[r.status];
              const cat = CATEGORY_CONFIG[r.category];
              return (
                <tr key={r.id} className="group border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-3">
                    <input type="checkbox" checked={selected.has(r.id)} onChange={() => setSelected((prev) => { const next = new Set(prev); next.has(r.id) ? next.delete(r.id) : next.add(r.id); return next; })} className="accent-[#2D5F3F]" />
                  </td>
                  <td className="py-3 pr-4 max-w-[180px]">
                    <p className="font-semibold leading-tight text-white truncate">{r.title}</p>
                    <p className="mt-0.5 text-[10px] text-gray-500 truncate">{r.district}</p>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="text-sm">{cat.emoji}</span>
                    <span className="ml-1 text-gray-400">{cat.label}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ color: sev.color, backgroundColor: `${sev.color}20` }}>{sev.emoji} {sev.label}</span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-gray-400">{r.reportedBy}</td>
                  <td className="py-3 pr-4 whitespace-nowrap text-gray-400">{fmtDate(r.createdAt)}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ color: sta.color, backgroundColor: `${sta.color}20` }}>{sta.label}</span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => onSelect(r)} className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-gray-300 hover:border-[#2D5F3F] hover:text-[#7AC74F] transition-colors">
                      <Edit2 size={11} /> Kelola
                    </button>
                  </td>
                </tr>
              );
            })}
            {slice.length === 0 && (
              <tr><td colSpan={8} className="py-10 text-center text-sm text-gray-500">Tidak ada laporan ditemukan</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{filtered.length} laporan · halaman {page + 1}/{pages}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-lg p-1.5 hover:bg-white/10 disabled:opacity-30"><ChevronLeft size={14} /></button>
            <button onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1} className="rounded-lg p-1.5 hover:bg-white/10 disabled:opacity-30"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── ANALYTICS SECTION ─────────────────── */
function AnalyticsSection({ reports }: { reports: WasteReport[] }) {
  const barData = useMemo(() => {
    const days: Record<string, { dilaporkan: number; selesai: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400_000);
      const key = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      days[key] = { dilaporkan: 0, selesai: 0 };
    }
    reports.forEach((r) => {
      const key = new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      if (days[key]) days[key].dilaporkan++;
      if (r.status === "selesai" && r.resolvedAt) {
        const rkey = new Date(r.resolvedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        if (days[rkey]) days[rkey].selesai++;
      }
    });
    return Object.entries(days).map(([name, v]) => ({ name, ...v }));
  }, [reports]);

  const distData = useMemo(() => {
    const cnt: Record<string, number> = {};
    reports.forEach((r) => { cnt[r.district] = (cnt[r.district] ?? 0) + 1; });
    return Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, val]) => ({ name, val }));
  }, [reports]);

  const pieData = useMemo(() => {
    const cnt: Record<string, number> = {};
    reports.forEach((r) => { cnt[r.category] = (cnt[r.category] ?? 0) + 1; });
    return Object.entries(cnt).map(([name, value]) => ({ name: CATEGORY_CONFIG[name as keyof typeof CATEGORY_CONFIG]?.label ?? name, value }));
  }, [reports]);

  const trendData = [
    { week: "4 mgg lalu", avg: 4.1 }, { week: "3 mgg lalu", avg: 3.6 },
    { week: "2 mgg lalu", avg: 2.9 }, { week: "Minggu ini", avg: 2.3 },
  ];

  const tooltipStyle = { backgroundColor: "#1E2E45", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11, color: "#fff" };

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {/* Bar: laporan per hari */}
      <div className="rounded-2xl border border-white/10 bg-[#162237] p-5">
        <p className="mb-4 text-sm font-bold text-white">Laporan 7 Hari Terakhir</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="dilaporkan" fill="#EF4444" name="Dilaporkan" radius={[4, 4, 0, 0]} />
            <Bar dataKey="selesai" fill="#2D5F3F" name="Diselesaikan" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Donut: category */}
      <div className="rounded-2xl border border-white/10 bg-[#162237] p-5">
        <p className="mb-4 text-sm font-bold text-white">Distribusi Kategori</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={3}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS_PIE[i % COLORS_PIE.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Horizontal bar: by district */}
      <div className="rounded-2xl border border-white/10 bg-[#162237] p-5">
        <p className="mb-4 text-sm font-bold text-white">Top Kecamatan</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={distData} layout="vertical" barSize={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="val" fill="#3B82F6" name="Laporan" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line: avg resolve time */}
      <div className="rounded-2xl border border-white/10 bg-[#162237] p-5">
        <p className="mb-4 text-sm font-bold text-white">Rata-rata Waktu Penyelesaian</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 6]} unit=" hr" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="avg" stroke="#7AC74F" strokeWidth={2} dot={{ fill: "#7AC74F", r: 4 }} name="Rata-rata (hari)" />
            <Line type="monotone" dataKey={() => 3} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Target (3 hari)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN DASHBOARD ─────────────────── */
export default function GovDashboardClient() {
  const router = useRouter();
  const govUser = useGovAuthStore((s) => s.user);
  const logout = useGovAuthStore((s) => s.logout);
  const reports = useWasteReportStore((s) => s.reports);
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [activeSection, setActiveSection] = useState<"overview" | "table" | "analytics">("overview");
  const now = useNow();

  useEffect(() => {
    if (!govUser) router.replace("/gov/login");
  }, [govUser, router]);

  if (!govUser) return null;

  /* KPI data */
  const active = reports.filter((r) => r.status === "dilaporkan" || r.status === "diproses").length;
  const todayStr = new Date().toDateString();
  const todayNew = reports.filter((r) => new Date(r.createdAt).toDateString() === todayStr).length;
  const weekAgo = Date.now() - 7 * 86400_000;
  const resolvedWeek = reports.filter((r) => r.status === "selesai" && r.resolvedAt && new Date(r.resolvedAt).getTime() > weekAgo).length;
  const criticalUnhandled = reports.filter((r) => r.severity === "kritis" && r.status === "dilaporkan").length;

  const handleLogout = () => {
    logout();
    router.push("/gov/login");
    toast.success("Berhasil logout.");
  };

  return (
    <div className="min-h-screen bg-[#0F1A2E]">
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0F1A2E]/95 backdrop-blur">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-sm font-extrabold text-white">PACUL</p>
              <p className="text-[10px] text-gray-400">{govUser.governmentUnit}</p>
            </div>
          </div>

          {/* Section nav */}
          <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 sm:flex">
            {([
              { id: "overview", label: "Overview", icon: <BarChart2 size={13} /> },
              { id: "table",    label: "Laporan",  icon: <List size={13} /> },
              { id: "analytics",label: "Analytics",icon: <BarChart2 size={13} /> },
            ] as const).map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", activeSection === s.id ? "bg-[#2D5F3F] text-white" : "text-gray-400 hover:text-white")}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-white">{govUser.name}</p>
              <p className="text-[10px] text-gray-400">{govUser.role}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D5F3F] text-xs font-bold text-white">{govUser.avatarInitials}</div>
            <button onClick={handleLogout} className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"><LogOut size={16} /></button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-white sm:text-2xl">Dashboard Dinas Kebersihan Surabaya</h1>
            <p className="mt-0.5 text-sm text-gray-400">
              {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400">
            <RefreshCw size={11} className="text-[#7AC74F]" />
            Data diperbarui: baru saja
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            icon={<AlertCircle size={18} />}
            label="Total Laporan Aktif"
            value={active}
            sub={`+${todayNew} hari ini`}
            accent="#F59E0B"
          />
          <KpiCard
            icon={<CheckCircle2 size={18} />}
            label="Diselesaikan Minggu Ini"
            value={resolvedWeek}
            sub="▲ 12% vs minggu lalu"
            accent="#16a34a"
          />
          <KpiCard
            icon={<Clock size={18} />}
            label="Rata-rata Penyelesaian"
            value="2.3 hari"
            sub="Target: 3 hari ✓"
            accent="#3B82F6"
          />
          <KpiCard
            icon={<AlertTriangle size={18} />}
            label="Kritis Belum Ditangani"
            value={criticalUnhandled}
            sub={criticalUnhandled > 0 ? "Butuh tindakan segera!" : "Semua ditangani ✓"}
            accent="#dc2626"
            alert={criticalUnhandled > 0}
          />
        </div>

        {/* SECTION: OVERVIEW */}
        {activeSection === "overview" && (
          <div className="flex flex-col gap-6">
            <GovMapSection reports={reports} onSelect={setSelectedReport} />
            <ReportsTable reports={reports} onSelect={setSelectedReport} />
          </div>
        )}

        {/* SECTION: TABLE */}
        {activeSection === "table" && (
          <ReportsTable reports={reports} onSelect={setSelectedReport} />
        )}

        {/* SECTION: ANALYTICS */}
        {activeSection === "analytics" && (
          <AnalyticsSection reports={reports} />
        )}
      </main>

      {/* Detail sidebar */}
      <AnimatePresence>
        {selectedReport && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setSelectedReport(null)}
            />
            <DetailSidebar report={selectedReport} onClose={() => setSelectedReport(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
