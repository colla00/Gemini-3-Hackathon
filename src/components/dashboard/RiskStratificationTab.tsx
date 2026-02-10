import { Badge } from '@/components/ui/badge';
import { EquityMonitoringEngine } from './EquityMonitoringEngine';
import { NeuralReasoningEngine } from './NeuralReasoningEngine';
import { PerformanceComparisonTable } from './PerformanceComparisonTable';

export const RiskStratificationTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-lg font-bold text-foreground">Risk Stratification</h2>
        <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px]">Patent #2</Badge>
        <Badge variant="outline" className="text-[10px]">Design Phase</Badge>
      </div>
      <p className="text-sm text-muted-foreground max-w-3xl">
        Integrated clinical risk intelligence with explainability, temporal forecasting, adaptive thresholds,
        and closed-loop intervention feedback, providing real-time multi-outcome risk scoring across patient populations.
      </p>

      <NeuralReasoningEngine />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EquityMonitoringEngine />
        <PerformanceComparisonTable />
      </div>
    </div>
  );
};
