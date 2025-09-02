import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CriticalAlerts } from "@/components/CriticalAlerts";
import { UserKPICards } from "@/components/UserKPICards";
import { RoleSelector } from "@/components/RoleSelector";
import { SellerView } from "@/components/dashboard/SellerView";
import { AccountantView } from "@/components/dashboard/AccountantView";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import { useRoleSelector } from "@/hooks/useRoleSelector";

const Index = () => {
  const { data: dashboardData, isLoading } = useUserDashboard();
  const { currentRole, isSellerView, isAccountantView } = useRoleSelector();

  const headerActions = (
    <div className="flex items-center gap-3">
      <RoleSelector />
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={() => window.location.reload()}
      >
        <RefreshCw className="h-4 w-4" />
        <span className="hidden sm:inline">Actualizar</span>
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <AppLayout title="SalesHarmony" description="Conciliación Inteligente con IA" actions={headerActions}>
        <div className="space-y-6">
          {/* Loading handled globally */}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="SalesHarmony" 
      description="Conciliación Inteligente con IA" 
      actions={headerActions}
    >
      <div className="space-y-6">
        <CriticalAlerts />
        
        {isSellerView && <SellerView />}
        {isAccountantView && <AccountantView />}
        
        {!isSellerView && !isAccountantView && dashboardData && (
          <UserKPICards kpis={dashboardData.kpis} />
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
