import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, Target } from 'lucide-react';

export function SellerView() {
  // Mock seller-specific data
  const sellerMetrics = {
    ventasNetas: { value: 45700000, change: 8.2, trend: 'up' },
    discrepancias: { value: 3.2, target: 5, trend: 'down' },
    comisiones: {
      mercadolibre: 15.2,
      falabella: 7.5,
      amazon: 18.3
    },
    tiempoAhorrado: { value: 18.5, change: 14, trend: 'up' },
    transacciones: { value: 2847, change: 8, trend: 'up' }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-critical" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Panel Vendedor</h2>
          <p className="text-muted-foreground">Métricas operativas optimizadas para sellers</p>
        </div>
        <Badge className="bg-primary text-primary-foreground">
          🛍️ Vista Seller
        </Badge>
      </div>

      {/* Main Seller KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-success/10 to-success-glow/10 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success">Ventas Netas</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(sellerMetrics.ventasNetas.value)}
                </p>
                <div className="flex items-center gap-1 text-xs text-success">
                  {getTrendIcon(sellerMetrics.ventasNetas.trend)}
                  +{sellerMetrics.ventasNetas.change}% vs mes anterior
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/10 to-warning-glow/10 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warning">Discrepancias</p>
                <p className="text-2xl font-bold text-warning">
                  {sellerMetrics.discrepancias.value}%
                </p>
                <div className="text-xs text-warning">
                  Objetivo: &lt;{sellerMetrics.discrepancias.target}%
                </div>
              </div>
              <Target className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info-glow/10 border-info/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-info">Tiempo Ahorrado</p>
                <p className="text-2xl font-bold text-info">
                  {sellerMetrics.tiempoAhorrado.value}h
                </p>
                <div className="flex items-center gap-1 text-xs text-info">
                  {getTrendIcon(sellerMetrics.tiempoAhorrado.trend)}
                  +{sellerMetrics.tiempoAhorrado.change}% vs manual
                </div>
              </div>
              <Clock className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Transacciones</p>
                <p className="text-2xl font-bold text-primary">
                  {sellerMetrics.transacciones.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-xs text-primary">
                  {getTrendIcon(sellerMetrics.transacciones.trend)}
                  +{sellerMetrics.transacciones.change}% crecimiento
                </div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comisiones por Canal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Rendimiento por Canal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">MercadoLibre</span>
                  <span className="text-sm text-warning font-bold">
                    {sellerMetrics.comisiones.mercadolibre}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-warning rounded-full h-2" 
                    style={{ width: `${sellerMetrics.comisiones.mercadolibre * 5}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Alto volumen, comisión media</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Falabella</span>
                  <span className="text-sm text-success font-bold">
                    {sellerMetrics.comisiones.falabella}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-success rounded-full h-2" 
                    style={{ width: `${sellerMetrics.comisiones.falabella * 5}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Mejor margen disponible</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Amazon</span>
                  <span className="text-sm text-critical font-bold">
                    {sellerMetrics.comisiones.amazon}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-critical rounded-full h-2" 
                    style={{ width: `${sellerMetrics.comisiones.amazon * 5}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Revisar estrategia de pricing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights for Sellers */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">🤖 Insights IA para Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="text-warning text-lg">⚠️</div>
              <div>
                <h4 className="font-medium text-warning">Amazon tiene comisiones altas</h4>
                <p className="text-sm text-muted-foreground">Considera redistribuir productos hacia Falabella (7.5% vs 18.3%)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
              <div className="text-success text-lg">💡</div>
              <div>
                <h4 className="font-medium text-success">Oportunidad de optimización</h4>
                <p className="text-sm text-muted-foreground">Falabella muestra el mejor rendimiento. Aumentar inventario podría incrementar ventas 15%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}