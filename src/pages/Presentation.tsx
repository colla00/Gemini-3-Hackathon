import { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BarChart3, GitBranch, Bell, Settings, 
  RefreshCw, Clock, Building2, User, ChevronDown, Search, Filter,
  Activity, Zap, Home, ShieldAlert, Lock, GraduationCap, 
  MousePointer, ChevronLeft, ChevronRight, FileText, Share2, Timer, Award, Monitor
} from 'lucide-react';
import { AIAssistant } from '@/components/engagement/AIAssistant';
import { AudienceQuestions } from '@/components/engagement/AudienceQuestions';
import { LivePolls } from '@/components/engagement/LivePolls';
import { FeedbackPanel } from '@/components/engagement/FeedbackPanel';
import { HandoffReport } from '@/components/reports/HandoffReport';
import { SessionJoinModal } from '@/components/engagement/SessionJoinModal';
import { usePresentationSession } from '@/hooks/usePresentationSession';
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
import { InteractiveHotspots } from '@/components/quality/InteractiveHotspots';
import { PatentNotice, PatentBadge } from '@/components/quality/PatentNotice';
import { ZoomModeProvider, ZoomModeToggle, useZoomMode } from '@/components/quality/ZoomModeToggle';
import { PresentationTimeline45 } from '@/components/presentation/PresentationTimeline45';
import { PresenterNotesPanel } from '@/components/presentation/PresenterNotesPanel';
import { PracticeMode } from '@/components/presentation/PracticeMode';
import { PresenterCheatSheet } from '@/components/presentation/PresenterCheatSheet';
import { PresenterDashboard } from '@/components/presentation/PresenterDashboard';
import { AudienceView } from '@/components/presentation/AudienceView';
import { 
  PresentationSlideView, 
  PRESENTATION_SLIDES, 
  type SlideType,
  TOTAL_PRESENTATION_TIME 
} from '@/components/presentation/PresentationSlide';
import { useAutoDemo, type ViewType } from '@/hooks/useAutoDemo';
import { useLiveSimulation } from '@/hooks/useLiveSimulation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNarration } from '@/hooks/useNarration';
import { useGuidedTour } from '@/hooks/useGuidedTour';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { Button } from '@/components/ui/button';

// Map slide types to view types for dashboard content
const slideToView: Record<string, ViewType | null> = {
  'title': null,
  'agenda': null,
  'problem': null,
  'methodology': null,
  'dashboard': 'dashboard',
  'patients': 'patients',
  'shap': 'shap',
  'workflow': 'workflow',
  'validation': null,
  'future': null,
  'conclusion': null,
};

const PRESENTER_KEY = 'stanford2025';

export const Presentation = () => {
  const [searchParams] = useSearchParams();
  
  // Check for special modes first
  const mode = searchParams.get('mode');
  
  // Presenter Dashboard mode - private view with all controls
  if (mode === 'presenter') {
    return <PresenterDashboard />;
  }
  
  // Audience mode - clean view synced with presenter
  if (mode === 'audience') {
    return <AudienceView />;
  }

  // Default presentation mode (legacy behavior)
  return <DefaultPresentationView searchParams={searchParams} />;
};

