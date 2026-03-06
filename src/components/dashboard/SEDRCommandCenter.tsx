import { useState, useEffect } from 'react';
import { Radio, MapPin, AlertTriangle, Bell, BellOff, TrendingUp, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const facilities = [
  { id: 'memorial', name: 'Memorial General', beds: 420, region: 'North' },
  { id: 'stmarys', name: "St. Mary's Medical", beds: 310, region: 'East' },
  { id: 'university', name: 'University Hospital', beds: 580, region: 'Central' },
  { id: 'regional', name: 'Regional Medical', beds: 250, region: 'West' },
  { id: 'community', name: 'Community Health', beds: 180, region: 'South' },
];

const syndromeTypes = ['Respiratory', 'GI', 'Sepsis-like', 'Neurological'] as const;

const generateScores = () => {
  const scores: Record<string, Record<string, number>> = {};
  facilities.forEach(f => {
    scores[f.id] = {};
    syndromeTypes.forEach(s => {
      scores[f.id][s] = Math.round((0.2 + Math.random() * 0.65) * 100) / 100;
    });
  });
  return scores;
};

export const SEDRCommandCenter = () => {
  const [scores, setScores] = useState(generateScores);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [threshold, setThreshold] = useState(0.6);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  const refreshData = () => setScores(generateScores());

  // Count alerts
  const activeAlerts = Object.entries(scores).reduce((acc, [fid, syndromes]) => {
    return acc + Object.values(syndromes).filter(v => v >= threshold).length;
  }, 0);

  return (
    <div className="space-y-6">
      <Card className="border-destructive/30 bg-gradient-to-br from-destructive/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-destructive/10 border border-destructive/20">
                <MapPin className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg">Surveillance Command Center</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Real-time facility monitoring with configurable alert thresholds</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #11</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <Card className="border-border/40">
        <CardContent className="p-4 flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
            <span className="text-sm text-foreground">{alertsEnabled ? 'Alerts On' : 'Alerts Off'}</span>
            {alertsEnabled ? <Bell className="h-4 w-4 text-destructive" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Threshold:</span>
            {[0.5, 0.6, 0.7, 0.8].map(t => (
              <Button
                key={t}
                variant={threshold === t ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setThreshold(t)}
              >
                {(t * 100).toFixed(0)}%
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={refreshData} className="ml-auto gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
          </Button>
          {alertsEnabled && (
            <Badge className={cn(
              'text-xs',
              activeAlerts > 5 ? 'bg-destructive/10 text-destructive border-destructive/30' :
              activeAlerts > 0 ? 'bg-warning/10 text-warning border-warning/30' :
              'bg-risk-low/10 text-risk-low border-risk-low/30'
            )}>
              {activeAlerts} active alerts
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Facility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map(f => {
          const facilityScores = scores[f.id];
          const hasAlert = Object.values(facilityScores).some(v => v >= threshold);
          const maxSyndrome = Object.entries(facilityScores).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);
          const isSelected = selectedFacility === f.id;

          return (
            <button
              key={f.id}
              onClick={() => setSelectedFacility(isSelected ? null : f.id)}
              className={cn(
                'text-left rounded-xl border p-4 transition-all',
                isSelected ? 'border-destructive/40 bg-destructive/5 shadow-md' :
                hasAlert && alertsEnabled ? 'border-warning/30 bg-warning/5' : 'border-border/30 hover:border-destructive/20'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-foreground">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">{f.region} · {f.beds} beds</p>
                </div>
                {hasAlert && alertsEnabled && (
                  <AlertTriangle className="h-4 w-4 text-warning animate-pulse" />
                )}
              </div>

              <div className="space-y-2">
                {syndromeTypes.map(s => {
                  const score = facilityScores[s];
                  const isAbove = score >= threshold;
                  return (
                    <div key={s}>
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <span className="text-muted-foreground">{s}</span>
                        <span className={cn('font-bold', isAbove ? 'text-destructive' : 'text-foreground')}>
                          {(score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={score * 100} className="h-1" />
                    </div>
                  );
                })}
              </div>

              {isSelected && (
                <div className="mt-3 p-2 rounded-lg bg-muted/30 border border-border/20">
                  <p className="text-[10px] text-muted-foreground">
                    Highest signal: <strong className="text-foreground">{maxSyndrome[0]}</strong> at{' '}
                    <strong className="text-destructive">{((maxSyndrome[1] as number) * 100).toFixed(0)}%</strong>
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
