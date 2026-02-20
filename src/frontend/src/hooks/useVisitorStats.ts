import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VisitorStats } from '../types/local';

export function useGetVisitorStats() {
  const { actor, isFetching } = useActor();

  return useQuery<VisitorStats>({
    queryKey: ['visitorStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const stats = await actor.getVisitorStats();
      return {
        totalVisitors: stats.totalVisitors,
        dailyVisitors: stats.dailyVisitors,
        weeklyVisitors: stats.weeklyVisitors,
        monthlyVisitors: stats.monthlyVisitors,
        pageViews: stats.pageViews,
      } as VisitorStats;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateVisitorStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stats: VisitorStats) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - stub
      console.warn('updateVisitorStats not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitorStats'] });
    },
  });
}
