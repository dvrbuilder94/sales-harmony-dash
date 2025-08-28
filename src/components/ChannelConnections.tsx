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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Conexiones de Canales</h2>
          <p className="text-muted-foreground">Conecta con diferentes marketplaces y plataformas de e-commerce</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(channels).map(([key, channel]) => (
          <ChannelCard 
            key={key}
            channel={channel}
            onConnect={() => connectChannel(key)}
            loading={loading}
          />
        ))}
      </div>
      
      {Object.keys(channels).length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay canales disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};