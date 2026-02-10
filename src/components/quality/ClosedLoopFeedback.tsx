import { useState, useEffect } from 'react';
import { RefreshCw, TrendingDown, CheckCircle2, Clock, Zap, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
  value?: string;
}

export const ClosedLoopFeedback = () => {
  const [activeDemo, setActiveDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: FeedbackStep[] = [
    { 
      id: 'detect', 
      label: 'Intervention Detected', 
      description: 'Bed alarm activated',
      status: currentStep >= 1 ? 'complete' : currentStep === 0 && activeDemo ? 'active' : 'pending',
      value: '02:34 AM'
    },
    { 
      id: 'capture', 
      label: 'Pre-State Captured', 
      description: 'Risk baseline recorded',
      status: currentStep >= 2 ? 'complete' : currentStep === 1 ? 'active' : 'pending',
      value: '68%'
    },
    { 
      id: 'delay', 
      label: 'Effect Delay', 
      description: 'Waiting for response',
      status: currentStep >= 3 ? 'complete' : currentStep === 2 ? 'active' : 'pending',
      value: '15 min'
    },
    { 
      id: 'recalc', 
      label: 'Risk Recalculated', 
      description: 'Post-intervention score',
      status: currentStep >= 4 ? 'complete' : currentStep === 3 ? 'active' : 'pending',
      value: '42%'
    },
    { 
      id: 'feedback', 
      label: 'Impact Quantified', 
      description: 'Effectiveness measured',
      status: currentStep === 4 ? 'complete' : 'pending',
      value: '-38%'
    },
  ];

  useEffect(() => {
    if (!activeDemo) return;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= 4) {
          setActiveDemo(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [activeDemo]);

  const handleStartDemo = () => {
    setCurrentStep(0);
    setActiveDemo(true);
  };

  return (
    <div className="glass-card rounded-lg p-4 border border-accent/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-accent" />
            Closed-Loop Intervention Feedback
          </h3>
          <p className="text-[10px] text-muted-foreground">Real-time intervention effectiveness tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/10 border border-accent/30">
            <Award className="w-3 h-3 text-accent" />
            <span className="text-[9px] text-accent font-medium">Patent Claim 7</span>
          </div>
          <button
            onClick={handleStartDemo}
            disabled={activeDemo}
            className={cn(
              "px-2 py-1 rounded text-[10px] font-medium transition-all",
              activeDemo
                ? "bg-accent/20 text-accent cursor-not-allowed"
                : "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
          >
            {activeDemo ? 'Running...' : 'Demo Loop'}
          </button>
        </div>
      </div>

      {/* Feedback Loop Visualization */}
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-border/30" />
        
        {/* Steps */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center w-16">
              {/* Step Circle */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 relative z-10",
                step.status === 'complete' && "bg-accent text-accent-foreground",
                step.status === 'active' && "bg-accent/20 border-2 border-accent text-accent animate-pulse",
                step.status === 'pending' && "bg-muted border border-border/50 text-muted-foreground"
              )}>
                {step.status === 'complete' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : step.status === 'active' ? (
                  <Zap className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <span className={cn(
                  "text-[9px] font-medium block",
                  step.status === 'complete' && "text-accent",
                  step.status === 'active' && "text-accent",
                  step.status === 'pending' && "text-muted-foreground"
                )}>
                  {step.label}
                </span>
                <span className="text-[8px] text-muted-foreground block">{step.description}</span>
                {step.value && step.status !== 'pending' && (
                  <span className={cn(
                    "text-xs font-bold mt-0.5 block",
                    step.id === 'feedback' ? "text-risk-low" : "text-foreground"
                  )}>
                    {step.value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 rounded bg-muted/20 border border-border/30">
        <div className="flex items-center justify-between text-[10px]">
          <div>
            <span className="text-muted-foreground">This novel system automatically:</span>
            <ul className="mt-1 space-y-0.5 text-muted-foreground">
              <li>• Detects interventions from clinical data streams</li>
              <li>• Applies intervention-specific effect delays</li>
              <li>• Recalculates risk post-intervention</li>
              <li>• Quantifies effectiveness with before/after comparison</li>
            </ul>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground block mb-1">Demo Result</span>
            {currentStep >= 4 ? (
              <div className="flex items-center gap-1 text-risk-low">
                <TrendingDown className="w-4 h-4" />
                <span className="text-lg font-bold">-38%</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">-</span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 text-[9px] text-center text-accent">
        U.S. Patent Filed
      </p>
    </div>
  );
};
