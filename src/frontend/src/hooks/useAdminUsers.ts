import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AdminUser } from '../types/local';
import { Principal } from '@dfinity/principal';
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
  
  console.log('[useAdminUsers] Error classification:', {
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

export function useGetAllAdminUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminUser[]>({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - return empty array
      return [] as AdminUser[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdminUser(userPrincipal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<AdminUser | null>({
    queryKey: ['adminUser', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return null;
      // Backend method missing - return null
      return null;
    },
    enabled: !!actor && !isFetching && userPrincipal !== null,
  });
}

export function useCreateAdminUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: AdminUser) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useCreateAdminUser] Creating admin user:', user.name);
      console.warn('createAdminUser not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Admin user berhasil dibuat');
      console.log('[useCreateAdminUser] Success');
    },
    onError: (error: any) => {
      console.error('[useCreateAdminUser] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (error.message?.includes('invalid') && error.message?.includes('principal')) {
        toast.error('Principal ID tidak valid');
      } else if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        toast.error('Admin user sudah ada');
      } else {
        const errorMsg = error.message || 'Gagal membuat admin user';
        toast.error(errorMsg);
      }
    },
  });
}

export function useUpdateAdminUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: AdminUser) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useUpdateAdminUser] Updating admin user:', user.principal.toString());
      console.warn('updateAdminUser not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Admin user berhasil diperbarui');
      console.log('[useUpdateAdminUser] Success');
    },
    onError: (error: any) => {
      console.error('[useUpdateAdminUser] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal memperbarui admin user';
        toast.error(errorMsg);
      }
    },
  });
}

export function useDeleteAdminUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useDeleteAdminUser] Deleting admin user:', userPrincipal.toString());
      console.warn('deleteAdminUser not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Admin user berhasil dihapus');
      console.log('[useDeleteAdminUser] Success');
    },
    onError: (error: any) => {
      console.error('[useDeleteAdminUser] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal menghapus admin user';
        toast.error(errorMsg);
      }
    },
  });
}
