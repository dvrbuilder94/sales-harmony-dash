import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, DollarSign, Link, AlertTriangle } from 'lucide-react';
import { UserDashboardData } from '@/hooks/useUserDashboard';

interface UserKPICardsProps {
  kpis: UserDashboardData['kpis'];
}

export function UserKPICards({ kpis }: UserKPICardsProps) {
  const getTrendIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Ventas 30 días */}
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ventas (30 días)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(kpis.ventas30d.total)}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            {getTrendIcon(kpis.ventas30d.tendencia)}
            <span className={`text-xs ${
              kpis.ventas30d.cambio > 0 ? 'text-success' : 
              kpis.ventas30d.cambio < 0 ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {kpis.ventas30d.cambio > 0 ? '+' : ''}{kpis.ventas30d.cambio.toFixed(1)}% vs mes anterior
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Canales Activos */}
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Canales Activos
          </CardTitle>
          <Link className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {kpis.canalesActivos}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant={kpis.canalesActivos > 0 ? "default" : "secondary"} className="text-xs">
              {kpis.canalesActivos > 0 ? 'Conectados' : 'Sin conexiones'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Discrepancias */}
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Discrepancias
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {kpis.discrepancias.total}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            {kpis.discrepancias.sinResolver > 0 ? (
              <Badge variant="destructive" className="text-xs">
                {kpis.discrepancias.sinResolver} sin resolver
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs">
                Todas resueltas
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}