"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ThumbsUp, MapPin, ChevronDown } from "lucide-react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import {
  useWasteReportStore,
  type WasteReport,
  type WasteCategory,
  type WasteStatus,
  CATEGORY_CONFIG,
  SEVERITY_CONFIG,
  STATUS_CONFIG,
} from "@/store/wasteReport.store";
import { cn } from "@/utils/cn";

const SURABAYA_CENTER = { lat: -7.2575, lng: 112.7521 };
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

/* ── Marker pin SVG by severity ── */
function MarkerPin({ severity, status }: { severity: WasteReport["severity"]; status: WasteReport["status"] }) {
  const cfg = SEVERITY_CONFIG[severity];
  const done = status === "selesai";
  const processing = status === "diproses";
  return (
    <div
      className={cn("relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-lg text-base transition-all", done && "opacity-60")}
      style={{ backgroundColor: cfg.color }}
    >
      {done ? "✓" : processing ? "⟳" : cfg.emoji}
      {severity === "kritis" && !done && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: cfg.color, opacity: 0.4 }}
        />
      )}
    </div>
  );
}

/* ── Info window ── */
function InfoWindow({ report, onClose, onDetail }: { report: WasteReport; onClose: () => void; onDetail: (r: WasteReport) => void }) {
  const toggleUpvote = useWasteReportStore((s) => s.toggleUpvote);
  const sev = SEVERITY_CONFIG[report.severity];
  const sta = STATUS_CONFIG[report.status];
  const cat = CATEGORY_CONFIG[report.category];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute bottom-12 left-1/2 z-20 w-64 -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#E5E7EB]"
    >
      <div className="relative">
        {report.photoUrls.length > 0 ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={report.photoUrls[0]} alt="foto" className="h-28 w-full object-cover" />
        ) : (
          <div className="flex h-20 items-center justify-center bg-[#F0FAF4] text-4xl">
            {cat.emoji}
          </div>
        )}
        <button onClick={onClose} className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60">
          <X size={12} />
        </button>
      </div>
      <div className="p-3">
        <div className="mb-1.5 flex flex-wrap gap-1">
          <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ color: sev.color, backgroundColor: sev.bg }}>{sev.emoji} {sev.label}</span>
          <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ color: sta.color, backgroundColor: sta.bg }}>{sta.label}</span>
        </div>
        <p className="text-xs font-bold leading-tight text-[#1A1A1A] line-clamp-2">{report.title}</p>
        <p className="mt-0.5 text-[10px] text-gray-400">{report.district} · {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</p>
        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={() => toggleUpvote(report.id)}
            className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors", report.isUpvotedByMe ? "bg-[#2D5F3F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            <ThumbsUp size={10} /> {report.upvotes}
          </button>
          <button
            onClick={() => onDetail(report)}
            className="rounded-full bg-[#2D5F3F] px-3 py-1 text-[10px] font-bold text-white hover:bg-[#245033]"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Filter panel ── */
interface Filters {
  categories: Set<WasteCategory>;
  statuses: Set<WasteStatus>;
  severity: WasteReport["severity"] | "all";
}

function FilterPanel({ filters, onChange, onClose }: { filters: Filters; onChange: (f: Filters) => void; onClose: () => void }) {
  const toggleCat = (c: WasteCategory) => {
    const next = new Set(filters.categories);
    next.has(c) ? next.delete(c) : next.add(c);
    onChange({ ...filters, categories: next });
  };
  const toggleStatus = (s: WasteStatus) => {
    const next = new Set(filters.statuses);
    next.has(s) ? next.delete(s) : next.add(s);
    onChange({ ...filters, statuses: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
      className="absolute left-3 top-3 z-10 w-56 overflow-hidden rounded-2xl bg-white shadow-xl border border-[#E5E7EB]"
    >
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
        <span className="text-sm font-bold text-[#1A1A1A]">Filter Laporan</span>
        <button onClick={onClose}><X size={15} className="text-gray-400" /></button>
      </div>
      <div className="p-3 flex flex-col gap-4">
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Kategori</p>
          <div className="flex flex-col gap-1">
            {(Object.entries(CATEGORY_CONFIG) as [WasteCategory, typeof CATEGORY_CONFIG[WasteCategory]][]).map(([key, cfg]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50">
                <input type="checkbox" checked={filters.categories.has(key)} onChange={() => toggleCat(key)} className="accent-[#2D5F3F]" />
                <span className="text-xs">{cfg.emoji} {cfg.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</p>
          <div className="grid grid-cols-2 gap-1">
            {(["dilaporkan","diproses","selesai","ditolak"] as WasteStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                className={cn("rounded-lg px-2 py-1 text-[10px] font-semibold transition-colors", filters.statuses.has(s) ? "text-white" : "bg-gray-100 text-gray-600")}
                style={filters.statuses.has(s) ? { backgroundColor: STATUS_CONFIG[s].color } : undefined}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">Keparahan</p>
          <div className="grid grid-cols-2 gap-1">
            {(["all","rendah","sedang","tinggi","kritis"] as const).map((s) => (
              <button
                key={s}
                onClick={() => onChange({ ...filters, severity: s })}
                className={cn("rounded-lg px-2 py-1 text-[10px] font-semibold transition-colors", filters.severity === s ? "bg-[#2D5F3F] text-white" : "bg-gray-100 text-gray-600")}
              >
                {s === "all" ? "Semua" : `${SEVERITY_CONFIG[s].emoji} ${SEVERITY_CONFIG[s].label}`}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => onChange({ categories: new Set(), statuses: new Set(), severity: "all" })}
          className="w-full rounded-lg border border-[#E5E7EB] py-1.5 text-xs text-gray-500 hover:bg-gray-50"
        >
          Reset Filter
        </button>
      </div>
    </motion.div>
  );
}

/* ── Fallback map (no API key) ── */
function FallbackMap({ reports, onSelectReport }: { reports: WasteReport[]; onSelectReport: (r: WasteReport) => void }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-[#e8f5e9]">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 1px 1px,#2D5F3F 1px,transparent 0)", backgroundSize: "32px 32px" }} />
      <div className="relative z-10 text-center">
        <MapPin size={40} className="mx-auto text-[#2D5F3F]" />
        <p className="mt-2 font-bold text-[#2D5F3F]">Peta Surabaya</p>
        <p className="text-xs text-gray-500 mt-1">Tambahkan NEXT_PUBLIC_GOOGLE_MAPS_API_KEY untuk peta live</p>
      </div>
      {/* Pin list overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center">
        {reports.slice(0, 6).map((r) => (
          <button
            key={r.id}
            onClick={() => onSelectReport(r)}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow text-xs font-semibold text-[#1A1A1A] hover:shadow-md transition-shadow"
          >
            <span>{SEVERITY_CONFIG[r.severity].emoji}</span>
            <span className="max-w-[120px] truncate">{r.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main map component ── */
export default function WasteReportMap({ onDetail }: { onDetail: (r: WasteReport) => void }) {
  const reports = useWasteReportStore((s) => s.reports);
  const [selected, setSelected] = useState<WasteReport | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categories: new Set(),
    statuses: new Set(),
    severity: "all",
  });

  const filtered = reports.filter((r) => {
    if (filters.categories.size > 0 && !filters.categories.has(r.category)) return false;
    if (filters.statuses.size > 0 && !filters.statuses.has(r.status)) return false;
    if (filters.severity !== "all" && r.severity !== filters.severity) return false;
    return true;
  });

  const activeFilters = filters.categories.size + filters.statuses.size + (filters.severity !== "all" ? 1 : 0);

  return (
    <div className="flex flex-col gap-3">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-2">
        {(["dilaporkan","diproses","selesai"] as WasteStatus[]).map((s) => {
          const count = reports.filter((r) => r.status === s).length;
          const cfg = STATUS_CONFIG[s];
          return (
            <span key={s} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
              {cfg.label}: {count}
            </span>
          );
        })}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={cn("ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors", showFilter ? "bg-[#2D5F3F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
        >
          <Filter size={12} />
          Filter
          {activeFilters > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">{activeFilters}</span>
          )}
        </button>
      </div>

      {/* Map container */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB]" style={{ height: "calc(100vh - 280px)", minHeight: 400 }}>
        <AnimatePresence>
          {showFilter && (
            <FilterPanel filters={filters} onChange={setFilters} onClose={() => setShowFilter(false)} />
          )}
        </AnimatePresence>

        {MAPS_KEY ? (
          <APIProvider apiKey={MAPS_KEY}>
            <Map
              defaultCenter={SURABAYA_CENTER}
              defaultZoom={12}
              mapId="pacul-waste-map"
              gestureHandling="greedy"
              disableDefaultUI={false}
              style={{ width: "100%", height: "100%" }}
              onClick={() => setSelected(null)}
            >
              {filtered.map((report) => (
                <AdvancedMarker
                  key={report.id}
                  position={{ lat: report.lat, lng: report.lng }}
                  onClick={() => setSelected(report)}
                >
                  <div className="relative cursor-pointer">
                    <MarkerPin severity={report.severity} status={report.status} />
                  </div>
                </AdvancedMarker>
              ))}

              <AnimatePresence>
                {selected && (
                  <AdvancedMarker position={{ lat: selected.lat, lng: selected.lng }}>
                    <InfoWindow report={selected} onClose={() => setSelected(null)} onDetail={onDetail} />
                  </AdvancedMarker>
                )}
              </AnimatePresence>
            </Map>
          </APIProvider>
        ) : (
          <FallbackMap reports={filtered} onSelectReport={(r) => { setSelected(r); onDetail(r); }} />
        )}
      </div>

      {/* Report list below map */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-gray-500">{filtered.length} laporan ditampilkan</p>
        {filtered.slice(0, 5).map((r) => (
          <button
            key={r.id}
            onClick={() => onDetail(r)}
            className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left hover:border-[#2D5F3F] hover:shadow-sm transition-all"
          >
            <span className="text-xl">{CATEGORY_CONFIG[r.category].emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1A1A1A] truncate">{r.title}</p>
              <p className="text-[10px] text-gray-400">{r.district} · {new Date(r.createdAt).toLocaleDateString("id-ID")}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ color: SEVERITY_CONFIG[r.severity].color, backgroundColor: SEVERITY_CONFIG[r.severity].bg }}>
                {SEVERITY_CONFIG[r.severity].label}
              </span>
              <span className="text-[9px] text-gray-400">👍 {r.upvotes}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
