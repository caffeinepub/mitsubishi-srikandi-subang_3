import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CreditSimulation } from '../types/local';

export function useGetAllCreditSimulations() {
  const { actor, isFetching } = useActor();

  return useQuery<CreditSimulation[]>({
    queryKey: ['creditSimulations'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - return empty array
      return [] as CreditSimulation[];
    },
    enabled: !!actor && !isFetching,
  });
}
