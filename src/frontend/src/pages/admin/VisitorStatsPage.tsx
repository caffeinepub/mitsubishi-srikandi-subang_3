import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Eye, Calendar, TrendingUp } from 'lucide-react';
import { useGetVisitorStats } from '../../hooks/useVisitorStats';

export default function VisitorStatsPage() {
  const { data: visitorStats, isLoading } = useGetVisitorStats();

  const stats = [
    { title: 'Total', value: visitorStats?.totalVisitors || BigInt(0), icon: Users },
    { title: 'Hari ini', value: visitorStats?.dailyVisitors || BigInt(0), icon: Calendar },
    { title: 'Kemarin', value: BigInt(0), icon: Calendar },
    { title: 'Mingguan', value: visitorStats?.weeklyVisitors || BigInt(0), icon: TrendingUp },
    { title: 'Bulanan', value: visitorStats?.monthlyVisitors || BigInt(0), icon: TrendingUp },
    { title: 'Tahunan', value: BigInt(0), icon: TrendingUp },
    { title: 'Online', value: BigInt(0), icon: Users },
    { title: 'Page Views', value: visitorStats?.pageViews || BigInt(0), icon: Eye },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistik Pengunjung</h1>
        <p className="text-muted-foreground">
          Pantau aktivitas pengunjung website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value.toString()}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
