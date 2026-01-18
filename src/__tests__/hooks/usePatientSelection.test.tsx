import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePatientSelection } from '@/hooks/usePatientSelection';
import type { Patient } from '@/types/patient';

// Mock the performance hooks and monitor
vi.mock('@/hooks/usePerformance', () => ({
  usePerformanceTracking: () => ({
    trackInteraction: vi.fn(() => vi.fn()),
  }),
}));

vi.mock('@/lib/performanceMonitor', () => ({
  performanceMonitor: {
    recordInteraction: vi.fn(),
    addMetric: vi.fn(),
  },
}));

const mockPatient: Patient = {
  id: 'PT-001',
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

const mockPatient2: Patient = {
  id: 'PT-002',
  riskLevel: 'MEDIUM',
  riskScore: 65,
  riskType: 'CAUTI',
  trend: 'stable',
  lastUpdated: '2024-01-15T11:00:00Z',
  lastUpdatedMinutes: 15,
  ageRange: '55-64',
  admissionDate: '2024-01-12',
  riskFactors: [],
  clinicalNotes: 'Test notes 2',
  riskSummary: 'Moderate CAUTI risk',
};

describe('usePatientSelection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should have no selected patient initially', () => {
      const { result } = renderHook(() => usePatientSelection());
      
      expect(result.current.selectedPatient).toBeNull();
      expect(result.current.isTransitioning).toBe(false);
    });
  });

  describe('selectPatient', () => {
    it('should select a patient with transition', async () => {
      const { result } = renderHook(() => usePatientSelection());
      
      act(() => {
        result.current.selectPatient(mockPatient);
      });
      
      // Should be transitioning
      expect(result.current.isTransitioning).toBe(true);
      expect(result.current.selectedPatient).toBeNull();
      
      // Fast-forward past transition
      act(() => {
        vi.advanceTimersByTime(200);
      });
      
      expect(result.current.isTransitioning).toBe(false);
      expect(result.current.selectedPatient).toEqual(mockPatient);
    });

    it('should respect custom transition duration', async () => {
      const { result } = renderHook(() => 
        usePatientSelection({ transitionDuration: 500 })
      );
      
      act(() => {
        result.current.selectPatient(mockPatient);
      });
      
      // Should still be transitioning after default duration
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current.isTransitioning).toBe(true);
      
      // Should complete after custom duration
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current.isTransitioning).toBe(false);
      expect(result.current.selectedPatient).toEqual(mockPatient);
    });
  });

  describe('goBack', () => {
    it('should deselect patient with transition', async () => {
      const { result } = renderHook(() => usePatientSelection());
      
      // First select a patient
      act(() => {
        result.current.selectPatient(mockPatient);
        vi.advanceTimersByTime(200);
      });
      
      expect(result.current.selectedPatient).toEqual(mockPatient);
      
      // Now go back
      act(() => {
        result.current.goBack();
      });
      
      expect(result.current.isTransitioning).toBe(true);
      
      act(() => {
        vi.advanceTimersByTime(200);
      });
      
      expect(result.current.isTransitioning).toBe(false);
      expect(result.current.selectedPatient).toBeNull();
    });
  });

  describe('setSelectedPatient', () => {
    it('should set patient directly without transition', () => {
      const { result } = renderHook(() => usePatientSelection());
      
      act(() => {
        result.current.setSelectedPatient(mockPatient);
      });
      
      expect(result.current.selectedPatient).toEqual(mockPatient);
      expect(result.current.isTransitioning).toBe(false);
    });

    it('should clear patient directly without transition', () => {
      const { result } = renderHook(() => usePatientSelection());
      
      act(() => {
        result.current.setSelectedPatient(mockPatient);
      });
      
      act(() => {
        result.current.setSelectedPatient(null);
      });
      
      expect(result.current.selectedPatient).toBeNull();
      expect(result.current.isTransitioning).toBe(false);
    });
  });

  describe('keyboard shortcuts', () => {
    it('should go back on Escape when patient is selected', async () => {
      const { result } = renderHook(() => usePatientSelection());
      
      // Select a patient first
      act(() => {
        result.current.setSelectedPatient(mockPatient);
      });
      
      // Simulate Escape key
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });
      
      expect(result.current.isTransitioning).toBe(true);
      
      act(() => {
        vi.advanceTimersByTime(200);
      });
      
      expect(result.current.selectedPatient).toBeNull();
    });

    it('should select demo patient on number key press', async () => {
      const findPatientById = vi.fn((id: string) => {
        if (id === 'PT-2847') return mockPatient;
        return undefined;
      });
      
      const { result } = renderHook(() => 
        usePatientSelection({ findPatientById })
      );
      
      // Simulate pressing '1'
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
      });
      
      expect(findPatientById).toHaveBeenCalledWith('PT-2847');
      expect(result.current.isTransitioning).toBe(true);
      
      act(() => {
        vi.advanceTimersByTime(200);
      });
      
      expect(result.current.selectedPatient).toEqual(mockPatient);
    });

    it('should call onResetFilters on r key press', () => {
      const onResetFilters = vi.fn();
      
      renderHook(() => 
        usePatientSelection({ onResetFilters })
      );
      
      // Simulate pressing 'r'
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
      });
      
      expect(onResetFilters).toHaveBeenCalled();
    });

    it('should not trigger shortcuts when disabled', () => {
      const onResetFilters = vi.fn();
      
      renderHook(() => 
        usePatientSelection({ 
          onResetFilters, 
          enableKeyboardShortcuts: false 
        })
      );
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r' }));
      });
      
      expect(onResetFilters).not.toHaveBeenCalled();
    });

    it('should use custom demo patient IDs', async () => {
      const findPatientById = vi.fn((id: string) => {
        if (id === 'CUSTOM-001') return mockPatient;
        return undefined;
      });
      
      renderHook(() => 
        usePatientSelection({ 
          findPatientById,
          demoPatientIds: ['CUSTOM-001', 'CUSTOM-002', 'CUSTOM-003'],
        })
      );
      
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
      });
      
      expect(findPatientById).toHaveBeenCalledWith('CUSTOM-001');
    });
  });
});
