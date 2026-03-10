import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

const CopyEmail = ({ label, email }: { label: string; email: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 group">
      <div>
        <p className="text-sm text-white/80">{label}</p>
        <p className="text-xs font-mono" style={{ color: '#00c8b4' }}>{email}</p>
      </div>
      <button onClick={copy} className="p-1.5 rounded hover:bg-white/15 transition-colors opacity-70 group-hover:opacity-100">
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/60" />}
      </button>
    </div>
  );
};

const LinkItem = ({ label, url }: { label: string; url: string }) => (
  <a href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer"
    className="flex items-center justify-between py-2 border-b border-white/5 group hover:bg-white/5 -mx-2 px-2 rounded">
    <div>
      <p className="text-sm text-white/80">{label}</p>
      <p className="text-xs text-white/30 font-mono">{url}</p>
    </div>
    <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 shrink-0" />
  </a>
);

const CopySnippet = ({ title, text }: { title: string; text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="rounded-xl border border-white/10 p-5" style={{ background: '#151f35' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">{title}</h3>
        <button onClick={copy} className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border border-white/10 hover:bg-white/10 transition-colors text-white/50">
          {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <pre className="text-xs text-white/60 font-mono whitespace-pre-wrap leading-relaxed">{text}</pre>
    </div>
  );
};

const HubContacts = () => (
  <div className="space-y-8">
    <h1 className="text-2xl md:text-3xl font-bold text-white">Contacts, Links & Quick Reference</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-white/10 p-5" style={{ background: '#151f35' }}>
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-3">Key Contacts</h3>
        <CopyEmail label="Dr. Alexis Collier" email="info@vitasignal.ai" />
        <CopyEmail label="VitaSignal Licensing" email="info@vitasignal.ai" />
        <div className="py-2">
          <p className="text-sm text-white/80">Georgia PATENTS</p>
          <p className="text-xs font-mono" style={{ color: '#00c8b4' }}>gapatents.org</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 p-5" style={{ background: '#151f35' }}>
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-3">Critical URLs</h3>
        <LinkItem label="VitaSignal" url="https://vitasignal.ai" />
        <LinkItem label="USPTO Patent Center" url="https://patentcenter.uspto.gov" />
        <LinkItem label="MIMIC-IV" url="https://physionet.org/content/mimiciv/2.2/" />
        <LinkItem label="HiRID" url="https://physionet.org/content/hirid/1.1.1/" />
        <LinkItem label="Preprint DOI" url="https://doi.org/10.64898/2026.02.10.26345827" />
        <LinkItem label="OSF Pre-reg" url="https://osf.io/ujgc6/overview" />
        <LinkItem label="ClinicalTrials.gov" url="https://clinicaltrials.gov/submit-studies" />
        <LinkItem label="AMIA Submission" url="https://amia.secure-platform.com" />
        <LinkItem label="ML4HC" url="https://mlforhc.org" />
      </div>
    </div>

    <div className="space-y-4">
      <h2 className="text-xs font-semibold tracking-wider text-white/40 uppercase">Copy-Paste Snippets</h2>

      <CopySnippet
        title="Organization Signature Block"
        text={`Dr. Alexis Collier, DHA
Founder & CEO, VitaSignal LLC
NIH AIM-AHEAD CLINAQ Fellow · Morehouse School of Medicine
Adjunct Faculty, University of North Georgia
info@vitasignal.ai | vitasignal.ai
USPTO Patent Applications: 63/976,293 and 10 additional provisional filings`}
      />
      <CopySnippet
        title="Short Bio for Conference Programs"
        text={`Dr. Alexis Collier is a health informaticist, NIH-funded clinical AI researcher, and founder of VitaSignal LLC. Her research demonstrates that temporal patterns in routine nursing documentation predict ICU mortality with validated performance across 357,000+ patients in three international databases. She holds 11 U.S. provisional patent applications and is an NIH AIM-AHEAD CLINAQ Fellow at Morehouse School of Medicine.`}
      />
      <CopySnippet
        title="VitaSignal One-Liner"
        text={`VitaSignal™ is an equipment-independent clinical AI platform that predicts ICU mortality and nursing documentation burden from EHR timestamp patterns alone — no sensors, no wearables, validated on 357,080 patients across 172 hospitals.`}
      />
    </div>
  </div>
);

export default HubContacts;
