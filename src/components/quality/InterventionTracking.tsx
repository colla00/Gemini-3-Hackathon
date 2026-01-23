import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingDown, Award } from "lucide-react";

interface InterventionOutcome {
  id: string;
  intervention: string;
  implemented: string;
  riskBeforeLevel: 'Low' | 'Moderate' | 'Elevated';
  riskAfterLevel: 'Low' | 'Moderate' | 'Elevated';
  effectivenessLabel: 'Strong' | 'Moderate' | 'Mild';
  simulated: boolean;
}

const mockOutcomes: InterventionOutcome[] = [
  {
    id: "1",
    intervention: "Bed Alarm + Q2H Positioning",
    implemented: "11/29 02:00",
    riskBeforeLevel: 'Elevated',
    riskAfterLevel: 'Moderate',
    effectivenessLabel: 'Strong',
    simulated: true
  },
  {
    id: "2",
    intervention: "Mobility Enhancement Protocol",
    implemented: "11/28 14:30",
    riskBeforeLevel: 'Elevated',
    riskAfterLevel: 'Moderate',
    effectivenessLabel: 'Moderate',
    simulated: true
  },
  {
    id: "3",
    intervention: "Med Reconciliation + Sedation Review",
    implemented: "11/27 08:00",
    riskBeforeLevel: 'Moderate',
    riskAfterLevel: 'Low',
    effectivenessLabel: 'Moderate',
    simulated: true
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Elevated': return 'bg-risk-high/60';
    case 'Moderate': return 'bg-risk-medium/60';
    case 'Low': return 'bg-risk-low/60';
    default: return 'bg-muted/60';
  }
};

const getLevelWidth = (level: string) => {
  switch (level) {
    case 'Elevated': return '85%';
    case 'Moderate': return '55%';
    case 'Low': return '25%';
    default: return '50%';
  }
};

const getLevelTextColor = (level: string) => {
  switch (level) {
    case 'Elevated': return 'text-risk-high';
    case 'Moderate': return 'text-risk-medium';
    case 'Low': return 'text-risk-low';
    default: return 'text-muted-foreground';
  }
};

export const InterventionTracking = () => {
  const strongEffects = mockOutcomes.filter(o => o.effectivenessLabel === 'Strong').length;
  const overallEffectiveness = strongEffects > mockOutcomes.length / 2 ? 'Strong' : 
                               strongEffects > 0 ? 'Moderate' : 'Mild';

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Intervention Efficacy Tracking</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Illustrative outcomes demonstrating AI-guided intervention concept (synthetic data)
            </p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-accent/10 border border-accent/30">
            <Award className="w-3 h-3 text-accent" />
            <span className="text-xs text-accent font-medium">U.S. Patent Filed</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Metric - Qualitative */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Observed Risk Reduction</p>
              <p className="text-2xl font-bold text-accent">{overallEffectiveness}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Across {mockOutcomes.length > 2 ? 'several' : 'multiple'} simulated interventions
              </p>
            </div>
            <TrendingDown className="w-12 h-12 text-accent/40" />
          </div>
        </div>

        {/* Intervention List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Recent Simulated Outcomes</h4>
            <Badge variant="outline" className="text-xs">
              Unit 4C - Med/Surg
            </Badge>
          </div>

          {mockOutcomes.map((outcome, idx) => (
            <div 
              key={outcome.id} 
              className="p-3 rounded-lg border border-border/50 hover:bg-secondary/20 transition-all"
              style={{ 
                opacity: 0,
                animation: 'fade-in 0.3s ease-out forwards',
                animationDelay: `${idx * 100}ms`
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-medium">{outcome.intervention}</h5>
                    {outcome.simulated && (
                      <Badge variant="outline" className="text-[9px] text-amber-500 border-amber-500/30">Simulated</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Implemented: {outcome.implemented}</p>
                </div>
                <Badge 
                  variant={outcome.effectivenessLabel === 'Strong' ? "default" : "secondary"}
                  className="text-xs"
                >
                  {outcome.effectivenessLabel} effect
                </Badge>
              </div>

              {/* Risk Visualization - Qualitative */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Before</span>
                    <span className={getLevelTextColor(outcome.riskBeforeLevel)}>{outcome.riskBeforeLevel}</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getLevelColor(outcome.riskBeforeLevel)}`}
                      style={{ width: getLevelWidth(outcome.riskBeforeLevel) }}
                    />
                  </div>
                </div>

                <div className="text-muted-foreground">→</div>

                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">After</span>
                    <span className={getLevelTextColor(outcome.riskAfterLevel)}>{outcome.riskAfterLevel}</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getLevelColor(outcome.riskAfterLevel)}`}
                      style={{ width: getLevelWidth(outcome.riskAfterLevel) }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Methodology Note */}
        <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded border border-border/50">
          <p className="font-medium mb-1">Validation Framework:</p>
          <p>
            This novel tracking system observes intervention efficacy by comparing risk signals 
            before and after clinical actions. The system enables continuous learning and validates 
            the clinical utility of AI-guided interventions through real-world outcome tracking.
          </p>
          <p className="mt-2 text-[10px] text-accent">
            U.S. Patent Filed
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-[9px] text-muted-foreground w-full text-center">
          NSO Quality Dashboard – 4 U.S. Patents Filed
        </p>
      </CardFooter>
    </Card>
  );
};