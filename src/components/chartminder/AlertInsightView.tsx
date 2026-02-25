import { ArrowLeft, Share2, CheckCircle, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

interface AlertInsightViewProps {
  onNavigate: (screen: string) => void;
}

// Trust factor weights shown are illustrative — actual weights are proprietary
const trustFactors = [
  {
    title: 'Historical Accuracy',
    weight: 'Weighted',
    score: 92,
    detail: '92% true positive rate over past 90 days',
    subDetail: 'Based on 847 similar alert outcomes',
    color: 'bg-green-500',
  },
  {
    title: 'Clinician Feedback',
    weight: 'Weighted',
    score: 87,
    detail: '87% clinicians accepted similar alerts',
    subDetail: 'Based on 156 feedback instances · 4.5/5 stars',
    color: 'bg-primary',
  },
  {
    title: 'Temporal Relevance',
    weight: 'Weighted',
    score: 94,
    detail: 'Recent data prioritized (14-day half-life)',
    subDetail: '94% accuracy for recent similar cases',
    color: 'bg-accent',
  },
  {
    title: 'Data Quality',
    weight: 'Weighted',
    score: 96,
    detail: '96% data completeness',
    subDetail: 'All vital signs, labs, meds, and documentation current',
    color: 'bg-green-500',
  },
];

const dataQualityChecks = [
  { label: 'Complete vital signs', status: true },
  { label: 'Laboratory results current', status: true },
  { label: 'Medication history verified', status: true },
  { label: 'Documentation up-to-date', status: true },
];

export const AlertInsightView = ({ onNavigate }: AlertInsightViewProps) => {
  const [expandedFactor, setExpandedFactor] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      {/* Back nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>

      {/* Alert Header */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <Badge className="bg-destructive text-destructive-foreground text-xs mb-2">SEPSIS RISK</Badge>
              <p className="text-sm text-muted-foreground">Patient ID: MRN-12345</p>
              <p className="text-xs text-muted-foreground/70">Generated 14 minutes ago</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-500">89</p>
              <p className="text-xs text-muted-foreground font-medium">/100 Trust Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Score Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Trust Score Breakdown</h3>
        {trustFactors.map((factor, idx) => (
          <Card key={factor.title} className="bg-card border-border/40">
            <CardContent className="p-4">
              <button
                className="w-full text-left"
                onClick={() => setExpandedFactor(expandedFactor === idx ? null : idx)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{factor.title}</h4>
                    <Badge variant="outline" className="text-[10px] h-4">{factor.weight}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{factor.score}%</span>
                    {expandedFactor === idx ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </div>
                <Progress value={factor.score} className="h-2" />
              </button>
              {expandedFactor === idx && (
                <div className="mt-3 pt-3 border-t border-border/40">
                  <p className="text-sm text-foreground">{factor.detail}</p>
                  <p className="text-xs text-muted-foreground mt-1">{factor.subDetail}</p>
                  {factor.title === 'Data Quality' && (
                    <div className="mt-2 space-y-1">
                      {dataQualityChecks.map((check) => (
                        <div key={check.label} className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs text-foreground">{check.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confidence Band */}
      <Card className="bg-card border-border/40">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground">Confidence Interval</p>
            <p className="text-sm text-muted-foreground">95% CI: 85–93</p>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-[60%] right-[7%] bg-primary/30 rounded-full" />
            <div className="absolute top-0 bottom-0 left-[78%] w-1 bg-primary rounded-full" />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
            <span>0</span><span>50</span><span>100</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="h-11 font-semibold" onClick={() => onNavigate('reasoning')}>
          View Clinical Reasoning
        </Button>
        <Button variant="outline" className="h-11 font-semibold">
          See Similar Cases
        </Button>
      </div>
    </div>
  );
};
