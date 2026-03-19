import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MediaAsset } from "../backend";
import { useActorContext } from "../contexts/ActorContext";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetAllMediaAssets() {
  const { actor, actorFetching } = useActorContext();

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
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMediaAssetById(id: bigint | null | undefined) {
  const { actor, actorFetching } = useActorContext();
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
    enabled: !!actor && !actorFetching && normalizedId !== null,
  });
}

export function useUploadMediaAsset() {
  const { actor } = useActorContext();
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
      if (!actor) throw new Error("Actor belum siap");
      onProgress?.(10);
      const result = await actor.uploadMediaAsset(
        filename,
        mimeType,
        data,
        fileSize,
      );
      onProgress?.(100);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaAssets"] });
    },
  });
}

export function useDeleteMediaAsset() {
  const { actor } = useActorContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor belum siap");
      return actor.deleteMediaAsset(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaAssets"] });
    },
  });
}
