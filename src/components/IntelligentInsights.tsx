import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { Bot, AlertTriangle, Lightbulb, TrendingUp, Settings, Eye } from 'lucide-react';

interface Insight {
  type: 'ai' | 'alert' | 'suggestion';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export const IntelligentInsights = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const data = await apiClient.getReconciliationInsights();
      setInsights(data.insights);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Bot className="h-5 w-5 text-[hsl(var(--ai-primary))]" />;
      case 'alert': return <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />;
      case 'suggestion': return <Lightbulb className="h-5 w-5 text-[hsl(var(--success))]" />;
      default: return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'ai': return 'hsl(var(--ai-primary))';
      case 'alert': return 'hsl(var(--warning))';
      case 'suggestion': return 'hsl(var(--success))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'hsl(var(--critical))';
      case 'medium': return 'hsl(var(--warning))';
      case 'low': return 'hsl(var(--success))';
      default: return 'hsl(var(--muted))';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'ALTA';
      case 'medium': return 'MEDIA';
      case 'low': return 'BAJA';
      default: return 'NORMAL';
    }
  };

  const handleInsightAction = (insight: Insight) => {
    switch (insight.type) {
      case 'ai':
        navigate('/reconciliation');
        break;
      case 'alert':
        navigate('/reconciliation');
        break;
      case 'suggestion':
        // Could navigate to settings or specific configuration page
        navigate('/');
        break;
      default:
        navigate('/');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-[hsl(var(--ai-primary))]" />
            Insights Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-[hsl(var(--ai-primary))]" />
          Insights Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg border border-border hover:border-border/80 transition-colors"
            style={{ backgroundColor: `${getInsightColor(insight.type)}08` }}
          >
            <div className="flex items-start gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${getInsightColor(insight.type)}15` }}
              >
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: getPriorityColor(insight.priority),
                      color: getPriorityColor(insight.priority)
                    }}
                  >
                    {getPriorityLabel(insight.priority)}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
                
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleInsightAction(insight)}
                    className="gap-2"
                  >
                    {insight.type === 'ai' && <Bot className="h-4 w-4" />}
                    {insight.type === 'alert' && <Eye className="h-4 w-4" />}
                    {insight.type === 'suggestion' && <Settings className="h-4 w-4" />}
                    {insight.action}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {insights.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay insights disponibles en este momento</p>
            <p className="text-sm">Los insights aparecerán después de ejecutar la conciliación IA</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};