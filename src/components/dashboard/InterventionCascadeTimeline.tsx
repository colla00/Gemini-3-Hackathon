// Intervention Cascade Timeline - Animated Real-Time Risk Updates
// Shows intervention effects cascading through time with live simulation
// Copyright © Dr. Alexis Collier - Patent Pending

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, RotateCcw, Clock, Activity, 
  TrendingDown, Zap, Award, ChevronRight, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CascadeEvent {
  id: string;
  time: number; // hours from start
  type: 'intervention' | 'response' | 'milestone' | 'alert';
  title: string;
  description: string;
  riskImpact: number; // negative = reduction
  patientId: string;
  affectedPatients?: number;
}

interface PatientState {
  id: string;
  name: string;
  initialRisk: number;
  currentRisk: number;
  interventions: string[];
  trajectory: 'improving' | 'stable' | 'declining';
}

// Mock cascade events for demo
const cascadeEvents: CascadeEvent[] = [
  { id: 'e1', time: 0, type: 'alert', title: 'Risk Alert Triggered', description: 'Patient 849201 elevated risk detected', riskImpact: 0, patientId: '849201' },
  { id: 'e2', time: 1, type: 'intervention', title: 'Mobility Protocol Initiated', description: 'Early mobilization started', riskImpact: -5, patientId: '849201' },
  { id: 'e3', time: 2, type: 'response', title: 'Initial Response', description: 'Risk trajectory stabilizing', riskImpact: -3, patientId: '849201' },
  { id: 'e4', time: 3, type: 'alert', title: 'Secondary Alert', description: 'Patient 847203 catheter risk', riskImpact: 0, patientId: '847203' },
  { id: 'e5', time: 4, type: 'intervention', title: 'Catheter Assessment', description: 'Removal protocol initiated', riskImpact: -8, patientId: '847203' },
  { id: 'e6', time: 6, type: 'milestone', title: 'Risk Threshold Crossed', description: '849201 below moderate threshold', riskImpact: -10, patientId: '849201', affectedPatients: 1 },
  { id: 'e7', time: 8, type: 'response', title: 'Cascade Effect', description: 'Protocols applied to similar patients', riskImpact: -6, patientId: 'cohort', affectedPatients: 3 },
  { id: 'e8', time: 10, type: 'intervention', title: 'Sedation Vacation', description: 'Patient 850104 awakening trial', riskImpact: -4, patientId: '850104' },
  { id: 'e9', time: 12, type: 'milestone', title: 'Cohort Improvement', description: '25% average risk reduction achieved', riskImpact: -8, patientId: 'cohort', affectedPatients: 4 },
  { id: 'e10', time: 16, type: 'response', title: 'Sustained Response', description: 'All high-risk patients improving', riskImpact: -5, patientId: 'cohort', affectedPatients: 4 },
  { id: 'e11', time: 20, type: 'milestone', title: 'Target Achieved', description: 'Unit-wide risk reduction target met', riskImpact: -3, patientId: 'cohort', affectedPatients: 8 },
  { id: 'e12', time: 24, type: 'milestone', title: '24h Summary', description: '38% overall risk reduction', riskImpact: 0, patientId: 'cohort', affectedPatients: 8 },
];

const initialPatients: PatientState[] = [
  { id: '849201', name: 'Patient A', initialRisk: 72, currentRisk: 72, interventions: [], trajectory: 'stable' },
  { id: '847203', name: 'Patient B', initialRisk: 65, currentRisk: 65, interventions: [], trajectory: 'stable' },
  { id: '850104', name: 'Patient C', initialRisk: 58, currentRisk: 58, interventions: [], trajectory: 'stable' },
  { id: '851205', name: 'Patient D', initialRisk: 45, currentRisk: 45, interventions: [], trajectory: 'stable' },
];

