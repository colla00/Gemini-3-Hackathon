import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BarChart3, GitBranch, Settings, 
  RefreshCw, Clock, Building2, User, ChevronDown, Search, Filter,
  Activity, Home, Presentation, Lock, Target, Database, TrendingDown,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardOverview } from '@/components/quality/DashboardOverview';
import { PatientListView } from '@/components/quality/PatientListView';
import { ShapExplainability } from '@/components/quality/ShapExplainability';
import { ClinicalWorkflowView } from '@/components/quality/ClinicalWorkflowView';
import { ValidationMetricsDashboard } from '@/components/quality/ValidationMetricsDashboard';
import { EHRIntegrationDiagram } from '@/components/quality/EHRIntegrationDiagram';
import { OutcomeComparisonPanel } from '@/components/quality/OutcomeComparisonPanel';
import { ResearchBanner } from '@/components/quality/ResearchBanner';
import { MethodologyChat } from '@/components/quality/MethodologyChat';
import { GuidedDemo } from '@/components/quality/GuidedDemo';
import { useLiveSimulation } from '@/hooks/useLiveSimulation';
import { ScreenProtection } from '@/components/quality/ScreenProtection';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';
import { NotificationsDropdown } from '@/components/dashboard/NotificationsDropdown';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';
import { toast } from 'sonner';

type ViewType = 'dashboard' | 'patients' | 'shap' | 'workflow' | 'validation' | 'integration' | 'outcomes';

const navItems: { id: ViewType; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: 'dashboard', label: 'Overview', shortLabel: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'patients', label: 'Patient Worklist', shortLabel: 'Worklist', icon: <Users className="w-4 h-4" /> },
  { id: 'shap', label: 'Risk Attribution', shortLabel: 'SHAP', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'workflow', label: 'Workflow Demo', shortLabel: 'Workflow', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'validation', label: 'Model Validation', shortLabel: 'Metrics', icon: <Target className="w-4 h-4" /> },
  { id: 'integration', label: 'EHR Integration', shortLabel: 'EHR', icon: <Database className="w-4 h-4" /> },
  { id: 'outcomes', label: 'Clinical Outcomes', shortLabel: 'Outcomes', icon: <TrendingDown className="w-4 h-4" /> },
];

