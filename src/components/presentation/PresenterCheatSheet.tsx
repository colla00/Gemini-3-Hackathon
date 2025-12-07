import { useState } from 'react';
import { 
  BookOpen, X, ChevronRight, Clock, MousePointer, Keyboard,
  Lightbulb, AlertTriangle, Award, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TalkingPoint {
  slide: string;
  duration: string;
  keyPoints: string[];
  demoAction?: string;
  patentRef?: string;
}

const talkingPoints: TalkingPoint[] = [
  {
    slide: 'Title',
    duration: '1m',
    keyPoints: [
      'Introduce yourself and affiliation',
      'Patent-pending technology disclosure',
      'Thank committee for the opportunity',
    ],
  },
  {
    slide: 'Agenda',
    duration: '1m',
    keyPoints: [
      'Preview the 4 live demo tabs',
      'Emphasize this is working prototype, not slides',
    ],
  },
  {
    slide: 'Problem',
    duration: '5m',
    keyPoints: [
      '60-99% false positive rates in current alert systems',
      'Alert fatigue leads to missed deterioration',
      'Black-box AI = clinician distrust',
      'No closed-loop feedback in existing systems',
    ],
  },
  {
    slide: 'Methodology',
    duration: '4m',
    keyPoints: [
      'XGBoost + SHAP for explainability',
      'Multi-outcome prediction (Falls, HAPI, CAUTI)',
      'Real-time data integration',
    ],
    patentRef: 'Claims 1-4',
  },
  {
    slide: 'Dashboard (Tab 1)',
    duration: '6m',
    keyPoints: [
      'Point out "Adaptive Thresholds" badge - hover for tooltip',
      'Show confidence indicators on each risk card',
      'Demonstrate priority queue ranking',
      'Click "Live" toggle to show real-time updates',
    ],
    demoAction: 'Hover over "Adaptive Thresholds" badge',
    patentRef: 'Claim 6',
  },
  {
    slide: 'Patients (Tab 2)',
    duration: '6m',
    keyPoints: [
      'Click any patient row for detail expansion',
      'Show multi-outcome view (Falls, HAPI, CAUTI together)',
      'Point out confidence percentages',
      'Explain the worklist prioritization',
    ],
    demoAction: 'Click patient row to expand',
  },
  {
    slide: 'SHAP (Tab 3)',
    duration: '8m',
    keyPoints: [
      'THIS IS THE KEY DIFFERENTIATOR',
      'Explain waterfall chart: base risk + factors',
      'Red bars increase risk, green decrease',
      'Cumulative column shows running total',
      'Point out patent-pending badge',
    ],
    demoAction: 'Change patient dropdown to show different attribution',
    patentRef: 'Claims 4, 8',
  },
  {
    slide: 'Workflow (Tab 4)',
    duration: '8m',
    keyPoints: [
      'Timeline shows real-world clinical scenario',
      'Scroll to "Closed-Loop Feedback" section',
      'CLICK "Demo Loop" BUTTON - wait 7 seconds',
      'Explain: detect → capture → delay → recalculate → quantify',
      'This is our KEY PATENT INNOVATION',
    ],
    demoAction: 'Click "Demo Loop" button and narrate the steps',
    patentRef: 'Claim 7 (KEY)',
  },
  {
    slide: 'Validation',
    duration: '3m',
    keyPoints: [
      'AUC-ROC: 0.891',
      '40-70% false positive reduction',
      'N=45,000 training, N=2,847 validation',
    ],
  },
  {
    slide: 'Future',
    duration: '2m',
    keyPoints: [
      'Multi-hospital deployment',
      'Additional outcome types',
      'Continuous learning from intervention outcomes',
    ],
  },
  {
    slide: 'Conclusion',
    duration: '1m',
    keyPoints: [
      'Recap: Explainable + Adaptive + Closed-Loop',
      'Thank the committee',
      'Open for questions',
    ],
  },
];

const keyboardShortcuts = [
  { key: '←/→', action: 'Previous/Next slide' },
  { key: '1-4', action: 'Jump to dashboard tabs' },
  { key: 'D', action: 'Toggle auto-demo' },
  { key: 'L', action: 'Toggle live updates' },
  { key: 'P', action: 'Print view' },
  { key: 'Space', action: 'Practice mode' },
];

export const PresenterCheatSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-24 right-4 z-50 gap-2 bg-background/90 backdrop-blur-sm print:hidden"
      >
        <BookOpen className="w-4 h-4" />
        Cheat Sheet
      </Button>
    );
  }

  const currentPoint = talkingPoints[activeSlide];

  return (
    <div className="fixed inset-y-4 right-4 w-80 z-50 bg-background/95 backdrop-blur-md border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden print:hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Presenter Cheat Sheet</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded hover:bg-secondary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Selector */}
      <div className="p-2 border-b border-border overflow-x-auto">
        <div className="flex gap-1">
          {talkingPoints.map((point, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={cn(
                "px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap transition-colors",
                activeSlide === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              )}
            >
              {point.slide}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Current Slide Info */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">{currentPoint.slide}</h3>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {currentPoint.duration}
            </span>
          </div>

          {currentPoint.patentRef && (
            <div className="flex items-center gap-1 mb-3 px-2 py-1 rounded bg-accent/10 border border-accent/30 w-fit">
              <Award className="w-3 h-3 text-accent" />
              <span className="text-[10px] text-accent font-medium">{currentPoint.patentRef}</span>
            </div>
          )}
        </div>

        {/* Key Points */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Key Talking Points
          </span>
          {currentPoint.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className={cn(
                "text-foreground",
                point.includes('KEY') || point.includes('DIFFERENTIATOR') ? "font-bold text-primary" : ""
              )}>
                {point}
              </span>
            </div>
          ))}
        </div>

        {/* Demo Action */}
        {currentPoint.demoAction && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-2 mb-1">
              <MousePointer className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Demo Action</span>
            </div>
            <p className="text-sm text-foreground">{currentPoint.demoAction}</p>
          </div>
        )}

        {/* Navigation Hint */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <button
            onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
            disabled={activeSlide === 0}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            ← Previous
          </button>
          <span className="text-[10px] text-muted-foreground">
            {activeSlide + 1} / {talkingPoints.length}
          </span>
          <button
            onClick={() => setActiveSlide(Math.min(talkingPoints.length - 1, activeSlide + 1))}
            disabled={activeSlide === talkingPoints.length - 1}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-3 border-t border-border bg-secondary/30">
        <div className="flex items-center gap-2 mb-2">
          <Keyboard className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Shortcuts
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          {keyboardShortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                {shortcut.key}
              </kbd>
              <span className="text-muted-foreground">{shortcut.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reminders */}
      <div className="p-3 border-t border-border bg-warning/10">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div className="text-[10px] text-warning">
            <strong>Remember:</strong> This is SYNTHETIC DATA. Say "research prototype" and "patent-pending" at start.
          </div>
        </div>
      </div>
    </div>
  );
};
