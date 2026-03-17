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
const IntegrationGuide = lazy(() => import("./pages/IntegrationGuide"));
const PatentWorkbench = lazy(() => import("./pages/PatentWorkbench"));
const DeveloperTools = lazy(() => import("./pages/DeveloperTools"));
const PilotDemo = lazy(() => import("./pages/PilotDemo"));
const WedgeICUBundle = lazy(() => import("./pages/WedgeICUBundle"));
const WedgeNurseDashboard = lazy(() => import("./pages/WedgeNurseDashboard"));
const WedgeCMSCompliance = lazy(() => import("./pages/WedgeCMSCompliance"));
const ROICalculator = lazy(() => import("./pages/ROICalculator"));
const ProductDemoPage = lazy(() => import("./pages/ProductDemo"));

const PilotRequest = lazy(() => import("./pages/PilotRequest"));
const TrustCenter = lazy(() => import("./pages/TrustCenter"));
const Careers = lazy(() => import("./pages/Careers"));
const Pricing = lazy(() => import("./pages/Pricing"));
const LeadPipeline = lazy(() => import("./pages/LeadPipeline"));
const PilotProposal = lazy(() => import("./pages/PilotProposal"));
const FDAPreSubBuilder = lazy(() => import("./pages/FDAPreSubBuilder"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Compare = lazy(() => import("./pages/Compare"));
const PressKit = lazy(() => import("./pages/PressKit"));
const Changelog = lazy(() => import("./pages/Changelog"));
const SolutionsHospitals = lazy(() => import("./pages/SolutionsHospitals"));
const SolutionsEHRVendors = lazy(() => import("./pages/SolutionsEHRVendors"));
const SolutionsInvestors = lazy(() => import("./pages/SolutionsInvestors"));
const SolutionsMilitary = lazy(() => import("./pages/SolutionsMilitary"));
const Security = lazy(() => import("./pages/Security"));
const Research = lazy(() => import("./pages/Research"));
const NewsEvents = lazy(() => import("./pages/NewsEvents"));
const Watch = lazy(() => import("./pages/Watch"));
const ForLeaders = lazy(() => import("./pages/ForLeaders"));
const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        {...pageTransition}
        transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<Suspense fallback={<PageSkeleton />}><ResetPassword /></Suspense>} />
          <Route path="/dashboard" element={<DemoAccessGate><Suspense fallback={<DashboardSkeleton />}><NursingDashboard /></Suspense></DemoAccessGate>} />
          <Route path="/ai-tools" element={<Suspense fallback={<AIToolsSkeleton />}><AITools /></Suspense>} />
          <Route path="/admin" element={<ProtectedRoute><Suspense fallback={<AdminSkeleton />}><AdminPanel /></Suspense></ProtectedRoute>} />
          <Route path="/about" element={<Suspense fallback={<PageSkeleton />}><About /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<PageSkeleton />}><Contact /></Suspense>} />
          <Route path="/patents" element={<Suspense fallback={<PageSkeleton />}><Patents /></Suspense>} />
          <Route path="/licensing" element={<Suspense fallback={<PageSkeleton />}><Licensing /></Suspense>} />
          <Route path="/patent-attestations" element={<ProtectedRoute><Suspense fallback={<AdminSkeleton />}><PatentAttestationsAdmin /></Suspense></ProtectedRoute>} />
          <Route path="/terms" element={<Suspense fallback={<PageSkeleton />}><TermsOfUse /></Suspense>} />
          <Route path="/privacy" element={<Suspense fallback={<PageSkeleton />}><PrivacyPolicy /></Suspense>} />
          <Route path="/regulatory" element={<Suspense fallback={<PageSkeleton />}><Regulatory /></Suspense>} />
          <Route path="/ania2026" element={<Suspense fallback={<PageSkeleton />}><ANIA2026Poster /></Suspense>} />
          <Route path="/ania2026/qr" element={<Suspense fallback={<PageSkeleton />}><QRCodeDownload /></Suspense>} />
          <Route path="/press" element={<Suspense fallback={<PageSkeleton />}><PressRelease /></Suspense>} />
          <Route path="/investor-deck" element={<AdminRoute><Suspense fallback={<PageSkeleton />}><InvestorDeck /></Suspense></AdminRoute>} />
          <Route path="/audience" element={<Suspense fallback={<div className="fixed inset-0 bg-black" />}><AudienceView /></Suspense>} />
          <Route path="/patents/tracker" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><PatentTracker /></Suspense></ProtectedRoute>} />
          <Route path="/dataroom" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><DataRoom /></Suspense></ProtectedRoute>} />
          <Route path="/hub" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><KnowledgeHub /></Suspense></ProtectedRoute>} />
          <Route path="/investors" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><Investors /></Suspense></ProtectedRoute>} />
          <Route path="/integrations" element={<Suspense fallback={<PageSkeleton />}><Integrations /></Suspense>} />
          <Route path="/patents/nonprovisional" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><NonprovisionalToolsPage /></Suspense></ProtectedRoute>} />
          <Route path="/integration-guide" element={<Suspense fallback={<PageSkeleton />}><IntegrationGuide /></Suspense>} />
          <Route path="/patents/workbench" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><PatentWorkbench /></Suspense></ProtectedRoute>} />
          <Route path="/developer-tools" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><DeveloperTools /></Suspense></ProtectedRoute>} />
          <Route path="/pilot" element={<Suspense fallback={<PageSkeleton />}><PilotDemo /></Suspense>} />
          <Route path="/solutions/icu-mortality" element={<Suspense fallback={<PageSkeleton />}><WedgeICUBundle /></Suspense>} />
          <Route path="/solutions/nurse-workload" element={<Suspense fallback={<PageSkeleton />}><WedgeNurseDashboard /></Suspense>} />
          <Route path="/solutions/cms-compliance" element={<Suspense fallback={<PageSkeleton />}><WedgeCMSCompliance /></Suspense>} />
          <Route path="/roi-calculator" element={<Suspense fallback={<PageSkeleton />}><ROICalculator /></Suspense>} />
          <Route path="/demo" element={<Suspense fallback={<PageSkeleton />}><ProductDemoPage /></Suspense>} />
          
          <Route path="/pilot-request" element={<Suspense fallback={<PageSkeleton />}><PilotRequest /></Suspense>} />
          <Route path="/trust" element={<Suspense fallback={<PageSkeleton />}><TrustCenter /></Suspense>} />
          <Route path="/careers" element={<Suspense fallback={<PageSkeleton />}><Careers /></Suspense>} />
          <Route path="/pricing" element={<Suspense fallback={<PageSkeleton />}><Pricing /></Suspense>} />
          <Route path="/leads" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><LeadPipeline /></Suspense></ProtectedRoute>} />
          <Route path="/proposal" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><PilotProposal /></Suspense></ProtectedRoute>} />
          <Route path="/fda-builder" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><FDAPreSubBuilder /></Suspense></ProtectedRoute>} />
          <Route path="/client-portal" element={<ProtectedRoute><Suspense fallback={<PageSkeleton />}><ClientPortal /></Suspense></ProtectedRoute>} />
          <Route path="/blog" element={<Suspense fallback={<PageSkeleton />}><Blog /></Suspense>} />
          <Route path="/blog/:slug" element={<Suspense fallback={<PageSkeleton />}><BlogPost /></Suspense>} />
          <Route path="/compare" element={<Suspense fallback={<PageSkeleton />}><Compare /></Suspense>} />
          <Route path="/press-kit" element={<Suspense fallback={<PageSkeleton />}><PressKit /></Suspense>} />
          <Route path="/changelog" element={<Suspense fallback={<PageSkeleton />}><Changelog /></Suspense>} />
          <Route path="/solutions/hospitals" element={<Suspense fallback={<PageSkeleton />}><SolutionsHospitals /></Suspense>} />
          <Route path="/solutions/ehr-vendors" element={<Suspense fallback={<PageSkeleton />}><SolutionsEHRVendors /></Suspense>} />
          <Route path="/solutions/investors" element={<Suspense fallback={<PageSkeleton />}><SolutionsInvestors /></Suspense>} />
          <Route path="/solutions/military" element={<Suspense fallback={<PageSkeleton />}><SolutionsMilitary /></Suspense>} />
          <Route path="/security" element={<Suspense fallback={<PageSkeleton />}><Security /></Suspense>} />
          <Route path="/research" element={<Suspense fallback={<PageSkeleton />}><Research /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

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
