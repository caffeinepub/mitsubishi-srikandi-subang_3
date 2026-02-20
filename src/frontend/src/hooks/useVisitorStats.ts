import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VisitorStats } from '../backend';

export function useGetVisitorStats(options?: { refetchInterval?: number }) {
  const { actor, isFetching } = useActor();

  return useQuery<VisitorStats>({
    queryKey: ['visitorStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getVisitorStats();
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
      return actor.getVisitorTrendLast30Days();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000, // 15 seconds
  });
}

export function useGetPageViews() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, bigint]>>({
    queryKey: ['pageViews'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPageViewsByUrl();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000, // 15 seconds
  });
}
