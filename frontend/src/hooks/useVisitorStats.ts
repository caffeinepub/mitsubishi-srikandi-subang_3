import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VisitorStats } from '../backend';

export function useGetVisitorStats(options?: { refetchInterval?: number }) {
  const { actor, isFetching } = useActor();

  return useQuery<VisitorStats>({
    queryKey: ['visitorStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useGetVisitorStats] Fetching visitor stats...');
      const stats = await actor.getVisitorStats();
      console.log('[useGetVisitorStats] Received stats:', stats);
      return stats;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: options?.refetchInterval,
  });
}

export function useGetVisitorTrend() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, bigint]>>({
    queryKey: ['visitorTrend'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // This endpoint doesn't exist in backend yet
      console.warn('[useGetVisitorTrend] Backend method not implemented');
      return [];
    },
    enabled: false, // Disabled until backend implements this
    refetchInterval: 60000, // 60 seconds
  });
}

export function useGetPageViews() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ['pageViews'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // This endpoint doesn't exist in backend yet
      console.warn('[useGetPageViews] Backend method not implemented');
      return [];
    },
    enabled: false, // Disabled until backend implements this
    refetchInterval: 60000, // 60 seconds
  });
}
