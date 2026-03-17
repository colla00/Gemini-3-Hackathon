const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

const StatusCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-white/10 p-5 space-y-2" style={{ background: '#151f35' }}>
    <h3 className="text-xs font-semibold tracking-wider text-white/60 uppercase">{title}</h3>
    <div className="text-sm text-white/85 leading-relaxed">{children}</div>
  </div>
);

const HubDashboard = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white">VitaSignal Command Center</h1>
      <p className="text-sm text-white/60 mt-1">Dr. Alexis Collier, DHA · Founder & CEO · Updated March 2026</p>
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
          ['HiRID AUROC', 'Under review — details under NDA'],
          ['IDI strongest predictor', 'idi_cv_interevent (OR 1.53/SD, p<0.001)'],
          ['IDI temporal features', '9'],
          ['Patents / Claims', '11 patents · 175+ total claims'],
          ['Financial projections', 'Available under NDA'],
          ['Seed ask', '$3–5M'],
          ['Author email', 'info@vitasignal.ai'],
          ['Author email', 'info@vitasignal.ai'],
          ['Licensing', 'info@vitasignal.ai'],
          ['NIH Award', '1OT2OD032581'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-1 border-b border-white/5">
            <span className="text-white/60">{k}</span>
            <span className="font-medium" style={{ color: '#00c8b4' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Strategic Position Summary */}
    <div className="rounded-xl border border-amber-500/20 p-6 space-y-4" style={{ background: 'rgba(245,158,11,0.05)' }}>
      <h2 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
        ⚠️ Strategic Position (March 2026)
      </h2>
      <p className="text-xs text-white/60 leading-relaxed">
        "Top 20% of healthcare AI <span className="text-emerald-400">research projects</span>, bottom 50% of actual healthcare AI <span className="text-amber-400">companies</span>."
        The gap is execution, not science.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: 'Product', status: 'Not deployable', color: '#ef4444' },
          { label: 'Revenue', status: 'Zero', color: '#ef4444' },
          { label: 'Team', status: 'Solo founder', color: '#f59e0b' },
          { label: 'Patent Cliff', status: 'Dec 2026', color: '#f59e0b' },
        ].map(g => (
          <div key={g.label} className="rounded-lg border border-white/10 p-3 text-center" style={{ background: '#151f35' }}>
            <div className="text-[10px] text-white/40 uppercase tracking-wider">{g.label}</div>
            <div className="text-xs font-semibold mt-1" style={{ color: g.color }}>{g.status}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 text-[10px] text-white/40">
        <span>Commercial Success: <span className="text-emerald-400 font-medium">30%</span></span>
        <span>·</span>
        <span>IP/Consulting: <span className="text-amber-400 font-medium">40%</span></span>
        <span>·</span>
        <span>Remains Research: <span className="text-red-400 font-medium">30%</span></span>
      </div>
    </div>
  </div>
);

export default HubDashboard;
