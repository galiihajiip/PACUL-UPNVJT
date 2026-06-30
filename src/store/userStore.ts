import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEMO_STARTING_XP } from "@/lib/demo-mode";

export interface XPEvent {
  id: string;
  source: string;
  amount: number;
  label: string;
  timestamp: string;
}

interface UserStore {
  xp: number;
  totalXpEarned: number;
  level: number;
  xpToNextLevel: number;
  carbonSaved: number;
  challengesCompleted: number;
  rank: number;
  xpHistory: XPEvent[];

  syncFromServer: (data: { current_xp: number; total_xp: number; level: number }) => void;
  addXPEvent: (amount: number, source: string, label: string) => void;
  awardXP: (amount: number, source: string, label: string) => void;
  deductXP: (amount: number) => void;
  addCarbonSaved: (kg: number) => void;
  incrementChallengesCompleted: () => void;
  reset: () => void;
  resetToDemo: () => void;
}

function calcXpToNext(level: number, totalXp: number): number {
  // Match backend formula: level = floor(sqrt(totalXp / 100)) + 1
  // Next level threshold: ((level)^2) * 100
  const nextLevelXp = Math.pow(level, 2) * 100;
  return Math.max(0, nextLevelXp - totalXp);
}

const INITIAL_STATE = {
  xp: DEMO_STARTING_XP,
  totalXpEarned: DEMO_STARTING_XP,
  level: 3,
  xpToNextLevel: calcXpToNext(3, DEMO_STARTING_XP),
  carbonSaved: 0,
  challengesCompleted: 0,
  rank: 0,
  xpHistory: [] as XPEvent[],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      syncFromServer: (data) => {
        set({
          xp: data.current_xp,
          totalXpEarned: data.total_xp,
          level: data.level,
          xpToNextLevel: calcXpToNext(data.level, data.total_xp),
        });
      },

      addXPEvent: (amount, source, label) => {
        const s = get();
        const newTotal = s.totalXpEarned + amount;
        const newLevel = Math.max(1, Math.floor(Math.sqrt(newTotal / 100)) + 1);
        const event: XPEvent = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          source,
          amount,
          label,
          timestamp: new Date().toISOString(),
        };
        set({
          xp: s.xp + amount,
          totalXpEarned: newTotal,
          level: newLevel,
          xpToNextLevel: calcXpToNext(newLevel, newTotal),
          xpHistory: [event, ...s.xpHistory].slice(0, 50),
        });
      },

      awardXP: (amount, source, label) => get().addXPEvent(amount, source, label),

      deductXP: (amount) =>
        set((s) => ({ xp: Math.max(0, s.xp - amount) })),

      addCarbonSaved: (kg) =>
        set((s) => ({ carbonSaved: +(s.carbonSaved + kg).toFixed(3) })),

      incrementChallengesCompleted: () =>
        set((s) => ({ challengesCompleted: s.challengesCompleted + 1 })),

      reset: () => set(INITIAL_STATE),
      resetToDemo: () => set(INITIAL_STATE),
    }),
    {
      name: "pacul-user-store",
      version: 4,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted, version) => {
        const state = persisted as Partial<typeof INITIAL_STATE>;
        if (version < 4 && (state.xp ?? 0) < DEMO_STARTING_XP) {
          return {
            ...state,
            xp: DEMO_STARTING_XP,
            totalXpEarned: Math.max(state.totalXpEarned ?? 0, DEMO_STARTING_XP),
            level: state.level && state.level > 1 ? state.level : 3,
            xpToNextLevel: calcXpToNext(3, DEMO_STARTING_XP),
          };
        }
        return state;
      },
      partialize: (s) => ({
        xp: s.xp,
        totalXpEarned: s.totalXpEarned,
        level: s.level,
        xpToNextLevel: s.xpToNextLevel,
        carbonSaved: s.carbonSaved,
        challengesCompleted: s.challengesCompleted,
        rank: s.rank,
        xpHistory: s.xpHistory,
      }),
    }
  )
);
