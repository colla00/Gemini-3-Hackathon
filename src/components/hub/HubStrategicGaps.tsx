import { AlertTriangle, TrendingUp, TrendingDown, Target, Users, DollarSign, Package, Shield } from 'lucide-react';

const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

const GapCard = ({ icon: Icon, title, severity, description, action }: {
  icon: React.ElementType;
  title: string;
  severity: 'critical' | 'high' | 'moderate';
  description: string;
  action: string;
}) => {
  const severityColors = {
    critical: { text: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'CRITICAL' },
    high: { text: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'HIGH' },
    moderate: { text: '#3b82f6', bg: 'rgba(59,130,246,0.15)', label: 'MODERATE' },
  };
  const s = severityColors[severity];

  return (
    <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: '#151f35' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: s.text }} />
          <h4 className="text-sm font-semibold text-white">{title}</h4>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: s.text, background: s.bg }}>
          {s.label}
        </span>
      </div>
      <p className="text-xs text-white/60 leading-relaxed">{description}</p>
      <div className="text-xs text-white/40 border-t border-white/5 pt-2">
        <span className="font-medium text-white/60">Next action:</span> {action}
      </div>
    </div>
  );
};

const HubStrategicGaps = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
        <AlertTriangle className="w-7 h-7 text-amber-400" />
        Strategic Gap Analysis
      </h1>
      <p className="text-sm text-white/60 mt-1">Honest assessment of critical gaps · March 2026</p>
    </div>

    {/* Position summary */}
    <div className="rounded-xl border border-white/10 p-6" style={{ background: '#151f35' }}>
      <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-4">Current Tier Classification</h3>
      <p className="text-sm text-white/80 leading-relaxed mb-4">
        "Top 20% of healthcare AI <span className="text-emerald-400 font-medium">research projects</span>, bottom 50% of actual healthcare AI <span className="text-amber-400 font-medium">companies</span>"
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-emerald-400"><TrendingUp className="w-3.5 h-3.5" /> Stronger Than</div>
          <ul className="text-xs text-white/50 space-y-1 pl-5">
            <li>Academic research that never leaves universities</li>
            <li>Single-algorithm startups with no external validation</li>
            <li>Companies ignoring algorithmic bias</li>
            <li>Founders without clinical credibility</li>
          </ul>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-red-400"><TrendingDown className="w-3.5 h-3.5" /> Weaker Than</div>
          <ul className="text-xs text-white/50 space-y-1 pl-5">
            <li>Funded startups (Viz.ai, Aidoc) with deployments</li>
            <li>Companies with revenue and proven WTP</li>
            <li>Teams with dedicated engineering/sales/clinical</li>
            <li>Startups past "founder-does-everything" phase</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Critical gaps */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GapCard
        icon={Package}
        title="No Deployable Product"
        severity="critical"
        description="If a hospital offered $500K to deploy VitaSignal next month, you could not fulfill that contract. Research code ≠ hospital-grade system. 6-12 months of engineering work needed."
        action="Build pilot-ready demo for customer discovery calls"
      />
      <GapCard
        icon={DollarSign}
        title="Zero Commercial Traction"
        severity="critical"
        description="No customers, pilots, contracts, or validated pricing. No sales pipeline. No proven willingness-to-pay. 40% of healthcare AI startups fail at this exact stage."
        action="Schedule first 'would you pay for this' conversation by April 15"
      />
      <GapCard
        icon={Users}
        title="Solo Founder Execution Risk"
        severity="high"
        description="Simultaneously CEO, CTO, PI, BD Lead, and Legal Counsel. Cannot execute 10 hospital deployments simultaneously. If you're unavailable, VitaSignal stops."
        action="Identify first hire — technical co-founder or part-time engineer"
      />
      <GapCard
        icon={Shield}
        title="December 2026 Patent Cliff"
        severity="high"
        description="Patent conversions required Dec 2026 – Mar 2027. Estimated cost: $15K-$30K+ in legal fees. Without additional funding, forced to abandon patents."
        action="Secure funding strategy for $20K-$30K by October 2026"
      />
    </div>

    {/* Scenario probabilities */}
    <div className="rounded-xl border border-white/10 p-6 space-y-4" style={{ background: '#151f35' }}>
      <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">Realistic Scenario Probabilities</h3>
      <div className="space-y-4">
        {[
          {
            label: 'Commercial Success',
            prob: 30,
            color: '#10b981',
            desc: 'Pilot deployments → seed funding → team → revenue by Q4 2026. 5-10 hospital customers, $500K-$1M ARR by 2027.',
            requires: 'Relentless commercial focus, one breakthrough partnership, successful team building',
          },
          {
            label: 'IP/Consulting Business',
            prob: 40,
            color: '#f59e0b',
            desc: 'Pivot to licensing IP and expert consulting. $100K-$300K annually as lifestyle business.',
            requires: 'Accept smaller scale, focus on IP monetization, maintain patent portfolio',
          },
          {
            label: 'Remains Research Project',
            prob: 30,
            color: '#ef4444',
            desc: 'Continue publishing papers and winning grants but never achieve commercial viability.',
            requires: 'Nothing — this is the default outcome without active commercialization push',
          },
        ].map(s => (
          <div key={s.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{s.label}</span>
              <span className="text-sm font-bold" style={{ color: s.color }}>{s.prob}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${s.prob}%`, background: s.color }} />
            </div>
            <p className="text-xs text-white/50">{s.desc}</p>
            <p className="text-[10px] text-white/30"><span className="text-white/50 font-medium">Requires:</span> {s.requires}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HubStrategicGaps;
