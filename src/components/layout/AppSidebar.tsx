import { useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { 
  Home, 
  BarChart3, 
  FileText, 
  Settings, 
  Receipt, 
  Calculator,
  CheckCircle,
  Zap,
  TestTube,
  ArrowLeft,
  Building2
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
import { Button } from "@/components/ui/button"

interface AppSidebarProps {
  currentSection?: 'sii' | 'erp' | 'main'
}

export function AppSidebar({ currentSection = 'main' }: AppSidebarProps) {
  const { state } = useSidebar()
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const collapsed = state === 'collapsed'

  const isActive = (path: string) => currentPath === path
  const getNavCls = (path: string) =>
    isActive(path) ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"

  if (currentSection === 'sii') {
    const siiItems = [
      { title: "Dashboard SII", url: "/facturacion-sii", icon: BarChart3 },
      { title: "Validar RUT", url: "/facturacion-sii/validator", icon: CheckCircle },
      { title: "Calc. IVA", url: "/facturacion-sii/calculator", icon: Calculator },
      { title: "Crear Factura", url: "/facturacion-sii/create", icon: FileText },
      { title: "Facturas", url: "/facturacion-sii/invoices", icon: Receipt },
    ]

    return (
      <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
        <SidebarHeader className="p-4">
          {!collapsed && (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">🧾 SII Facturación</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Facturación Electrónica</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {siiItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={getNavCls(item.url)}>
                      <NavLink to={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
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

  if (currentSection === 'erp') {
    const erpItems = [
      { title: "Dashboard ERP", url: "/erp-conectores", icon: BarChart3 },
      { title: "Mi Conector", url: "/erp-conectores/config", icon: Settings },
      { title: "Sincronización", url: "/erp-conectores/sync", icon: Zap },
      { title: "Demo", url: "/erp-conectores/demo", icon: TestTube },
    ]

    return (
      <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
        <SidebarHeader className="p-4">
          {!collapsed && (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">⚙️ ERP Conectores</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Integración ERP</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {erpItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={getNavCls(item.url)}>
                      <NavLink to={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
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

  // Main dashboard sidebar
  const mainItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Ventas", url: "/ventas", icon: BarChart3 },
    { title: "Facturación SII", url: "/facturacion-sii", icon: FileText },
    { title: "Reconciliación", url: "/reconciliation", icon: CheckCircle },
    { title: "Canales", url: "/canales", icon: Zap },
    { title: "ERP Integration", url: "/erp-conectores", icon: Building2 },
    { title: "Reportes", url: "/reportes", icon: Receipt },
    { title: "Configuración", url: "/configuracion", icon: Settings },
  ]

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold">SalesHarmony</h2>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={getNavCls(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
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