export const Dashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  const [showSettings, setShowSettings] = useState(false);
  const { logFeatureUse, logInteraction } = useSessionTracking();
  
  // Live simulation (can be toggled)
  const liveSimulation = useLiveSimulation(true, 5000);

  // Update time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handle view change with logging
  const handleViewChange = useCallback((view: ViewType) => {
    setActiveView(view);
    logFeatureUse(`View: ${navItems.find(n => n.id === view)?.label || view}`);
  }, [logFeatureUse]);

  // Handle live toggle with logging
  const handleLiveToggle = useCallback(() => {
    liveSimulation.toggle();
    logInteraction(liveSimulation.isActive ? 'Paused live updates' : 'Enabled live updates');
  }, [liveSimulation, logInteraction]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview liveSimulation={liveSimulation} />;
      case 'patients':
        return <PatientListView liveSimulation={liveSimulation} />;
      case 'shap':
        return <ShapExplainability />;
      case 'workflow':
        return <ClinicalWorkflowView />;
      case 'validation':
        return <ValidationMetricsDashboard />;
      case 'integration':
        return <EHRIntegrationDiagram />;
      case 'outcomes':
        return <OutcomeComparisonPanel />;
      default:
        return <DashboardOverview liveSimulation={liveSimulation} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" data-protected="true">
      {/* Screen Protection */}
      <ScreenProtection enabled={true} />

      {/* Research Prototype Disclaimer */}
      <ResearchDisclaimer />

      {/* Cyan Header Stripe */}
      <div className="h-1.5 bg-primary w-full" />
      
      {/* Research Banner - Compact */}
      <ResearchBanner />

      {/* Main Header Bar */}
      <header className="px-4 py-2 border-b border-border/40 bg-secondary/50">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Navigation + App Title */}
          <div className="flex items-center gap-4">
            {/* Back to Home */}
            <Link 
              to="/"
              className="p-2 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
              title="Back to Home"
            >
              <Home className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground leading-tight">NSO Quality Dashboard</h1>
                <span className="text-[10px] text-muted-foreground">Nurse-Sensitive Outcomes</span>
              </div>
            </div>
            
            {/* Unit Selector */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-secondary border border-border/50 cursor-pointer hover:bg-secondary/80 transition-colors">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Unit 4C - Med/Surg</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search patients, MRN, room..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-secondary border border-border/50 rounded focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground transition-colors"
              />
            </div>
          </div>

          {/* Right: Status & Actions */}
          <div className="flex items-center gap-3">
            {/* Live Status */}
            <div 
              className={cn(
                "hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border transition-all cursor-pointer",
                liveSimulation.isActive 
                  ? "bg-risk-low/10 border-risk-low/30" 
                  : "bg-secondary border-border/50"
              )}
              onClick={handleLiveToggle}
            >
              {liveSimulation.isActive ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
                  <span className="text-[10px] font-medium text-risk-low uppercase">Live</span>
                  <Activity className="w-3 h-3 text-risk-low" />
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">Paused</span>
                </>
              )}
            </div>

            {/* Time & Shift - Dynamic based on time of day */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentTime}</span>
              <span className="text-primary font-medium">
                • {new Date().getHours() >= 7 && new Date().getHours() < 19 ? 'Day Shift' : 'Night Shift'}
              </span>
            </div>

            {/* Quick Actions - Cleaned up, no overlaps */}
            <div className="flex items-center gap-0.5">
              {/* Guided Demo Button - Self-guided 45-min walkthrough */}
              <GuidedDemo onViewChange={(view) => handleViewChange(view as ViewType)} currentView={activeView} />
              
              <Link
                to="/presentation?mode=presenter"
                className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-risk-low transition-colors"
                title="Presenter Dashboard (dual-screen for Zoom)"
              >
                <Monitor className="w-4 h-4" />
              </Link>
              <Link
                to="/presentation"
                className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-colors"
                title="Presentation Mode"
              >
                <Presentation className="w-4 h-4" />
              </Link>
              <button 
                onClick={() => liveSimulation.updateSimulation()}
                className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={cn("w-4 h-4", liveSimulation.isActive && "animate-spin")} style={{ animationDuration: '3s' }} />
              </button>
              <NotificationsDropdown />
              <button 
                onClick={() => setShowSettings(true)}
                className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* User */}
            <div className="flex items-center gap-2 pl-3 border-l border-border/50">
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="hidden md:block text-xs font-medium text-foreground">
                Demo User
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="px-4 py-2 border-b border-border/30 bg-background/50 overflow-x-auto">
        <div className="flex items-center justify-between min-w-max">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap",
                  activeView === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
                <span className="lg:hidden">{item.shortLabel}</span>
              </button>
            ))}
          </div>

          {/* Quick Filters */}
          <div className="hidden md:flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-risk-high/10 border border-risk-high/30">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-high" />
              <span className="text-[10px] font-medium text-risk-high">3 High Risk</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto pb-16">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {renderView()}
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 py-2 px-4 bg-secondary/95 backdrop-blur-sm border-t border-border/30">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="text-primary font-semibold">⚠️ Research Prototype</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="hidden sm:inline">Synthetic Data Only</span>
            <span className="hidden md:inline text-border">|</span>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
              <User className="w-3 h-3 text-amber-500" />
              <span className="text-amber-500 font-semibold uppercase tracking-wide">Human-in-the-Loop Required</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-primary">
              <Lock className="w-3 h-3" />
              <span className="font-medium">Patent Pending</span>
            </div>
            <span className="text-border">|</span>
            <span>v0.1.0</span>
          </div>
        </div>
      </footer>

      {/* Settings Panel */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      
      {/* Methodology AI Chatbot */}
      <MethodologyChat />
      
      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};