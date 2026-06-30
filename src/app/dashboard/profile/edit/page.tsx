"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Lock, Eye, EyeOff, ChevronDown, ChevronUp, Trash2, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import Link from "next/link";
import PageWrapper from "@/components/common/PageWrapper";
import type { UserPreferences } from "@/store/auth.store";

const JATIM_CITIES = [
  "Surabaya","Malang","Gresik","Sidoarjo","Mojokerto","Pasuruan",
  "Probolinggo","Jember","Kediri","Blitar","Madiun","Banyuwangi","Lainnya",
];

const AVATAR_COLORS = ["#2D5F3F","#7AC74F","#A8D5BA","#F4A261","#F59E0B","#6366F1"];

const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  location: z.string().min(1, "Pilih kota"),
  kecamatan: z.string().optional(),
  bio: z.string().max(150, "Bio maksimal 150 karakter").optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const pwSchema = z.object({
  current_password: z.string().min(1, "Wajib diisi"),
  password: z.string().min(8, "Minimal 8 karakter"),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Password tidak cocok", path: ["password_confirmation"],
});
type PwForm = z.infer<typeof pwSchema>;

function getStrength(pw: string) {
  if (pw.length < 8) return { score: 1, color: "#EF4444", label: "Sangat Lemah" };
  const n = /\d/.test(pw), s = /[^a-zA-Z0-9]/.test(pw), u = /[A-Z]/.test(pw);
  if (n && s && u) return { score: 4, color: "#2D5F3F", label: "Kuat" };
  if (n && s) return { score: 3, color: "#7AC74F", label: "Sedang" };
  if (n || s) return { score: 2, color: "#F59E0B", label: "Lemah" };
  return { score: 1, color: "#EF4444", label: "Sangat Lemah" };
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-2"
      style={{ backgroundColor: checked ? "#2D5F3F" : "#D1D5DB" }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform"
        style={{ transform: checked ? "translateX(1.375rem)" : "translateX(0.125rem)" }}
      />
    </button>
  );
}

