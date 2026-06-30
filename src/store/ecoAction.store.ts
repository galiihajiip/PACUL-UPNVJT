import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Badge } from "@/types/eco-action";
import { useUserStore } from "@/store/userStore";
import { XP_SOURCES } from "@/utils/xpSources";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  initials: string;
  points: number;
  level: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: "Energi" | "Limbah" | "Transportasi" | "Pangan" | "Penghijauan";
  iconColor: string;
  targetProgress: number;
  currentProgress: number;
  timeLeftDays: number;
  participants: number;
  xpReward: number;
  isJoined: boolean;
  isCompleted: boolean;
  completedAt?: string;
}

const CARBON_ESTIMATE: Record<string, number> = {
  "1": 8.5,
  "2": 3.2,
  "3": 5.1,
  "4": 6.0,
};

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Kurangi Listrik 20%",
    description: "Kurangi penggunaan listrik rumah tangga sebesar 20% dalam sebulan.",
    category: "Energi",
    iconColor: "#F59E0B",
    targetProgress: 100,
    currentProgress: 65,
    timeLeftDays: 12,
    participants: 1240,
    xpReward: 200,
    isJoined: false,
    isCompleted: false,
  },
  {
    id: "2",
    title: "Zero Waste 7 Hari",
    description: "Kurangi sampah rumah tangga ke nol selama 7 hari berturut-turut.",
    category: "Limbah",
    iconColor: "#10B981",
    targetProgress: 100,
    currentProgress: 40,
    timeLeftDays: 5,
    participants: 850,
    xpReward: 150,
    isJoined: true,
    isCompleted: false,
  },
  {
    id: "3",
    title: "Transportasi Umum 10x",
    description: "Gunakan transportasi umum minimal 10 kali dalam seminggu.",
    category: "Transportasi",
    iconColor: "#2D5F3F",
    targetProgress: 100,
    currentProgress: 80,
    timeLeftDays: 3,
    participants: 2100,
    xpReward: 100,
    isJoined: true,
    isCompleted: false,
  },
  {
    id: "4",
    title: "Tanam 5 Pohon",
    description: "Tanam dan dokumentasikan 5 bibit pohon di lingkungan sekitar.",
    category: "Penghijauan",
    iconColor: "#059669",
    targetProgress: 100,
    currentProgress: 20,
    timeLeftDays: 20,
    participants: 430,
    xpReward: 300,
    isJoined: false,
    isCompleted: false,
  },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: "u1", name: "Dewi Lestari",    initials: "DL", points: 8420, level: 18 },
  { rank: 2, userId: "u2", name: "Rian Hidayat",    initials: "RH", points: 7810, level: 16 },
  { rank: 3, userId: "u3", name: "Siti Aminah",     initials: "SA", points: 6950, level: 15 },
  { rank: 4, userId: "u4", name: "Budi Santoso",    initials: "BS", points: 5230, level: 13 },
  { rank: 5, userId: "usr_001", name: "Aditya Pratama", initials: "AP", points: 4200, level: 12 },
];

const MOCK_BADGES: Badge[] = [
  { id: "b1", name: "Early Bird",       description: "Aksi pertama tercatat",        icon: "🌅", unlocked: true,  unlockedAt: "2026-03-15" },
  { id: "b2", name: "Waste Warrior",    description: "7 hari tanpa sampah plastik",  icon: "⚔️", unlocked: true,  unlockedAt: "2026-04-02" },
  { id: "b3", name: "Energy Saver",     description: "Kurangi listrik 20%",          icon: "⚡", unlocked: true,  unlockedAt: "2026-05-05" },
  { id: "b4", name: "Tree Planter",     description: "Tanam 5 pohon",                icon: "🌳", unlocked: true,  unlockedAt: "2026-06-10" },
  { id: "b5", name: "Water Hero",       description: "Hemat air 30% selama sebulan", icon: "💧", unlocked: false },
  { id: "b6", name: "Community Leader", description: "Top 10 leaderboard",           icon: "👑", unlocked: false },
];

interface EcoActionStore {
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  badges: Badge[];
  uploadState: "idle" | "uploading" | "analyzing" | "success" | "error";

  joinChallenge: (challengeId: string) => void;
  updateProgress: (challengeId: string, newProgress: number) => void;
  completeChallenge: (challengeId: string) => void;
  resetChallenge: (challengeId: string) => void;
  uploadProof: (file: File, challengeId: string) => Promise<void>;
  claimReward: (challengeId: string) => void;
  resetUpload: () => void;
}

export const useEcoActionStore = create<EcoActionStore>()(
  persist(
    (set, get) => ({
      challenges: INITIAL_CHALLENGES,
      leaderboard: MOCK_LEADERBOARD,
      badges: MOCK_BADGES,
      uploadState: "idle",

      joinChallenge: (challengeId) => {
        const already = get().challenges.find((c) => c.id === challengeId)?.isJoined;
        if (already) return;
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === challengeId
              ? { ...c, isJoined: true, participants: c.participants + 1 }
              : c
          ),
        }));
        useUserStore.getState().awardXP(
          XP_SOURCES.CHALLENGE_JOIN.amount,
          "challenge_join",
          XP_SOURCES.CHALLENGE_JOIN.label
        );
      },

      updateProgress: (challengeId, newProgress) => {
        const challenge = get().challenges.find((c) => c.id === challengeId);
        if (!challenge || !challenge.isJoined || challenge.isCompleted) return;
        const clamped = Math.min(100, Math.max(0, newProgress));
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === challengeId ? { ...c, currentProgress: clamped } : c
          ),
        }));
        if (clamped >= 100) {
          get().completeChallenge(challengeId);
        }
      },

      completeChallenge: (challengeId) => {
        const challenge = get().challenges.find((c) => c.id === challengeId);
        if (!challenge || challenge.isCompleted) return;
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === challengeId
              ? { ...c, isCompleted: true, currentProgress: 100, completedAt: new Date().toISOString() }
              : c
          ),
        }));
        useUserStore.getState().awardXP(
          challenge.xpReward,
          "challenge_complete",
          `Tantangan "${challenge.title}" selesai!`
        );
        useUserStore.getState().incrementChallengesCompleted();
        const carbon = CARBON_ESTIMATE[challengeId] ?? 2;
        useUserStore.getState().addCarbonSaved(carbon);
      },

      resetChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === challengeId
              ? { ...c, isJoined: false, isCompleted: false, currentProgress: 0, completedAt: undefined }
              : c
          ),
        }));
      },

      uploadProof: async (_file: File, _challengeId: string) => {
        set({ uploadState: "uploading" });
        await new Promise((r) => setTimeout(r, 1200));
        set({ uploadState: "analyzing" });
        await new Promise((r) => setTimeout(r, 1800));
        set({ uploadState: "success" });
      },

      claimReward: (challengeId) => {
        get().completeChallenge(challengeId);
      },

      resetUpload: () => set({ uploadState: "idle" }),
    }),
    {
      name: "pacul-eco-action-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        challenges: s.challenges,
      }),
    }
  )
);
