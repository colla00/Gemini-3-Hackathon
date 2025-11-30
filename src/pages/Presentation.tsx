import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BarChart3, GitBranch, Bell, Settings, 
  RefreshCw, Clock, Building2, User, ChevronDown, Search, Filter,
  Activity, Zap, Home, ShieldAlert, Lock, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardOverview } from '@/components/quality/DashboardOverview';
import { PatientListView } from '@/components/quality/PatientListView';
import { ShapExplainability } from '@/components/quality/ShapExplainability';
import { ClinicalWorkflowView } from '@/components/quality/ClinicalWorkflowView';
import { ResearchBanner } from '@/components/quality/ResearchBanner';
import { DemoControls } from '@/components/quality/DemoControls';
import { PrintView } from '@/components/quality/PrintView';
import { GuidedTour, TourButton } from '@/components/quality/GuidedTour';
import { ScreenProtection } from '@/components/quality/ScreenProtection';
import { useAutoDemo, type ViewType } from '@/hooks/useAutoDemo';
import { useLiveSimulation } from '@/hooks/useLiveSimulation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNarration } from '@/hooks/useNarration';
import { useGuidedTour } from '@/hooks/useGuidedTour';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { logoutDemo } from '@/components/quality/PasswordGate';

const navItems: { id: ViewType; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: 'dashboard', label: 'Overview', shortLabel: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'patients', label: 'Patient Worklist', shortLabel: 'Worklist', icon: <Users className="w-4 h-4" /> },
  { id: 'shap', label: 'Risk Attribution', shortLabel: 'SHAP', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'workflow', label: 'Workflow Demo', shortLabel: 'Workflow', icon: <GitBranch className="w-4 h-4" /> },
];

