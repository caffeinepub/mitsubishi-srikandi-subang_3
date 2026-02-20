import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CommercialVehicleCategory } from '../types/local';

export function useGetAllCommercialVehicleCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<CommercialVehicleCategory[]>({
    queryKey: ['commercialVehicleCategories'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - return empty array
      return [] as CommercialVehicleCategory[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCommercialVehicleCategory(categoryId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<CommercialVehicleCategory | null>({
    queryKey: ['commercialVehicleCategory', categoryId?.toString()],
    queryFn: async () => {
      if (!actor || !categoryId) return null;
      // Backend method missing - return null
      return null;
    },
    enabled: !!actor && !isFetching && categoryId !== null,
  });
}

export function useCreateCommercialVehicleCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: CommercialVehicleCategory) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - stub
      console.warn('createCommercialVehicleCategory not implemented in backend');
      return BigInt(0);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercialVehicleCategories'] });
    },
  });
}

export function useUpdateCommercialVehicleCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: CommercialVehicleCategory) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - stub
      console.warn('updateCommercialVehicleCategory not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercialVehicleCategories'] });
      queryClient.invalidateQueries({ queryKey: ['commercialVehicleCategory'] });
    },
  });
}

export function useDeleteCommercialVehicleCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - stub
      console.warn('deleteCommercialVehicleCategory not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercialVehicleCategories'] });
    },
  });
}
