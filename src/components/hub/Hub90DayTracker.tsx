import { useState } from 'react';
import { Target, Calendar, AlertTriangle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

type Priority = {
  id: string;
  title: string;
  deadline: string;
  deadlineDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk';
  description: string;
  milestones: { label: string; done: boolean }[];
  impact: string;
};

const PRIORITIES: Priority[] = [
  {
    id: 'strategic-decision',
    title: '1. Make the Fundamental Strategic Decision',
    deadline: 'April 2026',
    deadlineDate: '2026-04-30',
    status: 'in_progress',
    description: 'Is VitaSignal a product company or a research/IP licensing company? This determines every subsequent decision about resource allocation.',
    milestones: [
      { label: 'Draft decision framework (product vs. IP licensing)', done: false },
      { label: 'Analyze market entry costs for each path', done: false },
      { label: 'Make final strategic decision', done: false },
    ],
    impact: 'Determines all downstream resource allocation and hiring decisions',
  },
  {
    id: 'pilot-customer',
    title: '2. Secure One Pilot Customer Conversation',
    deadline: 'April 15, 2026',
    deadlineDate: '2026-04-15',
    status: 'not_started',
    description: 'Hospital IT leader or quality officer willing to discuss actual deployment — not research collaboration, actual "would you pay for this" discussion.',
    milestones: [
      { label: 'Identify 5 target hospital contacts', done: false },
      { label: 'Prepare pilot-ready demo presentation', done: false },
      { label: 'Send outreach emails / LinkedIn messages', done: false },
      { label: 'Schedule first discovery call', done: false },
    ],
    impact: 'Validates (or invalidates) willingness-to-pay assumption',
  },
  {
    id: 'research-validation',
    title: '3. Complete Research Validation',
    deadline: 'March 31, 2026',
    deadlineDate: '2026-03-31',
    status: 'in_progress',
    description: 'Convert "under review" credibility to "published" credibility. This is the foundation for every commercial conversation.',
    milestones: [
      { label: 'Resolve npj Digital Medicine amendment', done: false },
      { label: 'Upload GitHub repositories', done: false },
      { label: 'Obtain Zenodo DOIs', done: false },
      { label: 'Complete manuscript submissions', done: false },
      { label: 'OSF pre-registration (osf.io/ujgc6)', done: false },
    ],
    impact: 'Converts "in review" to "published" — essential for hospital trust',
  },
  {
    id: 'patent-conversion',
    title: '4. Address Patent Conversion Strategy',
    deadline: 'October 2026 (funding secured)',
    deadlineDate: '2026-10-31',
    status: 'in_progress',
    description: 'Prioritize 3-4 core patents for nonprovisional conversion. Cannot afford all 11. Need $20K-$30K by October 2026.',
    milestones: [
      { label: 'Complete attorney consultation', done: false },
      { label: 'Prioritize 3-4 core patents (IDI, DBS, CDS-EQUITY)', done: false },
      { label: 'Identify funding source for conversion fees', done: false },
      { label: 'Begin nonprovisional drafting for priority patents', done: false },
    ],
    impact: 'Protects competitive moat — failure means abandoning patents',
  },
];

const statusConfig = {
  not_started: { label: 'Not Started', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
  in_progress: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  completed: { label: 'Completed', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  at_risk: { label: 'At Risk', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

const Hub90DayTracker = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggleMilestone = (priorityId: string, milestoneIdx: number) => {
    const key = `${priorityId}-${milestoneIdx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getDaysRemaining = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date('2026-03-10');
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-7 h-7" style={{ color: '#00c8b4' }} />
          90-Day Critical Path
        </h1>
        <p className="text-sm text-white/60 mt-1">March 17 – June 17, 2026 · Updated March 17, 2026</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['not_started', 'in_progress', 'at_risk', 'completed'].map(status => {
          const config = statusConfig[status as keyof typeof statusConfig];
          const count = PRIORITIES.filter(p => p.status === status).length;
          return (
            <div key={status} className="rounded-xl border border-white/10 p-4 text-center" style={{ background: '#151f35' }}>
              <div className="text-2xl font-bold" style={{ color: config.color }}>{count}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 mt-1">{config.label}</div>
            </div>
          );
        })}
      </div>

      {/* Priority cards */}
      <div className="space-y-4">
        {PRIORITIES.map(priority => {
          const config = statusConfig[priority.status];
          const daysLeft = getDaysRemaining(priority.deadlineDate);
          const completedMilestones = priority.milestones.filter((_, i) => checked[`${priority.id}-${i}`]).length;
          const progress = priority.milestones.length > 0 ? (completedMilestones / priority.milestones.length) * 100 : 0;

          return (
            <div key={priority.id} className="rounded-xl border border-white/10 p-6 space-y-4" style={{ background: '#151f35' }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{priority.title}</h3>
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ color: config.color, background: config.bg }}
                  >
                    {config.label}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/50">
                    <Calendar className="w-3 h-3" />
                    {priority.deadline}
                    {daysLeft > 0 && daysLeft <= 30 && (
                      <span className="text-amber-400 font-medium ml-1">({daysLeft}d left)</span>
                    )}
                    {daysLeft <= 0 && (
                      <span className="text-red-400 font-medium ml-1">(overdue)</span>
                    )}
                  </span>
                </div>
              </div>

              <p className="text-sm text-white/60 leading-relaxed">{priority.description}</p>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-white/40">
                  <span>Progress</span>
                  <span>{completedMilestones}/{priority.milestones.length} milestones</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, background: '#00c8b4' }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                {priority.milestones.map((milestone, i) => {
                  const key = `${priority.id}-${i}`;
                  const isDone = checked[key];
                  return (
                    <label key={i} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleMilestone(priority.id, i)}>
                      <div className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                        isDone ? 'bg-[#00c8b4] border-[#00c8b4]' : 'border-white/20 group-hover:border-white/40'
                      }`}>
                        {isDone && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-sm ${isDone ? 'text-white/30 line-through' : 'text-white/70'}`}>{milestone.label}</span>
                    </label>
                  );
                })}
              </div>

              {/* Impact */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#00c8b4' }} />
                <span className="text-xs text-white/50"><span className="text-white/70 font-medium">Impact:</span> {priority.impact}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision framework */}
      <div className="rounded-xl border border-white/10 p-6 space-y-4" style={{ background: '#151f35' }}>
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">The Critical Question</h3>
        <p className="text-sm text-white/80 leading-relaxed">
          Are you willing to stop being a researcher and start being a CEO? This means saying <strong className="text-white">no</strong> to more papers and <strong className="text-white">yes</strong> to customer conversations, hiring people who can execute what you cannot, and accepting that published research ≠ viable business.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Commercial Success', prob: '30%', color: '#10b981' },
            { label: 'IP/Consulting Business', prob: '40%', color: '#f59e0b' },
            { label: 'Remains Research', prob: '30%', color: '#ef4444' },
          ].map(s => (
            <div key={s.label} className="rounded-lg border border-white/10 p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.prob}</div>
              <div className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hub90DayTracker;
