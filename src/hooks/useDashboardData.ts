import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Venta, Pago, KPIData } from '@/types/dashboard';

export const useDashboardData = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [kpis, setKpis] = useState<KPIData>({
    ventasNetas: 0,
    discrepancias: 0,
    totalPagos: 0,
    ventasPendientes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch ventas
      const { data: ventasData, error: ventasError } = await supabase
        .from('ventas')
        .select('*')
        .order('fecha', { ascending: false });

      if (ventasError) throw ventasError;

      // Fetch pagos
      const { data: pagosData, error: pagosError } = await supabase
        .from('pagos')
        .select('*')
        .order('fecha', { ascending: false });

      if (pagosError) throw pagosError;

      setVentas(ventasData || []);
      setPagos(pagosData || []);

      // Calculate KPIs
      const ventasNetas = ventasData?.reduce((sum, venta) => sum + Number(venta.monto_neto), 0) || 0;
      const totalPagos = pagosData?.reduce((sum, pago) => sum + Number(pago.monto), 0) || 0;
      const discrepancias = Math.abs(ventasNetas - totalPagos);
      const ventasPendientes = ventasData?.length || 0;

      setKpis({
        ventasNetas,
        discrepancias,
        totalPagos,
        ventasPendientes
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    ventas,
    pagos,
    kpis,
    loading,
    error,
    refetch: fetchData
  };
};