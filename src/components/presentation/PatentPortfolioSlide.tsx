import { Award, Brain, Shield, Activity, TrendingUp, Users, Clock, Target, FileText, Cpu, Stethoscope, BarChart3, Heart, Dna, Search, Radio } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { PATENT_PORTFOLIO, PATENTS_FILED_COUNT } from '@/constants/patent';

interface PatentEntry {
  id: string;
  number: number;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  status: 'filed' | 'pending' | 'preparation';
  filingDate: string;
  validated?: boolean;
  color: string;
}

const allPatents: PatentEntry[] = [
  {
    id: 'icu-mortality',
    number: 1,
    name: 'ICU Mortality Prediction',
    tagline: 'EHR documentation rhythm patterns & temporal phenotypes',
    icon: <Heart className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Feb 2026',
    validated: true,
    color: 'text-red-400',
  },
  {
    id: 'trust-alerts',
    number: 2,
    name: 'ChartMinder™',
    tagline: 'Trust-based alert prioritization & equity monitoring',
    icon: <Brain className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Dec 2025',
    color: 'text-primary',
  },
  {
    id: 'risk-intelligence',
    number: 3,
    name: 'Clinical Risk Intelligence',
    tagline: 'Explainability, forecasting & closed-loop feedback',
    icon: <Cpu className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Dec 2025',
    color: 'text-blue-400',
  },
  {
    id: 'unified-platform',
    number: 4,
    name: 'Unified Nursing Intelligence',
    tagline: 'Three-module integration platform',
    icon: <Shield className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Jan 2026',
    color: 'text-emerald-400',
  },
  {
    id: 'dbs-system',
    number: 5,
    name: 'DBS System',
    tagline: 'Documentation burden prediction & staffing',
    icon: <Activity className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Jan 2026',
    validated: true,
    color: 'text-amber-400',
  },
  {
    id: 'traci',
    number: 6,
    name: 'TRACI',
    tagline: 'Temporal risk assessment & clinical intelligence',
    icon: <Clock className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Feb 2026',
    color: 'text-violet-400',
  },
  {
    id: 'esdbi',
    number: 7,
    name: 'ESDBI',
    tagline: 'Enhanced staffing & documentation burden intelligence',
    icon: <BarChart3 className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Feb 2026',
    color: 'text-cyan-400',
  },
  {
    id: 'shqs',
    number: 8,
    name: 'SHQS',
    tagline: 'Smart healthcare quality surveillance',
    icon: <Stethoscope className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Feb 2026',
    color: 'text-pink-400',
  },
  {
    id: 'dtbl',
    number: 9,
    name: 'DTBL',
    tagline: 'Digital twin baseline learning for personalized thresholds',
    icon: <Dna className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Feb 2026',
    color: 'text-orange-400',
  },
  {
    id: 'ctci',
    number: 10,
    name: 'CTCI',
    tagline: 'Clinical trial & cohort intelligence',
    icon: <Search className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Feb 2026',
    color: 'text-teal-400',
  },
  {
    id: 'sedr',
    number: 11,
    name: 'SEDR',
    tagline: 'Syndromic early detection & response',
    icon: <Radio className="w-4 h-4" />,
    status: 'filed',
    filingDate: 'Feb 2026',
    color: 'text-rose-400',
  },
];

const portfolioMetrics = [
  { label: 'Patent Applications', value: String(PATENTS_FILED_COUNT), icon: <FileText className="w-4 h-4" /> },
  { label: 'Market Size', value: '$4.7B', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Target Users', value: '3.8M RNs', icon: <Users className="w-4 h-4" /> },
  { label: 'Time to Value', value: '<90 days', icon: <Clock className="w-4 h-4" /> },
];

export const PatentPortfolioSlide = () => {
  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Patent Portfolio Overview</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          {PATENTS_FILED_COUNT} complementary patents creating a defensible moat in clinical AI
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
          <span className="text-xs font-semibold text-primary">
            {PATENT_PORTFOLIO.filter(p => p.status === 'filed').length} Filed · Dec 2025 – Feb 2026
          </span>
        </div>
      </div>

      {/* Portfolio Metrics Row */}
      <div className="grid grid-cols-4 gap-2">
        {portfolioMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-secondary/30 border-border/50">
              <CardContent className="p-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-primary mb-0.5">
                  {metric.icon}
                </div>
                <div className="text-lg font-bold text-foreground">{metric.value}</div>
                <div className="text-[9px] text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* All 11 Patents — Compact Grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* First row: Patents 1-4 */}
        {allPatents.slice(0, 4).map((patent, index) => (
          <PatentCard key={patent.id} patent={patent} index={index} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {/* Second row: Patents 5-8 */}
        {allPatents.slice(4, 8).map((patent, index) => (
          <PatentCard key={patent.id} patent={patent} index={index + 4} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-[75%] mx-auto">
        {/* Third row: Patents 9-11, centered */}
        {allPatents.slice(8, 11).map((patent, index) => (
          <PatentCard key={patent.id} patent={patent} index={index + 8} />
        ))}
      </div>

      {/* Synergy Footer */}
      <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-chart-1/10 border-primary/30">
        <CardContent className="p-2.5">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-full bg-primary/20">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-xs text-foreground">Portfolio Synergy</h3>
              <p className="text-[10px] text-muted-foreground">
                Interlocking IP across prediction, workflow, staffing, quality, surveillance, and trials —
                competitors cannot replicate any single layer without infringing the others.
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{PATENTS_FILED_COUNT}x</div>
              <div className="text-[9px] text-muted-foreground">IP Barrier</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/* ── Compact Patent Card ── */
const PatentCard = ({ patent, index }: { patent: PatentEntry; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.15 + index * 0.04 }}
  >
    <Card className="h-full bg-background/50 border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-2.5 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={patent.color}>{patent.icon}</div>
            <span className="text-[10px] font-mono text-muted-foreground">#{patent.number}</span>
          </div>
          <div className="flex items-center gap-1">
            {patent.validated && (
              <Badge variant="outline" className="text-[8px] px-1 py-0 border-risk-low/50 text-risk-low bg-risk-low/10">
                Validated
              </Badge>
            )}
            <Badge variant="outline" className="text-[8px] px-1 py-0 border-primary/40 text-primary bg-primary/5">
              Filed
            </Badge>
          </div>
        </div>
        <p className="text-[11px] font-semibold text-foreground leading-tight truncate">{patent.name}</p>
        <p className="text-[9px] text-muted-foreground leading-snug line-clamp-2">{patent.tagline}</p>
        <p className="text-[8px] text-muted-foreground/60">{patent.filingDate}</p>
      </CardContent>
    </Card>
  </motion.div>
);
