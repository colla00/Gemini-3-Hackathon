import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitBranch, ArrowRight, AlertTriangle, Link2, TrendingUp, Info } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area, Legend, ReferenceLine } from 'recharts';
import { patients } from '@/data/patients';

interface CorrelationPair {
  outcome1: string;
  outcome2: string;
  correlation: number;
  mechanism: string;
  clinicalImplication: string;
}

const correlations: CorrelationPair[] = [
  {
    outcome1: 'Falls Risk',
    outcome2: 'HAPI Risk',
    correlation: 0.67,
    mechanism: 'Shared mobility impairment pathway',
    clinicalImplication: 'Patients with mobility deficits are at risk for both falls and pressure injuries due to inability to reposition',
  },
  {
    outcome1: 'Falls Risk',
    outcome2: 'CAUTI Risk',
    correlation: 0.42,
    mechanism: 'Catheter use as fall prevention',
    clinicalImplication: 'Indwelling catheters sometimes placed to reduce ambulation needs, creating iatrogenic CAUTI risk',
  },
  {
    outcome1: 'HAPI Risk',
    outcome2: 'CAUTI Risk',
    correlation: 0.38,
    mechanism: 'Immobility syndrome',
    clinicalImplication: 'Severely immobile patients often have both catheters and pressure injury risk from prolonged positioning',
  },
];

const scatterData = patients.map(p => ({
  fallsRisk: p.riskFactors.find(f => f.name === 'Mobility')?.contribution 
    ? p.riskScore * (1 + (p.riskFactors.find(f => f.name === 'Mobility')?.contribution || 0) / 100)
    : p.riskScore,
  hapiRisk: p.riskFactors.find(f => f.name === 'Skin Integrity')?.contribution
    ? p.riskScore * (1 + (p.riskFactors.find(f => f.name === 'Skin Integrity')?.contribution || 0) / 100)
    : p.riskScore * 0.8,
  cautiRisk: p.riskFactors.find(f => f.name === 'Catheter Days')?.contribution
    ? p.riskScore * (1 + (p.riskFactors.find(f => f.name === 'Catheter Days')?.contribution || 0) / 100)
    : p.riskScore * 0.6,
  id: p.id,
  combined: p.riskScore,
}));

const cascadeData = [
  { day: 'D1', falls: 0.45, hapi: 0.30, cauti: 0.25 },
  { day: 'D2', falls: 0.52, hapi: 0.35, cauti: 0.28 },
  { day: 'D3', falls: 0.58, hapi: 0.42, cauti: 0.32 },
  { day: 'D4', falls: 0.65, hapi: 0.52, cauti: 0.38 },
  { day: 'D5', falls: 0.72, hapi: 0.62, cauti: 0.45 },
  { day: 'D6', falls: 0.78, hapi: 0.70, cauti: 0.52 },
  { day: 'D7', falls: 0.82, hapi: 0.76, cauti: 0.58 },
];

const interactionEffects = [
  { factor: 'Mobility Decline', fallsImpact: 0.35, hapiImpact: 0.28, cautiImpact: 0.12, synergy: 'high' },
  { factor: 'Sedating Meds', fallsImpact: 0.25, hapiImpact: 0.15, cautiImpact: 0.08, synergy: 'moderate' },
  { factor: 'Age >75', fallsImpact: 0.18, hapiImpact: 0.22, cautiImpact: 0.20, synergy: 'moderate' },
  { factor: 'Catheter Present', fallsImpact: 0.10, hapiImpact: 0.12, cautiImpact: 0.42, synergy: 'low' },
  { factor: 'Nutritional Deficit', fallsImpact: 0.08, hapiImpact: 0.32, cautiImpact: 0.15, synergy: 'moderate' },
];

