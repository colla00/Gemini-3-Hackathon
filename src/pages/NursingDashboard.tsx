import { useState } from 'react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';
import { Activity, TrendingUp, AlertTriangle, CheckSquare, Heart, BarChart3, FileText, DollarSign, Link2, Sparkles, HeartPulse, FlaskConical, Shield, Layers, Gauge, Award, ChevronDown } from 'lucide-react';
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

const stats = [
  { value: '0.683', label: 'AUC', detail: 'ICU Mortality Prediction (Patent #1)' },
  { value: '26,153', label: 'ICU Admissions', detail: 'MIMIC-IV Validation Cohort' },
  { value: '11 yrs', label: 'Temporal Validation', detail: '2008–2019 · Stability AUC 0.684' },
  { value: '9', label: 'IDI Features', detail: '4 Temporal Domains · EHR Metadata' },
];

type PatentGroup = {
  id: string;
  label: string;
  badge: string;
  badgeColor: string;
  tabs: { value: string; label: string; icon: React.ElementType }[];
};

const patentGroups: PatentGroup[] = [
  {
    id: 'patent-1',
    label: 'Patent #1 — ICU Mortality Prediction',
    badge: 'Patent #1 · medRxiv',
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    tabs: [
      { value: 'icu-mortality', label: 'ICU Mortality', icon: HeartPulse },
      { value: 'research', label: 'Validation', icon: FlaskConical },
      { value: 'charts', label: 'Research Charts', icon: BarChart3 },
    ],
  },
  {
    id: 'patent-2',
    label: 'Patent #2 — ChartMinder Alert Governance',
    badge: 'Patent #2',
    badgeColor: 'bg-green-500/10 text-green-600 border-green-500/20',
    tabs: [
      { value: 'alert-optimization', label: 'Alert Optimization', icon: Shield },
      { value: 'risk-stratification', label: 'Risk Stratification', icon: Layers },
      { value: 'chartminder', label: 'ChartMinder Dashboard', icon: Gauge },
    ],
  },
  {
    id: 'patent-3',
    label: 'Patent #3 — Nursing Workload Optimization',
    badge: 'Patent #3',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    tabs: [
      { value: 'workload', label: 'Workload', icon: TrendingUp },
      { value: 'surge', label: 'Surge Alerts', icon: AlertTriangle },
      { value: 'burnout', label: 'Burnout', icon: Heart },
    ],
  },
  {
    id: 'patent-4',
    label: 'Patent #4 — Clinical Documentation & Scoring',
    badge: 'Patent #4',
    badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    tabs: [
      { value: 'tasks', label: 'Tasks', icon: CheckSquare },
      { value: 'analytics', label: 'Analytics', icon: BarChart3 },
      { value: 'dbs', label: 'DBS Score', icon: FileText },
      { value: 'roi', label: 'ROI', icon: DollarSign },
      { value: 'linked', label: 'Linked View', icon: Link2 },
    ],
  },
  {
    id: 'patent-5',
    label: 'Patent #5 — Unified Clinical Intelligence',
    badge: 'Patent #5',
    badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
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
  'dbs': <DBSCalculator />,
  'roi': <ROICalculator />,
  'linked': <LinkedCalculatorView />,
  'ai-tools': <AIToolsPanel />,
};

export const NursingDashboard = () => {
  const [activeTab, setActiveTab] = useState('icu-mortality');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    patentGroups.forEach((g) => (initial[g.id] = true));
    return initial;
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Find which group owns the active tab
  const activeGroup = patentGroups.find((g) => g.tabs.some((t) => t.value === activeTab));

  return (
    <SiteLayout
      title="Technology Demo"
      description="VitaSignal Clinical Intelligence Platform — interactive technology demonstration."
    >
      <WatermarkOverlay />

      {/* Dark Hero Section */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-20 md:pb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">VitaSignal Technology Demo</h1>
              <p className="text-sm text-primary-foreground/60">Clinical Intelligence Platform · Dr. Alexis Collier</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-semibold">DEMO MODE</Badge>
            <Badge className="bg-warning/20 text-warning border border-warning/30 text-[10px] font-semibold">SIMULATED DATA</Badge>
            <Badge className="bg-destructive/20 text-destructive border border-destructive/30 text-[10px] font-semibold">NOT FOR CLINICAL USE</Badge>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-primary" />
              <p className="text-xs font-semibold text-primary-foreground/80 tracking-wide">Patent #1 — ICU Mortality Prediction · Manuscript Validation Results</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl px-4 py-3 text-center backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-[10px] font-semibold text-primary-foreground/70 uppercase tracking-wider">{s.label}</p>
                <p className="text-[10px] text-primary-foreground/40">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer bar */}
      <div className="bg-destructive/5 border-b border-destructive/20 py-2 px-4 text-center text-[11px] text-destructive font-medium">
        Development Prototype · Only VitaSignal Mortality (Patent #1) has completed validation · All other components are design phase · Mock data only
      </div>

      {/* Main Content */}
      <section className="py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <nav className="lg:w-72 shrink-0 animate-fade-in">
              <div className="bg-card border border-border/40 rounded-2xl shadow-sm overflow-hidden lg:sticky lg:top-24">
                {patentGroups.map((group, idx) => {
                  const isExpanded = expandedGroups[group.id];
                  const hasActiveTab = group.tabs.some((t) => t.value === activeTab);

                  return (
                    <div key={group.id}>
                      {idx > 0 && <Separator />}
                      {/* Group header — collapsible */}
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className={cn(
                          'w-full flex items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/50',
                          hasActiveTab && 'bg-muted/30'
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge className={cn(group.badgeColor, 'text-[9px] h-4 shrink-0')}>{group.badge}</Badge>
                          <span className="text-[11px] font-semibold text-foreground/80 truncate">{group.label.split(' — ')[1]}</span>
                        </div>
                        <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform', isExpanded && 'rotate-180')} />
                      </button>

                      {/* Tabs */}
                      <div
                        className={cn(
                          'overflow-hidden transition-all duration-200',
                          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        )}
                      >
                        <div className="px-2 pb-2 flex flex-col gap-0.5">
                          {group.tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.value;
                            return (
                              <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={cn(
                                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left',
                                  isActive
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                )}
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                {tab.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </nav>

            {/* Content Area */}
            <div className="flex-1 min-w-0 animate-fade-in">
              {/* Active patent breadcrumb */}
              {activeGroup && (
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={cn(activeGroup.badgeColor, 'text-[10px]')}>{activeGroup.badge}</Badge>
                  <span className="text-sm font-semibold text-foreground/70">{activeGroup.label.split(' — ')[1]}</span>
                  <span className="text-muted-foreground">›</span>
                  <span className="text-sm font-semibold text-foreground">{activeGroup.tabs.find((t) => t.value === activeTab)?.label}</span>
                </div>
              )}
              <div key={activeTab} className="animate-fade-in">
                {tabContent[activeTab]}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NursingDashboard;
