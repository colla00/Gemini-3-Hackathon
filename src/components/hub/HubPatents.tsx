import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

const patents = [
  { n: 1, no: '63/932,953', nick: 'CRIS-E', title: 'Clinical Risk Intelligence System – Equity Edition', np: 'Dec 6 2026', p: 'CRITICAL', notes: 'Brief attorney immediately' },
  { n: 2, no: '63/946,187', nick: 'CDS-EQUITY', title: 'Equitable Clinical Decision Support System', np: 'Dec 21 2026', p: 'CRITICAL', notes: 'Bundle decision pending' },
  { n: 3, no: '63/966,099', nick: 'DBS-v2', title: 'Documentation Burden Score v2', np: 'Jan 22 2027', p: 'HIGH', notes: '' },
  { n: 4, no: '63/966,117', nick: 'UNIP', title: 'Unified Nursing Intelligence Platform', np: 'Jan 22 2027', p: 'HIGH', notes: 'Bundle with #2?' },
  { n: 5, no: '63/976,293', nick: 'IDI', title: 'Intensive Documentation Index', np: 'Feb 5 2027', p: 'STANDARD', notes: 'Core paper patent' },
  { n: 6, no: '63/995,920', nick: 'TRACI', title: 'Temporal Risk Assessment with Contextual Intelligence', np: 'Mar 4 2027', p: 'STANDARD', notes: 'Bundle group Q-2' },
  { n: 7, no: '63/995,921', nick: 'ESDBI', title: 'EHR-Based Staffing and Documentation Burden Index', np: 'Mar 4 2027', p: 'STANDARD', notes: 'Bundle group Q-2' },
  { n: 8, no: '63/995,922', nick: 'SHQS', title: 'Surveillance-Based Healthcare Quality Score', np: 'Mar 4 2027', p: 'STANDARD', notes: 'Bundle group Q-2' },
  { n: 9, no: '63/995,923', nick: 'DTBL', title: 'Digital Twin Baseline Learning', np: 'Mar 4 2027', p: 'STANDARD', notes: 'Bundle group Q-2' },
  { n: 10, no: '63/995,924', nick: 'CTCI', title: 'Clinical Trial Cohort Intelligence', np: 'Mar 4 2027', p: 'STANDARD', notes: 'Bundle group Q-2' },
  { n: 11, no: '63/995,925', nick: 'SEDR', title: 'Syndromic Early Detection and Response', np: 'Mar 4 2027', p: 'STANDARD', notes: 'Bundle group Q-2' },
];

const prColor = (p: string) => p === 'CRITICAL' ? 'text-red-400' : p === 'HIGH' ? 'text-orange-400' : 'text-yellow-400';
const prDot = (p: string) => p === 'CRITICAL' ? '🔴' : p === 'HIGH' ? '🟠' : '🟡';

const Expandable = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10" style={{ background: '#151f35' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-5 py-4 text-left">
        {open ? <ChevronDown className="w-4 h-4 text-white/50 shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />}
        <span className="text-sm font-semibold text-white">{title}</span>
      </button>
      {open && <div className="px-5 pb-5 text-sm text-white/70 leading-relaxed space-y-2">{children}</div>}
    </div>
  );
};

