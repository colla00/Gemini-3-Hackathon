import { TrustBasedAlertSystem } from '@/components/dashboard/TrustBasedAlertSystem';
import { EquityMonitoringEngine } from '@/components/dashboard/EquityMonitoringEngine';
import { DBSCalculationBreakdown } from '@/components/dashboard/DBSCalculationBreakdown';
import { PatentValidationCharts } from '@/components/dashboard/PatentValidationCharts';
import { NeuralReasoningEngine } from '@/components/dashboard/NeuralReasoningEngine';
import { CognitiveLoadOptimizer } from '@/components/dashboard/CognitiveLoadOptimizer';
import { TrustScoreAlgorithm } from '@/components/dashboard/TrustScoreAlgorithm';
import { PerformanceComparisonTable } from '@/components/dashboard/PerformanceComparisonTable';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Shield, Scale, BarChart3, Brain, Cpu, Target, TrendingUp } from 'lucide-react';

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
              Trust-Based Alerts • Clinical Risk Intelligence • Unified Platform • DBS System
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-risk-low/10 border-risk-low/30 text-risk-low">
              4 U.S. Patents Filed
            </Badge>
            <Badge variant="outline" className="bg-chart-2/10 border-chart-2/30 text-chart-2">
              3,247 Providers Validated
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
              <Brain className="w-4 h-4 text-chart-2" />
              <span className="text-xs font-semibold text-foreground">Neural Reasoning</span>
            </div>
            <p className="text-2xl font-bold text-chart-2">94%</p>
            <p className="text-[10px] text-muted-foreground">Expert agreement</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-chart-1" />
              <span className="text-xs font-semibold text-foreground">Equity Engine</span>
            </div>
            <p className="text-2xl font-bold text-chart-1">&lt;0.5%</p>
            <p className="text-[10px] text-muted-foreground">Demographic disparity</p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-risk-low" />
              <span className="text-xs font-semibold text-foreground">Cognitive Load</span>
            </div>
            <p className="text-2xl font-bold text-foreground">2.3m</p>
            <p className="text-[10px] text-muted-foreground">Saved per decision</p>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="core" className="flex items-center gap-1.5 text-xs">
            <Shield className="w-3.5 h-3.5" />
            Core Innovations
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="flex items-center gap-1.5 text-xs">
            <Brain className="w-3.5 h-3.5" />
            AI Intelligence
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-1.5 text-xs">
            <Target className="w-3.5 h-3.5" />
            Validation Data
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1.5 text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Core Innovations Tab */}
        <TabsContent value="core" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <TrustBasedAlertSystem />
            <EquityMonitoringEngine />
          </div>
        </TabsContent>

        {/* AI Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <NeuralReasoningEngine />
            <CognitiveLoadOptimizer />
          </div>
          <TrustScoreAlgorithm />
        </TabsContent>

        {/* Validation Data Tab */}
        <TabsContent value="validation" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <DBSCalculationBreakdown />
            <PatentValidationCharts />
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <PerformanceComparisonTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};
