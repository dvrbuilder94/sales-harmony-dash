import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  TestTube, 
  Loader2, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Zap
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface DemoResult {
  saleId: string;
  originalAmount: number;
  erpStatus: string;
  syncTime: string;
  impact: string;
}

interface DemoMetrics {
  totalProcessed: number;
  successRate: number;
  timeSaved: string;
  errorReduction: string;
}

export function ErpDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<DemoResult[] | null>(null);
  const [metrics, setMetrics] = useState<DemoMetrics | null>(null);
  const { toast } = useToast();

  const runDemo = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setMetrics(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      const demoResult = await apiClient.demoErpSync();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setResults(demoResult.results);
        setMetrics(demoResult.metrics);
        
        toast({
          title: "Demo Completado",
          description: demoResult.message,
        });
      }, 500);

    } catch (error) {
      toast({
        title: "Error",
        description: "Error al ejecutar la demostración",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
      }, 1000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Sincronizado') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✅ {status}</Badge>;
    }
    if (status === 'Pendiente') {
      return <Badge variant="secondary">⏳ {status}</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Demo Introduction */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Demostración ERP en Vivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Esta demostración muestra cómo SalesHarmony sincroniza automáticamente las ventas 
              con sistemas ERP como Softland y Nubox, eliminando el trabajo manual y reduciendo errores.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-medium">Automatización</h3>
                <p className="text-sm text-muted-foreground">Sync automático de ventas</p>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-medium">Velocidad</h3>
                <p className="text-sm text-muted-foreground">Procesamiento en segundos</p>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl mb-2">✅</div>
                <h3 className="font-medium">Precisión</h3>
                <p className="text-sm text-muted-foreground">95% menos errores</p>
              </div>
            </div>

            <Button 
              onClick={runDemo}
              disabled={isRunning}
              size="lg"
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ejecutando Demostración...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Ejecutar Demo ERP
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {isRunning && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/50">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Progreso de la Demostración</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                {progress < 30 && "Conectando con ERP..."}
                {progress >= 30 && progress < 60 && "Procesando ventas..."}
                {progress >= 60 && progress < 90 && "Sincronizando datos..."}
                {progress >= 90 && "Generando resultados..."}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && metrics && (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Procesadas</p>
                    <p className="text-2xl font-bold text-green-700">{metrics.totalProcessed}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Tasa Éxito</p>
                    <p className="text-2xl font-bold text-blue-700">{metrics.successRate}%</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Tiempo Ahorrado</p>
                    <p className="text-lg font-bold text-purple-700">{metrics.timeSaved}</p>
                  </div>
                  <Clock className="w-6 h-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Menos Errores</p>
                    <p className="text-2xl font-bold text-amber-700">{metrics.errorReduction}</p>
                  </div>
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Resultados Detallados de la Demostración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Venta</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead>Estado ERP</TableHead>
                      <TableHead>Tiempo Sync</TableHead>
                      <TableHead>Impacto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono font-medium">
                          {result.saleId}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(result.originalAmount)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(result.erpStatus)}
                        </TableCell>
                        <TableCell className="font-mono">
                          {result.syncTime}
                        </TableCell>
                        <TableCell className="text-sm">
                          {result.impact}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* ROI Information */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Impacto Empresarial de la Integración ERP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Beneficios Cuantificables:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      ⏰ <span><strong>Ahorro de tiempo:</strong> {metrics.timeSaved} de trabajo manual</span>
                    </li>
                    <li className="flex items-center gap-2">
                      📈 <span><strong>Reducción de errores:</strong> {metrics.errorReduction} menos errores</span>
                    </li>
                    <li className="flex items-center gap-2">
                      🚀 <span><strong>Sincronización:</strong> Tiempo promedio 2.1 segundos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      ✅ <span><strong>Tasa de éxito:</strong> {metrics.successRate}% de sincronizaciones exitosas</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">ROI Proyectado:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      💵 <span><strong>Ahorro mensual:</strong> $850.000 CLP en costos operacionales</span>
                    </li>
                    <li className="flex items-center gap-2">
                      📊 <span><strong>Productividad:</strong> +40% eficiencia en gestión de ventas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      🎯 <span><strong>Precisión:</strong> 99.2% exactitud en datos sincronizados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      🔄 <span><strong>Automatización:</strong> 100% de ventas procesadas automáticamente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}