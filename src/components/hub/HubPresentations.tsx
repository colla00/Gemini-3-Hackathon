import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

const CopyBlock = ({ title, text }: { title: string; text: string }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => { e.stopPropagation(); navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="rounded-xl border border-white/10" style={{ background: '#151f35' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-5 py-4 text-left">
        {open ? <ChevronDown className="w-4 h-4 text-white/50 shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />}
        <span className="text-sm font-semibold text-white">{title}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 relative">
          <button onClick={copy} className="absolute top-0 right-5 p-1 rounded hover:bg-white/10 transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40" />}
          </button>
          <pre className="whitespace-pre-wrap text-xs text-white/60 font-mono pr-8">{text}</pre>
        </div>
      )}
    </div>
  );
};

const EventCard = ({ badge, badgeColor, title, children }: {
  badge: string; badgeColor: string; title: string; children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-white/10 p-5 space-y-2" style={{ background: '#151f35' }}>
    <div className="flex items-start gap-3">
      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor}`}>{badge}</span>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
    <div className="text-sm text-white/70 leading-relaxed space-y-1 pl-0 md:pl-[60px]">{children}</div>
  </div>
);

const HubPresentations = () => (
  <div className="space-y-8">
    <h1 className="text-2xl md:text-3xl font-bold text-white">Speaking & Conference Presentations</h1>

    <div className="space-y-4">
      <h2 className="text-xs font-semibold tracking-wider text-white/40 uppercase">Upcoming</h2>
      <EventCard badge="UPCOMING" badgeColor="bg-green-500/20 text-green-400" title="ANIA 2026 — Invited Webinar">
        <p>Format: <T>Webinar (Virtual)</T></p>
        <p>Title: "Human-Centered AI to Reduce Nursing Workload: Two-Stage Validation of a Documentation Burden Score"</p>
        <p>System: DBS (Patent #1) — <T>28,362</T> patients, <T>172</T> hospitals, AUROC <T>0.758</T></p>
        <p>IRB: <T>Approved</T></p>
        <p>Prep: Finalize webinar slides, test virtual platform</p>
      </EventCard>

      <h2 className="text-xs font-semibold tracking-wider text-white/40 uppercase pt-4">Completed</h2>
      <EventCard badge="DONE" badgeColor="bg-white/10 text-white/40" title="Stanford AI+Health 2025">
        <p>December 2025 — Research findings presented</p>
      </EventCard>
      <EventCard badge="DONE" badgeColor="bg-white/10 text-white/40" title="SIIM 2025">
        <p>Society for Imaging Informatics in Medicine annual meeting</p>
      </EventCard>

      <h2 className="text-xs font-semibold tracking-wider text-white/40 uppercase pt-4">Submitted / Pending</h2>
      <EventCard badge="PENDING" badgeColor="bg-yellow-500/20 text-yellow-400" title="AMIA 2026 Annual Symposium">
        <p>Abstract submitted <T>March 10 2026</T></p>
      </EventCard>
      <EventCard badge="PENDING" badgeColor="bg-yellow-500/20 text-yellow-400" title="ML for Healthcare 2026">
        <p>Deadline: <T>April 17 2026</T> (mlforhc.org)</p>
      </EventCard>
      <EventCard badge="PENDING" badgeColor="bg-yellow-500/20 text-yellow-400" title="MIT-MGB AI Cures">
        <p>Form: forms.gle/DycAq3caLkZwizXz8</p>
      </EventCard>
    </div>

    <CopyBlock
      title="🎤 Elevator Pitch (copy-paste ready)"
      text={`I'm Dr. Alexis Collier, founder of VitaSignal LLC. We've developed a clinical AI platform that predicts ICU mortality and nursing documentation burden using nothing but the timing patterns of routine EHR documentation — no sensors, no wearables, no additional equipment. We've validated our systems across two studies: the Intensive Documentation Index on 65,157 patients in MIMIC-IV and HiRID, and the Documentation Burden Score on 28,362 patients across 172 hospitals in the eICU database. The insight is simple: when a patient deteriorates, nurses document more frequently and more erratically. That behavioral signature appears in the EHR hours before vital signs change. We've built 11 patent-pending systems around that insight. We're NIH-funded, pre-market, and currently seeking licensing partners and a $3–5M seed round.`}
    />
  </div>
);

export default HubPresentations;
