import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Clock, Dna, ArrowRight, TrendingUp, AlertTriangle, BarChart3, Zap, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { PatentBadge } from '@/components/quality/PatentNotice';

// ── Phenotype Data ──────────────────────────────────────────────────────────
interface Phenotype {
  id: string;
  name: string;
  mortality: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
  prevalence: number;
  docRate: string;
  entropy: string;
}

const PHENOTYPES: Phenotype[] = [
  {
    id: 'steady',
    name: 'Steady Surveillance',
    mortality: 3.2,
    color: 'text-risk-low',
    bgColor: 'bg-risk-low/10',
    borderColor: 'border-risk-low/30',
    icon: <Activity className="w-5 h-5" />,
    description: 'Consistent, predictable documentation rhythm indicating stable clinical management',
    prevalence: 42,
    docRate: '2.1 notes/hr',
    entropy: '0.23 (low)',
  },
  {
    id: 'minimal',
    name: 'Minimal Documentation',
    mortality: 8.7,
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    borderColor: 'border-chart-2/30',
    icon: <Clock className="w-5 h-5" />,
    description: 'Sparse documentation pattern suggesting routine or low-acuity patient care',
    prevalence: 28,
    docRate: '0.8 notes/hr',
    entropy: '0.41 (moderate)',
  },
  {
    id: 'escalating',
    name: 'Escalating Crisis',
    mortality: 15.3,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Accelerating documentation frequency indicating emerging clinical deterioration',
    prevalence: 19,
    docRate: '4.7 notes/hr',
    entropy: '0.62 (high)',
  },
  {
    id: 'chaotic',
    name: 'Chaotic Instability',
    mortality: 24.1,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
    icon: <AlertTriangle className="w-5 h-5" />,
    description: 'Irregular, unpredictable documentation bursts reflecting clinical chaos and instability',
    prevalence: 11,
    docRate: '6.3 notes/hr',
    entropy: '0.89 (very high)',
  },
];

// ── Temporal Features ───────────────────────────────────────────────────────
interface TemporalFeature {
  name: string;
  domain: 'intensity' | 'regularity' | 'pattern';
  importance: number;
  description: string;
}

const TEMPORAL_FEATURES: TemporalFeature[] = [
  { name: 'Notes per hour', domain: 'intensity', importance: 92, description: 'Average documentation frequency across the admission' },
  { name: 'Burst frequency', domain: 'intensity', importance: 87, description: 'Rate of documentation bursts (>3 notes in 30 min)' },
  { name: 'Peak-to-trough ratio', domain: 'intensity', importance: 78, description: 'Ratio of maximum to minimum hourly documentation' },
  { name: 'Night documentation density', domain: 'intensity', importance: 71, description: 'Documentation rate during 0000-0600 hours' },
  { name: 'Escalation velocity', domain: 'intensity', importance: 68, description: 'Rate of change in documentation frequency over time' },
  { name: 'Coefficient of variation', domain: 'regularity', importance: 85, description: 'Variability in documentation intervals' },
  { name: 'Shannon entropy', domain: 'regularity', importance: 83, description: 'Disorder measure of documentation interval distribution' },
  { name: 'Autocorrelation (lag-1)', domain: 'regularity', importance: 74, description: 'Self-similarity of documentation patterns over time' },
  { name: 'Gap duration (max)', domain: 'regularity', importance: 70, description: 'Longest interval without documentation' },
  { name: 'Interval standard deviation', domain: 'regularity', importance: 65, description: 'Standard deviation of time between consecutive notes' },
  { name: 'Circadian alignment', domain: 'pattern', importance: 80, description: 'Deviation from expected 24-hour documentation cycle' },
  { name: 'Shift-boundary spikes', domain: 'pattern', importance: 76, description: 'Documentation clustering at shift change times' },
  { name: 'Weekend deviation', domain: 'pattern', importance: 63, description: 'Pattern differences between weekday and weekend documentation' },
  { name: 'First-24h trajectory', domain: 'pattern', importance: 88, description: 'Documentation pattern shape in the first 24 hours of admission' },
  { name: 'Phenotype transition rate', domain: 'pattern', importance: 82, description: 'Frequency of shifts between documentation phenotypes' },
];

