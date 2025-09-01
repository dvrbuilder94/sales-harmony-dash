import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { ErpConnectorForm } from '@/components/erp/ErpConnectorForm';
import { ErpSyncDashboard } from '@/components/erp/ErpSyncDashboard';
import { ErpDemo } from '@/components/erp/ErpDemo';

// Simplified single ERP connector component
function ErpConnectorConfig() {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Configura tu conector ERP principal. Una empresa solo puede tener un ERP activo.
      </div>
      <ErpConnectorForm />
    </div>
  );
}

export default function ErpConectores() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted">
        <AppSidebar />
        
        <main className="flex-1">
          <header className="h-16 flex items-center border-b bg-background/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-xl font-semibold">Conectores ERP</h1>
              <p className="text-sm text-muted-foreground">Integración con sistemas ERP empresariales</p>
            </div>
          </header>

          <div className="p-6">
            <Routes>
              <Route path="/" element={<ErpSyncDashboard />} />
              <Route path="/config" element={<ErpConnectorConfig />} />
              <Route path="/sync" element={<ErpSyncDashboard showSyncControls />} />
              <Route path="/demo" element={<ErpDemo />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}