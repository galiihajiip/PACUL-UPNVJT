"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useGovAuthStore } from "@/store/govAuth.store";

export default function GovLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useGovAuthStore((s) => s.login);
  const router = useRouter();

  const isGovEmail = email.endsWith("@surabaya.go.id") || email.endsWith("@pacul.gov.id");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error ?? "Login gagal.");
    } else {
      toast.success("Selamat datang di Dashboard Pemerintah 👋");
      router.push("/gov/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1A2E] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#162237] shadow-2xl"
      >
        {/* Header band */}
        <div className="bg-gradient-to-r from-[#1B3A5C] to-[#2D5F3F] px-8 py-6 text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="text-3xl">🌿</span>
            <div className="h-8 w-px bg-white/30" />
            <ShieldCheck size={28} className="text-white/80" />
          </div>
          <h1 className="text-lg font-extrabold text-white">PACUL — Portal Pemerintah</h1>
          <p className="mt-0.5 text-xs text-white/60">Dinas Kebersihan &amp; Lingkungan Kota Surabaya</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-8 py-7">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-400">Email Pemerintah</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@surabaya.go.id"
                required
                className="w-full rounded-xl border border-white/10 bg-[#1E2E45] px-4 py-3 pr-28 text-sm text-white placeholder-gray-500 outline-none focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/30"
              />
              {isGovEmail && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#2D5F3F]/20 px-2 py-0.5 text-[9px] font-bold text-[#7AC74F]">
                  Akun Pemerintah ✓
                </span>
              )}
            </div>
            <p className="mt-1 text-[10px] text-gray-500">Gunakan @surabaya.go.id atau @pacul.gov.id</p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-400">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-white/10 bg-[#1E2E45] px-4 py-3 pr-11 text-sm text-white placeholder-gray-500 outline-none focus:border-[#2D5F3F] focus:ring-2 focus:ring-[#2D5F3F]/30"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2D5F3F] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#245033] disabled:bg-white/10 disabled:text-white/30"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </button>

          <p className="text-center text-xs text-gray-600">
            Akun warga?{" "}
            <a href="/login" className="font-semibold text-[#7AC74F] hover:underline">Login PACUL biasa</a>
          </p>
        </form>

        <div className="border-t border-white/5 px-8 py-4 text-center">
          <p className="text-[10px] text-gray-600">Demo: gunakan email @surabaya.go.id + password apapun (min 6 karakter)</p>
        </div>
      </motion.div>
    </div>
  );
}
