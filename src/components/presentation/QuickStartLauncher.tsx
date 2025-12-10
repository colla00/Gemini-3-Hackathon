import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, Monitor, Users, Play, CheckCircle, 
  ExternalLink, Settings, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PreFlightChecklist } from './PreFlightChecklist';
import { useAuth } from '@/hooks/useAuth';

interface QuickStartLauncherProps {
  className?: string;
}

export const QuickStartLauncher = ({ className }: QuickStartLauncherProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [showChecklist, setShowChecklist] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'presenter' | 'audience'>('presenter');

  const launchModes = [
    {
      id: 'presenter' as const,
      title: 'Presenter Mode',
      description: 'Full control with timer, notes & audience sync',
      icon: Monitor,
      badge: 'Admin Only',
      badgeVariant: 'default' as const,
      requiresAdmin: true,
    },
    {
      id: 'audience' as const,
      title: 'Audience View',
      description: 'Clean view for screen sharing on Zoom',
      icon: Users,
      badge: 'Share This',
      badgeVariant: 'secondary' as const,
      requiresAdmin: false,
    },
  ];

  const handleLaunch = () => {
    setShowChecklist(false);
    
    switch (selectedMode) {
      case 'presenter':
        // Open audience window and navigate to presenter
        const audienceWindow = window.open('/presentation?mode=audience', 'audience', 'width=1920,height=1080');
        if (audienceWindow) {
          audienceWindow.focus();
        }
        navigate('/presentation?mode=presenter');
        break;
      case 'audience':
        navigate('/presentation?mode=audience');
        break;
    }
  };

  const handleModeSelect = (modeId: 'presenter' | 'audience') => {
    if (modeId === 'presenter' && !isAdmin) return;
    setSelectedMode(modeId);
  };

  const handleStartClick = () => {
    if (selectedMode === 'presenter') {
      setShowChecklist(true);
    } else {
      handleLaunch();
    }
  };

  return (
    <>
      <Card className={cn("border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Rocket className="w-5 h-5 text-primary" />
            Quick Start Presentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Selection */}
          <div className="grid gap-2">
            {launchModes.map((mode) => {
              const isDisabled = mode.requiresAdmin && !isAdmin;
              const isSelected = selectedMode === mode.id;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeSelect(mode.id)}
                  disabled={isDisabled}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                    isSelected && "border-primary bg-primary/10",
                    !isSelected && !isDisabled && "border-border hover:border-primary/50 hover:bg-secondary/50",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-secondary"
                  )}>
                    <mode.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{mode.title}</span>
                      <Badge variant={mode.badgeVariant} className="text-[10px]">
                        {mode.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{mode.description}</p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Launch Button */}
          <Button
            onClick={handleStartClick}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {selectedMode === 'presenter' ? (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Run Pre-Flight Check
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start {launchModes.find(m => m.id === selectedMode)?.title}
              </>
            )}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {/* Presenter tip */}
          {selectedMode === 'presenter' && isAdmin && (
            <p className="text-xs text-muted-foreground text-center">
              <ExternalLink className="w-3 h-3 inline mr-1" />
              This will open both presenter controls and audience window
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pre-Flight Checklist Modal */}
      <PreFlightChecklist
        isOpen={showChecklist}
        onClose={() => setShowChecklist(false)}
        onLaunch={handleLaunch}
      />
    </>
  );
};
