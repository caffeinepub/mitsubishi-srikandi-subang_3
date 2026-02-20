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
      // Stub: Backend doesn't have getMediaAssets method yet
      console.warn('[useGetAllMediaAssets] Backend method not implemented, returning empty array');
      return [];
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useGetMediaAsset(assetId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaAsset | null>({
    queryKey: ['mediaAsset', assetId?.toString()],
    queryFn: async () => {
      if (!actor || !assetId) return null;
      // Stub: Backend doesn't have getMediaAsset method yet
      return null;
    },
    enabled: !!actor && !isFetching && assetId !== null,
  });
}

export function useUploadMediaAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (asset: MediaAsset) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useUploadMediaAsset] Uploading file:', asset.filename);
      
      // Stub: Backend doesn't have uploadMediaAsset method yet
      console.warn('[useUploadMediaAsset] Backend method not implemented');
      throw new Error('Backend method uploadMediaAsset not implemented yet');
    },
    onSuccess: () => {
      console.log('[useUploadMediaAsset] Success - invalidating queries');
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
      // Stub: Backend doesn't have deleteMediaAsset method yet
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
