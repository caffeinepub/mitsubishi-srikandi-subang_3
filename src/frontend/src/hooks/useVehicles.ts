import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Vehicle } from '../types/local';
import { toast } from 'sonner';

// Enhanced helper function to check if error is authentication-related
// Only treat as auth error if it explicitly mentions authentication/authorization
function isAuthError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  
  // Check for explicit authentication/authorization errors
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
  
  console.log('[useVehicles] Error classification:', {
    message: error?.message,
    isAuthError: isAuth,
    errorType: error?.constructor?.name
  });
  
  return isAuth;
}

// Helper to check if error is network-related
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

export function useGetAllVehicles() {
  const { actor, isFetching } = useActor();

  return useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Stub: return empty array until backend implements getVehicles
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVehicle(vehicleId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Vehicle | null>({
    queryKey: ['vehicle', vehicleId?.toString()],
    queryFn: async () => {
      if (!actor || !vehicleId) return null;
      // Stub: return null until backend implements getVehicle
      return null;
    },
    enabled: !!actor && !isFetching && vehicleId !== null,
  });
}

export function useCreateVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useCreateVehicle] Creating vehicle:', vehicle.vehicleName);
      // Stub: return dummy ID until backend implements createVehicle
      return BigInt(1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Kendaraan berhasil disimpan');
      console.log('[useCreateVehicle] Success');
    },
    onError: (error: any) => {
      console.error('[useCreateVehicle] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        // Show the actual error message from backend
        const errorMsg = error.message || 'Gagal menyimpan kendaraan';
        toast.error(errorMsg);
      }
    },
  });
}

export function useUpdateVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useUpdateVehicle] Updating vehicle:', vehicle.id);
      // Stub: do nothing until backend implements updateVehicle
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Kendaraan berhasil diperbarui');
      console.log('[useUpdateVehicle] Success');
    },
    onError: (error: any) => {
      console.error('[useUpdateVehicle] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal memperbarui kendaraan';
        toast.error(errorMsg);
      }
    },
  });
}

export function useDeleteVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useDeleteVehicle] Deleting vehicle:', vehicleId);
      // Stub: do nothing until backend implements deleteVehicle
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Kendaraan berhasil dihapus');
      console.log('[useDeleteVehicle] Success');
    },
    onError: (error: any) => {
      console.error('[useDeleteVehicle] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal menghapus kendaraan';
        toast.error(errorMsg);
      }
    },
  });
}

export function useToggleVehiclePublishStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useToggleVehiclePublishStatus] Toggling status for vehicle:', vehicleId);
      // Stub: do nothing until backend implements toggleVehiclePublishStatus
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Status publikasi berhasil diubah');
      console.log('[useToggleVehiclePublishStatus] Success');
    },
    onError: (error: any) => {
      console.error('[useToggleVehiclePublishStatus] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal mengubah status publikasi';
        toast.error(errorMsg);
      }
    },
  });
}
