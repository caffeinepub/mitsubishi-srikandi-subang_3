import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

interface AdminStats {
  totalVehicles: number;
  totalPassengerVehicles: number;
  totalCommercialVehicles: number;
  totalContacts: number;
  totalLeads: number;
  totalBlogPosts: number;
  totalMediaAssets: number;
  totalVisitors: number;
  dailyVisitors: number;
}

const ZERO_STATS: AdminStats = {
  totalVehicles: 0,
  totalPassengerVehicles: 0,
  totalCommercialVehicles: 0,
  totalContacts: 0,
  totalLeads: 0,
  totalBlogPosts: 0,
  totalMediaAssets: 0,
  totalVisitors: 0,
  dailyVisitors: 0,
};

export function useGetAdminStats() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) return ZERO_STATS;
      try {
        return ZERO_STATS;
      } catch (err) {
        console.warn("[useGetAdminStats] Failed:", err);
        return ZERO_STATS;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Export alias for backward compatibility
export const useAdminStats = useGetAdminStats;
