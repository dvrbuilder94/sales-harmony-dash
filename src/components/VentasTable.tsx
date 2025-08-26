import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Venta } from '@/types/dashboard';

interface VentasTableProps {
  ventas: Venta[];
  loading: boolean;
}

export const VentasTable = ({ ventas, loading }: VentasTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tabla de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Cargando ventas...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabla de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        {ventas.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">No hay datos de ventas disponibles</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Monto Bruto</TableHead>
                <TableHead>Monto Neto</TableHead>
                <TableHead>IVA</TableHead>
                <TableHead>Comisiones</TableHead>
                <TableHead>Devoluciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell>{formatDate(venta.fecha)}</TableCell>
                  <TableCell>{venta.order_id}</TableCell>
                  <TableCell>{formatCurrency(Number(venta.monto_bruto))}</TableCell>
                  <TableCell>{formatCurrency(Number(venta.monto_neto))}</TableCell>
                  <TableCell>{formatCurrency(Number(venta.iva))}</TableCell>
                  <TableCell>{formatCurrency(Number(venta.comisiones))}</TableCell>
                  <TableCell>{formatCurrency(Number(venta.devoluciones))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};