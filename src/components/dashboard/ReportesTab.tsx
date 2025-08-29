import { UserKPICards } from '@/components/UserKPICards';
import { ChannelMetrics } from '@/components/ChannelMetrics';
import { UserAlerts } from '@/components/UserAlerts';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ReportesTab() {
  const { data: dashboardData, isLoading, isError, refetch } = useUserDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Channel Metrics Skeleton */}
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Error al cargar el dashboard
            </h3>
            <p className="text-muted-foreground mb-4">
              No se pudieron obtener los datos del dashboard personalizado
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPIs del Usuario */}
      <UserKPICards kpis={dashboardData.kpis} />

      {/* Métricas por Canal */}
      <ChannelMetrics channels={dashboardData.channelMetrics} />

      {/* Alertas Personalizadas */}
      <UserAlerts alerts={dashboardData.alerts} />
    </div>
  );
}