import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function RutValidator() {
  const [rut, setRut] = useState('');
  const [validation, setValidation] = useState<{
    valid: boolean;
    formatted?: string;
    message?: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  // Debounced validation
  useEffect(() => {
    if (rut.length >= 8) {
      const timeoutId = setTimeout(() => {
        validateRut();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setValidation(null);
    }
  }, [rut]);

  const validateRut = async () => {
    if (!rut.trim()) return;
    
    setIsValidating(true);
    try {
      const result = await apiClient.validateRut(rut);
      setValidation(result);
      
      if (result.valid && result.formatted) {
        setRut(result.formatted);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al validar el RUT",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRutChange = (value: string) => {
    // Allow only numbers, K, dots, and hyphens
    const cleaned = value.replace(/[^0-9K.-]/gi, '');
    setRut(cleaned);
  };

  const getValidationIcon = () => {
    if (isValidating) {
      return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;
    }
    
    if (validation?.valid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    if (validation && !validation.valid) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    
    return null;
  };

  const getValidationColor = () => {
    if (validation?.valid) return 'border-green-500 bg-green-50 dark:bg-green-950';
    if (validation && !validation.valid) return 'border-red-500 bg-red-50 dark:bg-red-950';
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="rut">RUT Chileno</Label>
        <div className="relative">
          <Input
            id="rut"
            value={rut}
            onChange={(e) => handleRutChange(e.target.value)}
            placeholder="12.345.678-9"
            className={`pr-10 ${getValidationColor()}`}
            maxLength={12}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getValidationIcon()}
          </div>
        </div>
        {validation?.message && (
          <p className={`text-sm ${validation.valid ? 'text-green-600' : 'text-red-600'}`}>
            {validation.message}
          </p>
        )}
      </div>

      {validation?.valid && (
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  RUT Válido
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  RUT formateado: {validation.formatted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h3 className="font-medium text-foreground">Ejemplos de RUTs válidos:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setRut('12345678-9')}
            className="justify-start h-auto p-2"
          >
            12.345.678-9
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setRut('87654321-K')}
            className="justify-start h-auto p-2"
          >
            87.654.321-K
          </Button>
        </div>
      </div>
    </div>
  );
}