import { ArrowLeft, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BiasMonitorDashboardProps {
  onNavigate: (screen: string) => void;
}

const raceData = [
  { group: 'White', accuracy: 89 },
  { group: 'Black', accuracy: 88 },
  { group: 'Asian', accuracy: 90 },
  { group: 'Hispanic', accuracy: 89 },
  { group: 'Other', accuracy: 88 },
];

const genderData = [
  { group: 'Male', accuracy: 89 },
  { group: 'Female', accuracy: 89 },
  { group: 'Non-binary', accuracy: 90 },
];

const ageData = [
  { group: '<18', accuracy: 88 },
  { group: '18-35', accuracy: 89 },
  { group: '36-50', accuracy: 90 },
  { group: '51-65', accuracy: 89 },
  { group: '66-75', accuracy: 88 },
  { group: '76+', accuracy: 89 },
];

const investigations = [
  { date: 'Jan 15', issue: 'Opioid dosing disparity', status: 'Resolved' },
  { date: 'Jan 8', issue: 'Cardiac alert variance', status: 'Monitoring' },
  { date: 'Jan 3', issue: 'Sepsis detection lag', status: 'Resolved' },
];

const DemographicTable = ({ title, data, variance }: { title: string; data: { group: string; accuracy: number }[]; variance: string }) => (
  <Card className="bg-card border-border/40">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
          <span className="text-xs text-muted-foreground">Variance: {variance}</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((row) => (
          <div key={row.group} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-16 shrink-0">{row.group}</span>
            <div className="flex-1">
              <Progress value={row.accuracy} className="h-2" />
            </div>
            <span className="text-xs font-medium text-foreground w-8 text-right">{row.accuracy}%</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const BiasMonitorDashboard = ({ onNavigate }: BiasMonitorDashboardProps) => {
  return (
    <div className="space-y-5">
      {/* Back nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Badge className="bg-green-500/15 text-green-600 border-green-500/30 text-xs font-bold">ALL CLEAR</Badge>
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-foreground">Equity Pulse Monitor</h2>
        <p className="text-xs text-muted-foreground">Last Updated: Real-time (5 min refresh)</p>
      </div>

      {/* Overall Variance */}
      <Card className="bg-green-500/5 border-green-500/20">
        <CardContent className="p-5 text-center">
          <p className="text-4xl font-bold text-green-500">0.31%</p>
          <p className="text-sm text-foreground font-medium mt-1">Overall Variance</p>
          <p className="text-xs text-muted-foreground">Target: &lt;0.5%</p>
          <Badge className="mt-2 bg-green-500/15 text-green-600 border-green-500/30 text-xs">85% improvement vs. baseline EHR alerts</Badge>
        </CardContent>
      </Card>

      {/* Demographic Breakdowns */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Demographic Breakdown</h3>
        <div className="space-y-3">
          <DemographicTable title="Race/Ethnicity Analysis" data={raceData} variance="0.31%" />
          <DemographicTable title="Gender Analysis" data={genderData} variance="0.18%" />
          <DemographicTable title="Age Distribution" data={ageData} variance="0.42%" />
        </div>
      </div>

      {/* Socioeconomic Status */}
      <Card className="bg-card border-border/40">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-foreground">Socioeconomic Status</h4>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs text-muted-foreground">No disparities</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">ADI Quintiles</p>
              <div className="flex items-end gap-1 h-8">
                {[65, 80, 72, 88, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/40 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Insurance Types</p>
              <div className="flex items-end gap-1 h-8">
                {[78, 82, 85, 75].map((h, i) => (
                  <div key={i} className="flex-1 bg-accent/40 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disparity Investigations */}
      <Card className="bg-card border-border/40">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Disparity Investigations This Month</h4>
            <Badge variant="outline" className="text-[10px] h-4">3</Badge>
          </div>
          <div className="space-y-2">
            {investigations.map((inv) => (
              <div key={inv.date} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-12">{inv.date}</span>
                  <span className="text-xs text-foreground">{inv.issue}</span>
                </div>
                <Badge className={inv.status === 'Resolved' ? 'bg-green-500/15 text-green-600 border-green-500/30 text-[10px]' : 'bg-warning/15 text-warning border-warning/30 text-[10px]'}>
                  {inv.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Three-Tier Response */}
      <Card className="bg-card border-border/40">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">Response Tier System</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 text-center bg-green-500/10 border border-green-500/20 rounded-lg p-2">
              <p className="text-xs font-bold text-green-600">Tier 1</p>
              <p className="text-[10px] text-muted-foreground">Monitoring</p>
              <p className="text-[10px] text-muted-foreground">&lt;0.5%</p>
            </div>
            <span className="text-muted-foreground">→</span>
            <div className="flex-1 text-center bg-warning/10 border border-warning/20 rounded-lg p-2">
              <p className="text-xs font-bold text-warning">Tier 2</p>
              <p className="text-[10px] text-muted-foreground">Investigation</p>
              <p className="text-[10px] text-muted-foreground">0.5–1%</p>
            </div>
            <span className="text-muted-foreground">→</span>
            <div className="flex-1 text-center bg-destructive/10 border border-destructive/20 rounded-lg p-2">
              <p className="text-xs font-bold text-destructive">Tier 3</p>
              <p className="text-[10px] text-muted-foreground">Immediate</p>
              <p className="text-[10px] text-muted-foreground">&gt;1%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
