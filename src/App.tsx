import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { GlobalLoadingProvider } from "@/hooks/useGlobalLoading";
import { GlobalLoadingSpinner } from "@/components/GlobalLoadingSpinner";
import { OAuthCallback } from "@/components/OAuthCallback";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Reconciliation from "./pages/Reconciliation";
import FacturacionSii from "./pages/FacturacionSii";
import ErpConectores from "./pages/ErpConectores";
import Ventas from "./pages/Ventas";
import Canales from "./pages/Canales";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <GlobalLoadingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <GlobalLoadingSpinner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/auth/mercadolibre/callback" element={<OAuthCallback />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/reconciliation" element={
                <ProtectedRoute>
                  <Reconciliation />
                </ProtectedRoute>
              } />
          <Route path="/facturacion-sii/*" element={
            <ProtectedRoute>
              <FacturacionSii />
            </ProtectedRoute>
          } />
          <Route path="/erp-conectores/*" element={
            <ProtectedRoute>
              <ErpConectores />
            </ProtectedRoute>
          } />
          <Route path="/ventas" element={
            <ProtectedRoute>
              <Ventas />
            </ProtectedRoute>
          } />
          <Route path="/canales" element={
            <ProtectedRoute>
              <Canales />
            </ProtectedRoute>
          } />
          <Route path="/reportes" element={
            <ProtectedRoute>
              <Reportes />
            </ProtectedRoute>
          } />
          <Route path="/configuracion" element={
            <ProtectedRoute>
              <Configuracion />
            </ProtectedRoute>
          } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GlobalLoadingProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
