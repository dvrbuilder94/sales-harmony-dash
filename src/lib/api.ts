const API_BASE_URL = 'https://b877bf50-33ac-4025-b2f7-fbb31711a323-00-3eceh8fu0w4nl.riker.replit.dev';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - el servidor tardó más de 10 segundos en responder');
    }
    throw error;
  }
};

class ApiClient {
  private token: string | null = null;

  async getToken(): Promise<string> {
    if (this.token) return this.token;
    
    console.log('🔑 Obteniendo token de:', `${API_BASE_URL}/auth/demo-token`);
    
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/demo-token`);
      console.log('📡 Respuesta del token:', response.status, response.statusText);
      
      const data: ApiResponse<{ token: string }> = await response.json();
      console.log('✅ Datos del token:', data);
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Error obteniendo token');
      }
      
      this.token = data.data?.token || '';
      console.log('🎫 Token obtenido exitosamente');
      return this.token;
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      throw error;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🚀 Realizando petición a:', url, options.method || 'GET');
    
    try {
      const response = await fetchWithTimeout(url, options);
      console.log('📡 Respuesta:', response.status, response.statusText);
      
      const data: ApiResponse<T> = await response.json();
      console.log('📊 Datos recibidos:', data);
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Error en la petición');
      }
      
      return data.data as T;
    } catch (error) {
      console.error('❌ Error en petición:', url, error);
      throw error;
    }
  }

  private async authenticatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken();
    
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health');
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
    return this.request('/api/dashboard');
  }

  // Ventas
  async getVentas(): Promise<any[]> {
    return this.request('/api/ventas');
  }

  // Pagos
  async getPagos(): Promise<any[]> {
    return this.request('/api/pagos');
  }

  // Reconciliation
  async reconcile(): Promise<{ message: string }> {
    return this.request('/api/reconcile', {
      method: 'POST',
    });
  }

  // Channels (requires JWT)
  async getChannels(): Promise<Array<{
    id: string;
    name: string;
    realtime?: boolean;
  }>> {
    return this.authenticatedRequest('/get-channels');
  }

  // Upload CSV (requires JWT)
  async uploadCSV(file: File, channelId: string): Promise<{
    message: string;
    processed: number;
    errors?: string[];
  }> {
    const token = await this.getToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('channel_id', channelId);

    const response = await fetch(`${API_BASE_URL}/upload-multi-channel-csv`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data: ApiResponse<{
      message: string;
      processed: number;
      errors?: string[];
    }> = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message || 'Error subiendo archivo');
    }
    
    return data.data!;
  }
}

export const apiClient = new ApiClient();