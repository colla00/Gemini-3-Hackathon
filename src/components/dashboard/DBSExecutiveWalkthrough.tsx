// DBS Executive Walkthrough — Patent #5
// Non-technical, auto-advancing overview for nursing leaders & hospital executives
// Copyright © Dr. Alexis Collier - Patent Pending

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Play, Pause, SkipForward, RotateCcw,
  FileText, AlertTriangle, Brain, BarChart3,
  DollarSign, CheckCircle2, Users, Building2,
  Clock, TrendingDown, Sparkles, ArrowRight,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { PatentBadge } from '@/components/quality/PatentNotice';

/* ─── Step definitions ─── */
interface WalkthroughStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  duration: number; // seconds to display before auto-advance
  content: React.ReactNode;
}

const STEP_TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

/* ─── Animated number counter ─── */
const Counter = ({ value, suffix = '', prefix = '', decimals = 0 }: { value: number; suffix?: string; prefix?: string; decimals?: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span>{prefix}{decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString()}{suffix}</span>;
};

/* ─── Metric card used across steps ─── */
const MetricCard = ({ icon: Icon, label, value, detail, color = 'text-primary' }: {
  icon: React.ElementType; label: string; value: string; detail: string; color?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-card border border-border/50 rounded-xl p-4 text-center"
  >
    <Icon className={cn('w-5 h-5 mx-auto mb-2', color)} />
    <p className={cn('text-2xl font-bold', color)}>{value}</p>
    <p className="text-xs font-semibold text-foreground mt-1">{label}</p>
    <p className="text-[10px] text-muted-foreground mt-0.5">{detail}</p>
  </motion.div>
);

/* ─── Step content builders ─── */
const StepProblem = () => (
  <div className="space-y-5">
    <p className="text-sm text-muted-foreground leading-relaxed">
      Nurses spend up to <span className="font-bold text-foreground">50% of their shift</span> on documentation instead of patient care. 
      This creates burnout, turnover, and safety risks — yet <span className="font-bold text-foreground">no standard measure</span> exists 
      to quantify or predict documentation burden.
    </p>
    <div className="grid grid-cols-3 gap-3">
      <MetricCard icon={Clock} label="Time on Docs" value="50%" detail="Per nursing shift" color="text-destructive" />
      <MetricCard icon={TrendingDown} label="Bedside Time" value="−40%" detail="Decade decline" color="text-warning" />
      <MetricCard icon={Users} label="RN Burnout" value="58%" detail="2024 national rate" color="text-risk-medium" />
    </div>
    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
      <p className="text-xs text-destructive font-medium flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        When nurses document more, patients receive less direct care — leading to increased adverse events.
      </p>
    </div>
  </div>
);

const StepSolution = () => (
  <div className="space-y-5">
    <p className="text-sm text-muted-foreground leading-relaxed">
      The <span className="font-bold text-foreground">Documentation Burden Score (DBS)</span> is an AI-powered metric that 
      predicts how much documentation work each patient will generate — <span className="font-bold text-foreground">before the shift starts</span>.
    </p>
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">How It Works</p>
          <p className="text-xs text-muted-foreground">Three simple steps</p>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { step: '1', title: 'Patient data flows in', desc: 'Illness severity, medications, and care complexity are automatically pulled from the EHR.' },
          { step: '2', title: 'AI calculates the score', desc: 'Our validated model predicts the documentation burden for each patient on a 0–100 scale.' },
          { step: '3', title: 'Staffing adjusts proactively', desc: 'Charge nurses see which patients will generate the most paperwork and staff accordingly.' },
        ].map((item) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Number(item.step) * 0.2 }}
            className="flex items-start gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {item.step}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const StepValidation = () => (
  <div className="space-y-5">
    <p className="text-sm text-muted-foreground leading-relaxed">
      DBS was validated on <span className="font-bold text-foreground">321,719 real ICU patients</span> across 
      <span className="font-bold text-foreground"> 208 hospitals</span> using two of the largest critical care databases in the world.
    </p>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <Badge variant="outline" className="mb-2 text-[10px]">Internal Validation</Badge>
        <p className="text-3xl font-bold text-primary"><Counter value={0.802} decimals={3} /></p>
        <p className="text-xs font-semibold text-foreground">AUROC</p>
        <p className="text-[10px] text-muted-foreground mt-1">MIMIC-IV · 24,689 patients</p>
      </div>
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <Badge variant="outline" className="mb-2 text-[10px]">External Validation</Badge>
        <p className="text-3xl font-bold text-chart-3"><Counter value={0.857} decimals={3} /></p>
        <p className="text-xs font-semibold text-foreground">AUROC</p>
        <p className="text-[10px] text-muted-foreground mt-1">eICU · 297,030 patients · 208 hospitals</p>
      </div>
    </div>
    {/* Sensitivity / Specificity */}
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Internal (MIMIC-IV)</p>
        <p className="text-xs text-muted-foreground">Sensitivity: <span className="font-semibold text-foreground">0.714</span> <span className="text-[10px]">[0.695–0.733]</span></p>
        <p className="text-xs text-muted-foreground">Specificity: <span className="font-semibold text-foreground">0.732</span> <span className="text-[10px]">[0.718–0.746]</span></p>
      </div>
      <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">External (eICU)</p>
        <p className="text-xs text-muted-foreground">Sensitivity: <span className="font-semibold text-foreground">0.768</span> <span className="text-[10px]">[0.762–0.774]</span></p>
        <p className="text-xs text-muted-foreground">Specificity: <span className="font-semibold text-foreground">0.785</span> <span className="text-[10px]">[0.781–0.789]</span></p>
      </div>
    </div>
    <div className="bg-risk-low/5 border border-risk-low/20 rounded-lg p-3">
      <p className="text-xs text-risk-low font-medium flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
        Accepted for presentation at ANIA 2026 — Boston, MA — March 26–28, 2026
      </p>
    </div>
  </div>
);

