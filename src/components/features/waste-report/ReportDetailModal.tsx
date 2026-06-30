"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ThumbsUp, Share2, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useWasteReportStore, CATEGORY_CONFIG, SEVERITY_CONFIG, STATUS_CONFIG, type WasteReport } from "@/store/wasteReport.store";
import { cn } from "@/utils/cn";

/* ── Timeline ── */
function StatusTimeline({ report }: { report: WasteReport }) {
  const steps: { label: string; date?: string; done: boolean; current?: boolean }[] = [
    { label: `Dilaporkan oleh ${report.reportedBy}`, date: report.createdAt, done: true },
    {
      label: report.assignedTo ? `Diteruskan ke ${report.assignedTo}` : "Menunggu penugasan",
      date: report.status !== "dilaporkan" ? report.updatedAt : undefined,
      done: report.status === "diproses" || report.status === "selesai",
      current: report.status === "diproses",
    },
    {
      label: report.resolutionNotes ?? "Penyelesaian",
      date: report.resolvedAt,
      done: report.status === "selesai",
      current: false,
    },
  ];

  return (
    <div className="flex flex-col gap-0">
      {steps.map((s, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm border-2",
              s.done ? "border-[#2D5F3F] bg-[#2D5F3F] text-white" : s.current ? "border-[#F59E0B] bg-[#FEF3C7] text-[#F59E0B]" : "border-gray-200 bg-white text-gray-400")}>
              {s.done ? "✓" : s.current ? "⟳" : "○"}
            </div>
            {i < steps.length - 1 && <div className={cn("my-1 w-0.5 flex-1", s.done ? "bg-[#2D5F3F]" : "bg-gray-200")} style={{ minHeight: 20 }} />}
          </div>
          <div className="pb-4">
            <p className={cn("text-xs font-semibold", s.done ? "text-[#1A1A1A]" : s.current ? "text-[#F59E0B]" : "text-gray-400")}>{s.label}</p>
            {s.date && <p className="text-[10px] text-gray-400">{new Date(s.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Photo carousel ── */
function PhotoCarousel({ photos, fallbackEmoji }: { photos: string[]; fallbackEmoji: string }) {
  const [idx, setIdx] = useState(0);
  if (photos.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center bg-[#F0FAF4] text-6xl">{fallbackEmoji}</div>
    );
  }
  return (
    <div className="relative h-52 overflow-hidden bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos[idx]} alt={`foto ${idx + 1}`} className="h-full w-full object-cover" />
      {photos.length > 1 && (
        <>
          <button onClick={() => setIdx((i) => (i - 1 + photos.length) % photos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setIdx((i) => (i + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80">
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photos.map((_, i) => (
              <span key={i} className={cn("h-1.5 rounded-full transition-all", i === idx ? "w-4 bg-white" : "w-1.5 bg-white/50")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Main ── */
export default function ReportDetailModal({ report, onClose }: { report: WasteReport; onClose: () => void }) {
  const toggleUpvote = useWasteReportStore((s) => s.toggleUpvote);
  const sev = SEVERITY_CONFIG[report.severity];
  const sta = STATUS_CONFIG[report.status];
  const cat = CATEGORY_CONFIG[report.category];

  const handleShare = () => {
    const url = `${window.location.origin}/dashboard/laporan-sampah?id=${report.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link laporan disalin! 🔗");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center px-0 sm:px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl max-h-[92vh] flex flex-col"
        role="dialog" aria-modal="true"
      >
        {/* Photo carousel */}
        <div className="relative shrink-0">
          <PhotoCarousel photos={report.photoUrls} fallbackEmoji={cat.emoji} />
          <button onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Badges */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ color: sta.color, backgroundColor: sta.bg }}>{sta.label}</span>
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold" style={{ color: sev.color, backgroundColor: sev.bg }}>{sev.emoji} {sev.label}</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-600">{cat.emoji} {cat.label}</span>
          </div>

          <h2 className="text-lg font-extrabold leading-snug text-[#1A1A1A]">{report.title}</h2>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin size={11} />
            <span>{report.address}</span>
          </div>

          <p className="mt-3 text-sm text-gray-600 leading-relaxed">{report.description}</p>

          {/* Actions row */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => toggleUpvote(report.id)}
              className={cn("flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all", report.isUpvotedByMe ? "bg-[#2D5F3F] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}
            >
              <ThumbsUp size={15} />
              👍 Upvote ({report.upvotes})
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              <Share2 size={14} /> Bagikan
            </button>
          </div>
          {report.isUpvotedByMe && <p className="mt-1.5 text-center text-[10px] text-gray-400">Kamu sudah mendukung laporan ini</p>}

          {/* Divider */}
          <div className="my-4 border-t border-dashed border-[#E5E7EB]" />

          {/* Timeline */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Timeline Penanganan</p>
            <StatusTimeline report={report} />
          </div>

          {/* Meta */}
          <div className="mt-2 rounded-xl bg-[#F9FAFB] px-4 py-3 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Dilaporkan oleh</span>
              <strong className="text-[#1A1A1A]">{report.reportedBy}</strong>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>Tanggal</span>
              <strong className="text-[#1A1A1A]">{new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</strong>
            </div>
            {report.assignedTo && (
              <div className="mt-1 flex items-center justify-between">
                <span>Ditugaskan ke</span>
                <strong className="text-[#1A1A1A]">{report.assignedTo}</strong>
              </div>
            )}
            <div className="mt-1 flex items-center justify-between">
              <span>XP Diberikan</span>
              <strong className="text-[#2D5F3F]">⭐ {report.xpAwarded} XP</strong>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
