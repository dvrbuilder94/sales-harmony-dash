import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api';
import { 
  ArrowLeft, 
  Bot, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type ReconciliationState = 'idle' | 'analyzing' | 'processing' | 'completed' | 'error';

interface ReconciliationData {
  advanced_analysis: {
    accuracy_rate: number;
    ai_recommendations: string[];
    main_issues_identified: string[];
  };
  discrepancias_inteligentes: Array<{
    tipo_problema: 'unmatched' | 'commission' | 'tolerance';
    explicacion: string;
    accion_sugerida: string;
    severidad: 'alta' | 'media' | 'baja';
    diferencia_monto: number;
    confianza: string;
  }>;
  alertas_criticas: Array<{
    type: 'critical' | 'warning';
    message: string;
    action: string;
  }>;
}

const Reconciliation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [state, setState] = useState<ReconciliationState>('idle');
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<ReconciliationData | null>(null);
  const [expandedDiscrepancy, setExpandedDiscrepancy] = useState<number | null>(null);

  const executeReconciliation = async () => {
    setState('analyzing');
    setProgress(0);

    try {
      // Simular progreso
      const progressSteps = [
        { state: 'analyzing' as const, progress: 25, message: 'Analizando datos...' },
        { state: 'processing' as const, progress: 65, message: 'Procesando con IA...' },
        { state: 'completed' as const, progress: 100, message: 'Completado' }
      ];

      for (const step of progressSteps) {
        setState(step.state);
        setProgress(step.progress);
        
        if (step.state === 'analyzing') {
          toast({
            title: "🤖 IA Iniciada",
            description: step.message,
          });
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Obtener datos de la API
      const result = await apiClient.executeAdvancedReconciliation();
      setData(result);

      toast({
        title: "✅ Conciliación Completada",
        description: `Análisis finalizado con ${result.advanced_analysis.accuracy_rate}% de precisión`,
      });

    } catch (error) {
      setState('error');
      toast({
        title: "❌ Error en Conciliación",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severidad: string) => {
    switch (severidad) {
      case 'alta': return 'hsl(var(--critical))';
      case 'media': return 'hsl(var(--warning))';
      case 'baja': return 'hsl(var(--success))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getSeverityIcon = (severidad: string) => {
    switch (severidad) {
      case 'alta': return <XCircle className="h-4 w-4" />;
      case 'media': return <AlertTriangle className="h-4 w-4" />;
      case 'baja': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStateMessage = () => {
    switch (state) {
      case 'analyzing': return 'Analizando datos...';
      case 'processing': return 'Procesando con IA...';
      case 'completed': return 'Completado';
      case 'error': return 'Error en el proceso';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            <div className="p-2 bg-gradient-to-r from-[hsl(var(--ai-primary))] to-[hsl(var(--ai-primary))]/70 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--ai-primary))] to-[hsl(var(--ai-primary))]/70 bg-clip-text text-transparent">
                Conciliación Avanzada IA
              </h1>
              <p className="text-muted-foreground">
                Sistema inteligente de análisis y conciliación de datos
              </p>
            </div>
          </div>
          
          <ThemeToggle />
        </div>

        {/* Ejecutar Conciliación */}
        <Card className="border-2 border-[hsl(var(--ai-primary))]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[hsl(var(--ai-primary))]" />
              Centro de Conciliación IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Análisis Inteligente de Discrepancias</p>
                <p className="text-sm text-muted-foreground">
                  Utiliza IA para detectar y analizar automáticamente las discrepancias en tus datos
                </p>
              </div>
              <Button
                onClick={executeReconciliation}
                disabled={state === 'analyzing' || state === 'processing'}
                className="bg-[hsl(var(--ai-primary))] hover:bg-[hsl(var(--ai-primary))]/90 text-white gap-2"
                size="lg"
              >
                {state === 'analyzing' || state === 'processing' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                {state === 'idle' ? 'Ejecutar Conciliación IA' : getStateMessage()}
              </Button>
            </div>

            {/* Progress Bar */}
            {(state === 'analyzing' || state === 'processing' || state === 'completed') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{getStateMessage()}</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {data && state === 'completed' && (
          <div className="space-y-6 animate-fade-in">
            {/* Analysis Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[hsl(var(--success))]/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-[hsl(var(--success))]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[hsl(var(--success))]">
                        {data.advanced_analysis.accuracy_rate}%
                      </p>
                      <p className="text-sm text-muted-foreground">Precisión del Análisis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[hsl(var(--ai-primary))]/10 rounded-lg">
                      <Bot className="h-5 w-5 text-[hsl(var(--ai-primary))]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {data.advanced_analysis.ai_recommendations.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Recomendaciones IA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[hsl(var(--warning))]/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {data.discrepancias_inteligentes.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Discrepancias Detectadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-[hsl(var(--ai-primary))]" />
                  Recomendaciones de IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.advanced_analysis.ai_recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-[hsl(var(--ai-primary))]/5 rounded-lg">
                    <div className="p-1 bg-[hsl(var(--ai-primary))]/10 rounded">
                      <Bot className="h-4 w-4 text-[hsl(var(--ai-primary))]" />
                    </div>
                    <p className="text-sm flex-1">{recommendation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Discrepancias Inteligentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[hsl(var(--warning))]" />
                  Discrepancias Detectadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.discrepancias_inteligentes.map((discrepancia, index) => (
                  <div key={index} className="border rounded-lg">
                    <div 
                      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedDiscrepancy(
                        expandedDiscrepancy === index ? null : index
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${getSeverityColor(discrepancia.severidad)}20` }}
                          >
                            <div style={{ color: getSeverityColor(discrepancia.severidad) }}>
                              {getSeverityIcon(discrepancia.severidad)}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">{discrepancia.explicacion}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline"
                                style={{ 
                                  borderColor: getSeverityColor(discrepancia.severidad),
                                  color: getSeverityColor(discrepancia.severidad)
                                }}
                              >
                                {discrepancia.severidad.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Intl.NumberFormat('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR'
                                }).format(discrepancia.diferencia_monto)}
                              </span>
                              <span className="text-sm text-[hsl(var(--ai-primary))]">
                                {discrepancia.confianza} confianza
                              </span>
                            </div>
                          </div>
                        </div>
                        {expandedDiscrepancy === index ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    
                    {expandedDiscrepancy === index && (
                      <div className="p-4 border-t bg-muted/20">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Acción Sugerida:</p>
                            <p className="text-sm">{discrepancia.accion_sugerida}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Tipo de Problema:</p>
                            <Badge variant="secondary">{discrepancia.tipo_problema}</Badge>
                          </div>
                          <Button size="sm" variant="outline" className="w-full">
                            Resolver Discrepancia
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alertas Críticas */}
            {data.alertas_criticas.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Alertas Críticas</h3>
                {data.alertas_criticas.map((alerta, index) => (
                  <Alert 
                    key={index} 
                    variant={alerta.type === 'critical' ? 'destructive' : 'default'}
                    className={alerta.type === 'warning' ? 'border-[hsl(var(--warning))] bg-[hsl(var(--warning))]/5' : ''}
                  >
                    {alerta.type === 'critical' ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-[hsl(var(--warning))]" />
                    )}
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>{alerta.message}</p>
                        <p className="text-sm font-medium">Acción: {alerta.action}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reconciliation;