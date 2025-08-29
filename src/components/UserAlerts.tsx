import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Info, 
  XCircle, 
  X,
  Settings,
  Bell
} from 'lucide-react';
import { UserDashboardData } from '@/hooks/useUserDashboard';

interface UserAlertsProps {
  alerts: UserDashboardData['alerts'];
}

export function UserAlerts({ alerts }: UserAlertsProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Alertas Activas</h3>
          {activeAlerts.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              {activeAlerts.length}
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configurar Alertas
        </Button>
      </div>

      {activeAlerts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-muted-foreground" />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              No hay alertas activas
            </h4>
            <p className="text-xs text-muted-foreground">
              Todas tus métricas están dentro de los parámetros normales
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <Alert 
              key={alert.id} 
              variant={getAlertVariant(alert.type)}
              className="animate-fade-in"
            >
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <AlertTitle className="text-sm font-medium">
                    {alert.title}
                    {alert.channelId && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Canal ID: {alert.channelId}
                      </Badge>
                    )}
                  </AlertTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleString('es-CL')}
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <AlertDescription className="text-xs mt-1">
                  {alert.message}
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Resumen de alertas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Resumen de Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-destructive">
                {alerts.filter(a => a.type === 'error' && a.isActive).length}
              </div>
              <div className="text-xs text-muted-foreground">Errores</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-warning">
                {alerts.filter(a => a.type === 'warning' && a.isActive).length}
              </div>
              <div className="text-xs text-muted-foreground">Advertencias</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {alerts.filter(a => a.type === 'info' && a.isActive).length}
              </div>
              <div className="text-xs text-muted-foreground">Información</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}