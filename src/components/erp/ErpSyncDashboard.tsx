import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Database,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ErpSyncDashboardProps {
  showSyncControls?: boolean;
}

export function ErpSyncDashboard({ showSyncControls = false }: ErpSyncDashboardProps) {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [bulkSyncing, setBulkSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    try {
      const data = await apiClient.getErpConnectors();
      setConnectors(data);
    } catch (error) {
      console.error('Error loading connectors:', error);
    }
  };

  const handleBulkSync = async (connectorId: string) => {
    setBulkSyncing(true);
    setSyncing(connectorId);
    
    try {
      const result = await apiClient.bulkSyncToErp(connectorId);
      
      toast({
        title: "Sincronización Completada",
        description: `${result.successful}/${result.processed} ventas sincronizadas exitosamente`,
      });

      // Simulate progress for better UX
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(interval);
          setBulkSyncing(false);
          setSyncing(null);
        }
      }, 200);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Error durante la sincronización masiva",
        variant: "destructive",
      });
      setBulkSyncing(false);
      setSyncing(null);
    }
  };

  // Mock stats for dashboard
  const syncStats = {
    totalSyncs: 1247,
    successfulSyncs: 1189,
    failedSyncs: 58,
    lastSyncTime: new Date().toISOString(),
    avgSyncTime: '2.3s',
    successRate: 95.3
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL');
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Sincronizaciones</p>
                <p className="text-3xl font-bold text-blue-700">{syncStats.totalSyncs}</p>
                <p className="text-xs text-blue-500">Total procesadas</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Exitosas</p>
                <p className="text-3xl font-bold text-green-700">{syncStats.successfulSyncs}</p>
                <p className="text-xs text-green-500">{syncStats.successRate}% de éxito</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Fallidas</p>
                <p className="text-3xl font-bold text-red-700">{syncStats.failedSyncs}</p>
                <p className="text-xs text-red-500">Requieren atención</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Tiempo Promedio</p>
                <p className="text-3xl font-bold text-purple-700">{syncStats.avgSyncTime}</p>
                <p className="text-xs text-purple-500">Por sincronización</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Rendimiento de Sincronización
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tasa de Éxito General</span>
                <span>{syncStats.successRate}%</span>
              </div>
              <Progress value={syncStats.successRate} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{syncStats.successfulSyncs}</p>
                <p className="text-sm text-muted-foreground">Exitosas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{syncStats.failedSyncs}</p>
                <p className="text-sm text-muted-foreground">Fallidas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{syncStats.avgSyncTime}</p>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Controls */}
      {showSyncControls && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Control de Sincronización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectors.filter(c => c.status === 'connected').map((connector) => (
                <div key={connector.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">
                      {connector.type === 'softland' ? '🏢' : '📊'}
                    </div>
                    <div>
                      <h3 className="font-medium">{connector.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Último sync: {connector.lastSync ? formatDate(connector.lastSync) : 'Nunca'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Conectado
                    </Badge>
                    <Button 
                      onClick={() => handleBulkSync(connector.id)}
                      disabled={bulkSyncing}
                      size="sm"
                    >
                      {syncing === connector.id ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Sincronizando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Sincronizar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}

              {connectors.filter(c => c.status === 'connected').length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔌</div>
                  <p className="text-muted-foreground">No hay conectores ERP activos</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Conecta un ERP para habilitar la sincronización
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync Progress */}
      {bulkSyncing && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Sincronización en progreso...
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Procesando ventas hacia el ERP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}