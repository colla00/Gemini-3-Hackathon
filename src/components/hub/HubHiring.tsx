import { Briefcase, Users, DollarSign, Clock, Mail, Copy } from 'lucide-react';
import { useState } from 'react';

const T = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#00c8b4' }}>{children}</span>;

type HireRole = {
  id: string;
  title: string;
  timeline: string;
  equity: string;
  salary: string;
  icon: React.ElementType;
  description: string;
  requirements: string[];
  responsibilities: string[];
  outreachTemplate: string;
  channels: string[];
};

const ROLES: HireRole[] = [
  {
    id: 'cto',
    title: 'Technical Co-Founder / CTO',
    timeline: 'Month 2-3 (April-May 2026)',
    equity: '15-25%',
    salary: 'Deferred until seed ($150K-$180K post-funding)',
    icon: Users,
    description: 'Healthcare ML engineer who can transform validated research code into a production-grade, HIPAA-compliant clinical AI system.',
    requirements: [
      '5+ years ML/AI engineering (healthcare preferred)',
      'Production deployment experience (AWS/Azure healthcare)',
      'HL7 FHIR / EHR integration experience',
      'HIPAA compliance and security architecture',
      'Python, PyTorch/TensorFlow, cloud infrastructure',
      'Comfortable with equity-heavy, pre-revenue compensation',
    ],
    responsibilities: [
      'Architect production inference pipeline for real-time risk scoring',
      'Build Epic/Cerner FHIR integration layer',
      'Deploy HIPAA-compliant cloud infrastructure',
      'Lead technical due diligence for seed fundraise',
      'Scale from pilot (1 hospital) to production (5-8 hospitals)',
    ],
    outreachTemplate: `Hi [Name],

I'm Dr. Alexis Collier, founder of VitaSignal — an AI clinical decision support platform that predicts ICU patient deterioration using only existing EHR documentation patterns (no additional hardware required).

We have 11 U.S. patent applications filed, validation across 55,000+ patients in international ICU databases, and an NIH fellowship backing the research. Now we need a technical co-founder to lead the transition from validated research to production-deployed clinical AI.

The role: CTO/Co-Founder with 15-25% equity, leading architecture, EHR integration, and cloud deployment. Deferred salary until seed funding (~$2M target).

Would you be open to a 20-minute conversation? I'd love to share the validation data and technical architecture.

Best,
Dr. Alexis Collier, DHA, MHA
Founder & CEO, VitaSignal LLC
info@vitasignal.ai | vitasignal.ai`,
    channels: ['LinkedIn (healthcare AI engineers)', 'AngelList / Wellfound', 'Y Combinator co-founder matching', 'Healthcare AI Slack communities', 'AMIA conference networking'],
  },
  {
    id: 'clinical',
    title: 'Clinical Operations Lead',
    timeline: 'Month 5-6 (July-Aug 2026)',
    equity: '3-5%',
    salary: '$120K-$140K (post-seed)',
    icon: Briefcase,
    description: 'Nurse informaticist or ICU clinical leader who can bridge the gap between the engineering team and hospital clinical workflows.',
    requirements: [
      'MSN, DNP, or clinical informatics certification',
      '5+ years ICU/critical care nursing experience',
      'EHR implementation or clinical informatics background',
      'Experience with quality improvement / patient safety',
      'Understanding of CMS reporting requirements',
      'Comfortable as early-stage startup employee',
    ],
    responsibilities: [
      'Lead clinical workflow integration during pilot deployments',
      'Serve as primary clinical liaison with hospital partners',
      'Design nurse-centered risk score presentation and handoff workflows',
      'Support FDA regulatory pathway and clinical evidence gathering',
      'Contribute to clinical validation publications',
    ],
    outreachTemplate: `Hi [Name],

I'm Dr. Alexis Collier, founder of VitaSignal — we're building AI that predicts patient deterioration using documentation patterns nurses are already generating, without requiring any additional monitoring equipment.

We're looking for a Clinical Operations Lead to join as an early team member (3-5% equity) and lead our hospital pilot deployments. Your background in [ICU nursing / clinical informatics] aligns perfectly with what we need.

We've validated across 55,000+ patients and have 11 patent applications filed. The next step is deploying in actual clinical environments — and we need someone who understands the workflow.

Would you be open to a conversation?

Best,
Dr. Alexis Collier, DHA, MHA
info@vitasignal.ai | vitasignal.ai`,
    channels: ['ANIA 2026 invited webinar', 'AMIA Nursing Informatics', 'LinkedIn (nurse informaticists)', 'University faculty networks', 'AACN critical care communities'],
  },
  {
    id: 'ml',
    title: 'Lead ML Engineer',
    timeline: 'Month 8-9 (Oct-Nov 2026)',
    equity: '1-3%',
    salary: '$160K-$190K',
    icon: Users,
    description: 'Production ML specialist to build scalable inference pipelines and maintain model performance across multi-hospital deployments.',
    requirements: [
      '3+ years ML engineering (production systems)',
      'Real-time inference and model serving experience',
      'MLOps: model monitoring, drift detection, retraining',
      'Healthcare data experience preferred (HL7/FHIR)',
      'Python, scikit-learn, SHAP, cloud ML services',
    ],
    responsibilities: [
      'Build and maintain real-time inference API',
      'Implement model monitoring and performance tracking',
      'Scale ML pipeline across multiple hospital deployments',
      'Implement SHAP-based explainability for clinical predictions',
      'Ensure fairness metrics maintained across demographics',
    ],
    outreachTemplate: `Hi [Name],

VitaSignal is hiring a Lead ML Engineer to build production inference pipelines for our clinical AI platform. We predict ICU patient deterioration from EHR documentation patterns — validated across international databases, 11 patents filed.

Role: Build real-time inference, model monitoring, and multi-hospital scalability. Competitive compensation + equity. Series A trajectory.

Interested in learning more?

Dr. Alexis Collier | info@vitasignal.ai`,
    channels: ['LinkedIn', 'Wellfound / AngelList', 'ML engineering job boards', 'Healthcare AI conferences', 'Referrals from CTO'],
  },
  {
    id: 'bd',
    title: 'Business Development Lead',
    timeline: 'Month 10-12 (Dec 2026 - Feb 2027)',
    equity: '1-2%',
    salary: '$130K-$160K + commission',
    icon: DollarSign,
    description: 'Healthcare enterprise sales professional to build repeatable sales process and drive hospital system pipeline.',
    requirements: [
      '5+ years healthcare enterprise sales',
      'Hospital system / health IT sales experience',
      'Understanding of clinical workflow and buying process',
      'Experience with pilot-to-contract conversion',
      'Network of hospital CIO/CMIO/CNIO contacts',
    ],
    responsibilities: [
      'Build and manage hospital sales pipeline',
      'Lead pilot contract negotiations',
      'Develop pricing and packaging strategy',
      'Create repeatable sales playbook',
      'Manage customer success and expansion',
    ],
    outreachTemplate: `Hi [Name],

VitaSignal is an AI clinical decision support company with 11 patents, NIH validation, and early hospital pilot traction. We're hiring a BD Lead to build our enterprise sales function.

We sell to hospital CMIOs and CNIOs — equipment-independent clinical AI that works with existing EHR data. $130K-$160K + commission + equity.

Would love to discuss if this aligns with your experience.

Dr. Alexis Collier | info@vitasignal.ai`,
    channels: ['LinkedIn (health IT sales)', 'HIMSS / CHIME networks', 'Healthcare sales recruiters', 'Referrals from pilot customers'],
  },
];