const DOMAIN_CONFIG = {
  intensity: { label: 'Documentation Intensity', color: 'bg-chart-1', textColor: 'text-chart-1', count: 5 },
  regularity: { label: 'Regularity Metrics', color: 'bg-chart-2', textColor: 'text-chart-2', count: 5 },
  pattern: { label: 'Pattern Features', color: 'bg-chart-4', textColor: 'text-chart-4', count: 5 },
};

// ── Pipeline Steps ──────────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  { icon: <Timer className="w-4 h-4" />, label: 'EHR Timestamps', desc: 'Raw metadata' },
  { icon: <BarChart3 className="w-4 h-4" />, label: '15 Features', desc: 'Temporal extraction' },
  { icon: <Dna className="w-4 h-4" />, label: '4 Phenotypes', desc: 'K-means clustering' },
  { icon: <Brain className="w-4 h-4" />, label: 'Risk Score', desc: 'AUC 0.741' },
];

// ── Main Component ──────────────────────────────────────────────────────────
export const ICUMortalityPrediction = () => {
  const [selectedPhenotype, setSelectedPhenotype] = useState<string | null>(null);
  const [animateStep, setAnimateStep] = useState(0);

  // Animate pipeline on mount
  useState(() => {
    const interval = setInterval(() => {
      setAnimateStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  });

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-chart-4/10 border border-chart-4/20">
              <Dna className="w-5 h-5 text-chart-4" />
            </div>
            <div>
              <CardTitle className="text-base">ICU Mortality Prediction</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Documentation Rhythm Patterns &amp; Temporal Phenotypes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-chart-4/10 border-chart-4/30 text-chart-4 text-[10px]">
              99 Claims
            </Badge>
            <Badge variant="outline" className="bg-risk-low/10 border-risk-low/30 text-risk-low text-[10px]">
              NIH Funded
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ── Pipeline Visualization ─────────────────────────────────── */}
        <div className="bg-muted/50 rounded-xl p-4 border border-border/30">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Feature Extraction Pipeline
          </p>
          <div className="flex items-center justify-between gap-1">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15, duration: 0.3 }}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-lg border flex-1 transition-colors',
                    i <= animateStep
                      ? 'bg-card border-primary/30 shadow-sm'
                      : 'bg-muted/30 border-border/20'
                  )}
                >
                  <div className={cn(
                    'p-1.5 rounded-md',
                    i <= animateStep ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  )}>
                    {step.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-foreground text-center leading-tight">{step.label}</span>
                  <span className="text-[9px] text-muted-foreground">{step.desc}</span>
                </motion.div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i < animateStep ? 1 : 0.2 }}
                    transition={{ delay: i * 0.15 + 0.1 }}
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground mx-1 shrink-0" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs: Phenotypes / Temporal Features ───────────────────── */}
        <Tabs defaultValue="phenotypes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="phenotypes" className="text-xs flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5" />
              Clinical Phenotypes
            </TabsTrigger>
            <TabsTrigger value="features" className="text-xs flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              15 Temporal Features
            </TabsTrigger>
          </TabsList>

          {/* ── Phenotypes Tab ──────────────────────────────────────── */}
          <TabsContent value="phenotypes" className="space-y-3">
            {/* Mortality gradient bar */}
            <div className="relative h-8 rounded-lg overflow-hidden flex">
              {PHENOTYPES.map((p) => (
                <motion.button
                  key={p.id}
                  className={cn(
                    'h-full relative flex items-center justify-center cursor-pointer transition-all border-r border-background/30 last:border-0',
                    selectedPhenotype === p.id ? 'ring-2 ring-foreground/20 z-10' : ''
                  )}
                  style={{ width: `${p.prevalence}%` }}
                  onClick={() => setSelectedPhenotype(selectedPhenotype === p.id ? null : p.id)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={cn('absolute inset-0', p.bgColor)} style={{ opacity: 0.6 }} />
                  <span className={cn('relative text-[10px] font-bold', p.color)}>
                    {p.mortality}%
                  </span>
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground px-1">
              <span>Low mortality</span>
              <span>High mortality</span>
            </div>

            {/* Phenotype cards */}
            <div className="grid grid-cols-2 gap-3">
              {PHENOTYPES.map((phenotype, i) => (
                <motion.div
                  key={phenotype.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    'rounded-xl border p-3.5 cursor-pointer transition-all',
                    phenotype.borderColor,
                    selectedPhenotype === phenotype.id
                      ? `${phenotype.bgColor} shadow-md`
                      : 'bg-card hover:bg-muted/30'
                  )}
                  onClick={() => setSelectedPhenotype(selectedPhenotype === phenotype.id ? null : phenotype.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={cn('p-1.5 rounded-lg', phenotype.bgColor, phenotype.color)}>
                      {phenotype.icon}
                    </div>
                    <div className="text-right">
                      <p className={cn('text-xl font-bold leading-none', phenotype.color)}>
                        {phenotype.mortality}%
                      </p>
                      <p className="text-[9px] text-muted-foreground">mortality</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{phenotype.name}</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed mb-2.5">
                    {phenotype.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">
                      <span className="font-medium text-foreground">{phenotype.prevalence}%</span> of patients
                    </span>
                    <span className="text-muted-foreground">{phenotype.docRate}</span>
                  </div>

                  <AnimatePresence>
                    {selectedPhenotype === phenotype.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-border/40 space-y-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Entropy</span>
                            <span className="font-medium text-foreground">{phenotype.entropy}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Doc Rate</span>
                            <span className="font-medium text-foreground">{phenotype.docRate}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-muted-foreground">Prevalence</span>
                            <span className="font-medium text-foreground">{phenotype.prevalence}% of cohort</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Validation stats */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Cohort', value: '35,782', sub: 'ICU admissions' },
                { label: 'Database', value: 'MIMIC-IV', sub: 'Validated' },
                { label: 'AUC', value: '0.741', sub: 'XGBoost' },
                { label: 'p-value', value: '<0.001', sub: 'Significant' },
              ].map((stat) => (
                <div key={stat.label} className="bg-muted/40 rounded-lg p-2.5 text-center border border-border/20">
                  <p className="text-sm font-bold text-foreground">{stat.value}</p>
                  <p className="text-[9px] text-muted-foreground">{stat.sub}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── Temporal Features Tab ──────────────────────────────── */}
          <TabsContent value="features" className="space-y-4">
            {/* Domain summary */}
            <div className="flex gap-3">
              {Object.entries(DOMAIN_CONFIG).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5 text-[10px]">
                  <div className={cn('w-2 h-2 rounded-full', cfg.color)} />
                  <span className="text-muted-foreground">{cfg.label} ({cfg.count})</span>
                </div>
              ))}
            </div>

            {/* Feature bars */}
            <div className="space-y-1.5">
              {TEMPORAL_FEATURES
                .sort((a, b) => b.importance - a.importance)
                .map((feature, i) => {
                  const domain = DOMAIN_CONFIG[feature.domain];
                  return (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="group"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', domain.color)} />
                        <span className="text-[11px] text-foreground w-40 truncate" title={feature.name}>
                          {feature.name}
                        </span>
                        <div className="flex-1 h-4 bg-muted/40 rounded-full overflow-hidden relative">
                          <motion.div
                            className={cn('h-full rounded-full', domain.color)}
                            initial={{ width: 0 }}
                            animate={{ width: `${feature.importance}%` }}
                            transition={{ delay: i * 0.03 + 0.2, duration: 0.4, ease: 'easeOut' }}
                            style={{ opacity: 0.7 }}
                          />
                        </div>
                        <span className="text-[10px] font-mono font-medium text-foreground w-8 text-right">
                          {feature.importance}
                        </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground ml-4 pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
            </div>

            {/* Key insight */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-chart-4/5 border border-chart-4/20">
              <Zap className="w-3.5 h-3.5 text-chart-4 mt-0.5 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Human Sensor Concept:</span>{' '}
                Nursing documentation patterns serve as a physiological signal — the "human sensor" — capturing clinical intuition
                that traditional monitoring equipment cannot detect. Zero additional hardware required.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <PatentBadge contextPatent="icu" />
      </CardContent>
    </Card>
  );
};
