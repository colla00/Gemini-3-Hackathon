import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  notifications: {
    enabled: boolean;
    highRiskAlerts: boolean;
    interventionReminders: boolean;
    soundEnabled: boolean;
  };
  display: {
    compactMode: boolean;
    animationsEnabled: boolean;
    showConfidenceScores: boolean;
    liveUpdatesDefault: boolean;
  };
}

const SETTINGS_STORAGE_KEY = 'nso-dashboard-settings';

const defaultSettings: SettingsState = {
  theme: 'dark',
  notifications: {
    enabled: true,
    highRiskAlerts: true,
    interventionReminders: true,
    soundEnabled: false,
  },
  display: {
    compactMode: false,
    animationsEnabled: true,
    showConfidenceScores: true,
    liveUpdatesDefault: true,
  },
};

const loadSettings = (): SettingsState => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load settings from localStorage');
  }
  return defaultSettings;
};

const saveSettings = (settings: SettingsState): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to localStorage');
  }
};

interface SettingsContextType {
  settings: SettingsState;
  updateTheme: (theme: SettingsState['theme']) => void;
  updateNotification: (key: keyof SettingsState['notifications'], value: boolean) => void;
  updateDisplay: (key: keyof SettingsState['display'], value: boolean) => void;
  resetSettings: () => void;
  saveCurrentSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsState>(loadSettings);

  // Apply settings effects
  useEffect(() => {
    // Apply animations setting
    if (!settings.display.animationsEnabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    // Apply compact mode
    if (settings.display.compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }
  }, [settings.display.animationsEnabled, settings.display.compactMode]);

  const updateTheme = useCallback((theme: SettingsState['theme']) => {
    setSettings(prev => {
      const newSettings = { ...prev, theme };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const updateNotification = useCallback((key: keyof SettingsState['notifications'], value: boolean) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        notifications: { ...prev.notifications, [key]: value },
      };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const updateDisplay = useCallback((key: keyof SettingsState['display'], value: boolean) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        display: { ...prev.display, [key]: value },
      };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  }, []);

  const saveCurrentSettings = useCallback(() => {
    saveSettings(settings);
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateTheme,
        updateNotification,
        updateDisplay,
        resetSettings,
        saveCurrentSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Export default settings for reference
export { defaultSettings };
