"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth.store";
import Cookies from "js-cookie";

const GUEST_USER = {
  id: "guest",
  name: "Tamu PACUL",
  email: "tamu@pacul.app",
  level: 5,
  current_xp: 1250,
  total_xp: 4200,
  city: "Surabaya",
  district: "Wonokromo",
  role: "user",
  avatarColor: "#2D5F3F",
  joinedAt: new Date().toISOString(),
} as const;

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const { loginMutation } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    Cookies.set("pacul_token", "guest_token_demo", { expires: 1, sameSite: "lax" });
    localStorage.setItem("pacul_token", "guest_token_demo");
    setUser(GUEST_USER as Parameters<typeof setUser>[0]);
    window.location.href = "/dashboard";
  };

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await loginMutation.mutateAsync({ email: values.email, password: values.password });
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel (desktop only) ── */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col items-center justify-center gap-8 p-12"
        style={{ background: "linear-gradient(145deg, #1a3d28 0%, #2D5F3F 55%, #3a7a52 100%)" }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src="/logo-white.png" alt="PACUL" width={180} height={60} className="h-16 w-auto object-contain" />
          <p className="text-lg font-medium text-white/70">Platform Aksi Komunitas untuk Lingkungan</p>
        </div>

        <div className="w-full max-w-xs rounded-2xl bg-white/10 p-6 text-white/80 backdrop-blur">
          <p className="text-sm italic leading-relaxed">
            &ldquo;Setiap aksi kecil yang kamu lakukan hari ini adalah investasi besar untuk bumi esok hari.&rdquo;
          </p>
        </div>

        {/* Decorative SVG tree */}
        <svg viewBox="0 0 200 180" className="w-48 opacity-20" aria-hidden="true">
          <rect x="90" y="120" width="20" height="50" fill="white" rx="4" />
          <ellipse cx="100" cy="80" rx="55" ry="65" fill="white" />
          <ellipse cx="65" cy="100" rx="35" ry="40" fill="white" />
          <ellipse cx="135" cy="100" rx="35" ry="40" fill="white" />
        </svg>
      </div>

      {/* ── Right panel — Form ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center justify-center lg:hidden">
          <Image src="/logo.png" alt="PACUL" width={140} height={48} className="h-12 w-auto object-contain" />
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Selamat Datang Kembali 👋</h2>
            <p className="mt-1 text-sm text-gray-500">Masuk ke akun PACUL kamu</p>
          </div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="kamu@email.com"
                  {...register("email")}
                  className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1 text-xs text-red-500"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1 text-xs text-red-500"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loginMutation.isPending}
              whileTap={{ scale: 0.98 }}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2D5F3F] py-3 text-sm font-semibold text-white transition hover:bg-[#245033] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-2"
            >
              {loginMutation.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Masuk...
                </>
              ) : "Masuk"}
            </motion.button>

          </motion.form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-[#E5E7EB]" />
            <span className="text-xs text-gray-400">atau</span>
            <div className="flex-1 border-t border-[#E5E7EB]" />
          </div>

          {/* Guest login */}
          <motion.button
            type="button"
            onClick={handleGuestLogin}
            disabled={guestLoading}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#2D5F3F] py-3 text-sm font-semibold text-[#2D5F3F] transition hover:bg-[#F0FAF4] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-2"
          >
            {guestLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2D5F3F]/30 border-t-[#2D5F3F]" />
                Masuk...
              </>
            ) : (
              <>
                <Users size={16} />
                Masuk sebagai Tamu
              </>
            )}
          </motion.button>

          {/* Demo credentials info */}
          <div className="mt-5 rounded-xl border border-[#A8D5BA] bg-[#F0FAF4] px-4 py-3">
            <p className="mb-1.5 text-xs font-semibold text-[#2D5F3F]">🧪 Akun Demo (login biasa)</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Email: <span className="font-mono font-semibold text-[#1A1A1A]">demo@pacul.app</span></p>
                <p className="text-xs text-gray-600">Password: <span className="font-mono font-semibold text-[#1A1A1A]">Demo1234!</span></p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setValue("email", "demo@pacul.app", { shouldValidate: true });
                  setValue("password", "Demo1234!", { shouldValidate: true });
                }}
                className="rounded-lg bg-[#2D5F3F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#245033] transition-colors"
              >
                Isi Otomatis
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-[#2D5F3F] hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