export default function ProfileEditPage() {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl ?? null);
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor ?? AVATAR_COLORS[0]);
  const [prefs, setPrefs] = useState<UserPreferences>({
    notifications: true,
    publicProfile: true,
    weeklyReport: true,
    badgeNotifications: true,
    ...user?.preferences,
  });
  const [showPwSection, setShowPwSection] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      location: user?.location ?? "",
      kecamatan: user?.kecamatan ?? "",
      bio: user?.bio ?? "",
    },
  });

  const pwForm = useForm<PwForm>({ resolver: zodResolver(pwSchema) });
  const bioVal = watch("bio") ?? "";
  const newPw = pwForm.watch("password") ?? "";
  const strength = getStrength(newPw);

  const debouncedSave = useCallback((data: ProfileForm) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    setSaveStatus("saving");
    const t = setTimeout(async () => {
      try {
        await authService.updateProfile({ ...data, preferences: prefs, avatarColor });
        updateUser({ ...data, preferences: prefs, avatarColor });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);
      } catch {
        updateUser({ ...data, preferences: prefs, avatarColor });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);
      }
    }, 1500);
    setDebounceTimer(t);
  }, [debounceTimer, prefs, avatarColor, updateUser]);

  useEffect(() => {
    return () => { if (debounceTimer) clearTimeout(debounceTimer); };
  }, [debounceTimer]);

  const onProfileChange = handleSubmit(debouncedSave, () => {});

  const handleAvatarFile = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) { toast.error("Ukuran foto maks. 2MB"); return; }
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setUploadingAvatar(true);
    try {
      const { avatar_url } = await authService.uploadAvatar(file);
      updateUser({ avatarUrl: avatar_url });
      toast.success("Foto profil berhasil diupload");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePw = async (data: PwForm) => {
    try {
      await authService.changePassword(data);
      toast.success("Password berhasil diubah");
      pwForm.reset();
      setShowPwSection(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gagal mengubah password");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInput !== "HAPUS") return;
    try {
      await authService.deleteAccount();
      useAuthStore.getState().logout();
      window.location.href = "/login";
    } catch {
      toast.error("Gagal menghapus akun");
    }
  };

  const togglePref = (key: keyof UserPreferences) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
  };

  const initials = user ? (user.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()) : "??";

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1A1A1A] sm:text-2xl">Edit Profil</h1>
            <p className="mt-0.5 text-sm text-gray-500">Kelola informasi dan preferensi akunmu</p>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {saveStatus === "saving" && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Loader2 size={12} className="animate-spin" /> Menyimpan...
                </motion.span>
              )}
              {saveStatus === "saved" && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-[#2D5F3F]">
                  <Check size={12} /> Tersimpan
                </motion.span>
              )}
            </AnimatePresence>
            <Link href="/dashboard/profile" className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
              ← Kembali
            </Link>
          </div>
        </div>

        {/* SECTION 1 — Avatar */}
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-[#1A1A1A]">Foto Profil</h2>
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="relative">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Foto profil" width={96} height={96} className="h-24 w-24 rounded-full object-cover" unoptimized />
              ) : (
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-extrabold text-white shadow"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </div>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <Loader2 size={20} className="animate-spin text-white" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg border border-[#2D5F3F] px-3 py-1.5 text-xs font-medium text-[#2D5F3F] hover:bg-[#F0FAF4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-2"
                >
                  <Camera size={14} /> Ganti Foto
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => { setAvatarPreview(null); updateUser({ avatarUrl: undefined }); }}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  >
                    <Trash2 size={14} /> Hapus Foto
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarFile(f); }}
              />
              {!avatarPreview && (
                <div>
                  <p className="mb-1.5 text-xs text-gray-500">Warna avatar</p>
                  <div className="flex gap-1.5">
                    {AVATAR_COLORS.map((c) => (
                      <button
                        key={c} type="button"
                        onClick={() => { setAvatarColor(c); updateUser({ avatarColor: c }); }}
                        aria-label={`Pilih warna ${c}`}
                        className="h-7 w-7 rounded-full border-2 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-1"
                        style={{ backgroundColor: c, borderColor: avatarColor === c ? "#1A1A1A" : "transparent", transform: avatarColor === c ? "scale(1.2)" : "scale(1)" }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <p className="text-[11px] text-gray-400">Maks. 2MB. Format: JPG, PNG, WebP</p>
            </div>
          </div>
        </div>

        {/* SECTION 2 — Info Pribadi */}
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-[#1A1A1A]">Informasi Pribadi</h2>
          <form onChange={onProfileChange} className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label htmlFor="edit-name" className="mb-1.5 block text-xs font-medium text-gray-600">Nama Lengkap</label>
              <input
                id="edit-name"
                {...register("name")}
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email — disabled */}
            <div className="sm:col-span-2">
              <label htmlFor="edit-email" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                Email
                <Lock size={11} className="text-gray-400" aria-hidden="true" />
                <span className="font-normal text-gray-400">(tidak dapat diubah)</span>
              </label>
              <input
                id="edit-email"
                type="email"
                value={user?.email ?? ""}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-[#E5E7EB] bg-gray-50 px-3 py-2.5 text-sm text-gray-400"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="edit-location" className="mb-1.5 block text-xs font-medium text-gray-600">Kota</label>
              <select
                id="edit-location"
                {...register("location")}
                className="w-full appearance-none rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
              >
                {JATIM_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Kecamatan */}
            <div>
              <label htmlFor="edit-kecamatan" className="mb-1.5 block text-xs font-medium text-gray-600">Kecamatan</label>
              <input
                id="edit-kecamatan"
                {...register("kecamatan")}
                placeholder="Opsional"
                className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
              />
            </div>

            {/* Bio */}
            <div className="sm:col-span-2">
              <label htmlFor="edit-bio" className="mb-1.5 flex items-center justify-between text-xs font-medium text-gray-600">
                Bio
                <span className="font-normal text-gray-400">{bioVal.length}/150</span>
              </label>
              <textarea
                id="edit-bio"
                rows={3}
                maxLength={150}
                {...register("bio")}
                placeholder="Ceritakan kepedulianmu terhadap lingkungan..."
                className="w-full resize-none rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none transition focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
              />
            </div>
          </form>
        </div>

        {/* SECTION 3 — Preferensi */}
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-[#1A1A1A]">Preferensi</h2>
          <div className="flex flex-col gap-4">
            {([
              { key: "publicProfile" as const, label: "Profil Publik", desc: "Profilmu terlihat di leaderboard komunitas" },
              { key: "notifications" as const, label: "Notifikasi Email", desc: "Terima email update aktivitas" },
              { key: "weeklyReport" as const, label: "Laporan Mingguan", desc: "Ringkasan emisi karbon mingguanmu" },
              { key: "badgeNotifications" as const, label: "Notifikasi Badge", desc: "Notifikasi saat mendapatkan pencapaian baru" },
            ]).map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <Toggle
                  checked={prefs[key]}
                  onChange={() => togglePref(key)}
                  label={label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4 — Keamanan */}
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <button
            type="button"
            onClick={() => setShowPwSection((v) => !v)}
            className="flex w-full items-center justify-between focus-visible:outline-none"
            aria-expanded={showPwSection}
          >
            <h2 className="text-sm font-semibold text-[#1A1A1A]">Ganti Password</h2>
            {showPwSection ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>

          <AnimatePresence>
            {showPwSection && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={pwForm.handleSubmit(handleChangePw)}
                className="mt-4 flex flex-col gap-4 overflow-hidden"
                noValidate
              >
                {/* Current password */}
                <div>
                  <label htmlFor="pw-current" className="mb-1.5 block text-xs font-medium text-gray-600">Password Lama</label>
                  <div className="relative">
                    <input
                      id="pw-current"
                      type={showCurrentPw ? "text" : "password"}
                      {...pwForm.register("current_password")}
                      className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
                    />
                    <button type="button" onClick={() => setShowCurrentPw((v) => !v)}
                      aria-label={showCurrentPw ? "Sembunyikan" : "Tampilkan"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwForm.formState.errors.current_password && (
                    <p className="mt-1 text-xs text-red-500">{pwForm.formState.errors.current_password.message}</p>
                  )}
                </div>

                {/* New password */}
                <div>
                  <label htmlFor="pw-new" className="mb-1.5 block text-xs font-medium text-gray-600">Password Baru</label>
                  <div className="relative">
                    <input
                      id="pw-new"
                      type={showNewPw ? "text" : "password"}
                      {...pwForm.register("password")}
                      className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
                    />
                    <button type="button" onClick={() => setShowNewPw((v) => !v)}
                      aria-label={showNewPw ? "Sembunyikan" : "Tampilkan"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPw && (
                    <div className="mt-1.5">
                      <div className="flex gap-1">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
                            style={{ backgroundColor: i <= strength.score ? strength.color : "#E5E7EB" }} />
                        ))}
                      </div>
                      <p className="mt-0.5 text-[11px]" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}
                  {pwForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-500">{pwForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="pw-confirm" className="mb-1.5 block text-xs font-medium text-gray-600">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <input
                      id="pw-confirm"
                      type={showConfirmPw ? "text" : "password"}
                      {...pwForm.register("password_confirmation")}
                      className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 pr-10 text-sm outline-none transition focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
                    />
                    <button type="button" onClick={() => setShowConfirmPw((v) => !v)}
                      aria-label={showConfirmPw ? "Sembunyikan" : "Tampilkan"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwForm.formState.errors.password_confirmation && (
                    <p className="mt-1 text-xs text-red-500">{pwForm.formState.errors.password_confirmation.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={pwForm.formState.isSubmitting}
                  className="self-start rounded-lg bg-[#2D5F3F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#245033] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-2"
                >
                  {pwForm.formState.isSubmitting ? "Menyimpan..." : "Update Password"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION 5 — Danger Zone */}
        <div className="rounded-[12px] border border-red-200 bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold text-red-600">Zona Berbahaya</h2>
          <p className="mb-4 text-xs text-gray-400">Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.</p>
          <button
            type="button"
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            <Trash2 size={14} /> Hapus Akun
          </button>
        </div>
      </div>

      {/* Delete confirm dialog */}
      <AnimatePresence>
        {showDeleteDialog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title"
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h3 id="delete-dialog-title" className="text-base font-bold text-red-600">Hapus Akun Permanen</h3>
              <p className="mt-2 text-sm text-gray-600">
                Semua data akunmu akan dihapus secara permanen. Ketik <strong>HAPUS</strong> untuk konfirmasi.
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Ketik HAPUS"
                className="mt-4 w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
              />
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowDeleteDialog(false); setDeleteInput(""); }}
                  className="flex-1 rounded-lg border border-[#E5E7EB] py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={deleteInput !== "HAPUS"}
                  onClick={handleDeleteAccount}
                  className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                >
                  Hapus Akun
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