// Separated default view to avoid hooks being called conditionally
const DefaultPresentationView = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const [currentSlide, setCurrentSlide] = useState<SlideType>('title');
  const [completedSlides, setCompletedSlides] = useState<SlideType[]>([]);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [presentationStartTime, setPresentationStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const [hotspotsEnabled, setHotspotsEnabled] = useState(true);
  const [showHandoffReport, setShowHandoffReport] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showPracticeMode, setShowPracticeMode] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const { logFeatureUse, logInteraction } = useSessionTracking();
  const { session, createSession, updateSlideProgress } = usePresentationSession();

  // Only show presenter notes if presenter key is provided
  const isPresenterMode = searchParams.get('presenter') === PRESENTER_KEY;
  const [showPresenterNotes, setShowPresenterNotes] = useState(isPresenterMode);

  // Track elapsed time
  useEffect(() => {
    if (!presentationStartTime) return;
    
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - presentationStartTime.getTime()) / 60000);
      setElapsedMinutes(elapsed);
    }, 10000);

    return () => clearInterval(timer);
  }, [presentationStartTime]);

  // Start presentation timer on first slide change
  useEffect(() => {
    if (currentSlide !== 'title' && !presentationStartTime) {
      setPresentationStartTime(new Date());
    }
  }, [currentSlide, presentationStartTime]);

  // Guided tour
  const guidedTour = useGuidedTour(false);

  // Narration hook
  const narration = useNarration();

  // Live simulation for dashboard views
  const liveSimulation = useLiveSimulation(true, 5000);

  // Get current view type for dashboard slides
  const activeView = slideToView[currentSlide] || 'dashboard';

  // Handle slide navigation
  const handleSlideChange = useCallback((slideId: SlideType) => {
    setCompletedSlides(prev => {
      if (!prev.includes(currentSlide)) {
        return [...prev, currentSlide];
      }
      return prev;
    });
    
    setCurrentSlide(slideId);
    logFeatureUse(`Presentation Slide: ${slideId}`);
    
    if (soundEnabled) {
      narration.soundEffects.playTransition();
    }
  }, [currentSlide, soundEnabled, narration, logFeatureUse]);

  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    const currentIndex = PRESENTATION_SLIDES.findIndex(s => s.id === currentSlide);
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < PRESENTATION_SLIDES.length) {
      handleSlideChange(PRESENTATION_SLIDES[newIndex].id);
    }
  }, [currentSlide, handleSlideChange]);

  // Legacy view change for demo controls compatibility
  const handleViewChange = useCallback((view: ViewType) => {
    const slideId = Object.entries(slideToView).find(([_, v]) => v === view)?.[0] as SlideType;
    if (slideId) {
      handleSlideChange(slideId);
    }
  }, [handleSlideChange]);

  // Auto-demo functionality
  const autoDemo = useAutoDemo(handleViewChange);

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

  const handleToggleLive = useCallback(() => {
    logInteraction(liveSimulation.isActive ? 'Paused live updates' : 'Enabled live updates');
    liveSimulation.toggle();
  }, [liveSimulation, logInteraction]);

  const handleToggleDemo = useCallback(() => {
    if (!autoDemo.isRunning) {
      logInteraction('Started auto-demo');
      if (soundEnabled) {
        narration.soundEffects.playStart();
      }
    } else {
      logInteraction('Stopped auto-demo');
      if (soundEnabled) {
        narration.soundEffects.playStop();
      }
      narration.stop();
    }
    autoDemo.toggleDemo();
  }, [autoDemo, soundEnabled, narration, logInteraction]);

  const handleStartTour = useCallback(() => {
    logFeatureUse('Guided Tour');
    guidedTour.startTour();
  }, [guidedTour, logFeatureUse]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onViewChange: handleViewChange,
    onToggleDemo: handleToggleDemo,
    onNextView: () => handleNavigate('next'),
    onPrevView: () => handleNavigate('prev'),
    onToggleLive: handleToggleLive,
    onTogglePractice: () => setShowPracticeMode(prev => !prev),
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

  const currentSlideConfig = PRESENTATION_SLIDES.find(s => s.id === currentSlide);
  const currentIndex = PRESENTATION_SLIDES.findIndex(s => s.id === currentSlide);
  const isDashboardSlide = slideToView[currentSlide] !== null;

  const renderDashboardContent = () => {
    const view = slideToView[currentSlide];
    if (!view) return null;

    switch (view) {
      case 'dashboard':
        return <DashboardOverview liveSimulation={liveSimulation} />;
      case 'patients':
        return <PatientListView liveSimulation={liveSimulation} />;
      case 'shap':
        return <ShapExplainability />;
      case 'workflow':
        return <ClinicalWorkflowView />;
      default:
        return null;
    }
  };

  return (
    <ZoomModeProvider>
    <div className="min-h-screen flex flex-col bg-background" data-protected="true">
      {/* Screen Protection - Always enabled */}
      <ScreenProtection enabled={true} />

      {/* Presentation Timeline (Left sidebar) */}
      <PresentationTimeline45
        currentSlide={currentSlide}
        onNavigate={handleSlideChange}
        completedSlides={completedSlides}
      />

      {/* Interactive Hotspots - only on dashboard slides */}
      {isDashboardSlide && (
        <InteractiveHotspots
          currentView={activeView}
          enabled={hotspotsEnabled}
        />
      )}

      {/* Practice Mode */}
      <PracticeMode
        currentSlide={currentSlide}
        onNavigate={handleNavigate}
        onGoToSlide={handleSlideChange}
        isVisible={showPracticeMode}
        onClose={() => setShowPracticeMode(false)}
      />

      {/* Presenter Notes Panel - only in presenter mode */}
      {isPresenterMode && showPresenterNotes && (
        <PresenterNotesPanel
          currentSlide={currentSlide}
          elapsedMinutes={elapsedMinutes}
          onNavigate={handleNavigate}
          onGoToSlide={handleSlideChange}
        />
      )}

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
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-medium">45-Minute Presentation</span>
            <span className="text-primary-foreground/60 text-xs">
              • Slide {currentIndex + 1}/{PRESENTATION_SLIDES.length}
            </span>
            {presentationStartTime && (
              <span className="text-primary-foreground/60 text-xs">
                • {elapsedMinutes}m elapsed
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Practice Mode toggle */}
            <button
              onClick={() => setShowPracticeMode(!showPracticeMode)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors",
                showPracticeMode
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/60 hover:text-primary-foreground"
              )}
            >
              <Timer className="w-3 h-3" />
              <span>Practice</span>
            </button>
            {/* Presenter notes toggle - only show if in presenter mode */}
            {isPresenterMode && (
              <button
                onClick={() => setShowPresenterNotes(!showPresenterNotes)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors",
                  showPresenterNotes
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground"
                )}
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Notes</span>
              </button>
            )}
            {/* Hotspots toggle */}
            <button
              onClick={() => setHotspotsEnabled(!hotspotsEnabled)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors",
                hotspotsEnabled
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/60 hover:text-primary-foreground"
              )}
            >
              <MousePointer className="w-3 h-3" />
              <span>Hotspots</span>
            </button>
            {/* Zoom Mode toggle */}
            <ZoomModeToggle />
            <Link 
              to="/dashboard"
              className="text-xs text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Exit →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Research Banner - only for dashboard slides */}
      {isDashboardSlide && <ResearchBanner />}

      {/* Dashboard Header - only for dashboard slides */}
      {isDashboardSlide && (
        <header className="px-4 py-2 border-b border-border/40 bg-secondary/50 print:hidden">
          <div className="flex items-center justify-between gap-4">
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
              
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-secondary border border-border/50">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">Unit 4C - Med/Surg</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Status */}
              <div className={cn(
                "hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border transition-all",
                liveSimulation.isActive 
                  ? "bg-risk-low/10 border-risk-low/30" 
                  : "bg-secondary border-border/50"
              )}>
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

              {/* Time */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentTime}</span>
              </div>

              {/* User */}
              <div className="flex items-center gap-2 pl-3 border-l border-border/50">
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Dashboard Navigation - only for dashboard slides */}
      {isDashboardSlide && (
        <nav className="px-4 py-2 border-b border-border/30 bg-background/50 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {['dashboard', 'patients', 'shap', 'workflow'].map((view) => {
                const isActive = slideToView[currentSlide] === view;
                const label = view === 'dashboard' ? 'Overview' : 
                             view === 'patients' ? 'Worklist' :
                             view === 'shap' ? 'SHAP' : 'Workflow';
                return (
                  <button
                    key={view}
                    onClick={() => {
                      const slideId = Object.entries(slideToView).find(([_, v]) => v === view)?.[0] as SlideType;
                      if (slideId) handleSlideChange(slideId);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {view === 'dashboard' && <LayoutDashboard className="w-4 h-4" />}
                    {view === 'patients' && <Users className="w-4 h-4" />}
                    {view === 'shap' && <BarChart3 className="w-4 h-4" />}
                    {view === 'workflow' && <GitBranch className="w-4 h-4" />}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-risk-high/10 border border-risk-high/30">
                <span className="w-1.5 h-1.5 rounded-full bg-risk-high" />
                <span className="text-[10px] font-medium text-risk-high">3 High Risk</span>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-24 print:pb-0">
        {isDashboardSlide ? (
          <div className="p-4 max-w-7xl mx-auto animate-fade-in">
            {renderDashboardContent()}
          </div>
        ) : (
          <PresentationSlideView
            slide={currentSlideConfig!}
            isActive={true}
          />
        )}
      </main>

      {/* Slide Navigation Controls */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 print:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigate('prev')}
          disabled={currentIndex === 0}
          className="gap-1 bg-background/90 backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        
        <div className="px-3 py-1.5 rounded bg-background/90 backdrop-blur-sm border border-border text-xs">
          <span className="font-medium text-foreground">{currentSlideConfig?.title}</span>
          <span className="text-muted-foreground ml-2">({currentSlideConfig?.duration}m)</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigate('next')}
          disabled={currentIndex === PRESENTATION_SLIDES.length - 1}
          className="gap-1 bg-background/90 backdrop-blur-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 py-1.5 px-4 bg-secondary/60 backdrop-blur-sm border-t border-border/20 print:hidden">
        <div className="flex items-center justify-between text-[9px] text-muted-foreground/70">
          <div className="flex items-center gap-2">
            <span className="text-primary/70 font-medium">⚠️ Research Prototype</span>
            <span className="hidden sm:inline text-border/50">|</span>
            <span className="hidden sm:inline opacity-60">Synthetic Data</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
              <Award className="w-2.5 h-2.5 text-accent" />
              <span className="font-medium text-accent">U.S. Pat. App. 63/932,953</span>
            </div>
            <span className="text-border/50 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Stanford AI+HEALTH 2025</span>
          </div>
        </div>
      </footer>

      {/* Engagement Components */}
      <AIAssistant />
      <AudienceQuestions sessionId={session?.id} currentSlide={currentSlide} isPresenter={isPresenterMode} />
      <LivePolls sessionId={session?.id} isPresenter={isPresenterMode} />
      {!isPresenterMode && <FeedbackPanel sessionId={session?.id} currentSlide={currentSlide} />}
      
      {/* Presenter Cheat Sheet */}
      <PresenterCheatSheet />
      
      {/* Handoff Report Modal */}
      {showHandoffReport && <HandoffReport onClose={() => setShowHandoffReport(false)} />}
      
      {/* Session Modal */}
      <SessionJoinModal 
        isOpen={showSessionModal} 
        onClose={() => setShowSessionModal(false)} 
        isPresenter={isPresenterMode}
      />
    </div>
    </ZoomModeProvider>
  );
};
