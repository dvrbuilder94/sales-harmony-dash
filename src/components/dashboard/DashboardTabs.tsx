import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportesTab } from './ReportesTab';
import { AuditoriaTab } from './AuditoriaTab';
import { CanalesTab } from './CanalesTab';
import { ConfiguracionTab } from './ConfiguracionTab';

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('reportes');

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="reportes" className="flex items-center gap-2">
            📊 Reportes
          </TabsTrigger>
          <TabsTrigger value="auditoria" className="flex items-center gap-2">
            🔍 Auditoría
          </TabsTrigger>
          <TabsTrigger value="canales" className="flex items-center gap-2">
            📺 Canales
          </TabsTrigger>
          <TabsTrigger value="configuracion" className="flex items-center gap-2">
            ⚙️ Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reportes" className="mt-0">
          <ReportesTab />
        </TabsContent>

        <TabsContent value="auditoria" className="mt-0">
          <AuditoriaTab />
        </TabsContent>

        <TabsContent value="canales" className="mt-0">
          <CanalesTab />
        </TabsContent>

        <TabsContent value="configuracion" className="mt-0">
          <ConfiguracionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}