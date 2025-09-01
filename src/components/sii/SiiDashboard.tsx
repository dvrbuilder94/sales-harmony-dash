import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export function SiiDashboard() {
  // Mock data for SII dashboard
  const stats = {
    totalInvoices: 156,
    monthlyInvoices: 23,
    totalAmount: 12450000,
    monthlyAmount: 2890000,
    acceptanceRate: 94.5,
    pendingInvoices: 3,
    rejectedInvoices: 2
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const recentInvoices = [
    { number: 'FE-023', customer: 'Empresa ABC', amount: 145000, status: 'aceptada' },
    { number: 'FE-022', customer: 'Comercial XYZ', amount: 298500, status: 'emitida' },
    { number: 'FE-021', customer: 'Servicios DEF', amount: 89250, status: 'aceptada' }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Facturas Totales</p>
                <p className="text-3xl font-bold text-blue-700">{stats.totalInvoices}</p>
                <p className="text-xs text-blue-500">+{stats.monthlyInvoices} este mes</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Monto Total</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(stats.totalAmount)}
                </p>
                <p className="text-xs text-green-500">
                  +{formatCurrency(stats.monthlyAmount)} este mes
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Tasa Aceptación</p>
                <p className="text-3xl font-bold text-emerald-700">{stats.acceptanceRate}%</p>
                <Progress value={stats.acceptanceRate} className="mt-2 h-2" />
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Pendientes</p>
                <p className="text-3xl font-bold text-amber-700">{stats.pendingInvoices}</p>
                <p className="text-xs text-amber-500">
                  {stats.rejectedInvoices} rechazadas
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Progreso Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Facturas Emitidas</span>
                  <span>{stats.monthlyInvoices}/30</span>
                </div>
                <Progress value={(stats.monthlyInvoices / 30) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Meta de Facturación</span>
                  <span>{formatCurrency(stats.monthlyAmount)}/5M</span>
                </div>
                <Progress value={(stats.monthlyAmount / 5000000) * 100} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tasa de Aceptación</span>
                  <span>{stats.acceptanceRate}%</span>
                </div>
                <Progress value={stats.acceptanceRate} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧾 Últimas Facturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInvoices.map((invoice, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium font-mono">{invoice.number}</p>
                    <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                    <Badge 
                      variant={invoice.status === 'aceptada' ? 'default' : 'secondary'}
                      className={
                        invoice.status === 'aceptada' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : ''
                      }
                    >
                      {invoice.status === 'aceptada' ? 'Aceptada' : 'Emitida'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Acciones Rápidas SII</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-medium">Validar RUT</h3>
              <p className="text-sm text-muted-foreground">Validación automática de RUTs</p>
            </div>
            
            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
              <div className="text-2xl mb-2">🧮</div>
              <h3 className="font-medium">Calcular IVA</h3>
              <p className="text-sm text-muted-foreground">Cálculo automático del 19%</p>
            </div>
            
            <div className="p-4 border rounded-lg text-center hover:bg-muted/50 cursor-pointer">
              <div className="text-2xl mb-2">📄</div>
              <h3 className="font-medium">Nueva Factura</h3>
              <p className="text-sm text-muted-foreground">Crear factura electrónica</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}