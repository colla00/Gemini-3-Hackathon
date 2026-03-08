import { cn } from '@/lib/utils';
import { type RealisticVitals, getVitalStatus } from '@/hooks/useRealisticVitals';
import { Heart, Wind, Thermometer, Droplets, Activity } from 'lucide-react';

/**
 * Compact vitals strip for patient cards — resembles a bedside monitor readout.
 */

interface VitalsStripProps {
  vitals: RealisticVitals;
  compact?: boolean;
}

const STATUS_STYLES = {
  normal: 'text-risk-low',
  warning: 'text-risk-medium',
  critical: 'text-risk-high animate-pulse',
};

const STATUS_BG = {
  normal: '',
  warning: '',
  critical: 'bg-risk-high/5',
};

export const VitalsStrip = ({ vitals, compact = false }: VitalsStripProps) => {
  const hrStatus = getVitalStatus('hr', vitals.hr);
  const bpStatus = getVitalStatus('sbp', vitals.sbp);
  const spo2Status = getVitalStatus('spo2', vitals.spo2);
  const rrStatus = getVitalStatus('rr', vitals.rr);
  const tempStatus = getVitalStatus('temp', vitals.temp);

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-[10px] font-mono tabular-nums">
        <span className={cn('flex items-center gap-1', STATUS_STYLES[hrStatus])}>
          <Heart className="w-2.5 h-2.5" /> {vitals.hr}
        </span>
        <span className={cn('flex items-center gap-1', STATUS_STYLES[bpStatus])}>
          {vitals.sbp}/{vitals.dbp}
        </span>
        <span className={cn('flex items-center gap-1', STATUS_STYLES[spo2Status])}>
          {vitals.spo2}%
        </span>
        <span className={cn('flex items-center gap-1', STATUS_STYLES[tempStatus])}>
          {vitals.temp}°
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-1 text-[10px]">
      <VitalCell
        icon={<Heart className="w-3 h-3" />}
        label="HR"
        value={`${vitals.hr}`}
        unit="bpm"
        status={hrStatus}
      />
      <VitalCell
        icon={<Activity className="w-3 h-3" />}
        label="BP"
        value={`${vitals.sbp}/${vitals.dbp}`}
        unit="mmHg"
        status={bpStatus}
      />
      <VitalCell
        icon={<Droplets className="w-3 h-3" />}
        label="SpO₂"
        value={`${vitals.spo2}`}
        unit="%"
        status={spo2Status}
      />
      <VitalCell
        icon={<Wind className="w-3 h-3" />}
        label="RR"
        value={`${vitals.rr}`}
        unit="/min"
        status={rrStatus}
      />
      <VitalCell
        icon={<Thermometer className="w-3 h-3" />}
        label="Temp"
        value={`${vitals.temp}`}
        unit="°F"
        status={tempStatus}
      />
    </div>
  );
};

interface VitalCellProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

const VitalCell = ({ icon, label, value, unit, status }: VitalCellProps) => (
  <div className={cn(
    'flex flex-col items-center py-1.5 px-1 rounded-md',
    STATUS_BG[status],
  )}>
    <span className={cn('mb-0.5', STATUS_STYLES[status])}>{icon}</span>
    <span className={cn('font-bold font-mono tabular-nums text-xs', STATUS_STYLES[status])}>
      {value}
    </span>
    <span className="text-muted-foreground/60 text-[8px] uppercase tracking-wider">{unit}</span>
  </div>
);
