import { Shield, Calendar, DollarSign, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

type PatentConversion = {
  patentNumber: string;
  nickname: string;
  filingDate: string;
  npDeadline: string;
  priority: 'critical' | 'high' | 'medium';
  estimatedCost: { low: number; high: number };
  rationale: string;
  status: 'not_started' | 'attorney_review' | 'drafting' | 'filed';
};

const CONVERSIONS: PatentConversion[] = [
  {
    patentNumber: '63/932,953',
    nickname: 'CRIS-E (ICU Mortality)',
    filingDate: 'Dec 6, 2024',
    npDeadline: 'Dec 6, 2026',
    priority: 'critical',
    estimatedCost: { low: 5000, high: 8000 },
    rationale: 'Foundational patent — core mortality prediction system. First deadline. Must file.',
    status: 'not_started',
  },
  {
    patentNumber: '63/946,187',
    nickname: 'CDS-EQUITY (Fairness Monitor)',
    filingDate: 'Dec 21, 2024',
    npDeadline: 'Dec 21, 2026',
    priority: 'critical',
    estimatedCost: { low: 5000, high: 8000 },
    rationale: 'Core differentiator — no competitor has fairness-preserving clinical AI. CMS compliance angle.',
    status: 'not_started',
  },
  {
    patentNumber: '63/976,293',
    nickname: 'IDI (Temporal Features)',
    filingDate: 'Feb 5, 2025',
    npDeadline: 'Feb 5, 2027',
    priority: 'high',
    estimatedCost: { low: 5000, high: 8000 },
    rationale: 'Foundational algorithm patent. Protects the equipment-independent methodology.',
    status: 'not_started',
  },
  {
    patentNumber: 'TBD',
    nickname: 'DBS or UNIP (Workflow)',
    filingDate: 'TBD',
    npDeadline: 'TBD (Feb-Mar 2027)',
    priority: 'medium',
    estimatedCost: { low: 5000, high: 8000 },
    rationale: 'Choose based on commercial traction — whichever wedge product gains pilot interest.',
    status: 'not_started',
  },
];

const statusConfig = {
  not_started: { label: 'Not Started', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
  attorney_review: { label: 'Attorney Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  drafting: { label: 'Drafting', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  filed: { label: 'Filed', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
};

const priorityConfig = {
  critical: { label: 'CRITICAL', color: '#ef4444' },
  high: { label: 'HIGH', color: '#f59e0b' },
  medium: { label: 'MEDIUM', color: '#3b82f6' },
};

const getDaysUntil = (dateStr: string) => {
  if (dateStr === 'TBD' || dateStr.includes('TBD')) return null;
  const parts = dateStr.replace(',', '').split(' ');
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const target = new Date(parseInt(parts[2]), months[parts[0]], parseInt(parts[1]));
  const now = new Date('2026-03-10');
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const formatCurrency = (n: number) => `$${n.toLocaleString()}`;

const HubPatentConversion = () => {
  const totalCostLow = CONVERSIONS.reduce((sum, c) => sum + c.estimatedCost.low, 0);
  const totalCostHigh = CONVERSIONS.reduce((sum, c) => sum + c.estimatedCost.high, 0);
  const criticalCount = CONVERSIONS.filter(c => c.priority === 'critical').length;
  const filedCount = CONVERSIONS.filter(c => c.status === 'filed').length;

  // First deadline
  const firstDeadlineDays = getDaysUntil('Dec 6, 2026');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="w-7 h-7" style={{ color: '#00c8b4' }} />
          Patent Conversion Dashboard
        </h1>
        <p className="text-sm text-white/60 mt-1">3-4 core patents for nonprovisional filing · Micro-entity status</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/10 p-4 text-center" style={{ background: '#151f35' }}>
          <div className="text-2xl font-bold text-red-400">{firstDeadlineDays}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Days to First Deadline</div>
        </div>
        <div className="rounded-xl border border-white/10 p-4 text-center" style={{ background: '#151f35' }}>
          <div className="text-2xl font-bold" style={{ color: '#00c8b4' }}>{CONVERSIONS.length}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Patents to Convert</div>
        </div>
        <div className="rounded-xl border border-white/10 p-4 text-center" style={{ background: '#151f35' }}>
          <div className="text-2xl font-bold text-amber-400">{formatCurrency(totalCostLow)}-{formatCurrency(totalCostHigh)}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Estimated Total Cost</div>
        </div>
        <div className="rounded-xl border border-white/10 p-4 text-center" style={{ background: '#151f35' }}>
          <div className="text-2xl font-bold text-emerald-400">{filedCount}/{CONVERSIONS.length}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Filed</div>
        </div>
      </div>

      {/* Funding gap analysis */}
      <div className="rounded-xl border border-amber-500/20 p-5 space-y-3" style={{ background: 'rgba(245,158,11,0.05)' }}>
        <h3 className="text-xs font-semibold tracking-wider text-amber-400 uppercase flex items-center gap-2">
          <DollarSign className="w-3.5 h-3.5" /> Funding Gap Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[10px] text-white/40">Required by Oct 2026</div>
            <div className="text-lg font-bold text-amber-400">{formatCurrency(totalCostLow)} – {formatCurrency(totalCostHigh)}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/40">Potential Sources</div>
            <div className="text-xs text-white/60 space-y-1 mt-1">
              <div>• Pilot revenue ($25K-$50K)</div>
              <div>• IP clinic pro bono assistance</div>
              <div>• Pre-seed bridge funding</div>
              <div>• SBIR/STTR grant</div>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-white/40">Current Funding</div>
            <div className="text-lg font-bold text-red-400">$0</div>
            <div className="text-[10px] text-white/30 mt-1">Gap: {formatCurrency(totalCostLow)} – {formatCurrency(totalCostHigh)}</div>
          </div>
        </div>
      </div>

      {/* Individual patents */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold tracking-wider text-white/50 uppercase">Conversion Targets</h2>
        {CONVERSIONS.map(patent => {
          const days = getDaysUntil(patent.npDeadline);
          const pConfig = priorityConfig[patent.priority];
          const sConfig = statusConfig[patent.status];

          return (
            <div key={patent.patentNumber} className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: '#151f35' }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{patent.nickname}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color: pConfig.color, background: `${pConfig.color}20` }}>
                      {pConfig.label}
                    </span>
                  </div>
                  <div className="text-xs text-white/40 font-mono mt-0.5">{patent.patentNumber}</div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ color: sConfig.color, background: sConfig.bg }}>
                  {sConfig.label}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-white/40">Filed</div>
                  <div className="text-white/70">{patent.filingDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40">NP Deadline</div>
                  <div className="text-white/70 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {patent.npDeadline}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40">Days Remaining</div>
                  <div className={`font-bold ${days !== null && days < 120 ? 'text-red-400' : days !== null && days < 200 ? 'text-amber-400' : 'text-white/70'}`}>
                    {days !== null ? `${days} days` : 'TBD'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40">Estimated Cost</div>
                  <div style={{ color: '#00c8b4' }}>{formatCurrency(patent.estimatedCost.low)} – {formatCurrency(patent.estimatedCost.high)}</div>
                </div>
              </div>

              {/* Countdown bar */}
              {days !== null && (
                <div className="space-y-1">
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(0, Math.min(100, (1 - days / 365) * 100))}%`,
                        background: days < 120 ? '#ef4444' : days < 200 ? '#f59e0b' : '#10b981',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-white/30">
                    <span>Filed</span>
                    <span>Deadline</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-white/50 leading-relaxed border-t border-white/5 pt-2">
                <span className="font-medium text-white/60">Rationale:</span> {patent.rationale}
              </p>
            </div>
          );
        })}
      </div>

      {/* Action items */}
      <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: '#151f35' }}>
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">Immediate Actions</h3>
        <div className="space-y-2">
          {[
            { action: 'Complete patent attorney consultation', deadline: 'March 15, 2026', urgent: true },
            { action: 'Submit Georgia PATENTS IP clinic application follow-up', deadline: 'March 20, 2026', urgent: true },
            { action: 'Draft patent prioritization memo for attorney', deadline: 'March 31, 2026', urgent: false },
            { action: 'Identify SBIR/STTR grant opportunities for IP costs', deadline: 'April 15, 2026', urgent: false },
            { action: 'Secure funding commitment for $20K-$30K', deadline: 'October 2026', urgent: false },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-xs">
              {item.urgent ? (
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-400" />
              ) : (
                <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-white/30" />
              )}
              <div className="flex-1">
                <span className={item.urgent ? 'text-white/80 font-medium' : 'text-white/60'}>{item.action}</span>
                <span className="text-white/30 ml-2">— {item.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HubPatentConversion;
