import { useState, useEffect, useCallback } from 'react';
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
import { DemoModeController, type DemoScenario } from './DemoModeController';
import { PerformancePanel } from './PerformancePanel';
import { InvestorKPIs } from './InvestorKPIs';
import { LiveMetricsBar } from './LiveMetricsBar';
import { SkipLink } from '@/components/SkipLink';
import { cn } from '@/lib/utils';
import { usePerformanceTracking } from '@/hooks/usePerformance';
import { usePatients } from '@/hooks/usePatients';
import { performanceMonitor } from '@/lib/performanceMonitor';
import { formatRelativeTime } from '@/utils/timeFormatters';
import type { Patient } from '@/types/patient';

// Skip link targets for keyboard navigation (WCAG 2.1 AA)
const skipLinkTargets = [
  { id: 'main-content', label: 'Skip to main content' },
  { id: 'workflow-nav', label: 'Skip to workflow navigation' },
  { id: 'quick-stats', label: 'Skip to patient statistics' },
  { id: 'filters', label: 'Skip to filters' },
  { id: 'patient-list', label: 'Skip to patient list' },
];

export const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [timeOffset, setTimeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

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

  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('Dashboard');

  // Update timestamps every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOffset(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts for demo control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPatient) {
        handleBack();
      }
      if (e.key === 'f' && !selectedPatient) {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
      if (e.key === '1' && !selectedPatient) {
        const demoPatient = findPatientById('PT-2847');
        if (demoPatient) handleSelectPatient(demoPatient);
      }
      if (e.key === '2' && !selectedPatient) {
        const demoPatient = findPatientById('PT-1923');
        if (demoPatient) handleSelectPatient(demoPatient);
      }
      if (e.key === '3' && !selectedPatient) {
        const demoPatient = findPatientById('PT-5612');
        if (demoPatient) handleSelectPatient(demoPatient);
      }
      if (e.key === 'r' && !selectedPatient) {
        actions.resetFilters();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPatient, findPatientById, actions]);

  const getDisplayTime = useCallback((baseMinutes: number) => {
    return formatRelativeTime(baseMinutes + timeOffset);
  }, [timeOffset]);

  // Tracked patient selection
  const handleSelectPatient = useCallback((patient: Patient) => {
    const endTracking = trackInteraction('patient-selection');
    performanceMonitor.addMetric({
      name: 'patient-selected',
      value: 1,
      unit: 'count',
      timestamp: Date.now(),
      category: 'interaction',
    });
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPatient(patient);
      setIsTransitioning(false);
      endTracking();
    }, 200);
  }, [trackInteraction]);

  const handleBack = useCallback(() => {
    const endTracking = trackInteraction('patient-deselection');
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPatient(null);
      setIsTransitioning(false);
      endTracking();
    }, 200);
  }, [trackInteraction]);

  // Demo scenarios for auto-advance mode (aligned to ~5min presentation)
  const demoScenarios: DemoScenario[] = [
    {
      id: 'intro',
      label: 'Dashboard Overview',
      description: 'Unit-level view of nurse-sensitive outcomes monitoring',
      duration: 10,
      action: () => {
        setSelectedPatient(null);
        actions.setRiskTypeFilter('ALL');
        actions.setRiskLevelFilter('ALL');
      },
    },
    {
      id: 'high-risk-falls',
      label: 'Falls Risk - SHAP Analysis',
      description: 'Patient A01: Post-op sedation + mobility → interpretable risk factors',
      duration: 12,
      action: () => {
        const fallsPatient = findPatientById('Patient A01');
        if (fallsPatient) setSelectedPatient(fallsPatient);
      },
    },
    {
      id: 'cauti-scenario',
      label: 'CAUTI Risk Escalation',
      description: 'Patient C00: Foley Day 8 + fever → catheter removal workflow',
      duration: 12,
      action: () => {
        const cautiPatient = findPatientByRiskType('CAUTI');
        if (cautiPatient) setSelectedPatient(cautiPatient);
      },
    },
    {
      id: 'pressure-injury',
      label: 'Pressure Injury Prevention',
      description: 'HAPI risk with Braden subscale + repositioning protocol',
      duration: 10,
      action: () => {
        const hapiPatient = findPatientByRiskType('Pressure Injury');
        if (hapiPatient) setSelectedPatient(hapiPatient);
      },
    },
    {
      id: 'filter-demo',
      label: 'Priority Filtering',
      description: 'Filter to high-risk patients for focused nursing rounds',
      duration: 8,
      action: () => {
        setSelectedPatient(null);
        actions.setRiskLevelFilter('HIGH');
        actions.setRiskTypeFilter('ALL');
      },
    },
    {
      id: 'handoff-context',
      label: 'Shift Handoff',
      description: 'Click Handoff phase above → generate CAUTI report',
      duration: 10,
      action: () => {
        setSelectedPatient(null);
        actions.setRiskLevelFilter('ALL');
        actions.setRiskTypeFilter('ALL');
      },
    },
    {
      id: 'summary',
      label: 'Q&A Discussion',
      description: 'EHR-driven, interpretable AI for nurse-sensitive outcomes',
      duration: 10,
      action: () => {
        setSelectedPatient(null);
        actions.setRiskLevelFilter('ALL');
        actions.setRiskTypeFilter('ALL');
      },
    },
  ];

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
            onBack={handleBack}
          />
        ) : (
          <div className="animate-fade-in space-y-6">
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
                    onSelect={handleSelectPatient}
                    displayTime={getDisplayTime}
                  />
                </section>

                {/* Monitoring List */}
                <section aria-label="Additional patients for monitoring">
                  <MonitoringList
                    patients={monitoringPatients}
                    onSelect={handleSelectPatient}
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
          </div>
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
