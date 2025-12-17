import { describe, it, expect } from 'vitest';
import {
  getRiskLevel,
  getConfidenceInterval,
  calculateTotalContribution,
  getProtectiveFactors,
  getRiskFactors,
  isValidRiskScore,
  validateContributions,
  calculateTrendDirection,
  calculateAverageRisk,
  countHighRiskOutcomes,
  validatePatientData,
  normalizeRiskScore,
  calculateRiskBounds,
  getPriorityLevel,
  formatLastUpdated,
  sortByRiskPriority,
} from '@/lib/riskCalculations';
import type { Patient, RiskFactor } from '@/data/patients';

describe('Risk Level Determination', () => {
  describe('getRiskLevel', () => {
    it('should return HIGH for scores >= 70', () => {
      expect(getRiskLevel(70)).toBe('HIGH');
      expect(getRiskLevel(85)).toBe('HIGH');
      expect(getRiskLevel(100)).toBe('HIGH');
    });

    it('should return MEDIUM for scores 40-69', () => {
      expect(getRiskLevel(40)).toBe('MEDIUM');
      expect(getRiskLevel(55)).toBe('MEDIUM');
      expect(getRiskLevel(69)).toBe('MEDIUM');
    });

    it('should return LOW for scores < 40', () => {
      expect(getRiskLevel(0)).toBe('LOW');
      expect(getRiskLevel(20)).toBe('LOW');
      expect(getRiskLevel(39)).toBe('LOW');
    });

    it('should handle boundary cases correctly', () => {
      expect(getRiskLevel(39.9)).toBe('LOW');
      expect(getRiskLevel(40)).toBe('MEDIUM');
      expect(getRiskLevel(69.9)).toBe('MEDIUM');
      expect(getRiskLevel(70)).toBe('HIGH');
    });
  });

  describe('getConfidenceInterval', () => {
    it('should return 8 for HIGH risk', () => {
      expect(getConfidenceInterval('HIGH')).toBe(8);
    });

    it('should return 6 for MEDIUM risk', () => {
      expect(getConfidenceInterval('MEDIUM')).toBe(6);
    });

    it('should return 4 for LOW risk', () => {
      expect(getConfidenceInterval('LOW')).toBe(4);
    });
  });
});

describe('Risk Factor Calculations', () => {
  const sampleFactors: RiskFactor[] = [
    { name: 'Factor A', icon: '🔴', contribution: 0.35 },
    { name: 'Factor B', icon: '🟠', contribution: 0.25 },
    { name: 'Factor C', icon: '🟢', contribution: -0.10 },
    { name: 'Factor D', icon: '🟢', contribution: -0.05 },
  ];

  describe('calculateTotalContribution', () => {
    it('should sum all contributions correctly', () => {
      expect(calculateTotalContribution(sampleFactors)).toBeCloseTo(0.45, 2);
    });

    it('should return 0 for empty array', () => {
      expect(calculateTotalContribution([])).toBe(0);
    });

    it('should handle all negative contributions', () => {
      const negativeFactors: RiskFactor[] = [
        { name: 'A', icon: '🟢', contribution: -0.2 },
        { name: 'B', icon: '🟢', contribution: -0.3 },
      ];
      expect(calculateTotalContribution(negativeFactors)).toBeCloseTo(-0.5, 2);
    });
  });

  describe('getProtectiveFactors', () => {
    it('should return only factors with negative contribution', () => {
      const protective = getProtectiveFactors(sampleFactors);
      expect(protective).toHaveLength(2);
      expect(protective.every(f => f.contribution < 0)).toBe(true);
    });

    it('should return empty array when no protective factors exist', () => {
      const riskOnly: RiskFactor[] = [
        { name: 'A', icon: '🔴', contribution: 0.5 },
      ];
      expect(getProtectiveFactors(riskOnly)).toHaveLength(0);
    });
  });

  describe('getRiskFactors', () => {
    it('should return only factors with positive contribution', () => {
      const risks = getRiskFactors(sampleFactors);
      expect(risks).toHaveLength(2);
      expect(risks.every(f => f.contribution > 0)).toBe(true);
    });
  });

  describe('validateContributions', () => {
    it('should return true for valid contribution range', () => {
      expect(validateContributions(sampleFactors)).toBe(true);
    });

    it('should return false for contributions exceeding range', () => {
      const invalidFactors: RiskFactor[] = [
        { name: 'A', icon: '🔴', contribution: 0.8 },
        { name: 'B', icon: '🔴', contribution: 0.5 },
      ];
      expect(validateContributions(invalidFactors)).toBe(false);
    });
  });
});

