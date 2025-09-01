import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { apiClient } from '@/lib/api'
import { 
  Zap, 
  Settings, 
  RefreshCw, 
  TrendingUp, 
  ShoppingCart,
  DollarSign,
  Percent,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react'

interface Channel {
  id: string
  name: string
  type: 'marketplace' | 'ecommerce' | 'social'
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  lastSync: string | null
  health: 'healthy' | 'warning' | 'critical'
  metrics: {
    revenue30d: number
    orders30d: number
    conversionRate: number
    avgOrderValue: number
  }
  config: {
    apiKey?: string
    oauth?: boolean
    webhook?: boolean
  }
}

const Canales = () => {
  const [syncingChannels, setSyncingChannels] = useState<Set<string>>(new Set())

  const { data: channels = [], isLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/channels')
        return response.data.channels || mockChannels
      } catch (error) {
        return mockChannels
      }
    }
  })

  const mockChannels: Channel[] = [
    {
      id: '1',
      name: 'MercadoLibre',
      type: 'marketplace',
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z',
      health: 'healthy',
      metrics: {
        revenue30d: 2500000,
        orders30d: 156,
        conversionRate: 3.2,
        avgOrderValue: 16025
      },
      config: {
        oauth: true,
        webhook: true
      }
    },
    {
      id: '2',
      name: 'Falabella Marketplace',
      type: 'marketplace',
      status: 'connected',
      lastSync: '2024-01-15T09:15:00Z',
      health: 'warning',
      metrics: {
        revenue30d: 1890000,
        orders30d: 98,
        conversionRate: 2.8,
        avgOrderValue: 19285
      },
      config: {
        apiKey: 'configured',
        webhook: false
      }
    },
    {
      id: '3',
      name: 'Shopify Store',
      type: 'ecommerce',
      status: 'error',
      lastSync: '2024-01-14T18:20:00Z',
      health: 'critical',
      metrics: {
        revenue30d: 890000,
        orders30d: 45,
        conversionRate: 1.9,
        avgOrderValue: 19777
      },
      config: {
        apiKey: 'expired'
      }
    }
  ]

  const totalMetrics = channels.reduce((acc, channel) => ({
    totalRevenue: acc.totalRevenue + channel.metrics.revenue30d,
    totalOrders: acc.totalOrders + channel.metrics.orders30d,
    avgConversion: (acc.avgConversion + channel.metrics.conversionRate) / channels.length || 0
  }), { totalRevenue: 0, totalOrders: 0, avgConversion: 0 })

  const handleSync = async (channelId: string) => {
    setSyncingChannels(prev => new Set([...prev, channelId]))
    
    try {
      await apiClient.post(`/api/channels/${channelId}/sync`)
      // Simular tiempo de sync
      setTimeout(() => {
        setSyncingChannels(prev => {
          const newSet = new Set(prev)
          newSet.delete(channelId)
          return newSet
        })
      }, 3000)
    } catch (error) {
      setSyncingChannels(prev => {
        const newSet = new Set(prev)
        newSet.delete(channelId)
        return newSet
      })
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return CheckCircle2
      case 'warning': return AlertTriangle
      case 'critical': return AlertTriangle
      default: return Clock
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Canales</h1>
          <p className="text-muted-foreground">
            Administra tus conexiones con marketplaces y plataformas de venta
          </p>
        </div>
        <Button className="gap-2">
          <Zap className="h-4 w-4" />
          Nuevo Canal
        </Button>
      </div>

      {/* KPIs Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Ingresos Totales 30d"
          value={new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            maximumFractionDigits: 0
          }).format(totalMetrics.totalRevenue)}
          description="Todos los canales"
          icon={DollarSign}
          trend={{ value: 12, type: 'up', label: 'vs mes anterior' }}
        />
        <StatCard
          title="Órdenes Totales 30d"
          value={totalMetrics.totalOrders}
          description="Transacciones procesadas"
          icon={ShoppingCart}
          trend={{ value: 8, type: 'up', label: 'vs mes anterior' }}
        />
        <StatCard
          title="Conversión Promedio"
          value={`${totalMetrics.avgConversion.toFixed(1)}%`}
          description="Todos los canales"
          icon={Percent}
          trend={{ value: 0.3, type: 'up', label: 'vs mes anterior' }}
        />
      </div>

      {/* Lista de Canales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {channels.map((channel) => {
          const isSyncing = syncingChannels.has(channel.id)
          const HealthIcon = getHealthIcon(channel.health)
          
          return (
            <Card key={channel.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={channel.status} />
                        <div className={`flex items-center gap-1 ${getHealthColor(channel.health)}`}>
                          <HealthIcon className="h-3 w-3" />
                          <span className="text-xs capitalize">{channel.health}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Métricas del Canal */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        maximumFractionDigits: 0
                      }).format(channel.metrics.revenue30d)}
                    </div>
                    <div className="text-xs text-muted-foreground">Ingresos 30d</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">{channel.metrics.orders30d}</div>
                    <div className="text-xs text-muted-foreground">Órdenes 30d</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Conversión:</span>
                    <span className="ml-2 font-medium">{channel.metrics.conversionRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ticket promedio:</span>
                    <span className="ml-2 font-medium">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        maximumFractionDigits: 0
                      }).format(channel.metrics.avgOrderValue)}
                    </span>
                  </div>
                </div>

                {/* Estado de Configuración */}
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Configuración:</div>
                  <div className="flex flex-wrap gap-2">
                    {channel.config.oauth && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        OAuth ✓
                      </Badge>
                    )}
                    {channel.config.apiKey && (
                      <Badge 
                        variant="outline" 
                        className={channel.config.apiKey === 'expired' 
                          ? 'text-red-600 border-red-200' 
                          : 'text-green-600 border-green-200'
                        }
                      >
                        API Key {channel.config.apiKey === 'expired' ? '✗' : '✓'}
                      </Badge>
                    )}
                    {channel.config.webhook && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Webhook ✓
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Última Sincronización */}
                {channel.lastSync && (
                  <div className="text-xs text-muted-foreground">
                    Última sync: {new Date(channel.lastSync).toLocaleString('es-CL')}
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(channel.id)}
                    disabled={isSyncing || channel.status === 'disconnected'}
                    className="flex-1"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Sincronizando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sincronizar
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress bar para sync */}
                {isSyncing && (
                  <div className="space-y-2">
                    <Progress value={66} className="h-2" />
                    <div className="text-xs text-muted-foreground text-center">
                      Sincronizando productos y órdenes...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Configuración Global */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración Global de Canales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Sincronización Automática</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Configura la frecuencia de sincronización automática para todos los canales.
              </p>
              <Button variant="outline" size="sm">
                Configurar Schedule
              </Button>
            </div>
            <div>
              <h4 className="font-medium mb-2">Mapeo de Productos</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Administra cómo se mapean los productos entre diferentes canales.
              </p>
              <Button variant="outline" size="sm">
                Gestionar Mapeos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Canales