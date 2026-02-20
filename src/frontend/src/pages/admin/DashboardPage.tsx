import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminStats } from '../../hooks/useAdminStats';
import { Car, Truck, FileText, Mail, Image, Users } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    {
      title: 'Total Mobil Keluarga',
      value: stats?.totalPassengerVehicles || 0,
      icon: Car,
      color: 'text-blue-600',
    },
    {
      title: 'Total Mobil Niaga',
      value: stats?.totalCommercialVehicles || 0,
      icon: Truck,
      color: 'text-green-600',
    },
    {
      title: 'Total Artikel Blog',
      value: stats?.totalBlogPosts || 0,
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      title: 'Total Leads Masuk',
      value: stats?.totalLeads || 0,
      icon: Mail,
      color: 'text-orange-600',
    },
    {
      title: 'Total Media Assets',
      value: stats?.totalMediaAssets || 0,
      icon: Image,
      color: 'text-pink-600',
    },
    {
      title: 'Total Visitor',
      value: stats?.totalVisitors || 0,
      icon: Users,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di Admin Panel Mitsubishi Srikandi Subang
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
