import { useState } from 'react';
import { 
  Settings, X, Moon, Sun, Bell, BellOff, 
  Monitor, Smartphone, Eye, EyeOff, Zap, ZapOff,
  Volume2, VolumeX, Layout, LayoutGrid, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsState {
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

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'theme' | 'notifications' | 'display'>('theme');

  const updateNotificationSetting = (key: keyof SettingsState['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const updateDisplaySetting = (key: keyof SettingsState['display'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    toast.success('Settings saved', { description: 'Your preferences have been updated.' });
    onClose();
  };

  const tabs = [
    { id: 'theme' as const, label: 'Appearance', icon: <Sun className="w-4 h-4" /> },
    { id: 'notifications' as const, label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'display' as const, label: 'Display', icon: <Layout className="w-4 h-4" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-secondary border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Settings className="w-5 h-5 text-primary" />
            Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure your dashboard preferences
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          {/* Theme Settings */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground">Theme Mode</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dark' as const, label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                    { id: 'light' as const, label: 'Light', icon: <Sun className="w-4 h-4" /> },
                    { id: 'system' as const, label: 'System', icon: <Monitor className="w-4 h-4" /> },
                  ].map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                        settings.theme === theme.id
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                      )}
                    >
                      {theme.icon}
                      <span className="text-xs font-medium">{theme.label}</span>
                      {settings.theme === theme.id && (
                        <Check className="w-3 h-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                <p className="text-[11px] text-muted-foreground">
                  <strong className="text-foreground">Note:</strong> This is a research prototype. 
                  Theme changes are preview-only and will reset on refresh.
                </p>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                <div className="flex items-center gap-3">
                  {settings.notifications.enabled ? (
                    <Bell className="w-5 h-5 text-primary" />
                  ) : (
                    <BellOff className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <Label className="text-sm font-medium text-foreground">Enable Notifications</Label>
                    <p className="text-[11px] text-muted-foreground">Receive alerts and reminders</p>
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.enabled}
                  onCheckedChange={(checked) => updateNotificationSetting('enabled', checked)}
                />
              </div>

              <div className={cn("space-y-3", !settings.notifications.enabled && "opacity-50 pointer-events-none")}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-risk-high" />
                    <Label className="text-sm text-foreground">High-Risk Patient Alerts</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.highRiskAlerts}
                    onCheckedChange={(checked) => updateNotificationSetting('highRiskAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-risk-medium" />
                    <Label className="text-sm text-foreground">Intervention Reminders</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.interventionReminders}
                    onCheckedChange={(checked) => updateNotificationSetting('interventionReminders', checked)}
                  />
                </div>

                <Separator className="bg-border/50" />

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {settings.notifications.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-primary" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Label className="text-sm text-foreground">Sound Alerts</Label>
                  </div>
                  <Switch
                    checked={settings.notifications.soundEnabled}
                    onCheckedChange={(checked) => updateNotificationSetting('soundEnabled', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm text-foreground">Compact Mode</Label>
                    <p className="text-[11px] text-muted-foreground">Reduce spacing for more data</p>
                  </div>
                </div>
                <Switch
                  checked={settings.display.compactMode}
                  onCheckedChange={(checked) => updateDisplaySetting('compactMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {settings.display.animationsEnabled ? (
                    <Zap className="w-4 h-4 text-primary" />
                  ) : (
                    <ZapOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div>
                    <Label className="text-sm text-foreground">Animations</Label>
                    <p className="text-[11px] text-muted-foreground">Enable UI transitions</p>
                  </div>
                </div>
                <Switch
                  checked={settings.display.animationsEnabled}
                  onCheckedChange={(checked) => updateDisplaySetting('animationsEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {settings.display.showConfidenceScores ? (
                    <Eye className="w-4 h-4 text-primary" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                  <div>
                    <Label className="text-sm text-foreground">Confidence Scores</Label>
                    <p className="text-[11px] text-muted-foreground">Show AI prediction confidence</p>
                  </div>
                </div>
                <Switch
                  checked={settings.display.showConfidenceScores}
                  onCheckedChange={(checked) => updateDisplaySetting('showConfidenceScores', checked)}
                />
              </div>

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
                  <div>
                    <Label className="text-sm text-foreground">Live Updates Default</Label>
                    <p className="text-[11px] text-muted-foreground">Auto-enable live data on load</p>
                  </div>
                </div>
                <Switch
                  checked={settings.display.liveUpdatesDefault}
                  onCheckedChange={(checked) => updateDisplaySetting('liveUpdatesDefault', checked)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
          <button
            onClick={() => setSettings(defaultSettings)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset to defaults
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
