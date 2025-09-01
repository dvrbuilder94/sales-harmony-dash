import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LatestSyncs() {
  const navigate = useNavigate();
  
  // Mock recent syncs data
  const recentSyncs = [
    { 
      id: '1', 
      erp: 'Softland W', 
      type: 'softland', 
      salesCount: 15, 
      status: 'success', 
      time: '2.3s',
      timestamp: '2024-01-15 14:30'
    },
    { 
      id: '2', 
      erp: 'Nubox', 
      type: 'nubox', 
      salesCount: 8, 
      status: 'success', 
      time: '1.8s',
      timestamp: '2024-01-15 12:15'
    },
    { 
      id: '3', 
      erp: 'Softland W', 
      type: 'softland', 
      salesCount: 3, 
      status: 'partial', 
      time: '4.1s',
      timestamp: '2024-01-15 09:45'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✅ Exitoso</Badge>;
      case 'partial':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">⚠️ Parcial</Badge>;
      case 'failed':
        return <Badge variant="destructive">❌ Error</Badge>;
      default:
        return <Badge variant="secondary">⏳ Procesando</Badge>;
    }
  };

  const getErpIcon = (type: string) => {
    return type === 'softland' ? '🏢' : '📊';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ⚙️ Últimas Sincronizaciones ERP
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/erp-conectores')}
          >
            Ver todas <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentSyncs.map((sync) => (
            <div key={sync.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getErpIcon(sync.type)}</span>
                  <span className="font-medium text-sm">{sync.erp}</span>
                  {getStatusBadge(sync.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {sync.salesCount} ventas sincronizadas
                </p>
                <p className="text-xs text-muted-foreground">{sync.timestamp}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-medium">{sync.time}</p>
                <RefreshCw className="w-3 h-3 mx-auto mt-1 text-muted-foreground" />
              </div>
            </div>
          ))}
          
          {recentSyncs.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No hay sincronizaciones recientes</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => navigate('/erp-conectores')}
              >
                Configurar ERP
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}