import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Venta, Pago, KPIData } from '@/types/dashboard';

export const useDashboardData = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.getDashboard(),
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });

  return {
    ventas: data?.ventas || [],
    pagos: data?.pagos || [],
    kpis: data?.kpis || {
      ventasNetas: 0,
      comisionesTotales: 0,
      discrepancias: 0,
      totalPagos: 0,
      ventasPendientes: 0
    },
    loading: isLoading,
    error: error?.message || null,
    refetch
  };
};