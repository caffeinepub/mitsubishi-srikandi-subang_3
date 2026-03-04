import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAdminStats } from '../../hooks/useAdminStats';
import { useActor } from '../../hooks/useActor';
import { Car, Truck, FileText, Mail, Image, Users, UserCircle, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading } = useAdminStats();
  const { actor, isFetching: actorFetching } = useActor();

  const [whoAmIResult, setWhoAmIResult] = useState<string | null>(null);
  const [whoAmILoading, setWhoAmILoading] = useState(false);
  const [whoAmIError, setWhoAmIError] = useState<string | null>(null);

  const handleWhoAmI = async () => {
    if (!actor) {
      setWhoAmIError('Actor belum siap. Pastikan kamu sudah login.');
      return;
    }
    setWhoAmILoading(true);
    setWhoAmIError(null);
    setWhoAmIResult(null);
    try {
      const result = await actor.whoAmI();
      setWhoAmIResult(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setWhoAmIError(`Gagal memanggil whoAmI: ${message}`);
    } finally {
      setWhoAmILoading(false);
    }
  };

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

      {/* Who Am I Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-muted-foreground" />
            Identitas Caller (whoAmI)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Klik tombol di bawah untuk memeriksa principal ID yang dikenali oleh backend canister.
          </p>
          <Button
            onClick={handleWhoAmI}
            disabled={whoAmILoading || actorFetching || !actor}
            variant="outline"
            size="sm"
          >
            {whoAmILoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              <>
                <UserCircle className="mr-2 h-4 w-4" />
                Who Am I?
              </>
            )}
          </Button>

          {whoAmIResult && (
            <div className="rounded-md bg-muted px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Principal ID:</p>
              <p className="font-mono text-sm break-all text-foreground">{whoAmIResult}</p>
            </div>
          )}

          {whoAmIError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3">
              <p className="text-sm text-destructive">{whoAmIError}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
