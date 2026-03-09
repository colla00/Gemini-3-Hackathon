import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Shield, Zap, ArrowRight, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ehrVendors = [
  {
    name: "Epic",
    tagline: "Largest U.S. EHR · 38% market share",
    methods: ["FHIR R4 API", "CDS Hooks", "App Orchard"],
    status: "Integration-Ready",
    highlight: true,
    color: "text-primary",
  },
  {
    name: "Oracle Health (Cerner)",
    tagline: "Enterprise cloud EHR · 25% market share",
    methods: ["FHIR R4 API", "Millennium Open APIs", "Smart on FHIR"],
    status: "Integration-Ready",
    highlight: true,
    color: "text-accent",
  },
  {
    name: "MEDITECH",
    tagline: "Community hospital leader · Growing FHIR support",
    methods: ["FHIR R4 API", "Expanse Platform", "BCA Toolkit"],
    status: "Compatible",
    highlight: false,
    color: "text-primary",
  },
  {
    name: "Allscripts / Veradigm",
    tagline: "Mid-market EHR · Open API platform",
    methods: ["FHIR R4 API", "Open API", "Unity Platform"],
    status: "Compatible",
    highlight: false,
    color: "text-accent",
  },
];

const integrationFeatures = [
  { icon: Shield, label: "FHIR R4 Compliant", detail: "HL7® FHIR® Release 4 standard" },
  { icon: Server, label: "Zero-Footprint", detail: "Cloud-native, no on-premise install" },
  { icon: Zap, label: "Real-Time Ingest", detail: "Sub-second EHR data processing" },
  { icon: CheckCircle2, label: "HIPAA-Ready", detail: "End-to-end encryption in transit & at rest" },
];

export const EHRCompatibilitySection = () => (
  <motion.section
    aria-labelledby="ehr-compat-heading"
    className="py-24 px-6 bg-secondary/30"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <Badge variant="outline" className="mb-4 text-primary border-primary/30 bg-primary/5">
          Enterprise Integration
        </Badge>
        <h2
          id="ehr-compat-heading"
          className="font-display text-3xl md:text-4xl text-foreground mb-4"
        >
          Compatible with Major EHR Systems
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          VitaSignal™ integrates seamlessly with the EHR systems your hospital already uses —
          no rip-and-replace, no custom middleware, no added hardware.
        </p>
      </motion.div>

      {/* Feature badges row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {integrationFeatures.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
            className="flex flex-col items-center text-center p-4 rounded-xl bg-background border border-border"
          >
            <f.icon className="w-6 h-6 text-primary mb-2" aria-hidden="true" />
            <p className="text-sm font-bold text-foreground">{f.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Vendor cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {ehrVendors.map((vendor, i) => (
          <motion.div
            key={vendor.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.55 }}
            className="relative rounded-xl border border-border bg-background p-6 hover:shadow-lg transition-shadow"
          >
            {vendor.highlight && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px] font-semibold uppercase">
                  {vendor.status}
                </Badge>
              </div>
            )}
            {!vendor.highlight && (
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                  {vendor.status}
                </Badge>
              </div>
            )}

            <h3 className={`font-display text-xl mb-1 ${vendor.color}`}>
              {vendor.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{vendor.tagline}</p>

            <div className="flex flex-wrap gap-2">
              {vendor.methods.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-xs font-medium text-foreground"
                >
                  <CheckCircle2 className="w-3 h-3 text-primary" aria-hidden="true" />
                  {m}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link to="/integrations">
            View Integration Documentation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </motion.section>
);
