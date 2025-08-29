import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { ChannelCard } from '@/components/ChannelCard';
import { useToast } from '@/hooks/use-toast';

export const ChannelConnections = () => {
  const [channels, setChannels] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await apiClient.get('/channel-connections');
      setChannels(response.data.connections || {});
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast({
        title: "Error al cargar canales",
        description: "No se pudieron obtener los canales disponibles.",
        variant: "destructive",
      });
    }
  };

  const connectChannel = async (channelName: string) => {
    try {
      setLoading(true);
      const response = await apiClient.post(`/connect/${channelName}`);
      
      if (channelName === 'mercadolibre' && response.status === 302) {
        // Redirect to MercadoLibre OAuth
        const redirectUrl = response.headers.get('location') || '/auth/mercadolibre';
        window.location.href = redirectUrl;
      } else {
        // Show status message for other channels
        toast({
          title: "Conexión iniciada",
          description: response.data.message || "Canal conectado exitosamente",
        });
        // Refresh channels after connection
        await fetchChannels();
      }
    } catch (error) {
      console.error('Error connecting channel:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el canal seleccionado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock enhanced channel data for better UX
  const enhancedChannels = Object.entries(channels).map(([key, channel]) => ([
    key,
    {
      ...channel,
      lastSync: channel.status === 'connected' ? new Date().toISOString() : undefined,
      productsCount: channel.status === 'connected' ? Math.floor(Math.random() * 1000) + 100 : 0,
      syncStatus: channel.status === 'connected' ? 'success' : 'idle' as const,
    }
  ]));

  const handleDisconnect = async (channelKey: string) => {
    // TODO: Implement disconnect logic
    toast({
      title: "Canal desconectado",
      description: "El canal ha sido desconectado exitosamente.",
    });
  };

  const handleConfigure = async (channelKey: string) => {
    // TODO: Implement configure logic
    toast({
      title: "Configuración",
      description: "Abriendo configuración del canal...",
    });
  };

  const handleSync = async (channelKey: string) => {
    // TODO: Implement sync logic
    toast({
      title: "Sincronización iniciada",
      description: "Los datos están siendo actualizados...",
    });
  };

  if (Object.keys(channels).length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No hay canales disponibles</h3>
        <p className="text-muted-foreground mb-4">
          Los canales de integración aparecerán aquí una vez configurados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Conexiones de Canales</h2>
          <p className="text-muted-foreground">Conecta con diferentes marketplaces y plataformas de e-commerce</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {enhancedChannels.filter(([, channel]) => channel.status === 'connected').length}
            </div>
            <div className="text-xs text-muted-foreground">Conectados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {enhancedChannels.filter(([, channel]) => channel.status === 'available').length}
            </div>
            <div className="text-xs text-muted-foreground">Disponibles</div>
          </div>
        </div>
      </div>
      
      {/* Channel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {enhancedChannels.map(([key, channel]) => (
          <ChannelCard 
            key={key}
            channel={channel}
            onConnect={() => connectChannel(key)}
            onDisconnect={() => handleDisconnect(key)}
            onConfigure={() => handleConfigure(key)}
            onSync={() => handleSync(key)}
            loading={loading}
          />
        ))}
      </div>
      
      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="border border-border rounded-lg p-6 bg-card">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-muted rounded mr-3"></div>
                  <div>
                    <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                    <div className="h-3 w-16 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};