// Hook for patient data fetching and filtering logic
import { useState, useMemo, useCallback } from 'react';
import { patients } from '@/data/patients';
import type { Patient, RiskLevel, RiskType } from '@/types/patient';
import { performanceMonitor } from '@/lib/performanceMonitor';

export type SortOption = 'riskScore' | 'lastUpdated' | 'id';

export interface UsePatientFilters {
  searchQuery: string;
  riskLevelFilter: RiskLevel | 'ALL';
  riskTypeFilter: RiskType | 'ALL';
  sortBy: SortOption;
}

export interface UsePatientActions {
  setSearchQuery: (value: string) => void;
  setRiskLevelFilter: (value: RiskLevel | 'ALL') => void;
  setRiskTypeFilter: (value: RiskType | 'ALL') => void;
  setSortBy: (value: SortOption) => void;
  resetFilters: () => void;
}

export interface UsePatientStats {
  total: number;
  high: number;
  medium: number;
  low: number;
  trending: number;
}

export interface UsePatientsReturn {
  // Data
  patients: Patient[];
  filteredPatients: Patient[];
  priorityPatients: Patient[];
  monitoringPatients: Patient[];
  stats: UsePatientStats;
  
  // Filters
  filters: UsePatientFilters;
  actions: UsePatientActions;
  
  // Utilities
  findPatientById: (id: string) => Patient | undefined;
  findPatientByRiskType: (riskType: RiskType) => Patient | undefined;
}

/**
 * Hook to encapsulate patient data fetching and filtering logic
 * Provides filtered patient lists, stats, and filter controls
 */
export const usePatients = (): UsePatientsReturn => {
  // Filter state
  const [searchQuery, setSearchQueryState] = useState('');
  const [riskLevelFilter, setRiskLevelFilterState] = useState<RiskLevel | 'ALL'>('ALL');
  const [riskTypeFilter, setRiskTypeFilterState] = useState<RiskType | 'ALL'>('ALL');
  const [sortBy, setSortByState] = useState<SortOption>('riskScore');

  // Tracked filter handlers with performance monitoring
  const setSearchQuery = useCallback((value: string) => {
    performanceMonitor.recordInteraction('filter-search', performance.now());
    setSearchQueryState(value);
  }, []);

  const setRiskLevelFilter = useCallback((value: RiskLevel | 'ALL') => {
    performanceMonitor.recordInteraction('filter-risk-level', performance.now());
    performanceMonitor.addMetric({
      name: 'filter-risk-level-change',
      value: 1,
      unit: 'count',
      timestamp: Date.now(),
      category: 'interaction',
    });
    setRiskLevelFilterState(value);
  }, []);

  const setRiskTypeFilter = useCallback((value: RiskType | 'ALL') => {
    performanceMonitor.recordInteraction('filter-risk-type', performance.now());
    performanceMonitor.addMetric({
      name: 'filter-risk-type-change',
      value: 1,
      unit: 'count',
      timestamp: Date.now(),
      category: 'interaction',
    });
    setRiskTypeFilterState(value);
  }, []);

  const setSortBy = useCallback((value: SortOption) => {
    performanceMonitor.recordInteraction('filter-sort', performance.now());
    performanceMonitor.addMetric({
      name: 'filter-sort-change',
      value: 1,
      unit: 'count',
      timestamp: Date.now(),
      category: 'interaction',
    });
    setSortByState(value);
  }, []);

  const resetFilters = useCallback(() => {
    performanceMonitor.recordInteraction('filter-reset', performance.now());
    setSearchQueryState('');
    setRiskLevelFilterState('ALL');
    setRiskTypeFilterState('ALL');
    setSortByState('riskScore');
  }, []);

  // Filtered and sorted patients
  const filteredPatients = useMemo(() => {
    let result = [...patients];

    if (searchQuery) {
      result = result.filter((p) =>
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (riskLevelFilter !== 'ALL') {
      result = result.filter((p) => p.riskLevel === riskLevelFilter);
    }

    if (riskTypeFilter !== 'ALL') {
      result = result.filter((p) => p.riskType === riskTypeFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'riskScore':
          return b.riskScore - a.riskScore;
        case 'id':
          return a.id.localeCompare(b.id);
        case 'lastUpdated':
          return a.lastUpdatedMinutes - b.lastUpdatedMinutes;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, riskLevelFilter, riskTypeFilter, sortBy]);

  // Split patients into priority and monitoring lists
  const priorityPatients = useMemo(() => filteredPatients.slice(0, 3), [filteredPatients]);
  const monitoringPatients = useMemo(() => filteredPatients.slice(3), [filteredPatients]);

  // Patient stats
  const stats = useMemo<UsePatientStats>(() => ({
    total: patients.length,
    high: patients.filter((p) => p.riskLevel === 'HIGH').length,
    medium: patients.filter((p) => p.riskLevel === 'MEDIUM').length,
    low: patients.filter((p) => p.riskLevel === 'LOW').length,
    trending: patients.filter((p) => p.trend === 'up').length,
  }), []);

  // Utility functions
  const findPatientById = useCallback((id: string) => {
    return patients.find(p => p.id === id);
  }, []);

  const findPatientByRiskType = useCallback((riskType: RiskType) => {
    return patients.find(p => p.riskType === riskType);
  }, []);

  return {
    // Data
    patients,
    filteredPatients,
    priorityPatients,
    monitoringPatients,
    stats,
    
    // Filters
    filters: {
      searchQuery,
      riskLevelFilter,
      riskTypeFilter,
      sortBy,
    },
    actions: {
      setSearchQuery,
      setRiskLevelFilter,
      setRiskTypeFilter,
      setSortBy,
      resetFilters,
    },
    
    // Utilities
    findPatientById,
    findPatientByRiskType,
  };
};
