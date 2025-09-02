import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Book, Download, Zap, Globe, Lock, Clock } from 'lucide-react';

export default function Developers() {
  const sdks = [
    {
      name: 'JavaScript SDK',
      version: 'v1.2.0',
      language: 'JavaScript',
      description: 'SDK oficial para Node.js y navegadores',
      install: 'npm install salesharmony-sdk',
      documentation: '/docs/javascript-sdk'
    },
    {
      name: 'Python SDK',
      version: 'v1.1.5',
      language: 'Python',
      description: 'SDK para aplicaciones Python y Django',
      install: 'pip install salesharmony-python',
      documentation: '/docs/python-sdk'
    },
    {
      name: 'PHP SDK',
      version: 'v1.0.8',
      language: 'PHP',
      description: 'SDK para aplicaciones PHP y Laravel',
      install: 'composer require salesharmony/php-sdk',
      documentation: '/docs/php-sdk'
    }
  ];

  const endpoints = [
    {
      method: 'GET',
      path: '/api/reconciliation-center',
      description: 'Obtiene el dashboard principal con KPIs',
      auth: 'API Key'
    },
    {
      method: 'GET', 
      path: '/api/dashboards/seller',
      description: 'Métricas específicas para vendedores',
      auth: 'API Key'
    },
    {
      method: 'GET',
      path: '/api/dashboards/accountant', 
      description: 'Métricas específicas para contadores',
      auth: 'API Key'
    },
    {
      method: 'POST',
      path: '/api/reconciliation/ai-process',
      description: 'Ejecuta conciliación automática con IA',
      auth: 'API Key'
    },
    {
      method: 'GET',
      path: '/api/sales/overview',
      description: 'Resumen de ventas por producto',
      auth: 'API Key'
    }
  ];

  const rateLimits = {
    free: { requests: 100, window: 'hora', concurrent: 5 },
    starter: { requests: 1000, window: 'hora', concurrent: 10 },
    professional: { requests: 5000, window: 'hora', concurrent: 25 },
    enterprise: { requests: 50000, window: 'hora', concurrent: 100 }
  };

  return (
    <AppLayout title="Portal de Desarrolladores" description="Integra SalesHarmony en tu aplicación">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Portal de Desarrolladores
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Integra la conciliación inteligente en tu aplicación con nuestra API RESTful y SDKs oficiales.
          </p>
        </div>

        <Tabs defaultValue="quickstart" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="sdks">SDKs</TabsTrigger>
            <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* Quick Start */}
          <TabsContent value="quickstart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Primeros Pasos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">1</div>
                    <h3 className="font-semibold">Obtén tu API Key</h3>
                    <p className="text-sm text-muted-foreground">Regístrate y obtén tu clave API desde el dashboard de configuración.</p>
                    <Button size="sm" variant="outline">Obtener API Key</Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">2</div>
                    <h3 className="font-semibold">Instala el SDK</h3>
                    <p className="text-sm text-muted-foreground">Elige tu lenguaje favorito e instala nuestro SDK oficial.</p>
                    <Button size="sm" variant="outline">Ver SDKs</Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">3</div>
                    <h3 className="font-semibold">Haz tu primera llamada</h3>
                    <p className="text-sm text-muted-foreground">Comienza con una llamada simple para obtener los KPIs del dashboard.</p>
                    <Button size="sm" variant="outline">Ver Ejemplo</Button>
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Ejemplo con JavaScript SDK
                    </h4>
                    <pre className="text-sm overflow-x-auto bg-background p-4 rounded border">
{`// Instalar SDK
npm install salesharmony-sdk

// Usar en tu aplicación
import SalesHarmony from 'salesharmony-sdk';

const client = new SalesHarmony('your-api-key');

// Obtener dashboard principal
const dashboard = await client.dashboards.seller();
console.log(dashboard);

// Ejecutar conciliación IA  
const result = await client.reconciliation.autoProcess({
  type: 'auto_match'
});`}
                    </pre>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Reference */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Referencia de API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 text-center">
                      <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="font-semibold">Base URL</div>
                      <div className="text-sm text-muted-foreground">https://api.salesharmony.cl</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <Lock className="h-8 w-8 text-success mx-auto mb-2" />
                      <div className="font-semibold">Autenticación</div>
                      <div className="text-sm text-muted-foreground">API Key en headers</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <Clock className="h-8 w-8 text-info mx-auto mb-2" />
                      <div className="font-semibold">Rate Limit</div>
                      <div className="text-sm text-muted-foreground">Según tu plan</div>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Endpoints Principales</h4>
                    {endpoints.map((endpoint, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                                className="font-mono"
                              >
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm">{endpoint.path}</code>
                            </div>
                            <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                            <div className="text-xs text-muted-foreground">
                              Autenticación: {endpoint.auth}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Probar
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SDKs */}
          <TabsContent value="sdks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sdks.map((sdk, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        {sdk.name}
                      </div>
                      <Badge variant="outline">{sdk.version}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{sdk.description}</p>
                    
                    <Card className="bg-muted/50">
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground mb-1">Instalación:</div>
                        <code className="text-sm">{sdk.install}</code>
                      </CardContent>
                    </Card>
                    
                    <div className="space-y-2">
                      <Button className="w-full" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar SDK
                      </Button>
                      <Button className="w-full" variant="ghost">
                        Ver Documentación
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sandbox */}
          <TabsContent value="sandbox" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🧪 Entorno de Pruebas (Sandbox)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-info/10 p-4 rounded-lg border border-info/20">
                  <div className="flex items-center gap-2 text-info font-medium mb-2">
                    <Globe className="h-4 w-4" />
                    Sandbox URL
                  </div>
                  <code className="text-sm">https://sandbox-api.salesharmony.cl</code>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Características del Sandbox</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Datos de prueba precargados</li>
                      <li>• Sin afectar datos de producción</li>
                      <li>• Todas las funcionalidades disponibles</li>
                      <li>• Rate limits relajados para desarrollo</li>
                      <li>• Reset automático cada 24 horas</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Credenciales de Prueba</h4>
                    <Card className="bg-muted/50">
                      <CardContent className="p-3 space-y-2">
                        <div>
                          <div className="text-xs text-muted-foreground">API Key:</div>
                          <code className="text-sm">sandbox_test_key_123456789</code>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Empresa Test:</div>
                          <code className="text-sm">12345678-9</code>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Button className="w-full">
                  Acceder al Sandbox
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks */}
          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🔔 Webhooks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Recibe notificaciones en tiempo real cuando ocurren eventos en tu cuenta de SalesHarmony.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Eventos Disponibles</h4>
                    <div className="space-y-2">
                      <Badge variant="outline">reconciliation.completed</Badge>
                      <Badge variant="outline">discrepancy.detected</Badge>
                      <Badge variant="outline">payment.processed</Badge>
                      <Badge variant="outline">sii.invoice.validated</Badge>
                      <Badge variant="outline">erp.sync.completed</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Configuración</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input type="text" placeholder="https://tu-app.com/webhooks" className="flex-1 px-3 py-2 border rounded text-sm" />
                        <Button size="sm">Guardar</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tu endpoint debe responder con status 200 para confirmar recepción.
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Ejemplo de Payload</h4>
                    <pre className="text-xs overflow-x-auto bg-background p-3 rounded border">
{`{
  "event": "reconciliation.completed",
  "timestamp": "2024-09-02T10:30:00Z",
  "data": {
    "reconciliation_id": "rec_123456",
    "processed_items": 2847,
    "success_rate": 98.7,
    "discrepancies_found": 3
  }
}`}
                    </pre>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rate Limits */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Rate Limits por Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(rateLimits).map(([plan, limits]) => (
                <Card key={plan} className="p-4 text-center">
                  <div className="font-semibold capitalize mb-2">{plan}</div>
                  <div className="space-y-1 text-sm">
                    <div>{limits.requests.toLocaleString()}/({limits.window})</div>
                    <div className="text-muted-foreground">{limits.concurrent} concurrentes</div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="text-center bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">
              ¿Necesitas ayuda con la integración?
            </h3>
            <p className="text-muted-foreground mb-4">
              Nuestro equipo de desarrolladores está aquí para ayudarte.
            </p>
            <div className="space-x-4">
              <Button>
                Contactar Soporte
              </Button>
              <Button variant="outline">
                Ver Ejemplos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}