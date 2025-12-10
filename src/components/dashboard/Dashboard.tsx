import { useState, useMemo, useEffect, useCallback } from 'react';
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
import { patients, type Patient, type RiskLevel, type RiskType, formatRelativeTime } from '@/data/patients';
import { cn } from '@/lib/utils';

export const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskLevelFilter, setRiskLevelFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [riskTypeFilter, setRiskTypeFilter] = useState<RiskType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'riskScore' | 'lastUpdated' | 'id'>('riskScore');
  const [timeOffset, setTimeOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

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
        const demoPatient = patients.find(p => p.id === 'PT-2847');
        if (demoPatient) handleSelectPatient(demoPatient);
      }
      if (e.key === '2' && !selectedPatient) {
        const demoPatient = patients.find(p => p.id === 'PT-1923');
        if (demoPatient) handleSelectPatient(demoPatient);
      }
      if (e.key === '3' && !selectedPatient) {
        const demoPatient = patients.find(p => p.id === 'PT-5612');
        if (demoPatient) handleSelectPatient(demoPatient);
      }
      if (e.key === 'r' && !selectedPatient) {
        setSearchQuery('');
        setRiskLevelFilter('ALL');
        setRiskTypeFilter('ALL');
        setSortBy('riskScore');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPatient]);

  const getDisplayTime = useCallback((baseMinutes: number) => {
    return formatRelativeTime(baseMinutes + timeOffset);
  }, [timeOffset]);

  const handleSelectPatient = (patient: Patient) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPatient(patient);
      setIsTransitioning(false);
    }, 200);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPatient(null);
      setIsTransitioning(false);
    }, 200);
  };

  const filteredPatients = useMemo(() => {
    let result = [...patients];

    if (searchQuery) {
      result = result.filter((p) =>
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (riskLevelFilter !== 'ALL') {
      result = result.filter((p) => p.riskLevel === riskLevelFilter);
    }

    if (riskTypeFilter !== 'ALL') {
      result = result.filter((p) => p.riskType === riskTypeFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'riskScore':
          return b.riskScore - a.riskScore;
        case 'id':
          return a.id.localeCompare(b.id);
        case 'lastUpdated':
          return a.lastUpdatedMinutes - b.lastUpdatedMinutes;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, riskLevelFilter, riskTypeFilter, sortBy]);

  const stats = useMemo(() => ({
    total: patients.length,
    high: patients.filter((p) => p.riskLevel === 'HIGH').length,
    medium: patients.filter((p) => p.riskLevel === 'MEDIUM').length,
    trending: patients.filter((p) => p.trend === 'up').length,
  }), []);

  // Demo scenarios for auto-advance mode (aligned to ~5min presentation)
  const demoScenarios: DemoScenario[] = useMemo(() => [
    {
      id: 'intro',
      label: 'Dashboard Overview',
      description: 'Unit-level view of nurse-sensitive outcomes monitoring',
      duration: 10,
      action: () => {
        setSelectedPatient(null);
        setRiskTypeFilter('ALL');
        setRiskLevelFilter('ALL');
      },
    },
    {
      id: 'high-risk-falls',
      label: 'Falls Risk - SHAP Analysis',
      description: 'Patient A01: Post-op sedation + mobility → interpretable risk factors',
      duration: 12,
      action: () => {
        const fallsPatient = patients.find(p => p.id === 'Patient A01');
        if (fallsPatient) setSelectedPatient(fallsPatient);
      },
    },
    {
      id: 'cauti-scenario',
      label: 'CAUTI Risk Escalation',
      description: 'Patient C00: Foley Day 8 + fever → catheter removal workflow',
      duration: 12,
      action: () => {
        const cautiPatient = patients.find(p => p.riskType === 'CAUTI');
        if (cautiPatient) setSelectedPatient(cautiPatient);
      },
    },
    {
      id: 'pressure-injury',
      label: 'Pressure Injury Prevention',
      description: 'HAPI risk with Braden subscale + repositioning protocol',
      duration: 10,
      action: () => {
        const hapiPatient = patients.find(p => p.riskType === 'Pressure Injury');
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
        setRiskLevelFilter('HIGH');
        setRiskTypeFilter('ALL');
      },
    },
    {
      id: 'handoff-context',
      label: 'Shift Handoff',
      description: 'Click Handoff phase above → generate CAUTI report',
      duration: 10,
      action: () => {
        setSelectedPatient(null);
        setRiskLevelFilter('ALL');
        setRiskTypeFilter('ALL');
      },
    },
    {
      id: 'summary',
      label: 'Q&A Discussion',
      description: 'EHR-driven, interpretable AI for nurse-sensitive outcomes',
      duration: 10,
      action: () => {
        setSelectedPatient(null);
        setRiskLevelFilter('ALL');
        setRiskTypeFilter('ALL');
      },
    },
  ], []);

  const priorityPatients = filteredPatients.slice(0, 3);
  const monitoringPatients = filteredPatients.slice(3);

  return (
    <div className={cn(
      "min-h-screen flex flex-col gradient-burgundy transition-all duration-300",
      isPresentationMode && "presentation-mode"
    )}>
      {!isPresentationMode && <WarningBanner />}
      {!isPresentationMode && <Header />}
      
      <main className={`flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pb-24 transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {selectedPatient ? (
          <PatientDetail
            patient={selectedPatient}
            onBack={handleBack}
          />
        ) : (
          <div className="animate-fade-in space-y-6">
            {/* Demo Summary */}
            <DemoSummary className="mb-2" />

            {/* Clinical Workflow Context */}
            <ClinicalWorkflowBar />

            {/* System Workflow Sequence */}
            <WorkflowSequence activeStep="output" />

            {/* Quick Stats Overview */}
            <QuickStats
              total={stats.total}
              high={stats.high}
              medium={stats.medium}
              trending={stats.trending}
            />

            {/* Filters */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              riskLevelFilter={riskLevelFilter}
              onRiskLevelChange={setRiskLevelFilter}
              riskTypeFilter={riskTypeFilter}
              onRiskTypeChange={setRiskTypeFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {filteredPatients.length > 0 ? (
              <>
                {/* Priority Queue */}
                <PriorityQueue
                  patients={priorityPatients}
                  onSelect={handleSelectPatient}
                  displayTime={getDisplayTime}
                />

                {/* Monitoring List */}
                <MonitoringList
                  patients={monitoringPatients}
                  onSelect={handleSelectPatient}
                  displayTime={getDisplayTime}
                />
              </>
            ) : (
              <div className="text-center py-20 bg-card/30 rounded-2xl border border-border/20">
                <p className="text-muted-foreground text-base">
                  No patients match the current filters.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {!isPresentationMode && <Footer />}

      {/* Demo Mode Controller */}
      <DemoModeController 
        scenarios={demoScenarios} 
        isFullscreen={isPresentationMode}
        onFullscreenChange={setIsPresentationMode}
      />
    </div>
  );
};
