import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api';
import { Loader2, AlertCircle, CheckCircle, RefreshCw, Store } from 'lucide-react';

interface FalabellaIntegrationProps {
  onDataRefresh?: () => void;
}

export function FalabellaIntegration({ onDataRefresh }: FalabellaIntegrationProps) {
  const [userId, setUserId] = useState('');
  const [signature, setSignature] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [connected, setConnected] = useState(false);
  const [discrepancies, setDiscrepancies] = useState<number>(0);
  const { toast } = useToast();

  const connectFalabella = async () => {
    if (!userId.trim() || !signature.trim()) {
      toast({
        title: "Datos incompletos",
        description: "Por favor ingresa UserID y Signature para conectar con Falabella.",
        variant: "destructive"
      });
      return;
    }

    try {
      setConnecting(true);
      const response = await apiClient.post('/connect/falabella', {
        user_id: userId,
        signature: signature
      });
      
      setConnected(true);
      toast({
        title: "Conectado exitosamente",
        description: "La conexión con Falabella ha sido establecida.",
      });
    } catch (error) {
      console.error('Error connecting to Falabella:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con Falabella. Verifica tus credenciales.",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const fetchFalabellaData = async () => {
    if (!connected) {
      toast({
        title: "No conectado",
        description: "Primero debes conectarte con Falabella.",
        variant: "destructive"
      });
      return;
    }

    try {
      setFetching(true);
      const response = await apiClient.get('/fetch-falabella');
      
      // Check for discrepancies >5%
      const data = response.data;
      let discrepancyCount = 0;
      
      if (data.sales) {
        data.sales.forEach((sale: any) => {
          const discrepancy = Math.abs(sale.monto_neto - sale.comisiones);
          if (sale.monto_neto > 0 && (discrepancy / sale.monto_neto) > 0.05) {
            discrepancyCount++;
          }
        });
      }
      
      setDiscrepancies(discrepancyCount);
      
      // Refresh parent component data
      if (onDataRefresh) {
        onDataRefresh();
      }
      
      toast({
        title: "Datos obtenidos",
        description: `Se obtuvieron ${data.sales?.length || 0} registros de Falabella.`,
      });

      // Show discrepancy alert if any
      if (discrepancyCount > 0) {
        toast({
          title: "⚠️ Discrepancias detectadas",
          description: `Se encontraron ${discrepancyCount} registros con discrepancias >5%.`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Error fetching Falabella data:', error);
      toast({
        title: "Error al obtener datos",
        description: "No se pudieron obtener los datos de Falabella.",
        variant: "destructive"
      });
    } finally {
      setFetching(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Integración Falabella
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">Estado de conexión:</span>
          <Badge 
            variant={connected ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {connected ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Conectado
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" />
                Desconectado
              </>
            )}
          </Badge>
        </div>

        {/* Discrepancy Alert */}
        {discrepancies > 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {discrepancies} discrepancia{discrepancies > 1 ? 's' : ''} {'>'} 5% detectada{discrepancies > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
        
        {/* Connection Form */}
        {!connected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userId">UserID</Label>
              <Input
                id="userId"
                type="text"
                placeholder="Ingresa tu UserID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={connecting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signature">Signature</Label>
              <Input
                id="signature"
                type="password"
                placeholder="Ingresa tu Signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                disabled={connecting}
              />
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={connectFalabella}
            disabled={connecting || connected}
            className="flex items-center gap-2"
          >
            {connecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Store className="h-4 w-4" />
            )}
            {connected ? 'Conectado' : 'Conectar Falabella'}
          </Button>
          
          <Button
            onClick={fetchFalabellaData}
            disabled={!connected || fetching}
            variant="outline"
            className="flex items-center gap-2"
          >
            {fetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Obtener Datos Falabella
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}