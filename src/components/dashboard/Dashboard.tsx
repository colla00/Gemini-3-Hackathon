import { useState, useMemo } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FilterBar } from './FilterBar';
import { PatientCard } from './PatientCard';
import { PatientDetail } from './PatientDetail';
import { patients, type Patient, type RiskLevel, type RiskType } from '@/data/patients';
import { Users, AlertTriangle, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskLevelFilter, setRiskLevelFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [riskTypeFilter, setRiskTypeFilter] = useState<RiskType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'riskScore' | 'lastUpdated' | 'id'>('riskScore');

  const filteredPatients = useMemo(() => {
    let result = [...patients];

    // Search filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Risk level filter
    if (riskLevelFilter !== 'ALL') {
      result = result.filter((p) => p.riskLevel === riskLevelFilter);
    }

    // Risk type filter
    if (riskTypeFilter !== 'ALL') {
      result = result.filter((p) => p.riskType === riskTypeFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'riskScore':
          return b.riskScore - a.riskScore;
        case 'id':
          return a.id.localeCompare(b.id);
        case 'lastUpdated':
          // Simple sort by the text - in real app would use timestamps
          return a.lastUpdated.localeCompare(b.lastUpdated);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, riskLevelFilter, riskTypeFilter, sortBy]);

  const stats = useMemo(() => ({
    total: patients.length,
    high: patients.filter((p) => p.riskLevel === 'HIGH').length,
    trending: patients.filter((p) => p.trend === 'up').length,
  }), []);

  return (
    <div className="min-h-screen flex flex-col gradient-burgundy">
      <Header />
      
      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        {selectedPatient ? (
          <PatientDetail
            patient={selectedPatient}
            onBack={() => setSelectedPatient(null)}
          />
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in">
              <div className="bg-card rounded-xl border border-border/50 p-4 shadow-card flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
              
              <div className="bg-card rounded-xl border border-border/50 p-4 shadow-card flex items-center gap-4">
                <div className="p-3 rounded-lg bg-risk-high/20">
                  <AlertTriangle className="w-6 h-6 text-risk-high" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold text-risk-high">{stats.high}</p>
                </div>
              </div>
              
              <div className="bg-card rounded-xl border border-border/50 p-4 shadow-card flex items-center gap-4">
                <div className="p-3 rounded-lg bg-risk-medium/20">
                  <TrendingUp className="w-6 h-6 text-risk-medium" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trending Up</p>
                  <p className="text-2xl font-bold text-risk-medium">{stats.trending}</p>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
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

            {/* Patient Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient, index) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => setSelectedPatient(patient)}
                  index={index}
                />
              ))}
            </div>

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
