import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { FilterBar } from './FilterBar';
import { PatientDetail } from './PatientDetail';
import { WarningBanner } from './WarningBanner';
import { ClinicalWorkflowBar } from './ClinicalWorkflowBar';
import { PriorityQueue } from './PriorityQueue';
import { MonitoringList } from './MonitoringList';
import { QuickStats } from './QuickStats';
import { WorkflowSequence } from './WorkflowSequence';
import { DemoSummary } from './DemoSummary';
import { DemoModeController } from './DemoModeController';
import { PerformancePanel } from './PerformancePanel';
import { InvestorKPIs } from './InvestorKPIs';
import { LiveMetricsBar } from './LiveMetricsBar';
import { DBSCalculator } from './DBSCalculator';
import { ROICalculator } from './ROICalculator';
import { LinkedCalculatorView } from './LinkedCalculatorView';
import { ResearchCharts } from './ResearchCharts';
import { AIToolsPanel } from './AIToolsPanel';
import { ICUMortalityPrediction } from './ICUMortalityPrediction';
import { SkipLink } from '@/components/SkipLink';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { usePatients } from '@/hooks/usePatients';
import { usePatientSelection } from '@/hooks/usePatientSelection';
import { useDemoScenarios } from '@/hooks/useDemoScenarios';
import { useTimeOffset } from '@/hooks/useTimeOffset';
import { Activity, FileText, DollarSign, Link2, BarChart3, Sparkles, HeartPulse } from 'lucide-react';

// Skip link targets for keyboard navigation (WCAG 2.1 AA)
const skipLinkTargets = [
  { id: 'main-content', label: 'Skip to main content' },
  { id: 'workflow-nav', label: 'Skip to workflow navigation' },
  { id: 'quick-stats', label: 'Skip to patient statistics' },
  { id: 'filters', label: 'Skip to filters' },
  { id: 'patient-list', label: 'Skip to patient list' },
];

