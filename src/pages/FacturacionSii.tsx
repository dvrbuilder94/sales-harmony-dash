import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calculator, Plus, Receipt } from 'lucide-react';
import { RutValidator } from '@/components/sii/RutValidator';
import { IvaCalculator } from '@/components/sii/IvaCalculator';
import { InvoiceForm } from '@/components/sii/InvoiceForm';
import { InvoicesList } from '@/components/sii/InvoicesList';
import { SiiDashboard } from '@/components/sii/SiiDashboard';

export default function FacturacionSii() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted">
        <AppSidebar currentSection="sii" />
        
        <main className="flex-1">
          <header className="h-16 flex items-center border-b bg-background/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-xl font-semibold">Facturación Electrónica SII</h1>
              <p className="text-sm text-muted-foreground">Sistema completo de facturación para Chile</p>
            </div>
          </header>

          <div className="p-6">
            <Routes>
              <Route path="/" element={<SiiDashboard />} />
              <Route path="/validator" element={
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
              } />
              <Route path="/calculator" element={
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
              } />
              <Route path="/create" element={<InvoiceForm />} />
              <Route path="/invoices" element={<InvoicesList />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}