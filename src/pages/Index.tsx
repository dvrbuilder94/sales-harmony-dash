import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw } from 'lucide-react'

const Index = () => {

  const headerActions = (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2"
      onClick={() => window.location.reload()}
    >
      <RefreshCw className="h-4 w-4" />
      <span className="hidden sm:inline">Actualizar</span>
    </Button>
  )

  return (
    <AppLayout 
      title="Centro de Conciliación" 
      description="Panel principal con alertas críticas y estado financiero en tiempo real"
      actions={headerActions}
    >
      <div className="space-y-6">
        {/* Critical Alerts Panel - Prominent */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-destructive mb-4">🚨 Alertas Críticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">47</div>
              <div className="text-sm text-muted-foreground">Discrepancias requieren atención</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">$532.750</div>
              <div className="text-sm text-muted-foreground">En diferencias sin resolver</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">8</div>
              <div className="text-sm text-muted-foreground">Alertas críticas, 12 prioritarios</div>
            </div>
          </div>
        </div>

        {/* Main KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tasa de Conciliación</CardDescription>
              <CardTitle className="text-2xl text-primary">87%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tiempo Promedio Resolución</CardDescription>
              <CardTitle className="text-2xl">6.5h</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Próximo Pago</CardDescription>
              <CardTitle className="text-2xl text-success">$890K</CardTitle>
              <div className="text-xs text-muted-foreground">5 de septiembre</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Estado General</CardDescription>
              <CardTitle className="text-2xl text-success">✅ Estable</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* AI Suggestions with Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🤖 Sugerencias de IA
            </CardTitle>
            <CardDescription>
              Acciones recomendadas para optimizar la conciliación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <div>
                <div className="font-medium">Conciliar Automáticamente</div>
                <div className="text-sm text-muted-foreground">15 ítems, $245K - Tiempo estimado: 2 min</div>
              </div>
              <Button size="sm" className="bg-primary">Ejecutar</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
              <div>
                <div className="font-medium">Revisar Comisiones</div>
                <div className="text-sm text-muted-foreground">Falabella +12%, $89K - Tiempo estimado: 10 min</div>
              </div>
              <Button size="sm" variant="outline">Revisar</Button>
            </div>
          </CardContent>
        </Card>

        {/* Channel Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado por Canal</CardTitle>
            <CardDescription>
              Monitoreo en tiempo real de discrepancias por marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  <div>
                    <div className="font-medium">Falabella</div>
                    <div className="text-sm text-muted-foreground">-$55K (4.4%)</div>
                  </div>
                </div>
                <Badge variant="destructive">CRÍTICO</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <div>
                    <div className="font-medium">MercadoLibre</div>
                    <div className="text-sm text-muted-foreground">-$45K (5.1%)</div>
                  </div>
                </div>
                <Badge variant="secondary">ADVERTENCIA</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <div>
                    <div className="font-medium">Web</div>
                    <div className="text-sm text-muted-foreground">$0 (0%)</div>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">OK</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Línea de tiempo de resoluciones automáticas y manuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Conciliación automática completada</div>
                  <div className="text-xs text-muted-foreground">15 transacciones de MercadoLibre - hace 5 min</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Discrepancia detectada</div>
                  <div className="text-xs text-muted-foreground">Falabella orden #FL-2024-001 - hace 12 min</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Resolución manual aplicada</div>
                  <div className="text-xs text-muted-foreground">Usuario: admin@empresa.cl - hace 28 min</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Index;
