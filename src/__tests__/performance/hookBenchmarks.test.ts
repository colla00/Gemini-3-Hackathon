import { renderHook, act } from '@testing-library/react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Import hooks for benchmarking
import { usePatients } from '@/hooks/usePatients';
import { usePatientSelection } from '@/hooks/usePatientSelection';
import { useDemoScenarios } from '@/hooks/useDemoScenarios';
import { useTimeOffset } from '@/hooks/useTimeOffset';

// Mock dependencies
vi.mock('@/lib/performanceMonitor', () => ({
  performanceMonitor: {
    recordInteraction: vi.fn(),
    addMetric: vi.fn(),
  },
}));

vi.mock('@/hooks/usePerformance', () => ({
  usePerformanceTracking: () => ({
    trackInteraction: vi.fn(() => vi.fn()),
  }),
}));

// Performance measurement utilities
interface BenchmarkResult {
  name: string;
  avgRenderTime: number;
  minRenderTime: number;
  maxRenderTime: number;
  totalRenders: number;
  memoryUsage?: number;
}

const measureRenderTime = (renderFn: () => void, iterations: number = 100): BenchmarkResult => {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    times.push(end - start);
  }
  
  return {
    name: 'render',
    avgRenderTime: times.reduce((a, b) => a + b, 0) / times.length,
    minRenderTime: Math.min(...times),
    maxRenderTime: Math.max(...times),
    totalRenders: iterations,
  };
};

const measureHookPerformance = <T>(
  hookFn: () => T,
  iterations: number = 100
): BenchmarkResult => {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const { unmount } = renderHook(hookFn);
    const end = performance.now();
    times.push(end - start);
    unmount();
  }
  
  return {
    name: 'hook',
    avgRenderTime: times.reduce((a, b) => a + b, 0) / times.length,
    minRenderTime: Math.min(...times),
    maxRenderTime: Math.max(...times),
    totalRenders: iterations,
  };
};

