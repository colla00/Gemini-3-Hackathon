import { SiteLayout } from "@/components/layout/SiteLayout";
import { Helmet } from "react-helmet-async";
import { Shield, AlertTriangle, FileText, Users, Scale, Eye, CheckCircle2, Mail } from "lucide-react";

const sections = [
  {
    id: "purpose",
    icon: Shield,
    title: "1. Purpose & Scope",
    content: `This Conflict of Interest (COI) Policy establishes standards and procedures to identify, disclose, manage, and mitigate actual or potential conflicts of interest that may arise in the course of VitaSignal LLC's operations, research activities, clinical algorithm development, and commercial partnerships.

This policy applies to all officers, directors, employees, contractors, advisors, consultants, and any individual acting on behalf of VitaSignal LLC ("Covered Persons"). It extends to all activities including but not limited to: clinical AI research and development, patent prosecution, regulatory submissions, licensing negotiations, investor relations, and conference presentations.`,
  },
  {
    id: "definitions",
    icon: Scale,
    title: "2. Definitions",
    content: null,
    subsections: [
      {
        subtitle: "Conflict of Interest",
        text: "A situation in which a Covered Person's private interests — financial, professional, or personal — could improperly influence, or reasonably appear to influence, the objective exercise of their duties to VitaSignal LLC.",
      },
      {
        subtitle: "Financial Interest",
        text: "Any ownership, investment, compensation arrangement, or other economic interest in an entity that conducts business with, competes with, or is regulated by VitaSignal LLC. This includes stock, stock options, partnership interests, consulting fees, honoraria, and gifts exceeding $250 in aggregate annual value.",
      },
      {
        subtitle: "Related Party",
        text: "A spouse, domestic partner, parent, child, sibling, or any person sharing the same household as a Covered Person, or any entity in which a Covered Person or their Related Party holds a significant financial interest (≥5% ownership or >$10,000 in annual compensation).",
      },
      {
        subtitle: "Institutional Conflict",
        text: "A situation where VitaSignal LLC's financial interests, or the interests of its leadership, could compromise — or appear to compromise — the integrity of research, regulatory submissions, clinical algorithm validation, or licensing decisions.",
      },
    ],
  },
  {
    id: "disclosure",
    icon: Eye,
    title: "3. Disclosure Requirements",
    content: null,
    subsections: [
      {
        subtitle: "Annual Disclosure",
        text: "All Covered Persons must complete a Conflict of Interest Disclosure Form annually, or within 30 days of a material change in circumstances. Disclosures are reviewed by the designated Compliance Officer (or, for early-stage operations, the Chief Executive).",
      },
      {
        subtitle: "Event-Driven Disclosure",
        text: "Covered Persons must promptly disclose any new conflict or potential conflict as it arises — including prior to entering negotiations with potential licensees, pilot partners, investors, or research collaborators.",
      },
      {
        subtitle: "Research & Publication Disclosure",
        text: "All conference submissions, peer-reviewed publications, and regulatory filings must include a COI disclosure statement. For clinical AI research, this includes disclosure of any financial relationship with EHR vendors, hospital systems, or competing clinical AI companies whose data or products are referenced.",
      },
      {
        subtitle: "Patent & IP Disclosure",
        text: "Any Covered Person involved in patent prosecution or IP licensing must disclose relationships with patent examiners, attorneys, licensees, or entities that could benefit from specific patent claim structures.",
      },
    ],
  },
  {
    id: "prohibited",
    icon: AlertTriangle,
    title: "4. Prohibited Activities",
    content: `The following activities are prohibited unless specifically approved in writing by the Compliance Officer after full disclosure and implementation of a management plan:

• Participating in licensing negotiations with entities in which the Covered Person holds a financial interest
• Using VitaSignal proprietary data, algorithms, or trade secrets for personal gain or the benefit of a competing entity
• Accepting compensation, gifts, or hospitality exceeding $250 from any current or prospective licensee, partner, vendor, or investor
• Serving as an officer, director, or consultant of a competing clinical AI company
• Directing research outcomes to favor a specific commercial partner or licensee
• Using non-public validation data or regulatory strategy information for personal investment decisions
• Hiring or contracting with Related Parties without prior disclosure and approval`,
  },
  {
    id: "management",
    icon: Users,
    title: "5. Management & Mitigation Procedures",
    content: null,
    subsections: [
      {
        subtitle: "Review Process",
        text: "Upon receiving a disclosure, the Compliance Officer will assess the nature and severity of the conflict, determine whether it can be managed or must be eliminated, and document the decision. For conflicts involving the Compliance Officer, review is escalated to the Board of Directors or an independent advisor.",
      },
      {
        subtitle: "Management Plans",
        text: "Where a conflict can be managed rather than eliminated, a written management plan will specify: (a) the nature of the conflict; (b) restrictions on the Covered Person's participation in affected decisions; (c) monitoring mechanisms; (d) duration of the plan; and (e) consequences for non-compliance.",
      },
      {
        subtitle: "Recusal",
        text: "Covered Persons with disclosed conflicts must recuse themselves from any decision, vote, negotiation, or review where the conflict could influence outcomes. Recusal must be documented in meeting minutes or decision records.",
      },
      {
        subtitle: "Research Integrity Safeguards",
        text: "For conflicts related to clinical algorithm validation or research: independent replication by a non-conflicted team member is required; all validation datasets, preprocessing steps, and model parameters must be documented to enable audit; and external review may be required for high-severity conflicts.",
      },
    ],
  },
  {
    id: "enforcement",
    icon: FileText,
    title: "6. Enforcement & Consequences",
    content: `Failure to disclose a conflict of interest, or violation of a management plan, may result in:

• Formal written warning
• Removal from affected projects, negotiations, or committees
• Modification or termination of employment or contractor agreement
• Recovery of any financial benefit obtained through the undisclosed conflict
• Referral to legal counsel for potential civil or criminal liability

All enforcement actions will be documented and retained in accordance with VitaSignal's data retention policies. Retaliation against any person who reports a potential conflict in good faith is strictly prohibited.`,
  },
  {
    id: "governance",
    icon: CheckCircle2,
    title: "7. Governance & Review",
    content: `This policy is reviewed annually by the Compliance Officer and updated as necessary to reflect changes in applicable law, regulatory guidance (including FDA, OIG, and CMS requirements), and VitaSignal's organizational structure.

All amendments to this policy require approval by the Chief Executive or Board of Directors and will be communicated to all Covered Persons within 30 days of adoption.

Records of all disclosures, management plans, and enforcement actions are retained for a minimum of seven (7) years.`,
  },
];

