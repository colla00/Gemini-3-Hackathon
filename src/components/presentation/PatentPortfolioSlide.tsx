import { Award, Brain, Shield, Activity, TrendingUp, Users, Clock, Target, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface PatentInfo {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  status: 'pending' | 'filed' | 'granted';
  filingDate: string;
  keyInnovations: string[];
  metrics: { label: string; value: string; improvement?: string }[];
  differentiator: string;
  color: string;
}

const patents: PatentInfo[] = [
  {
    id: 'unified-platform',
    name: 'Unified Risk Platform',
    tagline: 'Multi-outcome nursing quality monitoring',
    icon: <Shield className="w-6 h-6" />,
    status: 'pending',
    filingDate: 'Q4 2024',
    keyInnovations: [
      'Real-time EHR integration via HL7 FHIR',
      'Multi-outcome risk stratification',
      'Priority queue algorithm',
      'Closed-loop feedback system'
    ],
    metrics: [
      { label: 'Outcomes Tracked', value: '5+' },
      { label: 'Update Frequency', value: '<5 min' },
      { label: 'AUROC Target', value: '0.89' }
    ],
    differentiator: 'First unified platform addressing falls, pressure injuries, and CAUTIs simultaneously',
    color: 'primary'
  },
  {
    id: 'collier-dbs',
    name: 'Collier DBS™',
    tagline: 'Dynamic Baseline Scoring methodology',
    icon: <Activity className="w-6 h-6" />,
    status: 'pending',
    filingDate: 'Q4 2024',
    keyInnovations: [
      'Patient-specific baseline adaptation',
      'Temporal trend analysis',
      'Acuity-adjusted scoring',
      'LOS correlation optimization'
    ],
    metrics: [
      { label: 'Baseline Factors', value: '12' },
      { label: 'Trend Window', value: '24h' },
      { label: 'LOS Correlation', value: '0.73' }
    ],
    differentiator: 'Dynamic scoring that adapts to individual patient trajectories vs. static thresholds',
    color: 'accent'
  },
  {
    id: 'chartminder',
    name: 'ChartMinder AI',
    tagline: 'Intelligent clinical decision support',
    icon: <Brain className="w-6 h-6" />,
    status: 'pending',
    filingDate: 'Q1 2025',
    keyInnovations: [
      'Neural reasoning engine with explainability',
      'Cognitive load optimization',
      'Trust-based alert calibration',
      'Equity monitoring for bias detection'
    ],
    metrics: [
      { label: 'Alert Reduction', value: '87%' },
      { label: 'Trust Score', value: '94%' },
      { label: 'Response Time', value: '3 min' }
    ],
    differentiator: 'Only system combining explainable AI with workload-aware alert management',
    color: 'chart-1'
  }
];

const portfolioMetrics = [
  { label: 'Total Claims', value: '24+', icon: <Award className="w-4 h-4" /> },
  { label: 'Market Size', value: '$4.2B', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Target Users', value: '3.8M RNs', icon: <Users className="w-4 h-4" /> },
  { label: 'Time to Value', value: '<90 days', icon: <Clock className="w-4 h-4" /> }
];

export const PatentPortfolioSlide = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Award className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Patent Portfolio Overview</h1>
        </div>
        <p className="text-muted-foreground">
          Three complementary patents creating a defensible moat in clinical AI
        </p>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {portfolioMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-secondary/30 border-border/50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  {metric.icon}
                </div>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Patent Cards */}
      <div className="grid grid-cols-3 gap-4">
        {patents.map((patent, index) => (
          <motion.div
            key={patent.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.15 }}
          >
            <Card className="h-full bg-background/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg bg-${patent.color}/10`}>
                    <div className={`text-${patent.color}`}>{patent.icon}</div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-[10px] capitalize border-warning/50 text-warning"
                  >
                    {patent.status}
                  </Badge>
                </div>
                <CardTitle className="text-base">{patent.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{patent.tagline}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Innovations */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Key Innovations
                  </span>
                  <ul className="space-y-1">
                    {patent.keyInnovations.slice(0, 3).map((innovation, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                        <CheckCircle2 className="w-3 h-3 text-risk-low shrink-0 mt-0.5" />
                        <span>{innovation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2">
                  {patent.metrics.map((metric) => (
                    <div key={metric.label} className="text-center">
                      <div className="text-sm font-bold text-primary">{metric.value}</div>
                      <div className="text-[9px] text-muted-foreground">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Differentiator */}
                <div className="p-2 rounded bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-1.5">
                    <Target className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-foreground leading-relaxed">
                      {patent.differentiator}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Synergy Statement */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-chart-1/10 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Portfolio Synergy</h3>
              <p className="text-sm text-muted-foreground">
                The Unified Platform provides the infrastructure, Collier DBS™ delivers the scoring methodology, 
                and ChartMinder AI adds intelligent decision support—creating a comprehensive, defensible solution 
                that competitors cannot easily replicate.
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">3x</div>
              <div className="text-xs text-muted-foreground">Barrier to Entry</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
