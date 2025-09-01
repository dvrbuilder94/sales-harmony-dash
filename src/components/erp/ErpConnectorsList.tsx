import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  TestTube, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ErpConnector {
  id: string;
  name: string;
  type: 'softland' | 'nubox';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  syncCount: number;
  successRate: number;
}

export function ErpConnectorsList() {
  const [connectors, setConnectors] = useState<ErpConnector[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = async () => {
    try {
      const data = await apiClient.getErpConnectors();
      setConnectors(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar conectores ERP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (connectorId: string) => {
    setTestingConnection(connectorId);
    try {
      const result = await apiClient.testErpConnection(connectorId);
      toast({
        title: result.status === 'success' ? "Conexión Exitosa" : "Error de Conexión",
        description: result.message,
        variant: result.status === 'success' ? "default" : "destructive",
      });
      
      if (result.status === 'success') {
        // Update connector status
        setConnectors(prev => prev.map(conn => 
          conn.id === connectorId 
            ? { ...conn, status: 'connected' as const }
            : conn
        ));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al probar la conexión",
        variant: "destructive",
      });
    } finally {
      setTestingConnection(null);
    }
  };

  const getStatusIcon = (status: ErpConnector['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ErpConnector['status']) => {
    const statusConfig = {
      connected: { label: 'Conectado', variant: 'default' as const },
      disconnected: { label: 'Desconectado', variant: 'secondary' as const },
      error: { label: 'Error', variant: 'destructive' as const }
    };

    const config = statusConfig[status];
    return (
      <Badge 
        variant={config.variant}
        className={status === 'connected' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
      >
        {config.label}
      </Badge>
    );
  };

  const getErpIcon = (type: 'softland' | 'nubox') => {
    return type === 'softland' ? '🏢' : '📊';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Cargando conectores...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            ⚙️ Conectores ERP Configurados
          </CardTitle>
          <Button onClick={loadConnectors} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {connectors.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔌</div>
            <p className="text-muted-foreground">No hay conectores ERP configurados</p>
            <p className="text-sm text-muted-foreground mt-1">
              Configura tu primer conector ERP para comenzar
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectors.map((connector) => (
              <Card key={connector.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getErpIcon(connector.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{connector.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {connector.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(connector.status)}
                      {getStatusBadge(connector.status)}
                    </div>
                  </div>

                  {/* Sync Statistics */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Sincronizaciones:</span>
                      <span className="font-mono">{connector.syncCount}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Tasa de Éxito:</span>
                        <span className="font-mono">{connector.successRate}%</span>
                      </div>
                      <Progress value={connector.successRate} className="h-2" />
                    </div>

                    {connector.lastSync && (
                      <div className="flex justify-between text-sm">
                        <span>Última Sync:</span>
                        <span className="font-mono text-xs">
                          {new Date(connector.lastSync).toLocaleString('es-CL')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => testConnection(connector.id)}
                      disabled={testingConnection === connector.id}
                      className="flex items-center gap-1"
                    >
                      {testingConnection === connector.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Probando...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-3 h-3" />
                          Probar
                        </>
                      )}
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Settings className="w-3 h-3 mr-1" />
                      Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}