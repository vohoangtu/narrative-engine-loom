import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Workshop from "./pages/Workshop";
import Pipeline from "./pages/Pipeline";
import Studio from "./pages/Studio";
import Agents from "./pages/Agents";
import History from "./pages/History";
import Worlds from "./pages/Worlds";
import WorldDetail from "./pages/WorldDetail";
import { ComingSoon } from "@/components/loom/ComingSoon";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Workshop />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/history" element={<History />} />
            <Route path="/worlds" element={<Worlds />} />
            <Route path="/worlds/:id" element={<WorldDetail />} />
            <Route path="/settings" element={<ComingSoon title="Settings" subtitle="Workspace preferences" hint="API keys, Centrifugo connection, Celery worker pools, webhooks." />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
