import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/services/api";
import Cookies from "js-cookie";

export interface GovUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "government";
  government_unit: string;
  governmentUnit?: string;
  avatar_url?: string;
  avatarInitials?: string;
}

interface GovAuthStore {
  user: GovUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: GovUser) => void;
}

export const useGovAuthStore = create<GovAuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const response = await api.post<{ user: GovUser; token: string }>("/auth/gov/login", {
            email,
            password,
          });

          Cookies.set("pacul_token", response.token, {
            expires: 7,
            sameSite: "lax",
            secure: window.location.protocol === "https:",
          });
          localStorage.setItem("pacul_token", response.token);

          const u = response.user;
          set({
            user: {
              ...u,
              governmentUnit: u.governmentUnit ?? u.government_unit,
              avatarInitials: u.avatarInitials ?? u.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase(),
            },
            isAuthenticated: true,
          });
          return { success: true };
        } catch (err: unknown) {
          const error = err as { message?: string };
          return {
            success: false,
            error: error.message || "Login gagal. Periksa email dan password.",
          };
        }
      },

      logout: () => {
        api.post("/auth/logout").catch(() => {});
        Cookies.remove("pacul_token");
        localStorage.removeItem("pacul_token");
        localStorage.removeItem("pacul-gov-auth");
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user) => set({
        user: {
          ...user,
          governmentUnit: user.governmentUnit ?? user.government_unit,
          avatarInitials: user.avatarInitials ?? user.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase(),
        },
        isAuthenticated: true,
      }),
    }),
    {
      name: "pacul-gov-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
