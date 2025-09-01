import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Key,
  Database,
  Webhook,
  Mail,
  Smartphone,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

const Configuracion = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    discord: false,
    slack: true
  })

  const [alertThresholds, setAlertThresholds] = useState({
    lowRevenue: 100000,
    highDiscrepancy: 5,
    syncFailures: 3
  })

  const [profile, setProfile] = useState({
    name: 'Usuario Admin',
    email: 'admin@salesharmony.cl',
    company: 'Mi Empresa Ltda.',
    rut: '12.345.678-9'
  })

  const apiKeys = [
    { name: 'MercadoLibre API', status: 'active', lastUsed: '2024-01-15', expires: '2024-12-31' },
    { name: 'Falabella API', status: 'expired', lastUsed: '2024-01-10', expires: '2024-01-10' },
    { name: 'SII Webservice', status: 'active', lastUsed: '2024-01-15', expires: 'Never' }
  ]

  const handleSaveProfile = () => {
    console.log('Saving profile:', profile)
  }

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications)
  }

  const handleSaveThresholds = () => {
    console.log('Saving thresholds:', alertThresholds)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Administra tu perfil, notificaciones y configuraciones del sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sistema Saludable
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="rut">RUT Empresa</Label>
                  <Input
                    id="rut"
                    value={profile.rut}
                    onChange={(e) => setProfile({ ...profile, rut: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div>
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input id="new-password" type="password" />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <div className="flex justify-end">
                <Button variant="outline">
                  Cambiar Contraseña
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Notificaciones por Email</div>
                      <div className="text-sm text-muted-foreground">
                        Recibe alertas importantes por correo electrónico
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Notificaciones Push</div>
                      <div className="text-sm text-muted-foreground">
                        Notificaciones en tiempo real en el navegador
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, push: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-indigo-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      D
                    </div>
                    <div>
                      <div className="font-medium">Discord Integration</div>
                      <div className="text-sm text-muted-foreground">
                        Envía alertas críticas a tu canal de Discord
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.discord}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, discord: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-500 rounded text-white text-xs flex items-center justify-center font-bold">
                      S
                    </div>
                    <div>
                      <div className="font-medium">Slack Integration</div>
                      <div className="text-sm text-muted-foreground">
                        Notificaciones automáticas en Slack
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.slack}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, slack: checked })
                    }
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Gestión de API Keys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((api, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Key className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{api.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Último uso: {new Date(api.lastUsed).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={api.status === 'active' ? 'default' : 'destructive'}
                        className={api.status === 'active' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : ''
                        }
                      >
                        {api.status === 'active' ? 'Activa' : 'Expirada'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {api.status === 'active' ? 'Renovar' : 'Configurar'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Los webhooks permiten recibir notificaciones automáticas de eventos importantes.
                  Configura endpoints para recibir actualizaciones en tiempo real.
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Button variant="outline">
                  Configurar Webhooks
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alertas */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Umbrales de Alerta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="low-revenue">Ingresos Bajos (CLP)</Label>
                  <Input
                    id="low-revenue"
                    type="number"
                    value={alertThresholds.lowRevenue}
                    onChange={(e) => setAlertThresholds({ 
                      ...alertThresholds, 
                      lowRevenue: parseInt(e.target.value) || 0 
                    })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Alerta cuando los ingresos diarios estén por debajo de este monto
                  </p>
                </div>

                <div>
                  <Label htmlFor="high-discrepancy">Discrepancias Altas (%)</Label>
                  <Input
                    id="high-discrepancy"
                    type="number"
                    value={alertThresholds.highDiscrepancy}
                    onChange={(e) => setAlertThresholds({ 
                      ...alertThresholds, 
                      highDiscrepancy: parseInt(e.target.value) || 0 
                    })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Alerta cuando el porcentaje de discrepancias supere este valor
                  </p>
                </div>

                <div>
                  <Label htmlFor="sync-failures">Fallos de Sincronización</Label>
                  <Input
                    id="sync-failures"
                    type="number"
                    value={alertThresholds.syncFailures}
                    onChange={(e) => setAlertThresholds({ 
                      ...alertThresholds, 
                      syncFailures: parseInt(e.target.value) || 0 
                    })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Alerta después de este número de fallos consecutivos
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveThresholds} className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar Umbrales
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sistema */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Versión de la aplicación</span>
                    <Badge variant="outline">v2.1.0</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Base de datos</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Conectada</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">APIs externas</span>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">2/3 Activas</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Último backup</span>
                    <span className="text-sm text-muted-foreground">Hace 2 horas</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Actualizar Sistema
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Database className="h-4 w-4" />
                    Backup Manual
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Settings className="h-4 w-4" />
                    Configuración Avanzada
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logs del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-xs bg-muted p-4 rounded-lg max-h-48 overflow-y-auto">
                <div className="text-green-600">[2024-01-15 10:30:00] Sistema iniciado correctamente</div>
                <div className="text-blue-600">[2024-01-15 10:31:15] Conexión establecida con MercadoLibre API</div>
                <div className="text-blue-600">[2024-01-15 10:31:45] Sincronización completada: 145 productos</div>
                <div className="text-yellow-600">[2024-01-15 10:32:10] Advertencia: Falabella API respuesta lenta</div>
                <div className="text-green-600">[2024-01-15 10:33:00] Backup automático completado</div>
                <div className="text-red-600">[2024-01-15 10:34:22] Error: Timeout en conexión ERP Softland</div>
                <div className="text-blue-600">[2024-01-15 10:35:10] Reintento exitoso: ERP Softland reconectado</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Configuracion