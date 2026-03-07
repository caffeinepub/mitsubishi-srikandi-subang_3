import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MediaAsset } from "../backend";
import { protectedCall } from "../utils/apiClient";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetAllMediaAssets() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaAsset[]>({
    queryKey: ["mediaAssets"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllMediaAssets();
      } catch (err) {
        console.warn("[useGetAllMediaAssets] Failed to fetch:", err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMediaAssetById(id: bigint | null | undefined) {
  const { actor, isFetching } = useActor();

  // Normalize undefined to null for consistent handling
  const normalizedId = id === undefined ? null : id;

  return useQuery<MediaAsset | null>({
    queryKey: ["mediaAsset", normalizedId?.toString()],
    queryFn: async () => {
      if (!actor || normalizedId === null) return null;
      try {
        return await actor.getMediaAssetById(normalizedId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && normalizedId !== null,
  });
}

export function useUploadMediaAsset() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      filename,
      mimeType,
      data,
      fileSize,
      onProgress,
    }: {
      filename: string;
      mimeType: string;
      data: Uint8Array;
      fileSize: bigint;
      onProgress?: (pct: number) => void;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        onProgress?.(10);
        const result = await actor.uploadMediaAsset(
          filename,
          mimeType,
          data,
          fileSize,
        );
        onProgress?.(100);
        return result;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaAssets"] });
    },
  });
}

export function useDeleteMediaAsset() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, () => actor.deleteMediaAsset(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaAssets"] });
    },
  });
}
