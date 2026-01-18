// Hook for patient selection, transitions, and keyboard shortcuts
import { useState, useEffect, useCallback } from 'react';
import type { Patient } from '@/types/patient';
import { usePerformanceTracking } from '@/hooks/usePerformance';
import { performanceMonitor } from '@/lib/performanceMonitor';

export interface UsePatientSelectionOptions {
  /** Callback to find a patient by ID */
  findPatientById?: (id: string) => Patient | undefined;
  /** Callback to reset filters */
  onResetFilters?: () => void;
  /** Transition duration in ms */
  transitionDuration?: number;
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts?: boolean;
  /** Demo patient IDs for keyboard shortcuts 1, 2, 3 */
  demoPatientIds?: [string, string, string];
}

export interface UsePatientSelectionReturn {
  /** Currently selected patient */
  selectedPatient: Patient | null;
  /** Whether a transition is in progress */
  isTransitioning: boolean;
  /** Select a patient with transition animation */
  selectPatient: (patient: Patient) => void;
  /** Go back to list view with transition animation */
  goBack: () => void;
  /** Directly set selected patient without transition */
  setSelectedPatient: (patient: Patient | null) => void;
}

/**
 * Hook to manage patient selection state, transitions, and keyboard shortcuts
 */
export const usePatientSelection = (
  options: UsePatientSelectionOptions = {}
): UsePatientSelectionReturn => {
  const {
    findPatientById,
    onResetFilters,
    transitionDuration = 200,
    enableKeyboardShortcuts = true,
    demoPatientIds = ['PT-2847', 'PT-1923', 'PT-5612'],
  } = options;

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Performance tracking
  const { trackInteraction } = usePerformanceTracking('PatientSelection');

  // Select patient with transition animation and performance tracking
  const selectPatient = useCallback((patient: Patient) => {
    const endTracking = trackInteraction('patient-selection');
    performanceMonitor.addMetric({
      name: 'patient-selected',
      value: 1,
      unit: 'count',
      timestamp: Date.now(),
      category: 'interaction',
    });
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPatient(patient);
      setIsTransitioning(false);
      endTracking();
    }, transitionDuration);
  }, [trackInteraction, transitionDuration]);

  // Go back to list view with transition animation
  const goBack = useCallback(() => {
    const endTracking = trackInteraction('patient-deselection');
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPatient(null);
      setIsTransitioning(false);
      endTracking();
    }, transitionDuration);
  }, [trackInteraction, transitionDuration]);

  // Keyboard shortcuts for demo control
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to go back
      if (e.key === 'Escape' && selectedPatient) {
        goBack();
        return;
      }

      // Only handle other shortcuts when no patient is selected
      if (selectedPatient) return;

      // 'f' to focus search
      if (e.key === 'f') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
        return;
      }

      // Number keys 1-3 to select demo patients
      if (findPatientById) {
        if (e.key === '1') {
          const patient = findPatientById(demoPatientIds[0]);
          if (patient) selectPatient(patient);
        }
        if (e.key === '2') {
          const patient = findPatientById(demoPatientIds[1]);
          if (patient) selectPatient(patient);
        }
        if (e.key === '3') {
          const patient = findPatientById(demoPatientIds[2]);
          if (patient) selectPatient(patient);
        }
      }

      // 'r' to reset filters
      if (e.key === 'r' && onResetFilters) {
        onResetFilters();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedPatient,
    enableKeyboardShortcuts,
    findPatientById,
    onResetFilters,
    selectPatient,
    goBack,
    demoPatientIds,
  ]);

  return {
    selectedPatient,
    isTransitioning,
    selectPatient,
    goBack,
    setSelectedPatient,
  };
};
