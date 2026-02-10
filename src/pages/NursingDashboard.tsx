import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';
import {
  Activity, TrendingUp, AlertTriangle, CheckSquare, Heart,
  BarChart3, FileText, DollarSign, Link2, Sparkles, HeartPulse,
  FlaskConical, Shield, Layers, Gauge, Award, ChevronRight,
  CheckCircle2, Clock, Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { WorkloadPrediction } from '@/components/nursing/WorkloadPrediction';
import { SurgeAlerts } from '@/components/nursing/SurgeAlerts';
import { TaskPrioritization } from '@/components/nursing/TaskPrioritization';
import { BurnoutTracking } from '@/components/nursing/BurnoutTracking';
import { WorkflowAnalytics } from '@/components/nursing/WorkflowAnalytics';
import { ICUMortalityPrediction } from '@/components/dashboard/ICUMortalityPrediction';
import { DBSCalculator } from '@/components/dashboard/DBSCalculator';
import { ROICalculator } from '@/components/dashboard/ROICalculator';
import { LinkedCalculatorView } from '@/components/dashboard/LinkedCalculatorView';
import { ResearchCharts } from '@/components/dashboard/ResearchCharts';
import { AIToolsPanel } from '@/components/dashboard/AIToolsPanel';
import { ResearchValidationSection } from '@/components/dashboard/ResearchValidationSection';
import { AlertOptimizationTab } from '@/components/dashboard/AlertOptimizationTab';
import { RiskStratificationTab } from '@/components/dashboard/RiskStratificationTab';
import { ChartMinderPanel } from '@/components/chartminder/ChartMinderPanel';
import heroBg from '@/assets/hero-bg.jpg';

/* ───────── Animated Counter ───────── */
const AnimatedStat = ({ value, delay = 0 }: { value: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const isNumber = /^[\d.,]+$/.test(value);
      if (!isNumber) {
        setDisplayed(value);
        setHasAnimated(true);
        return;
      }
      const target = parseFloat(value.replace(/,/g, ''));
      const hasComma = value.includes(',');
      const decimals = value.includes('.') ? value.split('.')[1].length : 0;
      const duration = 1200;
      const steps = 40;
      const stepTime = duration / steps;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        let formatted = decimals > 0
          ? current.toFixed(decimals)
          : Math.round(current).toString();
        if (hasComma) {
          formatted = Number(formatted).toLocaleString();
        }
        setDisplayed(formatted);
        if (step >= steps) {
          clearInterval(interval);
          setDisplayed(value);
          setHasAnimated(true);
        }
      }, stepTime);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <span ref={ref} className={cn(hasAnimated && 'stat-value-animate')}>
      {displayed || '0'}
    </span>
  );
};

/* ───────── Heartbeat SVG ───────── */
const HeartbeatLine = () => (
  <svg className="absolute bottom-0 left-0 w-full h-8 opacity-20" viewBox="0 0 400 30" preserveAspectRatio="none">
    <path
      className="heartbeat-path"
      d="M0,20 L80,20 L90,20 L100,5 L110,25 L120,10 L130,20 L200,20 L210,20 L220,3 L230,27 L240,8 L250,20 L320,20 L330,20 L340,6 L350,24 L360,12 L370,20 L400,20"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="1.5"
    />
  </svg>
);

/* ───────── Patent Group Configuration ───────── */
type PatentGroup = {
  id: string;
  patent: string;
  title: string;
  validated: boolean;
  statusLabel?: 'validated' | 'hackathon' | 'design';
  color: string;
  activeBg: string;
  tabs: { value: string; label: string; icon: React.ElementType }[];
};

