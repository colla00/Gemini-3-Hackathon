import { Suspense, lazy, useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "@/hooks/useSettings";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import DemoAccessGate from "@/components/DemoAccessGate";
import AdminRoute from "@/components/AdminRoute";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieConsent } from "@/components/CookieConsent";
import { GlobalDisclaimer } from "@/components/GlobalDisclaimer";
import { usePageViewTracker } from "@/hooks/usePageViewTracker";

function PageViewTracker() { usePageViewTracker(); return null; }
import { 
  DashboardSkeleton, 
  PageSkeleton, 
  AdminSkeleton,
  AIToolsSkeleton,
} from "@/components/skeletons";

// Eagerly loaded (critical path)
import { Landing } from "./pages/Landing";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy loaded (heavy components)
// Dashboard is now handled by NursingDashboard via DemoAccessGate
const NursingDashboard = lazy(() => import("./pages/NursingDashboard"));
const AITools = lazy(() => import("./pages/AITools"));
const PatentAttestationsAdmin = lazy(() => import("./pages/PatentAttestationsAdmin"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Patents = lazy(() => import("./pages/Patents"));
const Licensing = lazy(() => import("./pages/Licensing"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));

const Regulatory = lazy(() => import("./pages/Regulatory"));
const ANIA2026Poster = lazy(() => import("./pages/ANIA2026Poster"));
const QRCodeDownload = lazy(() => import("./pages/QRCodeDownload"));
const PressRelease = lazy(() => import("./pages/PressRelease"));
const InvestorDeck = lazy(() => import("./pages/InvestorDeck"));
const AudienceView = lazy(() => import("./pages/AudienceView"));
const PatentTracker = lazy(() => import("./pages/PatentTracker"));
const DataRoom = lazy(() => import("./pages/DataRoom"));
const KnowledgeHub = lazy(() => import("./pages/KnowledgeHub"));
const Investors = lazy(() => import("./pages/Investors"));
const Integrations = lazy(() => import("./pages/Integrations"));
const NonprovisionalToolsPage = lazy(() => import("./pages/NonprovisionalTools"));


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
          <span className="text-sm text-muted-foreground font-medium">Loading VitaSignal...</span>
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
              
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CookieConsent />
                <PageViewTracker />
                <GlobalDisclaimer />
                <AppRoutes />
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