describe('Risk Score Validation', () => {
  describe('isValidRiskScore', () => {
    it('should return true for valid scores', () => {
      expect(isValidRiskScore(0)).toBe(true);
      expect(isValidRiskScore(50)).toBe(true);
      expect(isValidRiskScore(100)).toBe(true);
    });

    it('should return false for scores outside range', () => {
      expect(isValidRiskScore(-1)).toBe(false);
      expect(isValidRiskScore(101)).toBe(false);
    });

    it('should return false for NaN', () => {
      expect(isValidRiskScore(NaN)).toBe(false);
    });

    it('should return false for non-numbers', () => {
      expect(isValidRiskScore('50' as any)).toBe(false);
    });
  });

  describe('normalizeRiskScore', () => {
    it('should keep valid scores unchanged', () => {
      expect(normalizeRiskScore(50)).toBe(50);
    });

    it('should clamp scores below 0', () => {
      expect(normalizeRiskScore(-10)).toBe(0);
    });

    it('should clamp scores above 100', () => {
      expect(normalizeRiskScore(150)).toBe(100);
    });

    it('should round decimal scores', () => {
      expect(normalizeRiskScore(55.7)).toBe(56);
      expect(normalizeRiskScore(55.2)).toBe(55);
    });
  });

  describe('calculateRiskBounds', () => {
    it('should calculate correct bounds for HIGH risk', () => {
      const bounds = calculateRiskBounds(80, 'HIGH');
      expect(bounds.low).toBe(72);
      expect(bounds.high).toBe(88);
    });

    it('should not exceed 100 for high scores', () => {
      const bounds = calculateRiskBounds(98, 'HIGH');
      expect(bounds.high).toBe(100);
    });

    it('should not go below 0 for low scores', () => {
      const bounds = calculateRiskBounds(2, 'LOW');
      expect(bounds.low).toBe(0);
    });
  });
});

describe('Trend Calculations', () => {
  describe('calculateTrendDirection', () => {
    it('should return "up" when score increases significantly', () => {
      expect(calculateTrendDirection(50, 60)).toBe('up');
    });

    it('should return "down" when score decreases significantly', () => {
      expect(calculateTrendDirection(60, 50)).toBe('down');
    });

    it('should return "stable" for small changes', () => {
      expect(calculateTrendDirection(50, 52)).toBe('stable');
      expect(calculateTrendDirection(50, 48)).toBe('stable');
    });

    it('should respect custom threshold', () => {
      expect(calculateTrendDirection(50, 53, 2)).toBe('up');
      expect(calculateTrendDirection(50, 52, 2)).toBe('stable');
    });
  });
});

describe('Multi-Outcome Calculations', () => {
  describe('calculateAverageRisk', () => {
    it('should calculate correct average', () => {
      expect(calculateAverageRisk([60, 40, 80])).toBe(60);
    });

    it('should round the result', () => {
      expect(calculateAverageRisk([33, 33, 33])).toBe(33);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverageRisk([])).toBe(0);
    });
  });

  describe('countHighRiskOutcomes', () => {
    it('should count outcomes above threshold', () => {
      expect(countHighRiskOutcomes([80, 75, 50, 30])).toBe(2);
    });

    it('should use custom threshold', () => {
      expect(countHighRiskOutcomes([60, 55, 50, 45], 50)).toBe(3);
    });

    it('should return 0 when no high risk', () => {
      expect(countHighRiskOutcomes([30, 40, 50])).toBe(0);
    });
  });
});

