import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Calculator, Plus, Receipt } from 'lucide-react';
import { RutValidator } from '@/components/sii/RutValidator';
import { IvaCalculator } from '@/components/sii/IvaCalculator';
import { InvoiceForm } from '@/components/sii/InvoiceForm';
import { InvoicesList } from '@/components/sii/InvoicesList';
import { SiiDashboard } from '@/components/sii/SiiDashboard';

export default function FacturacionSii() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                🧾 Facturación Electrónica SII
              </h1>
              <p className="text-muted-foreground mt-1">
                Sistema completo de facturación electrónica para Chile
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              📊 Dashboard
            </TabsTrigger>
            <TabsTrigger value="validator" className="flex items-center gap-2">
              ✅ Validar RUT
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              🧮 Calc. IVA
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Crear Factura
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" /> Facturas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <SiiDashboard />
          </TabsContent>

          <TabsContent value="validator" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Validador de RUT Chileno
                </CardTitle>
                <CardDescription>
                  Valida RUTs chilenos con formato automático y verificación de dígito verificador
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RutValidator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Calculadora de IVA 19%
                </CardTitle>
                <CardDescription>
                  Calcula automáticamente el IVA 19% para facturas electrónicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IvaCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-0">
            <InvoiceForm />
          </TabsContent>

          <TabsContent value="invoices" className="mt-0">
            <InvoicesList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}