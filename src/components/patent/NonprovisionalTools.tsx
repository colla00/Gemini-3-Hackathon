import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  GitBranch, Search, Image, UserCheck, FileStack, CheckCircle2,
  AlertTriangle, Clock, Download, Printer
} from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";

/* ── All 11 Patent Systems ────────────────────────── */
const patentSystems = [
  { id: "idi", name: "ICU Mortality (IDI)", number: "63/XXX,XXX", claims: 20, filed: "2025-08-XX" },
  { id: "chartminder", name: "ChartMinder™ Alert Governance", number: "63/XXX,XXX", claims: 18, filed: "2025-09-XX" },
  { id: "clinical-risk", name: "Clinical Risk Prediction", number: "63/XXX,XXX", claims: 15, filed: "2025-09-XX" },
  { id: "unified-nursing", name: "Unified Nursing Analytics", number: "63/XXX,XXX", claims: 16, filed: "2025-10-XX" },
  { id: "dbs", name: "Documentation Burden Score", number: "63/XXX,XXX", claims: 14, filed: "2025-10-XX" },
  { id: "traci", name: "TRACI (Temporal Risk)", number: "63/XXX,XXX", claims: 17, filed: "2025-11-XX" },
  { id: "esdbi", name: "ESDBI (Staffing Optimization)", number: "63/XXX,XXX", claims: 15, filed: "2025-11-XX" },
  { id: "shqs", name: "SHQS (Quality Surveillance)", number: "63/XXX,XXX", claims: 16, filed: "2025-12-XX" },
  { id: "dtbl", name: "DTBL (Digital Twin)", number: "63/XXX,XXX", claims: 18, filed: "2026-01-XX" },
  { id: "ctci", name: "CTCI (Clinical Trials)", number: "63/XXX,XXX", claims: 14, filed: "2026-01-XX" },
  { id: "sedr", name: "SEDR (Syndromic Response)", number: "63/XXX,XXX", claims: 12, filed: "2026-02-XX" },
];

/* ── Claim Dependency Template ────────────────────── */
interface ClaimNode {
  num: number;
  type: "independent" | "dependent";
  dependsOn?: number;
  text: string;
}

const defaultClaimTree: ClaimNode[] = [
  { num: 1, type: "independent", text: "A computer-implemented method for..." },
  { num: 2, type: "dependent", dependsOn: 1, text: "The method of claim 1, wherein..." },
  { num: 3, type: "dependent", dependsOn: 1, text: "The method of claim 1, further comprising..." },
  { num: 4, type: "dependent", dependsOn: 2, text: "The method of claim 2, wherein..." },
  { num: 5, type: "independent", text: "A system comprising a processor..." },
  { num: 6, type: "dependent", dependsOn: 5, text: "The system of claim 5, wherein..." },
  { num: 7, type: "independent", text: "A non-transitory computer-readable medium..." },
];

/* ── Prior Art Categories ─────────────────────────── */
const priorArtCategories = [
  { category: "Academic Literature", items: ["PubMed systematic review", "IEEE/ACM conference proceedings", "Clinical informatics journals"] },
  { category: "Existing Patents", items: ["USPTO full-text search", "Google Patents", "WIPO/EPO databases", "Freedom-to-operate analysis"] },
  { category: "Commercial Products", items: ["Epic Deterioration Index", "Cerner St. John Sepsis", "MEDITECH Surveillance", "Rothman Index"] },
  { category: "Open Source / Standards", items: ["HL7 FHIR CDS Hooks spec", "OHDSI/OMOP common data model", "OpenMRS risk modules"] },
];

/* ── Specification Drawing Types ──────────────────── */
const drawingTypes = [
  { id: "system-arch", name: "System Architecture Diagram", desc: "High-level block diagram showing data flow from EHR → VitaSignal engine → clinical output", required: true },
  { id: "data-flow", name: "Data Flow Diagram", desc: "Detailed data pipeline: ingestion, preprocessing, feature extraction, model inference, alert generation", required: true },
  { id: "ml-pipeline", name: "ML/AI Pipeline Flowchart", desc: "Training pipeline, feature engineering, model architecture, validation methodology", required: true },
  { id: "ui-screens", name: "User Interface Screenshots", desc: "Representative dashboard screens showing risk scores, alerts, and clinical workflow", required: true },
  { id: "temporal", name: "Temporal Pattern Visualization", desc: "How documentation timing patterns are analyzed over sliding windows", required: false },
  { id: "integration", name: "EHR Integration Diagram", desc: "FHIR R4 data exchange, CDS Hooks, SMART on FHIR authorization flow", required: false },
  { id: "decision-tree", name: "Decision Logic Flowchart", desc: "Alert escalation logic, threshold-based risk stratification", required: false },
];

