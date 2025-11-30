import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Info, X, ChevronRight, Lightbulb, Target, Zap } from 'lucide-react';
import type { ViewType } from '@/hooks/useAutoDemo';

interface Hotspot {
  id: string;
  view: ViewType;
  position: { top: string; left: string };
  title: string;
  description: string;
  academicNote?: string;
  icon: React.ReactNode;
  pulse?: boolean;
}

const hotspots: Hotspot[] = [
  // Dashboard hotspots
  {
    id: 'risk-cards',
    view: 'dashboard',
    position: { top: '15%', left: '20%' },
    title: 'NSO Risk Categories',
    description: 'Real-time aggregated risk metrics for falls, HAPI, and CAUTI across the unit.',
    academicNote: 'Based on validated risk assessment tools (Morse Fall Scale, Braden Scale, CAUTI Bundle Compliance) enhanced with ML predictions.',
    icon: <Target className="w-3 h-3" />,
    pulse: true,
  },
  {
    id: 'priority-queue',
    view: 'dashboard',
    position: { top: '25%', left: '75%' },
    title: 'AI Priority Queue',
    description: 'Patients automatically ranked by composite risk score requiring immediate nursing attention.',
    academicNote: 'Ranking algorithm considers risk severity, trend velocity, and time-to-last-assessment.',
    icon: <Zap className="w-3 h-3" />,
  },
  // Patients hotspots
  {
    id: 'risk-sparkline',
    view: 'patients',
    position: { top: '40%', left: '70%' },
    title: '24-Hour Trend Analysis',
    description: 'Micro-visualization showing risk trajectory over the past 24 hours.',
    academicNote: 'Sparklines enable rapid visual pattern recognition for deteriorating patients.',
    icon: <Lightbulb className="w-3 h-3" />,
    pulse: true,
  },
  {
    id: 'confidence-indicator',
    view: 'patients',
    position: { top: '35%', left: '55%' },
    title: 'Model Confidence',
    description: 'Indicates how certain the AI model is about the risk prediction.',
    academicNote: 'Calibrated confidence intervals help nurses prioritize which predictions to trust most.',
    icon: <Info className="w-3 h-3" />,
  },
  // SHAP hotspots
  {
    id: 'shap-bars',
    view: 'shap',
    position: { top: '45%', left: '45%' },
    title: 'SHAP Feature Attribution',
    description: 'Each bar shows how individual clinical factors contribute to the final risk score.',
    academicNote: 'SHAP (SHapley Additive exPlanations) provides theoretically grounded, locally accurate explanations based on game theory.',
    icon: <Target className="w-3 h-3" />,
    pulse: true,
  },
  {
    id: 'protective-factors',
    view: 'shap',
    position: { top: '60%', left: '30%' },
    title: 'Protective Factors',
    description: 'Green bars indicate factors that reduce the patient\'s risk score.',
    academicNote: 'Bidirectional attribution helps nurses understand both risk drivers and protective interventions.',
    icon: <Lightbulb className="w-3 h-3" />,
  },
  // Workflow hotspots
  {
    id: 'alert-timeline',
    view: 'workflow',
    position: { top: '30%', left: '25%' },
    title: 'Alert Generation',
    description: 'System detected risk change within 3 minutes of sedation administration.',
    academicNote: 'Real-time EHR integration enables sub-5-minute alert latency for critical risk changes.',
    icon: <Zap className="w-3 h-3" />,
    pulse: true,
  },
  {
    id: 'nurse-response',
    view: 'workflow',
    position: { top: '50%', left: '55%' },
    title: 'Human-in-the-Loop',
    description: 'Nurse assessment and clinical judgment remain central to all interventions.',
    academicNote: 'Our methodology preserves nursing autonomy while augmenting decision-making with AI insights.',
    icon: <Target className="w-3 h-3" />,
  },
];

interface InteractiveHotspotsProps {
  currentView: ViewType;
  enabled?: boolean;
}

export const InteractiveHotspots = ({
  currentView,
  enabled = true,
}: InteractiveHotspotsProps) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  
  if (!enabled) return null;

  const viewHotspots = hotspots.filter(h => h.view === currentView);
  const active = viewHotspots.find(h => h.id === activeHotspot);

  return (
    <>
      {/* Hotspot markers */}
      {viewHotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
          className={cn(
            "fixed z-40 w-6 h-6 rounded-full flex items-center justify-center transition-all",
            "bg-primary/90 text-primary-foreground shadow-lg",
            "hover:scale-110 hover:bg-primary",
            activeHotspot === hotspot.id && "ring-2 ring-primary ring-offset-2 ring-offset-background",
            hotspot.pulse && activeHotspot !== hotspot.id && "animate-pulse"
          )}
          style={{ top: hotspot.position.top, left: hotspot.position.left }}
        >
          {hotspot.icon}
        </button>
      ))}

      {/* Active hotspot detail panel */}
      {active && (
        <div 
          className="fixed z-50 bg-background/95 border border-primary/30 rounded-lg p-4 shadow-xl backdrop-blur-sm max-w-sm animate-scale-in"
          style={{ 
            top: `calc(${active.position.top} + 40px)`,
            left: active.position.left,
            transform: 'translateX(-50%)'
          }}
        >
          <button
            onClick={() => setActiveHotspot(null)}
            className="absolute top-2 right-2 p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-start gap-2 mb-2">
            <div className="p-1.5 rounded bg-primary/20 text-primary">
              {active.icon}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{active.title}</h4>
            </div>
          </div>

          <p className="text-xs text-foreground/80 mb-3">{active.description}</p>

          {active.academicNote && (
            <div className="bg-secondary/50 rounded p-2 border-l-2 border-primary">
              <div className="flex items-center gap-1 mb-1">
                <Lightbulb className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-semibold text-primary uppercase">Research Note</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {active.academicNote}
              </p>
            </div>
          )}

          <div className="flex items-center gap-1 mt-3 text-[9px] text-muted-foreground">
            <ChevronRight className="w-3 h-3" />
            <span>Click hotspot again to close</span>
          </div>
        </div>
      )}
    </>
  );
};
