import { useState, useEffect } from 'react';
import { BarChart3, Lock, Award, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardOverview } from '@/components/quality/DashboardOverview';
import { PatientListView } from '@/components/quality/PatientListView';
import { ShapExplainability } from '@/components/quality/ShapExplainability';
import { ClinicalWorkflowView } from '@/components/quality/ClinicalWorkflowView';
import { ResearchBanner } from '@/components/quality/ResearchBanner';
import { 
  PresentationSlideView, 
  PRESENTATION_SLIDES, 
  type SlideType 
} from '@/components/presentation/PresentationSlide';
import { useLiveSimulation } from '@/hooks/useLiveSimulation';
import { usePresenterSync } from '@/hooks/usePresenterSync';

const slideToView: Record<string, string | null> = {
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

export const AudienceView = () => {
  const { syncState } = usePresenterSync(false);
  const liveSimulation = useLiveSimulation(syncState.isLive, 5000);
  
  const currentSlide = syncState.currentSlide as SlideType;
  const currentSlideConfig = PRESENTATION_SLIDES.find(s => s.id === currentSlide);
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
    <div className="min-h-screen flex flex-col bg-background">
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
            <span className="font-medium">U.S. Pat. App. 63/932,953</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
