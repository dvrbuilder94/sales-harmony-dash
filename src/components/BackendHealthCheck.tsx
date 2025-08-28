import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, Loader2, Globe } from 'lucide-react';

export function BackendHealthCheck() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [details, setDetails] = useState<string>('');
  const { toast } = useToast();

  const checkBackend = async () => {
    setStatus('checking');
    setDetails('');
    
    const backendUrl = 'https://workspace.diegovasries.repl.co';
    
    try {
      console.log('🏥 Verificando salud del backend...');
      
      // Test basic connectivity first
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('📡 Respuesta del health check:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Datos del health check:', data);
      
      setStatus('success');
      setDetails(`Backend respondió exitosamente. Status: ${data.status || 'OK'}`);
      
      toast({
        title: "Backend Funcionando",
        description: "La conexión con el backend Flask es exitosa",
      });
      
    } catch (error) {
      console.error('❌ Error en health check:', error);
      setStatus('error');
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          setDetails('No se puede conectar al backend. Posibles causas: 1) Backend no está corriendo, 2) Problemas de red, 3) CORS mal configurado');
        } else if (error.message.includes('HTTP')) {
          setDetails(`El backend responde pero con error: ${error.message}`);
        } else {
          setDetails(`Error desconocido: ${error.message}`);
        }
      } else {
        setDetails('Error desconocido al conectar con el backend');
      }
      
      toast({
        title: "Error de Conexión",
        description: "No se puede conectar con el backend Flask",
        variant: "destructive"
      });
    }
  };

  const testDirectUrl = () => {
    window.open('https://workspace.diegovasries.repl.co/health', '_blank');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Estado del Backend Flask
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={checkBackend}
            disabled={status === 'checking'}
            className="flex items-center gap-2"
          >
            {status === 'checking' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {status === 'checking' ? 'Verificando...' : 'Verificar Conexión'}
          </Button>
          
          <Button
            variant="outline"
            onClick={testDirectUrl}
          >
            Abrir /health en navegador
          </Button>
          
          {status !== 'idle' && (
            <Badge variant={status === 'success' ? 'default' : 'destructive'}>
              {status === 'success' ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : status === 'error' ? (
                <XCircle className="h-3 w-3 mr-1" />
              ) : null}
              {status === 'success' ? 'Conectado' : status === 'error' ? 'Error' : 'Verificando'}
            </Badge>
          )}
        </div>
        
        {details && (
          <div className={`p-3 rounded-lg text-sm ${
            status === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {details}
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p><strong>Backend URL:</strong> https://workspace.diegovasries.repl.co</p>
          <p><strong>Health Endpoint:</strong> /health</p>
        </div>
      </CardContent>
    </Card>
  );
}