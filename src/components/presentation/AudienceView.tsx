import { useState, useEffect } from 'react';
import { BarChart3, Lock, Award, Activity, Radio, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardOverview } from '@/components/quality/DashboardOverview';
import { PatientListView } from '@/components/quality/PatientListView';
import { ShapExplainability } from '@/components/quality/ShapExplainability';
import { ClinicalWorkflowView } from '@/components/quality/ClinicalWorkflowView';
import { EHRDataFlowSlide } from '@/components/quality/EHRDataFlowSlide';
import { AlertTimelineSlide } from '@/components/quality/AlertTimelineSlide';
import { ComparisonSlide } from '@/components/quality/ComparisonSlide';
import { PatientJourneySlide } from '@/components/quality/PatientJourneySlide';
import { ROICalculatorSlide } from '@/components/quality/ROICalculatorSlide';
import { MLFeaturesSlide } from '@/components/quality/MLFeaturesSlide';
import { VideoDemoSlide } from '@/components/quality/VideoDemoSlide';
import { ResearchValidationSlide } from '@/components/quality/ResearchValidationSlide';
import { ResearchBanner } from '@/components/quality/ResearchBanner';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';
import { NeuralReasoningEngine } from '@/components/dashboard/NeuralReasoningEngine';
import { CognitiveLoadOptimizer } from '@/components/dashboard/CognitiveLoadOptimizer';
import { TrustScoreAlgorithm } from '@/components/dashboard/TrustScoreAlgorithm';
import { PerformanceComparisonTable } from '@/components/dashboard/PerformanceComparisonTable';
import { TrustBasedAlertSystem } from '@/components/dashboard/TrustBasedAlertSystem';
import { EquityMonitoringEngine } from '@/components/dashboard/EquityMonitoringEngine';
import { DBSCalculationBreakdown } from '@/components/dashboard/DBSCalculationBreakdown';
import { PatentValidationCharts } from '@/components/dashboard/PatentValidationCharts';
import { PatentPortfolioSlide } from '@/components/presentation/PatentPortfolioSlide';
import { 
  PresentationSlideView, 
  PRESENTATION_SLIDES, 
  type SlideType 
} from '@/components/presentation/PresentationSlide';
import { useLiveSimulation } from '@/hooks/useLiveSimulation';
import { usePresenterSync } from '@/hooks/usePresenterSync';

// Map slide types to view types - must match all slides
const slideToView: Record<string, string | null> = {
  'disclaimer': null,
  'title': null,
  'agenda': null,
  'video-demo': 'video-demo',
  'problem': null,
  'comparison': 'comparison',
  'methodology': null,
  'ml-features': 'ml-features',
  'ehr-flow': 'ehr-flow',
  'alert-timeline': 'alert-timeline',
  'dashboard': 'dashboard',
  'patients': 'patients',
  'patient-journey': 'patient-journey',
  'shap': 'shap',
  'workflow': 'workflow',
  'validation': null,
  'research-validation': 'research-validation',
  'roi': 'roi',
  'future': null,
  'conclusion': null,
  // Patent portfolio slide
  'patent-portfolio': 'patent-portfolio',
  // Core patent slides
  'patent-trust-alerts': 'patent-trust-alerts',
  'patent-equity': 'patent-equity',
  'patent-dbs-breakdown': 'patent-dbs-breakdown',
  'patent-validation-charts': 'patent-validation-charts',
  // ChartMinder patent slides
  'patent-neural-reasoning': 'patent-neural-reasoning',
  'patent-cognitive-load': 'patent-cognitive-load',
  'patent-trust-score': 'patent-trust-score',
  'patent-performance': 'patent-performance',
};

