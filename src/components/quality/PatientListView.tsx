import { Clock, Heart, Thermometer, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { patients, getRiskLevelColor, getRiskLevelBorder, type PatientData } from '@/data/nursingOutcomes';

const PatientCard = ({ patient, index }: { patient: PatientData; index: number }) => {
  const isHighRisk = patient.fallsLevel === 'HIGH';
  
  return (
    <div
      className={cn(
        "glass-card rounded-[20px] p-6 transition-all duration-300 hover:scale-[1.01] cursor-pointer",
        "border-l-4",
        getRiskLevelBorder(patient.fallsLevel),
        isHighRisk && "animate-pulse-live"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Patient Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">{patient.id}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Last Updated: {patient.lastUpdated}</span>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
          patient.fallsLevel === 'HIGH' ? 'bg-risk-high/20 text-risk-high' :
          patient.fallsLevel === 'MODERATE' ? 'bg-risk-medium/20 text-risk-medium' :
          'bg-risk-low/20 text-risk-low'
        )}>
          {patient.fallsLevel}
        </div>
      </div>

      {/* Falls Risk Score */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <span className="text-xs text-muted-foreground block mb-1">Falls Risk</span>
          <div className="flex items-end gap-1">
            <span className={cn(
              "text-4xl font-extrabold",
              getRiskLevelColor(patient.fallsLevel)
            )}>
              {patient.fallsRisk}
            </span>
            <span className="text-lg text-muted-foreground mb-1">%</span>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex-1">
          <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                patient.fallsLevel === 'HIGH' ? 'bg-risk-high' :
                patient.fallsLevel === 'MODERATE' ? 'bg-risk-medium' :
                'bg-risk-low'
              )}
              style={{ width: `${patient.fallsRisk}%` }}
            />
          </div>
        </div>
      </div>

      {/* Other Risk Scores */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
          <span className="text-xs text-muted-foreground block">HAPI Risk</span>
          <span className={cn("text-xl font-bold", getRiskLevelColor(patient.hapiLevel))}>
            {patient.hapiRisk}%
          </span>
        </div>
        <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
          <span className="text-xs text-muted-foreground block">CAUTI Risk</span>
          <span className={cn("text-xl font-bold", getRiskLevelColor(patient.cautiLevel))}>
            {patient.cautiRisk}%
          </span>
        </div>
      </div>

      {/* Vitals Row */}
      <div className="flex items-center gap-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-risk-high" />
          <span className="text-xs text-muted-foreground">{patient.vitals.heartRate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">{patient.vitals.bp}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-risk-medium" />
          <span className="text-xs text-muted-foreground">{patient.vitals.temp}</span>
        </div>
      </div>
    </div>
  );
};

export const PatientListView = () => {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Patient Risk Overview
        </h2>
        <p className="text-muted-foreground">
          Color-coded risk stratification with real-time monitoring
        </p>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient, index) => (
          <PatientCard key={patient.id} patient={patient} index={index} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-xl bg-card/30 border border-border/30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-risk-high" />
          <span className="text-sm text-muted-foreground">High Risk (&gt;65%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-risk-medium" />
          <span className="text-sm text-muted-foreground">Moderate (35-65%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-risk-low" />
          <span className="text-sm text-muted-foreground">Low (&lt;35%)</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
        <p className="text-center text-sm text-warning">
          <strong>Note:</strong> High-risk patients display pulsing borders for immediate visibility.
          All data is synthetic.
        </p>
      </div>
    </div>
  );
};
