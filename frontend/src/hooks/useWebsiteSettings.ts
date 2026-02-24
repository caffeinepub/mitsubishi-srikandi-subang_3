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
      return actor.getWebsiteSettings();
    },
    enabled: !!actor && !isFetching,
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
