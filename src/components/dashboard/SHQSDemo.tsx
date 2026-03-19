import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, Target, BarChart3, DollarSign, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const initialDimensions = [
  { dimension: 'Hand Hygiene', score: 94, benchmark: 95, trend: 'stable' as const },
  { dimension: 'Falls Prevention', score: 88, benchmark: 90, trend: 'improving' as const },
  { dimension: 'CAUTI Rate', score: 96, benchmark: 92, trend: 'stable' as const },
  { dimension: 'CLABSI Rate', score: 91, benchmark: 90, trend: 'declining' as const },
  { dimension: 'Pressure Injury', score: 82, benchmark: 88, trend: 'declining' as const },
  { dimension: 'Med Errors', score: 97, benchmark: 95, trend: 'improving' as const },
];

const trendData = [
  { month: 'Jul', composite: 88, benchmark: 90 },
  { month: 'Aug', composite: 89, benchmark: 90 },
  { month: 'Sep', composite: 87, benchmark: 90 },
  { month: 'Oct', composite: 91, benchmark: 90 },
  { month: 'Nov', composite: 90, benchmark: 90 },
  { month: 'Dec', composite: 92, benchmark: 90 },
  { month: 'Jan', composite: 91, benchmark: 91 },
];

const initialDeviations = [
  { id: 1, metric: 'Pressure Injury Rate', severity: 'high' as const, value: '82%', benchmark: '88%', gap: '-6%', action: 'Triggered: Skin assessment protocol reinforcement', timeDetected: '2h ago', resolved: false },
  { id: 2, metric: 'Falls (Unit 3B)', severity: 'medium' as const, value: '3 events', benchmark: '≤1/month', gap: '+2', action: 'Triggered: Fall risk reassessment for all patients', timeDetected: '6h ago', resolved: false },
  { id: 3, metric: 'CLABSI (ICU-A)', severity: 'low' as const, value: '91%', benchmark: '90%', gap: '+1%', action: 'Monitoring: Within acceptable variance', timeDetected: '1d ago', resolved: false },
];

const sevColors: Record<string, string> = {
  high: 'text-destructive bg-destructive/10 border-destructive/30',
  medium: 'text-warning bg-warning/10 border-warning/30',
  low: 'text-risk-low bg-risk-low/10 border-risk-low/30',
};

