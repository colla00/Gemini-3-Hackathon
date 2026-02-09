import { ArrowLeft, BookOpen, GitBranch, Sliders } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

interface ReasoningExplorerProps {
  onNavigate: (screen: string) => void;
}

const attentionWeights = [
  { factor: 'Creatinine elevation', attention: 35, value: '2.4 mg/dL', level: 'high' },
  { factor: '48-hour trend worsening', attention: 25, value: '+0.6', level: 'high' },
  { factor: 'Reduced urine output', attention: 20, value: '320 mL/24hr', level: 'high' },
  { factor: 'Nephrotoxic medication', attention: 15, value: 'Vancomycin', level: 'moderate' },
  { factor: 'Baseline kidney disease', attention: 10, value: 'CKD Stage 3', level: 'moderate' },
  { factor: 'Other clinical factors', attention: 5, value: 'Age, BP', level: 'low' },
];

const literatureCitations = [
  { title: 'KDIGO AKI Guidelines 2024', similarity: 94, journal: 'Kidney International', excerpt: 'Creatinine rise >0.3 mg/dL within 48 hours meets Stage 1 AKI criteria...' },
  { title: 'Vancomycin-Induced Nephrotoxicity', similarity: 89, journal: 'Clinical Pharmacology', excerpt: 'Trough levels >20 mcg/mL associated with 3x increased AKI risk...' },
  { title: 'Oliguria as Early AKI Marker', similarity: 86, journal: 'Critical Care Medicine', excerpt: 'Urine output <0.5 mL/kg/hr for 6 hours is diagnostic criterion...' },
  { title: 'CKD Progression Risk Factors', similarity: 82, journal: 'NEJM', excerpt: 'Pre-existing CKD Stage 3+ patients have 5x higher acute-on-chronic risk...' },
];

const reasoningSteps = [
  { step: 1, title: 'Data Collection', description: 'Gathered 24h vital signs, labs, medications, and nursing assessments' },
  { step: 2, title: 'Pattern Detection', description: 'Creatinine rising trend detected: 1.8 → 2.4 mg/dL over 48 hours' },
  { step: 3, title: 'Context Integration', description: 'Patient has CKD Stage 3 baseline + active Vancomycin therapy' },
  { step: 4, title: 'Risk Calculation', description: 'Combined risk factors yield 87% probability of AKI progression' },
  { step: 5, title: 'Literature Validation', description: 'KDIGO criteria met for Stage 1 AKI; consistent with 4 clinical guidelines' },
  { step: 6, title: 'Recommendation', description: 'Consider nephrology consult and medication review for vancomycin dose adjustment' },
];

const whatIfParams = [
  { label: 'Creatinine', current: 2.4, range: [0.5, 5.0], unit: 'mg/dL' },
  { label: 'Urine Output', current: 320, range: [0, 2000], unit: 'mL/24hr' },
  { label: 'Vancomycin Trough', current: 22, range: [5, 40], unit: 'mcg/mL' },
];

export const ReasoningExplorer = ({ onNavigate }: ReasoningExplorerProps) => {
  const [whatIfValues, setWhatIfValues] = useState(whatIfParams.map(p => p.current));

  return (
    <div className="space-y-5">
      {/* Back nav */}
      <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onNavigate('alert-insight')}>
        <ArrowLeft className="h-4 w-4" /> Back to Alert
      </Button>

      {/* Alert context */}
      <Card className="bg-card border-border/40">
        <CardContent className="p-4">
          <Badge className="bg-destructive text-destructive-foreground text-xs mb-2">Acute Kidney Injury Risk</Badge>
          <p className="text-sm text-foreground">67M, CHF, CKD Stage 3</p>
          <div className="mt-2 bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-foreground font-medium">Recommendation: Consider nephrology consult and medication review</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-600 font-medium">High Confidence</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="attention" className="w-full">
        <TabsList className="w-full grid grid-cols-4 h-9">
          <TabsTrigger value="attention" className="text-[11px]">Attention</TabsTrigger>
          <TabsTrigger value="literature" className="text-[11px]">Literature</TabsTrigger>
          <TabsTrigger value="reasoning" className="text-[11px]">Reasoning</TabsTrigger>
          <TabsTrigger value="whatif" className="text-[11px]">What-If</TabsTrigger>
        </TabsList>

        {/* Tab 1: Attention Weights */}
        <TabsContent value="attention" className="mt-4 space-y-2">
          {attentionWeights.map((item) => (
            <Card key={item.factor} className={`border-l-4 ${item.level === 'high' ? 'border-l-destructive' : item.level === 'moderate' ? 'border-l-warning' : 'border-l-green-500'}`}>
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.factor}</p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </div>
                <Badge className={`${item.level === 'high' ? 'bg-destructive/15 text-destructive' : item.level === 'moderate' ? 'bg-warning/15 text-warning' : 'bg-green-500/15 text-green-600'} text-xs`}>
                  {item.attention}%
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab 2: Literature Evidence */}
        <TabsContent value="literature" className="mt-4 space-y-3">
          {literatureCitations.map((cite) => (
            <Card key={cite.title} className="bg-card border-border/40">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    <p className="text-sm font-medium text-foreground">{cite.title}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-4 shrink-0">{cite.similarity}%</Badge>
                </div>
                <p className="text-[11px] text-primary font-medium">{cite.journal}</p>
                <p className="text-xs text-muted-foreground mt-1 italic">"{cite.excerpt}"</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab 3: Reasoning Chain */}
        <TabsContent value="reasoning" className="mt-4">
          <div className="relative pl-6">
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-border" />
            {reasoningSteps.map((step) => (
              <div key={step.step} className="relative mb-4 last:mb-0">
                <div className="absolute -left-[14px] top-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[10px] text-primary-foreground font-bold">{step.step}</span>
                </div>
                <Card className="bg-card border-border/40">
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: What-If Analysis */}
        <TabsContent value="whatif" className="mt-4 space-y-4">
          <p className="text-xs text-muted-foreground">Adjust clinical parameters to see how the prediction changes.</p>
          {whatIfParams.map((param, idx) => (
            <Card key={param.label} className="bg-card border-border/40">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{param.label}</p>
                  <span className="text-sm font-bold text-foreground">{whatIfValues[idx]} {param.unit}</span>
                </div>
                <input
                  type="range"
                  min={param.range[0]}
                  max={param.range[1]}
                  step={param.label === 'Urine Output' ? 10 : 0.1}
                  value={whatIfValues[idx]}
                  onChange={(e) => {
                    const newVals = [...whatIfValues];
                    newVals[idx] = parseFloat(e.target.value);
                    setWhatIfValues(newVals);
                  }}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{param.range[0]} {param.unit}</span>
                  <span>{param.range[1]} {param.unit}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Predicted Risk with Modified Parameters</p>
              <p className="text-3xl font-bold text-primary">
                {Math.min(99, Math.max(10, Math.round(
                  40 + (whatIfValues[0] / 5) * 30 - (whatIfValues[1] / 2000) * 20 + (whatIfValues[2] / 40) * 15
                )))}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">AKI Progression Probability</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-11 font-semibold">Export Report</Button>
        <Button className="h-11 font-semibold">Discuss with Team</Button>
      </div>
    </div>
  );
};
