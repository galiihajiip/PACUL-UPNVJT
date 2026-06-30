"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, Loader2, ChevronDown, RefreshCw } from "lucide-react";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/utils/constants";
import { toast } from "sonner";
import { useEcoActionStore } from "@/store/ecoAction.store";
import { useUserStore } from "@/store/userStore";

/* ── Types ── */
type UploadState = "idle" | "uploading" | "analyzing" | "success" | "error";

const CHALLENGES = [
  "Kurangi Listrik 20%",
  "Zero Waste 7 Hari",
  "Transportasi Umum 10x",
  "Tanam Pohon",
];

const STEPS = ["UPLOAD", "ANALISIS AI", "HASIL"];

/* ── helpers ── */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ── Simple CSS confetti ── */
function Confetti() {
  const COLORS = ["#7AC74F", "#2D5F3F", "#F59E0B", "#10B981", "#A8D5BA"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]" aria-hidden>
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 rounded-sm"
          style={{
            backgroundColor: COLORS[i % COLORS.length],
            left: `${(i * 4.2) % 100}%`,
            top: "-8px",
            opacity: 0,
            animation: `confettiFall ${0.9 + (i % 4) * 0.3}s ease-in ${(i % 8) * 0.12}s forwards`,
            transform: `rotate(${i * 15}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Step Indicator ── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-7 flex items-center justify-center gap-0">
      {STEPS.map((label, i) => {
        const done = current > i;
        const active = current === i;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                style={{
                  backgroundColor: done ? "#10B981" : active ? "#2D5F3F" : "#E5E7EB",
                  color: done || active ? "#fff" : "#9CA3AF",
                }}
              >
                {done ? <CheckCircle size={14} /> : i + 1}
              </span>
              <span
                className="text-[9px] font-semibold tracking-wide"
                style={{ color: active ? "#2D5F3F" : done ? "#10B981" : "#9CA3AF" }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="mx-2 mb-4 h-0.5 w-16 transition-all duration-500"
                style={{ backgroundColor: done ? "#10B981" : "#E5E7EB" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Upload Progress Bar ── */
function UploadProgress() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-sm font-medium text-gray-600">Mengupload foto...</p>
      <div
        className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-label="Progress upload foto"
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-[#2D5F3F]"
          style={{ animation: "uploadBar 1.4s ease-in-out forwards" }}
        />
      </div>
      <style>{`
        @keyframes uploadBar {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

/* ── Analyzing Spinner ── */
function AnalyzingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Loader2 size={36} style={{ color: "#2D5F3F" }} />
      </motion.div>
      <p className="text-sm font-medium text-gray-600">
        AI sedang menganalisis foto kamu...
      </p>
    </div>
  );
}

/* ── Success Result ── */
function SuccessResult({ onReset, challengeId, onClaimed }: { onReset: () => void; challengeId: string; onClaimed: () => void }) {
  const claimReward = useEcoActionStore((s) => s.claimReward);
  const awardXP = useUserStore((s) => s.awardXP);
  const incrementChallengesCompleted = useUserStore((s) => s.incrementChallengesCompleted);
  const challenges = useEcoActionStore((s) => s.challenges);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    if (claimed) return;
    const challenge = challenges.find((c) => c.id === challengeId);
    const xpReward = challenge?.xpReward ?? 150;
    claimReward(challengeId);
    awardXP(xpReward, "challenge_complete", `Tantangan "${challenge?.title ?? ""}" diselesaikan`);
    incrementChallengesCompleted();
    toast.success(`+${xpReward} XP earned! Reward diklaim. 🌱`);
    setClaimed(true);
    onClaimed();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4 py-2"
    >
      {/* AI badge */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-[#10B981]/15 px-3 py-1 text-xs font-bold text-[#10B981]">
          <CheckCircle size={12} /> TERVERIFIKASI
        </span>
        <span className="text-xs text-gray-400">oleh PACUL AI</span>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">
        Foto meteruan listrik terbaca. Penghematan terdeteksi.
      </p>

      {/* Confidence score */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-gray-600">Confidence Score</span>
          <span className="font-bold text-[#10B981]">98.4%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-label="Confidence score AI verifikasi"
          aria-valuenow={98}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "98.4%" }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="h-full rounded-full bg-[#10B981]"
          />
        </div>
      </div>

      {/* Reward */}
      <div className="flex items-center gap-2 rounded-lg bg-[#7AC74F]/10 px-3 py-2.5">
        <span className="text-xs font-medium text-gray-600">Reward Tersedia:</span>
        <span className="rounded-full bg-[#7AC74F] px-2.5 py-0.5 text-xs font-bold text-white">
          +150 XP &amp; Badge Green Saver
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={handleClaim}
        disabled={claimed}
        className="w-full rounded-md py-3 text-sm font-bold text-white transition-colors hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#2D5F3F" }}
      >
        {claimed ? "Reward Diklaim ✓" : "Klaim Reward Sekarang"}
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        <RefreshCw size={11} /> Upload lagi
      </button>
    </motion.div>
  );
}

/* ── Main Component ── */
export default function BuktikanAksimu() {
  const challenges = useEcoActionStore((s) => s.challenges);
  const joinedChallenges = challenges.filter((c) => c.isJoined);
  const selectableChallenges = joinedChallenges.length > 0 ? joinedChallenges.map((c) => c.title) : CHALLENGES;
  const getChallengeId = (title: string) => challenges.find((c) => c.title === title)?.id ?? "c1";

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Trigger confetti on success */
  useEffect(() => {
    if (uploadState === "success") {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(t);
    }
  }, [uploadState]);

  /* Step index derived from state */
  const stepIndex =
    uploadState === "idle" || uploadState === "error"
      ? 0
      : uploadState === "uploading"
      ? 0
      : uploadState === "analyzing"
      ? 1
      : 2;

  const handleClaimed = () => {
    setTimeout(() => handleReset(), 1500);
  };

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type as "image/jpeg" | "image/png")) {
      setFileError("Hanya JPG dan PNG yang diterima.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Ukuran file maksimal 5MB.");
      return false;
    }
    setFileError(null);
    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return;
    setUploadedFile(file);
    handleUpload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpload = async () => {
    setUploadState("uploading");
    await delay(1500);
    setUploadState("analyzing");
    await delay(2000);
    setUploadState("success");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleReset = () => {
    setUploadState("idle");
    setUploadedFile(null);
    setFileError(null);
  };

  const currentStep = uploadState === "uploading" ? 0 : uploadState === "analyzing" ? 1 : uploadState === "success" ? 2 : 0;

  return (
    <div className="relative rounded-[12px] border border-[#E5E7EB] bg-white p-7 shadow-sm">
      {showConfetti && <Confetti />}

      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-[#1A1A1A]">Buktikan Aksimu</h3>
        <p className="mt-0.5 text-sm text-gray-400">
          Upload foto untuk verifikasi otomatis dan claim XP kamu.
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={currentStep} />

      {/* Challenge selector */}
      <div className="relative mb-5">
        <label htmlFor="bukti-challenge" className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Pilih Tantangan
        </label>
        <div className="relative">
          <select
            id="bukti-challenge"
            value={selectedChallenge}
            onChange={(e) => setSelectedChallenge(e.target.value)}
            disabled={uploadState !== "idle"}
            className="w-full appearance-none rounded-md border border-[#A8D5BA] bg-white px-3 py-2.5 pr-9 text-sm text-[#1A1A1A] outline-none focus:border-[#2D5F3F] focus:ring-1 focus:ring-[#2D5F3F] disabled:opacity-50"
          >
            <option value="">-- Pilih tantangan --</option>
            {CHALLENGES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Content area */}
      <AnimatePresence mode="wait">
        {uploadState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              aria-label="Upload bukti foto — klik atau seret file ke sini"
              className="flex cursor-pointer flex-col items-center gap-3 rounded-lg px-6 py-12 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-2"
              style={{
                border: `2px dashed ${dragOver ? "#2D5F3F" : "#A8D5BA"}`,
                backgroundColor: dragOver ? "rgba(45,95,63,0.04)" : "transparent",
              }}
            >
              <Upload size={36} style={{ color: dragOver ? "#2D5F3F" : "#9CA3AF" }} />
              <div>
                <p className="text-sm font-semibold text-gray-700">Upload Bukti Foto</p>
                <p className="mt-0.5 text-xs text-gray-400">Maksimal 5MB (JPG, PNG)</p>
              </div>
              {uploadedFile && (
                <p className="text-xs text-[#2D5F3F]">{uploadedFile.name}</p>
              )}
            </div>
            {fileError && (
              <p className="mt-2 text-xs text-[#EF4444]">{fileError}</p>
            )}
          </motion.div>
        )}

        {uploadState === "uploading" && (
          <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UploadProgress />
          </motion.div>
        )}

        {uploadState === "analyzing" && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalyzingSpinner />
          </motion.div>
        )}

        {uploadState === "success" && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SuccessResult onReset={handleReset} challengeId={getChallengeId(selectedChallenge)} onClaimed={handleClaimed} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
