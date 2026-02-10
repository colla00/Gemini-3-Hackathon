import { Badge } from '@/components/ui/badge';
import { TrustBasedAlertSystem } from './TrustBasedAlertSystem';
import { TrustScoreAlgorithm } from './TrustScoreAlgorithm';
import { CognitiveLoadOptimizer } from './CognitiveLoadOptimizer';

export const AlertOptimizationTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-lg font-bold text-foreground">Alert Optimization</h2>
        <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px]">Patent #2</Badge>
        <Badge variant="outline" className="text-[10px]">Design Phase</Badge>
      </div>
      <p className="text-sm text-muted-foreground max-w-3xl">
        Trust-based alert prioritization reduces alarm fatigue by dynamically filtering alerts based on confidence scores,
        nurse workload, and historical accuracy, ensuring clinicians see what matters most.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TrustScoreAlgorithm />
        <TrustBasedAlertSystem />
      </div>

      <CognitiveLoadOptimizer />
    </div>
  );
};