/* ── Inventor Declaration (37 CFR 1.63) ───────────── */
const declarationFields = [
  { id: "name", label: "Full Legal Name of Inventor", required: true },
  { id: "residence", label: "City & Country of Residence", required: true },
  { id: "citizenship", label: "Country of Citizenship", required: true },
  { id: "postaddr", label: "Mailing Address", required: true },
  { id: "contribution", label: "Description of Inventive Contribution", required: true },
  { id: "employment", label: "Employer (if applicable)", required: false },
  { id: "assignment", label: "Assignment to VitaSignal LLC", required: true },
];

const declarationStatements = [
  "I believe I am the original inventor or an original joint inventor of a claimed invention in the application.",
  "I have reviewed and understand the contents of the application, including the claims.",
  "I acknowledge the duty to disclose information material to patentability (37 CFR 1.56).",
  "I acknowledge that willful false statements may jeopardize the validity of the application.",
];

/* ── IDS Checklist ────────────────────────────────── */
const idsCategories = [
  { name: "U.S. Patents & Published Applications", items: ["Search USPTO for related CDS/CDSS patents", "Include all patents cited in provisional", "Co-pending application cross-references"] },
  { name: "Foreign Patent Documents", items: ["EPO/WIPO search for clinical AI patents", "JP/KR/CN relevant filings", "PCT applications in same field"] },
  { name: "Non-Patent Literature", items: ["Published manuscripts (redacted journal names)", "Conference presentations (ANIA 2026, AMIA)", "FDA guidance documents on AI/ML SaMD", "ONC interoperability rules & TEFCA", "CMS CDS policy guidance"] },
  { name: "Other Material Information", items: ["Open-source implementations referenced", "Industry standards (HL7 FHIR, SNOMED, LOINC)", "Competitor product documentation"] },
];

