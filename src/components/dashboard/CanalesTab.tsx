import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useChannels } from '@/hooks/useChannels';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Filter, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';

export function CanalesTab() {
  const { channels, loading: channelsLoading } = useChannels();
  const { ventas, loading: ventasLoading, refetch } = useDashboardData();
  const { addLog } = useAuditLogs();
  const { toast } = useToast();
  
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Filter ventas by channel and search
  const filteredVentas = ventas.filter(venta => {
    const matchesChannel = !selectedChannel || venta.channel_id === selectedChannel;
    const matchesSearch = !searchTerm || 
      venta.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || venta.fecha.includes(dateFilter);
    
    return matchesChannel && matchesSearch && matchesDate;
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!selectedChannel) {
      toast({
        title: "Error",
        description: "Selecciona un canal antes de subir el archivo.",
        variant: "destructive"
      });
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos CSV.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          try {
            const { data, error } = await supabase.functions.invoke('upload-multi-channel-csv', {
              body: {
                csvData: results.data,
                channelId: selectedChannel,
                fileName: file.name
              }
            });

            if (error) throw error;

            await addLog('CSV_UPLOAD', `Archivo ${file.name} subido para canal ${channels.find(c => c.id === selectedChannel)?.name}`, selectedChannel);
            
            toast({
              title: "Éxito",
              description: `Archivo ${file.name} procesado correctamente. ${data.processed} registros procesados.`,
            });

            refetch();
          } catch (error) {
            toast({
              title: "Error",
              description: "Error al procesar el archivo CSV.",
              variant: "destructive"
            });
          } finally {
            setUploading(false);
          }
        },
        error: () => {
          toast({
            title: "Error",
            description: "Error al leer el archivo CSV.",
            variant: "destructive"
          });
          setUploading(false);
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al procesar el archivo.",
        variant: "destructive"
      });
      setUploading(false);
    }
  }, [selectedChannel, channels, addLog, toast, refetch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
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
    a.download = `ventas-${selectedChannel ? channels.find(c => c.id === selectedChannel)?.name : 'todos'}-${new Date().toISOString().split('T')[0]}.csv`;
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
    <div className="space-y-6">
      {/* Channel Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Selección de Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Canal:</label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar canal" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      <div className="flex items-center gap-2">
                        {channel.name}
                        {channel.realtime && (
                          <Badge variant="secondary" className="text-xs">
                            Realtime
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Subir Archivo CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
              }
              ${!selectedChannel ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} disabled={!selectedChannel || uploading} />
            
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p>Procesando archivo...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-lg font-medium">
                  {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra un archivo CSV o haz clic para seleccionar'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Solo archivos .csv son permitidos
                </p>
                {!selectedChannel && (
                  <div className="flex items-center gap-2 text-orange-600 mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Selecciona un canal primero</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Export */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Exportación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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