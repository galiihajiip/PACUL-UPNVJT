"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MapPin, Camera, Upload, X, Loader2, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useWasteReportStore, CATEGORY_CONFIG, SEVERITY_CONFIG, type WasteCategory, type WasteSeverity } from "@/store/wasteReport.store";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/utils/cn";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const SURABAYA_CENTER = { lat: -7.2575, lng: 112.7521 };

const CATEGORIES = Object.entries(CATEGORY_CONFIG) as [WasteCategory, typeof CATEGORY_CONFIG[WasteCategory]][];
const SEVERITIES = Object.entries(SEVERITY_CONFIG) as [WasteSeverity, typeof SEVERITY_CONFIG[WasteSeverity]][];

interface FormState {
  lat: number | null;
  lng: number | null;
  address: string;
  district: string;
  title: string;
  category: WasteCategory | "";
  severity: WasteSeverity | "";
  description: string;
  photos: File[];
  photoPreviews: string[];
  sumber: string;
}

const INITIAL: FormState = {
  lat: null, lng: null, address: "", district: "",
  title: "", category: "", severity: "", description: "",
  photos: [], photoPreviews: [], sumber: "Input manual",
};

/* ── confetti ── */
function Confetti() {
  const COLORS = ["#7AC74F","#2D5F3F","#F59E0B","#10B981","#A8D5BA"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {Array.from({ length: 32 }).map((_, i) => (
        <span key={i} className="absolute h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: COLORS[i % COLORS.length], left: `${(i * 3.2) % 100}%`, top: "-10px", opacity: 0,
            animation: `confettiFall ${1 + (i % 4) * 0.2}s ease-in ${(i % 8) * 0.1}s forwards`, transform: `rotate(${i * 15}deg)` }} />
      ))}
      <style>{`@keyframes confettiFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

/* ── Location picker map ── */
function LocationPickerMap({ lat, lng, onChange }: { lat: number | null; lng: number | null; onChange: (lat: number, lng: number) => void }) {
  const pos = lat && lng ? { lat, lng } : SURABAYA_CENTER;
  return MAPS_KEY ? (
    <APIProvider apiKey={MAPS_KEY}>
      <Map
        defaultCenter={SURABAYA_CENTER}
        defaultZoom={13}
        mapId="pacul-picker"
        gestureHandling="greedy"
        style={{ width: "100%", height: "240px", borderRadius: "12px" }}
        onClick={(e) => { if (e.detail.latLng) onChange(e.detail.latLng.lat, e.detail.latLng.lng); }}
      >
        {lat && lng && (
          <AdvancedMarker position={{ lat, lng }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2D5F3F] border-2 border-white shadow-lg text-lg">📍</div>
          </AdvancedMarker>
        )}
      </Map>
    </APIProvider>
  ) : (
    <div
      className="flex h-60 cursor-crosshair items-center justify-center rounded-xl border-2 border-dashed border-[#A8D5BA] bg-[#F0FAF4] text-center"
      onClick={() => onChange(SURABAYA_CENTER.lat + (Math.random() - 0.5) * 0.04, SURABAYA_CENTER.lng + (Math.random() - 0.5) * 0.04)}
    >
      <div>
        <MapPin size={32} className="mx-auto text-[#2D5F3F]" />
        <p className="mt-2 text-sm font-semibold text-[#2D5F3F]">{lat ? `📍 Pin diset` : "Klik untuk set lokasi"}</p>
        <p className="text-xs text-gray-400 mt-0.5">(Demo: tambahkan NEXT_PUBLIC_GOOGLE_MAPS_API_KEY untuk peta nyata)</p>
        {lat && <p className="mt-1 text-xs text-gray-500">{lat.toFixed(5)}, {lng?.toFixed(5)}</p>}
      </div>
    </div>
  );
}

/* ── Step indicator ── */
function StepBar({ step }: { step: number }) {
  const labels = ["Lokasi", "Detail", "Foto"];
  return (
    <div className="flex items-center gap-0">
      {labels.map((l, i) => (
        <div key={l} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all",
              i + 1 < step ? "bg-[#2D5F3F] text-white" : i + 1 === step ? "bg-[#2D5F3F] text-white ring-4 ring-[#2D5F3F]/20" : "bg-gray-100 text-gray-400")}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span className={cn("text-[10px] font-semibold", i + 1 <= step ? "text-[#2D5F3F]" : "text-gray-400")}>{l}</span>
          </div>
          {i < labels.length - 1 && (
            <div className={cn("mx-1 h-0.5 flex-1 rounded-full transition-all", i + 1 < step ? "bg-[#2D5F3F]" : "bg-gray-200")} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Main ── */
export default function CreateWasteReport({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ id: string } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const addReport = useWasteReportStore((s) => s.addReport);
  const updateUser = useAuthStore((s) => s.updateUser);
  const user = useAuthStore((s) => s.user);
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set_ = useCallback((patch: Partial<FormState>) => setForm((p) => ({ ...p, ...patch })), []);

  /* Geolocation */
  const handleGeolocate = () => {
    if (!navigator.geolocation) { toast.error("Geolocation tidak tersedia."); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        set_({ lat: latitude, lng: longitude, address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`, district: "Lokasi Saat Ini" });
        toast.success("Lokasi berhasil dideteksi!");
        setGeoLoading(false);
      },
      () => { toast.error("Gagal mendapatkan lokasi."); setGeoLoading(false); }
    );
  };

  /* Map click */
  const handleMapClick = (lat: number, lng: number) => {
    set_({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, district: "Surabaya" });
  };

  /* Photo handling */
  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 3 - form.photos.length);
    const previews = arr.map((f) => URL.createObjectURL(f));
    set_({ photos: [...form.photos, ...arr], photoPreviews: [...form.photoPreviews, ...previews] });
  };

  const removePhoto = (i: number) => {
    const photos = form.photos.filter((_, idx) => idx !== i);
    const previews = form.photoPreviews.filter((_, idx) => idx !== i);
    set_({ photos, photoPreviews: previews });
  };

  /* Validation */
  const step1Valid = form.lat !== null && form.lng !== null;
  const step2Valid = form.title.length >= 10 && form.category !== "" && form.severity !== "" && form.description.length >= 20;
  const step3Valid = form.photos.length >= 1;

  /* Submit */
  const handleSubmit = async () => {
    if (!step3Valid) { toast.error("Upload minimal 1 foto bukti."); return; }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    const report = addReport({
      title: form.title,
      description: form.description,
      category: form.category as WasteCategory,
      severity: form.severity as WasteSeverity,
      lat: form.lat!,
      lng: form.lng!,
      address: form.address,
      district: form.district,
      photoUrls: form.photoPreviews,
      reportedBy: user?.name ?? "Anonim",
    });

    if (user) updateUser({ xp: (user.xp ?? 0) + 50, totalXP: (user.totalXP ?? 0) + 50 });

    setSubmitted({ id: report.id });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2800);
    toast.success("+50 XP untuk kontribusimu! 🌿");
    setSubmitting(false);
  };

  /* Success view */
  if (submitted) {
    return (
      <>
        {showConfetti && <Confetti />}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-5 rounded-2xl bg-white p-8 text-center shadow-sm border border-[#A8D5BA]">
          <CheckCircle size={56} className="text-[#2D5F3F]" />
          <div>
            <h3 className="text-xl font-extrabold text-[#1A1A1A]">Laporan Berhasil Dikirim!</h3>
            <p className="mt-1 text-sm text-gray-500">Terima kasih atas kontribusimu untuk kebersihan Surabaya</p>
          </div>
          <div className="w-full rounded-xl bg-[#F0FAF4] px-4 py-3">
            <p className="text-xs text-gray-500">Nomor Laporan</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-[#2D5F3F]">{submitted.id.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#7AC74F]/15 px-4 py-2.5">
            <span className="text-xl">⭐</span>
            <p className="text-sm font-bold text-[#2D5F3F]">+50 XP untuk kontribusimu! 🌿</p>
          </div>
          <div className="flex w-full gap-3">
            <button onClick={() => { setForm(INITIAL); setSubmitted(null); setStep(1); }} className="flex-1 rounded-xl border border-[#E5E7EB] py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Buat Laporan Lain
            </button>
            <button onClick={onSuccess} className="flex-1 rounded-xl bg-[#2D5F3F] py-2.5 text-sm font-bold text-white hover:bg-[#245033]">
              Kembali ke Peta
            </button>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <StepBar step={step} />

      <AnimatePresence mode="wait">

        {/* ── STEP 1: LOKASI ── */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-[#1A1A1A]">Pilih Lokasi Laporan</h3>
              <p className="mb-4 text-xs text-gray-400">Klik pada peta atau gunakan GPS untuk menentukan lokasi</p>

              <LocationPickerMap lat={form.lat} lng={form.lng} onChange={handleMapClick} />

              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleGeolocate}
                  disabled={geoLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2D5F3F] py-2.5 text-sm font-semibold text-[#2D5F3F] hover:bg-[#F0FAF4] disabled:opacity-60 transition-colors"
                >
                  {geoLoading ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                  📍 Gunakan Lokasi Saya
                </button>
              </div>

              {form.lat && (
                <div className="mt-3 rounded-xl bg-[#F0FAF4] px-3 py-2.5">
                  <p className="text-xs font-semibold text-[#2D5F3F]">📍 Lokasi dipilih</p>
                  <p className="mt-0.5 text-xs text-gray-600">{form.address}</p>
                </div>
              )}

              <div className="mt-3">
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Atau masukkan alamat manual</label>
                <input
                  value={form.address}
                  onChange={(e) => set_({ address: e.target.value })}
                  placeholder="Jl. Contoh, Kecamatan, Surabaya..."
                  className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#2D5F3F] py-3.5 text-sm font-bold text-white disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              Selanjutnya <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {/* ── STEP 2: DETAIL ── */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Judul Laporan <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input
                    value={form.title}
                    onChange={(e) => set_({ title: e.target.value.slice(0, 100) })}
                    placeholder="Timbunan sampah di pinggir jalan..."
                    className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 pr-16 text-sm outline-none focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">{form.title.length}/100</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">Kategori <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CATEGORIES.map(([key, cfg]) => (
                    <button key={key} type="button" onClick={() => set_({ category: key })}
                      className={cn("flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs transition-all", form.category === key ? "border-[#2D5F3F] bg-[#F0FAF4] ring-1 ring-[#2D5F3F]" : "border-[#E5E7EB] hover:border-[#A8D5BA]")}>
                      <span className="text-lg">{cfg.emoji}</span>
                      <span className={cn("font-semibold text-[10px]", form.category === key ? "text-[#2D5F3F]" : "text-[#1A1A1A]")}>{cfg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">Tingkat Keparahan <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-4 gap-2">
                  {SEVERITIES.map(([key, cfg]) => (
                    <button key={key} type="button" onClick={() => set_({ severity: key })}
                      className={cn("flex flex-col items-center gap-1 rounded-xl border py-2.5 text-center text-[10px] font-bold transition-all", form.severity === key ? "ring-2" : "border-[#E5E7EB]")}
                      style={form.severity === key ? { borderColor: cfg.color, backgroundColor: cfg.bg, color: cfg.color } : {}}>
                      <span className="text-base">{cfg.emoji}</span>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Deskripsi Detail <span className="text-red-400">*</span></label>
                <div className="relative">
                  <textarea
                    value={form.description}
                    onChange={(e) => set_({ description: e.target.value.slice(0, 500) })}
                    placeholder="Jelaskan kondisi sampah, lokasi tepatnya, potensi bahaya, dsb..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
                  />
                  <span className={cn("absolute bottom-2 right-3 text-[10px]", form.description.length < 20 ? "text-red-400" : "text-gray-400")}>{form.description.length}/500</span>
                </div>
                {form.description.length > 0 && form.description.length < 20 && (
                  <p className="mt-1 text-[10px] text-red-400">Minimal 20 karakter ({20 - form.description.length} lagi)</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                <ChevronLeft size={16} /> Kembali
              </button>
              <button onClick={() => setStep(3)} disabled={!step2Valid}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2D5F3F] py-3 text-sm font-bold text-white disabled:bg-gray-200 disabled:text-gray-400">
                Selanjutnya <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: FOTO ── */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-[#1A1A1A]">Foto Bukti</h3>
              <p className="mb-4 text-xs text-gray-400">Min. 1 foto, maks. 3 foto | JPG, PNG, WEBP | Maks. 5MB</p>

              {form.photoPreviews.length < 3 && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                  <button onClick={() => fileRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#A8D5BA] py-4 text-sm font-semibold text-[#2D5F3F] hover:bg-[#F0FAF4] transition-colors">
                    <Upload size={16} /> Upload File
                  </button>
                  <button onClick={() => cameraRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#A8D5BA] py-4 text-sm font-semibold text-[#2D5F3F] hover:bg-[#F0FAF4] transition-colors">
                    <Camera size={16} /> 📷 Ambil Foto
                  </button>
                </div>
              )}

              {form.photoPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {form.photoPreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`foto ${i + 1}`} className="h-full w-full object-cover" />
                      <button onClick={() => removePhoto(i)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80">
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                  {form.photoPreviews.length < 3 && (
                    <button onClick={() => fileRef.current?.click()}
                      className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[#A8D5BA] text-2xl text-gray-300 hover:border-[#2D5F3F] hover:text-[#2D5F3F]">
                      +
                    </button>
                  )}
                </div>
              )}

              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => handlePhotos(e.target.files)} />
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => handlePhotos(e.target.files)} />
            </div>

            {/* Preview summary */}
            <div className="rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">Ringkasan Laporan</p>
              <div className="flex flex-col gap-1.5 text-xs text-gray-600">
                <p>📍 <strong>{form.address}</strong></p>
                <p>{CATEGORY_CONFIG[form.category as WasteCategory]?.emoji} {CATEGORY_CONFIG[form.category as WasteCategory]?.label} · {form.severity && SEVERITY_CONFIG[form.severity as WasteSeverity]?.emoji} {form.severity && SEVERITY_CONFIG[form.severity as WasteSeverity]?.label}</p>
                <p className="line-clamp-2 italic text-gray-500">&ldquo;{form.title}&rdquo;</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                <ChevronLeft size={16} /> Kembali
              </button>
              <button onClick={handleSubmit} disabled={!step3Valid || submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2D5F3F] py-3 text-sm font-bold text-white disabled:bg-gray-200 disabled:text-gray-400">
                {submitting ? <><Loader2 size={14} className="animate-spin" /> Mengirim...</> : "🚀 Kirim Laporan"}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
