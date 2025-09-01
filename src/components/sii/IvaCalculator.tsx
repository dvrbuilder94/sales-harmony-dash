import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calculator, Copy, Receipt } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function IvaCalculator() {
  const [netAmount, setNetAmount] = useState<string>('');
  const [calculation, setCalculation] = useState<{
    netAmount: number;
    iva: number;
    totalAmount: number;
  } | null>(null);
  const { toast } = useToast();

  // Auto-calculate when amount changes
  useEffect(() => {
    const amount = parseFloat(netAmount);
    if (amount > 0) {
      calculateIva(amount);
    } else {
      setCalculation(null);
    }
  }, [netAmount]);

  const calculateIva = async (amount: number) => {
    try {
      const result = await apiClient.calculateIva(amount);
      setCalculation(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al calcular el IVA",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Valor copiado al portapapeles",
    });
  };

  const handleUseInInvoice = () => {
    if (calculation) {
      toast({
        title: "Datos preparados",
        description: "Los valores han sido preparados para crear una factura",
      });
      // Here you would typically navigate to the invoice form with pre-filled data
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-2">
        <Label htmlFor="netAmount">Monto Neto (sin IVA)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id="netAmount"
            type="number"
            value={netAmount}
            onChange={(e) => setNetAmount(e.target.value)}
            placeholder="100000"
            className="pl-8"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Calculation Results */}
      {calculation && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="w-5 h-5" />
              Cálculo de IVA 19%
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Net Amount */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monto Neto:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium">
                  {formatCurrency(calculation.netAmount)}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(calculation.netAmount.toString())}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* IVA */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">IVA (19%):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium text-amber-600">
                  {formatCurrency(calculation.iva)}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(calculation.iva.toString())}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Total:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-primary">
                  {formatCurrency(calculation.totalAmount)}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(calculation.totalAmount.toString())}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-2">
              <Button 
                onClick={handleUseInInvoice} 
                className="w-full"
                size="lg"
              >
                <Receipt className="w-4 h-4 mr-2" />
                Usar en Factura
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">💡 Información sobre el IVA</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• El IVA en Chile es del 19%</p>
            <p>• Se aplica sobre el valor neto de bienes y servicios</p>
            <p>• Los cálculos son automáticos y precisos</p>
            <p>• Puedes usar estos valores directamente en facturas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}