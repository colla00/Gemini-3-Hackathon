import { Database, ArrowRight, CheckCircle, Shield, Zap, RefreshCw, Cloud, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const integrationSteps = [
  {
    id: 'ehr',
    label: 'Epic/Cerner EHR',
    sublabel: 'HL7 FHIR R4',
    icon: Database,
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    details: ['ADT Events', 'Vitals', 'Labs', 'Meds', 'Assessments']
  },
  {
    id: 'ingest',
    label: 'Real-Time Ingestion',
    sublabel: 'Event-Driven',
    icon: Zap,
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
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

// Note: These are design targets, not current certifications
const complianceBadges = [
  { label: 'HIPAA Ready', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
];

export const EHRIntegrationDiagram = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">EHR Integration Architecture</h2>
          <p className="text-sm text-muted-foreground">Enterprise-ready data pipeline for clinical environments</p>
        </div>
        <div className="flex items-center gap-2">
          {complianceBadges.map(badge => (
            <Badge key={badge.label} variant="outline" className={badge.color}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {badge.label}
            </Badge>
          ))}
        </div>
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
                {/* Step Card */}
                <div className={cn(
                  "w-full md:w-auto flex-1 p-4 rounded-lg border-2 transition-all hover:scale-105",
                  step.color
                )}>
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
                </div>
                
                {/* Arrow */}
                {index < integrationSteps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-8">
                    <ArrowRight className="w-5 h-5 text-muted-foreground animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Technical Callout */}
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
            <CardTitle className="text-sm">Supported EHR Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Epic', status: 'Designed For', certified: false },
                { name: 'Cerner', status: 'Designed For', certified: false },
                { name: 'MEDITECH', status: 'Planned', certified: false },
                { name: 'Allscripts', status: 'Planned', certified: false },
              ].map((ehr, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-3 rounded-lg border text-center",
                    ehr.certified 
                      ? "bg-risk-low/10 border-risk-low/30" 
                      : "bg-secondary/50 border-border/50"
                  )}
                >
                  <div className="text-sm font-bold text-foreground">{ehr.name}</div>
                  <div className={cn(
                    "text-[10px]",
                    ehr.certified ? "text-risk-low" : "text-muted-foreground"
                  )}>
                    {ehr.certified && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {ehr.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
