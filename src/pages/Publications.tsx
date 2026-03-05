import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ExternalLink, Calendar, Users, Database, BarChart3, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const publications = [
  {
    id: "jamia",
    title: "Temporal Documentation Patterns as Predictors of ICU Mortality: Developing an Intensive Documentation Index Using MIMIC-IV",
    journal: "Journal of the American Medical Informatics Association (JAMIA)",
    authors: "Collier, A. M.",
    status: "Under Review",
    statusColor: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400",
    submittedDate: "2025",
    doi: null,
    abstract: `This study developed and validated the Intensive Documentation Index (IDI), a novel set of temporal features extracted from electronic health record (EHR) documentation timestamps, to predict in-hospital mortality among ICU patients with heart failure. Using the MIMIC-IV database (n=26,153 admissions, 2008–2019), 11 temporal features across four domains — event volume, rhythm regularity, surveillance gaps, and temporal dynamics — were engineered from routine documentation metadata without requiring clinical content. Using temporal validation (training 2008–2018, testing 2019), a regularized logistic regression model incorporating IDI features achieved an AUROC of 0.683 (95% CI: 0.631–0.732), improving over a baseline model using only age, sex, and ethnicity (AUROC 0.658, 95% CI: 0.609–0.710). Leave-one-year-out cross-validation confirmed stability (mean AUC 0.684, SD 0.008). The coefficient of variation of inter-event intervals emerged as the strongest IDI predictor (OR 1.53, 95% CI: 1.35–1.74). These findings demonstrate that the rhythm and intensity of clinical documentation carry an independent mortality signal, offering a new equipment-independent approach to ICU risk prediction.`,
    keyFindings: [
      { label: "AUROC", value: "0.683", detail: "95% CI: 0.631–0.732" },
      { label: "Baseline AUROC", value: "0.658", detail: "95% CI: 0.609–0.710" },
      { label: "Strongest Predictor", value: "CV (OR 1.53)", detail: "95% CI: 1.35–1.74" },
      { label: "LOYO Stability", value: "AUC 0.684", detail: "SD 0.008, 11 years" },
    ],
    cohort: "n=26,153 heart failure ICU admissions",
    database: "MIMIC-IV v2.2 (PhysioNet, MIT)",
    period: "2008–2019",
    validation: "Temporal split (train 2008–2018, test 2019) + LOYO cross-validation",
    features: "11 temporal IDI features across 4 domains",
    funding: "NIH AIM-AHEAD · Award No. 1OT2OD032581",
    irb: "IRB Protocol #2025-IRB-0142",
    patentLink: "Patent Application #1",
  },
  {
    id: "npj",
    title: "Multinational Validation of the Intensive Documentation Index for ICU Mortality Prediction: A MIMIC-IV and HiRID Study",
    journal: "npj Digital Medicine",
    authors: "Collier, A. M.",
    status: "Under Review",
    statusColor: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400",
    submittedDate: "2025",
    doi: null,
    abstract: `This study externally validated the Intensive Documentation Index (IDI) for ICU mortality prediction using two international databases: MIMIC-IV (n=26,153, United States) and HiRID (n=33,897, Switzerland), totaling 60,050 patients. On the MIMIC-IV cohort using a random 80/20 split, the IDI-enhanced model achieved an AUROC of 0.640 (95% CI: 0.62–0.66) compared to a baseline of 0.615. On the HiRID external validation cohort, after systematic leakage screening reduced the feature set from 80+ candidates to 45 eligible temporal features, the IDI achieved a standalone AUROC of 0.9063, significantly outperforming both APACHE IV (0.8421) and SAPS III (0.8389) with DeLong p < 0.001 for both comparisons. Subgroup analyses across age, sex, and diagnostic categories confirmed consistent discriminative performance. These results demonstrate that temporal documentation patterns generalize across healthcare systems, EHR platforms, and national contexts, establishing the IDI as a robust, equipment-independent ICU mortality predictor.`,
    keyFindings: [
      { label: "HiRID AUROC", value: "0.9063", detail: "n=33,897 (Switzerland)" },
      { label: "MIMIC-IV AUROC", value: "0.640", detail: "95% CI: 0.62–0.66" },
      { label: "vs APACHE IV", value: "0.8421", detail: "DeLong p < 0.001" },
      { label: "vs SAPS III", value: "0.8389", detail: "DeLong p < 0.001" },
    ],
    cohort: "n=60,050 (26,153 MIMIC-IV + 33,897 HiRID)",
    database: "MIMIC-IV v2.2 + HiRID (University Hospital Bern)",
    period: "2008–2019 (MIMIC-IV) + 2008–2016 (HiRID)",
    validation: "Random 80/20 split (MIMIC-IV) + full external validation (HiRID)",
    features: "45 temporal features after leakage screening (from 80+ candidates)",
    funding: "NIH AIM-AHEAD · Award No. 1OT2OD032581",
    irb: "IRB Protocol #2025-IRB-0142",
    patentLink: "Patent Application #1",
  },
  {
    id: "jama-no",
    title: "Racial and Ethnic Disparities in ICU Documentation Patterns: Implications for AI-Driven Clinical Decision Support",
    journal: "JAMA Network Open",
    authors: "Collier, A. M.",
    status: "Under Review",
    statusColor: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400",
    submittedDate: "2026",
    doi: null,
    abstract: `This study examines racial and ethnic disparities in ICU documentation patterns and their implications for AI-driven clinical decision support systems. Using large-scale EHR data, the analysis reveals systematic differences in documentation frequency, timing, and completeness across demographic groups — differences that can propagate bias into downstream predictive models. The findings underscore the need for equity-aware AI development frameworks that account for documentation disparities at the feature engineering stage.`,
    keyFindings: [
      { label: "Focus", value: "Disparities", detail: "Racial & ethnic" },
      { label: "Domain", value: "ICU Docs", detail: "Documentation patterns" },
      { label: "Impact", value: "AI Bias", detail: "Feature-level propagation" },
      { label: "Framework", value: "Equity", detail: "Fairness-aware AI" },
    ],
    cohort: "Multi-center ICU cohort",
    database: "MIMIC-IV + eICU",
    period: "2008–2019",
    validation: "Subgroup equity analysis",
    features: "Documentation pattern disparities across demographics",
    funding: "NIH AIM-AHEAD · Award No. 1OT2OD032581",
    irb: "IRB Protocol #2025-IRB-0142",
    patentLink: "Equity Framework",
  },
  {
    id: "esdbi",
    title: "Extended Standardized Documentation Burden Index (ESDBI): A Preprint",
    journal: "Preprint",
    authors: "Collier, A. M.",
    status: "Preprint Available",
    statusColor: "bg-blue-500/15 text-blue-700 border-blue-500/30 dark:text-blue-400",
    submittedDate: "2026",
    doi: "10.64898/2026.02.10.26345827",
    abstract: `The Extended Standardized Documentation Burden Index (ESDBI) extends the documentation burden measurement framework to standardized, cross-institutional comparison. This preprint presents the methodological foundation and initial validation results for scalable burden quantification across diverse EHR systems.`,
    keyFindings: [
      { label: "Status", value: "Preprint", detail: "DOI assigned" },
      { label: "Focus", value: "ESDBI", detail: "Standardized burden index" },
      { label: "Scope", value: "Cross-site", detail: "Multi-institutional" },
      { label: "Framework", value: "Scalable", detail: "EHR-agnostic" },
    ],
    cohort: "Multi-institutional",
    database: "Multiple EHR systems",
    period: "2024–2026",
    validation: "Cross-institutional standardization",
    features: "Extended documentation burden metrics",
    funding: "NIH AIM-AHEAD · Award No. 1OT2OD032581",
    irb: "IRB Protocol #2025-IRB-0142",
    patentLink: "Patent Application #5",
  },
  {
    id: "dbs-ania",
    title: "Human-Centered AI to Reduce Nursing Workload: Two-Stage Validation of a Documentation Burden Score",
    journal: "Research Letter — ANIA 2026",
    authors: "Collier, A. M.",
    status: "Pending Presentation",
    statusColor: "bg-purple-500/15 text-purple-700 border-purple-500/30 dark:text-purple-400",
    submittedDate: "2026",
    doi: null,
    abstract: `This research letter presents a two-stage validation of the Documentation Burden Score (DBS) system for proactive nursing workforce planning. Internal validation on MIMIC-IV (n=24,689) achieved an AUROC of 0.802, while external validation on eICU (n=3,673 across 172 hospitals) achieved an AUROC of 0.758 with a negative predictive value of 0.947. The DBS demonstrates practical utility for identifying high-burden documentation scenarios before they impact care quality.`,
    keyFindings: [
      { label: "Internal AUROC", value: "0.802", detail: "MIMIC-IV · n=24,689" },
      { label: "External AUROC", value: "0.758", detail: "eICU · n=3,673" },
      { label: "NPV", value: "0.947", detail: "Superior safety profile" },
      { label: "Hospitals", value: "172", detail: "Multi-center external" },
    ],
    cohort: "n=28,362 (24,689 MIMIC-IV + 3,673 eICU)",
    database: "MIMIC-IV + eICU Collaborative Research Database",
    period: "2008–2019",
    validation: "Two-stage: internal (MIMIC-IV) + external (eICU, 172 hospitals)",
    features: "Documentation Burden Score™ system",
    funding: "NIH AIM-AHEAD · Award No. 1OT2OD032581",
    irb: "IRB Protocol #2025-IRB-0142",
    patentLink: "Patent Application #5",
  },
];

