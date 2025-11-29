import { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FilterBar } from './FilterBar';
import { PatientCard } from './PatientCard';
import { PatientDetail } from './PatientDetail';
import { WarningBanner } from './WarningBanner';
import { ClinicalWorkflowBar } from './ClinicalWorkflowBar';
import { patients, type Patient, type RiskLevel, type RiskType, formatRelativeTime } from '@/data/patients';
import { Users, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const highRiskPatients = filteredPatients.filter(p => p.riskLevel === 'HIGH');
  const otherPatients = filteredPatients.filter(p => p.riskLevel !== 'HIGH');

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
          <>
            <ClinicalWorkflowBar activeStep={workflowStep} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 animate-fade-in">
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Total"
                value={stats.total}
                color="primary"
              />
              <StatCard
                icon={<AlertTriangle className="w-5 h-5" />}
                label="High Risk"
                value={stats.high}
                color="high"
                highlight
              />
              <StatCard
                icon={<Activity className="w-5 h-5" />}
                label="Medium Risk"
                value={stats.medium}
                color="medium"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="Trending Up"
                value={stats.trending}
                color="warning"
              />
            </div>

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

            {highRiskPatients.length > 0 && riskLevelFilter !== 'LOW' && riskLevelFilter !== 'MEDIUM' && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-risk-high/30" />
                  <h2 className="text-sm font-bold text-risk-high uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Immediate Attention ({highRiskPatients.length})
                  </h2>
                  <div className="h-px flex-1 bg-risk-high/30" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {highRiskPatients.map((patient, index) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      onClick={() => setSelectedPatient(patient)}
                      index={index}
                      displayTime={getDisplayTime(patient.lastUpdatedMinutes)}
                      isRefreshing={isRefreshing}
                    />
                  ))}
                </div>
              </div>
            )}

            {otherPatients.length > 0 && riskLevelFilter !== 'HIGH' && (
              <div>
                {highRiskPatients.length > 0 && riskLevelFilter === 'ALL' && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-border/50" />
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                      Monitor ({otherPatients.length})
                    </h2>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otherPatients.map((patient, index) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      onClick={() => setSelectedPatient(patient)}
                      index={index + highRiskPatients.length}
                      displayTime={getDisplayTime(patient.lastUpdatedMinutes)}
                      isRefreshing={isRefreshing}
                    />
                  ))}
                </div>
              </div>
            )}

            {(riskLevelFilter === 'HIGH' || riskLevelFilter === 'MEDIUM' || riskLevelFilter === 'LOW') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((patient, index) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onClick={() => setSelectedPatient(patient)}
                    index={index}
                    displayTime={getDisplayTime(patient.lastUpdatedMinutes)}
                    isRefreshing={isRefreshing}
                  />
                ))}
              </div>
            )}

            {filteredPatients.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <p className="text-muted-foreground text-lg">
                  No patients match the current filters.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'primary' | 'high' | 'medium' | 'warning';
  highlight?: boolean;
}

const StatCard = ({ icon, label, value, color, highlight }: StatCardProps) => {
  const colorStyles = {
    primary: {
      icon: 'text-primary',
      bg: 'bg-primary/10',
      value: 'text-foreground',
    },
    high: {
      icon: 'text-risk-high',
      bg: 'bg-risk-high/10',
      value: 'text-risk-high',
    },
    medium: {
      icon: 'text-risk-medium',
      bg: 'bg-risk-medium/10',
      value: 'text-risk-medium',
    },
    warning: {
      icon: 'text-warning',
      bg: 'bg-warning/10',
      value: 'text-warning',
    },
  }[color];

  return (
    <div
      className={cn(
        "bg-card/80 rounded-lg border border-border/30 p-3 flex items-center gap-3",
        highlight && "ring-1 ring-risk-high/30"
      )}
    >
      <div className={cn("p-2 rounded-md", colorStyles.bg)}>
        <span className={colorStyles.icon}>{icon}</span>
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
        <p className={cn("text-xl font-bold", colorStyles.value)}>{value}</p>
      </div>
    </div>
  );
};
