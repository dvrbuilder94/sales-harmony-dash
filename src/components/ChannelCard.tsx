import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckCircle, Clock, AlertCircle, MoreVertical, Settings, Trash2, RefreshCw, Loader2 } from 'lucide-react';

interface ChannelCardProps {
  channel: {
    name: string;
    icon: string;
    description: string;
    status: string;
    configured: boolean;
    requires_oauth: boolean;
    lastSync?: string;
    productsCount?: number;
    syncStatus?: 'syncing' | 'success' | 'error' | 'idle';
  };
  onConnect: () => void;
  onDisconnect?: () => void;
  onConfigure?: () => void;
  onSync?: () => void;
  loading: boolean;
}

export const ChannelCard = ({ 
  channel, 
  onConnect, 
  onDisconnect, 
  onConfigure, 
  onSync, 
  loading 
}: ChannelCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'available': return <Clock className="h-4 w-4 text-warning" />;
      case 'development': return <AlertCircle className="h-4 w-4 text-info" />;
      default: return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'available': return 'secondary';
      case 'development': return 'outline';
      default: return 'destructive';
    }
  };

  const getSyncIcon = () => {
    switch (channel.syncStatus) {
      case 'syncing': return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'success': return <CheckCircle className="h-3 w-3 text-success" />;
      case 'error': return <AlertCircle className="h-3 w-3 text-destructive" />;
      default: return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const isConnected = channel.status === 'connected';
  const isConnectable = channel.status === 'available' || channel.status === 'development';

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <span className="text-2xl">{channel.icon}</span>
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {channel.name}
                {getStatusIcon(channel.status)}
              </CardTitle>
              <Badge variant={getStatusVariant(channel.status)} className="mt-1">
                {channel.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          
          {isConnected && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onConfigure && (
                  <DropdownMenuItem onClick={onConfigure}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurar
                  </DropdownMenuItem>
                )}
                {onSync && (
                  <DropdownMenuItem onClick={onSync}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sincronizar
                  </DropdownMenuItem>
                )}
                {onDisconnect && (
                  <DropdownMenuItem onClick={onDisconnect} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Desconectar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="mb-4 text-sm leading-relaxed">
          {channel.description}
        </CardDescription>
        
        {/* Channel Stats */}
        {isConnected && (
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {channel.productsCount || 0}
              </div>
              <div className="text-xs text-muted-foreground">Productos</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {getSyncIcon()}
                <span className="text-xs text-muted-foreground">
                  {channel.lastSync ? new Date(channel.lastSync).toLocaleDateString() : 'Nunca'}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Última Sync</div>
            </div>
          </div>
        )}
        
        {/* OAuth indicator */}
        {channel.requires_oauth && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-info/10 rounded-lg">
            <CheckCircle className="h-4 w-4 text-info" />
            <span className="text-xs text-info">OAuth 2.0 Requerido</span>
          </div>
        )}
        
        {/* Action Button */}
        <Button
          onClick={onConnect}
          disabled={!isConnectable || loading}
          variant={isConnected ? "outline" : "default"}
          size="sm"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Conectando...
            </>
          ) : isConnected ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Conectado
            </>
          ) : channel.status === 'development' ? (
            'En Desarrollo'
          ) : (
            'Conectar Canal'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};