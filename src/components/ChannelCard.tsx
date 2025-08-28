import { Button } from '@/components/ui/button';

interface ChannelCardProps {
  channel: {
    name: string;
    icon: string;
    description: string;
    status: string;
    configured: boolean;
    requires_oauth: boolean;
  };
  onConnect: () => void;
  loading: boolean;
}

export const ChannelCard = ({ channel, onConnect, loading }: ChannelCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'connected': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'development': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'not_configured': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getButtonText = () => {
    if (channel.status === 'available') return 'Conectar';
    if (channel.status === 'connected') return 'Configurado';
    if (channel.status === 'development') return 'En Desarrollo';
    return 'Configurar';
  };

  const isConnectable = channel.status === 'available' || channel.status === 'development';

  return (
    <div className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card">
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{channel.icon}</span>
        <div>
          <h3 className="font-semibold text-lg text-card-foreground">{channel.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(channel.status)}`}>
            {channel.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-4">{channel.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-muted-foreground">
          {channel.requires_oauth && (
            <span className="flex items-center gap-1">
              🔐 OAuth Requerido
            </span>
          )}
        </div>
        
        <Button
          onClick={onConnect}
          disabled={!isConnectable || loading}
          variant={isConnectable ? "default" : "secondary"}
          size="sm"
          className="min-w-[100px]"
        >
          {loading ? '...' : getButtonText()}
        </Button>
      </div>
    </div>
  );
};