import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Testimonial } from "../types/local";
import { protectedCall } from "../utils/apiClient";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetAllTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      // Stubbed: backend doesn't have getAllTestimonials yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTestimonial() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_testimonial: Omit<Testimonial, "id">) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error("createTestimonial not yet implemented in backend");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_testimonial: Testimonial) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error("updateTestimonial not yet implemented in backend");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_id: number) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error("deleteTestimonial not yet implemented in backend");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}