export const CrossOutcomeCorrelation = () => {
  const [selectedCorrelation, setSelectedCorrelation] = useState<CorrelationPair>(correlations[0]);
  const [highlightedPatient, setHighlightedPatient] = useState<string | null>(null);

  const getCorrelationColor = (corr: number) => {
    if (corr > 0.6) return 'text-destructive';
    if (corr > 0.4) return 'text-warning';
    return 'text-success';
  };

  const getCorrelationBg = (corr: number) => {
    if (corr > 0.6) return 'bg-destructive/10 border-destructive/30';
    if (corr > 0.4) return 'bg-warning/10 border-warning/30';
    return 'bg-success/10 border-success/30';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-primary" />
            Cross-Outcome Risk Correlation
          </h2>
          <p className="text-sm text-muted-foreground">
            Novel detection of how one NSO risk influences another
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          Patent Claim #8
        </Badge>
      </div>

      {/* Correlation Matrix */}
      <div className="grid grid-cols-3 gap-4">
        {correlations.map((corr) => (
          <Card
            key={`${corr.outcome1}-${corr.outcome2}`}
            className={`cursor-pointer transition-all ${
              selectedCorrelation === corr
                ? 'ring-2 ring-primary/50 ' + getCorrelationBg(corr.correlation)
                : 'bg-secondary/30 border-border hover:bg-secondary/50'
            }`}
            onClick={() => setSelectedCorrelation(corr)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{corr.outcome1}</span>
                  <Link2 className="w-3 h-3 text-muted-foreground" />
                  <span className="font-medium">{corr.outcome2}</span>
                </div>
              </div>
              <div className={`text-3xl font-bold ${getCorrelationColor(corr.correlation)}`}>
                r = {corr.correlation.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{corr.mechanism}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="scatter" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scatter">Correlation Plot</TabsTrigger>
          <TabsTrigger value="cascade">Risk Cascade</TabsTrigger>
          <TabsTrigger value="interactions">Factor Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="scatter">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  {selectedCorrelation.outcome1} vs {selectedCorrelation.outcome2}
                  <Badge variant="outline" className={getCorrelationBg(selectedCorrelation.correlation)}>
                    r = {selectedCorrelation.correlation.toFixed(2)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey={selectedCorrelation.outcome1 === 'Falls Risk' ? 'fallsRisk' : selectedCorrelation.outcome1 === 'HAPI Risk' ? 'hapiRisk' : 'cautiRisk'}
                        name={selectedCorrelation.outcome1}
                        tick={{ fontSize: 10 }}
                        stroke="hsl(var(--muted-foreground))"
                        domain={[0, 1]}
                        tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      />
                      <YAxis
                        dataKey={selectedCorrelation.outcome2 === 'Falls Risk' ? 'fallsRisk' : selectedCorrelation.outcome2 === 'HAPI Risk' ? 'hapiRisk' : 'cautiRisk'}
                        name={selectedCorrelation.outcome2}
                        tick={{ fontSize: 10 }}
                        stroke="hsl(var(--muted-foreground))"
                        domain={[0, 1]}
                        tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                      />
                      <Scatter data={scatterData} name="Patients">
                        {scatterData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.combined > 0.7 ? 'hsl(var(--destructive))' : entry.combined > 0.5 ? 'hsl(var(--warning))' : 'hsl(var(--primary))'}
                            opacity={highlightedPatient === entry.id ? 1 : 0.7}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Clinical Implication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-sm">{selectedCorrelation.clinicalImplication}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Mechanism</h4>
                  <p className="text-sm">{selectedCorrelation.mechanism}</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-warning">Clinical Alert</p>
                      <p className="text-xs text-muted-foreground">
                        High correlation (r &gt; 0.5) suggests interventions targeting one outcome 
                        may influence the other. Consider bundled prevention strategies.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cascade">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Risk Cascade Over Time (Simulated Patient)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cascadeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="falls" stackId="1" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.3} name="Falls Risk" />
                    <Area type="monotone" dataKey="hapi" stackId="2" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.3} name="HAPI Risk" />
                    <Area type="monotone" dataKey="cauti" stackId="3" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} name="CAUTI Risk" />
                    <ReferenceLine y={0.7} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
                <p className="text-sm text-muted-foreground">
                  <strong>Innovation:</strong> Demonstrates how initial mobility decline triggers a cascade 
                  effect—first elevating falls risk, then HAPI risk as immobility persists, and finally 
                  CAUTI risk if catheterization occurs. Early intervention can break this cascade.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Shared Risk Factor Impact Across Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {interactionEffects.map((effect) => (
                  <div key={effect.factor} className="p-3 rounded-lg border bg-secondary/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{effect.factor}</span>
                      <Badge
                        variant="outline"
                        className={
                          effect.synergy === 'high'
                            ? 'bg-destructive/10 text-destructive border-destructive/30'
                            : effect.synergy === 'moderate'
                            ? 'bg-warning/10 text-warning border-warning/30'
                            : 'bg-muted/50 text-muted-foreground'
                        }
                      >
                        {effect.synergy} synergy
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Falls Impact</div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-destructive"
                            style={{ width: `${effect.fallsImpact * 100}%` }}
                          />
                        </div>
                        <div className="text-xs font-mono mt-1">{(effect.fallsImpact * 100).toFixed(0)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">HAPI Impact</div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-warning"
                            style={{ width: `${effect.hapiImpact * 100}%` }}
                          />
                        </div>
                        <div className="text-xs font-mono mt-1">{(effect.hapiImpact * 100).toFixed(0)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">CAUTI Impact</div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${effect.cautiImpact * 100}%` }}
                          />
                        </div>
                        <div className="text-xs font-mono mt-1">{(effect.cautiImpact * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/30">
                <p className="text-xs text-muted-foreground">
                  <strong>Key Finding:</strong> Mobility decline shows highest cross-outcome synergy, 
                  affecting all three NSOs. This identifies mobility as a high-leverage intervention point 
                  with multi-outcome preventive potential.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