const HubPatents = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white">Patent Portfolio — <T>11</T> U.S. Provisional Applications</h1>
      <p className="text-sm text-white/50 mt-1">Sole Inventor: Dr. Alexis Collier, DHA · Filing Period: Dec 2025 – Feb 2026 · Total Claims: <T>175+</T></p>
    </div>

    <div className="overflow-x-auto rounded-xl border border-white/10" style={{ background: '#151f35' }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/40 text-xs">
            <th className="px-3 py-3 text-left">#</th>
            <th className="px-3 py-3 text-left">USPTO No.</th>
            <th className="px-3 py-3 text-left">Nickname</th>
            <th className="px-3 py-3 text-left hidden lg:table-cell">Full Title</th>
            <th className="px-3 py-3 text-left">NP Deadline</th>
            <th className="px-3 py-3 text-left">Priority</th>
            <th className="px-3 py-3 text-left hidden md:table-cell">Notes</th>
          </tr>
        </thead>
        <tbody>
          {patents.map(p => (
            <tr key={p.n} className="border-b border-white/5 hover:bg-white/5">
              <td className="px-3 py-2.5 text-white/60">{p.n}</td>
              <td className="px-3 py-2.5 font-mono text-xs" style={{ color: '#00c8b4' }}>{p.no}</td>
              <td className="px-3 py-2.5 font-semibold text-white">{p.nick}</td>
              <td className="px-3 py-2.5 text-white/60 hidden lg:table-cell">{p.title}</td>
              <td className="px-3 py-2.5 text-white/80">{p.np}</td>
              <td className={`px-3 py-2.5 font-medium ${prColor(p.p)}`}>{prDot(p.p)} {p.p}</td>
              <td className="px-3 py-2.5 text-white/40 hidden md:table-cell">{p.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="space-y-3">
      <Expandable title="Patent #5 / IDI (USPTO 63/976,293) — Validated">
        <p><strong>Core innovation:</strong> 9 temporal features from EHR nursing documentation timestamps predicting ICU mortality</p>
        <p><strong>Features:</strong> idi_events_24h, idi_events_per_hour, idi_max_gap_min, idi_gap_count_60m, idi_gap_count_120m, idi_mean_interevent_min, idi_std_interevent_min, idi_cv_interevent, idi_burstiness</p>
        <p><strong>Key finding:</strong> idi_cv_interevent is strongest predictor (OR <T>1.53</T> per SD, p&lt;0.001) — documentation rhythm irregularity, not volume</p>
        <p><strong>Validation:</strong> <T>26,153</T> MIMIC-IV heart failure patients (2008–2019) · Temporal validation (train 2008–2018, test 2019)</p>
        <p><strong>AUC:</strong> <T>0.658</T> baseline → <T>0.683</T> IDI-enhanced (+0.025, p&lt;0.05 DeLong test)</p>
        <p><strong>12-year LOYO:</strong> mean AUC <T>0.684</T> (SD 0.008)</p>
        <p><strong>Equity:</strong> Consistent across race/ethnicity (AUC range 0.673–0.691, no bias, p=0.82 interaction)</p>
        <p><strong>Three mechanisms:</strong> Surveillance Intensity · Cognitive Load · Surveillance Gaps Hypothesis</p>
        <p><strong>Published:</strong> medRxiv DOI 10.64898/2026.02.10.26345827v2</p>
      </Expandable>
      <Expandable title="Patent #1 / DBS (Documentation Burden Score) — Validated">
        <p><strong>Core innovation:</strong> ML-powered documentation burden quantification and prediction</p>
        <p><strong>External validation:</strong> <T>28,362</T> patients across <T>172</T> hospitals (eICU)</p>
        <p><strong>AUROC:</strong> <T>0.758</T> · NPV: 0.947 / 0.924</p>
        <p><strong>Clinical use:</strong> Quartile-based staffing recommendations before each nursing shift</p>
        <p><strong>ANIA 2026:</strong> "Human-Centered AI to Reduce Nursing Workload: Two-Stage Validation of a Documentation Burden Score"</p>
      </Expandable>
      <Expandable title="HiRID Validation — External Cohort">
        <p><strong>Cohort:</strong> HiRID database (n=<T>33,897</T>)</p>
        <p><strong>AUROC:</strong> <T>0.9063</T> — outperforms APACHE IV, SOFA</p>
        <p><strong>Significance:</strong> Zero physiological data required — only EHR documentation timestamps</p>
      </Expandable>
    </div>

    <Expandable title="🎤 Key Talking Points for Presentations">
      <ul className="list-disc pl-5 space-y-2">
        <li>"We predict ICU mortality from nothing but the RHYTHM of nursing documentation — not vital signs, not labs, not any additional equipment."</li>
        <li>"When a patient is deteriorating, nurses instinctively document more frequently and more erratically. That behavior leaves a timestamp signature in the EHR — 4–6 hours before vitals change."</li>
        <li>"We've validated this in 357,000+ patients across MIMIC-IV, HiRID, and eICU — three different countries, 172 hospitals."</li>
        <li>"Our strongest predictor is the coefficient of variation of inter-event intervals — essentially, how irregular the rhythm of documentation is. An OR of 1.53 per SD."</li>
        <li>"No hardware. No sensors. No additional workflow. Any hospital that has nurses and an EHR already has everything our system needs."</li>
        <li>"We filed 11 provisional patents. The foundational system is the IDI — USPTO 63/976,293. The NP deadline for our two most critical patents is December 2026."</li>
        <li>"FDA classification: non-device CDS under §520(o)(1)(E) — we don't require 510(k) clearance."</li>
        <li>"NIH-funded research: Award 1OT2OD032581, AIM-AHEAD CLINAQ Fellowship at Morehouse School of Medicine."</li>
      </ul>
    </Expandable>
  </div>
);

export default HubPatents;
