import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, ArrowRight, CheckCircle, Shield, Zap, RefreshCw, Cloud, Lock, DollarSign, Clock, Activity, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const integrationSteps = [
  {
    id: 'ehr',
    label: 'EHR System',
    sublabel: 'HL7 FHIR R4',
    icon: Database,
    color: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
    details: ['ADT Events', 'Vitals', 'Labs', 'Meds', 'Assessments']
  },
  {
    id: 'ingest',
    label: 'Real-Time Ingestion',
    sublabel: 'Event-Driven',
    icon: Zap,
    color: 'bg-warning/20 text-warning border-warning/30',
    details: ['< 30s latency', 'HL7v2 ADT', 'FHIR Bundles', 'Streaming']
  },
  {
    id: 'ml',
    label: 'ML Pipeline',
    sublabel: 'NSO Predictions',
    icon: RefreshCw,
    color: 'bg-primary/20 text-primary border-primary/30',
    details: ['Falls', 'HAPI', 'CAUTI', 'Device Complications']
  },
  {
    id: 'output',
    label: 'Clinical Dashboard',
    sublabel: 'Decision Support',
    icon: Shield,
    color: 'bg-risk-low/20 text-risk-low border-risk-low/30',
    details: ['Risk Scores', 'SHAP', 'Interventions', 'Handoffs']
  }
];

const technicalSpecs = [
  { label: 'Data Standard', value: 'HL7 FHIR R4 / HL7v2' },
  { label: 'Integration', value: 'REST API + ADT Listener' },
  { label: 'Latency', value: '< 30 seconds (target)' },
  { label: 'Refresh Rate', value: 'Real-time / 4-hour batch' },
  { label: 'Encryption', value: 'TLS 1.3 / AES-256 (planned)' },
  { label: 'Compliance', value: 'HIPAA-ready architecture' },
];

const complianceBadges = [
  { label: 'HIPAA Ready', color: 'bg-warning/20 text-warning border-warning/30' },
];

export const EHRIntegrationDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [liveMessages, setLiveMessages] = useState(12847);
  const [uptime, setUptime] = useState(99.97);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % integrationSteps.length);
      setLiveMessages(prev => prev + Math.floor(Math.random() * 5));
      setUptime(prev => parseFloat((prev + (Math.random() - 0.49) * 0.005).toFixed(2)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-foreground">EHR Integration Architecture</h2>
          <p className="text-sm text-muted-foreground">Enterprise-ready data pipeline for clinical environments</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-risk-low/10 border border-risk-low/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
            </span>
            <span className="text-[10px] font-semibold text-risk-low">LIVE</span>
          </div>
          {complianceBadges.map(badge => (
            <Badge key={badge.label} variant="outline" className={badge.color}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {badge.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Live KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Messages Processed', value: liveMessages.toLocaleString(), icon: <Activity className="h-4 w-4" />, color: 'text-chart-1' },
          { label: 'Pipeline Uptime', value: `${uptime}%`, icon: <Server className="h-4 w-4" />, color: 'text-risk-low' },
          { label: 'Avg Latency', value: '< 30s', icon: <Clock className="h-4 w-4" />, color: 'text-warning' },
          { label: 'Integration ROI', value: '$1.2M', icon: <DollarSign className="h-4 w-4" />, color: 'text-primary' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.08 }}>
            <Card className="border-border/40 bg-gradient-to-b from-background to-muted/20 hover:shadow-md transition-shadow">
              <CardContent className="p-3 text-center">
                <div className={cn('mx-auto mb-1', k.color)}>{k.icon}</div>
                <p className={cn('text-xl font-bold tabular-nums', k.color)}>{k.value}</p>
                <p className="text-[9px] font-semibold text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Integration Flow Diagram */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="w-4 h-4 text-primary" />
            Data Flow Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 py-4">
            {integrationSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col md:flex-row items-center gap-3 flex-1">
                <motion.div
                  className={cn(
                    "w-full md:w-auto flex-1 p-4 rounded-lg border-2 transition-all",
                    step.color,
                    activeStep === index && "scale-105 shadow-lg"
                  )}
                  animate={{ scale: activeStep === index ? 1.05 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", step.color)}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{step.label}</div>
                      <div className="text-[10px] opacity-80">{step.sublabel}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                        <CheckCircle className="w-3 h-3 text-current opacity-60" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {index < integrationSteps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-8">
                    <ArrowRight className={cn(
                      "w-5 h-5 transition-colors",
                      activeStep === index ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Enterprise Security</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              All patient data remains within the healthcare organization's network perimeter.
              The NSO system operates as an on-premise deployment with optional cloud analytics.
              No PHI is transmitted externally without explicit authorization.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {technicalSpecs.map((spec, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                  <span className="text-xs text-muted-foreground">{spec.label}</span>
                  <span className="text-xs font-medium text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">EHR Compatibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                <div className="text-sm font-bold text-foreground mb-1">Standards-Based Architecture</div>
                <div className="text-[11px] text-muted-foreground">
                  Built on HL7 FHIR R4 and HL7v2 standards for broad EHR compatibility
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'HL7 FHIR R4', desc: 'REST API' },
                  { label: 'HL7v2 ADT', desc: 'Event Messages' },
                  { label: 'CDA/C-CDA', desc: 'Documents' },
                  { label: 'Custom APIs', desc: 'Adaptable' },
                ].map((standard, index) => (
                  <div key={index} className="p-2 rounded-lg bg-secondary/50 border border-border/50 text-center">
                    <div className="text-xs font-medium text-foreground">{standard.label}</div>
                    <div className="text-[10px] text-muted-foreground">{standard.desc}</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                Compatible with any EHR system supporting standard healthcare data exchange protocols
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise ROI Footer */}
      <Card className="bg-gradient-to-r from-primary/10 via-chart-1/5 to-transparent border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/15">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">Enterprise Integration Value</p>
              <p className="text-[10px] text-muted-foreground">
                Standards-based FHIR R4 integration eliminates custom interfaces. A single integration
                unlocks all 11 patent capabilities — from predictive risk scoring to staffing optimization
                — reducing implementation time from months to weeks*.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-primary">$1.2M</p>
              <p className="text-[9px] text-muted-foreground">integration savings*</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/60 mt-2">*Design-phase estimates. For illustration only.</p>
        </CardContent>
      </Card>
    </div>
  );
};
