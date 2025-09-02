import { AppLayout } from '@/components/layout/AppLayout'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useUserDashboard } from '@/hooks/useUserDashboard'
import { BackendHealthCheck } from '@/components/BackendHealthCheck'
import { CriticalAlerts } from '@/components/CriticalAlerts'
import { UserKPICards } from '@/components/UserKPICards'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, TrendingUp, Zap, CheckCircle, Plus, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Index = () => {
  const { loading, error } = useDashboardData()
  const { data: userDashboard } = useUserDashboard()
  const navigate = useNavigate()

  if (error) {
    return (
      <AppLayout title="Error" description="Ha ocurrido un problema">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2 text-destructive">Error</h2>
            <p className="text-muted-foreground">Error al cargar datos: {error}</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const headerActions = (
    <Button variant="outline" size="sm" className="gap-2">
      <RefreshCw className="h-4 w-4" />
      <span className="hidden sm:inline">Actualizar</span>
    </Button>
  )

  return (
    <AppLayout 
      title="Dashboard" 
      description="Resumen ejecutivo y métricas principales"
      actions={headerActions}
    >
      <div className="space-y-6">
        {/* Backend Health Check */}
        <BackendHealthCheck />

        {/* Executive Summary KPIs */}
        {userDashboard?.kpis && <UserKPICards kpis={userDashboard.kpis} />}

        {/* Critical Alerts */}
        <CriticalAlerts />

        {/* 7-Day Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendencias Semanales
            </CardTitle>
            <CardDescription>
              Evolución de métricas clave en los últimos 7 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-muted-foreground">Gráfico de tendencias próximamente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Streamlined */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Acceso directo a las tareas más frecuentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                onClick={() => navigate('/facturacion')}
                className="h-16 flex items-center gap-3 justify-start"
                variant="outline"
              >
                <FileText className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Nueva Factura</div>
                  <div className="text-xs text-muted-foreground">Crear DTE SII</div>
                </div>
              </Button>

              <Button 
                onClick={() => navigate('/config?tab=erp')}
                className="h-16 flex items-center gap-3 justify-start"
                variant="outline"
              >
                <Zap className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Sincronizar ERP</div>
                  <div className="text-xs text-muted-foreground">Actualizar datos</div>
                </div>
              </Button>

              <Button 
                onClick={() => navigate('/reconciliacion')}
                className="h-16 flex items-center gap-3 justify-start"
                variant="outline"
              >
                <CheckCircle className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Reconciliar</div>
                  <div className="text-xs text-muted-foreground">Revisar discrepancias</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

export default Index;
