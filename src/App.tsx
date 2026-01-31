import { Suspense, lazy, useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "@/hooks/useSettings";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { WatermarkOverlay } from "@/components/WatermarkOverlay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieConsent } from "@/components/CookieConsent";
import { 
  DashboardSkeleton, 
  PageSkeleton, 
  PresentationSkeleton, 
  AdminSkeleton 
} from "@/components/skeletons";

// Eagerly loaded (critical path)
import { Landing } from "./pages/Landing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy loaded (heavy components)
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Presentation = lazy(() => import("./pages/Presentation").then(m => ({ default: m.Presentation })));
const RecordingDemo = lazy(() => import("./pages/RecordingDemo").then(m => ({ default: m.RecordingDemo })));
const PatentEvidence = lazy(() => import("./pages/PatentEvidence").then(m => ({ default: m.PatentEvidence })));
const PatentAttestationsAdmin = lazy(() => import("./pages/PatentAttestationsAdmin"));
const About = lazy(() => import("./pages/About"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));

const queryClient = new QueryClient();

const App = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading spinner during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center animate-pulse">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -inset-2 rounded-2xl border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
          <span className="text-sm text-muted-foreground font-medium">Loading CareGuard...</span>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <SettingsProvider>
              <TooltipProvider>
              <ErrorBoundary>
              <Toaster />
              <Sonner />
              <WatermarkOverlay />
              <BrowserRouter>
                <CookieConsent />
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={
                    <Suspense fallback={<PageSkeleton />}>
                      <ResetPassword />
                    </Suspense>
                  } />
                  <Route path="/dashboard" element={
                    <Suspense fallback={<DashboardSkeleton />}>
                      <Dashboard />
                    </Suspense>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <Suspense fallback={<AdminSkeleton />}>
                        <AdminPanel />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/presentation" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PresentationSkeleton />}>
                        <Presentation />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/record" element={
                    <ProtectedRoute>
                      <Suspense fallback={<PresentationSkeleton />}>
                        <RecordingDemo />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={
                    <Suspense fallback={<PageSkeleton />}>
                      <About />
                    </Suspense>
                  } />
                  <Route path="/patent-evidence" element={
                    <Suspense fallback={<PageSkeleton />}>
                      <PatentEvidence />
                    </Suspense>
                  } />
                  <Route path="/patent-attestations" element={
                    <ProtectedRoute>
                      <Suspense fallback={<AdminSkeleton />}>
                        <PatentAttestationsAdmin />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/terms" element={
                    <Suspense fallback={<PageSkeleton />}>
                      <TermsOfUse />
                    </Suspense>
                  } />
                  <Route path="/privacy" element={
                    <Suspense fallback={<PageSkeleton />}>
                      <PrivacyPolicy />
                    </Suspense>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              </ErrorBoundary>
            </TooltipProvider>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;
