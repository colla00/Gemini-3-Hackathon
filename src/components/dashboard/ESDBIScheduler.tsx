import { useState } from 'react';
import { Users, Calendar, Clock, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Shift = { day: string; am: number; pm: number; night: number; amNeed: number; pmNeed: number; nightNeed: number };
const weekSchedule: Shift[] = [
  { day: 'Mon', am: 14, pm: 12, night: 10, amNeed: 14, pmNeed: 14, nightNeed: 11 },
  { day: 'Tue', am: 13, pm: 13, night: 10, amNeed: 13, pmNeed: 13, nightNeed: 10 },
  { day: 'Wed', am: 12, pm: 11, night: 9, amNeed: 15, pmNeed: 14, nightNeed: 11 },
  { day: 'Thu', am: 14, pm: 14, night: 11, amNeed: 14, pmNeed: 13, nightNeed: 11 },
  { day: 'Fri', am: 11, pm: 10, night: 8, amNeed: 15, pmNeed: 15, nightNeed: 12 },
  { day: 'Sat', am: 9, pm: 8, night: 7, amNeed: 11, pmNeed: 10, nightNeed: 9 },
  { day: 'Sun', am: 8, pm: 8, night: 7, amNeed: 10, pmNeed: 9, nightNeed: 8 },
];

const floatPool = [
  { name: 'Sarah M., RN', specialty: 'ICU/CCU', available: true, hours: '7a-7p' },
  { name: 'David K., RN', specialty: 'Med-Surg', available: true, hours: '7p-7a' },
  { name: 'Lisa R., LPN', specialty: 'Telemetry', available: false, hours: '7a-3p' },
  { name: 'James W., CNA', specialty: 'General', available: true, hours: '3p-11p' },
  { name: 'Maria G., RN', specialty: 'NICU', available: true, hours: '7a-7p' },
];

export const ESDBIScheduler = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Wed');

  const day = weekSchedule.find(d => d.day === selectedDay)!;
  const shifts = [
    { label: 'AM (7a-3p)', current: day.am, needed: day.amNeed },
    { label: 'PM (3p-11p)', current: day.pm, needed: day.pmNeed },
    { label: 'Night (11p-7a)', current: day.night, needed: day.nightNeed },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-chart-2/30 bg-gradient-to-br from-chart-2/[0.04] to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-chart-2/10 border border-chart-2/20">
                <Calendar className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <CardTitle className="text-lg">Predictive Shift Scheduler</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Interactive staffing planner with burden-aware scheduling</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px]">Patent #7</Badge>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px]">MOCK DATA</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Day Selector */}
      <div className="flex gap-1.5">
        {weekSchedule.map(d => {
          const totalGap = (d.amNeed - d.am) + (d.pmNeed - d.pm) + (d.nightNeed - d.night);
          const hasGap = totalGap > 2;
          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={cn(
                'flex-1 py-3 rounded-lg border text-center transition-all',
                selectedDay === d.day
                  ? 'border-chart-2/40 bg-chart-2/10 shadow-sm'
                  : 'border-border/30 hover:border-chart-2/20',
              )}
            >
              <p className="text-xs font-bold text-foreground">{d.day}</p>
              {hasGap && <div className="w-1.5 h-1.5 rounded-full bg-warning mx-auto mt-1" />}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shift Detail */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-chart-2" />
              {selectedDay} Shift Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shifts.map(s => {
              const gap = s.needed - s.current;
              const coverage = Math.min(100, (s.current / s.needed) * 100);
              return (
                <div key={s.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{s.current}/{s.needed} staff</span>
                      {gap > 0 ? (
                        <Badge variant="outline" className="text-[9px] text-warning border-warning/30 bg-warning/10">
                          -{gap} gap
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] text-risk-low border-risk-low/30 bg-risk-low/10">
                          Covered
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={coverage} className="h-2.5" />
                  {gap > 0 && (
                    <p className="text-[10px] text-warning flex items-center gap-1">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      Recommend {gap} additional staff from float pool
                    </p>
                  )}
                </div>
              );
            })}
            <div className="bg-muted/30 rounded-lg p-3 border border-border/30 mt-3">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Weekly Gap Summary:</strong>{' '}
                {weekSchedule.reduce((acc, d) => acc + Math.max(0, d.amNeed - d.am) + Math.max(0, d.pmNeed - d.pm) + Math.max(0, d.nightNeed - d.night), 0)} total staff-shifts understaffed across the week
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Float Pool */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-chart-2" />
              Float Pool Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {floatPool.map(f => (
              <div key={f.name} className={cn(
                'flex items-center justify-between p-3 rounded-lg border transition-all',
                f.available ? 'border-risk-low/20 bg-risk-low/5 hover:shadow-sm cursor-pointer' : 'border-border/20 opacity-50'
              )}>
                <div>
                  <p className="text-sm font-medium text-foreground">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">{f.specialty} · {f.hours}</p>
                </div>
                {f.available ? (
                  <Badge className="bg-risk-low/10 text-risk-low border-risk-low/30 text-[9px] gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Available
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] text-muted-foreground">Assigned</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
