import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WebsiteSettings } from '../types/local';

export function useGetWebsiteSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<WebsiteSettings | null>({
    queryKey: ['websiteSettings'],
    queryFn: async () => {
      if (!actor) return null;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}
