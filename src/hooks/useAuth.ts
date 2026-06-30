"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import type { RegisterDTO, LoginDTO } from "@/services/auth.service";
import type { ApiError } from "@/services/api";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, logout: clearStore, setUser, updateUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: LoginDTO) =>
      authService.login(email, password),
    onSuccess: (data) => {
      Cookies.set("pacul_token", data.token, {
        expires: 7,
        sameSite: "lax",
        secure: window.location.protocol === "https:",
      });
      localStorage.setItem("pacul_token", data.token);
      setUser(data.user);
      toast.success(`Selamat datang, ${data.user.name}! 🌿`);
      router.push("/dashboard");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Email atau password salah");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDTO) => authService.register(data),
    onSuccess: (data) => {
      Cookies.set("pacul_token", data.token, {
        expires: 7,
        sameSite: "lax",
        secure: window.location.protocol === "https:",
      });
      localStorage.setItem("pacul_token", data.token);
      setUser(data.user);
      toast.success(data.message || "Registrasi berhasil! 🌿");
      router.push("/dashboard");
    },
    onError: (error: ApiError) => {
      const firstError = Object.values(error.errors || {})[0]?.[0];
      toast.error(firstError || error.message || "Gagal membuat akun. Coba lagi.");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      Cookies.remove("pacul_token");
      localStorage.removeItem("pacul_token");
      localStorage.removeItem("pacul-auth");
      localStorage.removeItem("pacul-user-store");
      clearStore();
      queryClient.clear();
      router.push("/login");
    },
  });

  return {
    user,
    isAuthenticated,
    loginMutation,
    registerMutation,
    logoutMutation,
    updateUser,
  };
}
