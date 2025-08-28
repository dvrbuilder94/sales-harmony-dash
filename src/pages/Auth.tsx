import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Play, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [demoData, setDemoData] = useState<any>(null);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message === 'Invalid login credentials') {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else {
        setError(error.message);
      }
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password);
    
    if (error) {
      if (error.message === 'User already registered') {
        setError('Este email ya está registrado. Intenta iniciar sesión.');
      } else {
        setError(error.message);
      }
    } else {
      setMessage('Revisa tu email para confirmar tu cuenta.');
    }
    
    setLoading(false);
  };

  const handleDemo = async () => {
    setLoadingDemo(true);
    try {
      const response = await fetch('https://workspace.diegovasries.repl.co/demo-data');
      const data = await response.json();
      
      if (data.status === 'success') {
        setDemoData(data.data);
        toast({
          title: "Demo cargado",
          description: "Datos de demostración cargados exitosamente",
        });
      } else {
        throw new Error(data.message || 'Error cargando demo');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de demostración",
        variant: "destructive"
      });
    } finally {
      setLoadingDemo(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Dashboard de Ventas</CardTitle>
          <CardDescription>
            Accede a tu cuenta para ver el panel de control
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Contraseña</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Registrando...' : 'Registrarse'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Demo Button */}
          <div className="mt-4">
            <div className="text-center text-sm text-muted-foreground mb-2">
              ¿Quieres ver una demostración?
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDemo}
                  disabled={loadingDemo}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {loadingDemo ? 'Cargando...' : 'Probar Demo'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Demostración del Dashboard</DialogTitle>
                </DialogHeader>
                {demoData && (
                  <div className="space-y-6">
                    {/* Demo KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Ventas Netas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-800">
                            {formatCurrency(demoData.kpis?.ventasNetas || 0)}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200 bg-green-50/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Comisiones
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-800">
                            {formatCurrency(demoData.kpis?.comisionesTotales || 0)}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-orange-200 bg-orange-50/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Discrepancias
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-800">
                            {formatCurrency(demoData.kpis?.discrepancias || 0)}
                          </div>
                          <p className="text-xs text-orange-600">
                            {demoData.kpis?.ventasPendientes || 0} ventas pendientes
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Demo Info */}
                    <div className="text-center">
                      <Badge variant="secondary" className="mb-2">
                        Datos de Demostración
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Estos datos son generados automáticamente para mostrar las funcionalidades del dashboard.
                      </p>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {error && (
            <Alert className="mt-4 border-destructive">
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mt-4 border-green-500">
              <AlertDescription className="text-green-700">
                {message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;