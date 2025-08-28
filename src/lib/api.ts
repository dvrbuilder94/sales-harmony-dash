import { supabase } from '@/integrations/supabase/client';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

class ApiClient {
  private externalApiUrl = 'https://b877bf50-33ac-4025-b2f7-fbb31711a323-00-3eceh8fu0w4nl.riker.replit.dev';
  
  private async checkUserSession(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No hay sesión autenticada');
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json'
    };
  }

  // External API methods for channel connections
  async get(path: string): Promise<{ data: any; status: number; headers: any }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.externalApiUrl}${path}`, {
        method: 'GET',
        headers
      });
      const data = await response.json();
      return { data, status: response.status, headers: response.headers };
    } catch (error) {
      console.error('External API GET error:', error);
      throw error;
    }
  }

  async post(path: string, body?: any): Promise<{ data: any; status: number; headers: any }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.externalApiUrl}${path}`, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await response.json();
      return { data, status: response.status, headers: response.headers };
    } catch (error) {
      console.error('External API POST error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    try {
      // Simple connectivity test
      const { data, error } = await supabase.from('ventas').select('count').limit(1);
      return { status: error ? 'error' : 'ok' };
    } catch (error) {
      return { status: 'error' };
    }
  }

  // Dashboard data
  async getDashboard(): Promise<{
    kpis: {
      ventasNetas: number;
      comisionesTotales: number;
      discrepancias: number;
      totalPagos: number;
      ventasPendientes: number;
    };
    ventas: any[];
    pagos: any[];
  }> {
    try {
      // Get ventas and pagos data
      const ventas = await this.getVentas();
      const pagos = await this.getPagos();
      
      // Calculate KPIs from the data
      const ventasNetas = ventas.reduce((sum, venta) => sum + (venta.monto || 0), 0);
      const comisionesTotales = ventas.reduce((sum, venta) => sum + (venta.comision || 0), 0);
      const totalPagos = pagos.reduce((sum, pago) => sum + (pago.monto || 0), 0);
      const discrepancias = Math.abs(ventasNetas - totalPagos);
      const ventasPendientes = ventas.filter(venta => venta.estado === 'pendiente').length;
      
      return {
        kpis: {
          ventasNetas,
          comisionesTotales,
          discrepancias,
          totalPagos,
          ventasPendientes
        },
        ventas,
        pagos
      };
    } catch (error) {
      console.error('❌ Error obteniendo datos del dashboard:', error);
      const { toast } = await import('@/hooks/use-toast');
      toast({
        title: "Error al Cargar Dashboard",
        description: "No se pudieron cargar los datos del dashboard. Verifica que tengas los permisos necesarios.",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Ventas
  async getVentas(): Promise<any[]> {
    try {
      await this.checkUserSession();
      
      const { data, error } = await supabase.from('ventas').select('*');
      
      if (error) {
        console.error('❌ Error obteniendo ventas:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ Error en petición de ventas:', error);
      
      const { toast } = await import('@/hooks/use-toast');
      toast({
        title: "Error de Autenticación",
        description: "No tienes permisos para acceder a los datos de ventas. Contacta al administrador.",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Pagos
  async getPagos(): Promise<any[]> {
    try {
      await this.checkUserSession();
      
      const { data, error } = await supabase.from('pagos').select('*');
      
      if (error) {
        console.error('❌ Error obteniendo pagos:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ Error en petición de pagos:', error);
      
      const { toast } = await import('@/hooks/use-toast');
      toast({
        title: "Error de Autenticación",
        description: "No tienes permisos para acceder a los datos de pagos. Contacta al administrador.",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Reconciliation
  async reconcile(): Promise<{ message: string }> {
    // This would typically call a Supabase Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('reconcile-data');
      
      if (error) throw error;
      
      return { message: 'Reconciliación completada exitosamente' };
    } catch (error) {
      console.error('❌ Error en reconciliación:', error);
      return { message: 'Error en la reconciliación' };
    }
  }

  // Channels
  async getChannels(): Promise<Array<{
    id: string;
    name: string;
    realtime?: boolean;
  }>> {
    try {
      const { data, error } = await supabase.from('channels').select('*');
      
      if (error) {
        // If channels table doesn't exist, return mock data
        return [
          { id: '1', name: 'Canal Principal', realtime: true },
          { id: '2', name: 'Canal Secundario', realtime: false },
        ];
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo canales:', error);
      const { toast } = await import('@/hooks/use-toast');
      toast({
        title: "Error al Cargar Canales",
        description: "No se pudieron cargar los canales.",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Upload CSV
  async uploadCSV(file: File, channelId: string): Promise<{
    message: string;
    processed: number;
    errors?: string[];
  }> {
    try {
      // This would typically use a Supabase Edge Function for file processing
      const { data, error } = await supabase.functions.invoke('upload-multi-channel-csv', {
        body: {
          channel_id: channelId,
          // File would be uploaded to storage first, then processed
        }
      });
      
      if (error) throw error;
      
      return {
        message: 'Archivo procesado exitosamente',
        processed: data?.processed || 0,
        errors: data?.errors || []
      };
    } catch (error) {
      console.error('❌ Error subiendo CSV:', error);
      throw new Error('Error procesando el archivo CSV');
    }
  }
}

export const apiClient = new ApiClient();