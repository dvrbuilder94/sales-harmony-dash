import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useUserRole } from '@/hooks/useUserRole';
import { FileText, Download, Clock, User, Activity, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function AuditoriaTab() {
  const { logs, loading } = useAuditLogs();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [generatingReport, setGeneratingReport] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES');
  };

  const handleGenerateReport = async (format: 'csv' | 'pdf') => {
    setGeneratingReport(true);
    try {
      const { data, error } = await supabase.functions.invoke('audit-report', {
        body: { format, logs }
      });

      if (error) throw error;

      // Create download link
      const blob = new Blob([data.content], { 
        type: format === 'csv' ? 'text/csv' : 'application/pdf' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Reporte generado",
        description: `Reporte de auditoría en formato ${format.toUpperCase()} descargado exitosamente.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte de auditoría.",
        variant: "destructive"
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied message for non-admin users
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Auditoría del Sistema</h2>
          <p className="text-muted-foreground">
            Registro de actividades y cambios del sistema
          </p>
        </div>
        
        <Alert className="border-destructive/50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span>
              <strong>Acceso Denegado:</strong> Solo los administradores pueden acceder a los logs de auditoría del sistema.
              Contacta a un administrador si necesitas acceso a esta información.
            </span>
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Esta sección requiere privilegios de administrador</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Generate Report Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Auditoría del Sistema</h2>
          <p className="text-muted-foreground">
            Registro de actividades y cambios del sistema
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generar Reporte
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="audit-report-description">
            <DialogHeader>
              <DialogTitle>Generar Reporte de Auditoría</DialogTitle>
            </DialogHeader>
            <div id="audit-report-description" className="sr-only">
              Formulario para generar y descargar reportes de auditoría del sistema
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecciona el formato para el reporte de auditoría:
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleGenerateReport('csv')}
                  disabled={generatingReport}
                  className="flex items-center gap-2 flex-1"
                >
                  <Download className="h-4 w-4" />
                  {generatingReport ? 'Generando...' : 'Descargar CSV'}
                </Button>
                <Button
                  onClick={() => handleGenerateReport('pdf')}
                  disabled={generatingReport}
                  variant="outline"
                  className="flex items-center gap-2 flex-1"
                >
                  <Download className="h-4 w-4" />
                  {generatingReport ? 'Generando...' : 'Descargar PDF'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Logs
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Logs Hoy
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(log => 
                new Date(log.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Acciones Únicas
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(logs.map(log => log.action)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No hay logs de auditoría disponibles</p>
            </div>
          ) : (
            <div className="overflow-auto max-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Detalles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.channel?.name || '-'}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {log.details || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}