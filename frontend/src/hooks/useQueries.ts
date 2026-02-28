import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { WebsiteSettings } from '../backend';

export function useGetWebsiteSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<WebsiteSettings | null>({
    queryKey: ['websiteSettings'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getWebsiteSettings();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}
