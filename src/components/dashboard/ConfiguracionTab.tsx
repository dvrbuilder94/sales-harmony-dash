import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  DollarSign, 
  AlertTriangle, 
  Mail, 
  Smartphone,
  MessageSquare,
  Slack,
  Save
} from 'lucide-react';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import { useToast } from '@/hooks/use-toast';

export function ConfiguracionTab() {
  const { data: dashboardData, isLoading } = useUserDashboard();
  const { toast } = useToast();
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Local state for preferences
  const [alertThresholds, setAlertThresholds] = useState(
    dashboardData?.preferences.alertThresholds || {
      lowRevenue: 100000,
      highDiscrepancy: 50000,
      syncFailures: 3,
    }
  );

  const [notifications, setNotifications] = useState(
    dashboardData?.preferences.notifications || {
      email: true,
      push: false,
      discord: false,
      slack: false,
    }
  );

  const handleThresholdChange = (key: string, value: number) => {
    setAlertThresholds(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save preferences
      toast({
        title: "Configuración guardada",
        description: "Tus preferencias han sido actualizadas correctamente.",
      });
      setUnsavedChanges(false);
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudieron actualizar las preferencias.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 w-32 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configuración Personal</h2>
          <p className="text-muted-foreground">Personaliza alertas y notificaciones según tus necesidades</p>
        </div>
        {unsavedChanges && (
          <Button onClick={handleSave} className="animate-fade-in">
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        )}
      </div>

      {unsavedChanges && (
        <Card className="border-warning bg-warning/5 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-sm text-warning">
                Tienes cambios sin guardar. No olvides guardar tu configuración.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Umbrales de Alertas */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Umbrales de Alertas</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Define cuándo quieres recibir alertas automáticas
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ingresos bajos */}
            <div className="space-y-2">
              <Label htmlFor="lowRevenue" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Ingresos bajos (CLP)</span>
              </Label>
              <Input
                id="lowRevenue"
                type="number"
                value={alertThresholds.lowRevenue}
                onChange={(e) => handleThresholdChange('lowRevenue', Number(e.target.value))}
                placeholder="100000"
              />
              <p className="text-xs text-muted-foreground">
                Alerta cuando los ingresos diarios caigan por debajo de este monto
              </p>
            </div>

            {/* Discrepancias altas */}
            <div className="space-y-2">
              <Label htmlFor="highDiscrepancy" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span>Discrepancia alta (CLP)</span>
              </Label>
              <Input
                id="highDiscrepancy"
                type="number"
                value={alertThresholds.highDiscrepancy}
                onChange={(e) => handleThresholdChange('highDiscrepancy', Number(e.target.value))}
                placeholder="50000"
              />
              <p className="text-xs text-muted-foreground">
                Alerta cuando la diferencia entre ventas y pagos supere este monto
              </p>
            </div>

            {/* Fallos de sincronización */}
            <div className="space-y-2">
              <Label htmlFor="syncFailures" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span>Fallos de sincronización</span>
              </Label>
              <Input
                id="syncFailures"
                type="number"
                value={alertThresholds.syncFailures}
                onChange={(e) => handleThresholdChange('syncFailures', Number(e.target.value))}
                placeholder="3"
                min="1"
                max="10"
              />
              <p className="text-xs text-muted-foreground">
                Alerta después de este número de fallos consecutivos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias de Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias de Notificaciones</CardTitle>
          <p className="text-sm text-muted-foreground">
            Elige cómo quieres recibir las alertas y notificaciones
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Notificaciones por Email</Label>
                  <p className="text-xs text-muted-foreground">
                    Recibe alertas importantes en tu email
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>

            {/* Push */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Notificaciones Push</Label>
                  <p className="text-xs text-muted-foreground">
                    Notificaciones instantáneas en el navegador
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>

            {/* Discord */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Discord</Label>
                  <p className="text-xs text-muted-foreground">
                    Integración con servidor de Discord
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">Próximamente</Badge>
                <Switch
                  checked={notifications.discord}
                  onCheckedChange={(checked) => handleNotificationChange('discord', checked)}
                  disabled
                />
              </div>
            </div>

            {/* Slack */}
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-3">
                <Slack className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="text-sm font-medium">Slack</Label>
                  <p className="text-xs text-muted-foreground">
                    Notificaciones en canal de Slack
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.slack}
                onCheckedChange={(checked) => handleNotificationChange('slack', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración Adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración Adicional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Modo de desarrollo</Label>
              <p className="text-xs text-muted-foreground">
                Activa funciones experimentales y logs detallados
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto-sincronización</Label>
              <p className="text-xs text-muted-foreground">
                Sincronizar canales automáticamente cada hora
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Reportes automáticos</Label>
              <p className="text-xs text-muted-foreground">
                Generar reportes diarios automáticamente
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}