import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BackendHealthCheck } from '@/components/BackendHealthCheck';
import { CriticalAlerts } from '@/components/CriticalAlerts';
import { UserKPICards } from '@/components/UserKPICards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, User, BarChart3, FileText, TrendingUp, Zap, Receipt, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { loading, error } = useDashboardData();
  const { user, signOut } = useAuth();
  const { data: userDashboard } = useUserDashboard();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Error</h1>
          <p className="text-muted-foreground">Error al cargar datos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted">
        <AppSidebar />
        
        <main className="flex-1">
          <header className="h-16 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-semibold">📊 Dashboard</h1>
                <p className="text-sm text-muted-foreground">Resumen ejecutivo y métricas principales</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.email}</span>
              </div>
              <ThemeToggle />
              <Button onClick={handleSignOut} variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Backend Health Check */}
            <BackendHealthCheck />

            {/* Executive Summary KPIs */}
            {userDashboard?.kpis && <UserKPICards kpis={userDashboard.kpis} />}

            {/* Critical Alerts */}
            <CriticalAlerts />

            {/* 7-Day Trend Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  📈 Tendencias (Últimos 7 días)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Gráfico de tendencias aquí</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>🚀 Acciones Rápidas</CardTitle>
                <CardDescription>
                  Acceso directo a las funciones más utilizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => navigate('/facturacion')}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    variant="outline"
                  >
                    <FileText className="w-6 h-6" />
                    <div className="text-center">
                      <p className="font-medium">Nueva Factura</p>
                      <p className="text-xs text-muted-foreground">Crear DTE</p>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => navigate('/config?tab=erp')}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    variant="outline"
                  >
                    <Zap className="w-6 h-6" />
                    <div className="text-center">
                      <p className="font-medium">Sincronizar ERP</p>
                      <p className="text-xs text-muted-foreground">Integración</p>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => navigate('/reconciliacion')}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    variant="outline"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <div className="text-center">
                      <p className="font-medium">Ver Discrepancias</p>
                      <p className="text-xs text-muted-foreground">Reconciliar</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/ventas')}>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">💰 Ventas</h3>
                  <p className="text-xs text-muted-foreground">Gestión completa</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/facturacion')}>
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">🧾 Facturación</h3>
                  <p className="text-xs text-muted-foreground">SII Chile</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/canales')}>
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">🛒 Canales</h3>
                  <p className="text-xs text-muted-foreground">Marketplaces</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/reportes')}>
                <CardContent className="p-4 text-center">
                  <Receipt className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">📈 Reportes</h3>
                  <p className="text-xs text-muted-foreground">Analytics</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
