import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';
import {
  Activity, TrendingUp, AlertTriangle, CheckSquare, Heart,
  BarChart3, FileText, DollarSign, Link2, Sparkles, HeartPulse,
  FlaskConical, Shield, Layers, Gauge, ChevronRight, ChevronDown, Menu,
  CheckCircle2, Clock, Zap, Users, BedDouble
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
import { DBSExecutiveWalkthrough } from '@/components/dashboard/DBSExecutiveWalkthrough';
import { ROICalculator } from '@/components/dashboard/ROICalculator';
import { LinkedCalculatorView } from '@/components/dashboard/LinkedCalculatorView';
import { ResearchCharts } from '@/components/dashboard/ResearchCharts';
import { AIToolsPanel } from '@/components/dashboard/AIToolsPanel';
import { ResearchValidationSection } from '@/components/dashboard/ResearchValidationSection';
import { AlertOptimizationTab } from '@/components/dashboard/AlertOptimizationTab';
import { RiskStratificationTab } from '@/components/dashboard/RiskStratificationTab';
import { ChartMinderPanel } from '@/components/chartminder/ChartMinderPanel';
import { TRACIDemo } from '@/components/dashboard/TRACIDemo';
import { TRACIScenarios } from '@/components/dashboard/TRACIScenarios';
import { ESDBIDemo } from '@/components/dashboard/ESDBIDemo';
import { ESDBIScheduler } from '@/components/dashboard/ESDBIScheduler';
import { SHQSDemo } from '@/components/dashboard/SHQSDemo';
import { SHQSWorkflows } from '@/components/dashboard/SHQSWorkflows';
import { DTBLDemo } from '@/components/dashboard/DTBLDemo';
import { DTBLSimulator } from '@/components/dashboard/DTBLSimulator';
import { CTCIDemo } from '@/components/dashboard/CTCIDemo';
import { CTCIPatientMatcher } from '@/components/dashboard/CTCIPatientMatcher';
import { SEDRDemo } from '@/components/dashboard/SEDRDemo';
import { SEDRCommandCenter } from '@/components/dashboard/SEDRCommandCenter';
import { FHIRIntegrationDemo } from '@/components/dashboard/FHIRIntegrationDemo';
import { InvestorMetricsProvider } from '@/hooks/useInvestorMetrics';
import { GuidedTour, TourButton } from '@/components/quality/GuidedTour';
import { useGuidedTour } from '@/hooks/useGuidedTour';

/* ───────── Patent Group Configuration ───────── */
type PatentGroup = {
  id: string;
  patent: string;
  title: string;
  validated: boolean;
  statusLabel?: 'validated' | 'hackathon' | 'design' | 'enterprise';
  tabs: { value: string; label: string; icon: React.ElementType }[];
};

const patentGroups: PatentGroup[] = [
  {
    id: 'patent-1',
    patent: 'Patent #1',
    title: 'ICU Mortality Prediction',
    validated: true,
    statusLabel: 'validated',
    tabs: [
      { value: 'icu-mortality', label: 'ICU Mortality', icon: HeartPulse },
      { value: 'research', label: 'Validation', icon: FlaskConical },
      { value: 'charts', label: 'Research Charts', icon: BarChart3 },
    ],
  },
  {
    id: 'patent-2',
    patent: 'Patent #2',
    title: 'Trust-Based Alert Governance',
    validated: false,
    tabs: [
      { value: 'alert-optimization', label: 'Alert Optimization', icon: Shield },
      { value: 'risk-stratification', label: 'Risk Stratification', icon: Layers },
      { value: 'chartminder', label: 'Alert Engine', icon: Gauge },
    ],
  },
  {
    id: 'patent-3',
    patent: 'Patent #3',
    title: 'Clinical Risk Intelligence',
    validated: false,
    tabs: [
      { value: 'workload', label: 'Workload', icon: TrendingUp },
      { value: 'surge', label: 'Surge Alerts', icon: AlertTriangle },
      { value: 'burnout', label: 'Burnout', icon: Heart },
    ],
  },
  {
    id: 'patent-4',
    patent: 'Patent #4',
    title: 'Unified Nursing Intelligence',
    validated: false,
    tabs: [
      { value: 'tasks', label: 'Tasks', icon: CheckSquare },
      { value: 'analytics', label: 'Analytics', icon: BarChart3 },
      { value: 'linked', label: 'Linked View', icon: Link2 },
    ],
  },
  {
    id: 'patent-5',
    patent: 'Patent #5',
    title: 'DBS System',
    validated: true,
    statusLabel: 'validated',
    tabs: [
      { value: 'dbs-overview', label: 'DBS Overview', icon: Sparkles },
      { value: 'dbs', label: 'DBS Calculator', icon: FileText },
      { value: 'roi', label: 'ROI Calculator', icon: DollarSign },
    ],
  },
  {
    id: 'patent-6',
    patent: 'Patent #6',
    title: 'TRACI – Temporal Risk',
    validated: false,
    tabs: [
      { value: 'traci', label: 'Risk Dashboard', icon: Activity },
      { value: 'traci-scenarios', label: 'Scenarios', icon: Zap },
    ],
  },
  {
    id: 'patent-7',
    patent: 'Patent #7',
    title: 'ESDBI – Staffing Optimization',
    validated: false,
    tabs: [
      { value: 'esdbi', label: 'Staffing Analysis', icon: BarChart3 },
      { value: 'esdbi-scheduler', label: 'Shift Scheduler', icon: Clock },
    ],
  },
  {
    id: 'patent-8',
    patent: 'Patent #8',
    title: 'SHQS – Healthcare Quality',
    validated: false,
    tabs: [
      { value: 'shqs', label: 'Quality Monitor', icon: Shield },
      { value: 'shqs-workflows', label: 'Improvement Workflows', icon: CheckSquare },
    ],
  },
  {
    id: 'patent-9',
    patent: 'Patent #9',
    title: 'DTBL – Digital Twin Baseline',
    validated: false,
    tabs: [
      { value: 'dtbl', label: 'Twin Dashboard', icon: Layers },
      { value: 'dtbl-simulator', label: 'Live Simulator', icon: HeartPulse },
    ],
  },
  {
    id: 'patent-10',
    patent: 'Patent #10',
    title: 'CTCI – Clinical Trial Intelligence',
    validated: false,
    tabs: [
      { value: 'ctci', label: 'Trial Matching', icon: FlaskConical },
      { value: 'ctci-patients', label: 'Patient Matcher', icon: Heart },
    ],
  },
  {
    id: 'patent-11',
    patent: 'Patent #11',
    title: 'SEDR – Syndromic Surveillance',
    validated: true,
    statusLabel: 'validated',
    tabs: [
      { value: 'sedr', label: 'Syndromic Trends', icon: Activity },
      { value: 'sedr-command', label: 'Command Center', icon: AlertTriangle },
    ],
  },
  {
    id: 'fhir-integration',
    patent: 'Integration',
    title: 'FHIR R4 EHR Pipeline',
    validated: false,
    statusLabel: 'enterprise',
    tabs: [
      { value: 'fhir-demo', label: 'FHIR Live Demo', icon: Zap },
    ],
  },
  {
    id: 'hackathon',
    patent: 'Hackathon',
    title: 'Gemini 3 AI Showcase',
    validated: false,
    statusLabel: 'hackathon',
    tabs: [
      { value: 'ai-tools', label: 'AI Tools', icon: Sparkles },
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
  'dbs-overview': <DBSExecutiveWalkthrough />,
  'dbs': <DBSCalculator />,
  'roi': <InvestorMetricsProvider><ROICalculator /></InvestorMetricsProvider>,
  'linked': <InvestorMetricsProvider><LinkedCalculatorView /></InvestorMetricsProvider>,
  'ai-tools': <AIToolsPanel />,
  'traci': <TRACIDemo />,
  'traci-scenarios': <TRACIScenarios />,
  'esdbi': <ESDBIDemo />,
  'esdbi-scheduler': <ESDBIScheduler />,
  'shqs': <SHQSDemo />,
  'shqs-workflows': <SHQSWorkflows />,
  'dtbl': <DTBLDemo />,
  'dtbl-simulator': <DTBLSimulator />,
  'ctci': <CTCIDemo />,
  'ctci-patients': <CTCIPatientMatcher />,
  'sedr': <SEDRDemo />,
  'sedr-command': <SEDRCommandCenter />,
  'fhir-demo': <FHIRIntegrationDemo />,
};

/* ───────── Live Clock ───────── */
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
    </span>
  );
};

/* ───────── Status Badge ───────── */
const StatusTag = ({ label }: { label?: string }) => {
  if (label === 'validated') return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
      <CheckCircle2 className="h-2 w-2" /> Validated
    </span>
  );
  if (label === 'enterprise') return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
      Enterprise
    </span>
  );
  if (label === 'hackathon') return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
      Demo
    </span>
  );
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
      Design
    </span>
  );
};

