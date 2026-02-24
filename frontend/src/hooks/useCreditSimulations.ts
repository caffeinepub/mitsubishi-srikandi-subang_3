import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { protectedCall } from '../utils/apiClient';
import type { CreditSimulation } from '../types/local';

export function useGetAllCreditSimulations() {
  const { actor, isFetching } = useActor();

  return useQuery<CreditSimulation[]>({
    queryKey: ['creditSimulations'],
    queryFn: async () => {
      if (!actor) return [];
      // Stubbed: backend doesn't have getAllCreditSimulations yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteCreditSimulation() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not initialized');
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, async () => {
        throw new Error('deleteCreditSimulation not yet implemented in backend');
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditSimulations'] });
    },
  });
}
