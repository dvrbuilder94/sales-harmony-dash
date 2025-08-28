import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportesGeneralesTab } from './ReportesGeneralesTab';
import { ConciliacionTab } from './ConciliacionTab';

export function ReportesTab() {
  const [activeTab, setActiveTab] = useState('generales');
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="generales" className="flex items-center gap-2">
            📊 Reportes Generales
          </TabsTrigger>
          <TabsTrigger value="conciliacion" className="flex items-center gap-2">
            ⚖️ Conciliación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generales" className="mt-0">
          <ReportesGeneralesTab />
        </TabsContent>

        <TabsContent value="conciliacion" className="mt-0">
          <ConciliacionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}