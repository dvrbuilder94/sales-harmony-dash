import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export function InvoiceForm() {
  const [customerRut, setCustomerRut] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotals = () => {
    const netAmount = items.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    const iva = netAmount * 0.19;
    const total = netAmount + iva;
    
    return { netAmount, iva, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerRut || !customerName) {
      toast({
        title: "Error",
        description: "Por favor completa los datos del cliente",
        variant: "destructive",
      });
      return;
    }

    const validItems = items.filter(item => 
      item.description && item.quantity > 0 && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      toast({
        title: "Error",
        description: "Agrega al menos un item válido",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await apiClient.createInvoice({
        rut: customerRut,
        customerName: customerName,
        items: validItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      });

      toast({
        title: "¡Factura Creada!",
        description: `Factura N° ${result.invoiceNumber} creada exitosamente`,
      });

      // Reset form
      setCustomerRut('');
      setCustomerName('');
      setItems([{ id: '1', description: '', quantity: 1, unitPrice: 0 }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear la factura",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Datos del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerRut">RUT Cliente</Label>
              <Input
                id="customerRut"
                value={customerRut}
                onChange={(e) => setCustomerRut(e.target.value)}
                placeholder="12.345.678-9"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName">Nombre / Razón Social</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nombre del cliente"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Items de la Factura</CardTitle>
            <Button type="button" onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Agregar Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
              <div className="md:col-span-5 space-y-1">
                <Label className="text-xs">Descripción</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Descripción del producto/servicio"
                />
              </div>
              
              <div className="md:col-span-2 space-y-1">
                <Label className="text-xs">Cantidad</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  min="1"
                  step="1"
                />
              </div>
              
              <div className="md:col-span-3 space-y-1">
                <Label className="text-xs">Precio Unitario</Label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="md:col-span-1 space-y-1">
                <Label className="text-xs">Total</Label>
                <div className="h-10 flex items-center justify-center bg-muted rounded-md text-sm font-mono">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </div>
              </div>
              
              <div className="md:col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="w-full"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Totals */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono">{formatCurrency(totals.netAmount)}</span>
            </div>
            <div className="flex justify-between text-amber-600">
              <span>IVA (19%):</span>
              <span className="font-mono">{formatCurrency(totals.iva)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="font-mono">{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        type="submit" 
        size="lg" 
        className="w-full"
        disabled={isCreating}
      >
        {isCreating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creando Factura...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 mr-2" />
            Crear Factura Electrónica
          </>
        )}
      </Button>
    </form>
  );
}