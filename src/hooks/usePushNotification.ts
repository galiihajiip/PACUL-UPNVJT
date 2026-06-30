"use client";

import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from(Array.from(rawData).map((c) => c.charCodeAt(0))) as unknown as Uint8Array<ArrayBuffer>;
}

async function sendSubscriptionToServer(subscription: PushSubscription) {
  const token = document.cookie.match(/pacul_token=([^;]+)/)?.[1];
  if (!token || token.startsWith("demo_") || token === "guest_token_demo") return;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
  await fetch(`${apiUrl}/push/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      public_key: subscription.toJSON().keys?.p256dh,
      auth_token: subscription.toJSON().keys?.auth,
    }),
  });
}

export function usePushNotification() {
  const requestPermission = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      toast.error("Browser kamu tidak mendukung push notifications.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      try {
        const sw = await navigator.serviceWorker.ready;
        const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        if (!VAPID_KEY) {
          toast.success("Notifikasi diaktifkan! 🔔 (mode demo)");
          return;
        }

        const subscription = await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_KEY) as BufferSource,
        });

        await sendSubscriptionToServer(subscription);
        toast.success("Notifikasi PACUL aktif! 🔔");
      } catch {
        toast.error("Gagal mengaktifkan notifikasi. Coba lagi.");
      }
    } else if (permission === "denied") {
      toast.error("Izin notifikasi ditolak. Aktifkan di pengaturan browser.");
    }
  };

  const isSupported = typeof window !== "undefined"
    && "serviceWorker" in navigator
    && "PushManager" in window;

  return { requestPermission, isSupported };
}
