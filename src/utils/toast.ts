import { toast } from "sonner";

export const toastSuccess = (message: string, description?: string) =>
  toast.success(message, { description });

export const toastError = (message: string, description?: string) =>
  toast.error(message, { description });

export const toastInfo = (message: string, description?: string) =>
  toast.info(message, { description });

export const toastLoading = (message: string) =>
  toast.loading(message);

export const toastUploadSuccess = (xp: number) =>
  toast.success("Bukti berhasil diupload! ✓", {
    description: `+${xp} XP berhasil ditambahkan ke akunmu`,
  });

export const toastDismiss = (id: string | number) =>
  toast.dismiss(id);

export { toast };
