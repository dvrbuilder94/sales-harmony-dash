const API_BASE_URL = 'https://workspace.diegovasries.repl.co';

interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

class ApiClient {
  private token: string | null = null;

  async getToken(): Promise<string> {
    if (this.token) return this.token;
    
    const response = await fetch(`${API_BASE_URL}/auth/demo-token`);
    const data: ApiResponse<{ token: string }> = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message || 'Error obteniendo token');
    }
    
    this.token = data.data?.token || '';
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data: ApiResponse<T> = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message || 'Error en la petición');
    }
    
    return data.data as T;
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