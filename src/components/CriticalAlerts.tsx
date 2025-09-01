import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { AlertTriangle, XCircle, Eye, X } from 'lucide-react';

interface CriticalAlert {
  type: 'critical' | 'warning';
  message: string;
  action: string;
}

export const CriticalAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await apiClient.getReconciliationInsights();
      setAlerts(data.alerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = (alertMessage: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertMessage));
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.message));

  if (loading || visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {visibleAlerts.map((alert, index) => (
        <Card 
          key={index}
          className={`border-l-4 ${
            alert.type === 'critical' 
              ? 'border-l-[hsl(var(--critical))] bg-[hsl(var(--critical))]/5' 
              : 'border-l-[hsl(var(--warning))] bg-[hsl(var(--warning))]/5'
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-lg ${
                  alert.type === 'critical' 
                    ? 'bg-[hsl(var(--critical))]/10' 
                    : 'bg-[hsl(var(--warning))]/10'
                }`}>
                  {alert.type === 'critical' ? (
                    <XCircle className="h-5 w-5 text-[hsl(var(--critical))]" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={
                        alert.type === 'critical' 
                          ? 'border-[hsl(var(--critical))] text-[hsl(var(--critical))]' 
                          : 'border-[hsl(var(--warning))] text-[hsl(var(--warning))]'
                      }
                    >
                      {alert.type === 'critical' ? 'CRÍTICO' : 'ADVERTENCIA'}
                    </Badge>
                  </div>
                  
                  <p className="font-medium text-foreground">
                    {alert.message}
                  </p>
                  
                  <p className="text-sm text-muted-foreground">
                    <strong>Acción recomendada:</strong> {alert.action}
                  </p>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      size="sm" 
                      onClick={() => navigate('/reconciliation')}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissAlert(alert.message)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};