import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable } from '@/components/ui/data-table'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { apiClient } from '@/lib/api'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package,
  Filter,
  Download,
  Eye,
  FileText
} from 'lucide-react'

interface Venta {
  id: string
  order_id: string
  fecha: string
  monto_bruto: number
  comisiones: number
  iva: number
  devoluciones: number
  monto_neto: number
  channel_id?: string
  channel?: {
    name: string
  }
  created_at: string
}

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'

const Ventas = () => {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [channelFilter, setChannelFilter] = useState<string>('all')
  const [amountRange, setAmountRange] = useState<{ min?: number; max?: number }>({})

  const { data: ventas = [], isLoading } = useQuery({
    queryKey: ['ventas', dateRange, channelFilter, amountRange],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (dateRange.from) params.set('fecha_inicio', format(dateRange.from, 'yyyy-MM-dd'))
      if (dateRange.to) params.set('fecha_fin', format(dateRange.to, 'yyyy-MM-dd'))
      if (channelFilter !== 'all') params.set('canal', channelFilter)
      if (amountRange.min) params.set('min_amount', amountRange.min.toString())
      if (amountRange.max) params.set('max_amount', amountRange.max.toString())
      
      try {
        const response = await apiClient.get(`/api/ventas?${params.toString()}`)
        return response.data.ventas || []
      } catch (error) {
        // Fallback con datos mock
        return [
          {
            id: '1',
            order_id: 'ML-001234',
            fecha: '2024-01-15',
            monto_bruto: 125000,
            comisiones: 12500,
            iva: 23750,
            devoluciones: 0,
            monto_neto: 88750,
            channel: { name: 'MercadoLibre' },
            created_at: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            order_id: 'FL-005678',
            fecha: '2024-01-14',
            monto_bruto: 89000,
            comisiones: 8900,
            iva: 16910,
            devoluciones: 5000,
            monto_neto: 58190,
            channel: { name: 'Falabella' },
            created_at: '2024-01-14T15:45:00Z'
          }
        ]
      }
    }
  })

  const kpis = useMemo(() => {
    const totalVentas = ventas.length
    const totalBruto = ventas.reduce((sum, v) => sum + v.monto_bruto, 0)
    const totalNeto = ventas.reduce((sum, v) => sum + v.monto_neto, 0)
    const totalComisiones = ventas.reduce((sum, v) => sum + v.comisiones, 0)

    return {
      totalVentas,
      totalBruto,
      totalNeto,
      totalComisiones,
      promedioVenta: totalVentas > 0 ? totalBruto / totalVentas : 0
    }
  }, [ventas])

  const columns: ColumnDef<Venta>[] = [
    {
      accessorKey: 'order_id',
      header: 'Order ID',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue('order_id')}</div>
      ),
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      cell: ({ row }) => {
        const fecha = new Date(row.getValue('fecha'))
        return (
          <div className="text-sm">
            {format(fecha, 'dd MMM yyyy', { locale: es })}
          </div>
        )
      },
    },
    {
      accessorKey: 'channel.name',
      header: 'Canal',
      cell: ({ row }) => {
        const channel = row.original.channel?.name || 'Desconocido'
        return <Badge variant="outline">{channel}</Badge>
      },
    },
    {
      accessorKey: 'monto_bruto',
      header: 'Monto Bruto',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('monto_bruto'))
        return (
          <div className="font-medium">
            {new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP'
            }).format(amount)}
          </div>
        )
      },
    },
    {
      accessorKey: 'comisiones',
      header: 'Comisiones',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('comisiones'))
        return (
          <div className="text-red-600">
            -{new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP'
            }).format(amount)}
          </div>
        )
      },
    },
    {
      accessorKey: 'monto_neto',
      header: 'Monto Neto',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('monto_neto'))
        return (
          <div className="font-semibold text-green-600">
            {new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP'
            }).format(amount)}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted">
        <AppSidebar />
        
        <main className="flex-1">
          <header className="h-16 flex items-center border-b bg-background/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-xl font-semibold">💰 Ventas</h1>
              <p className="text-sm text-muted-foreground">Gestión y análisis de transacciones</p>
            </div>
          </header>

          <div className="p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Gestión de Ventas</h2>
                  <p className="text-muted-foreground">
                    Administra y analiza todas tus transacciones de venta
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros Avanzados
                  </Button>
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Ventas"
                  value={kpis.totalVentas}
                  description="Transacciones procesadas"
                  icon={Package}
                  trend={{ value: 12, type: 'up', label: 'vs mes anterior' }}
                />
                <StatCard
                  title="Ingresos Brutos"
                  value={new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    maximumFractionDigits: 0
                  }).format(kpis.totalBruto)}
                  description="Total facturado"
                  icon={BarChart3}
                  trend={{ value: 8, type: 'up', label: 'vs mes anterior' }}
                />
                <StatCard
                  title="Ingresos Netos"
                  value={new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    maximumFractionDigits: 0
                  }).format(kpis.totalNeto)}
                  description="Después de comisiones"
                  icon={DollarSign}
                  variant="success"
                  trend={{ value: 15, type: 'up', label: 'vs mes anterior' }}
                />
                <StatCard
                  title="Promedio por Venta"
                  value={new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    maximumFractionDigits: 0
                  }).format(kpis.promedioVenta)}
                  description="Ticket promedio"
                  icon={TrendingUp}
                  trend={{ value: 3, type: 'down', label: 'vs mes anterior' }}
                />
              </div>

              {/* Filtros */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Fecha Inicio</label>
                      <Input
                        type="date"
                        onChange={(e) => setDateRange(prev => ({ 
                          ...prev, 
                          from: e.target.value ? new Date(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Fecha Fin</label>
                      <Input
                        type="date"
                        onChange={(e) => setDateRange(prev => ({ 
                          ...prev, 
                          to: e.target.value ? new Date(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Canal</label>
                      <Select value={channelFilter} onValueChange={setChannelFilter}>
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
                    <div>
                      <label className="text-sm font-medium mb-2 block">Monto Mínimo</label>
                      <Input
                        type="number"
                        placeholder="$0"
                        onChange={(e) => setAmountRange(prev => ({ 
                          ...prev, 
                          min: e.target.value ? parseFloat(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabla */}
              <Card>
                <CardHeader>
                  <CardTitle>Transacciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={columns}
                    data={ventas}
                    searchKey="order_id"
                    searchPlaceholder="Buscar por Order ID..."
                    pageSize={15}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Ventas