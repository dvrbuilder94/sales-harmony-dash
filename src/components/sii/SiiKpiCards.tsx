import { Card, CardContent } from '@/components/ui/card';
import { FileText, TrendingUp } from 'lucide-react';

export function SiiKpiCards() {
  // Mock SII KPI data
  const siiStats = {
    totalInvoices: 156,
    monthlyAmount: 12450000,
    acceptanceRate: 94.5,
    growth: 12.3
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        🧾 Facturación SII
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Facturas SII</p>
                <p className="text-2xl font-bold text-blue-700">{siiStats.totalInvoices}</p>
                <p className="text-xs text-blue-500">Total emitidas</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Monto Mensual</p>
                <p className="text-lg font-bold text-green-700">
                  {formatCurrency(siiStats.monthlyAmount)}
                </p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{siiStats.growth}% vs mes anterior
                </p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}