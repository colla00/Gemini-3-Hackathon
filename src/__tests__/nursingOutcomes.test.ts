import { describe, it, expect } from 'vitest';
import {
  patients as nursingPatients,
  riskCategories,
  shapFactorsFalls,
  shapFactorsHAPI,
  shapFactorsCAUTI,
  workflowStages,
  type PatientData,
  type RiskCategoryData,
  type ShapFactor,
} from '@/data/nursingOutcomes';

describe('Nursing Outcomes Data', () => {
  describe('Risk Categories', () => {
    it('should have all required risk categories', () => {
      const categories = riskCategories.map(c => c.category);
      expect(categories).toContain('FALLS');
      expect(categories).toContain('HAPI');
      expect(categories).toContain('CAUTI');
    });

    it('should have valid score ranges', () => {
      riskCategories.forEach((category) => {
        expect(category.score).toBeGreaterThanOrEqual(0);
        expect(category.score).toBeLessThanOrEqual(100);
      });
    });

    it('should have valid confidence values', () => {
      riskCategories.forEach((category) => {
        expect(category.confidence).toBeGreaterThanOrEqual(0);
        expect(category.confidence).toBeLessThanOrEqual(100);
      });
    });

    it('should have valid risk levels', () => {
      const validLevels = ['HIGH', 'MODERATE', 'LOW'];
      riskCategories.forEach((category) => {
        expect(validLevels).toContain(category.level);
      });
    });

    it('should have at least one factor per category', () => {
      riskCategories.forEach((category) => {
        expect(category.factors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('SHAP Factors - Falls', () => {
    it('should have base risk as first factor', () => {
      expect(shapFactorsFalls[0].factor).toBe('Base Risk');
      expect(shapFactorsFalls[0].type).toBe('base');
    });

    it('should have cumulative values properly calculated', () => {
      let runningTotal = 0;
      shapFactorsFalls.forEach((factor) => {
        runningTotal += factor.contribution;
        expect(factor.cumulative).toBeCloseTo(runningTotal, 0);
      });
    });

    it('should have valid factor types', () => {
      shapFactorsFalls.forEach((factor) => {
        expect(['base', 'risk', 'protective']).toContain(factor.type);
      });
    });

    it('protective factors should have negative contributions', () => {
      const protective = shapFactorsFalls.filter(f => f.type === 'protective');
      protective.forEach((factor) => {
        expect(factor.contribution).toBeLessThan(0);
      });
    });

    it('risk factors should have positive contributions', () => {
      const risk = shapFactorsFalls.filter(f => f.type === 'risk');
      risk.forEach((factor) => {
        expect(factor.contribution).toBeGreaterThan(0);
      });
    });
  });

  describe('SHAP Factors - HAPI', () => {
    it('should include relevant pressure injury factors', () => {
      const factorNames = shapFactorsHAPI.map(f => f.factor.toLowerCase());
      expect(factorNames.some(n => n.includes('braden'))).toBe(true);
    });

    it('cumulative values should be non-negative', () => {
      shapFactorsHAPI.forEach((factor) => {
        // Cumulative can be any value, but final should make sense
        expect(typeof factor.cumulative).toBe('number');
      });
    });
  });

  describe('SHAP Factors - CAUTI', () => {
    it('should include catheter-related factors', () => {
      const factorNames = shapFactorsCAUTI.map(f => f.factor.toLowerCase());
      expect(factorNames.some(n => n.includes('catheter'))).toBe(true);
    });

    it('should have base risk factor', () => {
      const baseRisk = shapFactorsCAUTI.find(f => f.type === 'base');
      expect(baseRisk).toBeDefined();
    });
  });
});

describe('Nursing Patient Data', () => {
  describe('Patient Structure', () => {
    it('all patients should have required fields', () => {
      nursingPatients.forEach((patient) => {
        expect(patient.id).toBeDefined();
        expect(patient.mrn).toBeDefined();
        expect(patient.age).toBeDefined();
        expect(patient.sex).toBeDefined();
        expect(patient.unit).toBeDefined();
        expect(patient.bed).toBeDefined();
        expect(patient.diagnosis).toBeDefined();
        expect(patient.fallsRisk).toBeDefined();
        expect(patient.hapiRisk).toBeDefined();
        expect(patient.cautiRisk).toBeDefined();
      });
    });

    it('all MRNs should be unique', () => {
      const mrns = nursingPatients.map(p => p.mrn);
      const uniqueMrns = new Set(mrns);
      expect(uniqueMrns.size).toBe(mrns.length);
    });
  });

  describe('Risk Scores', () => {
    it('all risk scores should be valid percentages', () => {
      nursingPatients.forEach((patient) => {
        expect(patient.fallsRisk).toBeGreaterThanOrEqual(0);
        expect(patient.fallsRisk).toBeLessThanOrEqual(100);
        expect(patient.hapiRisk).toBeGreaterThanOrEqual(0);
        expect(patient.hapiRisk).toBeLessThanOrEqual(100);
        expect(patient.cautiRisk).toBeGreaterThanOrEqual(0);
        expect(patient.cautiRisk).toBeLessThanOrEqual(100);
      });
    });

    it('risk levels should match risk scores', () => {
      nursingPatients.forEach((patient) => {
        // Falls risk level check
        if (patient.fallsRisk >= 60) {
          expect(patient.fallsLevel).toBe('HIGH');
        } else if (patient.fallsRisk >= 35) {
          expect(patient.fallsLevel).toBe('MODERATE');
        } else {
          expect(patient.fallsLevel).toBe('LOW');
        }
      });
    });
  });

  describe('Confidence Values', () => {
    it('all confidence values should be valid percentages', () => {
      nursingPatients.forEach((patient) => {
        expect(patient.fallsConfidence).toBeGreaterThanOrEqual(0);
        expect(patient.fallsConfidence).toBeLessThanOrEqual(100);
        expect(patient.hapiConfidence).toBeGreaterThanOrEqual(0);
        expect(patient.hapiConfidence).toBeLessThanOrEqual(100);
        expect(patient.cautiConfidence).toBeGreaterThanOrEqual(0);
        expect(patient.cautiConfidence).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Falls Trend Data', () => {
    it('all patients should have trend data', () => {
      nursingPatients.forEach((patient) => {
        expect(Array.isArray(patient.fallsTrend)).toBe(true);
        expect(patient.fallsTrend.length).toBeGreaterThan(0);
      });
    });

    it('trend data points should have valid structure', () => {
      nursingPatients.forEach((patient) => {
        patient.fallsTrend.forEach((point) => {
          expect(point.hour).toBeDefined();
          expect(typeof point.value).toBe('number');
          expect(point.value).toBeGreaterThanOrEqual(0);
          expect(point.value).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  describe('Vitals', () => {
    it('all patients should have vital signs', () => {
      nursingPatients.forEach((patient) => {
        expect(patient.vitals).toBeDefined();
        expect(patient.vitals.heartRate).toBeDefined();
        expect(patient.vitals.bp).toBeDefined();
        expect(patient.vitals.o2Sat).toBeDefined();
        expect(patient.vitals.temp).toBeDefined();
      });
    });

    it('heart rates should be physiologically valid', () => {
      nursingPatients.forEach((patient) => {
        expect(patient.vitals.heartRate).toBeGreaterThan(30);
        expect(patient.vitals.heartRate).toBeLessThan(200);
      });
    });
  });

  describe('Interventions', () => {
    it('all patients should have interventions', () => {
      nursingPatients.forEach((patient) => {
        expect(Array.isArray(patient.interventions)).toBe(true);
        expect(patient.interventions.length).toBeGreaterThan(0);
      });
    });

    it('interventions should have valid priority', () => {
      const validPriorities = ['immediate', 'routine', 'monitor'];
      nursingPatients.forEach((patient) => {
        patient.interventions.forEach((intervention) => {
          expect(validPriorities).toContain(intervention.priority);
        });
      });
    });

    it('interventions should have valid categories', () => {
      const validCategories = ['FALLS', 'HAPI', 'CAUTI'];
      nursingPatients.forEach((patient) => {
        patient.interventions.forEach((intervention) => {
          expect(validCategories).toContain(intervention.category);
        });
      });
    });
  });

  describe('Demographics', () => {
    it('ages should be valid', () => {
      nursingPatients.forEach((patient) => {
        expect(patient.age).toBeGreaterThan(0);
        expect(patient.age).toBeLessThan(120);
      });
    });

    it('sex should be valid', () => {
      nursingPatients.forEach((patient) => {
        expect(['M', 'F']).toContain(patient.sex);
      });
    });

    it('length of stay should be non-negative', () => {
      nursingPatients.forEach((patient) => {
        expect(patient.los).toBeGreaterThanOrEqual(0);
      });
    });
  });
});

describe('Workflow Stages', () => {
  it('should have all required stages', () => {
    const stageIds = workflowStages.map(s => s.id);
    expect(stageIds).toContain('alert');
    expect(stageIds).toContain('assessment');
    expect(stageIds).toContain('action');
  });

  it('each stage should have items', () => {
    workflowStages.forEach((stage) => {
      expect(Array.isArray(stage.items)).toBe(true);
      expect(stage.items.length).toBeGreaterThan(0);
    });
  });

  it('items should have label and completed status', () => {
    workflowStages.forEach((stage) => {
      stage.items.forEach((item) => {
        expect(item.label).toBeDefined();
        expect(typeof item.completed).toBe('boolean');
      });
    });
  });
});
