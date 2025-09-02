import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, FileText, Calculator, Clock, TrendingUp } from 'lucide-react';

export function AccountantView() {
  // Mock accountant-specific data  
  const accountantMetrics = {
    precision: { value: 98.7, target: 98, status: 'excellent' },
    siiCompliance: { value: 99.1, pending: 2, completed: 28 },
    ivaCalculated: { total: 8700000, retained: 1400000 },
    gmvProcessed: { value: 54400000, growth: 12.3 },
    erpSuccess: { value: 96.8, errors: 12, total: 375 },
    obligations: { pending: 2, completed: 28, nextDeadline: '2024-09-15' }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'warning': return 'warning';
      case 'critical': return 'critical';
      default: return 'muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-success">Panel Contador</h2>
          <p className="text-muted-foreground">Métricas de compliance y control fiscal</p>
        </div>
        <Badge className="bg-success text-success-foreground">
          📊 Vista Contador
        </Badge>
      </div>

      {/* Main Accountant KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-success/10 to-success-glow/10 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success">Precisión</p>
                <p className="text-2xl font-bold text-success">
                  {accountantMetrics.precision.value}%
                </p>
                <p className="text-xs text-success">
                  Conciliación sin errores
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info-glow/10 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-info">Cumplimiento SII</p>
                <p className="text-2xl font-bold text-info">
                  {accountantMetrics.siiCompliance.value}%
                </p>
                <p className="text-xs text-info">
                  Facturas válidas
                </p>
              </div>
              <FileText className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">IVA Calculado</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(accountantMetrics.ivaCalculated.total)}
                </p>
                <p className="text-xs text-primary">
                  Retenido: {formatCurrency(accountantMetrics.ivaCalculated.retained)}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning-glow/10 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warning">Éxito ERP</p>
                <p className="text-2xl font-bold text-warning">
                  {accountantMetrics.erpSuccess.value}%
                </p>
                <p className="text-xs text-warning">
                  {accountantMetrics.erpSuccess.errors} errores de {accountantMetrics.erpSuccess.total}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SII Status and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🇨🇱 Estado SII en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <span className="font-medium">Conectado al SII</span>
              </div>
              <Badge variant="outline" className="text-success border-success">
                Certificado Válido
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Facturas Procesadas</span>
                <span className="text-sm font-medium">{accountantMetrics.siiCompliance.completed}/30</span>
              </div>
              <Progress 
                value={(accountantMetrics.siiCompliance.completed / 30) * 100} 
                className="h-2"
              />
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Validación IVA</span>
                <span className="text-sm font-medium text-success">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Obligaciones Tributarias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-critical/10 rounded-lg">
                <div className="text-2xl font-bold text-critical">
                  {accountantMetrics.obligations.pending}
                </div>
                <div className="text-xs text-critical">Pendientes</div>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {accountantMetrics.obligations.completed}
                </div>
                <div className="text-xs text-success">Cumplidas</div>
              </div>
            </div>
            
            <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="flex items-center gap-2 text-warning text-sm font-medium">
                <Clock className="h-4 w-4" />
                Próximo Vencimiento
              </div>
              <div className="text-lg font-bold mt-1">15 Septiembre 2024</div>
              <div className="text-xs text-muted-foreground">Declaración IVA Mensual</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Insights */}
      <Card className="bg-gradient-to-br from-success/5 to-success-glow/5 border-success/20">
        <CardHeader>
          <CardTitle className="text-success">🤖 Insights IA para Contadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="text-success text-lg">✅</div>
              <div>
                <h4 className="font-medium text-success">Excelente cumplimiento SII</h4>
                <p className="text-sm text-muted-foreground">99.1% de facturas válidas. Mantén los procesos actuales de validación</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="text-warning text-lg">📊</div>
              <div>
                <h4 className="font-medium text-warning">Optimización ERP detectada</h4>
                <p className="text-sm text-muted-foreground">12 errores de exportación recurrentes. Revisar mapping de campos Softland</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-info/10 rounded-lg border border-info/20">
              <div className="text-info text-lg">💡</div>
              <div>
                <h4 className="font-medium text-info">Próxima acción recomendada</h4>
                <p className="text-sm text-muted-foreground">Preparar declaración IVA para el 15/09. Estimado: 2.5 horas de trabajo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}