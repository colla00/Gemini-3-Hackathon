import { useState } from 'react';
import { Home, Bell, Scale, BarChart3, Settings } from 'lucide-react';
import { TrustScoreDashboard } from './TrustScoreDashboard';
import { AlertInsightView } from './AlertInsightView';
import { BiasMonitorDashboard } from './BiasMonitorDashboard';
import { ReasoningExplorer } from './ReasoningExplorer';
import { CognitiveLoadMonitor } from './CognitiveLoadMonitor';

const screens = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'alert-insight', label: 'Alerts', icon: Bell },
  { id: 'bias-monitor', label: 'Bias Monitor', icon: Scale },
  { id: 'reasoning', label: 'Insights', icon: BarChart3 },
  { id: 'cognitive-load', label: 'Settings', icon: Settings },
];

export const ChartMinderPanel = () => {
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  return (
    <div className="relative">
      {/* Screen Content */}
      <div className="pb-16">
        {activeScreen === 'dashboard' && <TrustScoreDashboard onNavigate={handleNavigate} />}
        {activeScreen === 'alert-insight' && <AlertInsightView onNavigate={handleNavigate} />}
        {activeScreen === 'bias-monitor' && <BiasMonitorDashboard onNavigate={handleNavigate} />}
        {activeScreen === 'reasoning' && <ReasoningExplorer onNavigate={handleNavigate} />}
        {activeScreen === 'cognitive-load' && <CognitiveLoadMonitor onNavigate={handleNavigate} />}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="sticky bottom-0 bg-card border-t border-border/40 flex items-center justify-around py-2 px-1 -mx-4 md:-mx-8 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {screens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => setActiveScreen(screen.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeScreen === screen.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <screen.icon className={`h-5 w-5 ${activeScreen === screen.id ? 'text-primary' : ''}`} />
            <span className={`text-[10px] ${activeScreen === screen.id ? 'font-bold' : 'font-medium'}`}>
              {screen.label}
            </span>
            {activeScreen === screen.id && (
              <div className="h-0.5 w-6 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
