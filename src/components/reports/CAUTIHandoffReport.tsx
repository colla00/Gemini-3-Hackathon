import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  FileText, Download, Printer, Clock, AlertTriangle, 
  CheckCircle, TrendingUp, TrendingDown, Minus, User,
  X, Droplets, Calendar, Activity, ClipboardCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { patients as allPatients, type Patient } from '@/data/patients';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface CAUTIHandoffReportProps {
  onClose?: () => void;
}

// Helper to get CAUTI-related data from nursing outcomes
const getCatheterDays = (patient: Patient): number => {
  const catheterMetric = patient.nursingOutcomes?.find(m => 
    m.metric.toLowerCase().includes('catheter') && m.metric.toLowerCase().includes('day')
  );
  return catheterMetric?.current || 0;
};

const getCAUTIRisk = (patient: Patient): number => {
  // Check if there's a CAUTI-related metric in nursing outcomes
  const cautiMetric = patient.nursingOutcomes?.find(m => 
    m.metric.toLowerCase().includes('cauti') || m.metric.toLowerCase().includes('uti')
  );
  // Fall back to riskScore if patient is CAUTI type
  if (patient.riskType === 'CAUTI') return patient.riskScore;
  return cautiMetric?.current || 0;
};

// Filter for CAUTI high-risk patients
const cautiPatients = allPatients.filter(p => 
  p.riskType === 'CAUTI' || getCatheterDays(p) > 0
);

const highRiskCAUTI = cautiPatients.filter(p => 
  p.riskLevel === 'HIGH' || getCAUTIRisk(p) >= 60 || getCatheterDays(p) >= 5
);

