import { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, CheckCircle2, Activity, 
  TrendingDown, AlertTriangle, Award, ArrowRight,
  Syringe, Eye, BarChart3, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ClosedLoopAnimationProps {
  className?: string;
  autoPlay?: boolean;
}

interface LoopStep {
  id: string;
  label: string;
  description: string;
  icon: typeof Activity;
  color: string;
  duration: number; // ms
}

const loopSteps: LoopStep[] = [
  {
    id: 'detect',
    label: 'Risk Detected',
    description: 'AI identifies elevated risk score',
    icon: AlertTriangle,
    color: 'text-risk-high bg-risk-high/10 border-risk-high/30',
    duration: 1500,
  },
  {
    id: 'intervene',
    label: 'Intervention Applied',
    description: 'Nurse executes recommended action',
    icon: Syringe,
    color: 'text-primary bg-primary/10 border-primary/30',
    duration: 2000,
  },
  {
    id: 'monitor',
    label: 'Continuous Monitoring',
    description: 'System tracks post-intervention metrics',
    icon: Eye,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    duration: 2000,
  },
  {
    id: 'measure',
    label: 'Outcome Measured',
    description: 'Risk score recalculated with new data',
    icon: BarChart3,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    duration: 1500,
  },
  {
    id: 'quantify',
    label: 'Efficacy Quantified',
    description: 'Before/after comparison recorded',
    icon: TrendingDown,
    color: 'text-risk-low bg-risk-low/10 border-risk-low/30',
    duration: 2000,
  },
];

export const ClosedLoopAnimation = ({ className, autoPlay = false }: ClosedLoopAnimationProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [riskScore, setRiskScore] = useState(78);
  const [cycleCount, setCycleCount] = useState(0);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const step = loopSteps[currentStep];
    const timer = setTimeout(() => {
      // Update risk score based on step
      if (currentStep === 0) {
        setRiskScore(78);
      } else if (currentStep === 4) {
        setRiskScore(prev => Math.max(25, prev - 15 - Math.random() * 10));
      }

      // Mark step as completed
      setCompletedSteps(prev => [...prev, currentStep]);

      // Move to next step or reset
      if (currentStep < loopSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Complete cycle
        setTimeout(() => {
          setCycleCount(prev => prev + 1);
          setCurrentStep(0);
          setCompletedSteps([]);
          setRiskScore(78);
        }, 1500);
      }
    }, step.duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setCompletedSteps([]);
    setRiskScore(78);
    setCycleCount(0);
  };

  const togglePlay = () => {
    if (!isPlaying && currentStep === loopSteps.length - 1) {
      reset();
    }
    setIsPlaying(!isPlaying);
  };

  // Convert numeric to qualitative signals
  const getRiskSignal = (score: number) => score >= 70 ? 'Elevated' : score >= 40 ? 'Moderate' : 'Low';
  const getEffectLabel = (reduction: number) => reduction >= 30 ? 'Strong' : reduction >= 15 ? 'Moderate' : 'Mild';
  const currentSignal = getRiskSignal(riskScore);
  const effectLabel = getEffectLabel(78 - Math.round(riskScore));

  return (
    <TooltipProvider>
      <div className={cn("bg-card rounded-xl border border-border/50 p-5 shadow-card", className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Closed-Loop Feedback
            </h3>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-accent/10 border border-accent/30">
                <Award className="w-3 h-3 text-accent" />
                <span className="text-[9px] text-accent font-medium">Claim #4</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Intervention Efficacy Tracking (U.S. Patent Filed)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Circular Flow Diagram */}
        <div className="relative mb-6">
          {/* Center metrics */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center p-4 rounded-full bg-background border-2 border-border shadow-lg">
              <div className={cn(
                "text-2xl font-extrabold transition-all duration-500",
                riskScore >= 70 ? "text-risk-high" : riskScore >= 40 ? "text-risk-medium" : "text-risk-low"
              )}>
                {currentSignal}
              </div>
              <div className="text-[10px] text-muted-foreground">Risk Signal</div>
              {riskScore < 78 && (
                <div className="flex items-center justify-center gap-1 mt-1 text-risk-low">
                  <TrendingDown className="w-3 h-3" />
                  <span className="text-xs font-bold">{effectLabel} Effect</span>
                </div>
              )}
            </div>
          </div>

          {/* Circular steps */}
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" viewBox="0 0 300 200">
              {/* Connection lines */}
              {loopSteps.map((_, idx) => {
                const angle1 = (idx / loopSteps.length) * 2 * Math.PI - Math.PI / 2;
                const angle2 = ((idx + 1) / loopSteps.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 80;
                const cx = 150;
                const cy = 100;
                
                const x1 = cx + radius * Math.cos(angle1);
                const y1 = cy + radius * Math.sin(angle1);
                const x2 = cx + radius * Math.cos(angle2);
                const y2 = cy + radius * Math.sin(angle2);
                
                const isActive = completedSteps.includes(idx) || currentStep === idx;
                
                return (
                  <path
                    key={idx}
                    d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                    fill="none"
                    stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth={isActive ? 3 : 2}
                    strokeDasharray={isActive ? "none" : "4 4"}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Step nodes positioned around circle */}
            {loopSteps.map((step, idx) => {
              const angle = (idx / loopSteps.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 42; // percentage from center
              const left = 50 + radius * Math.cos(angle);
              const top = 50 + radius * Math.sin(angle);
              
              const isActive = currentStep === idx;
              const isCompleted = completedSteps.includes(idx);
              const StepIcon = step.icon;
              
              return (
                <Tooltip key={step.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                        "p-2 rounded-full border-2 shadow-md",
                        isActive && "scale-125 ring-4 ring-primary/30",
                        isCompleted && !isActive && "opacity-70",
                        step.color
                      )}
                      style={{ left: `${left}%`, top: `${top}%` }}
                    >
                      {isCompleted && !isActive ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <StepIcon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold text-xs">{step.label}</p>
                    <p className="text-[10px] text-muted-foreground">{step.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Step Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            {loopSteps.map((step, idx) => {
              const isActive = currentStep === idx;
              const isCompleted = completedSteps.includes(idx);
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={cn(
                    "w-full h-1 rounded-full transition-all duration-300",
                    isCompleted ? "bg-risk-low" : isActive ? "bg-primary" : "bg-secondary"
                  )} />
                  <span className={cn(
                    "text-[9px] mt-1 text-center",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  )}>
                    {step.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Detail */}
        <div className={cn(
          "p-3 rounded-lg border mb-4 transition-all duration-300",
          loopSteps[currentStep].color
        )}>
          <div className="flex items-center gap-3">
            {(() => {
              const StepIcon = loopSteps[currentStep].icon;
              return <StepIcon className="w-5 h-5 flex-shrink-0" />;
            })()}
            <div>
              <p className="text-sm font-semibold">{loopSteps[currentStep].label}</p>
              <p className="text-xs opacity-80">{loopSteps[currentStep].description}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlay}
              className="gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  {currentStep > 0 ? 'Resume' : 'Start Demo'}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>
          
          {cycleCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-risk-low/10 border border-risk-low/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-risk-low" />
              <span className="text-xs font-semibold text-risk-low">
                {cycleCount} cycle{cycleCount > 1 ? 's' : ''} completed
              </span>
            </div>
          )}
        </div>

        {/* Efficacy Summary */}
        {completedSteps.length === loopSteps.length && (
          <div className="mt-4 p-4 rounded-lg bg-risk-low/10 border border-risk-low/30 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-risk-low" />
                <div>
                  <p className="text-sm font-semibold text-risk-low">Intervention Effective</p>
                  <p className="text-xs text-muted-foreground">Closed-loop verification complete</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-risk-low">{effectLabel}</div>
                <div className="text-[10px] text-muted-foreground">Risk Reduction</div>
              </div>
            </div>
          </div>
        )}

        <p className="text-[9px] text-muted-foreground mt-4 text-center italic">
          Automated intervention → outcome tracking • U.S. Patent Filed
        </p>
      </div>
    </TooltipProvider>
  );
};