export const NursingDashboard = () => {
  const [activeTab, setActiveTab] = useState('icu-mortality');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    patentGroups.forEach((g) => (initial[g.id] = true));
    return initial;
  });
  const tour = useGuidedTour(true);

  const toggleGroup = (groupId: string) => {
    const wasExpanded = expandedGroups[groupId];
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    if (!wasExpanded) {
      const group = patentGroups.find((g) => g.id === groupId);
      if (group && group.tabs.length > 0) setActiveTab(group.tabs[0].value);
    }
  };

  const activeGroup = patentGroups.find((g) => g.tabs.some((t) => t.value === activeTab));
  const activeTabMeta = activeGroup?.tabs.find((t) => t.value === activeTab);
  const totalModules = patentGroups.reduce((acc, g) => acc + g.tabs.length, 0);

  return (
    <SiteLayout
      title="Technology Demo"
      description="VitaSignal™ Clinical Intelligence Platform - interactive technology demonstration."
    >
      <WatermarkOverlay />

      <GuidedTour
        isActive={tour.isActive}
        currentStep={tour.currentStep}
        currentStepIndex={tour.currentStepIndex}
        totalSteps={tour.totalSteps}
        isFirstStep={tour.isFirstStep}
        isLastStep={tour.isLastStep}
        targetRect={tour.targetRect}
        onNext={tour.nextStep}
        onPrev={tour.prevStep}
        onEnd={tour.endTour}
        onGoToStep={tour.goToStep}
      />

      {/* ──── APPLICATION HEADER BAR ──── */}
      <div className="bg-muted/60 border-b border-border" data-tour="hero">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground tracking-tight">VitaSignal™ · Clinical Intelligence Platform</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-xs text-muted-foreground">v2.4</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
              <TourButton onClick={tour.startTour} />
              <span>11 Patent Applications · 175+ Claims</span>
              <Separator orientation="vertical" className="h-4" />
              <LiveClock />
            </div>
          </div>
        </div>
      </div>

      {/* ──── CENSUS STRIP ──── */}
      <div className="hidden md:block bg-card border-b border-border" data-tour="census-strip">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center gap-6 py-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Census:</span>
              <span className="font-semibold text-foreground">18</span>
            </div>
            <Separator orientation="vertical" className="h-3.5" />
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Beds:</span>
              <span className="font-semibold text-foreground">6/24 available</span>
            </div>
            <Separator orientation="vertical" className="h-3.5" />
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-red-500 dark:text-red-400" />
              <span className="text-muted-foreground">High Risk:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">5</span>
            </div>
            <Separator orientation="vertical" className="h-3.5" />
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              <span className="text-muted-foreground">Moderate:</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">5</span>
            </div>
            <Separator orientation="vertical" className="h-3.5" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">Low Risk:</span>
              <span className="font-semibold text-primary">8</span>
            </div>
            <Separator orientation="vertical" className="h-3.5" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Avg LOS:</span>
              <span className="font-semibold text-foreground">4.2d</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="text-[10px] font-medium text-primary">EHR Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* ──── DISCLAIMER ──── */}
      <div className="bg-muted/30 border-b border-border py-1.5 px-4 text-center text-[10px] text-muted-foreground" data-tour="disclaimer">
        Development Prototype · Patent #1 (ICU Mortality) and Patent #5 (DBS) validated · Other modules in design phase · Simulated data only
      </div>

      {/* ──── MAIN CONTENT ──── */}
      <section className="py-0 px-0">
        <div className="max-w-[1400px] mx-auto">

          {/* ──── MOBILE NAV ──── */}
          <div className="lg:hidden px-4 pt-4 pb-2">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all",
                mobileSidebarOpen
                  ? "bg-muted border-border"
                  : "bg-card border-border"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Menu className="h-4 w-4 text-muted-foreground shrink-0" />
                {activeGroup && (
                  <>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">{activeGroup.patent}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                    <span className="text-sm font-medium text-foreground truncate">{activeTabMeta?.label}</span>
                  </>
                )}
              </div>
              <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', mobileSidebarOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {mobileSidebarOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-1.5 rounded-lg border border-border bg-card"
                >
                  <div className="max-h-[60vh] overflow-y-auto py-1">
                    {patentGroups.map((group) => (
                      <div key={group.id}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider px-3 pt-2.5 pb-1 text-muted-foreground">{group.patent} — {group.title}</p>
                        <div className="px-1.5 pb-1.5 space-y-px">
                          {group.tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.value;
                            return (
                              <button
                                key={tab.value}
                                onClick={() => { setActiveTab(tab.value); setMobileSidebarOpen(false); }}
                                className={cn(
                                  'w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors text-left',
                                  isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-foreground hover:bg-muted/50'
                                )}
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
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

          <div className="flex flex-col lg:flex-row">

            {/* ──── SIDEBAR ──── */}
            <nav className="hidden lg:block lg:w-[260px] shrink-0 border-r border-border bg-muted/20 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)', position: 'sticky', top: '140px' }} data-tour="sidebar">
              {/* Sidebar header */}
              <div className="px-3 py-2.5 border-b border-border bg-muted/40">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Navigation · {totalModules} Modules</p>
              </div>

              <div className="py-1">
                {patentGroups.map((group, idx) => {
                  const isExpanded = expandedGroups[group.id];
                  const hasActiveTab = group.tabs.some((t) => t.value === activeTab);

                  return (
                    <div key={group.id}>
                      {idx > 0 && <Separator className="opacity-30" />}

                      <button
                        onClick={() => toggleGroup(group.id)}
                        className={cn(
                          'w-full flex items-center justify-between gap-2 px-3 py-2 text-left transition-colors',
                          hasActiveTab ? 'bg-primary/5' : 'hover:bg-muted/50'
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={cn('text-[10px] font-semibold uppercase tracking-wider', hasActiveTab ? 'text-primary' : 'text-muted-foreground')}>
                              {group.patent}
                            </span>
                            <StatusTag label={group.statusLabel} />
                          </div>
                          <p className="text-[11px] font-medium text-foreground truncate mt-0.5">{group.title}</p>
                        </div>
                        <ChevronRight className={cn('h-3 w-3 text-muted-foreground shrink-0 transition-transform', isExpanded && 'rotate-90')} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                          >
                            <div className="px-2 pb-1.5 space-y-px">
                              {group.tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.value;
                                return (
                                  <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={cn(
                                      'w-full flex items-center gap-2 pl-5 pr-2 py-1.5 rounded text-[12px] transition-colors text-left',
                                      isActive
                                        ? 'bg-primary text-primary-foreground font-medium'
                                        : 'text-foreground hover:bg-muted/60 font-normal'
                                    )}
                                  >
                                    <Icon className="h-3 w-3 shrink-0" />
                                    <span>{tab.label}</span>
                                    {isActive && <ChevronRight className="h-2.5 w-2.5 ml-auto opacity-60" />}
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
              </div>

              {/* Sidebar footer */}
              <div className="px-3 py-2 border-t border-border bg-muted/30 text-[10px] text-muted-foreground">
                VitaSignal™ v2.4 · Patent-pending · Equipment-independent
              </div>
            </nav>

            {/* ──── CONTENT AREA ──── */}
            <div className="flex-1 min-w-0 px-4 md:px-6 py-5" data-tour="content-area">
              {/* Breadcrumb */}
              {activeGroup && activeTabMeta && (
                <div className="flex items-center gap-2 mb-4 text-xs">
                  <span className="text-muted-foreground">VitaSignal</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                  <span className="text-muted-foreground">{activeGroup.patent}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                  <span className="font-medium text-foreground flex items-center gap-1">
                    {(() => { const Icon = activeTabMeta.icon; return <Icon className="h-3 w-3 text-primary" />; })()}
                    {activeTabMeta.label}
                  </span>
                  <StatusTag label={activeGroup.statusLabel} />
                </div>
              )}

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ──── STATUS BAR ──── */}
      <div className="bg-muted/40 border-t border-border py-1.5 px-4 text-center text-[10px] text-muted-foreground">
        VitaSignal™ Clinical Intelligence Platform · Patent-pending · Equipment-independent · ⚠ Simulated data for demonstration only
      </div>
    </SiteLayout>
  );
};

export default NursingDashboard;
