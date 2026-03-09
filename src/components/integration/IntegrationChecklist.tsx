import { motion } from "framer-motion";
import { CheckCircle2, Circle, Server, Shield, FileText, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistCategory {
  icon: React.ElementType;
  title: string;
  items: { label: string; detail: string; typical: boolean }[];
}

const categories: ChecklistCategory[] = [
  {
    icon: Database,
    title: "EHR & Data Requirements",
    items: [
      { label: "EHR system with HL7 FHIR R4 support", detail: "Epic, Cerner, MEDITECH, or any FHIR-compliant system", typical: true },
      { label: "Access to clinical documentation timestamps", detail: "Nursing assessments, vital sign entries, medication admin times", typical: true },
      { label: "Patient encounter/admission data", detail: "ADT feeds or Encounter resources", typical: true },
      { label: "Minimum 6 months historical data for baseline", detail: "Required for DBS™ calibration; mortality model works immediately", typical: true },
    ],
  },
  {
    icon: Server,
    title: "Technical Infrastructure",
    items: [
      { label: "HTTPS endpoint for FHIR webhook delivery", detail: "VitaSignal pushes predictions; you receive via standard webhook", typical: true },
      { label: "SMART on FHIR launch capability (optional)", detail: "Only needed for embedded EHR launch workflows", typical: false },
      { label: "Network access for outbound API calls", detail: "Your EHR integration engine must reach vitasignal.ai endpoints", typical: true },
      { label: "Test/sandbox EHR environment", detail: "For integration testing before production deployment", typical: true },
    ],
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    items: [
      { label: "BAA execution capability", detail: "Standard HIPAA Business Associate Agreement", typical: true },
      { label: "TLS 1.2+ for all data in transit", detail: "VitaSignal enforces TLS 1.2 minimum on all endpoints", typical: true },
      { label: "IRB approval (if research use)", detail: "Required for academic/research license track only", typical: false },
      { label: "Vendor security questionnaire process", detail: "VitaSignal provides pre-completed SIG/HECVAT", typical: true },
    ],
  },
  {
    icon: FileText,
    title: "Organizational Readiness",
    items: [
      { label: "Executive sponsor identified", detail: "CMO, CMIO, CNO, or VP of Digital Health", typical: true },
      { label: "Clinical champion (nursing informatics)", detail: "Day-to-day contact for workflow design and validation", typical: true },
      { label: "IT integration team (1–2 engineers)", detail: "For FHIR mapping and endpoint configuration", typical: true },
      { label: "Legal/compliance review capacity", detail: "For NDA, licensing agreement, and BAA review", typical: true },
    ],
  },
];

export const IntegrationChecklist = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {categories.map((cat, ci) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: ci * 0.1 }}
          className="rounded-xl border border-border/40 bg-card p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <cat.icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <h3 className="font-bold text-foreground text-sm">{cat.title}</h3>
          </div>

          <div className="space-y-3">
            {cat.items.map((item, ii) => (
              <div key={ii} className="flex items-start gap-3">
                {item.typical ? (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    item.typical ? "text-foreground" : "text-foreground/60"
                  )}>
                    {item.label}
                    {!item.typical && <span className="text-[10px] ml-1.5 text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Optional</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
