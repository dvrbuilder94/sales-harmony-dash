import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { AlertTriangle, Download, RefreshCw, BarChart3, PieChart } from 'lucide-react';
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
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ConciliacionData {
  ventasPorCanal: { [key: string]: number };
  breakdown: {
    comisiones: number;
    iva: number;
    devoluciones: number;
  };
  discrepancias: Array<{
    channel: string;
    amount: number;
    percentage: number;
  }>;
  resumenGeneral: {
    totalVentas: number;
    totalComisiones: number;
    totalIva: number;
    totalDevoluciones: number;
  };
}

export function ConciliacionTab() {
  const [data, setData] = useState<ConciliacionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout>();

  const fetchConciliacionData = async () => {
    try {
      setRefreshing(true);
      const response = await apiClient.get('/api/conciliacion-dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching conciliación data:', error);
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos de conciliación",
        variant: "destructive",
      });
      
      // Fallback data for development
      setData({
        ventasPorCanal: {
          'MercadoLibre': 45000,
          'Amazon': 32000,
          'Shopify': 28000,
          'WooCommerce': 15000
        },
        breakdown: {
          comisiones: 12000,
          iva: 8500,
          devoluciones: 2500
        },
        discrepancias: [
          { channel: 'MercadoLibre', amount: 1200, percentage: 2.7 },
          { channel: 'Amazon', amount: 2400, percentage: 7.5 }
        ],
        resumenGeneral: {
          totalVentas: 120000,
          totalComisiones: 12000,
          totalIva: 8500,
          totalDevoluciones: 2500
        }
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConciliacionData();

    // Real-time refresh every 30 seconds
    intervalRef.current = setInterval(() => {
      fetchConciliacionData();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const exportToCsv = () => {
    if (!data) return;

    const csvContent = [
      ['Canal', 'Ventas', 'Discrepancia %'],
      ...Object.entries(data.ventasPorCanal).map(([canal, ventas]) => {
        const discrepancia = data.discrepancias.find(d => d.channel === canal);
        return [canal, ventas.toString(), discrepancia ? discrepancia.percentage.toString() : '0'];
      }),
      [],
      ['Resumen General'],
      ['Concepto', 'Monto'],
      ['Total Ventas', data.resumenGeneral.totalVentas.toString()],
      ['Total Comisiones', data.resumenGeneral.totalComisiones.toString()],
      ['Total IVA', data.resumenGeneral.totalIva.toString()],
      ['Total Devoluciones', data.resumenGeneral.totalDevoluciones.toString()]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `conciliacion_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportación exitosa",
      description: "Los datos se han exportado a CSV correctamente",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const ventasChartData = {
    labels: Object.keys(data.ventasPorCanal),
    datasets: [
      {
        label: 'Ventas por Canal (€)',
        data: Object.values(data.ventasPorCanal),
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
          'hsl(var(--accent))',
          'hsl(var(--muted))',
        ],
        borderColor: [
          'hsl(var(--primary-foreground))',
          'hsl(var(--secondary-foreground))',
          'hsl(var(--accent-foreground))',
          'hsl(var(--muted-foreground))',
        ],
        borderWidth: 1,
      },
    ],
  };

  const breakdownChartData = {
    labels: ['Comisiones', 'IVA', 'Devoluciones'],
    datasets: [
      {
        data: [data.breakdown.comisiones, data.breakdown.iva, data.breakdown.devoluciones],
        backgroundColor: [
          'hsl(142 76% 36%)',
          'hsl(221 83% 53%)',
          'hsl(0 84% 60%)',
        ],
        borderColor: [
          'hsl(142 76% 46%)',
          'hsl(221 83% 63%)',
          'hsl(0 84% 70%)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y || context.parsed;
            return `${context.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            return `${context.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
  };

  const highDiscrepancies = data.discrepancias.filter(d => d.percentage > 5);

  return (
    <div className="space-y-6">
      {/* Header with refresh and export buttons */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dashboard de Conciliación</h3>
        <div className="flex gap-2">
          <Button
            onClick={fetchConciliacionData}
            disabled={refreshing}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={exportToCsv} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Discrepancy Alerts */}
      {highDiscrepancies.length > 0 && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Discrepancias ({highDiscrepancies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {highDiscrepancies.map((disc) => (
                <Badge key={disc.channel} variant="destructive">
                  {disc.channel}: {disc.percentage.toFixed(1)}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ventas por Canal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={ventasChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Breakdown Financiero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie data={breakdownChartData} options={pieChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {formatCurrency(data.resumenGeneral.totalVentas)}
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">Total Ventas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {formatCurrency(data.resumenGeneral.totalComisiones)}
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">Total Comisiones</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {formatCurrency(data.resumenGeneral.totalIva)}
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400">Total IVA</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {formatCurrency(data.resumenGeneral.totalDevoluciones)}
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400">Total Devoluciones</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}