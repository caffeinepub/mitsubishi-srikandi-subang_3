import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export function useSubmitContact() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - stub
      console.warn('submitContact not implemented in backend', data);
    },
  });
}

// Export alias for backward compatibility
export const useContactForm = useSubmitContact;
