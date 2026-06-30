"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const DEMO_EMAIL = "demo@pacul.app";
const DEMO_PASSWORD = "Demo1234!";

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [showManualLogin, setShowManualLogin] = useState(false);
  const { loginMutation } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const handleQuickLogin = async () => {
    try {
      await loginMutation.mutateAsync({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      await loginMutation.mutateAsync({ email: values.email, password: values.password });
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const isLoading = loginMutation.isPending;

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

        <svg viewBox="0 0 200 180" className="w-48 opacity-20" aria-hidden="true">
          <rect x="90" y="120" width="20" height="50" fill="white" rx="4" />
          <ellipse cx="100" cy="80" rx="55" ry="65" fill="white" />
          <ellipse cx="65" cy="100" rx="35" ry="40" fill="white" />
          <ellipse cx="135" cy="100" rx="35" ry="40" fill="white" />
        </svg>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 lg:px-16">
        <div className="mb-8 flex items-center justify-center lg:hidden">
          <Image src="/logo.png" alt="PACUL" width={140} height={48} className="h-12 w-auto object-contain" />
        </div>

        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Selamat Datang 👋</h2>
            <p className="mt-1 text-sm text-gray-500">Masuk dan mulai aksi hijau kamu hari ini</p>
          </div>

          {/* Single quick login */}
          <motion.button
            type="button"
            onClick={handleQuickLogin}
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2D5F3F] py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#245033] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5F3F] focus-visible:ring-offset-2"
          >
            {isLoading && !showManualLogin ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Masuk...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Coba Akun Demo
              </>
            )}
          </motion.button>

          <p className="mt-3 text-center text-[11px] text-gray-400">
            Akun demo cepat · pakai email &amp; password kamu di bawah untuk akun yang sudah didaftarkan
          </p>

          {/* Optional manual login */}
          <button
            type="button"
            onClick={() => setShowManualLogin((v) => !v)}
            className="mt-6 flex w-full items-center justify-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#2D5F3F] transition-colors"
          >
            {showManualLogin ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showManualLogin ? "Tutup login manual" : "Masuk dengan email & password"}
          </button>

          <AnimatePresence>
            {showManualLogin && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4 flex flex-col gap-4 overflow-hidden"
                noValidate
              >
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
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#2D5F3F] py-2.5 text-sm font-semibold text-[#2D5F3F] transition hover:bg-[#F0FAF4] disabled:opacity-60"
                >
                  {isLoading ? "Masuk..." : "Masuk"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-6 text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-[#2D5F3F] hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
