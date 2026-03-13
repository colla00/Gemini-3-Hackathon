import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, ArrowRight, CheckCircle2, Shield, Layers, Zap, FileText } from "lucide-react";

const integrationFeatures = [
  { icon: Layers, title: "FHIR R4 Native", desc: "Standard-compliant REST APIs — Patient, Observation, DocumentReference, and ClinicalImpression resources." },
  { icon: Zap, title: "Real-Time Webhooks", desc: "HMAC-SHA256 signed event delivery with automatic retry and dead-letter queuing." },
  { icon: Shield, title: "SMART on FHIR Ready", desc: "OAuth 2.0 launch context, EHR-embedded app configuration, and scoped authorization." },
  { icon: FileText, title: "White-Label Licensing", desc: "Embed VitaSignal algorithms directly into your platform under your brand. Patent-backed IP protection." },
];

const techSpecs = [
  "HL7 FHIR R4 compliant API endpoints",
  "SMART on FHIR launch framework support",
  "CDS Hooks integration for real-time alerts",
  "Bulk FHIR export support for retrospective analysis",
  "Sandbox environment with synthetic patient data",
  "SOC 2 Type II architecture, HIPAA BAA available",
  "99.9% uptime SLA for production deployments",
  "Dedicated integration engineering support",
];

const SolutionsEHRVendors = () => (
  <SiteLayout
    title="For EHR Vendors | VitaSignal — FHIR-Native Clinical AI"
    description="Embed patent-pending clinical AI directly into your EHR platform. FHIR R4 native, SMART on FHIR ready, white-label licensing available."
  >
    <main className="min-h-screen bg-gradient-to-b from-[hsl(220,25%,8%)] via-[hsl(220,20%,12%)] to-[hsl(220,25%,8%)]">
      {/* Hero */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-4 border-blue-400/30 text-blue-400">
              <Code2 className="w-3 h-3 mr-1" /> For EHR Vendors & Platform Partners
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-['DM_Serif_Display']">
              Add Clinical AI<br />
              <span className="text-blue-400">Without Building It</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              License patent-pending mortality prediction and workload optimization algorithms.
              FHIR R4 native. SMART on FHIR ready. Deploy in your EHR under your brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link to="/licensing">Explore Licensing <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/integrations">View API Documentation</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10 font-['DM_Serif_Display']">
            Integration Architecture
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {integrationFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-blue-400/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-400/10 flex items-center justify-center">
                    <f.icon className="w-4.5 h-4.5 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white">{f.title}</h3>
                </div>
                <p className="text-sm text-white/60">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8 font-['DM_Serif_Display']">Technical Specifications</h2>
          <div className="space-y-3">
            {techSpecs.map((spec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-sm text-white/70">{spec}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IP Protection */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-8 text-center"
          >
            <h2 className="text-xl font-bold text-white mb-3 font-['DM_Serif_Display']">IP-Protected Partnership</h2>
            <p className="text-sm text-white/60 mb-4 max-w-xl mx-auto">
              11 U.S. patent applications protect the underlying algorithms. White-label licensing gives you competitive differentiation
              without R&D risk — backed by NIH-funded validation across 357K+ patients.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link to="/licensing">Start Licensing Conversation</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/patents">View Patent Portfolio</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  </SiteLayout>
);

export default SolutionsEHRVendors;
