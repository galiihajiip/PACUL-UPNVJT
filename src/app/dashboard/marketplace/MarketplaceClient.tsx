"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { Search, X, Copy, Download, ChevronDown, ChevronUp, Clock } from "lucide-react";
import PageWrapper from "@/components/common/PageWrapper";
import { useUserStore } from "@/store/userStore";
import { useVoucherStore, type Voucher, type UserVoucher, type VoucherCategory, type VoucherStatus } from "@/store/voucher.store";
import { cn } from "@/utils/cn";

/* ─── category config ─── */
const CATEGORIES: { id: VoucherCategory | "all"; label: string; emoji: string }[] = [
  { id: "all",       label: "Semua",        emoji: "🌿" },
  { id: "pangan",    label: "Pangan",       emoji: "🥦" },
  { id: "transport", label: "Transport",    emoji: "🚌" },
  { id: "lifestyle", label: "Lifestyle",    emoji: "💅" },
  { id: "energi",    label: "Energi",       emoji: "⚡" },
  { id: "lingkungan",label: "Ramah Lingkungan", emoji: "🌱" },
];

const CATEGORY_COLORS: Record<string, string> = {
  pangan:    "bg-green-100 text-green-700",
  transport: "bg-blue-100 text-blue-700",
  lifestyle: "bg-purple-100 text-purple-700",
  energi:    "bg-yellow-100 text-yellow-700",
  lingkungan:"bg-teal-100 text-teal-700",
};

/* ─── helpers ─── */
function daysRemaining(isoDate: string) {
  const ms = new Date(isoDate).getTime() - Date.now();
  return Math.max(0, Math.floor(ms / 86400_000));
}

function hoursRemaining(isoDate: string) {
  const ms = new Date(isoDate).getTime() - Date.now();
  return Math.max(0, Math.floor((ms % 86400_000) / 3600_000));
}