const StepExample = () => {
  const scenarios = [
    { name: 'Post-Surgical', score: 22, quartile: 'Low', staffing: '1 nurse : 2 patients', color: 'text-risk-low', bg: 'bg-risk-low' },
    { name: 'Cardiac ICU', score: 52, quartile: 'High', staffing: '1 nurse : 1 patient + support', color: 'text-risk-medium', bg: 'bg-risk-medium' },
    { name: 'Sepsis Severe', score: 81, quartile: 'Very High', staffing: '1 nurse : 1 patient + senior RN', color: 'text-risk-high', bg: 'bg-risk-high' },
  ];
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Before a shift starts, the charge nurse sees each patient's predicted documentation burden and adjusts staffing in advance.
      </p>
      <div className="space-y-3">
        {scenarios.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.25 }}
            className="flex items-center gap-4 bg-card border border-border/50 rounded-xl p-4"
          >
            <div className="shrink-0 w-16 text-center">
              <p className={cn('text-2xl font-bold', s.color)}>{s.score}</p>
              <p className="text-[10px] text-muted-foreground">DBS</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{s.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn('text-[10px]', s.bg, 'text-white')}>{s.quartile}</Badge>
                <span className="text-xs text-muted-foreground">{s.staffing}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', s.bg)}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.score}%` }}
                  transition={{ delay: i * 0.25 + 0.3, duration: 0.6 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const StepImpact = () => (
  <div className="space-y-5">
    <p className="text-sm text-muted-foreground leading-relaxed">
      By predicting documentation burden before it happens, hospitals can reduce nurse burnout, 
      cut overtime costs, and improve patient safety — with measurable ROI.
    </p>
    <div className="grid grid-cols-2 gap-3">
      <MetricCard icon={DollarSign} label="Annual Savings" value="$2.1M" detail="200-bed hospital estimate" color="text-chart-3" />
      <MetricCard icon={TrendingDown} label="Burnout Reduction" value="35%" detail="Projected improvement" color="text-risk-low" />
      <MetricCard icon={Clock} label="Time Reclaimed" value="90 min" detail="Per nurse per shift" color="text-primary" />
      <MetricCard icon={BarChart3} label="5-Year ROI" value="1,240%" detail="7.5-month payback" color="text-chart-4" />
    </div>
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
      <Sparkles className="w-5 h-5 text-primary shrink-0" />
      <div>
        <p className="text-xs font-semibold text-foreground">Ready for Pilot</p>
        <p className="text-[10px] text-muted-foreground">Contact us to discuss implementation at your facility.</p>
      </div>
    </div>
  </div>
);

/* ─── Steps config ─── */
const steps: WalkthroughStep[] = [
  {
    id: 'problem',
    title: 'The Problem',
    subtitle: 'Nurses are drowning in documentation',
    icon: AlertTriangle,
    iconColor: 'text-destructive',
    iconBg: 'bg-destructive/10 border-destructive/20',
    duration: 8,
    content: <StepProblem />,
  },
  {
    id: 'solution',
    title: 'The Solution',
    subtitle: 'Predict burden before it happens',
    icon: Brain,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10 border-primary/20',
    duration: 10,
    content: <StepSolution />,
  },
  {
    id: 'validation',
    title: 'Clinically Validated',
    subtitle: '321K+ patients across 208 hospitals',
    icon: CheckCircle2,
    iconColor: 'text-risk-low',
    iconBg: 'bg-risk-low/10 border-risk-low/20',
    duration: 8,
    content: <StepValidation />,
  },
  {
    id: 'example',
    title: 'Real-World Example',
    subtitle: 'How a charge nurse uses DBS',
    icon: Users,
    iconColor: 'text-chart-3',
    iconBg: 'bg-chart-3/10 border-chart-3/20',
    duration: 10,
    content: <StepExample />,
  },
  {
    id: 'impact',
    title: 'Bottom-Line Impact',
    subtitle: 'ROI for your hospital',
    icon: DollarSign,
    iconColor: 'text-chart-4',
    iconBg: 'bg-chart-4/10 border-chart-4/20',
    duration: 8,
    content: <StepImpact />,
  },
];

const TOTAL_DURATION = steps.reduce((sum, s) => sum + s.duration, 0);

/* ─── Main component ─── */
export function DBSExecutiveWalkthrough({ className }: { className?: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds within current step
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = steps[currentStep];

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 0.1);
    }, 100);
  }, [clearTimer]);

  // Auto-advance logic
  useEffect(() => {
    if (!playing) {
      clearTimer();
      return;
    }
    startTimer();
    return clearTimer;
  }, [playing, currentStep, startTimer, clearTimer]);

  useEffect(() => {
    if (elapsed >= step.duration && playing) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((s) => s + 1);
        setElapsed(0);
      } else {
        setPlaying(false);
        clearTimer();
      }
    }
  }, [elapsed, step.duration, playing, currentStep, clearTimer]);

  const goTo = (idx: number) => {
    setCurrentStep(idx);
    setElapsed(0);
  };

  const restart = () => {
    setCurrentStep(0);
    setElapsed(0);
    setPlaying(true);
  };

  const progressPercent = Math.min((elapsed / step.duration) * 100, 100);

  return (
    <Card className={cn('border-border/40', className)}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border/30">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-3/10 border border-chart-3/20">
                <FileText className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">DBS System Overview</h3>
                <p className="text-xs text-muted-foreground">3-minute executive walkthrough · Patent #5</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PatentBadge contextPatent="dbs" />
              <Badge variant="outline" className="text-[10px]">
                ~{TOTAL_DURATION}s total
              </Badge>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              variant={playing ? 'default' : 'outline'}
              onClick={() => setPlaying(!playing)}
              className={cn("h-8 gap-1.5 text-xs", !playing && "animate-[tab-flash-glow_2s_ease-in-out_infinite] border-dashed border-primary")}
            >
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {playing ? 'Pause' : 'Play'}
            </Button>
            {currentStep > 0 && (
              <Button size="sm" variant="ghost" onClick={() => goTo(currentStep - 1)} className="h-8 w-8 p-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => goTo(currentStep + 1)}
                className="h-8 gap-1 text-xs"
              >
                Skip <SkipForward className="w-3.5 h-3.5" />
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button size="sm" variant="ghost" onClick={restart} className="h-8 gap-1 text-xs">
                <RotateCcw className="w-3.5 h-3.5" /> Restart
              </Button>
            )}
            <span className="ml-auto text-[10px] text-muted-foreground font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Step progress bar */}
          <div className="flex gap-1 mt-3">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted cursor-pointer transition-all hover:opacity-80"
                title={s.title}
              >
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    i < currentStep ? 'bg-primary w-full' : i === currentStep ? 'bg-primary' : 'w-0'
                  )}
                  style={i === currentStep ? { width: `${progressPercent}%`, transition: 'width 100ms linear' } : undefined}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="p-5 min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={STEP_TRANSITION}
            >
              {/* Step header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={cn('p-2 rounded-lg border', step.iconBg)}>
                  <step.icon className={cn('w-5 h-5', step.iconColor)} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                </div>
              </div>

              {step.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation hint */}
        <div className="px-5 py-3 border-t border-border/30 bg-muted/20 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            Use ← → arrow keys, or click the progress bar to jump between steps
          </p>
          {currentStep < steps.length - 1 && (
            <button
              onClick={() => goTo(currentStep + 1)}
              className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
            >
              Next: {steps[currentStep + 1].title} <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
