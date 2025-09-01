import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BackendHealthCheck } from '@/components/BackendHealthCheck';
import { CriticalAlerts } from '@/components/CriticalAlerts';
import { UserKPICards } from '@/components/UserKPICards';
import { SiiKpiCards } from '@/components/sii/SiiKpiCards';
import { ErpKpiCards } from '@/components/erp/ErpKpiCards';
import { LatestInvoices } from '@/components/sii/LatestInvoices';
import { LatestSyncs } from '@/components/erp/LatestSyncs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LogOut, User, BarChart3, FileText, Settings, TrendingUp, Zap, Receipt } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Dashboard de Ventas
              </h1>
              <p className="text-muted-foreground">
                Panel de control avanzado para análisis y gestión
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.email}</span>
            </div>
            <ThemeToggle />
            <Button onClick={handleSignOut} variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>

        {/* Backend Health Check */}
        <BackendHealthCheck />

        {/* Main KPIs Section */}
        <div className="space-y-6">
          {/* User KPIs */}
          {userDashboard?.kpis && <UserKPICards kpis={userDashboard.kpis} />}
          
          {/* SII and ERP KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SiiKpiCards />
            <ErpKpiCards />
          </div>
        </div>

        <Separator />

        {/* Critical Alerts */}
        <CriticalAlerts />

        <Separator />

        {/* Latest Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LatestInvoices />
          <LatestSyncs />
        </div>
        
        {/* Quick Access Navigation */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 Acceso Rápido
            </CardTitle>
            <CardDescription>
              Navega rápidamente a las secciones principales de SalesHarmony
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => navigate('/ventas')}
                className="h-auto p-4 flex flex-col items-center gap-2"
                variant="outline"
              >
                <TrendingUp className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Ventas</p>
                  <p className="text-xs text-muted-foreground">Gestión completa</p>
                </div>
              </Button>

              <Button 
                onClick={() => navigate('/facturacion-sii')}
                className="h-auto p-4 flex flex-col items-center gap-2"
                variant="outline"
              >
                <FileText className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Facturación SII</p>
                  <p className="text-xs text-muted-foreground">DTEs electrónicos</p>
                </div>
              </Button>
              
              <Button 
                onClick={() => navigate('/canales')}
                className="h-auto p-4 flex flex-col items-center gap-2"
                variant="outline"
              >
                <Zap className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Canales</p>
                  <p className="text-xs text-muted-foreground">Marketplaces</p>
                </div>
              </Button>

              <Button 
                onClick={() => navigate('/reportes')}
                className="h-auto p-4 flex flex-col items-center gap-2"
                variant="outline"
              >
                <Receipt className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Reportes</p>
                  <p className="text-xs text-muted-foreground">Analytics</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
