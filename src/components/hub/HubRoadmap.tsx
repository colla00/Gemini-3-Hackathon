import { useState } from 'react';
import { Rocket, Target, TrendingUp, Users, Shield, FileCheck, DollarSign, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

type GapData = {
  id: string;
  title: string;
  icon: React.ElementType;
  current: number;
  target: number;
  status: string;
  color: string;
  actions: string[];
  keyMetric: string;
};

const GAPS: GapData[] = [
  {
    id: 'commercial',
    title: 'Commercial Traction',
    icon: DollarSign,
    current: 2.0,
    target: 10.0,
    status: 'MOST CRITICAL',
    color: '#ef4444',
    actions: [
      '15 customer discovery interviews (Month 1-2)',
      'MVP demo build for hospital demos (Month 2-3)',
      'First pilot contract $25K-$50K (Month 3-4)',
      'Convert to annual contract $100K-$200K (Month 6)',
    ],
    keyMetric: 'One paying reference customer by Sep 2026',
  },
  {
    id: 'product',
    title: 'Product Deployment',
    icon: Rocket,
    current: 4.0,
    target: 9.5,
    status: 'HIGH',
    color: '#f59e0b',
    actions: [
      'MVP dashboard with simulated data streams (Month 1-3)',
      'Epic FHIR integration functional (Month 4-6)',
      'Production platform multi-hospital ready (Month 7-12)',
    ],
    keyMetric: 'Hospital-grade system with real-time inference',
  },
  {
    id: 'team',
    title: 'Team Building',
    icon: Users,
    current: 4.5,
    target: 9.5,
    status: 'HIGH',
    color: '#f59e0b',
    actions: [
      'Technical Co-Founder (Month 2-3, 15-25% equity)',
      'Clinical Operations Lead (Month 5-6, 3-5% equity)',
      'Lead ML Engineer (Month 8-9, post-funding)',
      'BD Lead (Month 10-12, post-funding)',
    ],
    keyMetric: '6-8 person team with clear role separation',
  },
  {
    id: 'ip',
    title: 'IP Protection',
    icon: Shield,
    current: 9.5,
    target: 10.0,
    status: 'ON TRACK',
    color: '#10b981',
    actions: [
      'Convert CRIS-E — Due Dec 6, 2026',
      'Convert CDS-EQUITY — Due Dec 21, 2026',
      'Convert IDI — Due Feb 5, 2027',
      'Select 1 workflow patent based on commercial traction',
    ],
    keyMetric: '$20K-$30K legal fees secured by Oct 2026',
  },
  {
    id: 'regulatory',
    title: 'Regulatory Pathway',
    icon: FileCheck,
    current: 5.0,
    target: 9.0,
    status: 'MODERATE',
    color: '#3b82f6',
    actions: [
      'FDA Pre-Submission (Q-Sub) by July 2026',
      'Complete HIPAA compliance documentation',
      'Prospective validation from pilot deployments',
      'Receive FDA guidance by October 2026',
    ],
    keyMetric: 'Clear CDS vs SaMD classification from FDA',
  },
];

const PHASES = [
  { name: 'Commercial Validation', months: '1-4', score: '8.0', investment: '$50K-$75K', color: '#ef4444', milestones: ['15 discovery interviews', 'Co-founder hired', 'MVP deployed', 'First pilot signed', 'Papers published'] },
  { name: 'Product Development', months: '3-6', score: '8.7', investment: '$100K-$150K', color: '#f59e0b', milestones: ['Pilot executed', 'FHIR integration', 'Clinical ops lead hired', 'Annual contract converted', 'Seed process initiated'] },
  { name: 'Scale Preparation', months: '6-9', score: '9.3', investment: '$2M-$2.5M', color: '#3b82f6', milestones: ['Seed round closed', '2-3 additional pilots', 'Core patents filed', 'FDA Q-Sub guidance', 'Team at 5-6 people'] },
  { name: 'Market Execution', months: '9-12', score: '10.0', investment: 'Included', color: '#10b981', milestones: ['$750K+ ARR', 'Production deployed', 'Reference customers', 'Series A prep', 'Path to $2M+ ARR'] },
];

const ScoreBar = ({ current, target, color }: { current: number; target: number; color: string }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(current / target) * 100}%`, background: color }} />
    </div>
    <span className="text-xs font-mono text-white/50 w-16 text-right">{current}/{target}</span>
  </div>
);

const HubRoadmap = () => {
  const [expandedGap, setExpandedGap] = useState<string | null>('commercial');

  const overallScore = 7.2;
  const targetScore = 10.0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-7 h-7" style={{ color: '#00c8b4' }} />
          Path to 10/10
        </h1>
        <p className="text-sm text-white/60 mt-1">12-Month Roadmap · Research Excellence → Market Leadership</p>
      </div>

      {/* Overall score */}
      <div className="rounded-xl border border-white/10 p-6" style={{ background: '#151f35' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-white/40 uppercase tracking-wider">Current Score</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-bold" style={{ color: '#00c8b4' }}>{overallScore}</span>
              <span className="text-lg text-white/30">/ {targetScore}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/40">Gap to close</div>
            <div className="text-2xl font-bold text-amber-400">{(targetScore - overallScore).toFixed(1)} pts</div>
            <div className="text-[10px] text-white/30">= $2.5M+ valuation increase</div>
          </div>
        </div>
        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${(overallScore / targetScore) * 100}%`, background: 'linear-gradient(90deg, #00c8b4, #00a89a)' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-white/30">
          <span>Pre-revenue research</span>
          <span>$3M-$5M valuation</span>
        </div>
      </div>

      {/* Five gaps */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold tracking-wider text-white/50 uppercase">Five Critical Gaps</h2>
        {GAPS.map(gap => {
          const Icon = gap.icon;
          const expanded = expandedGap === gap.id;
          return (
            <div key={gap.id} className="rounded-xl border border-white/10 overflow-hidden" style={{ background: '#151f35' }}>
              <button
                onClick={() => setExpandedGap(expanded ? null : gap.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" style={{ color: gap.color }} />
                  <span className="text-sm font-medium text-white">{gap.title}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ color: gap.color, background: `${gap.color}20` }}>
                    {gap.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white/40">{gap.current} → {gap.target}</span>
                  {expanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                </div>
              </button>
              {expanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                  <ScoreBar current={gap.current} target={gap.target} color={gap.color} />
                  <div className="space-y-1.5">
                    {gap.actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                        <span className="text-white/20 mt-0.5">→</span>
                        {action}
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-white/40 border-t border-white/5 pt-2">
                    <span className="font-medium" style={{ color: '#00c8b4' }}>Key metric:</span> {gap.keyMetric}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 12-month phases */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold tracking-wider text-white/50 uppercase">12-Month Roadmap Phases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PHASES.map((phase, idx) => (
            <div key={phase.name} className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: '#151f35' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: phase.color }}>
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-white">{phase.name}</span>
                </div>
                <span className="text-xs text-white/40">Mo {phase.months}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40">Score target</span>
                <span className="text-sm font-bold" style={{ color: phase.color }}>{phase.score}/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40">Investment</span>
                <span className="text-xs font-medium" style={{ color: '#00c8b4' }}>{phase.investment}</span>
              </div>
              <div className="space-y-1 border-t border-white/5 pt-2">
                {phase.milestones.map(m => (
                  <div key={m} className="text-[10px] text-white/50 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: phase.color }} />
                    {m}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Single most critical action */}
      <div className="rounded-xl border-2 p-6 space-y-3" style={{ borderColor: '#00c8b4', background: 'rgba(0,200,180,0.05)' }}>
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Rocket className="w-4 h-4" style={{ color: '#00c8b4' }} />
          The Single Most Critical Action
        </h3>
        <p className="text-base font-semibold" style={{ color: '#00c8b4' }}>
          Secure one paying pilot contract by June 30, 2026.
        </p>
        <p className="text-xs text-white/50 leading-relaxed">
          This unlocks everything: commercial validation → team recruitment → investor conversations → product discipline → reference customers. After that first commercial validation, funding, hiring, and partnerships all align around proven market demand.
        </p>
        <div className="flex items-center gap-2 text-[10px] text-white/30 border-t border-white/5 pt-3">
          <Calendar className="w-3 h-3" />
          <span>Success probability: <span className="text-emerald-400 font-medium">35-40%</span> with disciplined execution</span>
          <span className="mx-1">·</span>
          <span>Total capital needed: <span style={{ color: '#00c8b4' }}>$2.5M-$3.2M</span> over 12 months</span>
        </div>
      </div>
    </div>
  );
};

export default HubRoadmap;