export const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  
  // Initialize activeTab from URL param or default to 'dashboard'
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(
    ['dashboard', 'icu-mortality', 'dbs', 'roi', 'linked', 'charts', 'ai-tools'].includes(initialTab) 
      ? initialTab 
      : 'dashboard'
  );

  // Handle tab query parameter changes after initial load
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'icu-mortality', 'dbs', 'roi', 'linked', 'charts', 'ai-tools'].includes(tabParam)) {
      setActiveTab(tabParam);
      // Clear the query param after setting the tab
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Use the patients hook for data and filtering
  const {
    filteredPatients,
    priorityPatients,
    monitoringPatients,
    stats,
    filters,
    actions,
    findPatientById,
    findPatientByRiskType,
  } = usePatients();

  // Use the patient selection hook for selection, transitions, and keyboard shortcuts
  const {
    selectedPatient,
    isTransitioning,
    selectPatient,
    goBack,
    setSelectedPatient,
  } = usePatientSelection({
    findPatientById,
    onResetFilters: actions.resetFilters,
  });

  // Use the time offset hook for timestamp updates
  const { getDisplayTime } = useTimeOffset();

  // Generate demo scenarios using the hook
  const demoScenarios = useDemoScenarios({
    setSelectedPatient,
    findPatientById,
    findPatientByRiskType,
    setRiskLevelFilter: actions.setRiskLevelFilter,
    setRiskTypeFilter: actions.setRiskTypeFilter,
  });

  return (
    <div className={cn(
      "min-h-screen flex flex-col gradient-burgundy transition-all duration-300",
      isPresentationMode && "presentation-mode"
    )}>
      {/* Skip Links for Keyboard Navigation */}
      <SkipLink targets={skipLinkTargets} />
      
      {!isPresentationMode && <WarningBanner />}
      {!isPresentationMode && (
        <header role="banner">
          <Header />
        </header>
      )}
      
      <main 
        id="main-content"
        role="main"
        aria-label="Clinical Risk Dashboard"
        className={`flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pb-24 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        tabIndex={-1}
      >
        {selectedPatient ? (
          <PatientDetail
            patient={selectedPatient}
            onBack={goBack}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
            {/* Tab hint */}
            <div className="mb-3 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <p className="text-xs font-medium text-primary">
                👆 Click any tab below to explore different modules
              </p>
            </div>

            <div className="mb-6 bg-card/90 backdrop-blur-sm border-2 border-primary/30 p-3 rounded-2xl shadow-lg ring-2 ring-primary/10">
              <TabsList className="bg-transparent flex-wrap h-auto gap-1 p-0 w-full justify-start">
                {/* ── Clinical ── */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 hidden md:inline self-center">Clinical</span>
                <TabsTrigger value="dashboard" className="gap-2 rounded-xl border-2 border-dashed border-primary/40 data-[state=active]:border-solid data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:animate-pulse-subtle font-semibold transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 hover:shadow-md">
                  <Activity className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="icu-mortality" className="gap-2 rounded-xl border-2 border-dashed border-primary/40 data-[state=active]:border-solid data-[state=active]:border-primary data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:animate-pulse-subtle font-semibold transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 hover:shadow-md">
                  <HeartPulse className="h-4 w-4" />
                  ICU Mortality
                </TabsTrigger>

                <div className="w-px h-8 bg-primary/30 mx-1 hidden md:block self-center" />

                {/* ── Scoring & ROI ── */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 hidden md:inline self-center">Scoring</span>
                <TabsTrigger value="dbs" className="gap-2 rounded-xl border-2 border-dashed border-primary/40 data-[state=active]:border-solid data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:animate-pulse-subtle font-semibold transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 hover:shadow-md">
                  <FileText className="h-4 w-4" />
                  DBS Score
                </TabsTrigger>
                <TabsTrigger value="roi" className="gap-2 rounded-xl border-2 border-dashed border-primary/40 data-[state=active]:border-solid data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:animate-pulse-subtle font-semibold transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 hover:shadow-md">
                  <DollarSign className="h-4 w-4" />
                  ROI Calculator
                </TabsTrigger>
                <TabsTrigger value="linked" className="gap-2 rounded-xl border-2 border-dashed border-primary/40 data-[state=active]:border-solid data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:animate-pulse-subtle font-semibold transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 hover:shadow-md">
                  <Link2 className="h-4 w-4" />
                  Linked View
                </TabsTrigger>

                <div className="w-px h-8 bg-primary/30 mx-1 hidden md:block self-center" />

                {/* ── Research & AI ── */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 hidden md:inline self-center">Research</span>
                <TabsTrigger value="charts" className="gap-2 rounded-xl border-2 border-dashed border-primary/40 data-[state=active]:border-solid data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:animate-pulse-subtle font-semibold transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 hover:shadow-md">
                  <BarChart3 className="h-4 w-4" />
                  Research
                </TabsTrigger>
                <TabsTrigger value="ai-tools" className="gap-2 rounded-xl border-2 border-dashed border-primary/40 data-[state=active]:border-solid data-[state=active]:border-primary data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=inactive]:animate-pulse-subtle font-semibold transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:scale-105 hover:shadow-md">
                  <Sparkles className="h-4 w-4" />
                  AI Tools
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="space-y-6 mt-0">
              {/* Demo Summary */}
              <section aria-label="Demo overview">
                <DemoSummary className="mb-2" />
              </section>

              {/* Live System Metrics Bar */}
              <section aria-label="Live system metrics">
                <LiveMetricsBar />
              </section>

              {/* Investor-Focused KPIs */}
              <section aria-label="Impact metrics for investors">
                <InvestorKPIs />
              </section>

              {/* Clinical Workflow Context */}
              <nav id="workflow-nav" aria-label="Clinical workflow phases" tabIndex={-1}>
                <ClinicalWorkflowBar />
              </nav>

              {/* System Workflow Sequence */}
              <section aria-label="System workflow">
                <WorkflowSequence activeStep="output" />
              </section>

              {/* Quick Stats Overview */}
              <section id="quick-stats" aria-label="Patient statistics summary" tabIndex={-1}>
                <QuickStats
                  total={stats.total}
                  high={stats.high}
                  medium={stats.medium}
                  trending={stats.trending}
                />
              </section>

              {/* Filters */}
              <section id="filters" aria-label="Patient filters" tabIndex={-1}>
                <FilterBar
                  searchQuery={filters.searchQuery}
                  onSearchChange={actions.setSearchQuery}
                  riskLevelFilter={filters.riskLevelFilter}
                  onRiskLevelChange={actions.setRiskLevelFilter}
                  riskTypeFilter={filters.riskTypeFilter}
                  onRiskTypeChange={actions.setRiskTypeFilter}
                  sortBy={filters.sortBy}
                  onSortChange={actions.setSortBy}
                />
              </section>

              {filteredPatients.length > 0 ? (
                <div id="patient-list" tabIndex={-1} aria-label="Patient monitoring list">
                  {/* Priority Queue */}
                  <section aria-label="Priority patients requiring immediate attention">
                    <PriorityQueue
                      patients={priorityPatients}
                      onSelect={selectPatient}
                      displayTime={getDisplayTime}
                    />
                  </section>

                  {/* Monitoring List */}
                  <section aria-label="Additional patients for monitoring">
                    <MonitoringList
                      patients={monitoringPatients}
                      onSelect={selectPatient}
                      displayTime={getDisplayTime}
                    />
                  </section>
                </div>
              ) : (
                <div 
                  className="text-center py-20 bg-card/30 rounded-2xl border border-border/20"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-muted-foreground text-base">
                    No patients match the current filters.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="dbs" className="mt-0">
              <DBSCalculator />
            </TabsContent>

            <TabsContent value="roi" className="mt-0">
              <ROICalculator />
            </TabsContent>

            <TabsContent value="linked" className="mt-0">
              <LinkedCalculatorView />
            </TabsContent>

            <TabsContent value="charts" className="mt-0">
              <ResearchCharts />
            </TabsContent>

            <TabsContent value="ai-tools" className="mt-0">
              <AIToolsPanel />
            </TabsContent>

            <TabsContent value="icu-mortality" className="mt-0">
              <ICUMortalityPrediction />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {!isPresentationMode && (
        <footer role="contentinfo">
          <Footer />
        </footer>
      )}

      {/* Demo Mode Controller */}
      <DemoModeController 
        scenarios={demoScenarios} 
        isFullscreen={isPresentationMode}
        onFullscreenChange={setIsPresentationMode}
      />

      {/* Performance Monitoring Panel */}
      <PerformancePanel />
    </div>
  );
};
