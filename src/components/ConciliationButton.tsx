import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw } from 'lucide-react';
import { KPIData } from '@/types/dashboard';
import { apiClient } from '@/lib/api';

interface ConciliationButtonProps {
  kpis: KPIData;
  onRefresh: () => void;
}

export const ConciliationButton = ({ kpis, onRefresh }: ConciliationButtonProps) => {
  const [isConciliating, setIsConciliating] = useState(false);
  const { toast } = useToast();

  const handleConciliation = async () => {
    setIsConciliating(true);
    
    try {
      const result = await apiClient.reconcile();
      
      // Refrescar datos después de la conciliación
      onRefresh();
      
      toast({
        title: "Conciliación Completada",
        description: result.message || `Se han procesado ${kpis.ventasPendientes} ventas. Discrepancias encontradas: €${kpis.discrepancias.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Error en Conciliación",
        description: error instanceof Error ? error.message : "No se pudo completar el proceso de conciliación",
        variant: "destructive",
      });
    } finally {
      setIsConciliating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Centro de Conciliación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Inicia el proceso de conciliación para verificar la consistencia entre ventas y pagos.
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleConciliation}
            disabled={isConciliating}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isConciliating ? 'animate-spin' : ''}`} />
            {isConciliating ? 'Conciliando...' : 'Iniciar Conciliación'}
          </Button>
          
          {kpis.discrepancias > 0 && (
            <div className="text-sm text-destructive">
              ⚠️ Se detectaron discrepancias de {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR'
              }).format(kpis.discrepancias)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};