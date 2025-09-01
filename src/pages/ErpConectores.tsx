import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Settings, BarChart3, Zap, TestTube } from 'lucide-react';
import { ErpConnectorsList } from '@/components/erp/ErpConnectorsList';
import { ErpConnectorForm } from '@/components/erp/ErpConnectorForm';
import { ErpSyncDashboard } from '@/components/erp/ErpSyncDashboard';
import { ErpDemo } from '@/components/erp/ErpDemo';

export default function ErpConectores() {
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
                ⚙️ Conectores ERP
              </h1>
              <p className="text-muted-foreground mt-1">
                Integración completa con sistemas ERP Softland y Nubox
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="connectors" className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> Conectores
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Sincronización
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" /> Demo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <ErpSyncDashboard />
          </TabsContent>

          <TabsContent value="connectors" className="mt-0">
            <div className="space-y-6">
              <ErpConnectorsList />
              <ErpConnectorForm />
            </div>
          </TabsContent>

          <TabsContent value="sync" className="mt-0">
            <ErpSyncDashboard showSyncControls />
          </TabsContent>

          <TabsContent value="demo" className="mt-0">
            <ErpDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}