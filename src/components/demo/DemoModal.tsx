import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, X, Activity, TrendingUp, TrendingDown, 
  AlertTriangle, Clock, Users, Brain, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoPatient {
  id: string;
  name: string;
  room: string;
  riskScore: number;
  riskType: string;
  trend: 'up' | 'down' | 'stable';
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

const DEMO_DURATION = 300; // 5 minutes in seconds

const initialPatients: DemoPatient[] = [
  { id: 'A01', name: 'Patient A01', room: '412A', riskScore: 72, riskType: 'Falls', trend: 'up', riskLevel: 'HIGH' },
  { id: 'B02', name: 'Patient B02', room: '408B', riskScore: 48, riskType: 'Pressure Injury', trend: 'down', riskLevel: 'MEDIUM' },
  { id: 'G07', name: 'Patient G07', room: '402A', riskScore: 75, riskType: 'Falls', trend: 'up', riskLevel: 'HIGH' },
  { id: 'L11', name: 'Patient L11', room: '401A', riskScore: 78, riskType: 'CAUTI', trend: 'up', riskLevel: 'HIGH' },
  { id: 'C03', name: 'Patient C03', room: '415A', riskScore: 18, riskType: 'Device', trend: 'down', riskLevel: 'LOW' },
  { id: 'E05', name: 'Patient E05', room: '405B', riskScore: 52, riskType: 'Pressure Injury', trend: 'stable', riskLevel: 'MEDIUM' },
];

const demoScenes = [
  { title: 'Real-Time Patient Monitoring', duration: 60, description: 'AI continuously monitors all patients for nursing-sensitive outcomes' },
  { title: 'Risk Score Changes', duration: 60, description: 'Watch as risk scores update based on clinical data changes' },
  { title: 'Priority Queue Updates', duration: 60, description: 'Patients are automatically re-prioritized based on risk levels' },
  { title: 'AI-Driven Alerts', duration: 60, description: 'System generates alerts when risk thresholds are exceeded' },
  { title: 'Intervention Recommendations', duration: 60, description: 'Evidence-based interventions suggested for high-risk patients' },
];

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

export const DemoModal = ({ open, onClose }: DemoModalProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [patients, setPatients] = useState<DemoPatient[]>(initialPatients);
  const [currentScene, setCurrentScene] = useState(0);
  const [recentAlerts, setRecentAlerts] = useState<string[]>([]);
  const [highlightedPatient, setHighlightedPatient] = useState<string | null>(null);

  const progress = (elapsed / DEMO_DURATION) * 100;
  const remainingTime = DEMO_DURATION - elapsed;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  // Update current scene based on elapsed time
  useEffect(() => {
    let accumulatedTime = 0;
    for (let i = 0; i < demoScenes.length; i++) {
      accumulatedTime += demoScenes[i].duration;
      if (elapsed < accumulatedTime) {
        setCurrentScene(i);
        break;
      }
    }
  }, [elapsed]);

  // Simulate risk score changes
  const updatePatientRisks = useCallback(() => {
    setPatients(prev => {
      const updated = prev.map(patient => {
        const change = (Math.random() - 0.5) * 8;
        const newScore = Math.max(5, Math.min(95, Math.round(patient.riskScore + change)));
        const newLevel: 'HIGH' | 'MEDIUM' | 'LOW' = newScore >= 60 ? 'HIGH' : newScore >= 35 ? 'MEDIUM' : 'LOW';
        const newTrend: 'up' | 'down' | 'stable' = change > 2 ? 'up' : change < -2 ? 'down' : 'stable';
        
        // Generate alert for significant changes
        if (Math.abs(change) > 5) {
          const alertMsg = change > 0 
            ? `⚠️ ${patient.name} risk increased to ${newScore}%`
            : `✓ ${patient.name} risk decreased to ${newScore}%`;
          setRecentAlerts(alerts => [alertMsg, ...alerts].slice(0, 4));
          setHighlightedPatient(patient.id);
          setTimeout(() => setHighlightedPatient(null), 2000);
        }
        
        return { ...patient, riskScore: newScore, riskLevel: newLevel, trend: newTrend };
      });
      
      // Sort by risk score descending
      return updated.sort((a, b) => b.riskScore - a.riskScore);
    });
  }, []);

  // Timer and simulation
  useEffect(() => {
    if (!open || !isPlaying) return;

    const timer = setInterval(() => {
      setElapsed(prev => {
        if (prev >= DEMO_DURATION) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    const riskUpdater = setInterval(updatePatientRisks, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(riskUpdater);
    };
  }, [open, isPlaying, updatePatientRisks]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setElapsed(0);
      setIsPlaying(true);
      setPatients(initialPatients);
      setRecentAlerts([]);
      setCurrentScene(0);
    }
  }, [open]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-risk-high/20 text-risk-high border-risk-high/30';
      case 'MEDIUM': return 'bg-risk-medium/20 text-risk-medium border-risk-medium/30';
      default: return 'bg-risk-low/20 text-risk-low border-risk-low/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-risk-high" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-risk-low" />;
      default: return <Activity className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0 overflow-hidden bg-background border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">NSO Quality Dashboard Demo</h2>
              <p className="text-xs text-muted-foreground">Simulated Real-Time Monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-mono text-sm font-medium text-foreground">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
            
            {/* Play/Pause */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-2 bg-card/50 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{demoScenes[currentScene]?.title}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              Scene {currentScene + 1} of {demoScenes.length}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">{demoScenes[currentScene]?.description}</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden grid grid-cols-3 gap-0">
          {/* Patient List - Left Panel */}
          <div className="col-span-2 border-r border-border overflow-auto p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">Priority Queue</h3>
              <Badge variant="outline" className="ml-auto text-xs">
                Live Simulation
              </Badge>
            </div>
            
            <div className="space-y-2">
              {patients.map((patient, index) => (
                <div
                  key={patient.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-500",
                    highlightedPatient === patient.id 
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                      : "border-border",
                    "bg-card hover:bg-card/80"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-4">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground text-sm">{patient.name}</span>
                          <span className="text-xs text-muted-foreground">Room {patient.room}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{patient.riskType} Risk</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(patient.trend)}
                      </div>
                      <Badge className={cn("font-mono tabular-nums", getRiskColor(patient.riskLevel))}>
                        {patient.riskScore}%
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Risk Bar */}
                  <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500 rounded-full",
                        patient.riskLevel === 'HIGH' ? 'bg-risk-high' : 
                        patient.riskLevel === 'MEDIUM' ? 'bg-risk-medium' : 'bg-risk-low'
                      )}
                      style={{ width: `${patient.riskScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Stats & Alerts */}
          <div className="overflow-auto p-4 bg-secondary/20">
            {/* Quick Stats */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Unit Summary
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-risk-high/10 border border-risk-high/20">
                  <div className="text-2xl font-bold text-risk-high">
                    {patients.filter(p => p.riskLevel === 'HIGH').length}
                  </div>
                  <div className="text-xs text-risk-high/80">High Risk</div>
                </div>
                <div className="p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/20">
                  <div className="text-2xl font-bold text-risk-medium">
                    {patients.filter(p => p.riskLevel === 'MEDIUM').length}
                  </div>
                  <div className="text-xs text-risk-medium/80">Medium Risk</div>
                </div>
                <div className="p-3 rounded-lg bg-risk-low/10 border border-risk-low/20">
                  <div className="text-2xl font-bold text-risk-low">
                    {patients.filter(p => p.riskLevel === 'LOW').length}
                  </div>
                  <div className="text-xs text-risk-low/80">Low Risk</div>
                </div>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-2xl font-bold text-primary">
                    {patients.length}
                  </div>
                  <div className="text-xs text-primary/80">Total Patients</div>
                </div>
              </div>
            </div>

            {/* Live Alerts */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-risk-high" />
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Live Alerts
                </h4>
              </div>
              
              <div className="space-y-2">
                {recentAlerts.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    Monitoring for risk changes...
                  </p>
                ) : (
                  recentAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-2 rounded-lg text-xs border transition-opacity",
                        index === 0 ? "opacity-100" : "opacity-60",
                        alert.includes('increased') 
                          ? "bg-risk-high/10 border-risk-high/20 text-risk-high"
                          : "bg-risk-low/10 border-risk-low/20 text-risk-low"
                      )}
                    >
                      {alert}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Insight */}
            <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary">AI Insight</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentScene === 0 && "The AI model continuously analyzes vital signs, lab values, and nursing assessments to predict risk."}
                {currentScene === 1 && "Risk scores are recalculated in real-time as new clinical data becomes available."}
                {currentScene === 2 && "Patients are automatically re-prioritized so nurses can focus on those most at risk."}
                {currentScene === 3 && "Threshold-based alerts ensure critical changes are never missed."}
                {currentScene === 4 && "Evidence-based intervention recommendations help prevent adverse outcomes."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-secondary/30 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            <span className="text-risk-high">●</span> Synthetic data only — Research demonstration
          </p>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Demo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