const patentGroups: PatentGroup[] = [
  {
    id: 'hackathon',
    patent: 'Hackathon',
    title: 'Gemini 3 AI Showcase',
    validated: false,
    statusLabel: 'hackathon',
    color: 'text-chart-4',
    activeBg: 'bg-chart-4',
    tabs: [
      { value: 'ai-tools', label: 'AI Tools', icon: Sparkles },
    ],
  },
  {
    id: 'patent-1',
    patent: 'Patent #1',
    title: 'ICU Mortality Research',
    validated: true,
    statusLabel: 'validated',
    color: 'text-primary',
    activeBg: 'bg-primary',
    tabs: [
      { value: 'research', label: 'Validation', icon: FlaskConical },
      { value: 'charts', label: 'Research Charts', icon: BarChart3 },
    ],
  },
  {
    id: 'patent-2',
    patent: 'Patent #2',
    title: 'ChartMinder Alert Governance',
    validated: false,
    color: 'text-risk-low',
    activeBg: 'bg-risk-low',
    tabs: [
      { value: 'alert-optimization', label: 'Alert Optimization', icon: Shield },
      { value: 'risk-stratification', label: 'Risk Stratification', icon: Layers },
      { value: 'chartminder', label: 'ChartMinder', icon: Gauge },
    ],
  },
  {
    id: 'patent-3',
    patent: 'Patent #3',
    title: 'Nursing Workload Optimization',
    validated: false,
    color: 'text-warning',
    activeBg: 'bg-warning',
    tabs: [
      { value: 'workload', label: 'Workload', icon: TrendingUp },
      { value: 'surge', label: 'Surge Alerts', icon: AlertTriangle },
      { value: 'burnout', label: 'Burnout', icon: Heart },
    ],
  },
  {
    id: 'patent-4',
    patent: 'Patent #4',
    title: 'Clinical Documentation & Scoring',
    validated: false,
    color: 'text-accent',
    activeBg: 'bg-accent',
    tabs: [
      { value: 'tasks', label: 'Tasks', icon: CheckSquare },
      { value: 'analytics', label: 'Analytics', icon: BarChart3 },
      { value: 'dbs', label: 'DBS Score', icon: FileText },
      { value: 'roi', label: 'ROI Calculator', icon: DollarSign },
      { value: 'linked', label: 'Linked View', icon: Link2 },
    ],
  },
  {
    id: 'patent-5',
    patent: 'Patent #5',
    title: 'Human Sensor / Unified Intelligence',
    validated: false,
    color: 'text-chart-3',
    activeBg: 'bg-chart-3',
    tabs: [
      { value: 'icu-mortality', label: 'ICU Mortality Visualization', icon: HeartPulse },
    ],
  },
];

const tabContent: Record<string, React.ReactNode> = {
  'icu-mortality': <ICUMortalityPrediction />,
  'research': <ResearchValidationSection />,
  'charts': <ResearchCharts />,
  'alert-optimization': <AlertOptimizationTab />,
  'risk-stratification': <RiskStratificationTab />,
  'chartminder': <ChartMinderPanel />,
  'workload': <WorkloadPrediction />,
  'surge': <SurgeAlerts />,
  'burnout': <BurnoutTracking />,
  'tasks': <TaskPrioritization />,
  'analytics': <WorkflowAnalytics />,
  'dbs': <DBSCalculator />,
  'roi': <ROICalculator />,
  'linked': <LinkedCalculatorView />,
  'ai-tools': <AIToolsPanel />,
};

const stats = [
  { value: '0.683', label: 'AUC', detail: 'ICU Mortality Prediction', delay: 200 },
  { value: '26,153', label: 'ICU Admissions', detail: 'MIMIC-IV Validation Cohort', delay: 400 },
  { value: '11', label: 'Years', detail: 'Temporal Stability (2008-2019)', delay: 600 },
  { value: '175', label: 'Claims', detail: '5 Provisional Patents Filed', delay: 800 },
];

