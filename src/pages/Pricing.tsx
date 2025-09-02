import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Star, Crown, Rocket } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Freemium',
      price: 'Gratis',
      period: 'Siempre',
      description: 'Perfecto para comenzar',
      icon: Zap,
      color: 'muted',
      popular: false,
      features: [
        '1 marketplace conectado',
        '500 transacciones/mes',
        'Conciliación básica',
        'Reportes simples',
        'Soporte por email'
      ],
      limitations: [
        'Sin IA de conciliación',
        'Sin integraciones ERP',
        'Sin soporte prioritario'
      ]
    },
    {
      name: 'Starter',
      price: '$89.000',
      period: 'CLP/mes',
      description: 'Ideal para pequeñas empresas',
      icon: Star,
      color: 'primary',
      popular: false,
      features: [
        '3 marketplaces conectados',
        '2.500 transacciones/mes',
        'IA de conciliación básica',
        'Reportes avanzados',
        'Integración SII básica',
        'Soporte por chat'
      ],
      limitations: [
        'Sin integraciones ERP avanzadas',
        'Sin analytics comparativo'
      ]
    },
    {
      name: 'Professional',
      price: '$189.000',
      period: 'CLP/mes',
      description: 'La opción más elegida',
      icon: Crown,
      color: 'success',
      popular: true,
      features: [
        '8 marketplaces conectados',
        '10.000 transacciones/mes',
        'IA de conciliación avanzada',
        'Todos los reportes',
        'Integración SII completa',
        'Integraciones ERP (Softland, Nubox)',
        'Soporte prioritario',
        'Analytics comparativo',
        'Dashboard personalizable'
      ],
      limitations: []
    },
    {
      name: 'Enterprise',
      price: '$449.000',
      period: 'CLP/mes',
      description: 'Para empresas grandes',
      icon: Rocket,
      color: 'info',
      popular: false,
      features: [
        '20 marketplaces conectados',
        '50.000 transacciones/mes',
        'IA de conciliación premium',
        'Reportes customizados',
        'Integración SII avanzada',
        'Todas las integraciones ERP',
        'Soporte 24/7',
        'Account Manager dedicado',
        'API completa',
        'White-label disponible'
      ],
      limitations: []
    },
    {
      name: 'Custom',
      price: 'Personalizado',
      period: 'Cotización',
      description: 'Solución a medida',
      icon: Crown,
      color: 'warning',
      popular: false,
      features: [
        'Marketplaces ilimitados',
        'Transacciones ilimitadas',
        'Integraciones custom',
        'Desarrollo a medida',
        'Soporte dedicado',
        'SLA personalizado',
        'Implementación on-premise',
        'Capacitación incluida'
      ],
      limitations: []
    }
  ];

  const roiStats = {
    roi: 1785,
    hoursSaved: 225,
    payback: 1.7
  };

  return (
    <AppLayout title="Pricing y Planes" description="Elige el plan perfecto para tu empresa">
      <div className="space-y-8">
        {/* Header with ROI Calculator */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Planes SalesHarmony
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Optimiza tu conciliación con IA. Ahorra tiempo, reduce errores, mejora tu flujo de caja.
          </p>
          
          {/* ROI Calculator Highlight */}
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-success/10 to-success-glow/10 border-success/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-success mb-4">📈 ROI Comprobado</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-success">{roiStats.roi}%</div>
                  <div className="text-sm text-muted-foreground">ROI Promedio</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{roiStats.hoursSaved}h</div>
                  <div className="text-sm text-muted-foreground">Ahorradas/mes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{roiStats.payback}</div>
                  <div className="text-sm text-muted-foreground">Días payback</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isPopular = plan.popular;
            
            return (
              <Card 
                key={index}
                className={`relative ${
                  isPopular 
                    ? 'ring-2 ring-success shadow-lg scale-105 bg-gradient-to-br from-success/5 to-success-glow/5' 
                    : 'hover:shadow-lg transition-all duration-300'
                }`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground">
                    ⭐ MÁS POPULAR
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className={`w-12 h-12 mx-auto rounded-full bg-${plan.color}/10 flex items-center justify-center mb-4`}>
                    <IconComponent className={`h-6 w-6 text-${plan.color}`} />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">{plan.period}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      isPopular 
                        ? 'bg-success hover:bg-success/90 text-success-foreground'
                        : ''
                    }`}
                    variant={isPopular ? 'default' : 'outline'}
                  >
                    {plan.name === 'Custom' ? 'Cotizar' : 'Empezar Ahora'}
                  </Button>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    {plan.name === 'Freemium' ? 'Sin tarjeta de crédito' : '30 días gratis'}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">🔍 Comparación Detallada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Funcionalidad</th>
                    <th className="text-center py-3 px-4">Freemium</th>
                    <th className="text-center py-3 px-4">Starter</th>
                    <th className="text-center py-3 px-4 bg-success/10">Professional</th>
                    <th className="text-center py-3 px-4">Enterprise</th>
                    <th className="text-center py-3 px-4">Custom</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Marketplaces</td>
                    <td className="text-center py-3 px-4">1</td>
                    <td className="text-center py-3 px-4">3</td>
                    <td className="text-center py-3 px-4 bg-success/5">8</td>
                    <td className="text-center py-3 px-4">20</td>
                    <td className="text-center py-3 px-4">Ilimitado</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">IA Conciliación</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">Básica</td>
                    <td className="text-center py-3 px-4 bg-success/5">Avanzada</td>
                    <td className="text-center py-3 px-4">Premium</td>
                    <td className="text-center py-3 px-4">Custom</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Integraciones ERP</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4 bg-success/5">✅</td>
                    <td className="text-center py-3 px-4">✅</td>
                    <td className="text-center py-3 px-4">Custom</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Soporte</td>
                    <td className="text-center py-3 px-4">Email</td>
                    <td className="text-center py-3 px-4">Chat</td>
                    <td className="text-center py-3 px-4 bg-success/5">Prioritario</td>
                    <td className="text-center py-3 px-4">24/7</td>
                    <td className="text-center py-3 px-4">Dedicado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center bg-gradient-to-br from-primary/10 to-primary-glow/10 border-primary/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-primary mb-4">
              ¿Listo para optimizar tu conciliación?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Únete a más de 500 empresas chilenas que confían en SalesHarmony para su conciliación automática.
            </p>
            <div className="space-x-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Empezar Gratis
              </Button>
              <Button size="lg" variant="outline">
                Agendar Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}