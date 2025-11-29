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
import { patients, type Patient, type RiskLevel, type RiskType, formatRelativeTime } from '@/data/patients';

export const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskLevelFilter, setRiskLevelFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [riskTypeFilter, setRiskTypeFilter] = useState<RiskType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'riskScore' | 'lastUpdated' | 'id'>('riskScore');
  const [timeOffset, setTimeOffset] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [workflowStep, setWorkflowStep] = useState('scan');

  // Update timestamps every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setTimeOffset(prev => prev + 1);
        setIsRefreshing(false);
      }, 500);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Update workflow step based on user actions
  useEffect(() => {
    if (selectedPatient) {
      setWorkflowStep('assess');
    } else if (riskLevelFilter === 'HIGH') {
      setWorkflowStep('prioritize');
    } else {
      setWorkflowStep('scan');
    }
  }, [selectedPatient, riskLevelFilter]);

  const getDisplayTime = useCallback((baseMinutes: number) => {
    return formatRelativeTime(baseMinutes + timeOffset);
  }, [timeOffset]);

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

  // Split patients: top 3 priority + rest for monitoring
  const priorityPatients = filteredPatients.slice(0, 3);
  const monitoringPatients = filteredPatients.slice(3);

  return (
    <div className="min-h-screen flex flex-col gradient-burgundy">
      <WarningBanner />
      <Header />
      
      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pb-24">
        {selectedPatient ? (
          <PatientDetail
            patient={selectedPatient}
            onBack={() => setSelectedPatient(null)}
          />
        ) : (
          <div className="animate-fade-in space-y-6">
            {/* Demo Summary - for breakout room intro */}
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
                {/* Priority Queue - Top 3 risk cards */}
                <PriorityQueue
                  patients={priorityPatients}
                  onSelect={setSelectedPatient}
                  displayTime={getDisplayTime}
                />

                {/* Monitoring List - Remaining patients */}
                <MonitoringList
                  patients={monitoringPatients}
                  onSelect={setSelectedPatient}
                  displayTime={getDisplayTime}
                />
              </>
            ) : (
              <div className="text-center py-16 bg-card/30 rounded-xl border border-border/20">
                <p className="text-muted-foreground text-sm">
                  No patients match the current filters.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
