const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

const StatusCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-white/10 p-5 space-y-2" style={{ background: '#151f35' }}>
    <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">{title}</h3>
    <div className="text-sm text-white/80 leading-relaxed">{children}</div>
  </div>
);

const HubDashboard = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white">VitaSignal Command Center</h1>
      <p className="text-sm text-white/50 mt-1">Dr. Alexis Collier, DHA · Founder & CEO · Updated March 2026</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <StatusCard title="Patents">
        <T>11</T> Provisional Applications Filed · Dec 2025 – Feb 2026<br />
        Next NP Deadline: <T>Dec 6 2026</T> (63/932,953)
      </StatusCard>
      <StatusCard title="Manuscripts">
        <T>3</T> Papers in Progress · JAMIA · npj Digital Medicine · JAMA Network Open<br />
        Preprint: DOI <T>10.64898/2026.02.10.26345827</T>
      </StatusCard>
      <StatusCard title="Funding">
        NIH Award <T>1OT2OD032581</T><br />
        CLINAQ Fellowship · Morehouse School of Medicine
      </StatusCard>
      <StatusCard title="Company">
        VitaSignal LLC · EIN on file<br />
        <T>vitasignal.ai</T> · info@vitasignal.ai
      </StatusCard>
      <StatusCard title="Events">
        ANIA 2026 — Boston MA — <T>March 26–28, 2026</T><br />
        Stanford AI+Health 2025 ✅ · SIIM 2025 ✅
      </StatusCard>
    </div>

    <div className="rounded-xl border border-white/10 p-6" style={{ background: '#151f35' }}>
      <h2 className="text-sm font-semibold text-white mb-4">Quick Reference</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-sm text-white/70">
        {[
          ['Total patients validated', '357,080'],
          ['IDI cohort (Paper 1)', '26,153 (MIMIC-IV HF, 2008–2019)'],
          ['Full IDI validation cohort', '65,157 (MIMIC-IV + HiRID)'],
          ['DBS cohort (Paper 2)', '28,362 patients · 172 hospitals (eICU)'],
          ['IDI AUC baseline → enhanced', '0.658 → 0.683 (Δ+0.025, p<0.05)'],
          ['DBS AUROC', '0.758 (NPV 0.947/0.924)'],
          ['HiRID AUROC', '0.9063'],
          ['IDI strongest predictor', 'idi_cv_interevent (OR 1.53/SD, p<0.001)'],
          ['IDI temporal features', '9'],
          ['Patents / Claims', '11 patents · 175+ total claims'],
          ['5-yr NPV', '$12M'],
          ['Year-5 ARR', '$32.5M'],
          ['Seed ask', '$3–5M'],
          ['Exit target', '$50–150M'],
          ['Savings/patient', '$2,847'],
          ['ROI', '1,240%'],
          ['Payback period', '7.5 months'],
          ['Author email', 'alexis.collier@ung.edu'],
          ['Licensing', 'info@vitasignal.ai'],
          ['NIH Award', '1OT2OD032581'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/40">{k}</span>
            <span className="font-medium" style={{ color: '#00c8b4' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HubDashboard;
