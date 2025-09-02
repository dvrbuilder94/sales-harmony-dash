import { ReactNode } from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/use-mobile'
import { LogOut, User, Menu } from 'lucide-react'

interface AppLayoutProps {
  children: ReactNode
  title: string
  description?: string
  actions?: ReactNode
}

export function AppLayout({ children, title, description, actions }: AppLayoutProps) {
  const { user, signOut } = useAuth()
  const isMobile = useIsMobile()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger className="flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg font-semibold truncate">{title}</h1>
                {description && (
                  <p className="text-xs text-muted-foreground truncate hidden sm:block">{description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions && (
                <div className="hidden md:flex items-center gap-2">
                  {actions}
                </div>
              )}
              
              {/* User menu - responsive */}
              <div className="flex items-center gap-1">
                {!isMobile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline truncate max-w-32">{user?.email}</span>
                  </div>
                )}
                <ThemeToggle />
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size={isMobile ? "sm" : "sm"}
                  className="gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  {!isMobile && <span>Salir</span>}
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}