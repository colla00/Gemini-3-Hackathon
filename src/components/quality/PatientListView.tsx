import { useState } from 'react';
import { Clock, Heart, Thermometer, Droplets, ChevronRight, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { patients, getRiskLevelColor, type PatientData } from '@/data/nursingOutcomes';
import { RiskSparkline } from './RiskSparkline';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { InterventionsPanel } from './InterventionsPanel';

type SortField = 'fallsRisk' | 'hapiRisk' | 'cautiRisk' | 'id';

const PatientRow = ({ patient, onClick, isSelected, index }: { patient: PatientData; onClick: () => void; isSelected: boolean; index: number }) => {
  const isHighRisk = patient.fallsLevel === 'HIGH';
  
  return (
    <tr 
      className={cn(
        "hover:bg-secondary/30 cursor-pointer transition-all duration-200 border-b border-border/20 opacity-0 animate-fade-in",
        isHighRisk && "bg-risk-high/5",
        isSelected && "bg-primary/10"
      )}
      onClick={onClick}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
    >
      {/* Patient Info */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {isHighRisk && (
            <span className="w-2 h-2 rounded-full bg-risk-high animate-pulse shrink-0" />
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground">{patient.mrn}</span>
              <span className="text-xs text-muted-foreground">• {patient.age}{patient.sex}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
              <span>Rm {patient.bed}</span>
              <span>•</span>
              <span>{patient.diagnosis}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[10px]">
              <span className="text-muted-foreground/70">Adm {patient.admitDate} • LOS {patient.los}d</span>
              <span className="text-primary/70">• {patient.assignedNurse}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Falls Risk with Sparkline */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-20">
            <div className="flex items-baseline gap-0.5">
              <span className={cn("text-lg font-bold", getRiskLevelColor(patient.fallsLevel))}>
                {patient.fallsRisk}
              </span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <ConfidenceIndicator confidence={patient.fallsConfidence} showLabel={false} size="sm" />
            </div>
          </div>
          <RiskSparkline data={patient.fallsTrend} level={patient.fallsLevel} />
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
            patient.fallsLevel === 'HIGH' ? 'bg-risk-high/20 text-risk-high' :
            patient.fallsLevel === 'MODERATE' ? 'bg-risk-medium/20 text-risk-medium' :
            'bg-risk-low/20 text-risk-low'
          )}>
            {patient.fallsLevel}
          </span>
        </div>
      </td>

      {/* HAPI Risk */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className={cn("text-sm font-semibold", getRiskLevelColor(patient.hapiLevel))}>
                {patient.hapiRisk}
              </span>
              <span className="text-[10px] text-muted-foreground">%</span>
            </div>
            <ConfidenceIndicator confidence={patient.hapiConfidence} showLabel={false} size="sm" />
          </div>
        </div>
      </td>

      {/* CAUTI Risk */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className={cn("text-sm font-semibold", getRiskLevelColor(patient.cautiLevel))}>
                {patient.cautiRisk}
              </span>
              <span className="text-[10px] text-muted-foreground">%</span>
            </div>
            <ConfidenceIndicator confidence={patient.cautiConfidence} showLabel={false} size="sm" />
          </div>
        </div>
      </td>

      {/* Interventions */}
      <td className="py-3 px-4">
        <InterventionsPanel patient={patient} compact />
      </td>

      {/* Actions */}
      <td className="py-3 px-4">
        <button className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

const PatientDetailPanel = ({ patient, onClose }: { patient: PatientData; onClose: () => void }) => (
  <div className="glass-card rounded-lg p-4 border-l-4 border-l-primary animate-slide-in-right">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-foreground">{patient.mrn}</h3>
          <span className="text-sm text-muted-foreground">{patient.age}{patient.sex}</span>
        </div>
        <span className="text-xs text-muted-foreground">Rm {patient.bed} • {patient.diagnosis}</span>
        <div className="flex items-center gap-2 mt-1 text-[10px]">
          <span className="text-muted-foreground">Adm {patient.admitDate} • LOS {patient.los}d</span>
          <span className="text-primary">• {patient.assignedNurse}</span>
        </div>
      </div>
      <button onClick={onClose} className="p-1.5 rounded hover:bg-secondary/50 text-muted-foreground">
        ✕
      </button>
    </div>

    {/* Last Assessed */}
    <div className="flex items-center gap-2 p-2 rounded bg-primary/10 border border-primary/30 mb-4 text-[11px]">
      <Clock className="w-3.5 h-3.5 text-primary" />
      <span className="text-primary font-medium">Last assessed: {patient.lastAssessed}</span>
      <span className="text-muted-foreground">by {patient.assignedNurse}</span>
    </div>

    {/* Risk Scores with Confidence */}
    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className={cn("p-3 rounded-lg text-center", patient.fallsLevel === 'HIGH' ? 'bg-risk-high/10 border border-risk-high/30' : 'bg-muted/20')}>
        <span className="text-[10px] text-muted-foreground block">Falls</span>
        <span className={cn("text-2xl font-bold", getRiskLevelColor(patient.fallsLevel))}>{patient.fallsRisk}%</span>
        <div className="mt-1"><ConfidenceIndicator confidence={patient.fallsConfidence} size="sm" /></div>
      </div>
      <div className={cn("p-3 rounded-lg text-center", patient.hapiLevel === 'HIGH' ? 'bg-risk-high/10 border border-risk-high/30' : 'bg-muted/20')}>
        <span className="text-[10px] text-muted-foreground block">HAPI</span>
        <span className={cn("text-2xl font-bold", getRiskLevelColor(patient.hapiLevel))}>{patient.hapiRisk}%</span>
        <div className="mt-1"><ConfidenceIndicator confidence={patient.hapiConfidence} size="sm" /></div>
      </div>
      <div className={cn("p-3 rounded-lg text-center", patient.cautiLevel === 'HIGH' ? 'bg-risk-high/10 border border-risk-high/30' : 'bg-muted/20')}>
        <span className="text-[10px] text-muted-foreground block">CAUTI</span>
        <span className={cn("text-2xl font-bold", getRiskLevelColor(patient.cautiLevel))}>{patient.cautiRisk}%</span>
        <div className="mt-1"><ConfidenceIndicator confidence={patient.cautiConfidence} size="sm" /></div>
      </div>
    </div>

    {/* 24h Trend */}
    <div className="p-3 rounded-lg bg-secondary/30 mb-4">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-2">24-Hour Falls Risk Trend</span>
      <div className="flex items-center gap-4">
        <RiskSparkline data={patient.fallsTrend} level={patient.fallsLevel} width={120} height={40} />
        <div className="text-[10px] text-muted-foreground">
          <div>Start: {patient.fallsTrend[0]?.value.toFixed(0)}%</div>
          <div>Current: {patient.fallsTrend[patient.fallsTrend.length - 1]?.value.toFixed(0)}%</div>
        </div>
      </div>
    </div>

    {/* Vitals */}
    <div className="p-3 rounded-lg bg-secondary/30 mb-4">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase block mb-2">Current Vitals</span>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-risk-high" />
          <span className="text-muted-foreground">HR:</span>
          <span className="text-foreground font-medium">{patient.vitals.heartRate} bpm</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">BP:</span>
          <span className="text-foreground font-medium">{patient.vitals.bp}</span>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="w-3.5 h-3.5 text-risk-medium" />
          <span className="text-muted-foreground">Temp:</span>
          <span className="text-foreground font-medium">{patient.vitals.temp}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 text-center text-primary text-[10px]">O₂</span>
          <span className="text-muted-foreground">SpO2:</span>
          <span className="text-foreground font-medium">{patient.vitals.o2Sat}</span>
        </div>
      </div>
    </div>

    {/* Interventions */}
    <InterventionsPanel patient={patient} />

    {/* Quick Actions */}
    <div className="flex gap-2 mt-4">
      <button className="flex-1 py-2 px-3 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
        View SHAP Analysis
      </button>
      <button className="py-2 px-3 rounded bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
        <Eye className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

export const PatientListView = () => {
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [sortField, setSortField] = useState<SortField>('fallsRisk');
  const [filterLevel, setFilterLevel] = useState<'all' | 'HIGH' | 'MODERATE' | 'LOW'>('all');

  const filteredPatients = patients.filter(p => 
    filterLevel === 'all' || p.fallsLevel === filterLevel
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortField === 'id') return a.id.localeCompare(b.id);
    return b[sortField] - a[sortField];
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">Patient Worklist</h2>
          <span className="text-[10px] text-muted-foreground px-2 py-0.5 bg-secondary rounded">
            {sortedPatients.length} of {patients.length} patients
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded">
            {(['all', 'HIGH', 'MODERATE', 'LOW'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={cn(
                  "px-2 py-1 rounded text-[10px] font-medium transition-colors",
                  filterLevel === level 
                    ? level === 'HIGH' ? 'bg-risk-high/20 text-risk-high' :
                      level === 'MODERATE' ? 'bg-risk-medium/20 text-risk-medium' :
                      level === 'LOW' ? 'bg-risk-low/20 text-risk-low' :
                      'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {level === 'all' ? 'All' : level}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="text-[10px] py-1 px-2 rounded bg-secondary border border-border/50 text-foreground"
          >
            <option value="fallsRisk">Falls Risk ↓</option>
            <option value="hapiRisk">HAPI Risk ↓</option>
            <option value="cautiRisk">CAUTI Risk ↓</option>
            <option value="id">Patient ID</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Table */}
        <div className={cn("glass-card rounded-lg overflow-hidden flex-1", selectedPatient && "lg:flex-[2]")}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30 bg-secondary/30">
                  <th className="py-2 px-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Patient</th>
                  <th className="py-2 px-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Falls Risk (24h Trend)</th>
                  <th className="py-2 px-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">HAPI</th>
                  <th className="py-2 px-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">CAUTI</th>
                  <th className="py-2 px-4 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Interventions</th>
                  <th className="py-2 px-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {sortedPatients.map((patient, index) => (
                  <PatientRow 
                    key={patient.id} 
                    patient={patient} 
                    onClick={() => setSelectedPatient(patient)}
                    isSelected={selectedPatient?.id === patient.id}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedPatient && (
          <div className="hidden lg:block w-96">
            <PatientDetailPanel patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground">
        <span className="font-medium">Risk Thresholds:</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-risk-high" />
          <span>High (&gt;65%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-risk-medium" />
          <span>Moderate (35-65%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-risk-low" />
          <span>Low (&lt;35%)</span>
        </div>
        <span className="text-primary">• Sparklines show 24-hour trend</span>
        <span className="text-warning">• Confidence indicates model reliability</span>
      </div>
    </div>
  );
};
