import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, Brain, LayoutDashboard, ArrowRight, Activity, FileText, Pill, Users, AlertTriangle, DollarSign, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const dataTypes = [
  { icon: Activity, label: 'Vitals', color: 'text-chart-1' },
  { icon: FileText, label: 'Labs', color: 'text-risk-low' },
  { icon: Pill, label: 'Meds', color: 'text-chart-3' },
  { icon: Users, label: 'ADT', color: 'text-warning' },
];

const pipelineStages = [
  { id: 'ehr', label: 'EHR System', sublabel: 'HL7 FHIR / HL7v2', icon: Database, bgColor: 'bg-chart-1/20', borderColor: 'border-chart-1/50', textColor: 'text-chart-1' },
  { id: 'ingest', label: 'Data Ingestion', sublabel: '< 30s Latency', icon: Zap, bgColor: 'bg-warning/20', borderColor: 'border-warning/50', textColor: 'text-warning' },
  { id: 'ml', label: 'ML Pipeline', sublabel: 'NSO Predictions', icon: Brain, bgColor: 'bg-primary/20', borderColor: 'border-primary/50', textColor: 'text-primary' },
  { id: 'dashboard', label: 'Clinical Dashboard', sublabel: 'Decision Support', icon: LayoutDashboard, bgColor: 'bg-risk-low/20', borderColor: 'border-risk-low/50', textColor: 'text-risk-low' },
];

const outcomes = [
  { label: 'Falls Risk', color: 'bg-destructive/80' },
  { label: 'HAPI Risk', color: 'bg-warning/80' },
  { label: 'CAUTI Risk', color: 'bg-risk-low/80' },
];

export const EHRDataFlowSlide = () => {
  const [activePacket, setActivePacket] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [liveCount, setLiveCount] = useState(3842);

  useEffect(() => {
    const packetInterval = setInterval(() => setActivePacket(prev => (prev + 1) % dataTypes.length), 2000);
    const stageInterval = setInterval(() => setActiveStage(prev => (prev + 1) % pipelineStages.length), 1500);
    const countInterval = setInterval(() => setLiveCount(prev => prev + Math.floor(Math.random() * 3)), 3000);
    return () => { clearInterval(packetInterval); clearInterval(stageInterval); clearInterval(countInterval); };
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-secondary/20 p-8 flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Real-Time EHR Data Flow</h1>
        <p className="text-sm text-muted-foreground">Standards-based integration for any compliant EHR system</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          {/* Pipeline */}
          <div className="flex items-center justify-between gap-2 mb-8">
            {pipelineStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center flex-1">
                <motion.div
                  className={cn("flex-1 p-4 rounded-xl border-2 transition-all duration-500", stage.bgColor, stage.borderColor)}
                  animate={{ scale: activeStage === index ? 1.05 : 1, boxShadow: activeStage === index ? '0 0 20px hsl(var(--primary) / 0.15)' : '0 0 0px transparent' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", stage.bgColor, stage.borderColor)}>
                      <stage.icon className={cn("w-5 h-5", stage.textColor)} />
                    </div>
                    <div>
                      <div className={cn("text-sm font-bold", stage.textColor)}>{stage.label}</div>
                      <div className="text-[10px] text-muted-foreground">{stage.sublabel}</div>
                    </div>
                  </div>

                  {stage.id === 'ehr' && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {dataTypes.map((type, idx) => (
                        <div key={type.label} className={cn("flex items-center gap-1 px-2 py-1 rounded text-[9px] bg-background/50 transition-all duration-300", activePacket === idx && "ring-1 ring-current scale-110")}>
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
                        <motion.div className="h-full bg-primary" animate={{ width: activeStage === 2 ? '100%' : '30%' }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  )}

                  {stage.id === 'dashboard' && (
                    <div className="flex gap-1 mt-2">
                      {outcomes.map(o => (
                        <div key={o.label} className={cn("px-2 py-0.5 rounded text-[8px] font-medium text-white", o.color)}>{o.label}</div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {index < pipelineStages.length - 1 && (
                  <div className="relative w-12 h-8 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full h-0.5 bg-border/50" /></div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground relative z-10" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Live stream bar */}
          <div className="relative h-16 bg-secondary/30 rounded-xl border border-border/50 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-4 text-xs text-muted-foreground bg-background/80 px-4 py-2 rounded-lg">
                <span>Continuous real-time data streaming</span>
                <span className="font-bold text-foreground tabular-nums">{liveCount.toLocaleString()} msgs</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Data Latency', value: '< 30s', icon: Zap },
              { label: 'Standards', value: 'FHIR R4', icon: FileText },
              { label: 'Update Freq', value: 'Real-time', icon: Activity },
              { label: 'Predictions', value: '4 NSOs', icon: Brain },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/30">
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

      <div className="text-center mt-4">
        <p className="text-[10px] text-muted-foreground">Compatible with any EHR system supporting HL7 FHIR R4 or HL7v2 standards</p>
      </div>
    </div>
  );
};
