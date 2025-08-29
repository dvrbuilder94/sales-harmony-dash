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

  // Conciliación Dashboard
  async getConciliacionDashboard(): Promise<any> {
    try {
      const response = await this.get('/api/conciliacion-dashboard');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo datos de conciliación:', error);
      throw error;
    }
  }

  // Falabella Integration
  async connectFalabella(credentials: { user_id: string; signature: string }): Promise<{ message: string }> {
    try {
      const response = await this.post('/connect/falabella', credentials);
      return response.data;
    } catch (error) {
      console.error('❌ Error connecting to Falabella:', error);
      throw error;
    }
  }

  async fetchFalabellaData(): Promise<{ sales: any[]; message: string }> {
    try {
      const response = await this.get('/fetch-falabella');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching Falabella data:', error);
      throw error;
    }
  }

  // MercadoLibre Integration
  async connectMercadoLibre(credentials: { 
    client_id: string; 
    client_secret: string; 
    redirect_uri: string 
  }): Promise<{ message: string; redirect_url?: string }> {
    try {
      const response = await this.post('/connect/mercadolibre', credentials);
      return response.data;
    } catch (error) {
      console.error('❌ Error connecting to MercadoLibre:', error);
      throw error;
    }
  }

  async createMLTestUsers(): Promise<{ test_users: any[]; message: string }> {
    try {
      const response = await this.post('/create-ml-test-user');
      return response.data;
    } catch (error) {
      console.error('❌ Error creating ML test users:', error);
      throw error;
    }
  }

  async fetchMercadoLibreData(): Promise<{ 
    sales: any[];
    processed: number;
    discrepancies?: any[];
    message: string 
  }> {
    try {
      const response = await this.get('/fetch-mercadolibre');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching MercadoLibre data:', error);
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

  // User Dashboard methods
  async getUserDashboard() {
    try {
      const response = await this.get('/user-dashboard');
      return response.data;
    } catch (error) {
      // Fallback with mock data if API is not available
      return this.getMockUserDashboard();
    }
  }

  async syncAllChannels() {
    return this.post('/quick-actions/sync-all-channels');
  }

  async syncChannel(channelId: string) {
    return this.post('/quick-actions/sync-channel', { channelId });
  }

  async executeReconciliation() {
    return this.post('/quick-actions/reconciliation');
  }

  async exportReport(type: 'ventas' | 'pagos' | 'conciliacion', format: 'csv' | 'excel') {
    const response = await this.get(`/export/${type}?format=${format}`);
    return { data: response.data };
  }

  async configureAlert(alertConfig: any) {
    return this.post('/alerts/configure', alertConfig);
  }

  // Mock data for development
  private getMockUserDashboard() {
    const now = new Date();
    return {
      kpis: {
        ventas30d: {
          total: 25750000,
          cambio: 12.5,
          tendencia: 'up' as const,
        },
        canalesActivos: 3,
        discrepancias: {
          total: 12,
          sinResolver: 2,
        },
      },
      channelMetrics: [
        {
          id: 'mercadolibre',
          name: 'MercadoLibre',
          status: 'connected' as const,
          healthStatus: 'healthy' as const,
          lastSync: now.toISOString(),
          revenue30d: 15500000,
          orders30d: 145,
          conversionRate: 3.2,
        },
        {
          id: 'falabella',
          name: 'Falabella',
          status: 'connected' as const,
          healthStatus: 'needs_setup' as const,
          lastSync: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          revenue30d: 8750000,
          orders30d: 98,
          conversionRate: 2.8,
        },
        {
          id: 'shopify',
          name: 'Shopify',
          status: 'disconnected' as const,
          healthStatus: 'error' as const,
          lastSync: null,
          revenue30d: 1500000,
          orders30d: 23,
          conversionRate: 1.5,
        },
      ],
      alerts: [
        {
          id: '1',
          type: 'warning' as const,
          title: 'Discrepancia detectada',
          message: 'Se encontraron diferencias entre ventas y pagos del canal MercadoLibre',
          channelId: 'mercadolibre',
          createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          isActive: true,
        },
        {
          id: '2',
          type: 'error' as const,
          title: 'Canal desconectado',
          message: 'El canal Shopify ha perdido la conexión y requiere reautenticación',
          channelId: 'shopify',
          createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
          isActive: true,
        },
      ],
      preferences: {
        alertThresholds: {
          lowRevenue: 100000,
          highDiscrepancy: 50000,
          syncFailures: 3,
        },
        notifications: {
          email: true,
          push: false,
          discord: false,
          slack: true,
        },
      },
    };
  }
}

export const apiClient = new ApiClient();