const eventTypeConfig = {
  alert: { icon: Zap, color: 'text-risk-high', bg: 'bg-risk-high/20', border: 'border-risk-high/40' },
  intervention: { icon: Activity, color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/40' },
  response: { icon: TrendingDown, color: 'text-risk-low', bg: 'bg-risk-low/20', border: 'border-risk-low/40' },
  milestone: { icon: Award, color: 'text-accent', bg: 'bg-accent/20', border: 'border-accent/40' },
};

interface InterventionCascadeTimelineProps {
  className?: string;
  autoPlay?: boolean;
  speed?: number; // ms per simulation hour
}

export function InterventionCascadeTimeline({ 
  className, 
  autoPlay = false,
  speed = 500 
}: InterventionCascadeTimelineProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [patients, setPatients] = useState<PatientState[]>(initialPatients);
  const [visibleEvents, setVisibleEvents] = useState<CascadeEvent[]>([]);
  const [totalRiskReduction, setTotalRiskReduction] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const maxTime = 24;

  // Update visible events and patient states based on current time
  useEffect(() => {
    const events = cascadeEvents.filter(e => e.time <= currentTime);
    setVisibleEvents(events);
    
    // Calculate patient states
    const updatedPatients = initialPatients.map(p => {
      const patientEvents = events.filter(e => 
        e.patientId === p.id || e.patientId === 'cohort'
      );
      const totalImpact = patientEvents.reduce((sum, e) => sum + e.riskImpact, 0);
      const newRisk = Math.max(0, Math.min(100, p.initialRisk + totalImpact));
      
      return {
        ...p,
        currentRisk: newRisk,
        interventions: patientEvents
          .filter(e => e.type === 'intervention' && e.patientId === p.id)
          .map(e => e.title),
        trajectory: newRisk < p.initialRisk - 10 ? 'improving' as const : 
                   newRisk > p.initialRisk + 5 ? 'declining' as const : 'stable' as const
      };
    });
    setPatients(updatedPatients);
    
    // Calculate total risk reduction
    const initialTotal = initialPatients.reduce((sum, p) => sum + p.initialRisk, 0);
    const currentTotal = updatedPatients.reduce((sum, p) => sum + p.currentRisk, 0);
    setTotalRiskReduction(Math.round(((initialTotal - currentTotal) / initialTotal) * 100));
  }, [currentTime]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= maxTime) {
          setIsPlaying(false);
          return maxTime;
        }
        return prev + 0.5;
      });
    }, speed);
    
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Scroll to latest event
  useEffect(() => {
    if (timelineRef.current && visibleEvents.length > 0) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [visibleEvents.length]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setPatients(initialPatients);
    setVisibleEvents([]);
    setTotalRiskReduction(0);
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (currentTime >= maxTime) {
      handleReset();
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [currentTime, handleReset]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Intervention Cascade Timeline
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time risk updates during intervention sequence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <Award className="h-3 w-3 text-accent" />
            Demo Mode
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTogglePlay}
                className="w-24"
              >
                {isPlaying ? (
                  <><Pause className="h-4 w-4 mr-1" /> Pause</>
                ) : (
                  <><Play className="h-4 w-4 mr-1" /> {currentTime >= maxTime ? 'Replay' : 'Play'}</>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Timeline Progress</span>
                <span className="font-mono">{currentTime.toFixed(1)}h / {maxTime}h</span>
              </div>
              <Progress value={(currentTime / maxTime) * 100} className="h-2" />
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-risk-low">-{totalRiskReduction}%</div>
                <div className="text-[10px] text-muted-foreground">Risk Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{visibleEvents.filter(e => e.type === 'intervention').length}</div>
                <div className="text-[10px] text-muted-foreground">Interventions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Patient Cards */}
        <div className="lg:col-span-1 space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Patient Status
          </h4>
          {patients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn(
                "transition-all",
                patient.trajectory === 'improving' && "border-risk-low/40",
                patient.trajectory === 'declining' && "border-risk-high/40"
              )}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{patient.id}</span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px]",
                        patient.trajectory === 'improving' && "text-risk-low border-risk-low/50",
                        patient.trajectory === 'declining' && "text-risk-high border-risk-high/50"
                      )}
                    >
                      {patient.trajectory}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-xs text-muted-foreground">Risk:</div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          patient.currentRisk >= 70 ? "bg-risk-high" :
                          patient.currentRisk >= 40 ? "bg-risk-medium" : "bg-risk-low"
                        )}
                        initial={{ width: `${patient.initialRisk}%` }}
                        animate={{ width: `${patient.currentRisk}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <motion.span 
                      className="text-sm font-bold w-12 text-right"
                      key={patient.currentRisk}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {Math.round(patient.currentRisk)}%
                    </motion.span>
                  </div>
                  
                  {patient.interventions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {patient.interventions.map((int, i) => (
                        <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0">
                          {int.split(' ')[0]}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Event Timeline */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Event Stream
          </h4>
          <Card>
            <CardContent className="p-4">
              <div 
                ref={timelineRef}
                className="h-[400px] overflow-y-auto space-y-3 pr-2"
              >
                <AnimatePresence>
                  {visibleEvents.map((event, index) => {
                    const config = eventTypeConfig[event.type];
                    const Icon = config.icon;
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={cn(
                          "flex gap-3 p-3 rounded-lg border",
                          config.bg,
                          config.border
                        )}
                      >
                        <div className={cn(
                          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                          config.bg
                        )}>
                          <Icon className={cn("h-4 w-4", config.color)} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">
                              {event.title}
                            </span>
                            <Badge variant="outline" className="text-[9px] px-1.5">
                              {event.time}h
                            </Badge>
                            {event.riskImpact < 0 && (
                              <Badge className="text-[9px] px-1.5 bg-risk-low/20 text-risk-low border-risk-low/30">
                                {event.riskImpact}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {event.description}
                          </p>
                          {event.affectedPatients && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{event.affectedPatients} patients affected</span>
                            </div>
                          )}
                        </div>

                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {visibleEvents.length === 0 && (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Press Play to start the intervention cascade simulation
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary Stats */}
      {currentTime >= maxTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-foreground">24h</div>
                  <div className="text-xs text-muted-foreground">Time Elapsed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {visibleEvents.filter(e => e.type === 'intervention').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Interventions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-risk-low">-{totalRiskReduction}%</div>
                  <div className="text-xs text-muted-foreground">Risk Reduction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {patients.filter(p => p.trajectory === 'improving').length}/{patients.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Improving</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Patent Notice */}
      <div className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-xs">
        <div className="flex items-start gap-2">
          <Award className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-accent">Novel Innovation:</span>
            <span className="text-muted-foreground ml-1">
              Real-time intervention cascade visualization with patient-level risk tracking 
              enables demonstration of AI-driven clinical workflow optimization.
            </span>
            <p className="text-accent mt-1">Patent Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
