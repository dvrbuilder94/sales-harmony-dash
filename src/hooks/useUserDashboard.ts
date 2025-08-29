import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface UserDashboardData {
  kpis: {
    ventas30d: {
      total: number;
      cambio: number;
      tendencia: 'up' | 'down' | 'stable';
    };
    canalesActivos: number;
    discrepancias: {
      total: number;
      sinResolver: number;
    };
  };
  channelMetrics: Array<{
    id: string;
    name: string;
    status: 'connected' | 'disconnected' | 'error';
    healthStatus: 'healthy' | 'needs_setup' | 'error';
    lastSync: string | null;
    revenue30d: number;
    orders30d: number;
    conversionRate: number;
  }>;
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    title: string;
    message: string;
    channelId?: string;
    createdAt: string;
    isActive: boolean;
  }>;
  preferences: {
    alertThresholds: {
      lowRevenue: number;
      highDiscrepancy: number;
      syncFailures: number;
    };
    notifications: {
      email: boolean;
      push: boolean;
      discord: boolean;
      slack: boolean;
    };
  };
}

export const useUserDashboard = () => {
  return useQuery({
    queryKey: ['userDashboard'],
    queryFn: async (): Promise<UserDashboardData> => {
      const response = await apiClient.getUserDashboard();
      return response;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const useChannelSync = () => {
  return {
    syncAllChannels: async () => {
      return await apiClient.syncAllChannels();
    },
    syncChannel: async (channelId: string) => {
      return await apiClient.syncChannel(channelId);
    },
  };
};

export const useQuickActions = () => {
  return {
    executeReconciliation: async () => {
      return await apiClient.executeReconciliation();
    },
    exportReport: async (type: 'ventas' | 'pagos' | 'conciliacion', format: 'csv' | 'excel') => {
      return await apiClient.exportReport(type, format);
    },
    configureAlert: async (alertConfig: any) => {
      return await apiClient.configureAlert(alertConfig);
    },
  };
};