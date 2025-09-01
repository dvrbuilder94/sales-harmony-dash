import { NavLink, useLocation } from "react-router-dom"
import { 
  Home, 
  BarChart3, 
  FileText, 
  Settings, 
  Receipt,
  CheckCircle,
  Zap
} from "lucide-react"

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
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === 'collapsed'

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/'
    return currentPath.startsWith(path)
  }
  
  const getNavCls = (path: string) =>
    isActive(path) ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"

  // Main dashboard sidebar - 7 sections as specified
  const mainItems = [
    { title: "📊 Dashboard", url: "/", icon: Home },
    { title: "💰 Ventas", url: "/ventas", icon: BarChart3 },
    { title: "🧾 Facturación SII", url: "/facturacion", icon: FileText },
    { title: "🔄 Reconciliación", url: "/reconciliacion", icon: CheckCircle },
    { title: "🛒 Canales", url: "/canales", icon: Zap },
    { title: "📈 Reportes", url: "/reportes", icon: Receipt },
    { title: "⚙️ Configuración", url: "/config", icon: Settings },
  ]

  return (
    <Sidebar 
      className={`${collapsed ? "w-14" : "w-64"} bg-card border-r`} 
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-primary">SalesHarmony</h2>
        )}
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3 py-2">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`rounded-lg transition-colors ${getNavCls(item.url)}`}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="mr-3 h-4 w-4" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}