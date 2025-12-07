import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  FileText, Download, Printer, Clock, AlertTriangle, 
  CheckCircle, TrendingUp, TrendingDown, Minus, User,
  X, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { patients, type Patient } from '@/data/patients';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HandoffReportProps {
  onClose?: () => void;
}

export const HandoffReport = ({ onClose }: HandoffReportProps) => {
  const [shiftType, setShiftType] = useState('Night → Day');
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const highRiskPatients = patients.filter(p => p.riskLevel === 'HIGH');
  const mediumRiskPatients = patients.filter(p => p.riskLevel === 'MEDIUM');
  const trendingUp = patients.filter(p => p.trend === 'up');

  const handlePrint = () => {
    window.print();
  };

  const handleSaveReport = async () => {
    setIsGenerating(true);
    
    const reportData = {
      generated_at: new Date().toISOString(),
      shift_type: shiftType,
      high_risk: highRiskPatients.map(p => ({
        id: p.id,
        riskType: p.riskType,
        riskScore: p.riskScore,
        trend: p.trend,
        summary: p.riskSummary,
      })),
      medium_risk: mediumRiskPatients.map(p => ({
        id: p.id,
        riskType: p.riskType,
        riskScore: p.riskScore,
        trend: p.trend,
      })),
      trending_concerns: trendingUp.map(p => ({
        id: p.id,
        riskType: p.riskType,
        riskScore: p.riskScore,
      })),
      unit_summary: {
        total_patients: patients.length,
        high_risk_count: highRiskPatients.length,
        medium_risk_count: mediumRiskPatients.length,
        trending_up_count: trendingUp.length,
      },
    };

    const { error } = await supabase.from('handoff_reports').insert({
      shift_type: shiftType,
      high_risk_count: highRiskPatients.length,
      medium_risk_count: mediumRiskPatients.length,
      report_data: reportData,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save report. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Report saved",
        description: "Handoff report has been saved to the database.",
      });
    }
    setIsGenerating(false);
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3.5 h-3.5 text-risk-high" />;
      case 'down': return <TrendingDown className="w-3.5 h-3.5 text-risk-low" />;
      default: return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col print:border-none print:shadow-none print:max-h-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary print:bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Shift Handoff Report</h2>
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
              <h1 className="text-xl font-bold text-foreground">NSO Quality Handoff</h1>
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
                <User className="w-3.5 h-3.5" />
                {patients.length} patients
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 print:mb-4">
            <div className="p-4 rounded-lg bg-risk-high/10 border border-risk-high/30">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-risk-high" />
                <span className="text-2xl font-bold text-risk-high">{highRiskPatients.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">High Risk Patients</p>
            </div>
            <div className="p-4 rounded-lg bg-risk-medium/10 border border-risk-medium/30">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-risk-medium" />
                <span className="text-2xl font-bold text-risk-medium">{mediumRiskPatients.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Medium Risk Patients</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary border border-border">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-risk-high" />
                <span className="text-2xl font-bold text-foreground">{trendingUp.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Trending Up</p>
            </div>
          </div>

          {/* High Priority Patients */}
          <section className="mb-6 print:mb-4">
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
              <span className="w-2 h-2 rounded-full bg-risk-high" />
              High Priority - Immediate Attention Required
            </h3>
            <div className="space-y-3">
              {highRiskPatients.map((patient) => (
                <div 
                  key={patient.id}
                  className="p-4 rounded-lg bg-risk-high/5 border border-risk-high/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{patient.id}</span>
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-risk-high/20 text-risk-high font-medium">
                          {patient.riskType}
                        </span>
                        <TrendIcon trend={patient.trend} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {patient.room} • {patient.ageRange} • {patient.admissionDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-risk-high">{patient.riskScore}%</div>
                      <p className="text-[10px] text-muted-foreground">Risk Score</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-2">{patient.riskSummary}</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.riskFactors.slice(0, 3).map((factor, i) => (
                      <span 
                        key={i}
                        className={cn(
                          "px-2 py-0.5 text-[10px] rounded-full",
                          factor.contribution > 0 
                            ? "bg-risk-high/10 text-risk-high"
                            : "bg-risk-low/10 text-risk-low"
                        )}
                      >
                        {factor.icon} {factor.name.split(' ').slice(0, 3).join(' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Medium Risk */}
          <section className="mb-6 print:mb-4">
            <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
              <span className="w-2 h-2 rounded-full bg-risk-medium" />
              Medium Priority - Monitor Closely
            </h3>
            <div className="grid grid-cols-2 gap-3 print:grid-cols-2">
              {mediumRiskPatients.slice(0, 6).map((patient) => (
                <div 
                  key={patient.id}
                  className="p-3 rounded-lg bg-secondary border border-border"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-foreground">{patient.id}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-risk-medium">{patient.riskScore}%</span>
                      <TrendIcon trend={patient.trend} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{patient.riskType}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-border text-center print:mt-8">
            <p className="text-xs text-muted-foreground">
              <strong>⚠️ Research Prototype</strong> - Synthetic data only. All clinical decisions require human verification.
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              NSO Quality Dashboard • Stanford AI+HEALTH 2025
            </p>
            <p className="text-[9px] text-muted-foreground/70 mt-1">
              U.S. Provisional Patent Application No. 63/932,953 • Patent Pending
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
