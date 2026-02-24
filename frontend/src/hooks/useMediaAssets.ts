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
      if (!actor) return [];
      
      try {
        const assets = await actor.getAllMediaAssets();
        console.log('[useGetAllMediaAssets] Fetched assets:', assets.length);
        return assets;
      } catch (error: any) {
        console.error('[useGetAllMediaAssets] Error fetching assets:', error);
        
        // Return empty array for auth errors during initial load
        // This prevents blocking the media list display for authenticated users
        if (isAuthError(error)) {
          console.log('[useGetAllMediaAssets] Auth error, returning empty array');
          return [];
        }
        
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMediaAssetById(id: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaAsset | null>({
    queryKey: ['mediaAsset', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      
      try {
        const asset = await actor.getMediaAssetById(id);
        console.log('[useGetMediaAssetById] Fetched asset:', id, asset ? 'success' : 'not found');
        return asset;
      } catch (error: any) {
        console.error('[useGetMediaAssetById] Error fetching asset:', error);
        // Return null instead of throwing to allow graceful fallback in public pages
        return null;
      }
    },
    enabled: !!actor && !isFetching && id !== undefined,
    retry: false, // Don't retry on auth errors for public pages
  });
}

export function useUploadMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileContent,
      filename,
      mimeType,
      fileSize,
      onProgress,
    }: {
      fileContent: Uint8Array;
      filename: string;
      mimeType: string;
      fileSize: number;
      onProgress?: (percentage: number) => void;
    }) => {
      if (!actor) throw new Error('Actor not available');

      console.log('[useUploadMediaAsset] Uploading:', filename);

      // Simulate progress for user feedback
      if (onProgress) {
        onProgress(10);
      }

      // Upload to backend
      await actor.uploadMediaAsset(filename, mimeType, fileContent, BigInt(fileSize));

      if (onProgress) {
        onProgress(100);
      }

      console.log('[useUploadMediaAsset] Upload complete');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
      toast.success('Media berhasil diunggah');
      console.log('[useUploadMediaAsset] Success');
    },
    onError: (error: any) => {
      console.error('[useUploadMediaAsset] Error:', error);

      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal mengunggah media';
        toast.error(errorMsg);
      }
    },
  });
}

export function useDeleteMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      
      console.log('[useDeleteMediaAsset] Deleting asset:', id);
      const result = await actor.deleteMediaAsset(id);
      
      if (!result) {
        throw new Error('Asset tidak ditemukan atau gagal dihapus');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
      toast.success('Media berhasil dihapus');
      console.log('[useDeleteMediaAsset] Success');
    },
    onError: (error: any) => {
      console.error('[useDeleteMediaAsset] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Anda tidak memiliki izin untuk menghapus media ini.');
      } else {
        const errorMsg = error.message || 'Gagal menghapus media';
        toast.error(errorMsg);
      }
    },
  });
}
