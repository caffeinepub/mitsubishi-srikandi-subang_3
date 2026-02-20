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
    errorMessage.includes('sesi anda telah berakhir') ||
    errorMessage.includes('silakan login kembali') ||
    errorString.includes('unauthorized') ||
    errorString.includes('authentication')
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

function isCanisterStoppedError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  
  return (
    errorMessage.includes('canister') && errorMessage.includes('stopped') ||
    errorMessage.includes('ic0508') ||
    errorString.includes('canister') && errorString.includes('stopped') ||
    errorString.includes('ic0508')
  );
}

export function useGetAllMediaAssets() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaAsset[]>({
    queryKey: ['mediaAssets'],
    queryFn: async () => {
      if (!actor) {
        console.warn('[useGetAllMediaAssets] Actor not available, skipping fetch');
        throw new Error('Actor not available');
      }
      console.log('[useGetAllMediaAssets] Fetching all media assets from stable storage');
      const assets = await actor.getAllMediaAssets();
      console.log('[useGetAllMediaAssets] Fetched assets from persistent storage:', assets.length);
      return assets;
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if actor is not available
      if (error?.message?.includes('Actor not available')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
}

export function useGetMediaAssetById(assetId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaAsset | null>({
    queryKey: ['mediaAsset', assetId?.toString()],
    queryFn: async () => {
      if (!actor || !assetId) return null;
      console.log('[useGetMediaAssetById] Fetching asset from stable storage:', assetId);
      const asset = await actor.getMediaAssetById(assetId);
      return asset;
    },
    enabled: !!actor && !isFetching && assetId !== null,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Actor not available')) {
        return false;
      }
      return failureCount < 2;
    },
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
      if (!actor) {
        console.error('[useUploadMediaAsset] Actor not available');
        throw new Error('Actor not available');
      }
      console.log('[useUploadMediaAsset] Starting upload to stable canister storage:', { filename, mimeType, fileSize });
      
      // Simulate progress for user feedback
      if (onProgress) {
        onProgress(10);
      }
      
      if (onProgress) {
        onProgress(50);
      }
      
      // Upload directly to stable canister storage
      // The backend stores the complete blob data in the MediaAsset.data field
      console.log('[useUploadMediaAsset] Uploading to persistent stable storage');
      await actor.uploadMediaAsset(
        filename,
        mimeType,
        fileContent,
        BigInt(fileSize)
      );
      
      if (onProgress) {
        onProgress(100);
      }
      
      console.log('[useUploadMediaAsset] Upload complete - data persisted in stable storage');
    },
    onSuccess: () => {
      console.log('[useUploadMediaAsset] Success - invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('File berhasil diunggah ke penyimpanan permanen');
    },
    onError: (error: any) => {
      console.error('[useUploadMediaAsset] Error:', error);
      
      if (isCanisterStoppedError(error)) {
        toast.error('Canister sedang dalam pemeliharaan. Silakan coba lagi nanti.');
      } else if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (error.message?.includes('Actor not available')) {
        toast.error('Sistem belum siap. Silakan tunggu sebentar dan coba lagi.');
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
      console.log('[useDeleteMediaAsset] Mutation triggered for asset:', assetId);
      console.log('[useDeleteMediaAsset] Actor available:', !!actor);
      
      if (!actor) {
        console.error('[useDeleteMediaAsset] Actor not available - cannot delete');
        throw new Error('Actor not available');
      }
      
      console.log('[useDeleteMediaAsset] Deleting media asset from stable storage:', assetId);
      const success = await actor.deleteMediaAsset(assetId);
      console.log('[useDeleteMediaAsset] Backend response:', success);
      
      if (!success) {
        throw new Error('Gambar tidak ditemukan atau sudah dihapus');
      }
      
      return success;
    },
    onSuccess: (_, assetId) => {
      console.log('[useDeleteMediaAsset] Success - invalidating queries for asset:', assetId);
      
      // Optimistically remove from cache
      queryClient.setQueryData<MediaAsset[]>(['mediaAssets'], (old) => {
        if (!old) return old;
        return old.filter((asset) => asset.id !== assetId);
      });
      
      // Then invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Gambar berhasil dihapus');
    },
    onError: (error: any, assetId) => {
      console.error('[useDeleteMediaAsset] Error deleting asset:', assetId, error);
      console.error('[useDeleteMediaAsset] Full error object:', JSON.stringify(error, null, 2));
      
      if (isCanisterStoppedError(error)) {
        toast.error('Canister sedang dalam pemeliharaan. Silakan coba lagi nanti atau hubungi administrator.');
      } else if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (error.message?.includes('Actor not available')) {
        toast.error('Sistem belum siap. Silakan tunggu sebentar dan coba lagi.');
      } else {
        const errorMsg = error.message || 'Gagal menghapus gambar';
        toast.error(errorMsg);
      }
      
      // Rollback optimistic update on error
      queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
    },
  });
}
