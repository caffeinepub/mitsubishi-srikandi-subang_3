import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

interface CreditSimulationData {
  vehicleId: bigint;
  amount: bigint;
  term: bigint;
}

export function useSubmitCreditSimulation() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: CreditSimulationData) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - stub
      console.warn('submitCreditSimulation not implemented in backend', data);
    },
  });
}

// Export alias for backward compatibility
export const useCreditSimulationForm = useSubmitCreditSimulation;
