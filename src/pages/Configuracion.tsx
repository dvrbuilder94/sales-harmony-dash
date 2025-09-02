import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Building2, 
  Users, 
  Zap, 
  Key,
  Palette,
  Save,
  CheckCircle,
  AlertTriangle,
  Settings,
  Database,
  Webhook,
  Mail,
  Smartphone,
  Shield,
  User
} from 'lucide-react'

const Configuracion = () => {
  const [activeTab, setActiveTab] = useState('empresa')
  const [erpConnected, setErpConnected] = useState(false)
  const [selectedErp, setSelectedErp] = useState<'softland' | 'nubox' | null>(null)
  
  const [empresaData, setEmpresaData] = useState({
    razonSocial: 'Mi Empresa Ltda.',
    rut: '12.345.678-9',
    direccion: 'Av. Providencia 123, Santiago',
    telefono: '+56 2 2234 5678',
    email: 'contacto@miempresa.cl'
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    discord: false,
    slack: true
  })

  const apiKeys = [
    { name: 'MercadoLibre API', status: 'active', lastUsed: '2024-01-15' },
    { name: 'Falabella API', status: 'expired', lastUsed: '2024-01-10' },
    { name: 'SII Webservice', status: 'active', lastUsed: '2024-01-15' }
  ]

  const users = [
    { name: 'Admin Principal', email: 'admin@miempresa.cl', role: 'Admin', status: 'active' },
    { name: 'Contador', email: 'contador@miempresa.cl', role: 'Contador', status: 'active' },
    { name: 'Vendedor', email: 'ventas@miempresa.cl', role: 'Vendedor', status: 'pending' }
  ]

  const handleConnectErp = (erpType: 'softland' | 'nubox') => {
    setSelectedErp(erpType)
    setErpConnected(true)
  }

  const handleDisconnectErp = () => {
    setSelectedErp(null)
    setErpConnected(false)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted">
        <AppSidebar />
        
        <main className="flex-1">
          <header className="h-16 flex items-center border-b bg-background/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-xl font-semibold">⚙️ Configuración</h1>
              <p className="text-sm text-muted-foreground">Administra tu empresa, usuarios e integraciones</p>
            </div>
          </header>

          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-muted">
                <TabsTrigger value="empresa" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  🏢 Empresa
                </TabsTrigger>
                <TabsTrigger value="usuarios" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  👥 Usuarios
                </TabsTrigger>
                <TabsTrigger value="erp" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  🔗 ERP
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  🔑 API Keys
                </TabsTrigger>
                <TabsTrigger value="preferencias" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  🎨 Preferencias
                </TabsTrigger>
              </TabsList>

              {/* Tab Empresa */}
              <TabsContent value="empresa" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Datos de la Empresa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="razon-social">Razón Social</Label>
                        <Input
                          id="razon-social"
                          value={empresaData.razonSocial}
                          onChange={(e) => setEmpresaData({ ...empresaData, razonSocial: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rut">RUT Empresa</Label>
                        <Input
                          id="rut"
                          value={empresaData.rut}
                          onChange={(e) => setEmpresaData({ ...empresaData, rut: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          value={empresaData.direccion}
                          onChange={(e) => setEmpresaData({ ...empresaData, direccion: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          value={empresaData.telefono}
                          onChange={(e) => setEmpresaData({ ...empresaData, telefono: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={empresaData.email}
                          onChange={(e) => setEmpresaData({ ...empresaData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="gap-2">
                        <Save className="h-4 w-4" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Usuarios */}
              <TabsContent value="usuarios" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Gestión de Usuarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                     <div className="flex items-center gap-3">
                       <Badge variant="outline">{user.role}</Badge>
                       <Badge 
                         variant={user.status === 'active' ? 'default' : 'secondary'}
                         className={user.status === 'active' 
                           ? 'bg-green-100 text-green-800 border-green-200' 
                           : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                         }
                       >
                         {user.status === 'active' ? 'Activo' : 'Pendiente'}
                       </Badge>
                     </div>
                        </div>
                      ))}
                    </div>
                     <div className="mt-4">
                       <Button
                         onClick={() => {
                           // Add user invitation functionality
                           console.log('Inviting new user...')
                         }}
                       >
                         Invitar Usuario
                       </Button>
                     </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab ERP - LÓGICA ERP ÚNICO */}
              <TabsContent value="erp" className="space-y-6">
                {!erpConnected ? (
                  // Estado: Sin ERP conectado
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Integración ERP
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Conecta tu sistema contable para sincronización automática
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card Softland */}
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Database className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Softland</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Sistema contable líder en Chile con integración completa
                            </p>
                            <Button onClick={() => handleConnectErp('softland')} className="w-full">
                              Conectar Softland
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Card Nubox */}
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
                              <Database className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Nubox</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Plataforma contable moderna basada en la nube
                            </p>
                            <Button onClick={() => handleConnectErp('nubox')} className="w-full">
                              Conectar Nubox
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // Estado: ERP Conectado
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          ERP Conectado: {selectedErp === 'softland' ? 'Softland' : 'Nubox'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-6">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            ✅ Activo
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Última sincronización: Hace 15 minutos
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-primary">1,247</div>
                            <div className="text-sm text-muted-foreground">Registros sincronizados</div>
                          </div>
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-green-600">0</div>
                            <div className="text-sm text-muted-foreground">Errores pendientes</div>
                          </div>
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">98.5%</div>
                            <div className="text-sm text-muted-foreground">Tasa de éxito</div>
                          </div>
                        </div>

                         <div className="flex gap-4">
                           <Button 
                             variant="outline"
                             onClick={() => {
                               console.log('Configuring account mapping...')
                             }}
                           >
                             Configurar Mapeo
                           </Button>
                           <Button 
                             variant="outline"
                             onClick={() => {
                               console.log('Showing sync logs...')
                             }}
                           >
                             Ver Logs
                           </Button>
                           <Button 
                             variant="destructive" 
                             onClick={handleDisconnectErp}
                           >
                             Desconectar ERP
                           </Button>
                         </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Tab API Keys */}
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

              {/* Tab Preferencias */}
              <TabsContent value="preferencias" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Notificaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Email</div>
                            <div className="text-sm text-muted-foreground">Alertas por correo</div>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) => 
                            setNotifications({ ...notifications, email: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Push</div>
                            <div className="text-sm text-muted-foreground">Notificaciones en navegador</div>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) => 
                            setNotifications({ ...notifications, push: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-indigo-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            D
                          </div>
                          <div>
                            <div className="font-medium">Discord</div>
                            <div className="text-sm text-muted-foreground">Alertas en Discord</div>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.discord}
                          onCheckedChange={(checked) => 
                            setNotifications({ ...notifications, discord: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-purple-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            S
                          </div>
                          <div>
                            <div className="font-medium">Slack</div>
                            <div className="text-sm text-muted-foreground">Notificaciones en Slack</div>
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
                      <Button className="gap-2">
                        <Save className="h-4 w-4" />
                        Guardar Configuración
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Apariencia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Tema</Label>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">Claro</Button>
                          <Button variant="outline" size="sm">Oscuro</Button>
                          <Button variant="outline" size="sm">Sistema</Button>
                        </div>
                      </div>
                      <div>
                        <Label>Idioma</Label>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">Español</Button>
                          <Button variant="outline" size="sm">English</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Configuracion