export function NonprovisionalTools() {
  const [activeSystem, setActiveSystem] = useState(patentSystems[0].id);
  const [claimEdits, setClaimEdits] = useState<Record<string, string>>({});
  const [priorArtNotes, setPriorArtNotes] = useState<Record<string, string>>({});
  const [drawingChecked, setDrawingChecked] = useState<Set<string>>(new Set());
  const [idsChecked, setIdsChecked] = useState<Set<string>>(new Set());
  const [declarationChecked, setDeclarationChecked] = useState<Set<string>>(new Set());

  const currentSystem = patentSystems.find(p => p.id === activeSystem)!;

  // Overall readiness
  const totalItems = drawingTypes.length + idsCategories.reduce((a, c) => a + c.items.length, 0) + declarationFields.length;
  const completedItems = drawingChecked.size + idsChecked.size + declarationChecked.size;
  const readiness = Math.round((completedItems / totalItems) * 100);

  const exportChecklist = () => {
    const doc = new jsPDF();
    const now = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    doc.setFontSize(14);
    doc.text("Nonprovisional Patent Conversion Checklist", 14, 20);
    doc.setFontSize(9);
    doc.text(`System: ${currentSystem.name} · ${currentSystem.number} · Generated: ${now}`, 14, 28);
    doc.setFontSize(8);
    doc.text(`Overall Readiness: ${readiness}% (${completedItems}/${totalItems} items)`, 14, 34);

    let y = 44;
    doc.setFontSize(10);
    doc.text("1. Specification Drawings", 14, y); y += 6;
    doc.setFontSize(8);
    drawingTypes.forEach(d => {
      const done = drawingChecked.has(d.id) ? "✓" : "○";
      doc.text(`  ${done} ${d.name} ${d.required ? "(REQUIRED)" : "(optional)"}`, 16, y); y += 4;
    });
    y += 4;

    doc.setFontSize(10);
    doc.text("2. Information Disclosure Statement", 14, y); y += 6;
    doc.setFontSize(8);
    idsCategories.forEach(cat => {
      doc.text(`  ${cat.name}:`, 16, y); y += 4;
      cat.items.forEach(item => {
        const done = idsChecked.has(item) ? "✓" : "○";
        doc.text(`    ${done} ${item}`, 18, y); y += 4;
        if (y > 270) { doc.addPage(); y = 20; }
      });
      y += 2;
    });

    doc.save(`NP-Checklist-${currentSystem.id}-${now.replace(/\s/g, "-")}.pdf`);
    toast.success("Checklist exported");
  };

  return (
    <div className="space-y-6">
      {/* Header with system selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Nonprovisional Conversion Tools</h2>
          <p className="text-sm text-muted-foreground">Preparation materials for all 11 patent applications</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={readiness >= 80 ? "default" : "secondary"} className="text-sm font-mono">
            {readiness}% Ready
          </Badge>
          <Button size="sm" variant="outline" onClick={exportChecklist}>
            <Download className="w-3.5 h-3.5 mr-1" /> Export PDF
          </Button>
        </div>
      </div>

      <Progress value={readiness} className="h-2" />

      {/* System Selector */}
      <div className="flex flex-wrap gap-1.5">
        {patentSystems.map(p => (
          <Button
            key={p.id}
            size="sm"
            variant={activeSystem === p.id ? "default" : "outline"}
            className="text-xs h-7"
            onClick={() => setActiveSystem(p.id)}
          >
            {p.name.split(" (")[0].split(" ").slice(0, 2).join(" ")}
          </Button>
        ))}
      </div>

      <div className="text-sm p-3 bg-secondary/50 rounded-lg">
        <strong>{currentSystem.name}</strong> · {currentSystem.number} · {currentSystem.claims} claims · Filed {currentSystem.filed}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="claims" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="claims" className="text-xs gap-1"><GitBranch className="w-3.5 h-3.5" /> Claims</TabsTrigger>
          <TabsTrigger value="priorart" className="text-xs gap-1"><Search className="w-3.5 h-3.5" /> Prior Art</TabsTrigger>
          <TabsTrigger value="drawings" className="text-xs gap-1"><Image className="w-3.5 h-3.5" /> Drawings</TabsTrigger>
          <TabsTrigger value="declaration" className="text-xs gap-1"><UserCheck className="w-3.5 h-3.5" /> Declaration</TabsTrigger>
          <TabsTrigger value="ids" className="text-xs gap-1"><FileStack className="w-3.5 h-3.5" /> IDS</TabsTrigger>
        </TabsList>

        {/* ── Claim Dependency Mapping ──────────── */}
        <TabsContent value="claims" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                Claim Dependency Tree — {currentSystem.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Map independent and dependent claims. Nonprovisional applications require clear claim hierarchy with proper antecedent basis.
              </p>
              {defaultClaimTree.map(c => (
                <div key={c.num} className={`flex items-start gap-3 p-2.5 rounded-lg border ${
                  c.type === "independent" ? "bg-primary/5 border-primary/20" : "bg-card border-border ml-6"
                }`}>
                  <Badge variant={c.type === "independent" ? "default" : "outline"} className="text-[10px] shrink-0 mt-0.5">
                    {c.num}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground capitalize">{c.type}</span>
                      {c.dependsOn && <span className="text-[10px] text-muted-foreground">← Claim {c.dependsOn}</span>}
                    </div>
                    <Textarea
                      value={claimEdits[`${activeSystem}-${c.num}`] || c.text}
                      onChange={e => setClaimEdits(prev => ({ ...prev, [`${activeSystem}-${c.num}`]: e.target.value }))}
                      rows={1}
                      className="text-xs"
                      placeholder={c.text}
                    />
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground italic">
                Template claim tree. Actual claims per provisional application should be mapped by patent counsel.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Prior Art Search ─────────────────── */}
        <TabsContent value="priorart" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                Prior Art Search Documentation — {currentSystem.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  Prior art searches should be conducted by a qualified patent searcher or attorney. This tool provides a structured framework for organizing search results.
                </p>
              </div>
              {priorArtCategories.map(cat => (
                <div key={cat.category}>
                  <p className="text-sm font-medium text-foreground mb-2">{cat.category}</p>
                  <div className="space-y-2">
                    {cat.items.map(item => (
                      <div key={item} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Search Notes</p>
                <Textarea
                  value={priorArtNotes[activeSystem] || ""}
                  onChange={e => setPriorArtNotes(prev => ({ ...prev, [activeSystem]: e.target.value }))}
                  rows={4}
                  className="text-xs"
                  placeholder={`Document prior art findings for ${currentSystem.name}...`}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Specification Drawings ───────────── */}
        <TabsContent value="drawings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Image className="w-4 h-4 text-primary" />
                Specification Drawings (37 CFR 1.84) — {currentSystem.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                USPTO requires formal drawings that illustrate the claimed invention. Drawings must be in black and white, with consistent line quality and proper labeling.
              </p>
              {drawingTypes.map(d => (
                <div key={d.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-border">
                  <Checkbox
                    checked={drawingChecked.has(d.id)}
                    onCheckedChange={() => {
                      setDrawingChecked(prev => {
                        const next = new Set(prev);
                        if (next.has(d.id)) next.delete(d.id); else next.add(d.id);
                        return next;
                      });
                    }}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{d.name}</span>
                      {d.required && <Badge variant="destructive" className="text-[9px]">Required</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.desc}</p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                <strong>{drawingChecked.size}/{drawingTypes.length}</strong> drawings prepared · {drawingTypes.filter(d => d.required && !drawingChecked.has(d.id)).length} required drawings remaining
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Inventor Declaration ─────────────── */}
        <TabsContent value="declaration" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                Inventor Declaration (37 CFR 1.63)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Each named inventor must execute a declaration for each nonprovisional application. The declaration may be filed with the application or within a time period set by the USPTO.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Required Information Per Inventor</p>
                <div className="space-y-2">
                  {declarationFields.map(f => (
                    <div key={f.id} className="flex items-center gap-3 p-2 rounded border border-border">
                      <Checkbox
                        checked={declarationChecked.has(f.id)}
                        onCheckedChange={() => {
                          setDeclarationChecked(prev => {
                            const next = new Set(prev);
                            if (next.has(f.id)) next.delete(f.id); else next.add(f.id);
                            return next;
                          });
                        }}
                      />
                      <span className="text-sm text-foreground">{f.label}</span>
                      {f.required && <Badge variant="outline" className="text-[9px] text-destructive border-destructive/30">Required</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Declaration Statements</p>
                <div className="space-y-2">
                  {declarationStatements.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground p-2 bg-secondary/50 rounded">
                      <span className="font-bold text-foreground shrink-0">{i + 1}.</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                <strong>{declarationChecked.size}/{declarationFields.length}</strong> fields prepared
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── IDS ──────────────────────────────── */}
        <TabsContent value="ids" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileStack className="w-4 h-4 text-primary" />
                Information Disclosure Statement (37 CFR 1.97/1.98)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-800 dark:text-amber-200">
                  <p className="font-medium">Duty of Candor (37 CFR 1.56)</p>
                  <p>All inventors and their attorneys have a duty to disclose to the USPTO all information known to be material to patentability. Failure to comply may render patents unenforceable.</p>
                </div>
              </div>

              {idsCategories.map(cat => (
                <div key={cat.name}>
                  <p className="text-sm font-medium text-foreground mb-2">{cat.name}</p>
                  <div className="space-y-1.5">
                    {cat.items.map(item => (
                      <div key={item} className="flex items-center gap-3 p-1.5 rounded">
                        <Checkbox
                          checked={idsChecked.has(item)}
                          onCheckedChange={() => {
                            setIdsChecked(prev => {
                              const next = new Set(prev);
                              if (next.has(item)) next.delete(item); else next.add(item);
                              return next;
                            });
                          }}
                        />
                        <span className={`text-xs ${idsChecked.has(item) ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <p className="text-xs text-muted-foreground">
                <strong>{idsChecked.size}/{idsCategories.reduce((a, c) => a + c.items.length, 0)}</strong> items documented
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
