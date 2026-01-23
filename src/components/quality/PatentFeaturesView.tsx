import { TrustBasedAlertSystem } from '@/components/dashboard/TrustBasedAlertSystem';
import { EquityMonitoringEngine } from '@/components/dashboard/EquityMonitoringEngine';
import { DBSCalculationBreakdown } from '@/components/dashboard/DBSCalculationBreakdown';
import { PatentValidationCharts } from '@/components/dashboard/PatentValidationCharts';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, Scale, BarChart3 } from 'lucide-react';

export const PatentFeaturesView = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-chart-1/10 via-chart-2/10 to-primary/10 border border-border/40 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              Patent Innovation Features
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Advanced capabilities from the Unified Nursing Intelligence Platform and DBS System patents
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-chart-1/10 border-chart-1/30 text-chart-1">
              Patent Pending
            </Badge>
            <Badge variant="outline" className="bg-chart-2/10 border-chart-2/30 text-chart-2">
              Research Validated
            </Badge>
          </div>
        </div>
        
        {/* Quick Feature Cards */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Trust-Based Alerts</span>
            </div>
            <p className="text-2xl font-bold text-risk-low">87%</p>
            <p className="text-[10px] text-muted-foreground">Alert fatigue reduction</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-chart-2" />
              <span className="text-xs font-semibold text-foreground">Equity Engine</span>
            </div>
            <p className="text-2xl font-bold text-chart-2">&lt;0.5%</p>
            <p className="text-[10px] text-muted-foreground">Demographic disparity</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-chart-1" />
              <span className="text-xs font-semibold text-foreground">DBS Model</span>
            </div>
            <p className="text-2xl font-bold text-foreground">0.78</p>
            <p className="text-[10px] text-muted-foreground">AUC accuracy</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-risk-low" />
              <span className="text-xs font-semibold text-foreground">Validation</span>
            </div>
            <p className="text-2xl font-bold text-foreground">201</p>
            <p className="text-[10px] text-muted-foreground">Hospitals validated</p>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <TrustBasedAlertSystem />
          <DBSCalculationBreakdown />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <EquityMonitoringEngine />
          <PatentValidationCharts />
        </div>
      </div>
    </div>
  );
};
