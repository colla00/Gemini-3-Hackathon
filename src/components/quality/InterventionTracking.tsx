import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingDown, Award } from "lucide-react";

interface InterventionOutcome {
  id: string;
  intervention: string;
  implemented: string;
  riskBefore: number;
  riskAfter: number;
  effectiveness: number;
  validated: boolean;
}

const mockOutcomes: InterventionOutcome[] = [
  {
    id: "1",
    intervention: "Bed Alarm + Q2H Positioning",
    implemented: "11/29 02:00",
    riskBefore: 68,
    riskAfter: 38,
    effectiveness: 44.1,
    validated: true
  },
  {
    id: "2",
    intervention: "Mobility Enhancement Protocol",
    implemented: "11/28 14:30",
    riskBefore: 72,
    riskAfter: 45,
    effectiveness: 37.5,
    validated: true
  },
  {
    id: "3",
    intervention: "Med Reconciliation + Sedation Review",
    implemented: "11/27 08:00",
    riskBefore: 61,
    riskAfter: 39,
    effectiveness: 36.1,
    validated: true
  }
];

export const InterventionTracking = () => {
  const avgEffectiveness = mockOutcomes.reduce((sum, o) => sum + o.effectiveness, 0) / mockOutcomes.length;

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Intervention Efficacy Tracking</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Validated outcomes demonstrating AI-guided intervention effectiveness
            </p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-accent/10 border border-accent/30">
            <Award className="w-3 h-3 text-accent" />
            <span className="text-xs text-accent font-medium">Patent-Pending</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Metric */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Risk Reduction</p>
              <p className="text-3xl font-bold text-accent">{avgEffectiveness.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Across {mockOutcomes.length} validated interventions</p>
            </div>
            <TrendingDown className="w-12 h-12 text-accent/40" />
          </div>
        </div>

        {/* Intervention List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Recent Validated Outcomes</h4>
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
                    {outcome.validated && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Implemented: {outcome.implemented}</p>
                </div>
                <Badge 
                  variant={outcome.effectiveness > 40 ? "default" : "secondary"}
                  className="text-xs"
                >
                  -{outcome.effectiveness.toFixed(1)}% risk
                </Badge>
              </div>

              {/* Risk Visualization */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Before</span>
                    <span className="font-mono text-destructive">{outcome.riskBefore}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-destructive/60 rounded-full"
                      style={{ width: `${outcome.riskBefore}%` }}
                    />
                  </div>
                </div>

                <div className="text-muted-foreground">→</div>

                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">After</span>
                    <span className="font-mono text-green-600">{outcome.riskAfter}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600/60 rounded-full"
                      style={{ width: `${outcome.riskAfter}%` }}
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
            This novel tracking system measures intervention efficacy by comparing model-predicted risk 
            before and after clinical actions. The system enables continuous learning and validates 
            the clinical utility of AI-guided interventions through real-world outcome tracking.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};