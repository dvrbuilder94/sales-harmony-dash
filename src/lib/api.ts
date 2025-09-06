import { supabase } from '@/integrations/supabase/client';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

class ApiClient {
  private externalApiUrl = 'https://workspace--sales-harmony-dash.replit.app';
  
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
      const { data, error } = await supabase.from('ventas').select('count').limit(1);
      return { status: error ? 'error' : 'ok' };
    } catch (error) {
      return { status: 'error' };
    }
  }

  // SaaS Multi-Tenant Methods
  
  // Company Management
  async getCompanyInfo() {
    try {
      const response = await this.get('/api/v1/company/info');
      return response.data;
    } catch (error) {
      return this.getMockCompanyInfo();
    }
  }

  async getCompanyUsers() {
    try {
      const response = await this.get('/api/v1/company/users');
      return response.data;
    } catch (error) {
      return this.getMockCompanyUsers();
    }
  }

  async inviteUser(userData: { email: string; role: string; firstName: string; lastName: string }) {
    try {
      const response = await this.post('/api/v1/company/users/invite', userData);
      return response.data;
    } catch (error) {
      console.error('Error inviting user:', error);
      throw error;
    }
  }

  async changeUserRole(userId: string, role: string) {
    try {
      const response = await this.post(`/api/v1/company/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error changing user role:', error);
      throw error;
    }
  }

  // Pricing and Plans
  async getPricingPlans() {
    try {
      const response = await this.get('/api/pricing/plans');
      return response.data;
    } catch (error) {
      return this.getMockPricingPlans();
    }
  }

  // Role-based Dashboards
  async getSellerDashboard() {
    try {
      const response = await this.get('/api/dashboards/seller');
      return response.data;
    } catch (error) {
      return this.getMockSellerDashboard();
    }
  }

  async getAccountantDashboard() {
    try {
      const response = await this.get('/api/dashboards/accountant');
      return response.data;
    } catch (error) {
      return this.getMockAccountantDashboard();
    }
  }

  async getSharedMetrics() {
    try {
      const response = await this.get('/api/dashboards/shared-metrics');
      return response.data;
    } catch (error) {
      return this.getMockSharedMetrics();
    }
  }

  // Developers Portal
  async getDeveloperPortal() {
    try {
      const response = await this.get('/api/developers/portal');
      return response.data;
    } catch (error) {
      return this.getMockDeveloperPortal();
    }
  }

  // Onboarding
  async startOnboarding(step?: number) {
    try {
      const response = await this.post('/api/onboarding/start', { step });
      return response.data;
    } catch (error) {
      return this.getMockOnboardingData();
    }
  }

  // Credentials Management (Multi-tenant)
  async getMercadoLibreCredentials() {
    try {
      const response = await this.get('/api/v1/credentials/mercadolibre');
      return response.data;
    } catch (error) {
      return this.getMockCredentialsStatus();
    }
  }

  async setMercadoLibreCredentials(credentials: { 
    client_id: string; 
    client_secret: string; 
    redirect_uri: string 
  }) {
    try {
      const response = await this.post('/api/v1/credentials/mercadolibre', credentials);
      return response.data;
    } catch (error) {
      console.error('Error setting ML credentials:', error);
      throw error;
    }
  }

  async testMercadoLibreCredentials() {
    try {
      const response = await this.post('/api/v1/credentials/mercadolibre/test');
      return response.data;
    } catch (error) {
      console.error('Error testing ML credentials:', error);
      throw error;
    }
  }

  async deleteMercadoLibreCredentials() {
    try {
      const response = await this.post('/api/v1/credentials/mercadolibre', { method: 'DELETE' });
      return response.data;
    } catch (error) {
      console.error('Error deleting ML credentials:', error);
      throw error;
    }
  }

  // Reports System
  async getReports() {
    try {
      const response = await this.get('/api/reports');
      return response.data;
    } catch (error) {
      return this.getMockReports();
    }
  }

  async downloadReport(reportType: string, format: string) {
    try {
      const response = await this.post('/api/reports/download', { report_type: reportType, format });
      return response.data;
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  // Channels Dashboard
  async getChannelsDashboard() {
    try {
      const response = await this.get('/api/channels/dashboard');
      return response.data;
    } catch (error) {
      return this.getMockChannelsDashboard();
    }
  }

  async getChannelDetails(channelId: string) {
    try {
      const response = await this.get(`/api/channels/details/${channelId}`);
      return response.data;
    } catch (error) {
      return this.getMockChannelDetails(channelId);
    }
  }

  async syncChannel(channelId: string) {
    try {
      const response = await this.post(`/api/channels/sync/${channelId}`);
      return response.data;
    } catch (error) {
      console.error('Error syncing channel:', error);
      throw error;
    }
  }

  async getComparativeAnalytics() {
    try {
      const response = await this.get('/api/channels/comparative-analytics');
      return response.data;
    } catch (error) {
      return this.getMockComparativeAnalytics();
    }
  }

  // SII Integration
  async getSiiDashboard() {
    try {
      const response = await this.get('/api/billing/electronic-invoices');
      return response.data;
    } catch (error) {
      return this.getMockSiiDashboard();
    }
  }

  async executeSiiAction(action: string) {
    try {
      const response = await this.post('/api/billing/sii-actions', { action });
      return response.data;
    } catch (error) {
      console.error('Error executing SII action:', error);
      throw error;
    }
  }

  // Dashboard data (Legacy support)
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
      const ventas = await this.getVentas();
      const pagos = await this.getPagos();
      
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

  // User Dashboard methods
  async getUserDashboard() {
    try {
      const response = await this.get('/user-dashboard');
      return response.data;
    } catch (error) {
      return this.getMockUserDashboard();
    }
  }

  async syncAllChannels() {
    return this.post('/quick-actions/sync-all-channels');
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

  // Advanced Reconciliation with AI
  async getAuthToken(): Promise<{ token: string }> {
    try {
      const response = await this.get('/auth/demo-token');
      return response.data;
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
      throw error;
    }
  }

  async executeAdvancedReconciliation(): Promise<{
    advanced_analysis: {
      accuracy_rate: number;
      ai_recommendations: string[];
      main_issues_identified: string[];
    };
    discrepancias_inteligentes: Array<{
      tipo_problema: 'unmatched' | 'commission' | 'tolerance';
      explicacion: string;
      accion_sugerida: string;
      severidad: 'alta' | 'media' | 'baja';
      diferencia_monto: number;
      confianza: string;
    }>;
    alertas_criticas: Array<{
      type: 'critical' | 'warning';
      message: string;
      action: string;
    }>;
  }> {
    try {
      const response = await this.post('/api/advanced-reconcile');
      return response.data.data;
    } catch (error) {
      console.error('❌ Error in advanced reconciliation:', error);
      return this.getMockReconciliationData();
    }
  }

  async getReconciliationInsights(): Promise<{
    insights: Array<{
      type: 'ai' | 'alert' | 'suggestion';
      title: string;
      description: string;
      action: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    alerts: Array<{
      type: 'critical' | 'warning';
      message: string;
      action: string;
    }>;
  }> {
    try {
      const response = await this.get('/api/reconciliation-insights');
      return response.data.data;
    } catch (error) {
      console.error('❌ Error getting reconciliation insights:', error);
      return this.getMockInsightsData();
    }
  }

  // Upload CSV
  async uploadCSV(file: File, channelId: string): Promise<{
    message: string;
    processed: number;
    errors?: string[];
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('upload-multi-channel-csv', {
        body: {
          channel_id: channelId,
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

  // ERP Methods
  async getErpConnectors() {
    try {
      const response = await this.get('/api/erp/connectors');
      return response.data;
    } catch (error) {
      return { connectors: [] };
    }
  }

  async registerErpConnector(connector: any) {
    try {
      const response = await this.post('/api/erp/connectors', connector);
      return response.data;
    } catch (error) {
      console.error('Error registering ERP connector:', error);
      throw error;
    }
  }

  async testErpConnection(connectorId: string) {
    try {
      const response = await this.post(`/api/erp/connectors/${connectorId}/test`);
      return response.data;
    } catch (error) {
      console.error('Error testing ERP connection:', error);
      throw error;
    }
  }

  async demoErpSync() {
    try {
      const response = await this.post('/api/erp/demo-sync');
      return response.data;
    } catch (error) {
      console.error('Error in demo ERP sync:', error);
      throw error;
    }
  }

  async bulkSyncToErp(data: any) {
    try {
      const response = await this.post('/api/erp/bulk-sync', data);
      return response.data;
    } catch (error) {
      console.error('Error in bulk sync to ERP:', error);
      throw error;
    }
  }

  // SII Methods
  async createInvoice(invoiceData: any) {
    try {
      const response = await this.post('/api/sii/create-invoice', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async calculateIva(data: any) {
    try {
      const response = await this.post('/api/sii/calculate-iva', data);
      return response.data;
    } catch (error) {
      console.error('Error calculating IVA:', error);
      throw error;
    }
  }

  async validateRut(rut: string) {
    try {
      const response = await this.post('/api/sii/validate-rut', { rut });
      return response.data;
    } catch (error) {
      console.error('Error validating RUT:', error);
      throw error;
    }
  }

  // Mock data methods for development
  private getMockCompanyInfo() {
    return {
      id: "company_123",
      rut: "76.123.456-7",
      razon_social: "Empresa Demo SAS",
      email: "admin@empresa-demo.cl",
      plan: "professional",
      usuarios_activos: 8,
      marketplaces_conectados: 3,
      transacciones_mes: 2847,
      created_at: "2024-01-15"
    };
  }

  private getMockCompanyUsers() {
    return {
      users: [
        {
          id: "user_1",
          email: "admin@empresa-demo.cl",
          first_name: "María",
          last_name: "González",
          role: "admin",
          status: "active",
          last_login: "2024-12-06T10:30:00Z"
        },
        {
          id: "user_2", 
          email: "vendedor@empresa-demo.cl",
          first_name: "Carlos",
          last_name: "Rodríguez",
          role: "seller",
          status: "active",
          last_login: "2024-12-06T09:15:00Z"
        },
        {
          id: "user_3",
          email: "contador@empresa-demo.cl", 
          first_name: "Ana",
          last_name: "Martínez",
          role: "accountant",
          status: "active",
          last_login: "2024-12-06T08:45:00Z"
        }
      ]
    };
  }

  private getMockPricingPlans() {
    return {
      plans: [
        {
          id: "freemium",
          name: "Freemium",
          price: 0,
          currency: "CLP",
          interval: "monthly",
          popular: false,
          features: [
            "1 marketplace",
            "500 transacciones/mes",
            "Dashboard básico",
            "Soporte por email"
          ],
          limitations: [
            "Sin conciliación IA",
            "Sin integraciones ERP",
            "Reportes limitados"
          ]
        },
        {
          id: "starter",
          name: "Starter", 
          price: 89000,
          currency: "CLP",
          interval: "monthly",
          popular: false,
          features: [
            "3 marketplaces",
            "2,500 transacciones/mes",
            "Conciliación IA básica",
            "Dashboard avanzado",
            "Soporte prioritario"
          ]
        },
        {
          id: "professional",
          name: "Professional",
          price: 189000,
          currency: "CLP", 
          interval: "monthly",
          popular: true,
          features: [
            "8 marketplaces",
            "10,000 transacciones/mes",
            "Conciliación IA avanzada",
            "Integraciones ERP",
            "Reportes completos",
            "API access",
            "Soporte 24/7"
          ]
        },
        {
          id: "enterprise",
          name: "Enterprise",
          price: 449000,
          currency: "CLP",
          interval: "monthly", 
          popular: false,
          features: [
            "20 marketplaces",
            "50,000 transacciones/mes",
            "IA personalizada",
            "Integraciones custom",
            "White-label",
            "Account manager",
            "SLA 99.9%"
          ]
        },
        {
          id: "custom",
          name: "Custom",
          price: null,
          currency: "CLP",
          interval: "custom",
          popular: false,
          features: [
            "Marketplaces ilimitados",
            "Transacciones ilimitadas", 
            "Desarrollo a medida",
            "Integración completa",
            "Soporte dedicado"
          ]
        }
      ],
      roi_calculator: {
        average_roi: 1785,
        hours_saved: 225,
        payback_days: 1.7
      }
    };
  }

  private getMockSellerDashboard() {
    return {
      metrics: {
        ventas_netas: {
          value: 45700000,
          change: 8.2,
          trend: "up"
        },
        discrepancias_porcentaje: {
          value: 3.2,
          target: 5.0,
          status: "good"
        },
        tiempo_ahorrado: {
          value: 18.5,
          change: 14.0,
          unit: "horas/mes"
        },
        volumen_transacciones: {
          value: 2847,
          change: 8.0
        }
      },
      comisiones_por_canal: [
        { canal: "MercadoLibre", porcentaje: 15.2, ingresos: 6934000 },
        { canal: "Falabella", porcentaje: 7.5, ingresos: 3427500 },
        { canal: "Amazon", porcentaje: 18.3, ingresos: 8361100 }
      ],
      rendimiento_mensual: [
        { mes: "Oct", mercadolibre: 6200000, falabella: 3100000, amazon: 7800000 },
        { mes: "Nov", mercadolibre: 6934000, falabella: 3427500, amazon: 8361100 }
      ],
      insights: [
        {
          tipo: "warning",
          titulo: "Comisiones Amazon Altas",
          descripcion: "Amazon tiene comisiones altas (18.3%), considera redistribuir inventario",
          accion: "Revisar estrategia de pricing"
        }
      ],
      acciones_recomendadas: [
        {
          titulo: "Configurar Alertas de Discrepancias",
          descripcion: "Automatizar detección de inconsistencias",
          tiempo_estimado: "5 min",
          prioridad: "high"
        },
        {
          titulo: "Optimizar Comisiones por Canal", 
          descripcion: "Ajustar distribución según rentabilidad",
          tiempo_estimado: "20 min",
          prioridad: "medium"
        }
      ]
    };
  }

  private getMockAccountantDashboard() {
    return {
      metrics: {
        tasa_precision: {
          value: 98.7,
          target: 95.0,
          status: "excellent"
        },
        cumplimiento_sii: {
          value: 99.1,
          target: 100.0,
          status: "good"
        },
        iva_calculado: {
          monto_total: 8700000,
          iva_retenido: 1400000,
          neto: 7300000
        },
        gmv_procesado: {
          value: 54400000,
          currency: "CLP"
        },
        exito_exportacion_erp: {
          value: 96.8,
          target: 95.0,
          status: "good"
        },
        obligaciones_fiscales: {
          pendientes: 2,
          cumplidas: 28,
          proximidad_vencimiento: 5
        }
      },
      estado_sii: {
        conectado: true,
        certificado_valido: true,
        ultimo_sync: "2024-12-06T10:30:00Z"
      },
      breakdown_tributario: [
        { periodo: "Nov 2024", neto: 45230000, iva: 8593700, total: 53823700 },
        { periodo: "Oct 2024", neto: 42150000, iva: 8008500, total: 50158500 }
      ],
      timeline_obligaciones: [
        {
          fecha: "2024-12-20",
          descripcion: "Declaración IVA Diciembre",
          estado: "pendiente",
          criticidad: "alta"
        },
        {
          fecha: "2024-12-15",
          descripcion: "Facturación Electrónica",
          estado: "completada",
          criticidad: "media"
        }
      ],
      acciones_recomendadas: [
        {
          titulo: "Validar Facturas Pendientes SII",
          descripcion: "2 facturas requieren validación antes del 15/12",
          tiempo_estimado: "10 min",
          prioridad: "critical"
        },
        {
          titulo: "Exportar Datos a ERP",
          descripcion: "Sincronizar últimas transacciones",
          tiempo_estimado: "3 min", 
          prioridad: "high"
        }
      ]
    };
  }

  private getMockSharedMetrics() {
    return {
      margenes_ganancia: {
        promedio: 14.2,
        cogs_producto: 70.5,
        comisiones: 12.3,
        otros_gastos: 3.0
      },
      discrepancias_detectadas: {
        total: 91,
        criticas: 8,
        moderadas: 23,
        menores: 60
      },
      tiempo_resolucion: {
        promedio_horas: 18,
        target_horas: 24,
        mejora_mes_anterior: 15
      },
      issues_resueltos: {
        total: 156,
        colaborativos: 98,
        individuales: 58
      },
      mejora_colaborativa: {
        precision_incremento: 5.2,
        eficiencia_incremento: 8.7
      },
      perspectivas: {
        seller: {
          impacto_flujo_caja: -125750,
          canales_afectados: ["MercadoLibre", "Falabella"]
        },
        accountant: {
          riesgo_auditoria: "medio",
          items_compliance: 3
        }
      }
    };
  }

  private getMockDeveloperPortal() {
    return {
      documentation: {
        endpoints: 47,
        examples: 156,
        last_updated: "2024-12-01"
      },
      sdks: [
        {
          name: "JavaScript SDK",
          version: "1.2.0",
          download_url: "/downloads/salesharmony-js-sdk-1.2.0.zip",
          documentation_url: "/docs/sdk/javascript"
        },
        {
          name: "Python SDK", 
          version: "1.1.5",
          download_url: "/downloads/salesharmony-python-sdk-1.1.5.zip",
          documentation_url: "/docs/sdk/python"
        },
        {
          name: "PHP SDK",
          version: "1.0.8", 
          download_url: "/downloads/salesharmony-php-sdk-1.0.8.zip",
          documentation_url: "/docs/sdk/php"
        }
      ],
      sandbox: {
        available: true,
        endpoint: "https://sandbox-api.salesharmony.cl",
        test_data: true
      },
      webhooks: {
        events: ["reconciliation.completed", "discrepancy.detected", "payment.received"],
        rate_limits: "1000 requests/hour"
      },
      rate_limits: {
        freemium: "100 requests/day",
        starter: "1000 requests/day", 
        professional: "10000 requests/day",
        enterprise: "100000 requests/day"
      },
      examples: {
        javascript: `// JavaScript SDK Example
import SalesHarmony from 'salesharmony-sdk';

const client = new SalesHarmony('your-api-key');
const dashboard = await client.dashboards.seller();
console.log(dashboard.metrics.ventas_netas);`,
        python: `# Python SDK Example  
from salesharmony import SalesHarmonyClient

client = SalesHarmonyClient(api_key='your-api-key')
dashboard = client.dashboards.seller()
print(dashboard['metrics']['ventas_netas'])`,
        php: `<?php
// PHP SDK Example
$client = new SalesHarmony\\Client('your-api-key');
$dashboard = $client->dashboards->seller();
echo $dashboard['metrics']['ventas_netas'];`
      }
    };
  }

  private getMockOnboardingData() {
    return {
      steps: [
        {
          step: 1,
          title: "Registro de Empresa", 
          description: "Datos fiscales y información empresarial",
          completed: true,
          estimated_time: "5 min"
        },
        {
          step: 2,
          title: "Crear Administrador",
          description: "Usuario administrador inicial", 
          completed: true,
          estimated_time: "2 min"
        },
        {
          step: 3, 
          title: "Selección de Plan",
          description: "Elegir tier según necesidades",
          completed: false,
          estimated_time: "3 min"
        },
        {
          step: 4,
          title: "Configurar Marketplaces",
          description: "Credenciales MercadoLibre, Falabella",
          completed: false, 
          estimated_time: "10 min"
        },
        {
          step: 5,
          title: "Integración SII",
          description: "Certificados tributarios",
          completed: false,
          estimated_time: "15 min"
        },
        {
          step: 6,
          title: "Setup ERP",
          description: "Conectar ERP empresarial",
          completed: false,
          estimated_time: "10 min"
        },
        {
          step: 7,
          title: "Invitar Equipo", 
          description: "Sellers, Accountants, Users",
          completed: false,
          estimated_time: "5 min"
        }
      ],
      progress: 2,
      total_steps: 7,
      current_step: 3,
      estimated_remaining: "43 min"
    };
  }

  private getMockCredentialsStatus() {
    return {
      mercadolibre: {
        configured: false,
        client_id: null,
        status: "not_configured",
        last_test: null
      },
      falabella: {
        configured: false,
        status: "not_configured"
      },
      amazon: {
        configured: false,
        status: "not_configured"
      }
    };
  }

  private getMockReports() {
    return {
      available_reports: [
        {
          id: "reconciliation_discrepancies",
          name: "Discrepancias de Conciliación",
          description: "Análisis detallado de diferencias encontradas",
          last_generated: "2024-12-05T14:30:00Z",
          size: "2.4 MB",
          format: ["pdf", "excel", "csv"]
        },
        {
          id: "sales_summary",
          name: "Resumen de Ventas",
          description: "Consolidado mensual por canal", 
          last_generated: "2024-12-06T09:15:00Z",
          size: "1.8 MB",
          format: ["pdf", "excel"]
        },
        {
          id: "sii_compliance",
          name: "Cumplimiento SII",
          description: "Estado tributario y obligaciones",
          last_generated: "2024-12-04T16:45:00Z", 
          size: "987 KB",
          format: ["pdf"]
        }
      ]
    };
  }

  private getMockChannelsDashboard() {
    return {
      channels: [
        {
          id: "mercadolibre",
          name: "MercadoLibre",
          status: "connected",
          health_status: "healthy", 
          last_sync: "2024-12-06T10:30:00Z",
          revenue_30d: 6934000,
          orders_30d: 1247,
          conversion_rate: 12.3,
          discrepancies: 2,
          commission_rate: 15.2
        },
        {
          id: "falabella",
          name: "Falabella",
          status: "connected", 
          health_status: "needs_setup",
          last_sync: "2024-12-06T08:15:00Z",
          revenue_30d: 3427500,
          orders_30d: 678,
          conversion_rate: 8.7,
          discrepancies: 5,
          commission_rate: 7.5
        },
        {
          id: "amazon",
          name: "Amazon Chile",
          status: "error",
          health_status: "error",
          last_sync: "2024-12-05T15:22:00Z", 
          revenue_30d: 8361100,
          orders_30d: 1891,
          conversion_rate: 15.8,
          discrepancies: 1,
          commission_rate: 18.3
        },
        {
          id: "shopify", 
          name: "Tienda Propia",
          status: "disconnected",
          health_status: "needs_setup",
          last_sync: null,
          revenue_30d: 0,
          orders_30d: 0,
          conversion_rate: 0,
          discrepancies: 0,
          commission_rate: 0
        }
      ],
      sync_status: {
        last_full_sync: "2024-12-06T06:00:00Z",
        next_scheduled: "2024-12-06T18:00:00Z",
        auto_sync_enabled: true,
        sync_frequency: "every_12_hours"
      },
      alerts: [
        {
          channel_id: "amazon",
          type: "error",
          message: "Error de autenticación en Amazon",
          since: "2024-12-05T15:22:00Z"
        },
        {
          channel_id: "falabella", 
          type: "warning",
          message: "5 discrepancias detectadas requieren revisión",
          since: "2024-12-06T07:30:00Z"
        }
      ]
    };
  }

  private getMockChannelDetails(channelId: string) {
    const channels = {
      mercadolibre: {
        id: "mercadolibre",
        name: "MercadoLibre",
        status: "connected",
        config: {
          client_id: "1234567890123456",
          webhook_configured: true,
          auto_sync: true
        },
        metrics: {
          total_sales: 6934000,
          total_orders: 1247, 
          avg_order_value: 5562,
          commission_paid: 1054168
        },
        recent_activity: [
          { timestamp: "2024-12-06T10:30:00Z", action: "sync_completed", details: "127 órdenes procesadas" },
          { timestamp: "2024-12-06T08:15:00Z", action: "discrepancy_detected", details: "Diferencia de $12,750" }
        ]
      }
    };
    return channels[channelId] || { error: "Channel not found" };
  }

  private getMockComparativeAnalytics() {
    return {
      performance_comparison: [
        {
          channel: "MercadoLibre",
          revenue: 6934000,
          orders: 1247,
          commission_rate: 15.2,
          avg_processing_time: 24,
          success_rate: 98.5
        },
        {
          channel: "Falabella", 
          revenue: 3427500,
          orders: 678,
          commission_rate: 7.5,
          avg_processing_time: 36,
          success_rate: 95.2
        },
        {
          channel: "Amazon",
          revenue: 8361100,
          orders: 1891,
          commission_rate: 18.3, 
          avg_processing_time: 18,
          success_rate: 97.8
        }
      ],
      trends: {
        growth_rates: [
          { channel: "MercadoLibre", growth: 8.2 },
          { channel: "Falabella", growth: -2.1 },
          { channel: "Amazon", growth: 15.7 }
        ],
        market_share: [
          { channel: "Amazon", share: 44.2 },
          { channel: "MercadoLibre", share: 36.7 },
          { channel: "Falabella", share: 19.1 }
        ]
      }
    };
  }

  private getMockSiiDashboard() {
    return {
      connection_status: {
        connected: true,
        certificate_valid: true,
        last_sync: "2024-12-06T10:30:00Z",
        environment: "production"
      },
      monthly_progress: {
        current_month: "diciembre_2024",
        invoices_sent: 1567,
        invoices_target: 2000,
        completion_percentage: 78.4
      },
      recent_invoices: [
        {
          folio: 12847,
          rut_receptor: "12.345.678-9", 
          monto_neto: 125000,
          iva: 23750,
          total: 148750,
          estado: "aceptada",
          fecha_emision: "2024-12-06"
        },
        {
          folio: 12846,
          rut_receptor: "98.765.432-1",
          monto_neto: 89500,
          iva: 17005,
          total: 106505, 
          estado: "pendiente",
          fecha_emision: "2024-12-06"
        }
      ],
      available_actions: [
        { id: "validate_xml", name: "Validar XML", description: "Verificar estructura de factura" },
        { id: "calculate_iva", name: "Calcular IVA", description: "Calcular impuestos automáticamente" },
        { id: "create_nota_credito", name: "Crear Nota Crédito", description: "Generar nota de crédito" }
      ]
    };
  }

  // Mock data for development
  private getMockReconciliationData() {
    return {
      advanced_analysis: {
        accuracy_rate: 87.5,
        ai_recommendations: [
          "Sincronizar datos de MercadoLibre cada 2 horas para mejorar precisión",
          "Configurar alertas automáticas para discrepancias mayores a $50.000",
          "Revisar comisiones de Falabella que muestran inconsistencias"
        ],
        main_issues_identified: [
          "Desincronización temporal entre ventas y pagos",
          "Comisiones variables no actualizadas en algunos canales",
          "Diferencias de redondeo en conversiones de moneda"
        ]
      },
      discrepancias_inteligentes: [
        {
          tipo_problema: 'unmatched' as const,
          explicacion: 'Venta registrada sin pago correspondiente en MercadoLibre',
          accion_sugerida: 'Verificar estado del pago en la plataforma de MercadoLibre',
          severidad: 'alta' as const,
          diferencia_monto: 125750.00,
          confianza: '95.2%'
        },
        {
          tipo_problema: 'commission' as const,
          explicacion: 'Diferencia en cálculo de comisiones vs. valor esperado',
          accion_sugerida: 'Actualizar tabla de comisiones para canal Falabella',
          severidad: 'media' as const,
          diferencia_monto: 8930.50,
          confianza: '87.8%'
        },
        {
          tipo_problema: 'tolerance' as const,
          explicacion: 'Diferencia menor dentro del rango de tolerancia aceptable',
          accion_sugerida: 'Marcar como revisado - no requiere acción inmediata',
          severidad: 'baja' as const,
          diferencia_monto: 12.75,
          confianza: '76.4%'
        }
      ],
      alertas_criticas: [
        {
          type: 'critical' as const,
          message: 'Se detectaron 3 transacciones sin coincidencia por más de $500.000 en total',
          action: 'Revisar manualmente las transacciones pendientes en la página de conciliación'
        },
        {
          type: 'warning' as const,
          message: 'Canal Shopify sin sincronizar por más de 24 horas',
          action: 'Reconectar el canal Shopify y ejecutar sincronización completa'
        }
      ]
    };
  }

  private getMockInsightsData() {
    return {
      insights: [
        {
          type: 'ai' as const,
          title: 'Optimización de Sincronización',
          description: 'La IA detectó que reducir el intervalo de sincronización a 2 horas mejoraría la precisión en un 23%',
          action: 'Configurar sincronización automática',
          priority: 'high' as const
        },
        {
          type: 'suggestion' as const,
          title: 'Actualización de Comisiones',
          description: 'Las comisiones de Falabella han cambiado. Se recomienda actualizar la configuración',
          action: 'Revisar configuración de comisiones',
          priority: 'medium' as const
        },
        {
          type: 'alert' as const,
          title: 'Volumen Inusual Detectado',
          description: 'Se detectó un aumento del 45% en las ventas de MercadoLibre en las últimas 48 horas',
          action: 'Verificar inventario y capacidad',
          priority: 'high' as const
        }
      ],
      alerts: [
        {
          type: 'critical' as const,
          message: 'Discrepancia crítica detectada: $125.750 sin conciliar',
          action: 'Revisar inmediatamente en la página de conciliación'
        },
        {
          type: 'warning' as const,
          message: 'Canal Amazon sin sincronizar por más de 24 horas',
          action: 'Reconectar el canal Amazon y ejecutar sincronización completa'
        }
      ]
    };
  }

  private getMockUserDashboard() {
    return {
      kpis: {
        ventas30d: {
          total: 54400000,
          cambio: 12.5,
          tendencia: 'up' as const
        },
        canalesActivos: 3,
        discrepancias: {
          total: 91,
          sinResolver: 8
        }
      },
      channelMetrics: [
        {
          id: 'mercadolibre',
          name: 'MercadoLibre',
          status: 'connected' as const,
          healthStatus: 'healthy' as const,
          lastSync: '2024-12-06T10:30:00Z',
          revenue30d: 6934000,
          orders30d: 1247,
          conversionRate: 12.3
        },
        {
          id: 'falabella', 
          name: 'Falabella',
          status: 'connected' as const,
          healthStatus: 'needs_setup' as const,
          lastSync: '2024-12-06T08:15:00Z', 
          revenue30d: 3427500,
          orders30d: 678,
          conversionRate: 8.7
        },
        {
          id: 'amazon',
          name: 'Amazon Chile',
          status: 'error' as const,
          healthStatus: 'error' as const,
          lastSync: '2024-12-05T15:22:00Z',
          revenue30d: 8361100,
          orders30d: 1891,
          conversionRate: 15.8
        }
      ],
      alerts: [
        {
          id: 'alert_1',
          type: 'error' as const,
          title: 'Conexión Amazon Fallida',
          message: 'Error de autenticación en Amazon Chile',
          channelId: 'amazon',
          createdAt: '2024-12-05T15:22:00Z',
          isActive: true
        },
        {
          id: 'alert_2', 
          type: 'warning' as const,
          title: 'Discrepancias Falabella',
          message: '5 discrepancias detectadas requieren revisión',
          channelId: 'falabella',
          createdAt: '2024-12-06T07:30:00Z',
          isActive: true
        }
      ],
      preferences: {
        alertThresholds: {
          lowRevenue: 100000,
          highDiscrepancy: 50000,
          syncFailures: 3
        },
        notifications: {
          email: true,
          push: true,
          discord: false,
          slack: true
        }
      }
    };
  }
}

export const apiClient = new ApiClient();