describe('Hook Performance Benchmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('usePatients Performance', () => {
    it('should initialize within acceptable time', () => {
      const result = measureHookPerformance(() => usePatients(), 50);
      
      console.log('usePatients benchmark:', result);
      
      // Initial render should be under 10ms on average
      expect(result.avgRenderTime).toBeLessThan(10);
    });

    it('should handle filter updates efficiently', () => {
      const { result } = renderHook(() => usePatients());
      
      const times: number[] = [];
      
      for (let i = 0; i < 50; i++) {
        const start = performance.now();
        act(() => {
          result.current.actions.setSearchQuery(`test-${i}`);
        });
        const end = performance.now();
        times.push(end - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log('usePatients filter update avg time:', avgTime);
      
      // Filter updates should be under 5ms on average
      expect(avgTime).toBeLessThan(5);
    });

    it('should memoize filteredPatients correctly', () => {
      const { result, rerender } = renderHook(() => usePatients());
      
      const firstFiltered = result.current.filteredPatients;
      rerender();
      const secondFiltered = result.current.filteredPatients;
      
      // Should be referentially equal if no filter changed
      expect(firstFiltered).toBe(secondFiltered);
    });

    it('should memoize stats correctly', () => {
      const { result, rerender } = renderHook(() => usePatients());
      
      const firstStats = result.current.stats;
      rerender();
      const secondStats = result.current.stats;
      
      // Should be referentially equal
      expect(firstStats).toBe(secondStats);
    });
  });

  describe('usePatientSelection Performance', () => {
    it('should initialize within acceptable time', () => {
      const result = measureHookPerformance(() => usePatientSelection(), 50);
      
      console.log('usePatientSelection benchmark:', result);
      
      // Initial render should be under 5ms on average
      expect(result.avgRenderTime).toBeLessThan(5);
    });

    it('should handle selection updates efficiently', () => {
      vi.useFakeTimers();
      
      const { result } = renderHook(() => usePatientSelection());
      
      const mockPatient = {
        id: 'PT-001',
        riskLevel: 'HIGH' as const,
        riskScore: 85,
        riskType: 'Falls' as const,
        trend: 'up' as const,
        lastUpdated: '2024-01-15T10:00:00Z',
        lastUpdatedMinutes: 30,
        ageRange: '65-74',
        admissionDate: '2024-01-10',
        riskFactors: [],
        clinicalNotes: 'Test',
        riskSummary: 'High risk',
      };
      
      const times: number[] = [];
      
      for (let i = 0; i < 20; i++) {
        const start = performance.now();
        act(() => {
          result.current.selectPatient(mockPatient);
          vi.advanceTimersByTime(200);
        });
        const end = performance.now();
        times.push(end - start);
        
        act(() => {
          result.current.goBack();
          vi.advanceTimersByTime(200);
        });
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log('usePatientSelection transition avg time:', avgTime);
      
      // Selection with transition should be under 10ms on average
      expect(avgTime).toBeLessThan(10);
      
      vi.useRealTimers();
    });
  });

  describe('useDemoScenarios Performance', () => {
    const mockOptions = {
      setSelectedPatient: vi.fn(),
      findPatientById: vi.fn(),
      findPatientByRiskType: vi.fn(),
      setRiskLevelFilter: vi.fn(),
      setRiskTypeFilter: vi.fn(),
    };

    it('should initialize within acceptable time', () => {
      const result = measureHookPerformance(() => useDemoScenarios(mockOptions), 50);
      
      console.log('useDemoScenarios benchmark:', result);
      
      // Initial render should be under 5ms on average
      expect(result.avgRenderTime).toBeLessThan(5);
    });

    it('should memoize scenarios correctly', () => {
      const { result, rerender } = renderHook(() => useDemoScenarios(mockOptions));
      
      const firstScenarios = result.current;
      rerender();
      const secondScenarios = result.current;
      
      // Should be referentially equal if options haven't changed
      expect(firstScenarios).toBe(secondScenarios);
    });
  });

  describe('useTimeOffset Performance', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should initialize within acceptable time', () => {
      const result = measureHookPerformance(
        () => useTimeOffset({ autoStart: false }), 
        50
      );
      
      console.log('useTimeOffset benchmark:', result);
      
      // Initial render should be under 2ms on average
      expect(result.avgRenderTime).toBeLessThan(2);
    });

    it('should handle many time updates efficiently', () => {
      const { result } = renderHook(() => 
        useTimeOffset({ intervalMs: 100 })
      );
      
      const start = performance.now();
      
      // Simulate 100 time updates
      for (let i = 0; i < 100; i++) {
        act(() => {
          vi.advanceTimersByTime(100);
        });
      }
      
      const end = performance.now();
      const totalTime = end - start;
      
      console.log('useTimeOffset 100 updates total time:', totalTime);
      
      // 100 updates should complete in under 100ms
      expect(totalTime).toBeLessThan(100);
      expect(result.current.timeOffset).toBe(100);
    });

    it('should memoize getDisplayTime correctly', () => {
      const { result, rerender } = renderHook(() => 
        useTimeOffset({ autoStart: false })
      );
      
      const firstGetDisplayTime = result.current.getDisplayTime;
      rerender();
      const secondGetDisplayTime = result.current.getDisplayTime;
      
      // Should be referentially equal if offset hasn't changed
      expect(firstGetDisplayTime).toBe(secondGetDisplayTime);
    });
  });

  describe('Combined Hooks Performance', () => {
    it('should initialize all hooks together efficiently', () => {
      const mockPatientSelectionOptions = {
        findPatientById: vi.fn(),
        onResetFilters: vi.fn(),
      };
      
      const mockDemoOptions = {
        setSelectedPatient: vi.fn(),
        findPatientById: vi.fn(),
        findPatientByRiskType: vi.fn(),
        setRiskLevelFilter: vi.fn(),
        setRiskTypeFilter: vi.fn(),
      };

      const times: number[] = [];
      
      for (let i = 0; i < 30; i++) {
        const start = performance.now();
        
        const { unmount } = renderHook(() => {
          const patients = usePatients();
          const selection = usePatientSelection(mockPatientSelectionOptions);
          const demos = useDemoScenarios(mockDemoOptions);
          const time = useTimeOffset({ autoStart: false });
          
          return { patients, selection, demos, time };
        });
        
        const end = performance.now();
        times.push(end - start);
        unmount();
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log('Combined hooks initialization avg time:', avgTime);
      
      // All 4 hooks together should initialize in under 15ms on average
      expect(avgTime).toBeLessThan(15);
    });

    it('should handle concurrent state updates efficiently', () => {
      vi.useFakeTimers();
      
      const { result } = renderHook(() => {
        const patients = usePatients();
        const time = useTimeOffset({ intervalMs: 1000 });
        
        return { patients, time };
      });
      
      const times: number[] = [];
      
      for (let i = 0; i < 20; i++) {
        const start = performance.now();
        
        act(() => {
          result.current.patients.actions.setSearchQuery(`query-${i}`);
          vi.advanceTimersByTime(1000);
        });
        
        const end = performance.now();
        times.push(end - start);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log('Concurrent updates avg time:', avgTime);
      
      // Concurrent updates should be under 10ms on average
      expect(avgTime).toBeLessThan(10);
      
      vi.useRealTimers();
    });
  });

  describe('Memory Usage Estimates', () => {
    it('should not create memory leaks on repeated mount/unmount', () => {
      const initialHeapUsed = process.memoryUsage?.()?.heapUsed ?? 0;
      
      for (let i = 0; i < 100; i++) {
        const { unmount } = renderHook(() => {
          usePatients();
          useTimeOffset({ autoStart: false });
        });
        unmount();
      }
      
      // Force garbage collection if available (Node.js with --expose-gc)
      if (global.gc) {
        global.gc();
      }
      
      const finalHeapUsed = process.memoryUsage?.()?.heapUsed ?? 0;
      const memoryGrowth = finalHeapUsed - initialHeapUsed;
      
      console.log('Memory growth after 100 mount/unmount cycles:', memoryGrowth);
      
      // Memory should not grow excessively (less than 5MB)
      // Note: This is a rough estimate; actual values depend on the environment
      if (initialHeapUsed > 0) {
        expect(memoryGrowth).toBeLessThan(5 * 1024 * 1024);
      }
    });

    it('should clean up intervals on unmount', () => {
      vi.useFakeTimers();
      
      const { result, unmount } = renderHook(() => useTimeOffset());
      
      expect(result.current.isRunning).toBe(true);
      
      unmount();
      
      // Should not throw or cause issues when advancing timers after unmount
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(60000);
        });
      }).not.toThrow();
      
      vi.useRealTimers();
    });
  });
});

