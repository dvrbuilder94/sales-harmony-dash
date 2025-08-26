import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPIData } from '@/types/dashboard';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface KPIChartsProps {
  kpis: KPIData;
  loading: boolean;
}

export const KPICharts = ({ kpis, loading }: KPIChartsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const barData = {
    labels: ['Ventas Netas', 'Comisiones', 'Total Pagos', 'Discrepancias'],
    datasets: [
      {
        label: 'Montos (€)',
        data: [kpis.ventasNetas, kpis.comisionesTotales, kpis.totalPagos, kpis.discrepancias],
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--accent))',
          'hsl(var(--secondary))',
          'hsl(var(--destructive))',
        ],
        borderColor: [
          'hsl(var(--primary))',
          'hsl(var(--accent))',
          'hsl(var(--secondary))',
          'hsl(var(--destructive))',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Ventas Netas', 'Discrepancias'],
    datasets: [
      {
        data: [kpis.ventasNetas, kpis.discrepancias],
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--destructive))',
        ],
        borderColor: [
          'hsl(var(--primary))',
          'hsl(var(--destructive))',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${formatCurrency(context.parsed)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ventas Netas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(kpis.ventasNetas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Comisiones Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">
              {formatCurrency(kpis.comisionesTotales)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary-foreground">
              {formatCurrency(kpis.totalPagos)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Discrepancias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(kpis.discrepancias)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ventas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {kpis.ventasPendientes}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comparativa de Montos</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución Ventas vs Discrepancias</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut 
              data={doughnutData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context: any) {
                        return `${context.label}: ${formatCurrency(context.parsed)}`;
                      }
                    }
                  }
                }
              }} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};