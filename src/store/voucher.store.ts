import { create } from "zustand";
import { persist } from "zustand/middleware";

export type VoucherCategory = "pangan" | "transport" | "lifestyle" | "energi" | "lingkungan";
export type VoucherStatus = "active" | "used" | "expired";

export interface Voucher {
  id: string;
  title: string;
  partner: string;
  xpCost: number;
  category: VoucherCategory;
  discount: string;
  stock: number;
  emoji: string;
  terms: string;
  expiryDays: number;
  description?: string;
}

export interface UserVoucher {
  id: string;
  voucherId: string;
  voucher: Voucher;
  uniqueCode: string;
  qrData: string;
  status: VoucherStatus;
  redeemedAt: string;
  expiresAt: string;
  usedAt?: string;
}

export const MOCK_VOUCHERS: Voucher[] = [
  { id: "1", title: "Diskon 20% Sayuran Organik", partner: "Pasar Organik Surabaya", xpCost: 300, category: "pangan", discount: "20%", stock: 50, emoji: "🥦", terms: "Min. pembelian Rp 100.000. Berlaku 30 hari.", expiryDays: 30, description: "Nikmati diskon 20% untuk semua produk sayuran organik segar dari petani lokal Surabaya." },
  { id: "2", title: "Gratis 1 Paket Indoor Plant Kit", partner: "GreenLife Store", xpCost: 1200, category: "lifestyle", discount: "FREE", stock: 20, emoji: "🌱", terms: "Satu kali redeem per akun.", expiryDays: 30, description: "Dapatkan kit tanaman indoor lengkap: pot, media tanam, dan bibit pilihan." },
  { id: "3", title: "Diskon 50% Tumbler Bambu Premium", partner: "EcoWare Indonesia", xpCost: 800, category: "lifestyle", discount: "50%", stock: 35, emoji: "🎋", terms: "Berlaku untuk pembelian pertama.", expiryDays: 14, description: "Tumbler ramah lingkungan berbahan bambu asli, bebas plastik." },
  { id: "4", title: "Gratis 5x Trip Suroboyo Bus", partner: "Suroboyo Bus", xpCost: 500, category: "transport", discount: "FREE", stock: 100, emoji: "🚌", terms: "Per akun. Berlaku 7 hari setelah redeem.", expiryDays: 7, description: "5 perjalanan gratis naik Suroboyo Bus rute mana saja." },
  { id: "5", title: "Cashback 15% Listrik Token", partner: "PLN Mobile", xpCost: 400, category: "energi", discount: "15%", stock: 200, emoji: "⚡", terms: "Max cashback Rp 50.000. Min. pembelian Rp 100.000.", expiryDays: 30, description: "Hemat tagihan listrik dengan cashback 15% pembelian token PLN." },
  { id: "6", title: "Free 1kg Kompos Organik", partner: "Bank Sampah Surabaya", xpCost: 200, category: "pangan", discount: "FREE", stock: 80, emoji: "🌾", terms: "Ambil langsung di bank sampah terdekat.", expiryDays: 60, description: "Kompos organik berkualitas untuk tanaman rumahmu, kontribusi nyata daur ulang sampah." },
  { id: "7", title: "Diskon 25% Solar Panel Konsultasi", partner: "SuryaGreen Energi", xpCost: 600, category: "energi", discount: "25%", stock: 15, emoji: "☀️", terms: "Berlaku untuk konsultasi pertama.", expiryDays: 30, description: "Konsultasi gratis pemasangan panel surya dan diskon 25% biaya survey." },
  { id: "8", title: "Free Tote Bag Daur Ulang", partner: "EcoFashion SBY", xpCost: 150, category: "lingkungan", discount: "FREE", stock: 120, emoji: "👜", terms: "Satu per akun. Ambil di toko.", expiryDays: 60, description: "Tote bag cantik dari bahan daur ulang botol plastik." },
];

function generateCode(): string {
  const rand = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PACUL-${rand()}-${rand()}-${rand()}`;
}

interface VoucherStore {
  vouchers: Voucher[];
  userVouchers: UserVoucher[];
  redeemVoucher: (voucherId: string, userXp: number) => { success: boolean; userVoucher?: UserVoucher; error?: string };
  markVoucherUsed: (userVoucherId: string) => void;
}

export const useVoucherStore = create<VoucherStore>()(
  persist(
    (set, get) => ({
      vouchers: MOCK_VOUCHERS,
      userVouchers: [],

      redeemVoucher: (voucherId, userXp) => {
        const { vouchers, userVouchers } = get();
        const voucher = vouchers.find((v) => v.id === voucherId);
        if (!voucher) return { success: false, error: "Voucher tidak ditemukan." };
        if (voucher.stock <= 0) return { success: false, error: "Stok habis." };
        if (userXp < voucher.xpCost) return { success: false, error: "XP tidak cukup." };
        const alreadyOwned = userVouchers.some(
          (uv) => uv.voucherId === voucherId && uv.status === "active"
        );
        if (alreadyOwned) return { success: false, error: "Kamu sudah memiliki voucher ini." };

        const uniqueCode = generateCode();
        const expiresAt = new Date(Date.now() + voucher.expiryDays * 86400_000).toISOString();
        const qrData = JSON.stringify({ code: uniqueCode, voucherId, expiry: expiresAt, partner: voucher.partner });

        const userVoucher: UserVoucher = {
          id: `uv-${Date.now()}`,
          voucherId,
          voucher,
          uniqueCode,
          qrData,
          status: "active",
          redeemedAt: new Date().toISOString(),
          expiresAt,
        };

        set((state) => ({
          vouchers: state.vouchers.map((v) =>
            v.id === voucherId ? { ...v, stock: v.stock - 1 } : v
          ),
          userVouchers: [userVoucher, ...state.userVouchers],
        }));

        return { success: true, userVoucher };
      },

      markVoucherUsed: (userVoucherId) =>
        set((state) => ({
          userVouchers: state.userVouchers.map((uv) =>
            uv.id === userVoucherId
              ? { ...uv, status: "used" as VoucherStatus, usedAt: new Date().toISOString() }
              : uv
          ),
        })),
    }),
    { name: "pacul-vouchers", partialize: (s) => ({ userVouchers: s.userVouchers, vouchers: s.vouchers }) }
  )
);