// Performance summary test
describe('Performance Summary', () => {
  it('should generate performance report', () => {
    const report = {
      usePatients: measureHookPerformance(() => usePatients(), 20),
      usePatientSelection: measureHookPerformance(() => usePatientSelection(), 20),
      useDemoScenarios: measureHookPerformance(() => useDemoScenarios({
        setSelectedPatient: vi.fn(),
        findPatientById: vi.fn(),
        findPatientByRiskType: vi.fn(),
        setRiskLevelFilter: vi.fn(),
        setRiskTypeFilter: vi.fn(),
      }), 20),
      useTimeOffset: measureHookPerformance(() => useTimeOffset({ autoStart: false }), 20),
    };
    
    console.log('\n=== Hook Performance Report ===');
    Object.entries(report).forEach(([name, result]) => {
      console.log(`\n${name}:`);
      console.log(`  Avg: ${result.avgRenderTime.toFixed(3)}ms`);
      console.log(`  Min: ${result.minRenderTime.toFixed(3)}ms`);
      console.log(`  Max: ${result.maxRenderTime.toFixed(3)}ms`);
    });
    console.log('\n================================\n');
    
    // All hooks should meet performance budget
    expect(report.usePatients.avgRenderTime).toBeLessThan(10);
    expect(report.usePatientSelection.avgRenderTime).toBeLessThan(5);
    expect(report.useDemoScenarios.avgRenderTime).toBeLessThan(5);
    expect(report.useTimeOffset.avgRenderTime).toBeLessThan(2);
  });
});
