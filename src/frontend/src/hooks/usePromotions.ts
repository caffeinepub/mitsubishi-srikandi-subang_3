import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Promotion } from "../types/local";
import { protectedCall } from "../utils/apiClient";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetAllPromotions() {
  const { actor, isFetching } = useActor();

  return useQuery<Promotion[]>({
    queryKey: ["promotions"],
    queryFn: async () => {
      if (!actor) return [];
      // Stubbed: backend doesn't have getAllPromotions yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePromotion() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_promotion: Omit<Promotion, "id">) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error("createPromotion not yet implemented in backend");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
}

export function useUpdatePromotion() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_promotion: Promotion) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error("updatePromotion not yet implemented in backend");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
}

export function useDeletePromotion() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_id: number) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error("deletePromotion not yet implemented in backend");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
}

export function useTogglePromoActiveStatus() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      promoId: _promoId,
      active: _active,
    }: { promoId: number; active: boolean }) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error(
          "togglePromoActiveStatus not yet implemented in backend",
        );
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
}
