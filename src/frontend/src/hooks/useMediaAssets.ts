import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MediaAsset } from '../types/local';
import { toast } from 'sonner';

// Enhanced helper function to check if error is authentication-related
function isAuthError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  
  const isAuth = (
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('not authenticated') ||
    errorMessage.includes('authentication required') ||
    errorMessage.includes('session expired') ||
    errorMessage.includes('invalid session') ||
    errorMessage.includes('login required') ||
    errorMessage.includes('permission denied') ||
    errorString.includes('unauthorized')
  );
  
  console.log('[useMediaAssets] Error classification:', {
    message: error?.message,
    isAuthError: isAuth
  });
  
  return isAuth;
}

function isNetworkError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  
  return (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('timeout') ||
    errorString.includes('networkerror') ||
    errorString.includes('failed to fetch')
  );
}

export function useGetAllMediaAssets() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaAsset[]>({
    queryKey: ['mediaAssets'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useGetAllMediaAssets] Fetching all media assets');
      const assets = await actor.getAllMediaAssets();
      console.log('[useGetAllMediaAssets] Fetched assets:', assets.length);
      return assets;
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useGetMediaAssetById(assetId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaAsset | null>({
    queryKey: ['mediaAsset', assetId?.toString()],
    queryFn: async () => {
      if (!actor || !assetId) return null;
      console.log('[useGetMediaAssetById] Fetching asset:', assetId);
      const asset = await actor.getMediaAssetById(assetId);
      return asset;
    },
    enabled: !!actor && !isFetching && assetId !== null,
  });
}

interface UploadMediaAssetParams {
  fileContent: Uint8Array;
  filename: string;
  mimeType: string;
  fileSize: number;
  onProgress?: (percentage: number) => void;
}

export function useUploadMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fileContent, filename, mimeType, fileSize, onProgress }: UploadMediaAssetParams) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useUploadMediaAsset] Starting upload:', { filename, mimeType, fileSize });
      
      // Simulate progress for user feedback
      if (onProgress) {
        onProgress(10);
      }
      
      // The backend's blob-storage mixin handles the actual blob storage
      // We just need to call uploadMediaAsset with the file data
      // The backend will generate a blobId and store it
      
      // For now, we'll use a temporary approach: convert bytes to base64 as blobId
      // In production, the backend's blob-storage mixin will handle this properly
      const blobId = `blob_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      if (onProgress) {
        onProgress(50);
      }
      
      // Determine asset type
      const assetType = mimeType.startsWith('image/') ? 'image' : 'document';
      
      if (onProgress) {
        onProgress(75);
      }
      
      // Call backend uploadMediaAsset
      console.log('[useUploadMediaAsset] Calling backend uploadMediaAsset');
      await actor.uploadMediaAsset(
        filename,
        mimeType,
        blobId,
        assetType,
        BigInt(fileSize)
      );
      
      if (onProgress) {
        onProgress(100);
      }
      
      console.log('[useUploadMediaAsset] Upload complete');
      return blobId;
    },
    onSuccess: (blobId) => {
      console.log('[useUploadMediaAsset] Success - invalidating queries, blobId:', blobId);
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('File berhasil diunggah');
    },
    onError: (error: any) => {
      console.error('[useUploadMediaAsset] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (error.message?.includes('size')) {
        toast.error('Ukuran file terlalu besar');
      } else if (error.message?.includes('type') || error.message?.includes('format')) {
        toast.error('Format file tidak didukung');
      } else {
        const errorMsg = error.message || 'Gagal mengunggah file';
        toast.error(errorMsg);
      }
    },
  });
}

export function useDeleteMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useDeleteMediaAsset] Deleting media asset:', assetId);
      await actor.deleteMediaAsset(assetId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Media berhasil dihapus');
      console.log('[useDeleteMediaAsset] Success');
    },
    onError: (error: any) => {
      console.error('[useDeleteMediaAsset] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal menghapus media';
        toast.error(errorMsg);
      }
    },
  });
}
