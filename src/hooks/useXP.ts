"use client";

import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

export function useXP() {
  const { xp, level, xpToNextLevel, awardXP, deductXP } = useUserStore();

  const earn = (amount: number, source: string, label: string) => {
    awardXP(amount, source, label);
    toast.success(`+${amount} XP — ${label} 🌿`, { duration: 3000 });
  };

  const spend = (amount: number, reason: string): boolean => {
    if (xp < amount) {
      toast.error(`XP tidak cukup. Butuh ${amount} XP, kamu punya ${xp} XP.`);
      return false;
    }
    deductXP(amount);
    toast.info(`-${amount} XP — ${reason}`, { duration: 2000 });
    return true;
  };

  const canAfford = (cost: number) => xp >= cost;

  return { xp, level, xpToNextLevel, earn, spend, canAfford };
}
