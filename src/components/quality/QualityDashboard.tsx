import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Users, BarChart3, GitBranch, Bell, Settings, 
  RefreshCw, Clock, Building2, User, ChevronDown, Search, Filter,
  Activity, Zap, HelpCircle, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardOverview } from './DashboardOverview';
import { PatientListView } from './PatientListView';
import { ShapExplainability } from './ShapExplainability';
import { ClinicalWorkflowView } from './ClinicalWorkflowView';
import { ResearchBanner } from './ResearchBanner';
import { DemoControls } from './DemoControls';
import { PrintView } from './PrintView';
import { GuidedTour, TourButton } from './GuidedTour';
import { ScreenProtection } from './ScreenProtection';
import { useAutoDemo, type ViewType } from '@/hooks/useAutoDemo';
import { useLiveSimulation } from '@/hooks/useLiveSimulation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNarration } from '@/hooks/useNarration';
import { useGuidedTour } from '@/hooks/useGuidedTour';

const navItems: { id: ViewType; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: 'dashboard', label: 'Overview', shortLabel: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'patients', label: 'Patient Worklist', shortLabel: 'Worklist', icon: <Users className="w-4 h-4" /> },
  { id: 'shap', label: 'Risk Attribution', shortLabel: 'SHAP', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'workflow', label: 'Workflow Demo', shortLabel: 'Workflow', icon: <GitBranch className="w-4 h-4" /> },
];

export const QualityDashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Guided tour
  const guidedTour = useGuidedTour();

  // Narration hook
  const narration = useNarration();

  // Handle view change with narration
  const handleViewChange = useCallback((view: ViewType) => {
    setActiveView(view);
    
    // Play transition sound
    if (soundEnabled) {
      narration.soundEffects.playTransition();
    }
    
    // Narrate if enabled
    if (narrationEnabled) {
      narration.narrateView(view);
    }
  }, [soundEnabled, narrationEnabled, narration]);

  // Auto-demo functionality with narration integration
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

  // Enhanced demo toggle with sound
  const handleToggleDemo = useCallback(() => {
    if (!autoDemo.isRunning) {
      if (soundEnabled) {
        narration.soundEffects.playStart();
      }
      // Narrate the first view when starting
      if (narrationEnabled) {
        setTimeout(() => narration.narrateView(activeView), 500);
      }
    } else {
      if (soundEnabled) {
        narration.soundEffects.playStop();
      }
      narration.stop();
    }
    autoDemo.toggleDemo();
  }, [autoDemo, soundEnabled, narrationEnabled, narration, activeView]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onViewChange: handleViewChange,
    onToggleDemo: handleToggleDemo,
    onNextView: autoDemo.nextView,
    onPrevView: autoDemo.prevView,
    onToggleLive: liveSimulation.toggle,
    onPrint: handlePrint,
  });

  // Update time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load voices on mount (needed for speech synthesis)
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
      {/* Screen Protection - Always enabled */}
      <ScreenProtection enabled={true} />

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

      {/* Cyan Header Stripe */}
      <div className="h-1.5 bg-primary w-full print:hidden" />
      
      {/* Research Banner - Compact */}
      <ResearchBanner />

      {/* Main Header Bar - EHR Style */}
      <header className="px-4 py-2 border-b border-border/40 bg-secondary/50 print:hidden" data-tour="header">
        <div className="flex items-center justify-between gap-4">
          {/* Left: App Title & Unit */}
          <div className="flex items-center gap-4">
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
              {/* Tour Button */}
              <TourButton onClick={guidedTour.startTour} />
              
              <button 
                onClick={() => liveSimulation.updateSimulation()}
                className="p-1.5 rounded hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={cn("w-4 h-4", liveSimulation.isActive && "animate-spin")} style={{ animationDuration: '3s' }} />
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
              <span className="hidden md:block text-xs font-medium text-foreground">RN Demo</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Compact */}
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
                {/* Keyboard hint */}
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
      <main className="flex-1 p-4 overflow-auto pb-24 print:pb-0">
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
          soundEnabled={soundEnabled}
          narrationEnabled={narrationEnabled}
          onToggleDemo={handleToggleDemo}
          onNext={autoDemo.nextView}
          onPrev={autoDemo.prevView}
          onToggleLive={liveSimulation.toggle}
          onPrint={handlePrint}
          onSpeedChange={autoDemo.setSpeed}
          onToggleSound={handleToggleSound}
          onToggleNarration={handleToggleNarration}
          onResetTour={() => {
            guidedTour.resetTourHistory();
            guidedTour.startTour();
          }}
        />
      </div>

      {/* Footer Status Bar */}
      <footer 
        className="fixed bottom-0 left-0 right-0 z-50 py-2 px-4 bg-secondary/95 backdrop-blur-sm border-t border-border/30 print:hidden"
        data-tour="disclaimer"
      >
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="text-primary font-semibold">⚠️ Research Prototype</span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="hidden sm:inline">No EHR Connection</span>
            <span className="hidden md:inline text-border">|</span>
            <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
              <User className="w-3 h-3 text-amber-500" />
              <span className="text-amber-500 font-semibold uppercase tracking-wide">Human-in-the-Loop Required</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="mailto:alexis.collier@ung.edu" 
              className="hidden sm:inline hover:text-primary transition-colors"
            >
              alexis.collier@ung.edu
            </a>
            <span className="hidden sm:inline text-border">|</span>
            <span>Stanford AI+HEALTH 2025</span>
            <span className="text-primary font-medium">v0.1.0-demo</span>
          </div>
        </div>
      </footer>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
};
