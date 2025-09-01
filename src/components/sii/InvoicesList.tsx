import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Search, Download, Eye } from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  customerName: string;
  customerRut: string;
  date: string;
  netAmount: number;
  iva: number;
  total: number;
  status: 'emitida' | 'aceptada' | 'rechazada' | 'anulada';
}

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'FE-001',
    customerName: 'Empresa ABC Ltda.',
    customerRut: '12.345.678-9',
    date: '2024-01-15',
    netAmount: 100000,
    iva: 19000,
    total: 119000,
    status: 'aceptada'
  },
  {
    id: '2',
    number: 'FE-002',
    customerName: 'Comercial XYZ S.A.',
    customerRut: '87.654.321-K',
    date: '2024-01-14',
    netAmount: 250000,
    iva: 47500,
    total: 297500,
    status: 'emitida'
  },
  {
    id: '3',
    number: 'FE-003',
    customerName: 'Servicios DEF SpA',
    customerRut: '11.222.333-4',
    date: '2024-01-13',
    netAmount: 75000,
    iva: 14250,
    total: 89250,
    status: 'rechazada'
  }
];

export function InvoicesList() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerRut.includes(searchTerm)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const statusConfig = {
      emitida: { label: 'Emitida', variant: 'default' as const },
      aceptada: { label: 'Aceptada', variant: 'default' as const },
      rechazada: { label: 'Rechazada', variant: 'destructive' as const },
      anulada: { label: 'Anulada', variant: 'secondary' as const }
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={
        status === 'aceptada' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
      }>
        {config.label}
      </Badge>
    );
  };

  const totalStats = {
    count: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
    acceptedCount: invoices.filter(inv => inv.status === 'aceptada').length,
    pendingCount: invoices.filter(inv => inv.status === 'emitida').length
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Facturas</p>
                <p className="text-2xl font-bold">{totalStats.count}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monto Total</p>
                <p className="text-lg font-bold">{formatCurrency(totalStats.totalAmount)}</p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aceptadas</p>
                <p className="text-2xl font-bold text-green-600">{totalStats.acceptedCount}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-amber-600">{totalStats.pendingCount}</p>
              </div>
              <div className="text-2xl">⏳</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Lista de Facturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente o RUT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Invoices Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>RUT</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Neto</TableHead>
                  <TableHead className="text-right">IVA</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono font-medium">
                      {invoice.number}
                    </TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell className="font-mono">{invoice.customerRut}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(invoice.netAmount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-amber-600">
                      {formatCurrency(invoice.iva)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron facturas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}