import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ContactSubmission } from '../types/local';

export function useGetAllContacts() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactSubmission[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - return empty array
      return [] as ContactSubmission[];
    },
    enabled: !!actor && !isFetching,
  });
}

// Export alias for backward compatibility
export const useGetAllContactSubmissions = useGetAllContacts;
