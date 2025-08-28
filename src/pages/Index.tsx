import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BackendHealthCheck } from '@/components/BackendHealthCheck';
import { Button } from '@/components/ui/button';
import { LogOut, User, BarChart3 } from 'lucide-react';

const Index = () => {
  const { loading, error } = useDashboardData();
  const { user, signOut } = useAuth();

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

        {/* Dashboard Content */}
        <div className="animate-fade-in">
          <DashboardTabs />
        </div>
      </div>
    </div>
  );
};

export default Index;
