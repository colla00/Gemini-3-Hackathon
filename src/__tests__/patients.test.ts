import { describe, it, expect } from 'vitest';
import { patients } from '@/data/patients';

describe('Patient data', () => {
  it('has valid patient records', () => {
    expect(patients.length).toBeGreaterThan(0);
  });

  it('each patient has required fields', () => {
    patients.forEach((patient) => {
      expect(patient).toHaveProperty('id');
      expect(patient).toHaveProperty('riskLevel');
      expect(patient).toHaveProperty('riskScore');
      expect(patient).toHaveProperty('riskType');
      expect(patient).toHaveProperty('trend');
    });
  });

  it('patient IDs are unique', () => {
    const ids = patients.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('risk levels are valid', () => {
    const validLevels = ['HIGH', 'MEDIUM', 'LOW'];
    patients.forEach((patient) => {
      expect(validLevels).toContain(patient.riskLevel);
    });
  });

  it('risk scores are within valid range', () => {
    patients.forEach((patient) => {
      expect(patient.riskScore).toBeGreaterThanOrEqual(0);
      expect(patient.riskScore).toBeLessThanOrEqual(100);
    });
  });

  it('trends are valid', () => {
    const validTrends = ['up', 'down', 'stable'];
    patients.forEach((patient) => {
      expect(validTrends).toContain(patient.trend);
    });
  });

  it('risk types are valid', () => {
    const validTypes = ['Falls', 'Pressure Injury', 'Device Complication', 'CAUTI'];
    patients.forEach((patient) => {
      expect(validTypes).toContain(patient.riskType);
    });
  });
});
