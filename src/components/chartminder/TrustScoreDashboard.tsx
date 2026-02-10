import { Shield, Scale, Brain, Bell, ChevronRight, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TrustScoreDashboardProps {
  onNavigate: (screen: string) => void;
}

const trustDistribution = [
  { label: '0-20', height: 20, color: 'bg-destructive' },
  { label: '21-40', height: 35, color: 'bg-warning' },
  { label: '41-60', height: 45, color: 'bg-warning/70' },
  { label: '61-80', height: 55, color: 'bg-primary/70' },
  { label: '81-100', height: 30, color: 'bg-green-500' },
];

const recentAlerts = [
  { id: 1, type: 'Sepsis Risk', patient: 'MRN-12345', trust: 89, severity: 'high', time: '14 min ago' },
  { id: 2, type: 'Cardiac Arrhythmia', patient: 'MRN-67890', trust: 76, severity: 'medium', time: '28 min ago' },
  { id: 3, type: 'Fall Risk', patient: 'MRN-11223', trust: 92, severity: 'high', time: '45 min ago' },
  { id: 4, type: 'Medication Interaction', patient: 'MRN-44556', trust: 61, severity: 'low', time: '1 hr ago' },
];

export const TrustScoreDashboard = ({ onNavigate }: TrustScoreDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Header context */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">ICU - West Wing · Quality Dashboard</p>
          <p className="text-xs text-muted-foreground/60">January 23, 2026, 2:45 PM</p>
        </div>
        <Badge className="bg-green-500/15 text-green-600 border-green-500/30 text-[10px] font-bold">● LIVE</Badge>
      </div>

      {/* Primary Metrics Card */}
      <Card className="bg-card border-border/40 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-5xl font-bold text-green-500">41</p>
              <p className="text-lg font-medium text-foreground mt-1">Active Alerts</p>
              <p className="text-sm text-muted-foreground mt-0.5">271 Suppressed Today</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-500/15 text-green-600 border-green-500/30 text-xs font-bold">87% Alert Reduction</Badge>
              </div>
            </div>
            {/* Trust Score Distribution mini chart */}
            <div className="flex items-end gap-1 h-16">
              {trustDistribution.map((bar) => (
                <div key={bar.label} className="flex flex-col items-center gap-0.5">
                  <div
                    className={`w-4 rounded-sm ${bar.color}`}
                    style={{ height: `${bar.height}%` }}
                  />
                  <span className="text-[8px] text-muted-foreground">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-card border-border/40 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('alert-insight')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/15">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-foreground">82/100</p>
              <p className="text-xs text-muted-foreground">Average Trust Score</p>
              <p className="text-xs text-green-500 font-medium">↑ 3% vs yesterday</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('bias-monitor')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/15">
              <Scale className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-foreground">&lt;0.5%</p>
              <p className="text-xs text-muted-foreground">Equity Variance</p>
              <p className="text-xs text-green-500 font-medium">All demographics within tolerance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('cognitive-load')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-500/15">
              <Brain className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-foreground">Optimal</p>
              <p className="text-xs text-muted-foreground">Cognitive Load</p>
              <p className="text-xs text-green-500 font-medium">Alert timing balanced</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="h-12 font-semibold" onClick={() => onNavigate('alert-insight')}>
          View Active Alerts
        </Button>
        <Button variant="outline" className="h-12 font-semibold" onClick={() => onNavigate('bias-monitor')}>
          Check Bias Metrics
        </Button>
        <Button variant="outline" className="h-12 font-semibold" onClick={() => onNavigate('reasoning')}>
          Alert History
        </Button>
        <Button variant="outline" className="h-12 font-semibold relative" onClick={() => onNavigate('alert-insight')}>
          Suppressed Alerts
          <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] h-5 px-1.5">271</Badge>
        </Button>
      </div>

      {/* Recent High-Trust Alerts */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent High-Trust Alerts</h3>
        <div className="space-y-2">
          {recentAlerts.map((alert) => (
            <Card key={alert.id} className="bg-card border-border/40 cursor-pointer hover:shadow-sm transition-shadow" onClick={() => onNavigate('alert-insight')}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${alert.severity === 'high' ? 'bg-destructive/15' : alert.severity === 'medium' ? 'bg-warning/15' : 'bg-muted'}`}>
                  <AlertTriangle className={`h-4 w-4 ${alert.severity === 'high' ? 'text-destructive' : alert.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{alert.type}</p>
                    <Badge variant="outline" className="text-[10px] h-4 shrink-0">{alert.patient}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-lg font-bold ${alert.trust >= 85 ? 'text-green-500' : alert.trust >= 70 ? 'text-primary' : 'text-warning'}`}>{alert.trust}</p>
                  <p className="text-[10px] text-muted-foreground">Trust</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
