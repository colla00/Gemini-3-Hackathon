import React, { useState, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BarChart3, GitBranch, Settings, 
  RefreshCw, Clock, Building2, User, ChevronDown, Search, Filter,
  Activity, Home, Presentation, Lock, Target, Database, TrendingDown,
  Monitor, FileText, DollarSign, Sparkles, Briefcase, FlaskConical, MoreHorizontal, Play, HeartPulse
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DashboardOverview } from '@/components/quality/DashboardOverview';
import { PatentFeaturesView } from '@/components/quality/PatentFeaturesView';
import { PatientListView } from '@/components/quality/PatientListView';
import { ShapExplainability } from '@/components/quality/ShapExplainability';
import { ClinicalWorkflowView } from '@/components/quality/ClinicalWorkflowView';
import { ValidationMetricsDashboard } from '@/components/quality/ValidationMetricsDashboard';
import { EHRIntegrationDiagram } from '@/components/quality/EHRIntegrationDiagram';
import { OutcomeComparisonPanel } from '@/components/quality/OutcomeComparisonPanel';
import { MethodologyChat } from '@/components/quality/MethodologyChat';
import { WalkthroughAccessButton } from '@/components/dashboard/WalkthroughAccessButton';
import { DBSCalculator } from '@/components/dashboard/DBSCalculator';
import { ROICalculator } from '@/components/dashboard/ROICalculator';
import { InvestorModePanel } from '@/components/dashboard/InvestorModePanel';
import { AIToolsPanel } from '@/components/dashboard/AIToolsPanel';
import { ICUMortalityPrediction } from '@/components/dashboard/ICUMortalityPrediction';
import { useLiveSimulation } from '@/hooks/useLiveSimulation';
import { InvestorMetricsProvider } from '@/hooks/useInvestorMetrics';
import { ScreenProtection } from '@/components/quality/ScreenProtection';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';
import { NotificationsDropdown } from '@/components/dashboard/NotificationsDropdown';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';
import { SkipLink } from '@/components/SkipLink';
import { PerformanceMonitoringDashboard } from '@/components/performance/PerformanceMonitoringDashboard';
import { toast } from 'sonner';

type ViewType = 'dashboard' | 'patients' | 'shap' | 'workflow' | 'validation' | 'integration' | 'outcomes' | 'dbs' | 'roi' | 'patent' | 'ai-tools' | 'icu-mortality';

// Primary tabs always visible
const primaryNavItems: { id: ViewType; label: string; icon: React.ReactNode; isCalculator?: boolean }[] = [
  { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> },
  { id: 'icu-mortality', label: 'ICU Mortality', icon: <HeartPulse className="w-4 h-4" aria-hidden="true" /> },
  { id: 'patients', label: 'Patient Worklist', icon: <Users className="w-4 h-4" aria-hidden="true" /> },
  { id: 'shap', label: 'Risk Attribution', icon: <BarChart3 className="w-4 h-4" aria-hidden="true" /> },
  { id: 'workflow', label: 'Workflow Demo', icon: <GitBranch className="w-4 h-4" aria-hidden="true" /> },
  { id: 'outcomes', label: 'Clinical Outcomes', icon: <TrendingDown className="w-4 h-4" aria-hidden="true" /> },
];

// Calculator tabs with special styling
const calculatorNavItems: { id: ViewType; label: string; icon: React.ReactNode; isCalculator: boolean }[] = [
  { id: 'dbs', label: 'DBS Calculator', icon: <FileText className="w-4 h-4" aria-hidden="true" />, isCalculator: true },
  { id: 'roi', label: 'ROI Calculator', icon: <DollarSign className="w-4 h-4" aria-hidden="true" />, isCalculator: true },
  { id: 'ai-tools', label: 'AI Tools', icon: <Sparkles className="w-4 h-4" aria-hidden="true" />, isCalculator: true },
];

// Secondary tabs - now displayed inline
const secondaryNavItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'patent', label: 'Patent Features', icon: <FlaskConical className="w-4 h-4" aria-hidden="true" /> },
  { id: 'validation', label: 'Model Validation', icon: <Target className="w-4 h-4" aria-hidden="true" /> },
  { id: 'integration', label: 'EHR Integration', icon: <Database className="w-4 h-4" aria-hidden="true" /> },
];

