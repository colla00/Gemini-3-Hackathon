import { describe, it, expect } from 'vitest';
import { patients, type Patient, type RiskLevel, type RiskType } from '@/data/patients';

describe('Patient Data Integrity', () => {
  describe('Required Fields', () => {
    it('all patients should have required fields', () => {
      patients.forEach((patient) => {
        expect(patient.id).toBeDefined();
        expect(patient.riskLevel).toBeDefined();
        expect(patient.riskScore).toBeDefined();
        expect(patient.riskType).toBeDefined();
        expect(patient.trend).toBeDefined();
        expect(patient.lastUpdated).toBeDefined();
        expect(patient.lastUpdatedMinutes).toBeDefined();
        expect(patient.ageRange).toBeDefined();
        expect(patient.admissionDate).toBeDefined();
        expect(patient.riskFactors).toBeDefined();
        expect(patient.clinicalNotes).toBeDefined();
        expect(patient.riskSummary).toBeDefined();
      });
    });

    it('all patient IDs should be unique', () => {
      const ids = patients.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Risk Score Validation', () => {
    it('all risk scores should be between 0 and 100', () => {
      patients.forEach((patient) => {
        expect(patient.riskScore).toBeGreaterThanOrEqual(0);
        expect(patient.riskScore).toBeLessThanOrEqual(100);
      });
    });

    it('risk levels should match risk scores', () => {
      patients.forEach((patient) => {
        if (patient.riskScore >= 70) {
          expect(patient.riskLevel).toBe('HIGH');
        } else if (patient.riskScore >= 40) {
          expect(patient.riskLevel).toBe('MEDIUM');
        } else {
          expect(patient.riskLevel).toBe('LOW');
        }
      });
    });
  });

  describe('Risk Type Validation', () => {
    const validRiskTypes: RiskType[] = ['Falls', 'Pressure Injury', 'Device Complication', 'CAUTI'];

    it('all risk types should be valid', () => {
      patients.forEach((patient) => {
        expect(validRiskTypes).toContain(patient.riskType);
      });
    });
  });

  describe('Trend Validation', () => {
    const validTrends = ['up', 'down', 'stable'];

    it('all trends should be valid', () => {
      patients.forEach((patient) => {
        expect(validTrends).toContain(patient.trend);
      });
    });
  });

  describe('Risk Factors Validation', () => {
    it('all patients should have at least one risk factor', () => {
      patients.forEach((patient) => {
        expect(patient.riskFactors.length).toBeGreaterThan(0);
      });
    });

    it('all risk factors should have required properties', () => {
      patients.forEach((patient) => {
        patient.riskFactors.forEach((factor) => {
          expect(factor.name).toBeDefined();
          expect(typeof factor.name).toBe('string');
          expect(factor.icon).toBeDefined();
          expect(factor.contribution).toBeDefined();
          expect(typeof factor.contribution).toBe('number');
        });
      });
    });

    it('risk factor contributions should be normalized (-1 to 1)', () => {
      patients.forEach((patient) => {
        patient.riskFactors.forEach((factor) => {
          expect(factor.contribution).toBeGreaterThanOrEqual(-1);
          expect(factor.contribution).toBeLessThanOrEqual(1);
        });
      });
    });
  });

  describe('Time Validation', () => {
    it('lastUpdatedMinutes should be non-negative', () => {
      patients.forEach((patient) => {
        expect(patient.lastUpdatedMinutes).toBeGreaterThanOrEqual(0);
      });
    });

    it('lastUpdated format should be valid', () => {
      patients.forEach((patient) => {
        expect(patient.lastUpdated).toMatch(/^~\d+[hm]$/);
      });
    });
  });

  describe('Age Range Validation', () => {
    it('age ranges should be valid format', () => {
      patients.forEach((patient) => {
        expect(patient.ageRange).toMatch(/^\d+-\d+$/);
      });
    });

    it('age ranges should have valid bounds', () => {
      patients.forEach((patient) => {
        const [low, high] = patient.ageRange.split('-').map(Number);
        expect(low).toBeLessThan(high);
        expect(low).toBeGreaterThan(0);
        expect(high).toBeLessThan(150);
      });
    });
  });
});

describe('Patient Data Relationships', () => {
  describe('High Risk Patients', () => {
    it('HIGH risk patients should have concerning factors', () => {
      const highRiskPatients = patients.filter(p => p.riskLevel === 'HIGH');
      
      highRiskPatients.forEach((patient) => {
        // Should have at least some risk-increasing factors
        const riskIncreasing = patient.riskFactors.filter(f => f.contribution > 0);
        expect(riskIncreasing.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Patient Distribution', () => {
    it('should have patients across all risk levels', () => {
      const riskLevels = new Set(patients.map(p => p.riskLevel));
      expect(riskLevels.has('HIGH')).toBe(true);
      expect(riskLevels.has('MEDIUM')).toBe(true);
      expect(riskLevels.has('LOW')).toBe(true);
    });

    it('should have patients across multiple risk types', () => {
      const riskTypes = new Set(patients.map(p => p.riskType));
      expect(riskTypes.size).toBeGreaterThan(1);
    });
  });

  describe('Demo Patients', () => {
    it('demo patients should be properly marked', () => {
      const demoPatients = patients.filter(p => p.isDemo);
      
      demoPatients.forEach((patient) => {
        expect(patient.isDemo).toBe(true);
      });
    });
  });

  describe('Optional Fields', () => {
    it('patients with interventions should have valid structure', () => {
      patients.forEach((patient) => {
        if (patient.interventions) {
          expect(Array.isArray(patient.interventions)).toBe(true);
          patient.interventions.forEach((intervention) => {
            expect(intervention.date).toBeDefined();
            expect(intervention.type).toBeDefined();
            expect(intervention.description).toBeDefined();
          });
        }
      });
    });

    it('patients with vitals should have valid structure', () => {
      patients.forEach((patient) => {
        if (patient.vitals) {
          expect(Array.isArray(patient.vitals)).toBe(true);
          patient.vitals.forEach((vital) => {
            expect(vital.name).toBeDefined();
            expect(vital.value).toBeDefined();
            expect(['normal', 'warning', 'critical']).toContain(vital.status);
          });
        }
      });
    });

    it('patients with nursing outcomes should have valid structure', () => {
      patients.forEach((patient) => {
        if (patient.nursingOutcomes) {
          expect(Array.isArray(patient.nursingOutcomes)).toBe(true);
          patient.nursingOutcomes.forEach((outcome) => {
            expect(outcome.metric).toBeDefined();
            expect(typeof outcome.baseline).toBe('number');
            expect(typeof outcome.current).toBe('number');
            expect(typeof outcome.target).toBe('number');
            expect(outcome.unit).toBeDefined();
          });
        }
      });
    });
  });
});

describe('Patient Data Statistics', () => {
  it('should have a reasonable number of patients', () => {
    expect(patients.length).toBeGreaterThan(0);
    expect(patients.length).toBeLessThan(100); // Sanity check
  });

  it('average risk score should be within expected range', () => {
    const avgScore = patients.reduce((sum, p) => sum + p.riskScore, 0) / patients.length;
    expect(avgScore).toBeGreaterThan(20);
    expect(avgScore).toBeLessThan(80);
  });

  it('should have diverse trend directions', () => {
    const trends = patients.map(p => p.trend);
    expect(trends.filter(t => t === 'up').length).toBeGreaterThan(0);
    expect(trends.filter(t => t === 'down').length).toBeGreaterThan(0);
    expect(trends.filter(t => t === 'stable').length).toBeGreaterThan(0);
  });
});
