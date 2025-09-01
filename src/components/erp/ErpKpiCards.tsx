import { Card, CardContent } from '@/components/ui/card';
import { Settings, Zap } from 'lucide-react';

export function ErpKpiCards() {
  // Mock ERP KPI data
  const erpStats = {
    activeConnectors: 2,
    syncRate: 95.3,
    lastSync: new Date().toISOString(),
    totalSyncs: 1247
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        ⚙️ Conectores ERP
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Conectores ERP</p>
                <p className="text-2xl font-bold text-purple-700">{erpStats.activeConnectors}</p>
                <p className="text-xs text-purple-500">Activos</p>
              </div>
              <Settings className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-200/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Sync Rate</p>
                <p className="text-2xl font-bold text-emerald-700">{erpStats.syncRate}%</p>
                <p className="text-xs text-emerald-500">{erpStats.totalSyncs} sincronizaciones</p>
              </div>
              <Zap className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}