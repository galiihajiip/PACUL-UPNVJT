import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { carbonService } from "@/services/carbon.service";
import type { NewEmissionDTO } from "@/services/carbon.service";

export const useEmissions = () =>
  useQuery({
    queryKey: ["emissions"],
    queryFn: carbonService.getEmissions,
  });

export const useWeeklyTrend = () =>
  useQuery({
    queryKey: ["carbon", "trend", "weekly"],
    queryFn: carbonService.getWeeklyTrend,
  });

export const useMonthlyTrend = () =>
  useQuery({
    queryKey: ["carbon", "trend", "monthly"],
    queryFn: carbonService.getMonthlyTrend,
  });

export const useCarbonBreakdown = () =>
  useQuery({
    queryKey: ["carbon", "breakdown"],
    queryFn: carbonService.getBreakdown,
  });

export const useAddEmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NewEmissionDTO) => carbonService.addEmission(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["emissions"] });
    },
  });
};
