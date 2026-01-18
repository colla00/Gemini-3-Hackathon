// Hook for demo scenario definitions and logic
import { useMemo } from 'react';
import type { DemoScenario } from '@/components/dashboard/DemoModeController';
import type { Patient, RiskLevel, RiskType } from '@/types/patient';

export interface UseDemoScenariosOptions {
  /** Callback to set selected patient */
  setSelectedPatient: (patient: Patient | null) => void;
  /** Callback to find patient by ID */
  findPatientById: (id: string) => Patient | undefined;
  /** Callback to find patient by risk type */
  findPatientByRiskType: (riskType: RiskType) => Patient | undefined;
  /** Callback to set risk level filter */
  setRiskLevelFilter: (value: RiskLevel | 'ALL') => void;
  /** Callback to set risk type filter */
  setRiskTypeFilter: (value: RiskType | 'ALL') => void;
}

export interface DemoScenarioConfig {
  id: string;
  label: string;
  description: string;
  duration: number;
  type: 'overview' | 'patient' | 'filter' | 'workflow';
  patientId?: string;
  riskType?: RiskType;
  riskLevelFilter?: RiskLevel | 'ALL';
  riskTypeFilter?: RiskType | 'ALL';
}

/**
 * Default demo scenario configurations (aligned to ~5min presentation)
 */
export const DEFAULT_DEMO_SCENARIOS: DemoScenarioConfig[] = [
  {
    id: 'intro',
    label: 'Dashboard Overview',
    description: 'Unit-level view of nurse-sensitive outcomes monitoring',
    duration: 10,
    type: 'overview',
  },
  {
    id: 'high-risk-falls',
    label: 'Falls Risk - SHAP Analysis',
    description: 'Patient A01: Post-op sedation + mobility → interpretable risk factors',
    duration: 12,
    type: 'patient',
    patientId: 'Patient A01',
  },
  {
    id: 'cauti-scenario',
    label: 'CAUTI Risk Escalation',
    description: 'Patient C00: Foley Day 8 + fever → catheter removal workflow',
    duration: 12,
    type: 'patient',
    riskType: 'CAUTI',
  },
  {
    id: 'pressure-injury',
    label: 'Pressure Injury Prevention',
    description: 'HAPI risk with Braden subscale + repositioning protocol',
    duration: 10,
    type: 'patient',
    riskType: 'Pressure Injury',
  },
  {
    id: 'filter-demo',
    label: 'Priority Filtering',
    description: 'Filter to high-risk patients for focused nursing rounds',
    duration: 8,
    type: 'filter',
    riskLevelFilter: 'HIGH',
    riskTypeFilter: 'ALL',
  },
  {
    id: 'handoff-context',
    label: 'Shift Handoff',
    description: 'Click Handoff phase above → generate CAUTI report',
    duration: 10,
    type: 'workflow',
  },
  {
    id: 'summary',
    label: 'Q&A Discussion',
    description: 'EHR-driven, interpretable AI for nurse-sensitive outcomes',
    duration: 10,
    type: 'overview',
  },
];

/**
 * Hook to generate demo scenarios with action callbacks
 * Separates scenario configuration from execution logic
 */
export const useDemoScenarios = (
  options: UseDemoScenariosOptions,
  scenarioConfigs: DemoScenarioConfig[] = DEFAULT_DEMO_SCENARIOS
): DemoScenario[] => {
  const {
    setSelectedPatient,
    findPatientById,
    findPatientByRiskType,
    setRiskLevelFilter,
    setRiskTypeFilter,
  } = options;

  const demoScenarios = useMemo<DemoScenario[]>(() => {
    return scenarioConfigs.map((config) => ({
      id: config.id,
      label: config.label,
      description: config.description,
      duration: config.duration,
      action: () => {
        switch (config.type) {
          case 'overview':
            setSelectedPatient(null);
            setRiskTypeFilter('ALL');
            setRiskLevelFilter('ALL');
            break;
            
          case 'patient':
            if (config.patientId) {
              const patient = findPatientById(config.patientId);
              if (patient) setSelectedPatient(patient);
            } else if (config.riskType) {
              const patient = findPatientByRiskType(config.riskType);
              if (patient) setSelectedPatient(patient);
            }
            break;
            
          case 'filter':
            setSelectedPatient(null);
            setRiskLevelFilter(config.riskLevelFilter ?? 'ALL');
            setRiskTypeFilter(config.riskTypeFilter ?? 'ALL');
            break;
            
          case 'workflow':
            setSelectedPatient(null);
            setRiskLevelFilter('ALL');
            setRiskTypeFilter('ALL');
            break;
        }
      },
    }));
  }, [
    scenarioConfigs,
    setSelectedPatient,
    findPatientById,
    findPatientByRiskType,
    setRiskLevelFilter,
    setRiskTypeFilter,
  ]);

  return demoScenarios;
};

/**
 * Calculate total demo duration in seconds
 */
export const calculateTotalDuration = (scenarios: DemoScenarioConfig[]): number => {
  return scenarios.reduce((acc, s) => acc + s.duration, 0);
};

/**
 * Format duration as MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
