import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    type: 'up' | 'down' | 'stable'
    label?: string
  }
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  footer?: React.ReactNode
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className,
  variant = 'default',
  footer
}: StatCardProps) {
  const getTrendIcon = (type: 'up' | 'down' | 'stable') => {
    switch (type) {
      case 'up':
        return TrendingUp
      case 'down':
        return TrendingDown
      case 'stable':
        return Minus
    }
  }

  const getTrendColor = (type: 'up' | 'down' | 'stable') => {
    switch (type) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'stable':
        return 'text-muted-foreground bg-muted border-border'
    }
  }

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50/50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50/50'
      case 'destructive':
        return 'border-red-200 bg-red-50/50'
      default:
        return ''
    }
  }

  const TrendIcon = trend ? getTrendIcon(trend.type) : null

  return (
    <Card className={cn(getVariantStyles(variant), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {trend && TrendIcon && (
            <Badge 
              variant="outline" 
              className={cn("gap-1", getTrendColor(trend.type))}
            >
              <TrendIcon className="h-3 w-3" />
              {Math.abs(trend.value)}%
            </Badge>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {trend?.label && (
          <p className="text-xs text-muted-foreground">
            {trend.label}
          </p>
        )}

        {footer && (
          <div className="pt-2 border-t">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  )
}