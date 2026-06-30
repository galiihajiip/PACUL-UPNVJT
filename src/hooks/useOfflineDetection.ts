"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function useOfflineDetection() {
  useEffect(() => {
    const handleOffline = () => {
      toast.error("Kamu offline. Beberapa fitur mungkin tidak tersedia.", {
        id: "offline-toast",
        duration: Infinity,
      });
    };

    const handleOnline = () => {
      toast.dismiss("offline-toast");
      toast.success("Koneksi kembali! ✅");
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
