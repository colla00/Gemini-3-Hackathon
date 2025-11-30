import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Presentation } from "./pages/Presentation";
import { RecordingDemo } from "./pages/RecordingDemo";
import { About } from "./pages/About";
import NotFound from "./pages/NotFound";
import { PasswordGate } from "./components/quality/PasswordGate";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PasswordGate>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/presentation" element={<Presentation />} />
              <Route path="/record" element={<RecordingDemo />} />
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PasswordGate>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;