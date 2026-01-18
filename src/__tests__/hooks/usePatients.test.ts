import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePatients } from '@/hooks/usePatients';

// Mock the performance monitor
vi.mock('@/lib/performanceMonitor', () => ({
  performanceMonitor: {
    recordInteraction: vi.fn(),
    addMetric: vi.fn(),
  },
}));

describe('usePatients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return all patients initially', () => {
      const { result } = renderHook(() => usePatients());
      
      expect(result.current.patients.length).toBeGreaterThan(0);
      expect(result.current.filteredPatients.length).toBe(result.current.patients.length);
    });

    it('should have default filter values', () => {
      const { result } = renderHook(() => usePatients());
      
      expect(result.current.filters.searchQuery).toBe('');
      expect(result.current.filters.riskLevelFilter).toBe('ALL');
      expect(result.current.filters.riskTypeFilter).toBe('ALL');
      expect(result.current.filters.sortBy).toBe('riskScore');
    });

    it('should calculate stats correctly', () => {
      const { result } = renderHook(() => usePatients());
      
      expect(result.current.stats.total).toBe(result.current.patients.length);
      expect(result.current.stats.high).toBeGreaterThanOrEqual(0);
      expect(result.current.stats.medium).toBeGreaterThanOrEqual(0);
      expect(result.current.stats.low).toBeGreaterThanOrEqual(0);
      expect(result.current.stats.trending).toBeGreaterThanOrEqual(0);
      
      // Stats should add up correctly
      expect(result.current.stats.high + result.current.stats.medium + result.current.stats.low)
        .toBe(result.current.stats.total);
    });

    it('should split patients into priority and monitoring lists', () => {
      const { result } = renderHook(() => usePatients());
      
      expect(result.current.priorityPatients.length).toBeLessThanOrEqual(3);
      expect(result.current.priorityPatients.length + result.current.monitoringPatients.length)
        .toBe(result.current.filteredPatients.length);
    });
  });

  describe('search filtering', () => {
    it('should filter patients by search query', () => {
      const { result } = renderHook(() => usePatients());
      const initialCount = result.current.filteredPatients.length;
      
      act(() => {
        result.current.actions.setSearchQuery('PT-');
      });
      
      // Should filter to patients with 'PT-' in ID
      result.current.filteredPatients.forEach(patient => {
        expect(patient.id.toLowerCase()).toContain('pt-');
      });
    });

    it('should be case-insensitive', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setSearchQuery('patient');
      });
      
      const lowerCaseCount = result.current.filteredPatients.length;
      
      act(() => {
        result.current.actions.setSearchQuery('PATIENT');
      });
      
      expect(result.current.filteredPatients.length).toBe(lowerCaseCount);
    });

    it('should return empty array for non-matching query', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setSearchQuery('xyz123nonexistent');
      });
      
      expect(result.current.filteredPatients.length).toBe(0);
    });
  });

  describe('risk level filtering', () => {
    it('should filter by HIGH risk level', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setRiskLevelFilter('HIGH');
      });
      
      result.current.filteredPatients.forEach(patient => {
        expect(patient.riskLevel).toBe('HIGH');
      });
      expect(result.current.filteredPatients.length).toBe(result.current.stats.high);
    });

    it('should filter by MEDIUM risk level', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setRiskLevelFilter('MEDIUM');
      });
      
      result.current.filteredPatients.forEach(patient => {
        expect(patient.riskLevel).toBe('MEDIUM');
      });
      expect(result.current.filteredPatients.length).toBe(result.current.stats.medium);
    });

    it('should filter by LOW risk level', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setRiskLevelFilter('LOW');
      });
      
      result.current.filteredPatients.forEach(patient => {
        expect(patient.riskLevel).toBe('LOW');
      });
      expect(result.current.filteredPatients.length).toBe(result.current.stats.low);
    });

    it('should show all patients when filter is ALL', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setRiskLevelFilter('HIGH');
      });
      
      act(() => {
        result.current.actions.setRiskLevelFilter('ALL');
      });
      
      expect(result.current.filteredPatients.length).toBe(result.current.patients.length);
    });
  });

  describe('risk type filtering', () => {
    it('should filter by Falls risk type', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setRiskTypeFilter('Falls');
      });
      
      result.current.filteredPatients.forEach(patient => {
        expect(patient.riskType).toBe('Falls');
      });
    });

    it('should filter by CAUTI risk type', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setRiskTypeFilter('CAUTI');
      });
      
      result.current.filteredPatients.forEach(patient => {
        expect(patient.riskType).toBe('CAUTI');
      });
    });

    it('should filter by Pressure Injury risk type', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setRiskTypeFilter('Pressure Injury');
      });
      
      result.current.filteredPatients.forEach(patient => {
        expect(patient.riskType).toBe('Pressure Injury');
      });
    });
  });

  describe('combined filtering', () => {
    it('should apply multiple filters together', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setRiskLevelFilter('HIGH');
        result.current.actions.setRiskTypeFilter('Falls');
      });
      
      result.current.filteredPatients.forEach(patient => {
        expect(patient.riskLevel).toBe('HIGH');
        expect(patient.riskType).toBe('Falls');
      });
    });
  });

  describe('sorting', () => {
    it('should sort by risk score (descending) by default', () => {
      const { result } = renderHook(() => usePatients());
      
      const scores = result.current.filteredPatients.map(p => p.riskScore);
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
      }
    });

    it('should sort by patient ID alphabetically', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setSortBy('id');
      });
      
      const ids = result.current.filteredPatients.map(p => p.id);
      const sortedIds = [...ids].sort((a, b) => a.localeCompare(b));
      expect(ids).toEqual(sortedIds);
    });

    it('should sort by last updated (ascending)', () => {
      const { result } = renderHook(() => usePatients());
      
      act(() => {
        result.current.actions.setSortBy('lastUpdated');
      });
      
      const times = result.current.filteredPatients.map(p => p.lastUpdatedMinutes);
      for (let i = 1; i < times.length; i++) {
        expect(times[i - 1]).toBeLessThanOrEqual(times[i]);
      }
    });
  });

  describe('reset filters', () => {
    it('should reset all filters to default values', () => {
      const { result } = renderHook(() => usePatients());
      
      // Apply various filters
      act(() => {
        result.current.actions.setSearchQuery('test');
        result.current.actions.setRiskLevelFilter('HIGH');
        result.current.actions.setRiskTypeFilter('Falls');
        result.current.actions.setSortBy('id');
      });
      
      // Reset
      act(() => {
        result.current.actions.resetFilters();
      });
      
      expect(result.current.filters.searchQuery).toBe('');
      expect(result.current.filters.riskLevelFilter).toBe('ALL');
      expect(result.current.filters.riskTypeFilter).toBe('ALL');
      expect(result.current.filters.sortBy).toBe('riskScore');
    });
  });

  describe('utility functions', () => {
    it('should find patient by ID', () => {
      const { result } = renderHook(() => usePatients());
      
      const firstPatient = result.current.patients[0];
      const found = result.current.findPatientById(firstPatient.id);
      
      expect(found).toBeDefined();
      expect(found?.id).toBe(firstPatient.id);
    });

    it('should return undefined for non-existent ID', () => {
      const { result } = renderHook(() => usePatients());
      
      const found = result.current.findPatientById('non-existent-id');
      
      expect(found).toBeUndefined();
    });

    it('should find patient by risk type', () => {
      const { result } = renderHook(() => usePatients());
      
      const found = result.current.findPatientByRiskType('Falls');
      
      expect(found).toBeDefined();
      expect(found?.riskType).toBe('Falls');
    });
  });
});