export const SHQSDemo = () => {
  const [dimensions, setDimensions] = useState(initialDimensions);
  const [compositeScore, setCompositeScore] = useState(91.3);
  const [autoActions, setAutoActions] = useState(4);
  const [deviations, setDeviations] = useState(initialDeviations);
  const [improvementEvent, setImprovementEvent] = useState<string | null>(null);

  const radarData = dimensions.map(d => ({ subject: d.dimension, Current: d.score, Benchmark: d.benchmark }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCompositeScore(prev => parseFloat((prev + (Math.random() - 0.48) * 0.15).toFixed(1)));
      // Simulate quality dimension fluctuations
      setDimensions(prev => prev.map(d => ({
        ...d,
        score: Math.min(100, Math.max(70, d.score + (Math.random() - 0.48) * 0.3)),
      })));
      if (Math.random() > 0.85) setAutoActions(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const resolveDeviation = (id: number) => {
    const deviation = deviations.find(d => d.id === id);
    setDeviations(prev => prev.map(d => d.id === id ? { ...d, resolved: true, action: 'Resolved — corrective action completed' } : d));
    // Improve the related quality dimension
    if (deviation) {
      setDimensions(prev => prev.map(d => {
        if (deviation.metric.includes(d.dimension) || (deviation.metric.includes('Pressure') && d.dimension === 'Pressure Injury')) {
          return { ...d, score: Math.min(100, d.score + 3), trend: 'improving' as const };
        }
        return d;
      }));
      setCompositeScore(prev => parseFloat((prev + 0.5).toFixed(1)));
      setImprovementEvent(`✓ ${deviation.metric}: Corrective action applied — quality score improved`);
      setTimeout(() => setImprovementEvent(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-chart-5/30 bg-gradient-to-br from-chart-5/[0.06] to-transparent overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--chart-5)/0.08),transparent_70%)]" />
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-chart-5/15 border border-chart-5/25 shadow-lg shadow-chart-5/10">
                <Shield className="w-5 h-5 text-chart-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Smart Healthcare Quality Surveillance</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Continuous quality monitoring, deviation detection, and automated improvement workflows</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-risk-low/10 border border-risk-low/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
                </span>
                <span className="text-[10px] font-semibold text-risk-low">LIVE</span>
              </div>
              <Badge variant="outline" className="text-[10px]">Patent #8</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Improvement Event */}
      <AnimatePresence>
        {improvementEvent && (
          <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }}>
            <div className="p-3 rounded-lg border border-risk-low/40 bg-risk-low/10 flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-risk-low shrink-0" />
              <p className="text-sm font-semibold text-risk-low">{improvementEvent}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Composite Score + KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="border-chart-5/30 bg-gradient-to-b from-chart-5/5 to-transparent md:col-span-1">
            <CardContent className="p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Composite Quality</p>
              <p className="text-4xl font-bold text-risk-low mt-1 tabular-nums">{compositeScore.toFixed(1)}%</p>
              <Badge className="bg-risk-low/10 text-risk-low border-risk-low/30 text-[9px] mt-2">Above Benchmark</Badge>
            </CardContent>
          </Card>
        </motion.div>
        {[
          { label: 'Active Deviations', value: deviations.filter(d => !d.resolved).length.toString(), color: 'text-warning', icon: <AlertTriangle className="h-4 w-4" /> },
          { label: 'Auto-Actions', value: autoActions.toString(), color: 'text-chart-5', icon: <Zap className="h-4 w-4" /> },
          { label: 'Penalty Avoidance', value: '$1.8M', color: 'text-risk-low', icon: <DollarSign className="h-4 w-4" /> },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.08 }}>
            <Card className="border-border/40 hover:shadow-md transition-shadow">
              <CardContent className="p-5 text-center">
                <div className={cn('mx-auto mb-1', k.color)}>{k.icon}</div>
                <p className={cn('text-2xl font-bold tabular-nums', k.color)}>{k.value}</p>
                <p className="text-[10px] font-semibold text-foreground mt-0.5">{k.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar — live updates */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-chart-5" />
                Multi-Dimensional Quality Radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                  <PolarRadiusAxis angle={30} domain={[70, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Current" dataKey="Current" stroke="hsl(var(--chart-5))" fill="hsl(var(--chart-5))" fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="Benchmark" dataKey="Benchmark" stroke="hsl(var(--muted-foreground))" fill="none" strokeDasharray="5 5" />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trend */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="border-border/40 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-chart-5" />
                Composite Score Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendData}>
                  <defs>
                    <linearGradient id="qualityLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--chart-5))" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[82, 96]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} />
                  <Line type="monotone" dataKey="composite" stroke="url(#qualityLine)" strokeWidth={3} dot={{ r: 5, fill: 'hsl(var(--chart-5))', strokeWidth: 2, stroke: 'hsl(var(--background))' }} name="Quality Score" />
                  <Line type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Benchmark" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deviations — now actionable */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Quality Deviation Alerts
              <Badge variant="outline" className="text-[9px] ml-auto">Auto-response enabled</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {deviations.map((d, i) => (
              <motion.div key={d.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
                <div className={cn('p-4 rounded-xl border transition-all', d.resolved ? 'border-risk-low/20 bg-risk-low/5' : sevColors[d.severity])}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {d.resolved ? <CheckCircle2 className="h-3.5 w-3.5 text-risk-low" /> : d.severity === 'high' && <AlertTriangle className="h-3.5 w-3.5 text-destructive animate-pulse" />}
                      <span className="font-bold text-sm text-foreground">{d.metric}</span>
                      <Badge variant="outline" className={cn('text-[9px]', d.resolved ? 'text-risk-low border-risk-low/30' : sevColors[d.severity])}>
                        {d.resolved ? 'RESOLVED' : d.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{d.timeDetected}</span>
                      {!d.resolved && d.severity !== 'low' && (
                        <Button variant="outline" size="sm" className="h-5 text-[9px] px-2" onClick={() => resolveDeviation(d.id)}>
                          Resolve <ArrowRight className="h-2.5 w-2.5 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 text-[11px] text-muted-foreground mb-2">
                    <span>Current: <strong className="text-foreground">{d.value}</strong></span>
                    <span>Benchmark: {d.benchmark}</span>
                    <span>Gap: <strong className={!d.resolved && d.severity === 'high' ? 'text-destructive' : ''}>{d.gap}</strong></span>
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-chart-5" />
                    {d.action}
                  </p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Enterprise ROI */}
      <Card className="bg-gradient-to-r from-chart-5/10 via-primary/5 to-transparent border-chart-5/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-chart-5/15">
              <Shield className="w-5 h-5 text-chart-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">Enterprise Integration Value</p>
              <p className="text-[10px] text-muted-foreground">
                SHQS eliminates manual quality auditing with continuous automated surveillance. Prevents CMS penalties ($1.8M avg*),
                reduces HAI rates, and provides board-ready quality dashboards — all from existing documentation data.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-chart-5">$1.8M</p>
              <p className="text-[9px] text-muted-foreground">penalty avoidance*</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/60 mt-2">*Design-phase estimates based on CMS penalty data. Not clinically validated. For illustration only.</p>
        </CardContent>
      </Card>
    </div>
  );
};
