import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VisitorStats, WebsiteSettings } from '../backend';

/**
 * Phase 1 Foundation Hooks
 * Basic queries for testing backend connectivity
 */

export function useGetVisitorStats() {
  const { actor, isFetching } = useActor();

  return useQuery<VisitorStats>({
    queryKey: ['visitorStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getVisitorStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWebsiteSettings(id: number = 1) {
  const { actor, isFetching } = useActor();

  return useQuery<WebsiteSettings | null>({
    queryKey: ['websiteSettings', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWebsiteSettings(BigInt(id));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIncrementPageView() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.incrementPageView();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitorStats'] });
    },
  });
}
