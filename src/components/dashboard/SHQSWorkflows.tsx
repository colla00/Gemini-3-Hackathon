import { useState } from 'react';
import { Shield, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const workflows = [
  {
    id: 'pressure-injury',
    name: 'Pressure Injury Protocol',
    trigger: 'Score dropped below 88% benchmark',
    steps: [
      { action: 'Identify affected units via documentation analysis', status: 'done' as const, detail: 'Units 3A, 4B flagged' },
      { action: 'Auto-assign skin assessment refresher module', status: 'done' as const, detail: '12 nurses notified' },
      { action: 'Schedule Braden Scale documentation audit', status: 'active' as const, detail: 'Due in 48 hours' },
      { action: 'Notify Wound Care team for high-risk patients', status: 'pending' as const, detail: '3 patients identified' },
      { action: 'Re-measure quality metric after 7 days', status: 'pending' as const, detail: 'Auto-scheduled' },
    ],
  },
  {
    id: 'falls',
    name: 'Falls Prevention Workflow',
    trigger: '3 fall events in Unit 3B this month',
    steps: [
      { action: 'Pull fall risk scores for all Unit 3B patients', status: 'done' as const, detail: '18 patients assessed' },
      { action: 'Re-stratify patients using updated Morse scale', status: 'done' as const, detail: '5 moved to high-risk' },
      { action: 'Deploy bed alarm verification checklist', status: 'active' as const, detail: 'In progress' },
      { action: 'Assign 1:1 sitter for highest-risk patient', status: 'pending' as const, detail: 'Pending approval' },
      { action: 'Root cause analysis meeting scheduled', status: 'pending' as const, detail: 'Friday 2 PM' },
    ],
  },
  {
    id: 'hand-hygiene',
    name: 'Hand Hygiene Improvement',
    trigger: 'Compliance dipped to 89% (target: 95%)',
    steps: [
      { action: 'Identify low-compliance shifts via badge data', status: 'done' as const, detail: 'Night shift flagged' },
      { action: 'Deploy targeted education module', status: 'done' as const, detail: '8 staff enrolled' },
      { action: 'Increase auditor rounds for 2 weeks', status: 'active' as const, detail: '3x daily observations' },
      { action: 'Install additional dispensers at flagged stations', status: 'pending' as const, detail: 'Facilities notified' },
      { action: 'Re-audit and compare to baseline', status: 'pending' as const, detail: 'In 14 days' },
    ],
  },
];

const statusIcons = {
  done: <CheckCircle2 className="h-4 w-4 text-risk-low" />,
  active: <Zap className="h-4 w-4 text-warning animate-pulse" />,
  pending: <div className="h-4 w-4 rounded-full border-2 border-border/50" />,
};

const statusColors = {
  done: 'border-risk-low/20 bg-risk-low/5',
  active: 'border-warning/30 bg-warning/5 shadow-sm',
  pending: 'border-border/20 bg-muted/20 opacity-70',
};

export const SHQSWorkflows = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflows[0]);

  const completedSteps = selectedWorkflow.steps.filter(s => s.status === 'done').length;
  const progress = (completedSteps / selectedWorkflow.steps.length) * 100;

  return (
    <div className="space-y-6">
      <Card className="border-chart-5/30 bg-gradient-to-br from-chart-5/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-chart-5/10 border border-chart-5/20">
                <Shield className="w-5 h-5 text-chart-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Quality Improvement Workflows</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Automated step-by-step improvement protocols triggered by deviation detection</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #8</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Workflow Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {workflows.map(w => {
          const done = w.steps.filter(s => s.status === 'done').length;
          return (
            <button
              key={w.id}
              onClick={() => setSelectedWorkflow(w)}
              className={cn(
                'text-left p-4 rounded-xl border transition-all',
                selectedWorkflow.id === w.id ? 'border-chart-5/40 bg-chart-5/5 shadow-md' : 'border-border/30 hover:border-chart-5/20'
              )}
            >
              <p className="text-sm font-bold text-foreground mb-1">{w.name}</p>
              <p className="text-[10px] text-muted-foreground mb-2">{w.trigger}</p>
              <Progress value={(done / w.steps.length) * 100} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground mt-1">{done}/{w.steps.length} steps complete</p>
            </button>
          );
        })}
      </div>

      {/* Active Workflow Steps */}
      <Card className="border-border/40">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">{selectedWorkflow.name}</CardTitle>
            <Badge variant="outline" className="text-[10px]">{progress.toFixed(0)}% complete</Badge>
          </div>
          <p className="text-[10px] text-warning flex items-center gap-1 mt-1">
            <AlertTriangle className="h-3 w-3" />
            Trigger: {selectedWorkflow.trigger}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedWorkflow.steps.map((step, i) => (
              <div key={i} className={cn('flex items-start gap-3 p-4 rounded-lg border transition-all', statusColors[step.status])}>
                <div className="shrink-0 mt-0.5">{statusIcons[step.status]}</div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground font-medium')}>{step.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{step.detail}</p>
                </div>
                <Badge variant="outline" className="text-[9px] shrink-0">{step.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