const ConflictOfInterest = () => {
  return (
    <SiteLayout
      title="Conflict of Interest Policy"
      description="VitaSignal LLC's Conflict of Interest Policy establishes standards for identifying, disclosing, and managing conflicts in clinical AI research, licensing, and operations."
    >
      <Helmet>
        <meta name="keywords" content="conflict of interest policy, VitaSignal compliance, clinical AI ethics, research integrity, COI disclosure" />
      </Helmet>

      {/* Header */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary mb-3">Governance</p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">Conflict of Interest Policy</h1>
          <p className="text-muted-foreground text-sm mb-4">
            VitaSignal LLC is committed to conducting its research, development, and commercial activities with the highest ethical standards. This policy ensures that decisions are made objectively and free from improper influence.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Effective: March 17, 2026</span>
            <span className="text-border">|</span>
            <span>Version 1.0</span>
            <span className="text-border">|</span>
            <span>Next Review: March 2027</span>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 px-6 border-b border-border/40">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contents</p>
          <div className="grid sm:grid-cols-2 gap-1">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-sm text-primary hover:underline py-1">
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.id} id={section.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                </div>

                {section.content && (
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pl-12">
                    {section.content}
                  </div>
                )}

                {section.subsections && (
                  <div className="space-y-5 pl-12">
                    {section.subsections.map((sub, i) => (
                      <div key={i}>
                        <h3 className="text-sm font-semibold text-foreground mb-1">{sub.subtitle}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{sub.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Contact */}
          <div className="rounded-xl border border-border/50 bg-card p-6 mt-12">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Questions or Disclosures</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To submit a COI disclosure, report a potential conflict, or ask questions about this policy, contact the Compliance Officer at{" "}
                  <a href="mailto:compliance@vitasignal.ai" className="text-primary hover:underline">compliance@vitasignal.ai</a>.
                  All disclosures are treated as confidential to the extent permitted by law.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-muted-foreground/60 text-center pt-6 border-t border-border/30">
            This policy is an internal governance document of VitaSignal LLC. It does not create any rights enforceable by third parties. VitaSignal reserves the right to amend this policy at any time.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default ConflictOfInterest;
