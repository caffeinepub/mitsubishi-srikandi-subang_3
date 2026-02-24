import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WebsiteSettings } from '../types/local';
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
  
  console.log('[useWebsiteSettings] Error classification:', {
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

export function useGetWebsiteSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<WebsiteSettings | null>({
    queryKey: ['websiteSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const settings = await actor.getWebsiteSettings();
      console.log('[useGetWebsiteSettings] Fetched settings:', settings);
      return settings;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateWebsiteSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: WebsiteSettings) => {
      if (!actor) throw new Error('Actor not available');
      
      console.log('[useUpdateWebsiteSettings] Updating website settings:', settings);
      console.log('[useUpdateWebsiteSettings] mainBannerImageId type:', typeof settings.mainBannerImageId, settings.mainBannerImageId);
      console.log('[useUpdateWebsiteSettings] ctaBannerImageId type:', typeof settings.ctaBannerImageId, settings.ctaBannerImageId);
      
      await actor.updateWebsiteSettings(settings);
      
      console.log('[useUpdateWebsiteSettings] Update successful');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websiteSettings'] });
      toast.success('Pengaturan website berhasil diperbarui');
      console.log('[useUpdateWebsiteSettings] Success - invalidating queries');
    },
    onError: (error: any) => {
      console.error('[useUpdateWebsiteSettings] Error:', error);
      console.error('[useUpdateWebsiteSettings] Error stack:', error.stack);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal memperbarui pengaturan';
        toast.error(errorMsg);
      }
    },
  });
}
