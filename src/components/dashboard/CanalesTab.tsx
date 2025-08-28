import { useState } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelConnections } from '@/components/ChannelConnections';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Radio, Wifi, WifiOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDashboardData } from '@/hooks/useDashboardData';
import { MultiChannelUpload } from '@/components/MultiChannelUpload';
import { Download, Filter, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Papa from 'papaparse';

export function CanalesTab() {
  const { channels, loading: channelsLoading } = useChannels();
  const { ventas, loading: ventasLoading, refetch } = useDashboardData();
  const { toast } = useToast();
  
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Filter ventas by channel and search
  const filteredVentas = ventas.filter(venta => {
    const matchesChannel = selectedChannel === 'all' || venta.channel_id === selectedChannel;
    const matchesSearch = !searchTerm || 
      venta.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || venta.fecha.includes(dateFilter);
    
    return matchesChannel && matchesSearch && matchesDate;
  });

  const exportToCSV = () => {
    if (filteredVentas.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay datos para exportar.",
        variant: "destructive"
      });
      return;
    }

    const csvData = filteredVentas.map(venta => ({
      order_id: venta.order_id,
      fecha: venta.fecha,
      monto_bruto: venta.monto_bruto,
      monto_neto: venta.monto_neto,
      iva: venta.iva,
      comisiones: venta.comisiones,
      devoluciones: venta.devoluciones
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventas-${selectedChannel !== 'all' ? channels.find(c => c.id === selectedChannel)?.name : 'todos'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exportado",
      description: "Datos exportados exitosamente.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (channelsLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Channel Connections Section */}
      <ChannelConnections />
      
      {/* Existing Channels Management */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Canales</h2>
        <p className="text-muted-foreground">
          Administra y monitorea el estado de tus canales de venta
        </p>
      </div>

      {/* Multi-Channel Upload */}
      <MultiChannelUpload />

      {/* Channel Selector and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Exportación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Canal:</label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los canales</SelectItem>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      <div className="flex items-center gap-2">
                        {channel.name}
                        {channel.realtime && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar Order ID:</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Filtrar por Fecha:</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={exportToCSV}
                className="flex items-center gap-2 w-full"
                disabled={filteredVentas.length === 0}
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Datos de Ventas</span>
            <Badge variant="outline">
              {filteredVentas.length} registros
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ventasLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : filteredVentas.length === 0 ? (
            <div className="text-center py-8">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No hay datos que coincidan con los filtros</p>
            </div>
          ) : (
            <div className="overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto Bruto</TableHead>
                    <TableHead>Monto Neto</TableHead>
                    <TableHead>IVA</TableHead>
                    <TableHead>Comisiones</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVentas.map((venta) => {
                    const discrepancy = Math.abs(venta.monto_neto - venta.comisiones);
                    const hasDiscrepancy = venta.monto_neto > 0 && (discrepancy / venta.monto_neto) > 0.05;
                    
                    return (
                      <TableRow key={venta.id}>
                        <TableCell className="font-mono">{venta.order_id}</TableCell>
                        <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                        <TableCell>{formatCurrency(venta.monto_bruto)}</TableCell>
                        <TableCell>{formatCurrency(venta.monto_neto)}</TableCell>
                        <TableCell>{formatCurrency(venta.iva)}</TableCell>
                        <TableCell>{formatCurrency(venta.comisiones)}</TableCell>
                        <TableCell>
                          {hasDiscrepancy ? (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Discrepancia
                            </Badge>
                          ) : (
                            <Badge variant="default" className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              OK
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}