import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ecoActionService } from "@/services/ecoAction.service";

export const useChallenges = () =>
  useQuery({
    queryKey: ["challenges"],
    queryFn: ecoActionService.getChallenges,
  });

export const useLeaderboard = () =>
  useQuery({
    queryKey: ["leaderboard"],
    queryFn: ecoActionService.getLeaderboard,
    refetchInterval: 60 * 1000,
  });

export const useMarketplace = () =>
  useQuery({
    queryKey: ["marketplace"],
    queryFn: ecoActionService.getMarketplace,
  });

export const useUploadProof = () =>
  useMutation({
    mutationFn: ({ file, challengeId }: { file: File; challengeId: string }) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("challengeId", challengeId);
      return ecoActionService.uploadProof(formData);
    },
  });

export const useJoinChallenge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId: string) => ecoActionService.joinChallenge(challengeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
};

export const useRedeemReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rewardId: string) => ecoActionService.redeemReward(rewardId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
};
