import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  useDemoScenarios, 
  DEFAULT_DEMO_SCENARIOS,
  calculateTotalDuration,
  formatDuration,
  type DemoScenarioConfig 
} from '@/hooks/useDemoScenarios';
import type { Patient } from '@/types/patient';

const mockPatient: Patient = {
  id: 'Patient A01',
  riskLevel: 'HIGH',
  riskScore: 85,
  riskType: 'Falls',
  trend: 'up',
  lastUpdated: '2024-01-15T10:00:00Z',
  lastUpdatedMinutes: 30,
  ageRange: '65-74',
  admissionDate: '2024-01-10',
  riskFactors: [],
  clinicalNotes: 'Test notes',
  riskSummary: 'High fall risk',
};

const mockCAUTIPatient: Patient = {
  id: 'Patient C00',
  riskLevel: 'HIGH',
  riskScore: 78,
  riskType: 'CAUTI',
  trend: 'up',
  lastUpdated: '2024-01-15T11:00:00Z',
  lastUpdatedMinutes: 15,
  ageRange: '70-79',
  admissionDate: '2024-01-08',
  riskFactors: [],
  clinicalNotes: 'Foley catheter day 8',
  riskSummary: 'High CAUTI risk',
};

describe('useDemoScenarios', () => {
  const mockSetSelectedPatient = vi.fn();
  const mockSetRiskLevelFilter = vi.fn();
  const mockSetRiskTypeFilter = vi.fn();
  const mockFindPatientById = vi.fn((id: string) => {
    if (id === 'Patient A01') return mockPatient;
    return undefined;
  });
  const mockFindPatientByRiskType = vi.fn((riskType: string) => {
    if (riskType === 'CAUTI') return mockCAUTIPatient;
    if (riskType === 'Pressure Injury') return mockPatient;
    return undefined;
  });

  const defaultOptions = {
    setSelectedPatient: mockSetSelectedPatient,
    findPatientById: mockFindPatientById,
    findPatientByRiskType: mockFindPatientByRiskType,
    setRiskLevelFilter: mockSetRiskLevelFilter,
    setRiskTypeFilter: mockSetRiskTypeFilter,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('scenario generation', () => {
    it('should return correct number of scenarios', () => {
      const { result } = renderHook(() => useDemoScenarios(defaultOptions));
      
      expect(result.current.length).toBe(DEFAULT_DEMO_SCENARIOS.length);
    });

    it('should preserve scenario metadata', () => {
      const { result } = renderHook(() => useDemoScenarios(defaultOptions));
      
      const firstScenario = result.current[0];
      expect(firstScenario.id).toBe('intro');
      expect(firstScenario.label).toBe('Dashboard Overview');
      expect(firstScenario.duration).toBe(10);
      expect(typeof firstScenario.action).toBe('function');
    });

    it('should use custom scenario configs', () => {
      const customConfigs: DemoScenarioConfig[] = [
        {
          id: 'custom-1',
          label: 'Custom Scenario',
          description: 'A custom demo scenario',
          duration: 15,
          type: 'overview',
        },
      ];

      const { result } = renderHook(() => 
        useDemoScenarios(defaultOptions, customConfigs)
      );
      
      expect(result.current.length).toBe(1);
      expect(result.current[0].id).toBe('custom-1');
      expect(result.current[0].label).toBe('Custom Scenario');
    });
  });

  describe('scenario actions', () => {
    it('should handle overview scenario action', () => {
      const { result } = renderHook(() => useDemoScenarios(defaultOptions));
      
      // Find the intro scenario (type: 'overview')
      const introScenario = result.current.find(s => s.id === 'intro');
      introScenario?.action();
      
      expect(mockSetSelectedPatient).toHaveBeenCalledWith(null);
      expect(mockSetRiskTypeFilter).toHaveBeenCalledWith('ALL');
      expect(mockSetRiskLevelFilter).toHaveBeenCalledWith('ALL');
    });

    it('should handle patient scenario with patientId', () => {
      const { result } = renderHook(() => useDemoScenarios(defaultOptions));
      
      // Find the falls scenario (has patientId)
      const fallsScenario = result.current.find(s => s.id === 'high-risk-falls');
      fallsScenario?.action();
      
      expect(mockFindPatientById).toHaveBeenCalledWith('Patient A01');
      expect(mockSetSelectedPatient).toHaveBeenCalledWith(mockPatient);
    });

    it('should handle patient scenario with riskType', () => {
      const { result } = renderHook(() => useDemoScenarios(defaultOptions));
      
      // Find the CAUTI scenario (has riskType)
      const cautiScenario = result.current.find(s => s.id === 'cauti-scenario');
      cautiScenario?.action();
      
      expect(mockFindPatientByRiskType).toHaveBeenCalledWith('CAUTI');
      expect(mockSetSelectedPatient).toHaveBeenCalledWith(mockCAUTIPatient);
    });

    it('should handle filter scenario action', () => {
      const { result } = renderHook(() => useDemoScenarios(defaultOptions));
      
      // Find the filter-demo scenario
      const filterScenario = result.current.find(s => s.id === 'filter-demo');
      filterScenario?.action();
      
      expect(mockSetSelectedPatient).toHaveBeenCalledWith(null);
      expect(mockSetRiskLevelFilter).toHaveBeenCalledWith('HIGH');
      expect(mockSetRiskTypeFilter).toHaveBeenCalledWith('ALL');
    });

    it('should handle workflow scenario action', () => {
      const { result } = renderHook(() => useDemoScenarios(defaultOptions));
      
      // Find the handoff-context scenario (type: 'workflow')
      const workflowScenario = result.current.find(s => s.id === 'handoff-context');
      workflowScenario?.action();
      
      expect(mockSetSelectedPatient).toHaveBeenCalledWith(null);
      expect(mockSetRiskLevelFilter).toHaveBeenCalledWith('ALL');
      expect(mockSetRiskTypeFilter).toHaveBeenCalledWith('ALL');
    });

    it('should not set patient if not found', () => {
      const findPatientById = vi.fn(() => undefined);
      
      const { result } = renderHook(() => 
        useDemoScenarios({
          ...defaultOptions,
          findPatientById,
        })
      );
      
      const fallsScenario = result.current.find(s => s.id === 'high-risk-falls');
      fallsScenario?.action();
      
      expect(findPatientById).toHaveBeenCalledWith('Patient A01');
      expect(mockSetSelectedPatient).not.toHaveBeenCalled();
    });
  });
});

describe('calculateTotalDuration', () => {
  it('should calculate total duration correctly', () => {
    const scenarios: DemoScenarioConfig[] = [
      { id: '1', label: '', description: '', duration: 10, type: 'overview' },
      { id: '2', label: '', description: '', duration: 15, type: 'overview' },
      { id: '3', label: '', description: '', duration: 5, type: 'overview' },
    ];
    
    expect(calculateTotalDuration(scenarios)).toBe(30);
  });

  it('should return 0 for empty array', () => {
    expect(calculateTotalDuration([])).toBe(0);
  });

  it('should calculate default scenarios duration', () => {
    const total = calculateTotalDuration(DEFAULT_DEMO_SCENARIOS);
    expect(total).toBe(72); // 10+12+12+10+8+10+10
  });
});

describe('formatDuration', () => {
  it('should format seconds correctly', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(30)).toBe('0:30');
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(90)).toBe('1:30');
    expect(formatDuration(125)).toBe('2:05');
    expect(formatDuration(300)).toBe('5:00');
  });

  it('should pad single-digit seconds', () => {
    expect(formatDuration(5)).toBe('0:05');
    expect(formatDuration(65)).toBe('1:05');
  });
});
