import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const OAuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    // Determine which platform we're handling based on the URL path
    const currentPath = window.location.pathname;
    const platform = currentPath.includes('mercadolibre') ? 'MercadoLibre' : 'Canal';

    if (error) {
      toast({
        title: "Error de autorización",
        description: errorDescription || `Error: ${error}`,
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    if (code) {
      // Update channel status in Supabase if needed
      updateChannelStatus(code, state);
      
      toast({
        title: "Conexión exitosa",
        description: `La conexión con ${platform} se completó correctamente.`,
      });
      navigate('/');
    } else {
      toast({
        title: "Error inesperado",
        description: "No se recibió información de autorización válida.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [navigate, toast]);

  const updateChannelStatus = async (code: string, state: string | null) => {
    try {
      // You could update the channel status here if needed
      console.log('OAuth callback received:', { code, state });
    } catch (error) {
      console.error('Error updating channel status:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">Procesando conexión...</h2>
          <p className="text-muted-foreground">Completando la configuración del canal</p>
        </div>
      </div>
    </div>
  );
};