const PublicationCard = ({ pub, index }: { pub: typeof publications[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.15, duration: 0.5 }}
  >
    <Card className="border-border/50 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
              <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <Badge className={`text-[10px] mb-2 ${pub.statusColor}`}>
                <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                {pub.status}
              </Badge>
              <CardTitle className="text-lg font-bold leading-snug">{pub.title}</CardTitle>
              <p className="text-sm text-primary font-semibold mt-1">{pub.journal}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {pub.authors} · {pub.submittedDate}
                {pub.doi && (
                  <>
                    {" · "}
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      DOI: {pub.doi}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Abstract */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Abstract
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{pub.abstract}</p>
        </div>

        {/* Key Findings */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Key Findings
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pub.keyFindings.map((f) => (
              <div key={f.label} className="bg-muted/50 rounded-xl p-3 text-center border border-border/40">
                <p className="text-xl font-bold text-foreground">{f.value}</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{f.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Study Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: Users, label: "Cohort", value: pub.cohort },
            { icon: Database, label: "Database", value: pub.database },
            { icon: Calendar, label: "Study Period", value: pub.period },
            { icon: CheckCircle2, label: "Validation", value: pub.validation },
          ].map((detail) => (
            <div key={detail.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
              <detail.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-foreground">{detail.label}</p>
                <p className="text-xs text-muted-foreground">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer meta */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
          <Badge variant="outline" className="text-[10px]">{pub.features}</Badge>
          <Badge variant="outline" className="text-[10px]">{pub.funding}</Badge>
          <Badge variant="outline" className="text-[10px]">{pub.irb}</Badge>
          <Badge variant="outline" className="text-[10px] text-primary border-primary/30">{pub.patentLink}</Badge>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Publications = () => (
  <SiteLayout
    title="Publications"
    description="Peer-reviewed research manuscripts for VitaSignal™. JAMIA, npj Digital Medicine, and JAMA Network Open studies validating equipment-independent clinical AI."
  >
    <Helmet>
      <meta name="keywords" content="IDI, Intensive Documentation Index, DBS, Documentation Burden Score, ICU mortality prediction, JAMIA, npj Digital Medicine, JAMA Network Open, MIMIC-IV, HiRID, clinical AI research" />
    </Helmet>

    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Research
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            Publications
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Peer-reviewed manuscripts and preprints documenting the development, validation, and 
            equity analysis of the VitaSignal™ clinical intelligence systems.
          </p>
        </motion.div>

        {/* Research overview */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-primary/5 rounded-xl p-5 border border-primary/20 mb-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: "5", label: "Manuscripts" },
              { value: "93K+", label: "Total Patients" },
              { value: "3", label: "International Databases" },
              { value: "0.683–0.906", label: "AUROC Range" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Publication cards */}
        <div className="space-y-8">
          {publications.map((pub, i) => (
            <PublicationCard key={pub.id} pub={pub} index={i} />
          ))}
        </div>

        {/* Methodology note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-10 bg-muted/40 rounded-xl p-5 border border-border/30 text-xs text-muted-foreground leading-relaxed"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <strong className="text-foreground">Note:</strong> Manuscripts are under peer review or pending presentation. 
              Findings are pre-publication and subject to revision. All research was conducted under IRB approval 
              (Protocol #2025-IRB-0142) using de-identified public datasets. This research is supported by 
              NIH AIM-AHEAD (Award No. 1OT2OD032581). VitaSignal™ is not FDA-cleared and is not a medical device.
              All technology is patent-pending with USPTO patent applications filed.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </SiteLayout>
);

export default Publications;
