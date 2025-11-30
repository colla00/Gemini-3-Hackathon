import { useEffect, useCallback } from 'react';

export type ViewType = 'dashboard' | 'patients' | 'shap' | 'workflow';

interface ShortcutHandlers {
  onViewChange: (view: ViewType) => void;
  onToggleDemo?: () => void;
  onNextView?: () => void;
  onPrevView?: () => void;
  onToggleLive?: () => void;
  onPrint?: () => void;
}

const viewKeys: Record<string, ViewType> = {
  '1': 'dashboard',
  '2': 'patients',
  '3': 'shap',
  '4': 'workflow',
};

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger if user is typing in an input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const key = event.key.toLowerCase();

    // Number keys 1-4 for view switching
    if (viewKeys[key]) {
      event.preventDefault();
      handlers.onViewChange(viewKeys[key]);
      return;
    }

    // Arrow keys for navigation
    if (key === 'arrowright' && handlers.onNextView) {
      event.preventDefault();
      handlers.onNextView();
      return;
    }

    if (key === 'arrowleft' && handlers.onPrevView) {
      event.preventDefault();
      handlers.onPrevView();
      return;
    }

    // D key for demo toggle
    if (key === 'd' && handlers.onToggleDemo) {
      event.preventDefault();
      handlers.onToggleDemo();
      return;
    }

    // L key for live updates toggle
    if (key === 'l' && handlers.onToggleLive) {
      event.preventDefault();
      handlers.onToggleLive();
      return;
    }

    // P key for print
    if (key === 'p' && event.ctrlKey && handlers.onPrint) {
      event.preventDefault();
      handlers.onPrint();
      return;
    }

    // Escape to stop demo
    if (key === 'escape' && handlers.onToggleDemo) {
      event.preventDefault();
      // This will stop the demo if it's running
      handlers.onToggleDemo();
      return;
    }
  }, [handlers]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts: [
      { key: '1-4', description: 'Switch between views' },
      { key: '← →', description: 'Navigate views' },
      { key: 'D', description: 'Toggle auto-demo' },
      { key: 'L', description: 'Toggle live updates' },
      { key: 'Ctrl+P', description: 'Print view' },
      { key: 'Esc', description: 'Stop demo' },
    ],
  };
};
