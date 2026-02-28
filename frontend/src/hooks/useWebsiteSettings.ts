import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { WebsiteSettings } from '../backend';
import { protectedCall } from '../utils/apiClient';

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

export function useUpdateWebsiteSettings() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: WebsiteSettings) => {
      if (!actor) throw new Error('Actor not initialized');
      const principalId = identity?.getPrincipal().toString();
      return protectedCall(principalId, () =>
        actor.updateWebsiteSettings(settings)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websiteSettings'] });
    },
  });
}