export const CAUTIHandoffReport = ({ onClose }: CAUTIHandoffReportProps) => {
  const [shiftType, setShiftType] = useState('Night → Day');
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleSaveReport = async () => {
    setIsGenerating(true);
    
    const reportData = {
      generated_at: new Date().toISOString(),
      shift_type: shiftType,
      report_type: 'CAUTI',
      high_risk_cauti: highRiskCAUTI.map(p => ({
        id: p.id,
        riskScore: getCAUTIRisk(p) || p.riskScore,
        catheterDays: getCatheterDays(p),
        interventions: (p.interventions?.filter(i => 
          i.type.toLowerCase().includes('catheter') || 
          i.type.toLowerCase().includes('cauti') ||
          i.description.toLowerCase().includes('urin')
        ) || []).map(i => ({
          date: i.date,
          type: i.type,
          description: i.description,
          outcome: i.outcome || null,
        })),
      })),
      unit_summary: {
        total_cauti_monitored: cautiPatients.length,
        high_risk_count: highRiskCAUTI.length,
        catheters_due_review: highRiskCAUTI.filter(p => getCatheterDays(p) >= 5).length,
      },
    };

    const { error } = await supabase.from('handoff_reports').insert([{
      shift_type: shiftType,
      high_risk_count: highRiskCAUTI.length,
      medium_risk_count: cautiPatients.length - highRiskCAUTI.length,
      report_data: JSON.parse(JSON.stringify(reportData)) as Json,
    }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save CAUTI report.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "CAUTI Report saved",
        description: "Handoff report has been saved successfully.",
      });
    }
    setIsGenerating(false);
  };

  const TrendIcon = ({ trend }: { trend?: string }) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3.5 h-3.5 text-risk-high" />;
      case 'down': return <TrendingDown className="w-3.5 h-3.5 text-risk-low" />;
      default: return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const getTrendLabel = (trend?: string) => {
    switch (trend) {
      case 'up': return 'Rising';
      case 'down': return 'Declining';
      default: return 'Stable';
    }
  };

  const getRiskSignal = (riskScore: number) => {
    if (riskScore >= 65) return 'Elevated';
    if (riskScore >= 35) return 'Moderate';
    return 'Low';
  };

  const getQualitativeCount = (count: number) => {
    if (count === 0) return 'None';
    if (count === 1) return 'One';
    if (count <= 3) return 'Few';
    if (count <= 6) return 'Several';
    return 'Multiple';
  };

  const getCatheterDayStatus = (days: number) => {
    if (days >= 7) return { color: 'text-risk-high', bg: 'bg-risk-high/10', label: 'Extended - Removal Review' };
    if (days >= 5) return { color: 'text-risk-medium', bg: 'bg-risk-medium/10', label: 'Due for Necessity Review' };
    return { color: 'text-muted-foreground', bg: 'bg-secondary', label: 'Monitoring' };
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col print:border-none print:shadow-none print:max-h-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-blue-500/10 to-cyan-500/10 print:bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="font-bold text-foreground flex items-center gap-2">
                CAUTI Prevention Handoff
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-600">
                  Catheter-Associated UTI
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">Unit 4C - Med/Surg</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <select
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value)}
              className="px-3 py-1.5 text-xs bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Night → Day</option>
              <option>Day → Evening</option>
              <option>Evening → Night</option>
            </select>
            <Button variant="outline" size="sm" onClick={handleSaveReport} disabled={isGenerating}>
              <Download className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            {onClose && (
              <button onClick={onClose} className="p-2 rounded hover:bg-background transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="flex-1 overflow-auto p-6 print:p-4">
          {/* Report Header */}
          <div className="mb-6 pb-4 border-b border-border print:mb-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold text-foreground">CAUTI Prevention Summary</h1>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{shiftType}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Generated: {new Date().toLocaleTimeString()}
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" />
                {cautiPatients.length} catheterized patients
              </span>
            </div>
          </div>

          {/* CAUTI Stats - Qualitative */}
          <div className="grid grid-cols-4 gap-4 mb-6 print:mb-4">
            <div className="p-4 rounded-lg bg-risk-high/10 border border-risk-high/30">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-risk-high" />
                <span className="text-lg font-bold text-risk-high">{getQualitativeCount(highRiskCAUTI.length)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Elevated CAUTI Risk</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-lg font-bold text-blue-600">{getQualitativeCount(cautiPatients.length)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Active Catheters</p>
            </div>
            <div className="p-4 rounded-lg bg-risk-medium/10 border border-risk-medium/30">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-risk-medium" />
                <span className="text-lg font-bold text-risk-medium">
                  {getQualitativeCount(highRiskCAUTI.filter(p => getCatheterDays(p) >= 5).length)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Extended Duration</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardCheck className="w-4 h-4 text-foreground" />
                <span className="text-lg font-bold text-foreground">
                  {getQualitativeCount(highRiskCAUTI.filter(p => 
                    p.interventions?.some(i => i.outcome?.toLowerCase().includes('complet'))
                  ).length)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Interventions Complete</p>
            </div>
          </div>

          {/* High Risk CAUTI Patients */}
          <section className="mb-6 print:mb-4">
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
              <span className="w-2 h-2 rounded-full bg-risk-high" />
              High Risk CAUTI Patients - Catheter Removal Evaluation Required
            </h3>
            <div className="space-y-4">
              {highRiskCAUTI.length === 0 ? (
                <div className="p-4 rounded-lg bg-secondary border border-border text-center">
                  <CheckCircle className="w-8 h-8 text-risk-low mx-auto mb-2" />
                  <p className="text-sm text-foreground">No high-risk CAUTI patients at this time</p>
                </div>
              ) : (
                highRiskCAUTI.map((patient) => {
                  const catheterDays = getCatheterDays(patient);
                  const cautiRisk = getCAUTIRisk(patient) || patient.riskScore;
                  const dayStatus = getCatheterDayStatus(catheterDays);
                  
                  // Get mobility from nursing outcomes
                  const mobilityMetric = patient.nursingOutcomes?.find(m => 
                    m.metric.toLowerCase().includes('mobility') || m.metric.toLowerCase().includes('braden')
                  );
                  const mobilityDisplay = mobilityMetric ? `${mobilityMetric.current}/${mobilityMetric.target}` : 'Limited';
                  
                  return (
                    <div 
                      key={patient.id}
                      className="p-4 rounded-lg bg-card border border-risk-high/30 print:break-inside-avoid"
                    >
                      {/* Patient Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{patient.id}</span>
                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-500/20 text-blue-600 font-medium">
                              CAUTI Risk
                            </span>
                            <div className="flex items-center gap-1">
                              <TrendIcon trend={patient.trend} />
                              <span className="text-[10px] text-muted-foreground">{getTrendLabel(patient.trend)}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {patient.room} • {patient.ageRange} • {patient.admissionDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-risk-high">{getRiskSignal(cautiRisk)}</div>
                          <p className="text-[10px] text-muted-foreground">Risk Signal</p>
                        </div>
                      </div>

                      {/* Catheter Information */}
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className={cn("p-2 rounded-lg", dayStatus.bg)}>
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className={cn("w-3.5 h-3.5", dayStatus.color)} />
                            <span className={cn("text-sm font-bold", dayStatus.color)}>
                              Day {catheterDays}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{dayStatus.label}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-secondary">
                          <div className="flex items-center gap-1 mb-1">
                            <Activity className="w-3.5 h-3.5 text-foreground" />
                            <span className="text-sm font-medium text-foreground">
                              {mobilityDisplay}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">Mobility</p>
                        </div>
                        <div className="p-2 rounded-lg bg-secondary">
                          <div className="flex items-center gap-1 mb-1">
                            <User className="w-3.5 h-3.5 text-foreground" />
                            <span className="text-sm font-medium text-foreground">
                              Foley
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">Catheter Type</p>
                        </div>
                      </div>

                      {/* Risk Summary */}
                      <p className="text-sm text-foreground mb-3 bg-risk-high/5 p-2 rounded border-l-2 border-risk-high">
                        {patient.riskType === 'CAUTI' 
                          ? patient.riskSummary 
                          : `Extended catheterization (${catheterDays} days) with elevated infection markers. Evaluate for catheter removal or alternative.`}
                      </p>

                      {/* CAUTI Interventions */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          Required Interventions:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { action: 'Catheter necessity review with physician', priority: 'immediate' },
                            { action: 'Sterile technique audit', priority: 'routine' },
                            { action: 'Daily meatal care documented', priority: 'routine' },
                            { action: 'Urine culture if symptomatic', priority: catheterDays >= 7 ? 'immediate' : 'routine' },
                          ].map((intervention, i) => (
                            <div 
                              key={i}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded text-xs",
                                intervention.priority === 'immediate'
                                  ? "bg-risk-high/10 border border-risk-high/20"
                                  : "bg-secondary border border-border"
                              )}
                            >
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full flex-shrink-0",
                                intervention.priority === 'immediate' ? "bg-risk-high" : "bg-muted-foreground"
                              )} />
                              <span className="text-foreground">{intervention.action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* CAUTI Prevention Checklist */}
          <section className="mb-6 print:mb-4 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
              <ClipboardCheck className="w-4 h-4 text-blue-500" />
              Shift CAUTI Prevention Checklist
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { item: 'Review catheter necessity for all patients', required: true },
                { item: 'Document daily catheter care', required: true },
                { item: 'Verify closed drainage system integrity', required: true },
                { item: 'Check bag below bladder level', required: true },
                { item: 'Assess for signs of UTI', required: false },
                { item: 'Update catheter insertion date in EHR', required: false },
              ].map((check, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded text-sm",
                    check.required ? "bg-card" : "bg-secondary"
                  )}
                >
                  <div className="w-4 h-4 border border-border rounded flex-shrink-0" />
                  <span className="text-foreground">{check.item}</span>
                  {check.required && (
                    <span className="text-[9px] text-risk-high ml-auto">Required</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-border text-center print:mt-8">
            <p className="text-xs text-muted-foreground">
              <strong>⚠️ Research Prototype</strong> - Synthetic data only. CAUTI risk signals require clinical validation.
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Copyright © Dr. Alexis Collier | VitaSignal™ – 5 U.S. Patent Applications Filed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