export const Dashboard = () => {
  const [searchParams] = useSearchParams();

  const initialTabParam = searchParams.get('tab');
  const initialView: ViewType = (
    initialTabParam &&
    ([
      'dashboard',
      'icu-mortality',
      'patients',
      'shap',
      'workflow',
      'validation',
      'integration',
      'outcomes',
      'dbs',
      'roi',
      'patent',
      'ai-tools',
    ] as const).includes(initialTabParam as ViewType)
      ? (initialTabParam as ViewType)
      : 'dashboard'
  );

  const [activeView, setActiveView] = useState<ViewType>(initialView);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  const [showSettings, setShowSettings] = useState(false);
  const [investorMode, setInvestorMode] = useState(false);
  const { logFeatureUse, logInteraction } = useSessionTracking();

  // Keep view in sync if someone navigates to a new ?tab= value while staying on /dashboard
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (!tabParam) return;

    const validTabs: ViewType[] = [
      'dashboard',
      'icu-mortality',
      'patients',
      'shap',
      'workflow',
      'validation',
      'integration',
      'outcomes',
      'dbs',
      'roi',
      'patent',
      'ai-tools',
    ];

    if (validTabs.includes(tabParam as ViewType) && tabParam !== activeView) {
      setActiveView(tabParam as ViewType);
    }
  }, [activeView, searchParams]);
  
  // Session timeout for HIPAA compliance (30 min timeout, 5 min warning)
  const { showWarning, remainingTime, extendSession, formatTime } = useSessionTimeout({
    timeoutMinutes: 30,
    warningMinutes: 5,
    enabled: true,
  });
  
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
    const allItems = [...primaryNavItems, ...calculatorNavItems, ...secondaryNavItems];
    logFeatureUse(`View: ${allItems.find(n => n.id === view)?.label || view}`);
  }, [logFeatureUse]);

  // Handle live toggle with logging
  const handleLiveToggle = useCallback(() => {
    liveSimulation.toggle();
    logInteraction(liveSimulation.isActive ? 'Paused live updates' : 'Enabled live updates');
  }, [liveSimulation, logInteraction]);

  // Handle investor mode toggle
  const handleInvestorModeToggle = useCallback(() => {
    setInvestorMode(prev => {
      const newValue = !prev;
      logInteraction(newValue ? 'Enabled investor mode' : 'Disabled investor mode');
      return newValue;
    });
  }, [logInteraction]);

  // Navigate to calculator from investor panel
  const handleNavigateToCalculator = useCallback((calc: 'dbs' | 'roi') => {
    setActiveView(calc);
    logFeatureUse(`Investor Mode: Navigate to ${calc.toUpperCase()} Calculator`);
  }, [logFeatureUse]);

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
      case 'dbs':
        return <DBSCalculator />;
      case 'roi':
        return <ROICalculator />;
      case 'ai-tools':
        return <AIToolsPanel />;
      case 'icu-mortality':
        return <ICUMortalityPrediction />;
      case 'patent':
        return <PatentFeaturesView />;
      default:
        return <DashboardOverview liveSimulation={liveSimulation} />;
    }
  };

  return (
    <InvestorMetricsProvider>
    <div className="min-h-screen flex flex-col bg-background" data-protected="true">
      {/* Skip Link for Keyboard Navigation - WCAG 2.1 AA */}
      <SkipLink targets={[{ id: 'dashboard-main', label: 'Skip to main content' }]} />
      
      {/* Screen Protection */}
      <ScreenProtection enabled={true} />

      {/* Research Prototype Disclaimer */}
      <ResearchDisclaimer />

      {/* Enterprise Medical Header */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary w-full" aria-hidden="true" />

      {/* Main Header Bar - VitaSignal Branded */}
      <header className="px-6 py-3 border-b border-border bg-card/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
          {/* Left: Logo + App Title */}
          <div className="flex items-center gap-5">
            {/* Back to Home */}
            <Link 
              to="/"
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to Home"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-sm" aria-hidden="true">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground leading-tight tracking-tight">
                  VitaSignal
                </h1>
                <p className="text-[11px] text-muted-foreground font-medium tracking-wide">
                  Clinical Intelligence Dashboard
                </p>
              </div>
            </div>
            
            {/* Unit Selector */}
            <button 
              className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-lg bg-secondary border border-border hover:border-primary/30 transition-all"
              aria-label="Select unit: Unit 4C - Med/Surg"
              aria-haspopup="listbox"
            >
              <Building2 className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">Unit 4C - Med/Surg</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>

          {/* Center: Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="patient-search" className="sr-only">Search patients, MRN, or room number</label>
              <input 
                id="patient-search"
                type="search" 
                placeholder="Search patients, MRN, room..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-secondary border border-border/50 rounded focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground placeholder:text-muted-foreground transition-colors"
              />
            </div>
          </div>

          {/* Right: Status & Actions */}
          <div className="flex items-center gap-3">
            {/* Live Status */}
            <button 
              className={cn(
                "hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border transition-all",
                liveSimulation.isActive 
                  ? "bg-risk-low/10 border-risk-low/30" 
                  : "bg-secondary border-border/50"
              )}
              onClick={handleLiveToggle}
              aria-pressed={liveSimulation.isActive}
              aria-label={liveSimulation.isActive ? "Live updates enabled. Click to pause." : "Live updates paused. Click to resume."}
            >
              {liveSimulation.isActive ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" aria-hidden="true" />
                  <span className="text-[10px] font-medium text-risk-low uppercase">Live</span>
                  <Activity className="w-3 h-3 text-risk-low" aria-hidden="true" />
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" aria-hidden="true" />
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">Paused</span>
                </>
              )}
            </button>

            {/* Investor Mode Toggle */}
            <button 
              className={cn(
                "hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border transition-all",
                investorMode 
                  ? "bg-chart-1/15 border-chart-1/40 shadow-sm" 
                  : "bg-secondary border-border/50 hover:border-chart-1/30"
              )}
              onClick={handleInvestorModeToggle}
              aria-pressed={investorMode}
              aria-label={investorMode ? "Investor mode enabled. Click to disable." : "Enable investor mode for financial metrics."}
            >
              <Briefcase className={cn("w-3.5 h-3.5", investorMode ? "text-chart-1" : "text-muted-foreground")} aria-hidden="true" />
              <span className={cn("text-[10px] font-medium uppercase", investorMode ? "text-chart-1" : "text-muted-foreground")}>
                Investor
              </span>
              {investorMode && (
                <span className="w-1.5 h-1.5 rounded-full bg-chart-1 animate-pulse" aria-hidden="true" />
              )}
            </button>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label={`Current time: ${currentTime}, ${new Date().getHours() >= 7 && new Date().getHours() < 19 ? 'Day Shift' : 'Night Shift'}`}>
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{currentTime}</span>
              <span className="text-primary font-medium" aria-hidden="true">•</span>
              <span className="text-primary font-medium">
                {new Date().getHours() >= 7 && new Date().getHours() < 19 ? 'Day Shift' : 'Night Shift'}
              </span>
            </div>

            {/* Quick Actions - Cleaned up, no overlaps */}
            <div className="flex items-center gap-0.5" role="toolbar" aria-label="Quick actions">
              {/* Walkthrough Access Button - shows based on approval status */}
              <WalkthroughAccessButton />
              
              {/* Self-Paced Walkthrough - Available to all users */}
              <Link
                to="/presentation"
                className="flex items-center gap-1.5 px-2 py-1 rounded border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                aria-label="Start self-paced walkthrough"
                title="Self-Paced Walkthrough"
              >
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="text-[10px] font-medium hidden sm:inline">Self-Paced</span>
              </Link>
              
              {/* Presenter Dashboard - Admin only */}
              <Link
                to="/presentation?mode=presenter"
                className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-risk-low transition-colors"
                aria-label="Open Presenter Dashboard for dual-screen Zoom presentation"
                title="Presenter Dashboard (Admin)"
              >
                <Monitor className="w-4 h-4" aria-hidden="true" />
              </Link>
              <button 
                onClick={() => liveSimulation.updateSimulation()}
                className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Refresh data"
              >
                <RefreshCw className={cn("w-4 h-4", liveSimulation.isActive && "animate-spin")} style={{ animationDuration: '3s' }} aria-hidden="true" />
              </button>
              <NotificationsDropdown />
              <KeyboardShortcutsHelp />
              <button 
                onClick={() => setShowSettings(true)}
                className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open settings"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* User */}
            <div className="flex items-center gap-2 pl-3 border-l border-border/50">
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center" aria-hidden="true">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="hidden md:block text-xs font-medium text-foreground">
                Demo User
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Investor Mode Panel */}
      <InvestorModePanel 
        isActive={investorMode} 
        onNavigateToCalculator={handleNavigateToCalculator} 
      />

      {/* Navigation Tabs - VitaSignal Enterprise */}
      <nav className="px-6 py-2.5 border-b border-border bg-card/50 backdrop-blur-sm overflow-x-auto scrollbar-hide" aria-label="Dashboard views">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="View options">
            {/* Primary Navigation Tabs */}
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                role="tab"
                aria-selected={activeView === item.id}
                aria-controls={`${item.id}-panel`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                  activeView === item.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* Separator */}
            <div className="w-px h-6 bg-border mx-2" aria-hidden="true" />

            {/* Calculator Tabs - Enterprise Investment Focus */}
            {calculatorNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                role="tab"
                aria-selected={activeView === item.id}
                aria-controls={`${item.id}-panel`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap relative",
                  activeView === item.id
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md"
                    : "bg-primary/5 text-primary hover:bg-primary/10 border border-primary/20"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'ai-tools' && !activeView.includes(item.id) && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent animate-pulse border-2 border-background" aria-hidden="true" />
                )}
              </button>
            ))}

            {/* Separator */}
            <div className="w-px h-6 bg-border mx-2" aria-hidden="true" />

            {/* More Dropdown for Secondary Navigation */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap",
                    secondaryNavItems.some(item => item.id === activeView)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                  aria-label="More navigation options"
                >
                  <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                  <span>More</span>
                  <ChevronDown className="w-3 h-3" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-popover border border-border shadow-lg z-50">
                {secondaryNavItems.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => handleViewChange(item.id)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer",
                      activeView === item.id && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quick Filters - Professional styling */}
          <div className="hidden lg:flex items-center gap-3 ml-4 shrink-0">
            <button 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-transparent hover:border-border"
              aria-label="Open filters"
            >
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span>Filters</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20" role="status" aria-live="polite">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" aria-hidden="true" />
              <span className="text-xs font-semibold text-destructive">3 Critical</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Professional spacing */}
      <main id="dashboard-main" className="flex-1 p-6 overflow-auto pb-20" role="tabpanel" aria-label={`${[...primaryNavItems, ...calculatorNavItems, ...secondaryNavItems].find(n => n.id === activeView)?.label || 'Dashboard'} view`}>
        <div className="max-w-7xl mx-auto animate-fade-in">
          {renderView()}
        </div>
      </main>

      {/* VitaSignal Footer Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 py-2.5 px-6 bg-card/98 backdrop-blur-md border-t border-border shadow-sm" role="contentinfo">
        <div className="flex items-center justify-between text-xs text-muted-foreground max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-medium text-foreground">VitaSignal</span>
            <span className="hidden sm:inline text-muted-foreground">Synthetic Demo Data</span>
            <span className="hidden md:inline text-border/50" aria-hidden="true">|</span>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-warning/10 border border-warning/20">
              <User className="w-3.5 h-3.5 text-warning" aria-hidden="true" />
              <span className="text-warning font-semibold text-[11px]">Human-in-the-Loop Required</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>5 Patents Filed</span>
            </div>
            <span className="text-border/50" aria-hidden="true">|</span>
            <Link to="/patents" className="text-primary hover:underline font-medium">Patent Portfolio</Link>
          </div>
        </div>
      </footer>

      {/* Settings Panel */}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      
      {/* Session Timeout Warning - HIPAA Compliance */}
      <SessionTimeoutWarning
        open={showWarning}
        remainingTime={remainingTime}
        formatTime={formatTime}
        onExtend={extendSession}
      />
      
      {/* Methodology AI Chatbot */}
      <MethodologyChat />
      
      {/* Performance Monitoring Dashboard */}
      <PerformanceMonitoringDashboard />
    </div>
    </InvestorMetricsProvider>
  );
};