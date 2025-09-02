import { NavLink, useLocation } from "react-router-dom"
import { 
  Home, 
  BarChart3, 
  FileText, 
  Settings, 
  Receipt,
  CheckCircle,
  Zap,
  ChevronLeft
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const { state, setOpenMobile, toggleSidebar } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === 'collapsed'
  const isMobile = useIsMobile()

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/'
    return currentPath.startsWith(path)
  }

  // Clean navigation without emojis for professional look
  const mainItems = [
    { title: "Dashboard", url: "/", icon: Home, description: "Resumen ejecutivo" },
    { title: "Ventas", url: "/ventas", icon: BarChart3, description: "Gestión de transacciones" },
    { title: "Facturación", url: "/facturacion", icon: FileText, description: "SII Chile" },
    { title: "Reconciliación", url: "/reconciliacion", icon: CheckCircle, description: "Conciliación multi-canal" },
    { title: "Canales", url: "/canales", icon: Zap, description: "Marketplaces" },
    { title: "Reportes", url: "/reportes", icon: Receipt, description: "Analytics y métricas" },
    { title: "Configuración", url: "/config", icon: Settings, description: "Configuración general" },
  ]

  const handleNavClick = () => {
    // Close mobile sidebar on navigation
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar 
      className={`bg-sidebar border-sidebar-border ${collapsed && !isMobile ? "w-16" : "w-64"}`} 
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <h2 className="text-lg font-bold text-sidebar-primary">SalesHarmony</h2>
          )}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenMobile(false)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          {(!collapsed || isMobile) && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-accent-foreground px-3 py-2 font-medium">
              Módulos
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`rounded-lg transition-all duration-200 ${
                      isActive(item.url) 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    }`}
                    tooltip={collapsed && !isMobile ? `${item.title} - ${item.description}` : undefined}
                  >
                    <NavLink to={item.url} onClick={handleNavClick} className="flex items-center w-full">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {(!collapsed || isMobile) && (
                        <div className="ml-3 min-w-0 flex-1">
                          <div className="font-medium truncate">{item.title}</div>
                          {!collapsed && (
                            <div className="text-xs opacity-70 truncate">{item.description}</div>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {(!collapsed || isMobile) && (
          <div className="text-xs text-sidebar-accent-foreground">
            v1.0.0 • SalesHarmony
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}