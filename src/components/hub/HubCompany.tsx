import { useState } from 'react';

const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: '#151f35' }}>
    <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">{title}</h3>
    <div className="text-sm text-white/80 leading-relaxed space-y-1">{children}</div>
  </div>
);

const pendingItems = [
  'Open LLC bank account (ASAP — blocks patent assignment)',
  'Engage patent attorney (deadline Mar 10 2026)',
  'Execute patent assignment Exhibit A (all 11 apps → VitaSignal LLC) — requires bank + attorney',
  'Finalize Operating Agreement v2.0 (Q2 2026)',
  'File USPTO trademarks: VitaSignal™, IDI™, DBS™ (Q3 2026)',
  'Obtain D-U-N-S number',
  'Verify SAM.gov registration',
  'OSF pre-registration (osf.io/ujgc6)',
  'ClinicalTrials.gov registration',
  'Draft HIPAA BAA',
  'Draft FDA pre-submission request',
];

const HubCompany = () => {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white">VitaSignal LLC — Company Information</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Entity">
          <p>Legal name: <strong className="text-white">VitaSignal LLC</strong></p>
          <p>EIN: <span className="font-mono text-white/40">●●–●●●●●●●</span></p>
          <p>Domain: <T>vitasignal.ai</T></p>
          <p>Public email: info@vitasignal.ai</p>
          <p>Author/contact: info@vitasignal.ai</p>
          <p>Operating Agreement: v1.0 filed · v2.0 pending (Q2 2026)</p>
          <p>990-N: Filed</p>
          <p>FDA: Non-device CDS under §520(o)(1)(E) — exempt from 510(k)</p>
          <p>Status: <strong className="text-white">Pre-market research prototype</strong></p>
        </InfoCard>

        <InfoCard title="Financial Projections">
          <div className="space-y-1">
            {[
              ['Seed ask', '$3–5M'],
              ['5-yr NPV', '$12M'],
              ['Year-5 ARR', '$32.5M'],
              ['Exit target', '$50–150M'],
              ['Savings/patient', '$2,847'],
              ['ROI', '1,240%'],
              ['Payback period', '7.5 months'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/5 py-1">
                <span className="text-white/40">{k}</span>
                <span className="font-semibold" style={{ color: '#00c8b4' }}>{v}</span>
              </div>
            ))}
          </div>
        </InfoCard>
      </div>

      <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: '#151f35' }}>
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">Pending Items</h3>
        <div className="space-y-2">
          {pendingItems.map((item, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggle(i)}>
              <div className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                checked[i] ? 'bg-[#00c8b4] border-[#00c8b4]' : 'border-white/20 group-hover:border-white/40'
              }`}>
                {checked[i] && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className={`text-sm ${checked[i] ? 'text-white/30 line-through' : 'text-white/70'}`}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      <InfoCard title="IP Clinic Outreach">
        <p>Georgia PATENTS (gapatents.org) — Applied ✅</p>
        <p>GWU IP Clinic (iptl_uspto_intake@law.gwu.edu) — Emailed ✅</p>
        <p>Howard IP Clinic (howardpatentipclinic@gmail.com) — Emailed ✅</p>
        <p>USPTO 2020–2025 Clinic Expansion — Closed (form obsolete)</p>
      </InfoCard>
    </div>
  );
};

export default HubCompany;
