import { useState, useEffect } from 'react';
import { Database, Zap, Brain, LayoutDashboard, ArrowRight, Activity, FileText, Pill, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const dataTypes = [
  { icon: Activity, label: 'Vitals', color: 'text-blue-400' },
  { icon: FileText, label: 'Labs', color: 'text-green-400' },
  { icon: Pill, label: 'Meds', color: 'text-purple-400' },
  { icon: Users, label: 'ADT', color: 'text-amber-400' },
];

const pipelineStages = [
  {
    id: 'ehr',
    label: 'EHR System',
    sublabel: 'HL7 FHIR / HL7v2',
    icon: Database,
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-400',
  },
  {
    id: 'ingest',
    label: 'Data Ingestion',
    sublabel: '< 30s Latency',
    icon: Zap,
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/50',
    textColor: 'text-amber-400',
  },
  {
    id: 'ml',
    label: 'ML Pipeline',
    sublabel: 'NSO Predictions',
    icon: Brain,
    bgColor: 'bg-primary/20',
    borderColor: 'border-primary/50',
    textColor: 'text-primary',
  },
  {
    id: 'dashboard',
    label: 'Clinical Dashboard',
    sublabel: 'Decision Support',
    icon: LayoutDashboard,
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/50',
    textColor: 'text-emerald-400',
  },
];

const outcomes = [
  { label: 'Falls Risk', color: 'bg-risk-high/80' },
  { label: 'HAPI Risk', color: 'bg-risk-medium/80' },
  { label: 'CAUTI Risk', color: 'bg-risk-low/80' },
];

export const EHRDataFlowSlide = () => {
  const [activePacket, setActivePacket] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const packetInterval = setInterval(() => {
      setActivePacket((prev) => (prev + 1) % dataTypes.length);
    }, 2000);

    const stageInterval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % pipelineStages.length);
    }, 1500);

    return () => {
      clearInterval(packetInterval);
      clearInterval(stageInterval);
    };
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-secondary/20 p-8 flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Real-Time EHR Data Flow
        </h1>
        <p className="text-sm text-muted-foreground">
          Standards-based integration for any compliant EHR system
        </p>
      </div>

      {/* Main Flow Diagram */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          {/* Pipeline Stages */}
          <div className="flex items-center justify-between gap-2 mb-8">
            {pipelineStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center flex-1">
                {/* Stage Node */}
                <div
                  className={cn(
                    "flex-1 p-4 rounded-xl border-2 transition-all duration-500",
                    stage.bgColor,
                    stage.borderColor,
                    activeStage === index && "scale-105 shadow-lg shadow-current/20"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      stage.bgColor,
                      "border",
                      stage.borderColor
                    )}>
                      <stage.icon className={cn("w-5 h-5", stage.textColor)} />
                    </div>
                    <div>
                      <div className={cn("text-sm font-bold", stage.textColor)}>
                        {stage.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {stage.sublabel}
                      </div>
                    </div>
                  </div>

                  {/* Stage-specific content */}
                  {stage.id === 'ehr' && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {dataTypes.map((type, idx) => (
                        <div
                          key={type.label}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded text-[9px] bg-background/50 transition-all duration-300",
                            activePacket === idx && "ring-1 ring-current scale-110"
                          )}
                        >
                          <type.icon className={cn("w-3 h-3", type.color)} />
                          <span className={type.color}>{type.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {stage.id === 'ml' && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Risk Scoring</span>
                      </div>
                      <div className="h-1 bg-background/50 rounded overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: `${(activeStage === 2 ? 100 : 30)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {stage.id === 'dashboard' && (
                    <div className="flex gap-1 mt-2">
                      {outcomes.map((outcome) => (
                        <div
                          key={outcome.label}
                          className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-medium text-white",
                            outcome.color
                          )}
                        >
                          {outcome.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Connector Arrow */}
                {index < pipelineStages.length - 1 && (
                  <div className="relative w-12 h-8 flex items-center justify-center">
                    {/* Animated data packets */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-border/50" />
                    </div>
                    <div
                      className={cn(
                        "absolute w-2 h-2 rounded-full transition-all duration-500",
                        dataTypes[activePacket].color.replace('text-', 'bg-'),
                        "shadow-lg animate-pulse"
                      )}
                      style={{
                        left: `${((activeStage - index) % pipelineStages.length === 0 ? 50 : 
                               (activeStage - index) % pipelineStages.length === 1 ? 80 : 20)}%`,
                        transform: 'translateX(-50%)',
                      }}
                    />
                    <ArrowRight className="w-4 h-4 text-muted-foreground relative z-10" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Data Flow Animation Track */}
          <div className="relative h-16 bg-secondary/30 rounded-xl border border-border/50 overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {/* Animated flowing dots */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-3 h-3 rounded-full opacity-60",
                    dataTypes[i % dataTypes.length].color.replace('text-', 'bg-')
                  )}
                  style={{
                    left: `${(i * 15 + (Date.now() / 50) % 100) % 120 - 10}%`,
                    animation: `flowRight 4s linear infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-4 text-xs text-muted-foreground bg-background/80 px-4 py-2 rounded-lg">
                <span>Continuous real-time data streaming</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Data Latency', value: '< 30s', icon: Zap },
              { label: 'Standards', value: 'FHIR R4', icon: FileText },
              { label: 'Update Freq', value: 'Real-time', icon: Activity },
              { label: 'Predictions', value: '4 NSOs', icon: Brain },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/30"
              >
                <stat.icon className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-xs font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-4">
        <p className="text-[10px] text-muted-foreground">
          Compatible with any EHR system supporting HL7 FHIR R4 or HL7v2 standards
        </p>
      </div>

      <style>{`
        @keyframes flowRight {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateX(1000%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
