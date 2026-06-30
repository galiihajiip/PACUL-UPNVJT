"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, User, Menu, X, Pencil, LogOut, CheckCheck } from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/useAuth";
import { PUBLIC_NAV } from "@/config/navigation";
import { teamConfig } from "@/config/site";

const MOCK_NOTIFS = [
  { id: "n1", text: "Tantangan 'Zero Waste' berakhir dalam 2 hari!", time: "1j lalu", read: false },
  { id: "n2", text: "Badge baru: Energy Saver 🏅 diraih!", time: "3j lalu", read: false },
  { id: "n3", text: "Tetanggamu baru saja beraksi di Wonokromo 👥", time: "5j lalu", read: true },
  { id: "n4", text: "Kamu mendapat +150 XP dari upload bukti foto!", time: "1h lalu", read: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logoutMutation } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const close = () => setMobileOpen(false);
  const unreadCount = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <>
      <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "#2D5F3F" }}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image src="/logo-white.png" alt="PACUL" width={120} height={40} className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden items-center gap-1 md:flex">
            {PUBLIC_NAV.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "text-white after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-[#7AC74F]"
                        : "text-white/70 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                aria-label="Notifikasi"
                aria-expanded={notifOpen}
                onClick={() => { setNotifOpen((v) => !v); setUserOpen(false); }}
                className="relative rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[#E5E7EB] bg-white shadow-xl"
                    role="dialog"
                    aria-label="Panel notifikasi"
                  >
                    <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
                      <span className="text-sm font-semibold text-[#1A1A1A]">Notifikasi</span>
                      <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-[#2D5F3F] hover:underline">
                        <CheckCheck size={12} /> Tandai semua dibaca
                      </button>
                    </div>
                    <ul className="max-h-72 overflow-y-auto divide-y divide-[#F3F4F6]">
                      {notifs.map((n) => (
                        <li key={n.id} className={cn("px-4 py-3 text-sm", !n.read && "bg-[#F0FAF4]")}>
                          <p className="leading-snug text-[#1A1A1A]">{n.text}</p>
                          <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-[#E5E7EB] px-4 py-2.5 text-center">
                      <Link href="/dashboard" onClick={() => setNotifOpen(false)} className="text-xs font-medium text-[#2D5F3F] hover:underline">
                        Lihat semua
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User avatar dropdown */}
            <div className="relative" ref={userRef}>
              <button
                aria-label="Menu profil"
                aria-expanded={userOpen}
                onClick={() => { setUserOpen((v) => !v); setNotifOpen(false); }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {user ? user.avatarInitials : <User size={16} />}
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#E5E7EB] bg-white shadow-xl"
                  >
                    {user && (
                      <div className="border-b border-[#E5E7EB] px-4 py-3">
                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    )}
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile/edit"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F9FAFB]"
                      >
                        <Pencil size={14} className="text-gray-400" /> Edit Profil
                      </Link>
                    </div>
                    <div className="border-t border-[#E5E7EB] py-1">
                      <button
                        onClick={() => { setUserOpen(false); logoutMutation.mutate(); }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/dashboard" className="ml-2 rounded-md border border-white px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#2D5F3F]">
              DASHBOARD
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="rounded-md p-2 text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label="Buka menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      {/* Mobile drawer + overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/50"
              onClick={close}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu navigasi"
              className="fixed inset-y-0 left-0 z-[70] flex w-[260px] flex-col bg-[#2D5F3F] shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                <Link href="/" onClick={close} className="flex items-center">
                  <Image src="/logo-white.png" alt="PACUL" width={120} height={40} className="h-10 w-auto object-contain" />
                </Link>
                <button onClick={close} aria-label="Tutup menu" className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="flex flex-col gap-1">
                  {PUBLIC_NAV.map((link, i) => {
                    const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={close}
                          className={cn(
                            "block rounded-md px-4 py-3 text-sm font-medium transition-colors",
                            isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Drawer footer */}
              <div className="border-t border-white/10 p-4">
                <Link
                  href="/dashboard"
                  onClick={close}
                  className="block w-full rounded-md border border-white py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#2D5F3F]"
                >
                  DASHBOARD
                </Link>
                <p className="mt-3 text-center text-xs text-white/40">© 2026 PACUL · {teamConfig.name}</p>
                <p className="mt-0.5 text-center text-[10px] text-white/30">{teamConfig.competition}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
