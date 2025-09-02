import { AppLayout } from '@/components/layout/AppLayout'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useUserDashboard } from '@/hooks/useUserDashboard'
import { BackendHealthCheck } from '@/components/BackendHealthCheck'
import { CriticalAlerts } from '@/components/CriticalAlerts'
import { UserKPICards } from '@/components/UserKPICards'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, RefreshCw } from 'lucide-react'
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

      </div>
    </AppLayout>
  )
}

export default Index;
