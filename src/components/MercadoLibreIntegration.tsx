import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShoppingCart, Users, Database, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

interface Channel {
  id: string;
  name: string;
  channel_type?: string;
  status?: string;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
  user_id?: string;
  realtime?: boolean;
  config?: any;
}

interface TestUser {
  id: string;
  nickname: string;
  email: string;
  site_id: string;
}

interface DiscrepancyAlert {
  channel: string;
  amount: number;
  percentage: number;
  description: string;
}

export const MercadoLibreIntegration = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [testUsersLoading, setTestUsersLoading] = useState(false);
  const [fetchDataLoading, setFetchDataLoading] = useState(false);
  
  // Modal states
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [testUsersModalOpen, setTestUsersModalOpen] = useState(false);
  const [discrepancyModalOpen, setDiscrepancyModalOpen] = useState(false);
  
  // Form data
  const [connectionForm, setConnectionForm] = useState({
    client_id: '',
    client_secret: '',
    redirect_uri: `${window.location.origin}/auth/mercadolibre/callback`
  });
  
  const [testUsers, setTestUsers] = useState<TestUser[]>([]);
  const [discrepancies, setDiscrepancies] = useState<DiscrepancyAlert[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchChannels();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('channels_realtime') 
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channels'
        },
        (payload) => {
          console.log('Channel change:', payload);
          fetchChannels();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChannels(data || []);
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast({
        title: "Error al cargar canales",
        description: "No se pudieron obtener los canales activos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectMercadoLibre = async () => {
    try {
      setConnectLoading(true);
      
      // Save connection to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('channels')
        .insert({
          user_id: user.id,
          name: 'MercadoLibre',
          channel_type: 'mercadolibre',
          client_id: connectionForm.client_id,
          client_secret: connectionForm.client_secret,
          redirect_uri: connectionForm.redirect_uri,
          status: 'pending',
          is_active: true,
          config: connectionForm
        })
        .select()
        .single();

      if (error) throw error;

      // Call external API to initiate connection
      const response = await apiClient.post('/connect/mercadolibre', connectionForm);
      
      if (response.status === 302) {
        // Redirect to MercadoLibre OAuth
        const redirectUrl = response.headers.location || response.data.redirect_url;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          throw new Error('No se recibió URL de redirección');
        }
      } else {
        toast({
          title: "Conexión iniciada",
          description: response.data.message || "Configuración guardada exitosamente",
        });
        setConnectModalOpen(false);
        fetchChannels();
      }
    } catch (error) {
      console.error('Error connecting to MercadoLibre:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con MercadoLibre. Verifica las credenciales.",
        variant: "destructive",
      });
    } finally {
      setConnectLoading(false);
    }
  };

  const handleCreateTestUsers = async () => {
    try {
      setTestUsersLoading(true);
      const response = await apiClient.post('/create-ml-test-user');
      
      setTestUsers(response.data.test_users || []);
      setTestUsersModalOpen(true);
      
      toast({
        title: "Usuarios de prueba creados",
        description: `Se crearon ${response.data.test_users?.length || 0} usuarios de prueba`,
      });
    } catch (error) {
      console.error('Error creating test users:', error);
      toast({
        title: "Error al crear usuarios",
        description: "No se pudieron crear los usuarios de prueba.",
        variant: "destructive",
      });
    } finally {
      setTestUsersLoading(false);
    }
  };

  const handleFetchMercadoLibreData = async () => {
    try {
      setFetchDataLoading(true);
      const response = await apiClient.get('/fetch-mercadolibre');
      
      // Refresh data
      await fetchChannels();
      
      // Check for discrepancies > $50,000
      const data = response.data;
      const newDiscrepancies: DiscrepancyAlert[] = [];
      
      if (data.discrepancies) {
        data.discrepancies.forEach((disc: any) => {
          if (disc.amount > 50000) {
            newDiscrepancies.push({
              channel: disc.channel || 'MercadoLibre',
              amount: disc.amount,
              percentage: disc.percentage || 0,
              description: disc.description || 'Discrepancia detectada'
            });
          }
        });
      }
      
      if (newDiscrepancies.length > 0) {
        setDiscrepancies(newDiscrepancies);
        setDiscrepancyModalOpen(true);
      }
      
      toast({
        title: "Datos actualizados",
        description: `Se procesaron ${data.processed || 0} registros de MercadoLibre`,
      });
    } catch (error) {
      console.error('Error fetching MercadoLibre data:', error);
      toast({
        title: "Error al obtener datos",
        description: "No se pudieron obtener los datos de MercadoLibre.",
        variant: "destructive",
      });
    } finally {
      setFetchDataLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Integración MercadoLibre</h3>
          <p className="text-sm text-muted-foreground">Gestiona la conexión con MercadoLibre y multi-canal</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Connect MercadoLibre Button */}
        <Dialog open={connectModalOpen} onOpenChange={setConnectModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Conectar MercadoLibre</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Conectar MercadoLibre</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client_id">Client ID</Label>
                <Input
                  id="client_id"
                  value={connectionForm.client_id}
                  onChange={(e) => setConnectionForm({...connectionForm, client_id: e.target.value})}
                  placeholder="Ingresa tu Client ID"
                />
              </div>
              <div>
                <Label htmlFor="client_secret">Client Secret</Label>
                <Input
                  id="client_secret"
                  type="password"
                  value={connectionForm.client_secret}
                  onChange={(e) => setConnectionForm({...connectionForm, client_secret: e.target.value})}
                  placeholder="Ingresa tu Client Secret"
                />
              </div>
              <div>
                <Label htmlFor="redirect_uri">Redirect URI</Label>
                <Input
                  id="redirect_uri"
                  value={connectionForm.redirect_uri}
                  onChange={(e) => setConnectionForm({...connectionForm, redirect_uri: e.target.value})}
                  placeholder="URL de redirección"
                />
              </div>
              <Button 
                onClick={handleConnectMercadoLibre} 
                disabled={connectLoading || !connectionForm.client_id || !connectionForm.client_secret}
                className="w-full"
              >
                {connectLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Conectar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Test Users Button */}
        <Button 
          onClick={handleCreateTestUsers}
          disabled={testUsersLoading}
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          {testUsersLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Users className="h-6 w-6" />
          )}
          <span>Crear Usuarios de Test</span>
        </Button>

        {/* Fetch Data Button */}
        <Button 
          onClick={handleFetchMercadoLibreData}
          disabled={fetchDataLoading}
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          {fetchDataLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Database className="h-6 w-6" />
          )}
          <span>Obtener Datos ML</span>
        </Button>
      </div>

      {/* Active Channels Dropdown */}
      <Card>
        <CardHeader>
          <CardTitle>Canales Activos</CardTitle>
          <CardDescription>Selecciona un canal para ver detalles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Cargando canales...</span>
            </div>
          ) : (
            <>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un canal" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.name} - {channel.channel_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedChannel && channels.length > 0 && (
                <div className="mt-4">
                  {channels
                    .filter(channel => channel.id === selectedChannel)
                    .map((channel) => (
                      <div key={channel.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{channel.name}</h4>
                          <Badge className={getStatusColor(channel.status)}>
                            {(channel.status || 'unknown').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Tipo: {channel.channel_type || 'No especificado'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Creado: {new Date(channel.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Test Users Modal */}
      <Dialog open={testUsersModalOpen} onOpenChange={setTestUsersModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Usuarios de Test Creados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {testUsers.map((user, index) => (
              <div key={user.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.nickname}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                  </div>
                  <Badge variant="outline">{user.site_id}</Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Discrepancy Alert Modal */}
      <Dialog open={discrepancyModalOpen} onOpenChange={setDiscrepancyModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Discrepancias Detectadas
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {discrepancies.map((disc, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">{disc.channel}</p>
                    <p>Monto: ${disc.amount.toLocaleString()}</p>
                    {disc.percentage > 0 && (
                      <p>Porcentaje: {disc.percentage.toFixed(2)}%</p>
                    )}
                    <p className="text-sm">{disc.description}</p>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};