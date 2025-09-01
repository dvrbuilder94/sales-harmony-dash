import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatCard } from '@/components/ui/stat-card'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  FileSpreadsheet,
  FileText,
  PieChart,
  Filter,
  Clock,
  Eye
} from 'lucide-react'

interface Report {
  id: string
  name: string
  type: 'financial' | 'sales' | 'reconciliation' | 'performance'
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly'
  lastGenerated: string
  status: 'ready' | 'generating' | 'scheduled'
  description: string
}

const Reportes = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedFormat, setSelectedFormat] = useState('excel')
  
  const reports: Report[] = [
    {
      id: '1',
      name: 'Resumen Financiero Mensual',
      type: 'financial',
      schedule: 'monthly',
      lastGenerated: '2024-01-01T00:00:00Z',
      status: 'ready',
      description: 'Ingresos, gastos y márgenes por canal'
    },
    {
      id: '2',
      name: 'Análisis de Ventas por Canal',
      type: 'sales',
      schedule: 'weekly',
      lastGenerated: '2024-01-08T00:00:00Z',
      status: 'ready',
      description: 'Performance comparativo entre canales'
    },
    {
      id: '3',
      name: 'Reporte de Conciliación SII',
      type: 'reconciliation',
      schedule: 'daily',
      lastGenerated: '2024-01-15T08:00:00Z',
      status: 'generating',
      description: 'Facturas emitidas vs ventas registradas'
    },
    {
      id: '4',
      name: 'KPIs de Performance ERP',
      type: 'performance',
      schedule: 'manual',
      lastGenerated: '2024-01-10T15:30:00Z',
      status: 'scheduled',
      description: 'Métricas de sincronización ERP'
    }
  ]

  const quickStats = {
    totalReports: reports.length,
    scheduledReports: reports.filter(r => r.schedule !== 'manual').length,
    readyReports: reports.filter(r => r.status === 'ready').length,
    automationRate: 75
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return BarChart3
      case 'sales': return TrendingUp
      case 'reconciliation': return FileText
      case 'performance': return PieChart
      default: return FileSpreadsheet
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-800 border-green-200'
      case 'sales': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'reconciliation': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'performance': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Listo</Badge>
      case 'generating':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Generando</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Programado</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Centro de Reportes</h1>
          <p className="text-muted-foreground">
            Genera y administra reportes financieros y de performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Nuevo Reporte
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Reportes"
          value={quickStats.totalReports}
          description="Configurados en el sistema"
          icon={FileSpreadsheet}
        />
        <StatCard
          title="Reportes Programados"
          value={quickStats.scheduledReports}
          description="Generación automática"
          icon={Clock}
        />
        <StatCard
          title="Listos para Descarga"
          value={quickStats.readyReports}
          description="Generados recientemente"
          icon={Download}
          variant="success"
        />
        <StatCard
          title="Automatización"
          value={`${quickStats.automationRate}%`}
          description="Reportes automatizados"
          icon={TrendingUp}
        />
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Mis Reportes</TabsTrigger>
          <TabsTrigger value="generate">Generar Reporte</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Lista de Reportes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.map((report) => {
              const TypeIcon = getTypeIcon(report.type)
              
              return (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <TypeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <Badge variant="outline" className={getTypeColor(report.type)}>
                          {report.type}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground">
                        {report.schedule === 'manual' ? 'Manual' : `Auto ${report.schedule}`}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Último: {new Date(report.lastGenerated).toLocaleString('es-CL')}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={report.status === 'generating'}
                        className="flex-1"
                      >
                        {report.status === 'generating' ? (
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
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generar Nuevo Reporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de Reporte</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Reporte Financiero</SelectItem>
                        <SelectItem value="sales">Análisis de Ventas</SelectItem>
                        <SelectItem value="reconciliation">Conciliación</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
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

                  <div>
                    <label className="text-sm font-medium mb-2 block">Formato</label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedPeriod === 'custom' && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Fecha Inicio</label>
                        <Input type="date" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Fecha Fin</label>
                        <Input type="date" />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-2 block">Canales</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los canales" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los canales</SelectItem>
                        <SelectItem value="mercadolibre">MercadoLibre</SelectItem>
                        <SelectItem value="falabella">Falabella</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Programar
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Generar Ahora
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Templates de Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Resumen Ejecutivo', desc: 'KPIs principales del negocio' },
                  { name: 'Estado Financiero', desc: 'Balance y flujo de caja' },
                  { name: 'Performance por Canal', desc: 'Comparativo de ventas' }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{template.desc}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportes Más Descargados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 3).map((report, index) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{report.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 50) + 10} descargas
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reportes generados este mes</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tiempo promedio de generación</span>
                    <span className="font-bold">2.3 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Formato más usado</span>
                    <span className="font-bold">Excel</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ahorro de tiempo estimado</span>
                    <span className="font-bold text-green-600">12.5 hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Reportes