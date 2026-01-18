// Barrel export for all hooks
// This file provides a single import point for all custom hooks

// UI & Mobile
export { useIsMobile } from './use-mobile';

// Toast notifications
export { useToast, toast } from './use-toast';

// Authentication
export { useAuth, AuthProvider } from './useAuth';

// Audit logging
export { useAuditLog } from './useAuditLog';

// Demo & Presentation
export { useAutoDemo } from './useAutoDemo';
export { useAutoWalkthrough } from './useAutoWalkthrough';
export { useDemoScenarios, DEFAULT_DEMO_SCENARIOS, calculateTotalDuration, formatDuration } from './useDemoScenarios';
export type { UseDemoScenariosOptions, DemoScenarioConfig } from './useDemoScenarios';

// Guided tours
export { useGuidedTour } from './useGuidedTour';

// Keyboard shortcuts
export { useKeyboardShortcuts } from './useKeyboardShortcuts';

// Live simulation
export { useLiveSimulation } from './useLiveSimulation';

// Narration
export { useNarration } from './useNarration';

// Patient management
export { usePatients } from './usePatients';
export type { 
  UsePatientFilters, 
  UsePatientActions, 
  UsePatientStats, 
  UsePatientsReturn,
  SortOption 
} from './usePatients';

export { usePatientSelection } from './usePatientSelection';
export type { 
  UsePatientSelectionOptions, 
  UsePatientSelectionReturn 
} from './usePatientSelection';

// Performance monitoring
export { usePerformanceTracking } from './usePerformance';
export { usePerformanceBudget } from './usePerformanceBudget';

// Presentation
export { usePresentationSession } from './usePresentationSession';
export { usePresenterSync } from './usePresenterSync';

// Session management
export { useSessionTimeout } from './useSessionTimeout';
export { useSessionTracking } from './useSessionTracking';

// Settings
export { useSettings, SettingsProvider } from './useSettings';

// Time utilities
export { useTimeOffset } from './useTimeOffset';
export type { UseTimeOffsetOptions, UseTimeOffsetReturn } from './useTimeOffset';
