import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Eye, Calendar, TrendingUp, Activity } from 'lucide-react';
import {
  useGetVisitorStats,
  useGetVisitorTrend,
  useGetPageViews,
} from '../../hooks/useVisitorStats';
import VisitorTrendChart from '../../components/admin/VisitorTrendChart';
import TopPagesChart from '../../components/admin/TopPagesChart';

export default function VisitorStatsPage() {
  // Auto-refresh every 15 seconds
  const { data: visitorStats, isLoading } = useGetVisitorStats({ refetchInterval: 15000 });
  const { data: trendData, isLoading: trendLoading } = useGetVisitorTrend();
  const { data: pageViewsData, isLoading: pageViewsLoading } = useGetPageViews();

  const formatNumber = (num: bigint | undefined): string => {
    if (num === undefined) return '0';
    return Number(num).toLocaleString('id-ID');
  };

  const stats = [
    {
      title: 'Total Pengunjung',
      value: visitorStats?.totalVisitors || BigInt(0),
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Pengunjung Hari Ini',
      value: visitorStats?.visitorsToday || BigInt(0),
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Pengunjung Kemarin',
      value: visitorStats?.visitorsYesterday || BigInt(0),
      icon: Calendar,
      color: 'text-orange-600',
    },
    {
      title: 'Pengunjung Mingguan',
      value: visitorStats?.visitorsThisWeek || BigInt(0),
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Pengunjung Bulanan',
      value: visitorStats?.visitorsThisMonth || BigInt(0),
      icon: TrendingUp,
      color: 'text-pink-600',
    },
    {
      title: 'Pengunjung Tahunan',
      value: visitorStats?.visitorsThisYear || BigInt(0),
      icon: TrendingUp,
      color: 'text-indigo-600',
    },
    {
      title: 'Online Sekarang',
      value: visitorStats?.onlineNow || BigInt(0),
      icon: Activity,
      color: 'text-emerald-600',
    },
    {
      title: 'Page Views Hari Ini',
      value: visitorStats?.pageViewsToday || BigInt(0),
      icon: Eye,
      color: 'text-cyan-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistik Pengunjung</h1>
        <p className="text-muted-foreground">
          Pantau aktivitas pengunjung website secara real-time (auto-refresh setiap 15 detik)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{formatNumber(stat.value)}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorTrendChart data={trendData} isLoading={trendLoading} />
        <TopPagesChart data={pageViewsData} isLoading={pageViewsLoading} />
      </div>
    </div>
  );
}
