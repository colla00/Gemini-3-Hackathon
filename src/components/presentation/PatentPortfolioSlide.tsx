import { Award, Brain, Shield, Activity, TrendingUp, Users, Clock, Target, CheckCircle2, FileText, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { PATENT_PORTFOLIO } from '@/constants/patent';

interface PatentInfo {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  status: 'filed' | 'pending' | 'preparation';
  filingDate: string;
  applicationNumber?: string;
  keyInnovations: string[];
  metrics: { label: string; value: string }[];
  differentiator: string;
  color: string;
}

const patents: PatentInfo[] = [
  {
    id: 'trust-alerts',
    name: 'ChartMinder (Trust-Based Alerts)',
    tagline: 'Mobile alert governance with trust-based prioritization & equity monitoring',
    icon: <Brain className="w-6 h-6" />,
    status: 'filed',
    filingDate: 'Dec 21, 2025',
    applicationNumber: undefined,
    keyInnovations: [
      'Trust Score Algorithm with temporal decay',
      'Real-time equity monitoring (<0.5% disparity)',
      'Explainable AI with attention weights',
      'Cognitive Load Optimization (simulated)'
    ],
    metrics: [
      { label: 'Alert Reduction', value: '87%*' },
      { label: 'Expert Agreement', value: '94%*' },
      { label: 'Time Saved', value: '2.3m*' }
    ],
    differentiator: 'Human-factors-engineered mobile dashboard combining trust-based prioritization with real-time equity monitoring',
    color: 'primary'
  },
  {
    id: 'risk-intelligence',
    name: 'Clinical Risk Intelligence',
    tagline: 'Explainability, forecasting & closed-loop feedback',
    icon: <Cpu className="w-6 h-6" />,
    status: 'filed',
    filingDate: 'Dec 2025',
    applicationNumber: undefined,
    keyInnovations: [
      'Multi-horizon temporal forecasting (4-48h)',
      'Patient-adaptive alert thresholds',
      'Closed-loop intervention feedback',
      'Bidirectional risk recalibration'
    ],
    metrics: [
      { label: 'Forecast Horizons', value: '4-48h' },
      { label: 'False Positive ↓', value: '40%' },
      { label: 'Sensitivity', value: '100%' }
    ],
    differentiator: 'Bidirectional feedback where interventions trigger automatic risk recalculation',
    color: 'chart-1'
  },
  {
    id: 'unified-platform',
    name: 'Unified Nursing Intelligence',
    tagline: 'Three-module integration platform',
    icon: <Shield className="w-6 h-6" />,
    status: 'filed',
    filingDate: 'Jan 2026',
    applicationNumber: undefined,
    keyInnovations: [
      'Documentation Burden Score (DBS) module',
      'Risk Intelligence module integration',
      'Trust-Based Alert System filtering',
      'Real-Time Equity Monitoring Engine'
    ],
    metrics: [
      { label: 'Hospitals Validated', value: '201' },
      { label: 'Patients Tested', value: '10,000' },
      { label: 'ROI/Hospital', value: '$180-360K' }
    ],
    differentiator: 'First unified platform integrating workload, risk, and alerts into single coherent system',
    color: 'accent'
  },
  {
    id: 'dbs-system',
    name: 'DBS System',
    tagline: 'Documentation burden prediction & staffing optimization',
    icon: <Activity className="w-6 h-6" />,
    status: 'filed',
    filingDate: 'Jan 22, 2026',
    applicationNumber: undefined,
    keyInnovations: [
      'Prospective burden scoring at admission',
      'Quartile-based staffing recommendations',
      'ICU LOS correlation (r=0.40)',
      'Equitable workload distribution'
    ],
    metrics: [
      { label: 'AUC Score', value: '0.78' },
      { label: 'Overtime ↓', value: '15-20%' },
      { label: 'Disparity', value: '<0.5%' }
    ],
    differentiator: 'ML-based prospective workload prediction replacing reactive census-based staffing',
    color: 'chart-2'
  },
];

const portfolioMetrics = [
  { label: 'Patent Applications', value: '5', icon: <FileText className="w-4 h-4" /> },
  { label: 'Market Size', value: '$4.2B', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Target Users', value: '3.8M RNs', icon: <Users className="w-4 h-4" /> },
  { label: 'Time to Value', value: '<90 days', icon: <Clock className="w-4 h-4" /> }
];

const getStatusBadge = (status: PatentInfo['status']) => {
  switch (status) {
    case 'filed':
      return { className: 'border-risk-low/50 text-risk-low bg-risk-low/10', label: 'Filed' };
    case 'pending':
      return { className: 'border-warning/50 text-warning bg-warning/10', label: 'Pending' };
    case 'preparation':
      return { className: 'border-chart-2/50 text-chart-2 bg-chart-2/10', label: 'In Preparation' };
  }
};

export const PatentPortfolioSlide = () => {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Award className="w-7 h-7 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Patent Portfolio Overview</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Five complementary patents creating a defensible moat in clinical AI
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
          <span className="text-xs font-semibold text-primary">Patent Portfolio · {PATENT_PORTFOLIO.filter(p => p.status === 'filed').length} Filed</span>
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {portfolioMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-secondary/30 border-border/50">
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  {metric.icon}
                </div>
                <div className="text-xl font-bold text-foreground">{metric.value}</div>
                <div className="text-[10px] text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Patent Cards - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {patents.map((patent, index) => {
          const statusBadge = getStatusBadge(patent.status);
          return (
            <motion.div
              key={patent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full bg-background/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-1.5 rounded-lg bg-${patent.color}/10`}>
                      <div className={`text-${patent.color}`}>{patent.icon}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className={`text-[9px] ${statusBadge.className}`}>
                        {statusBadge.label}
                      </Badge>
                      {patent.applicationNumber && (
                        <span className="text-[9px] text-primary font-mono font-medium">
                          {patent.applicationNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-sm">{patent.name}</CardTitle>
                  <p className="text-[10px] text-muted-foreground">{patent.tagline}</p>
                  <p className="text-[9px] text-muted-foreground/70">Filing: {patent.filingDate}</p>
                </CardHeader>
                
                <CardContent className="space-y-2 px-3 pb-3">
                  {/* Key Innovations */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Key Innovations
                    </span>
                    <ul className="space-y-0.5">
                      {patent.keyInnovations.slice(0, 3).map((innovation, i) => (
                        <li key={i} className="flex items-start gap-1 text-[10px] text-foreground">
                          <CheckCircle2 className="w-2.5 h-2.5 text-risk-low shrink-0 mt-0.5" />
                          <span className="leading-tight">{innovation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-1">
                    {patent.metrics.map((metric) => (
                      <div key={metric.label} className="text-center p-1 rounded bg-secondary/30">
                        <div className="text-xs font-bold text-primary">{metric.value}</div>
                        <div className="text-[8px] text-muted-foreground leading-tight">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Differentiator */}
                  <div className="p-1.5 rounded bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-1">
                      <Target className="w-2.5 h-2.5 text-primary shrink-0 mt-0.5" />
                      <p className="text-[9px] text-foreground leading-relaxed">
                        {patent.differentiator}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Synergy Statement */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-chart-1/10 border-primary/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground">Portfolio Synergy</h3>
              <p className="text-xs text-muted-foreground">
                ChartMinder (Trust-Based Alerts) + Risk Intelligence + Unified Platform + DBS System = Comprehensive clinical AI solution 
                with multiple layers of IP protection that competitors cannot easily replicate.
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">5x</div>
              <div className="text-[10px] text-muted-foreground">IP Barrier</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