export const Presentation = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const [screenProtectionEnabled, setScreenProtectionEnabled] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { logFeatureUse, logInteraction } = useSessionTracking();

  // Get stored email on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('demo_auth_email');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  // Guided tour - auto-start disabled for presentation mode
  const guidedTour = useGuidedTour(false);

  // Narration hook
  const narration = useNarration();

  // Handle view change with narration and logging
  const handleViewChange = useCallback((view: ViewType) => {
    setActiveView(view);
    logFeatureUse(`Presentation View: ${navItems.find(n => n.id === view)?.label || view}`);
    
    if (soundEnabled) {
      narration.soundEffects.playTransition();
    }
    
    if (narrationEnabled) {
      narration.narrateView(view);
    }
  }, [soundEnabled, narrationEnabled, narration, logFeatureUse]);

  // Auto-demo functionality
  const autoDemo = useAutoDemo(handleViewChange);

  // Live simulation
  const liveSimulation = useLiveSimulation(true, 5000);

  // Print handler
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Toggle handlers
  const handleToggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const handleToggleNarration = useCallback(() => {
    setNarrationEnabled(prev => {
      const newValue = !prev;
      if (!newValue) {
        narration.stop();
      }
      return newValue;
    });
  }, [narration]);

  // Handle live toggle with logging
  const handleToggleLive = useCallback(() => {
    logInteraction(liveSimulation.isActive ? 'Paused live updates' : 'Enabled live updates');
    liveSimulation.toggle();
  }, [liveSimulation, logInteraction]);

  // Enhanced demo toggle with sound and logging
  const handleToggleDemo = useCallback(() => {
    if (!autoDemo.isRunning) {
      logInteraction('Started auto-demo');
      if (soundEnabled) {
        narration.soundEffects.playStart();
      }
      if (narrationEnabled) {
        setTimeout(() => narration.narrateView(activeView), 500);
      }
    } else {
      logInteraction('Stopped auto-demo');
      if (soundEnabled) {
        narration.soundEffects.playStop();
      }
      narration.stop();
    }
    autoDemo.toggleDemo();
  }, [autoDemo, soundEnabled, narrationEnabled, narration, activeView, logInteraction]);

  // Handle tour start with logging
  const handleStartTour = useCallback(() => {
    logFeatureUse('Guided Tour');
    guidedTour.startTour();
  }, [guidedTour, logFeatureUse]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onViewChange: handleViewChange,
    onToggleDemo: handleToggleDemo,
    onNextView: autoDemo.nextView,
    onPrevView: autoDemo.prevView,
    onToggleLive: handleToggleLive,
    onPrint: handlePrint,
  });

  // Update time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load voices on mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

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
      default:
        return <DashboardOverview liveSimulation={liveSimulation} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" data-protected="true">
      {/* Screen Protection */}
      <ScreenProtection enabled={screenProtectionEnabled} />

      {/* Guided Tour Overlay */}
      <GuidedTour
        isActive={guidedTour.isActive}
        currentStep={guidedTour.currentStep}
        currentStepIndex={guidedTour.currentStepIndex}
        totalSteps={guidedTour.totalSteps}
        isFirstStep={guidedTour.isFirstStep}
        isLastStep={guidedTour.isLastStep}
        targetRect={guidedTour.targetRect}
        onNext={guidedTour.nextStep}
        onPrev={guidedTour.prevStep}
        onEnd={guidedTour.endTour}
        onGoToStep={guidedTour.goToStep}
      />

      {/* Print View (hidden on screen) */}
      <PrintView ref={printRef} viewType={activeView} />

      {/* Presentation Mode Banner */}
      <div className="bg-primary py-1.5 px-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-foreground">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Presentation Mode</span>
            <span className="text-primary-foreground/60 text-xs">• Full demo features enabled</span>
          </div>
          <Link 
            to="/dashboard"
            className="text-xs text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            Exit to Dashboard →
          </Link>
        </div>
      </div>
      
      {/* Research Banner */}
      <ResearchBanner />

      {/* Main Header Bar */}
      <header className="px-4 py-2 border-b border-border/40 bg-secondary/50 print:hidden" data-tour="header">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Navigation + App Title */}
          <div className="flex items-center gap-4">
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
            <div 
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-secondary border border-border/50 cursor-pointer hover:bg-secondary/80 transition-colors"
              data-tour="unit-selector"
            >
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
                "hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border transition-all",
                liveSimulation.isActive 
                  ? "bg-risk-low/10 border-risk-low/30" 
                  : "bg-secondary border-border/50"
              )}
              data-tour="live-status"
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

            {/* Auto-Demo Indicator */}
            {autoDemo.isRunning && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-primary/10 border border-primary/30 animate-pulse">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-medium text-primary uppercase">Auto-Demo</span>
              </div>
            )}

            {/* Narration Indicator */}
            {narration.isNarrating && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-risk-low/10 border border-risk-low/30">
                <div className="flex items-end gap-0.5 h-3">
                  <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '40%' }} />
                  <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '70%', animationDelay: '150ms' }} />
                  <div className="w-0.5 bg-risk-low rounded-full animate-pulse" style={{ height: '100%', animationDelay: '300ms' }} />
                </div>
                <span className="text-[10px] font-medium text-risk-low uppercase">Speaking</span>
              </div>
            )}

            {/* Time & Shift */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentTime}</span>
              <span className="text-primary font-medium">• Night Shift</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              <TourButton onClick={handleStartTour} />
              
              <button 
                onClick={() => liveSimulation.updateSimulation()}
                className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={cn("w-4 h-4", liveSimulation.isActive && "animate-spin")} style={{ animationDuration: '3s' }} />
              </button>
              <button 
                onClick={() => setScreenProtectionEnabled(prev => !prev)}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  screenProtectionEnabled 
                    ? "bg-primary/20 text-primary" 
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
                title={screenProtectionEnabled ? "Disable screen protection" : "Enable screen protection"}
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-risk-high" />
              </button>
              <button className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* User */}
            <div className="flex items-center gap-2 pl-3 border-l border-border/50">
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="hidden md:block text-xs font-medium text-foreground max-w-[120px] truncate" title={userEmail || 'Demo User'}>
                {userEmail || 'Demo User'}
              </span>
              <button
                onClick={() => {
                  logInteraction('Logged out of demo');
                  logoutDemo();
                }}
                className="p-1.5 rounded hover:bg-risk-high/20 text-muted-foreground hover:text-risk-high transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="px-4 py-2 border-b border-border/30 bg-background/50 print:hidden" data-tour="nav-tabs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all relative",
                  activeView === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
                <kbd className="hidden lg:inline-block ml-1 px-1 py-0.5 rounded bg-black/20 text-[9px] font-mono opacity-50">
                  {index + 1}
                </kbd>
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
            {liveSimulation.isActive && (
              <div className="text-[9px] text-muted-foreground">
                Updates: {liveSimulation.updateCount}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto pb-24 print:pb-0" data-tour="quick-stats">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {renderView()}
        </div>
      </main>

      {/* Demo Controls */}
      <div data-tour="demo-controls">
        <DemoControls
          isRunning={autoDemo.isRunning}
          progress={autoDemo.progress}
          currentIndex={autoDemo.currentIndex}
          totalViews={autoDemo.totalViews}
          intervalMs={autoDemo.intervalMs}
          liveUpdatesActive={liveSimulation.isActive}
          isNarrating={narration.isNarrating}
          isNarrationLoading={narration.isLoading}
          soundEnabled={soundEnabled}
          narrationEnabled={narrationEnabled}
          selectedVoice={narration.selectedVoice}
          onToggleDemo={handleToggleDemo}
          onNext={autoDemo.nextView}
          onPrev={autoDemo.prevView}
          onToggleLive={handleToggleLive}
          onPrint={handlePrint}
          onSpeedChange={autoDemo.setSpeed}
          onToggleSound={handleToggleSound}
          onToggleNarration={handleToggleNarration}
          onVoiceChange={narration.setSelectedVoice}
          onResetTour={() => {
            logFeatureUse('Reset Guided Tour');
            guidedTour.resetTourHistory();
            guidedTour.startTour();
          }}
        />
      </div>

      {/* Footer Status Bar - Lower z-index to stay behind controls */}
      <footer 
        className="fixed bottom-0 left-0 right-0 z-30 py-1.5 px-4 bg-secondary/60 backdrop-blur-sm border-t border-border/20 print:hidden"
        data-tour="disclaimer"
      >
        <div className="flex items-center justify-between text-[9px] text-muted-foreground/70">
          <div className="flex items-center gap-2">
            <span className="text-primary/70 font-medium">⚠️ Research Prototype</span>
            <span className="hidden sm:inline text-border/50">|</span>
            <span className="hidden sm:inline opacity-60">Synthetic Data</span>
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <Lock className="w-2.5 h-2.5" />
            <span className="font-medium">Patent Pending</span>
            <span className="text-border/50">|</span>
            <span>Stanford AI+HEALTH 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
};