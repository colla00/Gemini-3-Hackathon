import { useState, useEffect } from 'react';
import { 
  Database, Zap, Brain, Bell, CheckCircle, 
  Clock, ArrowRight, Activity, User, Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface TimelineStage {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  timestamp: string;
  duration: string;
  color: string;
  details: string[];
}

const timelineStages: TimelineStage[] = [
  {
    id: 'ehr-event',
    label: 'EHR Event',
    description: 'Vitals documented in EHR',
    icon: Database,
    timestamp: '14:32:00',
    duration: '0s',
    color: 'bg-blue-500',
    details: ['BP: 142/88 mmHg', 'HR: 92 bpm', 'Mobility: Impaired'],
  },
  {
    id: 'data-ingestion',
    label: 'Data Ingestion',
    description: 'FHIR bundle received',
    icon: Zap,
    timestamp: '14:32:08',
    duration: '+8s',
    color: 'bg-amber-500',
    details: ['HL7 FHIR R4', 'Observation resources', 'Patient context'],
  },
  {
    id: 'ml-processing',
    label: 'ML Processing',
    description: 'Risk score calculated',
    icon: Brain,
    timestamp: '14:32:15',
    duration: '+15s',
    color: 'bg-purple-500',
    details: ['47 features extracted', 'Falls risk: 78%', 'SHAP computed'],
  },
  {
    id: 'alert-generated',
    label: 'Alert Generated',
    description: 'High-risk threshold met',
    icon: Bell,
    timestamp: '14:32:18',
    duration: '+18s',
    color: 'bg-red-500',
    details: ['Priority: High', 'Category: Falls', 'Confidence: 92%'],
  },
  {
    id: 'dashboard-update',
    label: 'Dashboard Update',
    description: 'UI refreshed with new data',
    icon: Activity,
    timestamp: '14:32:20',
    duration: '+20s',
    color: 'bg-emerald-500',
    details: ['Patient card updated', 'Priority queue reordered', 'Trend line added'],
  },
  {
    id: 'nurse-notified',
    label: 'Nurse Notified',
    description: 'Clinical action initiated',
    icon: Stethoscope,
    timestamp: '14:32:22',
    duration: '+22s',
    color: 'bg-primary',
    details: ['Badge notification', 'Suggested interventions', 'One-click acknowledge'],
  },
];

export const AlertTimelineSlide = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => {
        const next = (prev + 1) % timelineStages.length;
        if (next === 0) {
          setShowDetails(false);
          setTimeout(() => setShowDetails(true), 500);
        }
        return next;
      });
    }, 2000);

    // Show details after first cycle
    const detailsTimer = setTimeout(() => setShowDetails(true), 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(detailsTimer);
    };
  }, [isAnimating]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-primary/5 p-6 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          From EHR Event to Clinical Alert
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time data flow with sub-30-second end-to-end latency
        </p>
      </div>

      {/* Main Timeline */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Horizontal Timeline */}
        <div className="relative mb-8">
          {/* Progress Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-border/50 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-primary rounded-full transition-all duration-500"
              style={{ width: `${((activeStage + 1) / timelineStages.length) * 100}%` }}
            />
          </div>

          {/* Stage Nodes */}
          <div className="relative flex justify-between">
            {timelineStages.map((stage, index) => {
              const isActive = index === activeStage;
              const isPast = index < activeStage;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.id}
                  className="flex flex-col items-center"
                  onClick={() => {
                    setActiveStage(index);
                    setIsAnimating(false);
                  }}
                >
                  {/* Node */}
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer border-4",
                      isActive
                        ? `${stage.color} text-white border-white shadow-lg scale-110`
                        : isPast
                        ? `${stage.color} text-white border-transparent opacity-80`
                        : "bg-secondary text-muted-foreground border-border"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", isActive && "animate-pulse")} />
                  </div>

                  {/* Label */}
                  <div className={cn(
                    "mt-3 text-center transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-70"
                  )}>
                    <div className={cn(
                      "text-xs font-bold",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {stage.label}
                    </div>
                    <div className={cn(
                      "text-[10px] font-mono",
                      isActive ? stage.color.replace('bg-', 'text-') : "text-muted-foreground"
                    )}>
                      {stage.duration}
                    </div>
                  </div>

                  {/* Timestamp Badge */}
                  {(isActive || isPast) && (
                    <div className={cn(
                      "mt-2 px-2 py-0.5 rounded text-[9px] font-mono transition-all duration-300",
                      isActive 
                        ? "bg-foreground text-background" 
                        : "bg-secondary text-muted-foreground"
                    )}>
                      {stage.timestamp}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Stage Details */}
        <Card className={cn(
          "transition-all duration-500 border-2",
          timelineStages[activeStage].color.replace('bg-', 'border-')
        )}>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Stage Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    timelineStages[activeStage].color,
                    "text-white"
                  )}>
                    {(() => {
                      const Icon = timelineStages[activeStage].icon;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {timelineStages[activeStage].label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {timelineStages[activeStage].description}
                    </p>
                  </div>
                </div>

                {/* Details List */}
                <div className="grid grid-cols-3 gap-3">
                  {timelineStages[activeStage].details.map((detail, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg bg-secondary/50 transition-all duration-300",
                        showDetails ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      )}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <CheckCircle className={cn(
                        "w-3 h-3",
                        timelineStages[activeStage].color.replace('bg-', 'text-')
                      )} />
                      <span className="text-xs text-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timing Stats */}
              <div className="w-48 space-y-3">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">Timestamp</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-primary">
                    {timelineStages[activeStage].timestamp}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-medium text-foreground">Elapsed</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-amber-500">
                    {timelineStages[activeStage].duration}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Total Latency', value: '< 30s', color: 'text-primary' },
            { label: 'Data Points', value: '47', color: 'text-blue-400' },
            { label: 'Alert Threshold', value: '≥70%', color: 'text-red-400' },
            { label: 'Nurse Response', value: '~3 min', color: 'text-emerald-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
            >
              <div>
                <div className={cn("text-xl font-bold font-mono", stat.color)}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-muted-foreground text-center">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-medium transition-colors",
            isAnimating
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground hover:bg-secondary/80"
          )}
        >
          {isAnimating ? "⏸ Pause Animation" : "▶ Play Animation"}
        </button>
        <button
          onClick={() => {
            setActiveStage(0);
            setShowDetails(false);
            setIsAnimating(true);
          }}
          className="px-4 py-2 rounded-lg text-xs font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
        >
          ↻ Restart
        </button>
      </div>
    </div>
  );
};
