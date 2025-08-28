export interface Venta {
  id: string;
  fecha: string;
  order_id: string;
  monto_bruto: number;
  monto_neto: number;
  iva: number;
  comisiones: number;
  devoluciones: number;
  created_at: string;
  updated_at: string;
  channel_id?: string | null;
}

export interface Pago {
  id: string;
  fecha: string;
  monto: number;
  referencia: string;
  created_at: string;
  updated_at: string;
}

export interface KPIData {
  ventasNetas: number;
  comisionesTotales: number;
  discrepancias: number;
  totalPagos: number;
  ventasPendientes: number;
}