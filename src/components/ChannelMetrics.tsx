import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import { UserDashboardData } from '@/hooks/useUserDashboard';
import { useChannelSync } from '@/hooks/useUserDashboard';
import { useToast } from '@/hooks/use-toast';

interface ChannelMetricsProps {
  channels: UserDashboardData['channelMetrics'];
}

export function ChannelMetrics({ channels }: ChannelMetricsProps) {
  const { syncChannel } = useChannelSync();
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-warning" />;
    }
  };

  const getHealthVariant = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'default';
      case 'needs_setup':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSyncChannel = async (channelId: string) => {
    try {
      await syncChannel(channelId);
      toast({
        title: "Sincronización iniciada",
        description: `Canal ${channelId} está siendo sincronizado.`,
      });
    } catch (error) {
      toast({
        title: "Error de sincronización",
        description: "No se pudo iniciar la sincronización del canal.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Rendimiento por Canal</h3>
        <Badge variant="outline" className="text-xs">
          {channels.length} canales configurados
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <Card key={channel.id} className="hover-scale">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(channel.status)}
                  <CardTitle className="text-sm font-medium">
                    {channel.name}
                  </CardTitle>
                </div>
                <Badge variant={getHealthVariant(channel.healthStatus)} className="text-xs">
                  {channel.healthStatus === 'healthy' ? 'Saludable' : 
                   channel.healthStatus === 'needs_setup' ? 'Requiere configuración' : 'Error'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Métricas principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Ingresos 30d</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {formatCurrency(channel.revenue30d)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Órdenes</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {channel.orders30d}
                  </div>
                </div>
              </div>

              {/* Tasa de conversión */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tasa de conversión</span>
                  <span className="text-xs font-medium text-foreground">
                    {channel.conversionRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={channel.conversionRate} className="h-1" />
              </div>

              {/* Última sincronización */}
              {channel.lastSync && (
                <div className="text-xs text-muted-foreground">
                  Última sync: {new Date(channel.lastSync).toLocaleString('es-CL')}
                </div>
              )}

              {/* Acciones */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSyncChannel(channel.id)}
                  className="flex-1"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sincronizar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}