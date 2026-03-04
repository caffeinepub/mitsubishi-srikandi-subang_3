import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BlogPost } from "../types/local";
import { protectedCall } from "../utils/apiClient";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      // Stubbed: backend doesn't have getAllBlogPosts yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPostById(id: number) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ["blogPost", id],
    queryFn: async () => {
      if (!actor) return null;
      return null;
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_post: BlogPost) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error("createBlogPost not yet implemented in backend");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_post: BlogPost) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error("updateBlogPost not yet implemented in backend");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_id: number) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error("deleteBlogPost not yet implemented in backend");
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
}

export function useToggleBlogPostPublishStatus() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      blogPostId: _blogPostId,
      publish: _publish,
    }: { blogPostId: number; publish: boolean }) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error(
          "toggleBlogPostPublishStatus not yet implemented in backend",
        );
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
}
