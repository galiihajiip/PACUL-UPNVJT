import { api } from "./api";
import type { EcoChallenge, Badge } from "@/types/eco-action";
import type { LeaderboardEntry } from "@/store/ecoAction.store";
import { isDemoMode, demoDelay } from "@/lib/demo-mode";

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  stock: number;
  imageEmoji: string;
}

export interface NewPostDTO {
  content: string;
  type: string;
  tags?: string[];
}

const MOCK_CHALLENGES: EcoChallenge[] = [
  { id: "c1", title: "Zero Waste 7 Hari", description: "Kurangi sampah plastik selama 7 hari penuh", xpReward: 500, pointReward: 300, status: "active", progress: 5, total: 7, deadline: "2026-11-20", category: "Limbah" },
  { id: "c2", title: "Hemat Listrik 80%", description: "Kurangi penggunaan listrik hingga 80%", xpReward: 350, pointReward: 200, status: "active", progress: 8, total: 10, deadline: "2026-11-25", category: "Energi" },
  { id: "c3", title: "Transportasi Umum 10x", description: "Naik MRT atau Bus 10 kali dalam sebulan", xpReward: 400, pointReward: 250, status: "active", progress: 3, total: 10, deadline: "2026-11-30", category: "Transportasi" },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: "u1", name: "Dewi Lestari", initials: "DL", points: 8420, level: 18 },
  { rank: 2, userId: "u2", name: "Rian Hidayat", initials: "RH", points: 7810, level: 16 },
  { rank: 3, userId: "u3", name: "Siti Aminah", initials: "SA", points: 6950, level: 15 },
  { rank: 4, userId: "u4", name: "Budi Santoso", initials: "BS", points: 5230, level: 13 },
  { rank: 5, userId: "usr_001", name: "Aditya Pratama", initials: "AP", points: 4200, level: 12 },
];

const MOCK_MARKETPLACE: RewardItem[] = [
  { id: "r1", name: "Tote Bag Eco", description: "Tas belanja ramah lingkungan", cost: 300, category: "Merchandise", stock: 50, imageEmoji: "👜" },
  { id: "r2", name: "Bibit Pohon", description: "Bibit pohon mangga siap tanam", cost: 150, category: "Tanaman", stock: 100, imageEmoji: "🌱" },
  { id: "r3", name: "Tumbler PACUL", description: "Botol minum stainless steel", cost: 500, category: "Merchandise", stock: 25, imageEmoji: "🧃" },
  { id: "r4", name: "Voucher Transport", description: "Voucher KRL/Bus Rp 50.000", cost: 400, category: "Voucher", stock: 200, imageEmoji: "🚌" },
];

export const ecoActionService = {
  getChallenges: async (): Promise<EcoChallenge[]> => {
    if (isDemoMode) return MOCK_CHALLENGES;
    try {
      return await api.get<EcoChallenge[]>("/eco-action/challenges");
    } catch {
      return MOCK_CHALLENGES;
    }
  },

  joinChallenge: async (id: string): Promise<void> => {
    if (isDemoMode) { await demoDelay(200); return; }
    try {
      await api.post(`/eco-action/challenges/${id}/join`);
    } catch {
      /* mock: no-op */
    }
  },

  uploadProof: async (formData: FormData): Promise<{ status: string; xpAwarded: number }> => {
    if (isDemoMode) {
      await demoDelay(500);
      return { status: "success", xpAwarded: 100 };
    }
    try {
      return await api.post("/eco-action/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch {
      return { status: "success", xpAwarded: 100 };
    }
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    if (isDemoMode) return MOCK_LEADERBOARD;
    try {
      return await api.get<LeaderboardEntry[]>("/eco-action/leaderboard");
    } catch {
      return MOCK_LEADERBOARD;
    }
  },

  getMarketplace: async (): Promise<RewardItem[]> => {
    if (isDemoMode) return MOCK_MARKETPLACE;
    try {
      return await api.get<RewardItem[]>("/eco-action/marketplace");
    } catch {
      return MOCK_MARKETPLACE;
    }
  },

  redeemReward: async (id: string): Promise<{ success: boolean; remainingPoints: number }> => {
    if (isDemoMode) {
      await demoDelay(300);
      return { success: true, remainingPoints: 3900 };
    }
    try {
      return await api.post(`/eco-action/marketplace/${id}/redeem`);
    } catch {
      return { success: true, remainingPoints: 3900 };
    }
  },
};
