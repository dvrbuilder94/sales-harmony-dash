import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useChannels } from '@/hooks/useChannels';
import { useDashboardData } from '@/hooks/useDashboardData';
import { AlertTriangle, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ReportesGeneralesTab() {
  const { channels } = useChannels();
  const { ventas, kpis, loading } = useDashboardData();
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [discrepancias, setDiscrepancias] = useState<any[]>([]);

  // Calculate KPIs by channel
  const calculateKPIsByChannel = (channelId: string) => {
    const channelVentas = channelId === 'all' 
      ? ventas 
      : ventas.filter(v => v.channel_id === channelId);

    const ventasNetas = channelVentas.reduce((sum, v) => sum + v.monto_neto, 0);
    const comisionesTotales = channelVentas.reduce((sum, v) => sum + v.comisiones, 0);
    const discrepanciasAmount = Math.abs(ventasNetas - comisionesTotales);
    const discrepanciasPercentage = ventasNetas > 0 ? (discrepanciasAmount / ventasNetas) * 100 : 0;

    return {
      ventasNetas,
      comisionesTotales,
      discrepancias: discrepanciasAmount,
      discrepanciasPercentage
    };
  };

  const channelKPIs = calculateKPIsByChannel(selectedChannel);

  // Find discrepancies > 5%
  useEffect(() => {
    const discrepancyVentas = ventas.filter(venta => {
      const discrepancyPercentage = venta.monto_neto > 0 
        ? Math.abs(venta.monto_neto - venta.comisiones) / venta.monto_neto * 100 
        : 0;
      return discrepancyPercentage > 5;
    });
    setDiscrepancias(discrepancyVentas);
  }, [ventas]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Channel Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Canal:</label>
        <Select value={selectedChannel} onValueChange={setSelectedChannel}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleccionar canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los canales</SelectItem>
            {channels.map((channel) => (
              <SelectItem key={channel.id} value={channel.id}>
                {channel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800 transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Ventas Netas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {formatCurrency(channelKPIs.ventasNetas)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800 transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Comisiones Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {formatCurrency(channelKPIs.comisionesTotales)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800 transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Discrepancias
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
              {formatCurrency(channelKPIs.discrepancias)}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {channelKPIs.discrepanciasPercentage.toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Discrepancy Alert */}
      {channelKPIs.discrepanciasPercentage > 5 && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Alerta de Discrepancias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Se detectaron discrepancias superiores al 5% en el canal seleccionado.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Ver Detalles ({discrepancias.length} registros)
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto" aria-describedby="discrepancy-description">
                <DialogHeader>
                  <DialogTitle>Detalles de Discrepancias</DialogTitle>
                </DialogHeader>
                <div id="discrepancy-description" className="sr-only">
                  Lista detallada de todas las discrepancias encontradas en las ventas
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto Neto</TableHead>
                      <TableHead>Comisiones</TableHead>
                      <TableHead>Discrepancia</TableHead>
                      <TableHead>%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discrepancias.map((venta) => {
                      const discrepancyAmount = Math.abs(venta.monto_neto - venta.comisiones);
                      const discrepancyPercentage = venta.monto_neto > 0 
                        ? (discrepancyAmount / venta.monto_neto) * 100 
                        : 0;
                      
                      return (
                        <TableRow key={venta.id}>
                          <TableCell>{venta.order_id}</TableCell>
                          <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                          <TableCell>{formatCurrency(venta.monto_neto)}</TableCell>
                          <TableCell>{formatCurrency(venta.comisiones)}</TableCell>
                          <TableCell>{formatCurrency(discrepancyAmount)}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">
                              {discrepancyPercentage.toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}