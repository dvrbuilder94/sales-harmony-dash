import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatCard } from '@/components/ui/stat-card';
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  FileSpreadsheet,
  PieChart,
  Clock,
  Eye,
  Plus
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'ventas' | 'financiero' | 'conciliacion' | 'sii';
  status: 'listo' | 'generando' | 'programado';
  lastGenerated: string;
  description: string;
  size?: string;
}

export function ReportesTab() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  
  // Reportes disponibles con datos realistas
  const reports: Report[] = [
    {
      id: '1',
      name: 'Conciliación de Ventas',
      type: 'conciliacion',
      status: 'listo',
      lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
      description: 'Comparación entre ventas registradas y comisiones cobradas por canales',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Reporte Financiero Mensual',
      type: 'financiero',
      status: 'listo',
      lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
      description: 'Ingresos netos, comisiones y márgenes por marketplace',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Facturación SII',
      type: 'sii',
      status: 'generando',
      lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días atrás
      description: 'Estado de facturas emitidas y cumplimiento tributario',
      size: '950 KB'
    },
    {
      id: '4',
      name: 'Performance de Ventas',
      type: 'ventas',
      status: 'programado',
      lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 semana atrás
      description: 'Análisis detallado de productos y canales más rentables',
      size: '3.1 MB'
    }
  ];

  const quickStats = {
    totalReports: reports.length,
    readyReports: reports.filter(r => r.status === 'listo').length,
    lastUpdate: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financiero': return BarChart3;
      case 'ventas': return TrendingUp;
      case 'conciliacion': return FileText;
      case 'sii': return FileSpreadsheet;
      default: return PieChart;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'financiero': return 'Financiero';
      case 'ventas': return 'Ventas';
      case 'conciliacion': return 'Conciliación';
      case 'sii': return 'SII';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'listo':
        return <Badge className="bg-success/10 text-success border-success/20">Listo</Badge>;
      case 'generando':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Generando</Badge>;
      case 'programado':
        return <Badge className="bg-info/10 text-info border-info/20">Programado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} días`;
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Reportes Disponibles"
          value={quickStats.totalReports}
          description="Total configurados"
          icon={FileText}
        />
        <StatCard
          title="Listos para Descarga"
          value={quickStats.readyReports}
          description="Generados recientemente"
          icon={Download}
          variant="success"
        />
        <StatCard
          title="Última Actualización"
          value={quickStats.lastUpdate}
          description="Datos sincronizados"
          icon={Clock}
        />
      </div>

      {/* Sección de generar nuevo reporte */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generar Nuevo Reporte</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Selecciona el período y tipo de reporte que necesitas
              </p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Reporte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="90d">Últimos 90 días</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Tipo de Reporte</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conciliacion">Conciliación de Ventas</SelectItem>
                  <SelectItem value="financiero">Reporte Financiero</SelectItem>
                  <SelectItem value="sii">Facturación SII</SelectItem>
                  <SelectItem value="ventas">Performance de Ventas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de reportes existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Reportes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Reportes generados y disponibles para descarga
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => {
              const TypeIcon = getTypeIcon(report.type);
              
              return (
                <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{report.name}</h4>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Tipo: {getTypeLabel(report.type)}</span>
                        <span>Generado: {formatTime(report.lastGenerated)}</span>
                        {report.size && <span>Tamaño: {report.size}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={report.status !== 'listo'}
                    >
                      {report.status === 'generando' ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Generando...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}