export const NursingDashboard = () => {
  const [activeTab, setActiveTab] = useState('ai-tools');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [autoPlayTriggered, setAutoPlayTriggered] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    patentGroups.forEach((g) => (initial[g.id] = true));
    return initial;
  });

  // Auto-trigger "Run All Demos" when AI Tools tab loads for first time
  useEffect(() => {
    if (activeTab === 'ai-tools' && !autoPlayTriggered) {
      const timer = setTimeout(() => {
        const allButtons = document.querySelectorAll('[data-ai-tools-panel] button');
        allButtons.forEach(btn => {
          if (btn.textContent?.includes('Run All Demos')) {
            (btn as HTMLButtonElement).click();
            setAutoPlayTriggered(true);
          }
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, autoPlayTriggered]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const activeGroup = patentGroups.find((g) => g.tabs.some((t) => t.value === activeTab));
  const activeTabMeta = activeGroup?.tabs.find((t) => t.value === activeTab);

  return (
    <SiteLayout
      title="Technology Demo"
      description="VitaSignal Clinical Intelligence Platform - interactive technology demonstration."
    >
      <WatermarkOverlay />

      {/* ──── HERO ──── */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground" />
        </div>
        <HeartbeatLine />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative max-w-6xl mx-auto px-6 pt-16 pb-14 md:pt-20 md:pb-16"
        >
          {/* Title row */}
          <div className="flex items-center gap-4 mb-5">
            <motion.div
              animate={{ boxShadow: ['0 0 0 0 hsl(var(--primary) / 0.3)', '0 0 20px 4px hsl(var(--primary) / 0.15)', '0 0 0 0 hsl(var(--primary) / 0.3)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="p-3 rounded-2xl bg-primary/20 border border-primary/30"
            >
              <Activity className="h-7 w-7 text-primary" />
            </motion.div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">VitaSignal Technology Demo</h1>
              <p className="text-sm text-primary-foreground/50 mt-0.5">Clinical Intelligence Platform, Dr. Alexis Collier</p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-semibold gap-1">
              <Zap className="h-3 w-3" /> LIVE DEMO
            </Badge>
            <Badge className="bg-warning/20 text-warning border border-warning/30 text-[10px] font-semibold">SIMULATED DATA</Badge>
            <Badge className="bg-destructive/20 text-destructive border border-destructive/30 text-[10px] font-semibold">NOT FOR CLINICAL USE</Badge>
            <Badge className="validated-badge bg-risk-low/20 text-risk-low border border-risk-low/30 text-[10px] font-semibold gap-1">
              <CheckCircle2 className="h-3 w-3" /> PATENT #1 VALIDATED
            </Badge>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                className="group relative bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl px-5 py-4 text-center backdrop-blur-sm hover:bg-primary-foreground/8 transition-colors"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                  <AnimatedStat value={s.value} delay={s.delay} />
                </p>
                <p className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest">{s.label}</p>
                <p className="text-[10px] text-primary-foreground/35 mt-0.5">{s.detail}</p>
                <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/20 transition-colors" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ──── DISCLAIMER ──── */}
      <div className="bg-destructive/5 border-b border-destructive/20 py-2 px-4 text-center text-[11px] text-destructive font-medium">
        Development Prototype. Only VitaSignal Mortality (Patent #1) has completed validation. All other components are design phase. Mock data only.
      </div>

      {/* ──── MAIN CONTENT ──── */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* ──── MOBILE NAV DROPDOWN ──── */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-card border border-border/50 shadow-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {activeGroup && (
                  <>
                    <Badge className={cn(
                      'text-[10px] font-bold',
                      activeGroup.statusLabel === 'validated'
                        ? 'bg-risk-low/15 text-risk-low border-risk-low/25'
                        : activeGroup.statusLabel === 'hackathon'
                          ? 'bg-chart-4/15 text-chart-4 border-chart-4/25'
                          : 'bg-muted text-muted-foreground border-border/40'
                    )}>
                      {activeGroup.patent}
                    </Badge>
                    <span className="text-sm font-semibold text-foreground truncate">
                      {activeTabMeta?.label}
                    </span>
                  </>
                )}
              </div>
              <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', mobileSidebarOpen && 'rotate-90')} />
            </button>

            <AnimatePresence>
              {mobileSidebarOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mt-2 rounded-xl border border-border/50 bg-card shadow-lg"
                >
                  <div className="max-h-[60vh] overflow-y-auto">
                    {patentGroups.map((group) => (
                      <div key={group.id}>
                        <p className={cn('text-[10px] font-bold uppercase tracking-wider px-4 pt-3 pb-1', group.color)}>{group.patent} — {group.title}</p>
                        <div className="px-2 pb-2 space-y-0.5">
                          {group.tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.value;
                            return (
                              <button
                                key={tab.value}
                                onClick={() => { setActiveTab(tab.value); setMobileSidebarOpen(false); }}
                                className={cn(
                                  'w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
                                  isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted/60'
                                )}
                              >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span>{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* ──── SIDEBAR (desktop only) ──── */}
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="hidden lg:block lg:w-[280px] shrink-0"
            >
              <div className="patent-sidebar rounded-2xl overflow-hidden lg:sticky lg:top-24">
                {/* Sidebar header */}
                <div className="px-4 py-3 border-b border-border/30">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Patent Portfolio</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">5 Provisional Patents, 175+ Claims</p>
                </div>

                {patentGroups.map((group, idx) => {
                  const isExpanded = expandedGroups[group.id];
                  const hasActiveTab = group.tabs.some((t) => t.value === activeTab);

                  return (
                    <div key={group.id}>
                      {idx > 0 && <Separator className="opacity-30" />}

                      {/* Group header */}
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className={cn(
                          'w-full flex items-center justify-between gap-2 px-4 py-3 text-left transition-all duration-200 hover:bg-muted/40',
                          hasActiveTab && 'bg-muted/20'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={cn('w-1.5 h-8 rounded-full transition-colors', hasActiveTab ? group.activeBg : 'bg-border')} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={cn('text-[10px] font-bold uppercase tracking-wider', hasActiveTab ? group.color : 'text-muted-foreground')}>{group.patent}</span>
                              {group.statusLabel === 'validated' ? (
                                <Badge className="validated-badge bg-risk-low/15 text-risk-low border-risk-low/25 text-[8px] h-3.5 px-1 gap-0.5">
                                  <CheckCircle2 className="h-2 w-2" /> Validated
                                </Badge>
                              ) : group.statusLabel === 'hackathon' ? (
                                <Badge className="bg-chart-4/15 text-chart-4 border-chart-4/25 text-[8px] h-3.5 px-1 gap-0.5 animate-pulse-subtle">
                                  <Zap className="h-2 w-2" /> Gemini 3
                                </Badge>
                              ) : (
                                <Badge className="bg-muted text-muted-foreground border-border/40 text-[8px] h-3.5 px-1 gap-0.5">
                                  <Clock className="h-2 w-2" /> Design
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] font-medium text-foreground/70 truncate mt-0.5">{group.title}</p>
                          </div>
                        </div>
                        <ChevronRight className={cn('h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200', isExpanded && 'rotate-90')} />
                      </button>

                      {/* Tab buttons */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-2 space-y-0.5">
                              {group.tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.value;
                                return (
                                  <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    data-active={isActive}
                                    className={cn(
                                      'patent-nav-item w-full flex items-center gap-2.5 pl-6 pr-3 py-2 rounded-lg text-xs font-medium transition-all text-left group',
                                      isActive
                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                                    )}
                                  >
                                    <Icon className={cn('h-3.5 w-3.5 shrink-0 transition-transform group-hover:scale-110', isActive && 'drop-shadow-sm')} />
                                    <span>{tab.label}</span>
                                    {isActive && (
                                      <ChevronRight className="h-3 w-3 ml-auto opacity-60" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border/30 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-primary" />
                    <p className="text-[10px] text-muted-foreground">
                      <span className="font-semibold text-foreground/70">15 Modules</span> across 5 patents + Hackathon
                    </p>
                  </div>
                </div>
              </div>
            </motion.nav>

            {/* ──── CONTENT AREA ──── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex-1 min-w-0"
            >
              {/* Breadcrumb */}
              {activeGroup && activeTabMeta && (
                <motion.div
                  key={activeTab + '-breadcrumb'}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2.5 mb-5 px-1"
                >
                  <Badge className={cn(
                    'text-[10px] font-bold',
                    activeGroup.statusLabel === 'validated'
                      ? 'bg-risk-low/15 text-risk-low border-risk-low/25'
                      : activeGroup.statusLabel === 'hackathon'
                        ? 'bg-chart-4/15 text-chart-4 border-chart-4/25'
                        : 'bg-muted text-muted-foreground border-border/40'
                  )}>
                    {activeGroup.patent}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{activeGroup.title}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    {(() => { const Icon = activeTabMeta.icon; return <Icon className="h-3.5 w-3.5 text-primary" />; })()}
                    {activeTabMeta.label}
                  </span>
                </motion.div>
              )}

              {/* Tab content with animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NursingDashboard;
