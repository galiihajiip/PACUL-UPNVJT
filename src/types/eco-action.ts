// TODO: EcoAction types — BLOK eco-action

export type ActionStatus = "active" | "completed" | "expired";

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  pointReward: number;
  status: ActionStatus;
  progress: number;
  total: number;
  deadline: string;
  category: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
