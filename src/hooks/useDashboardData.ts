import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Venta, Pago, KPIData } from '@/types/dashboard';

export const useDashboardData = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [kpis, setKpis] = useState<KPIData>({
    ventasNetas: 0,
    comisionesTotales: 0,
    discrepancias: 0,
    totalPagos: 0,
    ventasPendientes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      console.log('🔄 fetchData iniciado');
      setLoading(true);
      
      // Fetch ventas
      const { data: ventasData, error: ventasError } = await supabase
        .from('ventas')
        .select('*')
        .order('fecha', { ascending: false });

      if (ventasError) throw ventasError;
      console.log('✅ Ventas cargadas:', ventasData?.length);

      // Fetch pagos
      const { data: pagosData, error: pagosError } = await supabase
        .from('pagos')
        .select('*')
        .order('fecha', { ascending: false });

      if (pagosError) throw pagosError;
      console.log('✅ Pagos cargados:', pagosData?.length);

      setVentas(ventasData || []);
      setPagos(pagosData || []);

      // Calculate KPIs
      const ventasNetas = ventasData?.reduce((sum, venta) => sum + Number(venta.monto_neto), 0) || 0;
      const comisionesTotales = ventasData?.reduce((sum, venta) => sum + Number(venta.comisiones), 0) || 0;
      const totalPagos = pagosData?.reduce((sum, pago) => sum + Number(pago.monto), 0) || 0;
      const discrepancias = Math.abs(ventasNetas - totalPagos);
      const ventasPendientes = ventasData?.length || 0;

      setKpis({
        ventasNetas,
        comisionesTotales,
        discrepancias,
        totalPagos,
        ventasPendientes
      });
      
      console.log('📊 KPIs calculados:', { ventasNetas, comisionesTotales, totalPagos, discrepancias });

    } catch (err) {
      console.error('❌ Error en fetchData:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 useDashboardData iniciado');
    fetchData();

    // Set up real-time subscriptions
    const ventasChannel = supabase
      .channel('ventas-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ventas' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    const pagosChannel = supabase
      .channel('pagos-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pagos' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ventasChannel);
      supabase.removeChannel(pagosChannel);
    };
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