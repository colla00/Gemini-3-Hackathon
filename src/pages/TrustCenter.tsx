import { motion } from 'framer-motion';
import { Shield, Lock, Server, FileCheck, Eye, CheckCircle2, AlertTriangle, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteLayout } from '@/components/layout/SiteLayout';

const controls = [
  {
    category: 'Data Encryption',
    icon: Lock,
    items: [
      { name: 'Encryption at Rest', status: 'active', detail: 'AES-256 encryption for all stored data' },
      { name: 'Encryption in Transit', status: 'active', detail: 'TLS 1.3 enforced on all connections' },
      { name: 'Key Management', status: 'active', detail: 'Automated key rotation with hardware-backed storage' },
    ],
  },
  {
    category: 'Access Controls',
    icon: Shield,
    items: [
      { name: 'Role-Based Access (RBAC)', status: 'active', detail: 'Principle of least privilege enforced across all roles' },
      { name: 'Multi-Factor Authentication', status: 'active', detail: 'Required for all administrative and clinical access' },
      { name: 'Audit Logging', status: 'active', detail: 'Immutable logs of all data access and modifications' },
      { name: 'Session Management', status: 'active', detail: 'Automatic timeout and re-authentication policies' },
    ],
  },
  {
    category: 'Infrastructure',
    icon: Server,
    items: [
      { name: 'SOC 2 Type II', status: 'in_progress', detail: 'Audit preparation underway — targeting Q3 2026' },
      { name: 'HIPAA Technical Safeguards', status: 'active', detail: '96% compliant — access control, audit, integrity, transmission security' },
      { name: 'Business Associate Agreement', status: 'active', detail: 'BAA-ready for all covered entity partnerships' },
      { name: 'Incident Response Plan', status: 'active', detail: 'Documented IRP with <1 hour initial response target' },
    ],
  },
  {
    category: 'Data Governance',
    icon: Eye,
    items: [
      { name: 'Data Retention Policies', status: 'active', detail: 'Configurable retention with automated cleanup' },
      { name: 'Right to Deletion', status: 'active', detail: 'CCPA/CPRA-compliant data deletion request workflow' },
      { name: 'Data Processing Agreements', status: 'active', detail: 'Standard DPA available for enterprise partners' },
      { name: 'No Data Selling', status: 'active', detail: 'Patient data is never sold, shared, or used for advertising' },
    ],
  },
];

const certifications = [
  { name: 'HIPAA', status: 'Compliant', progress: 96, color: 'text-emerald-400' },
  { name: 'SOC 2 Type II', status: 'In Progress', progress: 40, color: 'text-amber-400' },
  { name: 'ISO 13485', status: 'Documented', progress: 70, color: 'text-blue-400' },
  { name: 'FDA SaMD', status: 'Pre-Submission', progress: 55, color: 'text-purple-400' },
];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'active') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="w-2.5 h-2.5" /> Active
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
      <AlertTriangle className="w-2.5 h-2.5" /> In Progress
    </span>
  );
};

const TrustCenter = () => (
  <SiteLayout
    title="Trust Center | VitaSignal — Security & Compliance"
    description="VitaSignal's Trust Center. Review our security controls, HIPAA compliance, encryption standards, and data governance practices."
  >
    <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
      {/* Hero */}
      <section className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" /> Security & Compliance
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
              Trust <span className="text-emerald-400">Center</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Transparency is foundational to clinical AI. Review our security controls, compliance posture, and data governance practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Compliance Overview */}
      <section className="px-4 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-xs text-white/50 mb-1">{c.name}</p>
              <p className={`text-lg font-bold mb-2 ${c.color}`}>{c.status}</p>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.progress}%`, background: c.color.includes('emerald') ? '#10b981' : c.color.includes('amber') ? '#f59e0b' : c.color.includes('blue') ? '#3b82f6' : '#8b5cf6' }} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Controls */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-xs font-semibold tracking-wider text-white/50 uppercase">Security Controls</h2>
          {controls.map((group, gi) => (
            <motion.div key={group.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: gi * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <group.icon className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">{group.category}</h3>
              </div>
              <div className="divide-y divide-white/5">
                {group.items.map(item => (
                  <div key={item.name} className="flex items-start justify-between px-5 py-3.5 gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{item.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{item.detail}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Data Handling */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white font-['DM_Serif_Display']">How We Handle Your Data</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-white font-medium mb-1">No PHI in Our Platform (Yet)</p>
                  <p className="text-white/50 text-xs">VitaSignal is currently a pre-market research prototype. All demonstrations use synthetic or de-identified public datasets. No real patient data enters our systems until a formal BAA is executed.</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Minimum Necessary Standard</p>
                  <p className="text-white/50 text-xs">When processing clinical data, we access only the minimum data elements required for risk prediction — no unnecessary demographics, financial data, or social information.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-white font-medium mb-1">Vendor Responsibility</p>
                  <p className="text-white/50 text-xs">We execute BAAs with all covered entity partners and maintain chain-of-custody documentation for every data element processed through our inference pipeline.</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Breach Notification</p>
                  <p className="text-white/50 text-xs">Our Incident Response Plan mandates notification within 24 hours of discovering a potential breach — well within HIPAA's 60-day requirement.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4 font-['DM_Serif_Display']">Need More Detail?</h2>
          <p className="text-white/60 mb-6 text-sm">We provide complete security documentation, penetration test reports, and compliance attestations to prospective clinical partners under NDA.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <a href="/pilot-request">Request Security Documentation <ArrowRight className="w-4 h-4 ml-2" /></a>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <a href="/contact">Contact Our Team <FileCheck className="w-4 h-4 ml-2" /></a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  </SiteLayout>
);

export default TrustCenter;