/* ─── QR Voucher Card (ref-forwarded for html2canvas) ─── */
function VoucherQRCard({
  uv,
  cardRef,
}: {
  uv: UserVoucher;
  cardRef?: React.RefObject<HTMLDivElement>;
}) {
  const days = daysRemaining(uv.expiresAt);
  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center gap-4 rounded-2xl border border-[#A8D5BA] bg-white p-6 shadow-sm"
    >
      <div className="flex w-full items-center gap-2">
        <span className="text-2xl">🌿</span>
        <span className="text-sm font-bold text-[#2D5F3F]">PACUL GREEN MARKETPLACE</span>
      </div>
      <div className="w-full border-t border-dashed border-[#A8D5BA]" />

      <div className={`w-full rounded-xl px-4 py-1.5 text-center text-xs font-bold ${uv.status === "active" ? "bg-[#2D5F3F] text-white" : uv.status === "used" ? "bg-gray-200 text-gray-500" : "bg-red-100 text-red-600"}`}>
        {uv.status === "active" ? "✓ VOUCHER AKTIF" : uv.status === "used" ? "SUDAH DIGUNAKAN" : "KEDALUWARSA"}
      </div>

      <div className="w-full text-center">
        <p className="text-lg font-extrabold text-[#1A1A1A] leading-tight">{uv.voucher.title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{uv.voucher.partner}</p>
      </div>

      <div className="w-full">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Kode Unik</p>
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-[#2D5F3F]/40 bg-[#F0FAF4] px-4 py-3">
          <span className="font-mono text-base font-extrabold tracking-widest text-[#2D5F3F]">
            {uv.uniqueCode}
          </span>
        </div>
      </div>

      <QRCodeSVG value={uv.qrData} size={150} fgColor="#1a2e1f" />

      <div className="w-full text-center text-xs text-gray-400">
        Berlaku hingga:{" "}
        <strong className={days < 3 ? "text-red-500" : "text-[#1A1A1A]"}>
          {new Date(uv.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </strong>
      </div>

      <div className="w-full rounded-xl bg-[#F9FAFB] px-3 py-2 text-[10px] text-gray-400">
        <p className="font-semibold text-gray-500">Syarat & Ketentuan:</p>
        <p className="mt-0.5">{uv.voucher.terms}</p>
      </div>
    </div>
  );
}

/* ─── Redeem Modal (3-step) ─── */
type RedeemStep = "detail" | "confirm" | "loading" | "success";

function RedeemModal({
  voucher,
  userXp,
  onClose,
  onSuccess,
}: {
  voucher: Voucher;
  userXp: number;
  onClose: () => void;
  onSuccess: (uv: UserVoucher) => void;
}) {
  // Prevent background-click close during loading or after success
  const [step, setStep] = useState<RedeemStep>("detail");
  const [agreed, setAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [resultUV, setResultUV] = useState<UserVoucher | null>(null);
  const redeemVoucher = useVoucherStore((s) => s.redeemVoucher);
  const deductXP = useUserStore((s) => s.deductXP);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleRedeem = async () => {
    setStep("loading");
    await new Promise((r) => setTimeout(r, 1100));
    const result = redeemVoucher(voucher.id, userXp);
    if (!result.success) {
      toast.error(result.error ?? "Gagal menukar voucher.");
      onClose();
      return;
    }
    deductXP(voucher.xpCost);
    setResultUV(result.userVoucher!);
    setStep("success");
  };

  const handleCopyCode = () => {
    if (!resultUV) return;
    navigator.clipboard.writeText(resultUV.uniqueCode);
    toast.success("Kode disalin! 📋");
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `voucher-${resultUV?.uniqueCode ?? "pacul"}.png`;
      a.click();
      toast.success("Voucher tersimpan ke galeri! 📥");
    } catch {
      toast.error("Gagal menyimpan gambar.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl shadow-2xl"
        role="dialog" aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-base font-bold text-[#1A1A1A]">
            {step === "detail"  && "Detail Voucher"}
            {step === "confirm" && "Konfirmasi Penukaran"}
            {step === "loading" && "Memproses..."}
            {step === "success" && "Voucher Berhasil! 🎉"}
          </h2>
          {step !== "loading" && (
            <button onClick={onClose} aria-label="Tutup" className="rounded-full p-1.5 hover:bg-gray-100">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-5 py-5">
          <AnimatePresence mode="wait">

            {/* STEP 1: Detail */}
            {step === "detail" && (
              <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{voucher.emoji}</span>
                  <div>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", CATEGORY_COLORS[voucher.category])}>
                      {voucher.category}
                    </span>
                    <p className="mt-1 text-base font-bold text-[#1A1A1A]">{voucher.title}</p>
                    <p className="text-xs text-gray-500">{voucher.partner}</p>
                  </div>
                </div>
                {voucher.description && (
                  <p className="text-sm text-gray-600">{voucher.description}</p>
                )}
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl bg-[#F0FAF4] p-3 text-center">
                    <p className="text-[10px] text-gray-400">Nilai Voucher</p>
                    <p className="text-lg font-extrabold text-[#2D5F3F]">{voucher.discount}</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-[#F9FAFB] p-3 text-center">
                    <p className="text-[10px] text-gray-400">Berlaku</p>
                    <p className="text-lg font-extrabold text-[#1A1A1A]">{voucher.expiryDays} hari</p>
                  </div>
                </div>
                {/* Terms accordion */}
                <button
                  onClick={() => setTermsOpen(!termsOpen)}
                  className="flex w-full items-center justify-between rounded-xl bg-[#F9FAFB] px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span>Syarat & Ketentuan</span>
                  {termsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {termsOpen && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden rounded-xl bg-[#F9FAFB] px-4 py-3 text-xs text-gray-500"
                    >
                      {voucher.terms}
                    </motion.p>
                  )}
                </AnimatePresence>
                {/* XP preview */}
                <div className="rounded-xl border border-[#E5E7EB] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Saldo XP kamu</span>
                    <span className="font-bold text-[#1A1A1A]">⭐ {userXp} XP</span>
                  </div>
                  <div className="my-2 border-t border-dashed border-[#E5E7EB]" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Setelah penukaran</span>
                    <span className={cn("font-bold", userXp - voucher.xpCost < 0 ? "text-red-500" : "text-[#2D5F3F]")}>
                      ⭐ {userXp - voucher.xpCost} XP
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setStep("confirm")}
                  disabled={userXp < voucher.xpCost}
                  className="w-full rounded-xl py-3.5 text-sm font-extrabold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                  style={{ backgroundColor: userXp >= voucher.xpCost ? "#2D5F3F" : undefined }}
                >
                  {userXp < voucher.xpCost ? "XP Tidak Cukup" : `Tukar Sekarang — ${voucher.xpCost} XP`}
                </button>
              </motion.div>
            )}

            {/* STEP 2: Confirm */}
            {step === "confirm" && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
                <div className="flex items-center gap-3 rounded-xl bg-[#F0FAF4] p-4">
                  <span className="text-3xl">{voucher.emoji}</span>
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{voucher.title}</p>
                    <p className="text-xs text-gray-500">{voucher.partner}</p>
                  </div>
                  <span className="ml-auto font-extrabold text-[#2D5F3F]">−{voucher.xpCost} XP</span>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5E7EB] p-4 hover:border-[#2D5F3F] transition-colors">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 accent-[#2D5F3F]"
                  />
                  <span className="text-sm text-gray-600">
                    Saya setuju dengan{" "}
                    <strong className="text-[#2D5F3F]">syarat & ketentuan</strong> voucher ini
                  </span>
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("detail")}
                    className="flex-1 rounded-xl border border-[#E5E7EB] py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleRedeem}
                    disabled={!agreed}
                    className="flex-1 rounded-xl py-3 text-sm font-extrabold text-white transition-colors disabled:bg-gray-200 disabled:text-gray-400"
                    style={{ backgroundColor: agreed ? "#2D5F3F" : undefined }}
                  >
                    Ya, Tukar!
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Loading */}
            {step === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-10">
                <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#2D5F3F]/20 border-t-[#2D5F3F]" />
                <p className="font-semibold text-gray-600">Memproses penukaran...</p>
              </motion.div>
            )}

            {/* STEP 4: Success */}
            {step === "success" && resultUV && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4">
                <VoucherQRCard uv={resultUV} cardRef={cardRef} />
                <div className="flex gap-3">
                  <button
                    onClick={handleCopyCode}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2D5F3F] py-3 text-sm font-semibold text-[#2D5F3F] hover:bg-[#F0FAF4] transition-colors"
                  >
                    <Copy size={14} /> Salin Kode
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2D5F3F] py-3 text-sm font-bold text-white hover:bg-[#245033] transition-colors"
                  >
                    <Download size={14} /> Simpan ke Galeri
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (resultUV) onSuccess(resultUV);
                    onClose();
                  }}
                  className="w-full rounded-xl border border-[#E5E7EB] py-2.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  ✓ Selesai
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── QR View Modal (for My Vouchers) ─── */
function QRViewModal({ uv, onClose }: { uv: UserVoucher; onClose: () => void }) {
  const markVoucherUsed = useVoucherStore((s) => s.markVoucherUsed);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(uv.uniqueCode);
    toast.success("Kode disalin! 📋");
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `voucher-${uv.uniqueCode}.png`;
      a.click();
      toast.success("Tersimpan!");
    } catch {
      toast.error("Gagal menyimpan.");
    }
  };

  const handleUse = () => {
    markVoucherUsed(uv.id);
    toast.success("Voucher ditandai sebagai sudah digunakan.");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl shadow-2xl max-h-[90vh]"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-base font-bold">QR Voucher</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <VoucherQRCard uv={uv} cardRef={cardRef} />
          <div className="flex gap-2">
            <button onClick={handleCopy} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2D5F3F] py-2.5 text-xs font-semibold text-[#2D5F3F] hover:bg-[#F0FAF4]">
              <Copy size={13} /> Salin Kode
            </button>
            <button onClick={handleDownload} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2D5F3F] py-2.5 text-xs font-bold text-white hover:bg-[#245033]">
              <Download size={13} /> Simpan
            </button>
          </div>
          {uv.status === "active" && (
            <button onClick={handleUse} className="w-full rounded-xl border border-gray-200 py-2.5 text-xs text-gray-500 hover:bg-gray-50">
              ✓ Tandai Sudah Digunakan
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Voucher Card (catalog) ─── */
function VoucherCard({
  voucher,
  userXp,
  owned,
  onRedeem,
}: {
  voucher: Voucher;
  userXp: number;
  owned: boolean;
  onRedeem: (v: Voucher) => void;
}) {
  const canAfford = userXp >= voucher.xpCost;
  const lowStock = voucher.stock < 10;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="text-3xl">{voucher.emoji}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase", CATEGORY_COLORS[voucher.category])}>
          {voucher.category}
        </span>
      </div>
      <p className="text-sm font-bold leading-tight text-[#1A1A1A]">{voucher.title}</p>
      <p className="mt-0.5 text-xs text-gray-500">{voucher.partner}</p>
      {voucher.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-gray-400">{voucher.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-lg font-extrabold text-[#2D5F3F]">{voucher.discount}</span>
        <span className="text-xs font-bold text-[#F59E0B]">⭐ {voucher.xpCost} XP</span>
      </div>
      <p className={cn("mt-1 text-[10px]", lowStock ? "text-red-500 font-semibold" : "text-gray-400")}>
        Tersisa: {voucher.stock}
      </p>
      <button
        onClick={() => !owned && onRedeem(voucher)}
        disabled={(!canAfford && !owned) || voucher.stock === 0}
        title={!canAfford && !owned ? "XP tidak cukup" : undefined}
        className={cn(
          "mt-3 w-full rounded-xl py-2.5 text-xs font-bold transition-all",
          owned
            ? "bg-[#F0FAF4] text-[#2D5F3F] cursor-default"
            : canAfford && voucher.stock > 0
            ? "bg-[#2D5F3F] text-white hover:bg-[#245033]"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        )}
      >
        {owned
          ? "✓ Sudah Dimiliki"
          : voucher.stock === 0
          ? "Stok Habis"
          : canAfford
          ? "Redeem"
          : `Butuh ${(voucher.xpCost - userXp).toLocaleString("id-ID")} XP lagi`}
      </button>
    </motion.div>
  );
}

/* ─── My Vouchers Tab ─── */
function MyVouchersTab({ userVouchers }: { userVouchers: UserVoucher[] }) {
  const [filter, setFilter] = useState<"all" | VoucherStatus>("all");
  const [qrTarget, setQrTarget] = useState<UserVoucher | null>(null);

  const filtered = userVouchers.filter((uv) => filter === "all" || uv.status === filter);

  const statusLabel: Record<VoucherStatus, string> = { active: "AKTIF", used: "DIGUNAKAN", expired: "KEDALUWARSA" };
  const statusCls: Record<VoucherStatus, string> = {
    active: "bg-[#2D5F3F] text-white",
    used: "bg-gray-200 text-gray-500",
    expired: "bg-red-100 text-red-600",
  };

  return (
    <>
      <div className="mb-4 flex gap-2">
        {(["all", "active", "used", "expired"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              filter === f ? "bg-[#2D5F3F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {f === "all" ? "Semua" : statusLabel[f as VoucherStatus]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#E5E7EB] py-16 text-center">
          <p className="text-3xl">🎫</p>
          <p className="mt-2 font-semibold text-gray-500">Belum ada voucher</p>
          <p className="text-sm text-gray-400">Redeem voucher dari katalog untuk memulai</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((uv) => {
            const days = daysRemaining(uv.expiresAt);
            const hours = hoursRemaining(uv.expiresAt);
            return (
              <div key={uv.id} className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
                <span className="text-2xl">{uv.voucher.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-[#1A1A1A]">{uv.voucher.title}</p>
                  <p className="text-xs text-gray-500">{uv.voucher.partner}</p>
                  {uv.status === "active" && (
                    <p className={cn("mt-1 flex items-center gap-1 text-[10px] font-semibold", days < 3 ? "text-red-500" : "text-gray-400")}>
                      <Clock size={10} />
                      Sisa: {days} hari {hours} jam
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold", statusCls[uv.status])}>
                    {statusLabel[uv.status]}
                  </span>
                  {uv.status !== "expired" && (
                    <button
                      onClick={() => setQrTarget(uv)}
                      className="rounded-lg border border-[#2D5F3F] px-2.5 py-1 text-[10px] font-semibold text-[#2D5F3F] hover:bg-[#F0FAF4]"
                    >
                      Lihat QR
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {qrTarget && <QRViewModal uv={qrTarget} onClose={() => setQrTarget(null)} />}
      </AnimatePresence>
    </>
  );
}

/* ─── Main Client ─── */
export default function MarketplaceClient() {
  const userXp = useUserStore((s) => s.xp);
  const { vouchers, userVouchers } = useVoucherStore();

  const [activeTab, setActiveTab] = useState<"catalog" | "mine">("catalog");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<VoucherCategory | "all">("all");
  const [sort, setSort] = useState<"newest" | "cheapest" | "popular">("newest");
  const [redeemTarget, setRedeemTarget] = useState<Voucher | null>(null);

  const ownedIds = new Set(
    userVouchers.filter((uv) => uv.status === "active").map((uv) => uv.voucherId)
  );

  const filtered = vouchers
    .filter((v) => {
      if (category !== "all" && v.category !== category) return false;
      if (search && !v.title.toLowerCase().includes(search.toLowerCase()) && !v.partner.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "cheapest") return a.xpCost - b.xpCost;
      if (sort === "popular") return b.stock - a.stock;
      return 0;
    });

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-[#1A1A1A] sm:text-2xl">Green Marketplace 🌱</h1>
            <p className="mt-0.5 text-sm text-gray-500">Tukarkan EcoPoints kamu dengan reward nyata dari partner PACUL</p>
          </div>
          {/* XP Balance sticky badge */}
          <div className="flex items-center gap-2 rounded-2xl border border-[#A8D5BA] bg-[#F0FAF4] px-4 py-2.5 shadow-sm">
            <span className="text-lg">⭐</span>
            <div>
              <p className="text-[10px] font-semibold text-gray-500">Saldo XP</p>
              <p className="text-base font-extrabold text-[#2D5F3F]">{userXp.toLocaleString("id-ID")} XP</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-1">
          {(["catalog", "mine"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-semibold transition-colors",
                activeTab === t ? "bg-white text-[#2D5F3F] shadow-sm" : "text-gray-500 hover:text-[#2D5F3F]"
              )}
            >
              {t === "catalog" ? "📋 Katalog" : `🎫 Voucherku (${userVouchers.filter(uv => uv.status === "active").length})`}
            </button>
          ))}
        </div>

        {activeTab === "catalog" && (
          <>
            {/* Search + sort */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari voucher..."
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#2D5F3F]"
              >
                <option value="newest">Terbaru</option>
                <option value="cheapest">XP Terendah</option>
                <option value="popular">Terpopuler</option>
              </select>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                    category === c.id
                      ? "bg-[#2D5F3F] text-white shadow-sm"
                      : "bg-[#F9FAFB] text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <span>{c.emoji}</span> {c.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-[#E5E7EB] py-16 text-center">
                <p className="text-3xl">🔍</p>
                <p className="mt-2 font-semibold text-gray-500">Tidak ada voucher ditemukan</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((v) => (
                  <VoucherCard
                    key={v.id}
                    voucher={v}
                    userXp={userXp}
                    owned={ownedIds.has(v.id)}
                    onRedeem={setRedeemTarget}
                  />
                ))}
              </motion.div>
            )}
          </>
        )}

        {activeTab === "mine" && <MyVouchersTab userVouchers={userVouchers} />}
      </div>

      {/* Redeem modal */}
      <AnimatePresence>
        {redeemTarget && (
          <RedeemModal
            voucher={redeemTarget}
            userXp={userXp}
            onClose={() => setRedeemTarget(null)}
            onSuccess={(uv) => {
              toast.success(`🎉 Voucher "${uv.voucher.title}" berhasil diredeem!`);
            }}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
