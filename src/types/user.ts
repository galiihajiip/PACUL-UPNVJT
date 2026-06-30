// TODO: User types — BLOK auth/profile

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  xp: number;
  level: number;
  rank: number;
  totalActions: number;
  totalEmissionReduced: number;
  points: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
