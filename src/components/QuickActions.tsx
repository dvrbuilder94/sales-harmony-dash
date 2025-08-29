import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Zap,
  RefreshCw, 
  Download, 
  GitMerge, 
  Bell,
  Settings,
  FileDown,
  Play
} from 'lucide-react';
import { useQuickActions, useChannelSync } from '@/hooks/useUserDashboard';
import { useToast } from '@/hooks/use-toast';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const { executeReconciliation, exportReport, configureAlert } = useQuickActions();
  const { syncAllChannels } = useChannelSync();
  const { toast } = useToast();
  const { setLoading, setLoadingMessage } = useGlobalLoading();

  const handleSyncAllChannels = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Sincronizando todos los canales...');
      
      await syncAllChannels();
      
      toast({
        title: "Sincronización iniciada",
        description: "Todos los canales están siendo sincronizados.",
      });
    } catch (error) {
      toast({
        title: "Error de sincronización",
        description: "No se pudo iniciar la sincronización de canales.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleReconciliation = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Ejecutando conciliación manual...');
      
      await executeReconciliation();
      
      toast({
        title: "Conciliación ejecutada",
        description: "El proceso de conciliación ha sido completado.",
      });
    } catch (error) {
      toast({
        title: "Error en conciliación",
        description: "No se pudo ejecutar la conciliación.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleExport = async (type: 'ventas' | 'pagos' | 'conciliacion', format: 'csv' | 'excel') => {
    try {
      setLoading(true);
      setLoadingMessage(`Generando reporte de ${type}...`);
      
      const result = await exportReport(type, format);
      
      // Create download link
      const blob = new Blob([result.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Reporte exportado",
        description: `El reporte de ${type} ha sido descargado.`,
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudo generar el reporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                size="lg" 
                className="h-14 w-14 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300 bg-primary hover:bg-primary/90"
              >
                <Zap className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">
            Acciones Rápidas
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent 
          align="end" 
          className="w-56 animate-fade-in"
          side="top"
        >
          <DropdownMenuLabel>Acciones Rápidas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Sincronización */}
          <DropdownMenuItem 
            onClick={handleSyncAllChannels}
            className="cursor-pointer"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Sincronizar Todos los Canales
          </DropdownMenuItem>

          {/* Conciliación */}
          <DropdownMenuItem 
            onClick={handleReconciliation}
            className="cursor-pointer"
          >
            <GitMerge className="mr-2 h-4 w-4" />
            Ejecutar Conciliación Manual
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Exportar Reportes */}
          <DropdownMenuLabel className="text-xs">Exportar Reportes</DropdownMenuLabel>
          
          <DropdownMenuItem 
            onClick={() => handleExport('ventas', 'csv')}
            className="cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" />
            Reporte de Ventas (CSV)
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => handleExport('pagos', 'excel')}
            className="cursor-pointer"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Reporte de Pagos (Excel)
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => handleExport('conciliacion', 'csv')}
            className="cursor-pointer"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Reporte de Conciliación
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Configuración */}
          <DropdownMenuItem className="cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            Configurar Alertas
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Preferencias
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}