import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Promotion } from '../types/local';
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
  
  console.log('[usePromotions] Error classification:', {
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

export function useGetAllPromotions() {
  const { actor, isFetching } = useActor();

  return useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Stub: return empty array until backend implements getPromotions
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotion: Promotion) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useCreatePromotion] Creating promotion:', promotion.title);
      // Stub: return dummy ID until backend implements createPromotion
      return BigInt(1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promo berhasil disimpan');
      console.log('[useCreatePromotion] Success');
    },
    onError: (error: any) => {
      console.error('[useCreatePromotion] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal menyimpan promo';
        toast.error(errorMsg);
      }
    },
  });
}

export function useUpdatePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotion: Promotion) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useUpdatePromotion] Updating promotion:', promotion.id);
      // Stub: do nothing until backend implements updatePromotion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promo berhasil diperbarui');
      console.log('[useUpdatePromotion] Success');
    },
    onError: (error: any) => {
      console.error('[useUpdatePromotion] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal memperbarui promo';
        toast.error(errorMsg);
      }
    },
  });
}

export function useDeletePromotion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useDeletePromotion] Deleting promotion:', promotionId);
      // Stub: do nothing until backend implements deletePromotion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Promo berhasil dihapus');
      console.log('[useDeletePromotion] Success');
    },
    onError: (error: any) => {
      console.error('[useDeletePromotion] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal menghapus promo';
        toast.error(errorMsg);
      }
    },
  });
}

export function useTogglePromoActiveStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ promoId, active }: { promoId: bigint; active: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useTogglePromoActiveStatus] Toggling status for promo:', promoId, 'to', active);
      // Stub: do nothing until backend implements togglePromoActiveStatus
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Status promo berhasil diubah');
      console.log('[useTogglePromoActiveStatus] Success');
    },
    onError: (error: any) => {
      console.error('[useTogglePromoActiveStatus] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal mengubah status promo';
        toast.error(errorMsg);
      }
    },
  });
}
