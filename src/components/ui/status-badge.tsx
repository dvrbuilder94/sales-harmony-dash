import { Badge, BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, AlertTriangle, Clock, Loader2 } from "lucide-react"

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'success' | 'error' | 'warning' | 'pending' | 'loading' | 'connected' | 'disconnected' | 'processing'
  showIcon?: boolean
  pulse?: boolean
}

export function StatusBadge({ 
  status, 
  showIcon = true, 
  pulse = false, 
  className, 
  children, 
  ...props 
}: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
      case 'connected':
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
          icon: CheckCircle,
          label: children || 'Exitoso'
        }
      case 'error':
      case 'disconnected':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: children || 'Error'
        }
      case 'warning':
        return {
          variant: 'outline' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
          icon: AlertTriangle,
          label: children || 'Advertencia'
        }
      case 'pending':
        return {
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Clock,
          label: children || 'Pendiente'
        }
      case 'loading':
      case 'processing':
        return {
          variant: 'outline' as const,
          className: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Loader2,
          label: children || 'Procesando'
        }
      default:
        return {
          variant: 'outline' as const,
          className: '',
          icon: null,
          label: children || status
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge
      variant={config.variant}
      className={cn(
        config.className,
        pulse && 'animate-pulse',
        'flex items-center gap-1',
        className
      )}
      {...props}
    >
      {showIcon && Icon && (
        <Icon className={cn(
          "h-3 w-3",
          (status === 'loading' || status === 'processing') && 'animate-spin'
        )} />
      )}
      {config.label}
    </Badge>
  )
}