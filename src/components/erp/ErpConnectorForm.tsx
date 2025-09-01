import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ConnectorCredentials {
  name: string;
  type: 'softland' | 'nubox' | '';
  server?: string;
  database?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  apiSecret?: string;
  environment?: 'production' | 'sandbox';
}

export function ErpConnectorForm() {
  const [credentials, setCredentials] = useState<ConnectorCredentials>({
    name: '',
    type: '',
    environment: 'sandbox'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.name || !credentials.type) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiClient.registerErpConnector({
        name: credentials.name,
        type: credentials.type as 'softland' | 'nubox',
        credentials: {
          server: credentials.server,
          database: credentials.database,
          username: credentials.username,
          password: credentials.password,
          apiKey: credentials.apiKey,
          apiSecret: credentials.apiSecret,
          environment: credentials.environment
        }
      });

      toast({
        title: "¡Conector Registrado!",
        description: `Conector ${credentials.name} registrado exitosamente`,
      });

      // Reset form
      setCredentials({
        name: '',
        type: '',
        environment: 'sandbox'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al registrar el conector ERP",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCredential = (field: keyof ConnectorCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const renderCredentialFields = () => {
    if (!credentials.type) return null;

    if (credentials.type === 'softland') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="server">Servidor</Label>
              <Input
                id="server"
                value={credentials.server || ''}
                onChange={(e) => updateCredential('server', e.target.value)}
                placeholder="192.168.1.100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="database">Base de Datos</Label>
              <Input
                id="database"
                value={credentials.database || ''}
                onChange={(e) => updateCredential('database', e.target.value)}
                placeholder="SOFTLAND_DB"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                value={credentials.username || ''}
                onChange={(e) => updateCredential('username', e.target.value)}
                placeholder="admin"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password || ''}
                onChange={(e) => updateCredential('password', e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>
      );
    }

    if (credentials.type === 'nubox') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={credentials.apiKey || ''}
                onChange={(e) => updateCredential('apiKey', e.target.value)}
                placeholder="nb_api_xxxxxxxxxxxxx"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                type="password"
                value={credentials.apiSecret || ''}
                onChange={(e) => updateCredential('apiSecret', e.target.value)}
                placeholder="••••••••••••••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="environment">Ambiente</Label>
            <Select 
              value={credentials.environment}
              onValueChange={(value: 'production' | 'sandbox') => updateCredential('environment', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Pruebas)</SelectItem>
                <SelectItem value="production">Producción</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Configurar Nuevo Conector ERP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="connectorName">Nombre del Conector</Label>
              <Input
                id="connectorName"
                value={credentials.name}
                onChange={(e) => updateCredential('name', e.target.value)}
                placeholder="Mi Conector Softland"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="connectorType">Tipo de ERP</Label>
              <Select 
                value={credentials.type}
                onValueChange={(value: 'softland' | 'nubox') => updateCredential('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de ERP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="softland">
                    <div className="flex items-center gap-2">
                      🏢 Softland W
                    </div>
                  </SelectItem>
                  <SelectItem value="nubox">
                    <div className="flex items-center gap-2">
                      📊 Nubox
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {credentials.type && (
            <>
              <Separator />
              
              {/* ERP Specific Fields */}
              <div className="space-y-4">
                <h3 className="font-medium">Credenciales de Conexión</h3>
                {renderCredentialFields()}
              </div>
            </>
          )}

          {/* Information Card */}
          {credentials.type && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">
                  💡 Información de {credentials.type === 'softland' ? 'Softland W' : 'Nubox'}
                </h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {credentials.type === 'softland' ? (
                    <>
                      <p>• Asegúrate de tener permisos de administrador en Softland W</p>
                      <p>• La base de datos debe estar accesible desde la red</p>
                      <p>• Verifica que el servidor esté ejecutándose</p>
                    </>
                  ) : (
                    <>
                      <p>• Obtén tus credenciales API desde el panel de Nubox</p>
                      <p>• Usa el ambiente Sandbox para pruebas</p>
                      <p>• La API Key debe tener permisos de lectura/escritura</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting || !credentials.name || !credentials.type}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registrando Conector...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Registrar Conector ERP
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}