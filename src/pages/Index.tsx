import { useDashboardData } from '@/hooks/useDashboardData';
import { VentasTable } from '@/components/VentasTable';
import { KPICharts } from '@/components/KPICharts';
import { ConciliationButton } from '@/components/ConciliationButton';

const Index = () => {
  const { ventas, kpis, loading, error, refetch } = useDashboardData();

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Ventas</h1>
            <p className="text-muted-foreground">Panel de control para ventas y conciliación</p>
          </div>
        </div>

        <KPICharts kpis={kpis} loading={loading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VentasTable ventas={ventas} loading={loading} />
          </div>
          <div>
            <ConciliationButton kpis={kpis} onRefresh={refetch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
