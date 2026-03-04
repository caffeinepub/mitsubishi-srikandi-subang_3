import { useMutation } from "@tanstack/react-query";
import { useActor } from "./useActor";

interface CreditSimulationData {
  vehicleId: bigint;
  amount: bigint;
  term: bigint;
}

export function useSubmitCreditSimulation() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: CreditSimulationData) => {
      if (!actor) throw new Error("Actor not initialized");
      // Stubbed: backend doesn't have submitCreditSimulation yet
      // Public form - no auth required
      console.log("[CreditSimulation] Submitted:", data);
      return { success: true };
    },
  });
}

// Backward compatibility aliases
export const useSubmitCreditSimulationForm = useSubmitCreditSimulation;
export const useCreditSimulationForm = useSubmitCreditSimulation;