const HubHiring = () => {
  const [expandedRole, setExpandedRole] = useState<string | null>('cto');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyTemplate = (roleId: string, template: string) => {
    navigator.clipboard.writeText(template);
    setCopiedId(roleId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <Briefcase className="w-7 h-7" style={{ color: '#00c8b4' }} />
          Hiring Toolkit
        </h1>
        <p className="text-sm text-white/60 mt-1">4 key hires to build from solo founder → 6-8 person team</p>
      </div>

      {/* Equity framework */}
      <div className="rounded-xl border border-white/10 p-5 space-y-3" style={{ background: '#151f35' }}>
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">Equity Framework</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ROLES.map(role => (
            <div key={role.id} className="rounded-lg border border-white/10 p-3 text-center" style={{ background: '#0f1729' }}>
              <div className="text-sm font-bold" style={{ color: '#00c8b4' }}>{role.equity}</div>
              <div className="text-[10px] text-white/50 mt-1">{role.title.split('/')[0].trim()}</div>
              <div className="text-[9px] text-white/30 mt-0.5">{role.timeline.split('(')[0].trim()}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-white/30 border-t border-white/5 pt-2">
          Founder retains 55-75% pre-dilution · 4-year vesting with 1-year cliff · Standard acceleration on acquisition
        </div>
      </div>

      {/* Role cards */}
      <div className="space-y-3">
        {ROLES.map(role => {
          const expanded = expandedRole === role.id;
          const Icon = role.icon;

          return (
            <div key={role.id} className="rounded-xl border border-white/10 overflow-hidden" style={{ background: '#151f35' }}>
              <button
                onClick={() => setExpandedRole(expanded ? null : role.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" style={{ color: '#00c8b4' }} />
                  <div>
                    <div className="text-sm font-medium text-white">{role.title}</div>
                    <div className="text-[10px] text-white/40">{role.timeline} · {role.equity} equity</div>
                  </div>
                </div>
                <Clock className="w-4 h-4 text-white/30" />
              </button>

              {expanded && (
                <div className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4">
                  <p className="text-sm text-white/70 leading-relaxed">{role.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Requirements</h4>
                      <div className="space-y-1">
                        {role.requirements.map((req, i) => (
                          <div key={i} className="text-xs text-white/60 flex items-start gap-2">
                            <span className="text-white/20 mt-0.5">•</span>{req}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Responsibilities</h4>
                      <div className="space-y-1">
                        {role.responsibilities.map((resp, i) => (
                          <div key={i} className="text-xs text-white/60 flex items-start gap-2">
                            <span className="text-white/20 mt-0.5">•</span>{resp}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[10px] text-white/40">Compensation: <span className="text-white/60">{role.salary}</span></span>
                  </div>

                  {/* Outreach template */}
                  <div className="rounded-lg border border-white/10 p-4 space-y-2" style={{ background: '#0f1729' }}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3 h-3" /> Outreach Template
                      </h4>
                      <button
                        onClick={() => copyTemplate(role.id, role.outreachTemplate)}
                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded text-white/50 hover:text-white/80 transition-colors"
                        style={{ background: 'rgba(0,200,180,0.1)' }}
                      >
                        <Copy className="w-3 h-3" />
                        {copiedId === role.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="text-[11px] text-white/50 whitespace-pre-wrap leading-relaxed font-sans max-h-48 overflow-y-auto">
                      {role.outreachTemplate}
                    </pre>
                  </div>

                  {/* Channels */}
                  <div>
                    <h4 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Sourcing Channels</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.channels.map(ch => (
                        <span key={ch} className="text-[10px] px-2 py-1 rounded-full border border-white/10 text-white/50">{ch}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HubHiring;
