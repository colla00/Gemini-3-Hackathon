import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

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

const CopyBlock = ({ title, text }: { title: string; text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <Expandable title={title}>
      <div className="relative">
        <button onClick={copy} className="absolute top-0 right-0 p-1 rounded hover:bg-white/10 transition-colors">
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40" />}
        </button>
        <pre className="whitespace-pre-wrap text-xs text-white/60 font-mono pr-8">{text}</pre>
      </div>
    </Expandable>
  );
};

const PaperCard = ({ status, statusColor, title, system, children }: {
  status: string; statusColor: string; title: string; system: string; children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: '#151f35' }}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-xs text-white/40 mt-0.5">System: {system}</p>
      </div>
      <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded ${statusColor}`}>{status}</span>
    </div>
    <div className="text-sm text-white/70 leading-relaxed space-y-1">{children}</div>
  </div>
);

const HubManuscripts = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white">Research Papers & Manuscripts</h1>
    </div>

    <div className="space-y-4">
      <PaperCard status="🔵 Submission Ready" statusColor="bg-blue-500/20 text-blue-400" title="Paper 1 — JAMIA" system="IDI — Intensive Documentation Index">
        <p><strong>Dataset:</strong> MIMIC-IV (N=<T>26,153</T> heart failure ICU admissions, 2008–2019)</p>
        <p><strong>Key result:</strong> AUC <T>0.658 → 0.683</T> (+0.025, p&lt;0.05) · 12-year temporal validation</p>
        <p><strong>Preprint:</strong> DOI <T>10.64898/2026.02.10.26345827v2</T> · medRxiv</p>
        <p><strong>Author:</strong> Alexis Collier, DHA · alexis.collier@ung.edu</p>
        <p><strong>COI:</strong> USPTO 63/976,293 · NIH 1OT2OD032581 · Bayh-Dole · VitaSignal LLC</p>
        <p><strong>Data:</strong> MIMIC-IV v2.2 — physionet.org/content/mimiciv/2.2/</p>
        <p><strong>IRB:</strong> Protocol #2025-IRB-0142 (exemption determination)</p>
      </PaperCard>

      <PaperCard status="🔵 Submission Ready" statusColor="bg-blue-500/20 text-blue-400" title="Paper 2 — npj Digital Medicine" system="DBS + HiRID External Validation">
        <p><strong>Dataset:</strong> MIMIC-IV (N=<T>26,153</T>) + HiRID (N=<T>33,897</T>) · 80/20 split</p>
        <p><strong>Key results:</strong> AUROC <T>0.802/0.683</T> MIMIC-IV · AUROC <T>0.9063</T> HiRID · Outperforms APACHE IV, SOFA</p>
        <p><strong>Author:</strong> Alexis Collier, DHA · alexis.collier@ung.edu</p>
        <p><strong>Data:</strong> HiRID — physionet.org/content/hirid/1.1.1/</p>
      </PaperCard>

      <PaperCard status="🟡 In Progress" statusColor="bg-yellow-500/20 text-yellow-400" title="Paper 3 — JAMA Network Open" system="DBS External Validation — 172 Hospitals">
        <p><strong>Dataset:</strong> eICU (N=<T>28,362</T> · <T>172</T> hospitals)</p>
        <p><strong>Key results:</strong> AUROC <T>0.758</T> · NPV 0.947/0.924</p>
        <p><strong>Contact:</strong> Sophia Shalhout — sophia_shalhout@meei.harvard.edu</p>
        <p><strong>Due dates:</strong> Sophia edits due <T>March 21</T> · Race/ethnicity compliance due <T>March 31</T></p>
      </PaperCard>

      <div className="rounded-xl border border-white/10 p-5" style={{ background: '#151f35' }}>
        <h3 className="text-base font-semibold text-white mb-2">Preprint — medRxiv / ESDBI</h3>
        <p className="text-sm text-white/70">DOI: <T>10.64898/2026.02.10.26345827v2</T></p>
        <p className="text-sm text-white/70">Version: v2 (corrected affiliation: University of North Georgia; NIH disclaimer added)</p>
        <p className="text-sm text-white/70">Note: ESDBI mentioned — cite decision pending</p>
      </div>
    </div>

    <div className="space-y-3">
      <CopyBlock
        title="📋 COI Block Template (copy-paste ready)"
        text={`Dr. Collier is the Founder and CEO of VitaSignal LLC. Dr. Collier has filed 11 U.S. provisional patent applications related to methods described in this work, including USPTO Application Nos. 63/932,953, 63/946,187, 63/966,099, 63/966,117, 63/976,293, 63/995,920, 63/995,921, 63/995,922, 63/995,923, 63/995,924, and 63/995,925. This research was supported in part by the National Institutes of Health (NIH) Agreement No. 1OT2OD032581. The U.S. Government retains certain rights under the Bayh-Dole Act. No other conflicts of interest are declared.`}
      />
      <CopyBlock
        title="📋 Funding Statement Template (copy-paste ready)"
        text={`This work was supported by the CLINAQ Fellowship, National Institutes of Health (Dr. Collier). This research was, in part, funded by the National Institutes of Health (NIH) Agreement No. 1OT2OD032581. The views and conclusions contained in this document are those of the authors and should not be interpreted as representing the official policies, either expressed or implied, of the NIH. Funders had no role in study design, analysis, manuscript preparation, or publication decisions.`}
      />
    </div>
  </div>
);

export default HubManuscripts;
