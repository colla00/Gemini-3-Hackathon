// Keyboard shortcuts for performance monitoring dashboard
import { useEffect, useCallback } from 'react';

export interface PerformanceShortcutActions {
  toggleDashboard: () => void;
  captureBaseline: () => void;
  clearMetrics: () => void;
  exportReport: () => void;
  toggleMonitoring: () => void;
}

export interface UsePerformanceShortcutsOptions {
  /** Enable shortcuts (default: true) */
  enabled?: boolean;
  /** Actions to trigger */
  actions: Partial<PerformanceShortcutActions>;
  /** Whether dashboard is currently expanded */
  isExpanded?: boolean;
}

/**
 * Hook for keyboard shortcuts in performance monitoring
 * 
 * Shortcuts:
 * - Ctrl/Cmd + Shift + P: Toggle dashboard
 * - B: Capture baseline (when dashboard is open)
 * - C: Clear metrics (when dashboard is open)
 * - E: Export report (when dashboard is open)
 * - Space: Toggle monitoring (when dashboard is open)
 */
export const usePerformanceShortcuts = (
  options: UsePerformanceShortcutsOptions
): void => {
  const { enabled = true, actions, isExpanded = false } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? event.metaKey : event.ctrlKey;

    // Ctrl/Cmd + Shift + P: Toggle dashboard
    if (modifierKey && event.shiftKey && event.code === 'KeyP') {
      event.preventDefault();
      actions.toggleDashboard?.();
      return;
    }

    // The following shortcuts only work when dashboard is expanded
    if (!isExpanded) return;

    // B: Capture baseline
    if (event.code === 'KeyB' && !modifierKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      actions.captureBaseline?.();
      return;
    }

    // C: Clear metrics (without modifiers to avoid conflict with copy)
    if (event.code === 'KeyC' && event.altKey && !modifierKey && !event.shiftKey) {
      event.preventDefault();
      actions.clearMetrics?.();
      return;
    }

    // E: Export report
    if (event.code === 'KeyE' && !modifierKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      actions.exportReport?.();
      return;
    }

    // Space: Toggle monitoring (only when not focused on a button)
    if (event.code === 'Space' && target.tagName !== 'BUTTON') {
      event.preventDefault();
      actions.toggleMonitoring?.();
      return;
    }
  }, [enabled, actions, isExpanded]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

/**
 * Get formatted shortcut text for display
 */
export const getShortcutText = (shortcut: keyof PerformanceShortcutActions): string => {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  switch (shortcut) {
    case 'toggleDashboard':
      return `${modKey}+Shift+P`;
    case 'captureBaseline':
      return 'B';
    case 'clearMetrics':
      return 'Alt+C';
    case 'exportReport':
      return 'E';
    case 'toggleMonitoring':
      return 'Space';
    default:
      return '';
  }
};