export const AudienceView = () => {
  const { syncState, connectionStatus } = usePresenterSync(false);
  const liveSimulation = useLiveSimulation(syncState.isLive, 5000);
  const [lastSyncTime, setLastSyncTime] = useState<string>('--');
  const [isStale, setIsStale] = useState(false);
  
  const currentSlide = syncState.currentSlide as SlideType;
  const currentSlideConfig = PRESENTATION_SLIDES.find(s => s.id === currentSlide);
  const currentIndex = PRESENTATION_SLIDES.findIndex(s => s.id === currentSlide);
  const isDashboardSlide = slideToView[currentSlide] !== null;

  // Track connection status based on sync updates
  useEffect(() => {
    const now = new Date();
    setLastSyncTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setIsStale(false);
    
    // If no updates for 15 seconds, show stale warning
    const timeout = setTimeout(() => {
      setIsStale(true);
    }, 15000);
    
    return () => clearTimeout(timeout);
  }, [syncState.timestamp]);

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
      case 'video-demo':
        return <VideoDemoSlide />;
      case 'comparison':
        return <ComparisonSlide />;
      case 'ml-features':
        return <MLFeaturesSlide />;
      case 'ehr-flow':
        return <EHRDataFlowSlide />;
      case 'alert-timeline':
        return <AlertTimelineSlide />;
      case 'patient-journey':
        return <PatientJourneySlide />;
      case 'roi':
        return <ROICalculatorSlide />;
      case 'research-validation':
        return <ResearchValidationSlide />;
      // Patent portfolio slide
      case 'patent-portfolio':
        return <PatentPortfolioSlide />;
      // Core patent slides
      case 'patent-trust-alerts':
        return <TrustBasedAlertSystem />;
      case 'patent-equity':
        return <EquityMonitoringEngine />;
      case 'patent-dbs-breakdown':
        return <DBSCalculationBreakdown />;
      case 'patent-validation-charts':
        return <PatentValidationCharts />;
      // ChartMinder patent slides
      case 'patent-neural-reasoning':
        return <NeuralReasoningEngine />;
      case 'patent-cognitive-load':
        return <CognitiveLoadOptimizer />;
      case 'patent-trust-score':
        return <TrustScoreAlgorithm />;
      case 'patent-performance':
        return <PerformanceComparisonTable />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Research Disclaimer */}
      <ResearchDisclaimer />

      {/* Clean header - no controls */}
      <div className="bg-primary py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary-foreground/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-primary-foreground">NSO Quality Dashboard</h1>
              <p className="text-[10px] text-primary-foreground/70">AI-Powered Nurse-Sensitive Outcome Prediction</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {syncState.isLive && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary-foreground/10">
                <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
                <span className="text-[10px] font-medium text-primary-foreground">LIVE</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sync Status Indicator */}
      <div className="bg-secondary/80 border-b border-border/30 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            {connectionStatus === 'connected' && !isStale ? (
              <div className="flex items-center gap-1.5 text-risk-low">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Synced with Presenter</span>
              </div>
            ) : isStale ? (
              <div className="flex items-center gap-1.5 text-amber-500">
                <WifiOff className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Waiting for updates...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Connecting...</span>
              </div>
            )}
            <span className="text-[10px] text-muted-foreground">
              Last sync: {lastSyncTime}
            </span>
          </div>

          {/* Slide Progress */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">
                Slide {currentIndex + 1} of {PRESENTATION_SLIDES.length}
              </span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[200px]">
              {currentSlideConfig?.title}
            </span>
          </div>

          {/* Elapsed Time */}
          {syncState.elapsedMinutes > 0 && (
            <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">{syncState.elapsedMinutes}m elapsed</span>
            </div>
          )}
        </div>
      </div>

      {/* Research Banner for dashboard slides */}
      {isDashboardSlide && <ResearchBanner />}

      {/* Main Content - Full screen, no distractions */}
      <main className="flex-1 overflow-auto">
        {isDashboardSlide ? (
          <div className="p-4 max-w-7xl mx-auto">
            {renderDashboardContent()}
          </div>
        ) : currentSlideConfig ? (
          <PresentationSlideView
            slide={currentSlideConfig}
            isActive={true}
            isAudience={true}
          />
        ) : null}
      </main>

      {/* Minimal footer */}
      <footer className="py-2 px-4 bg-secondary/60 border-t border-border/20">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-primary font-medium">⚠️ Research Prototype</span>
            <span className="text-border">|</span>
            <span>Synthetic Data Only</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-3 h-3 text-primary" />
            <span className="font-medium">Patent Pending</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
