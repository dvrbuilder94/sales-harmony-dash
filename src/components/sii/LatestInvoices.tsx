import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LatestInvoices() {
  const navigate = useNavigate();
  
  // Mock recent invoices data
  const recentInvoices = [
    { number: 'FE-023', customer: 'Empresa ABC Ltda.', amount: 145000, status: 'aceptada', date: '2024-01-15' },
    { number: 'FE-022', customer: 'Comercial XYZ S.A.', amount: 298500, status: 'emitida', date: '2024-01-14' },
    { number: 'FE-021', customer: 'Servicios DEF SpA', amount: 89250, status: 'aceptada', date: '2024-01-13' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'aceptada') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✅ Aceptada</Badge>;
    }
    return <Badge variant="secondary">📄 Emitida</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            🧾 Últimas Facturas SII
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/facturacion-sii')}
          >
            Ver todas <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentInvoices.map((invoice, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-medium text-sm">{invoice.number}</span>
                  {getStatusBadge(invoice.status)}
                </div>
                <p className="text-sm text-muted-foreground truncate">{invoice.customer}</p>
                <p className="text-xs text-muted-foreground">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(invoice.amount)}</p>
              </div>
            </div>
          ))}
          
          {recentInvoices.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No hay facturas recientes</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => navigate('/facturacion-sii')}
              >
                Crear primera factura
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}