describe('Patient Data Validation', () => {
  describe('validatePatientData', () => {
    const validPatient: Partial<Patient> = {
      id: 'PT-001',
      riskLevel: 'HIGH',
      riskScore: 75,
      riskType: 'Falls',
      trend: 'up',
      riskFactors: [{ name: 'Test', icon: '🔴', contribution: 0.3 }],
    };

    it('should return valid for complete patient data', () => {
      const result = validatePatientData(validPatient);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing ID', () => {
      const { id, ...noId } = validPatient;
      const result = validatePatientData(noId);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Patient ID is required');
    });

    it('should detect invalid risk score', () => {
      const invalid = { ...validPatient, riskScore: 150 };
      const result = validatePatientData(invalid);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Valid risk score (0-100) is required');
    });

    it('should detect missing risk factors', () => {
      const noFactors = { ...validPatient, riskFactors: [] };
      const result = validatePatientData(noFactors);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('At least one risk factor is required');
    });

    it('should collect multiple errors', () => {
      const result = validatePatientData({});
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

describe('Priority and Formatting', () => {
  describe('getPriorityLevel', () => {
    it('should return critical for very high risk', () => {
      expect(getPriorityLevel(85, 'stable')).toBe('critical');
      expect(getPriorityLevel(75, 'up')).toBe('critical');
    });

    it('should return high for elevated risk', () => {
      expect(getPriorityLevel(72, 'stable')).toBe('high');
      expect(getPriorityLevel(65, 'up')).toBe('high');
    });

    it('should return medium for moderate risk', () => {
      expect(getPriorityLevel(55, 'stable')).toBe('medium');
    });

    it('should return low for low risk', () => {
      expect(getPriorityLevel(30, 'down')).toBe('low');
    });
  });

  describe('formatLastUpdated', () => {
    it('should format minutes correctly', () => {
      expect(formatLastUpdated(5)).toBe('~5m');
      expect(formatLastUpdated(30)).toBe('~30m');
    });

    it('should format hours correctly', () => {
      expect(formatLastUpdated(60)).toBe('~1h');
      expect(formatLastUpdated(120)).toBe('~2h');
      expect(formatLastUpdated(90)).toBe('~1h');
    });
  });
});

describe('Patient Sorting', () => {
  describe('sortByRiskPriority', () => {
    const patients: Patient[] = [
      {
        id: 'PT-001', riskLevel: 'LOW', riskScore: 25, trend: 'stable',
        riskType: 'Falls', lastUpdated: '~1h', lastUpdatedMinutes: 60,
        ageRange: '65-70', admissionDate: 'Day 1', riskFactors: [],
        clinicalNotes: '', riskSummary: ''
      },
      {
        id: 'PT-002', riskLevel: 'HIGH', riskScore: 85, trend: 'up',
        riskType: 'Falls', lastUpdated: '~1h', lastUpdatedMinutes: 60,
        ageRange: '70-75', admissionDate: 'Day 2', riskFactors: [],
        clinicalNotes: '', riskSummary: ''
      },
      {
        id: 'PT-003', riskLevel: 'HIGH', riskScore: 75, trend: 'stable',
        riskType: 'CAUTI', lastUpdated: '~2h', lastUpdatedMinutes: 120,
        ageRange: '60-65', admissionDate: 'Day 3', riskFactors: [],
        clinicalNotes: '', riskSummary: ''
      },
      {
        id: 'PT-004', riskLevel: 'MEDIUM', riskScore: 55, trend: 'down',
        riskType: 'Pressure Injury', lastUpdated: '~30m', lastUpdatedMinutes: 30,
        ageRange: '55-60', admissionDate: 'Day 1', riskFactors: [],
        clinicalNotes: '', riskSummary: ''
      },
    ];

    it('should sort by risk level first (HIGH > MEDIUM > LOW)', () => {
      const sorted = sortByRiskPriority(patients);
      expect(sorted[0].riskLevel).toBe('HIGH');
      expect(sorted[1].riskLevel).toBe('HIGH');
      expect(sorted[2].riskLevel).toBe('MEDIUM');
      expect(sorted[3].riskLevel).toBe('LOW');
    });

    it('should sort by score within same risk level', () => {
      const sorted = sortByRiskPriority(patients);
      // Both HIGH risk, PT-002 has higher score (85 > 75)
      expect(sorted[0].id).toBe('PT-002');
      expect(sorted[1].id).toBe('PT-003');
    });

    it('should not mutate original array', () => {
      const original = [...patients];
      sortByRiskPriority(patients);
      expect(patients).toEqual(original);
    });
  });
});
