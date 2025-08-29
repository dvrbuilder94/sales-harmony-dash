import { ChannelConnections } from '@/components/ChannelConnections';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap } from 'lucide-react';
import { useChannelSync } from '@/hooks/useUserDashboard';
import { useToast } from '@/hooks/use-toast';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';

export function CanalesTab() {
  const { syncAllChannels } = useChannelSync();
  const { toast } = useToast();
  const { setLoading, setLoadingMessage } = useGlobalLoading();

  const handleSyncAllChannels = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Sincronizando todos los canales...');
      
      await syncAllChannels();
      
      toast({
        title: "Sincronización iniciada",
        description: "Todos los canales están siendo sincronizados.",
      });
    } catch (error) {
      toast({
        title: "Error de sincronización",
        description: "No se pudo iniciar la sincronización de canales.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Canales</h2>
          <p className="text-muted-foreground">
            Administra tus conexiones con marketplaces y plataformas de e-commerce
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleSyncAllChannels}
            className="animate-fade-in"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar Canales
          </Button>
        </div>
      </div>
      
      {/* Componente de conexiones mejorado */}
      <ChannelConnections />
    </div>
  );
}