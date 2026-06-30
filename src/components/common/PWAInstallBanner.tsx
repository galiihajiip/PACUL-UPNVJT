"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      const timer = setTimeout(() => setShow(true), 30_000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === "accepted") {
      toast.success("PACUL berhasil diinstal! 🎉");
    }
    setShow(false);
    setPrompt(null);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 280 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-[#A8D5BA] bg-white px-4 py-3.5 shadow-2xl">
            <span className="text-2xl">📱</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1A1A1A]">Install PACUL</p>
              <p className="text-xs text-gray-500">Akses lebih cepat di perangkatmu</p>
            </div>
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 rounded-xl bg-[#2D5F3F] px-3 py-2 text-xs font-bold text-white hover:bg-[#245033] transition-colors"
            >
              <Download size={12} /> Install
            </button>
            <button
              onClick={() => setShow(false)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
