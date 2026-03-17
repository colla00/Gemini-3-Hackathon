import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check, Clock, Mic } from 'lucide-react';

interface Script {
  id: string;
  title: string;
  category: string;
  duration: string;
  audience: string;
  content: string;
  tips: string[];
}

const SCRIPTS: Script[] = [
  {
    id: 'investor-pitch',
    title: 'Seed Round Investor Pitch (3 min)',
    category: 'investor',
    duration: '3 minutes',
    audience: 'VCs, Angel Investors, Health Tech Funds',
    content: `Good [morning/afternoon]. I'm Dr. Alexis Collier, founder of VitaSignal LLC.

Every year, over 250,000 patients die from failure-to-rescue events in U.S. hospitals — deterioration that was happening but wasn't caught in time. The problem isn't a lack of data. It's that current early warning systems require expensive hardware, additional sensors, and complex integrations that 80% of the world's hospitals simply cannot afford.

We've solved this.

VitaSignal is a clinical AI platform that predicts ICU mortality using nothing but the timing patterns of routine nursing documentation — no sensors, no wearables, no additional equipment. The insight is simple but powerful: when a patient deteriorates, nurses instinctively document more frequently and more erratically. That behavioral signature appears in the EHR 4 to 6 hours before vital signs change.

Our flagship system, the Intensive Documentation Index — or IDI — extracts temporal features from EHR timestamps. Our strongest predictor captures the variability of documentation rhythm. In plain English: the more irregular the rhythm of documentation, the higher the mortality risk.

The validation is robust. We've tested across two separate studies: 65,157 patients in MIMIC-IV and HiRID for the IDI system, and 28,362 patients across 172 hospitals in the eICU database for the Documentation Burden Score.

We've filed 11 U.S. provisional patent applications with over 175 claims. We classify as non-device CDS under the 21st Century Cures Act — meaning no 510(k) required.

The business model is three-tier: EHR integration licenses for vendors like Epic and Cerner, hospital system pilots, and research collaborations under MTA. We're developing detailed financial projections as part of our commercialization strategy.

We're NIH-funded through the AIM-AHEAD CLINAQ Fellowship at Morehouse School of Medicine. We're pre-market, pre-revenue, and seeking a $3 to $5 million seed round to fund non-provisional patent filings, FDA pre-submission, and our first three hospital pilots.

The opportunity is clear: any hospital that has nurses and an EHR already has everything our system needs. That's every hospital on earth.

I'd love to discuss how VitaSignal fits your portfolio. Thank you.`,
    tips: [
      'Pause after the patient counts — let the numbers land',
      'Make eye contact when saying "every hospital on earth"',
      'Have the one-pager and NDA ready to hand out immediately after',
      'If asked about competition, pivot to "complementary, not competitive"',
      'Know your cap table and dilution expectations cold',
    ],
  },
  {
    id: 'ania-presentation',
    title: 'ANIA 2026 Conference Presentation (15 min)',
    category: 'conference',
    duration: '15 minutes',
    audience: 'Nursing Informatics Professionals, ANIA 2026 Boston',
    content: `Thank you. I'm Dr. Alexis Collier, and I'm here to present "Human-Centered AI to Reduce Nursing Workload: Two-Stage Validation of a Documentation Burden Score."

Before I begin — a disclosure. I'm the founder of VitaSignal LLC. I've filed 11 U.S. provisional patent applications related to this work, and this research was supported by NIH Agreement 1OT2OD032581 through the AIM-AHEAD CLINAQ Fellowship at Morehouse School of Medicine. Full disclosures are on the handout.

[SLIDE: The Problem]
Let me start with a question: How many of you have felt that EHR documentation takes time away from direct patient care? [Pause for hands]

Nurses spend up to 40% of their shift on documentation. But here's what most people miss — that documentation itself contains a hidden clinical signal.

[SLIDE: The Insight]
When a patient deteriorates, nurses respond. They document more frequently, more urgently, and in a less regular pattern. That behavioral change creates a temporal signature in the EHR — one that appears hours before vital signs change.

We asked: can we quantify that signal? Can we use the rhythm of documentation to predict outcomes — without any additional hardware, any additional sensors, any additional burden on nurses?

[SLIDE: The IDI — Intensive Documentation Index]
The answer is the IDI — 9 temporal features extracted from nursing documentation timestamps during the first 24 hours of ICU stay. These include documentation rate, surveillance gaps, inter-event variability, and burstiness.

Our strongest predictor captures the variability in timing between documentation events. It's not how much nurses document — it's how irregular the rhythm is.

[SLIDE: Validation — MIMIC-IV]
We validated on 26,153 heart failure ICU admissions from MIMIC-IV, 2008 to 2019. Using temporal validation — training on 2008 through 2018, testing on 2019 — our IDI-enhanced model improved AUC from 0.658 to 0.683, a statistically significant gain by DeLong test, p less than 0.05.

We also performed 12-year leave-one-year-out cross-validation: mean AUC 0.684, standard deviation 0.008. Consistent performance year over year.

[SLIDE: The DBS — Documentation Burden Score]
Building on the IDI, we developed the Documentation Burden Score — a system that quantifies documentation burden and predicts staffing needs. We validated the DBS on the eICU database: 28,362 patients across 172 hospitals.

Results: AUROC 0.758. Negative predictive value: 0.947 at one threshold, 0.924 at another. This means we can reliably identify patients who will NOT experience high documentation burden — enabling proactive staffing decisions before each shift.

[SLIDE: External Validation — HiRID]
For the strongest evidence, we turned to HiRID — the Bern University Hospital dataset. On 33,897 patients, our model demonstrated strong discriminative performance — outperforming APACHE IV and SOFA. Using zero physiological data. Only EHR documentation timestamps.

[SLIDE: Health Equity]
Equity was not an afterthought. We conducted pre-specified stratified analysis across racial and ethnic groups. No statistically significant differences in performance. Calibration was near-ideal across all groups.

This matters because our system requires no additional hardware — making it deployable in resource-limited settings where health disparities are greatest.

[SLIDE: Clinical Implications]
Three key takeaways:

First — nursing documentation is not just administrative overhead. It's a clinical signal. We should treat it as such.

Second — equipment-independent AI is possible. Not every solution needs a new sensor or a new device.

Third — reducing documentation burden and improving patient safety are not competing goals. With the right approach, they're the same goal.

[SLIDE: Acknowledgments]
This work was supported by the NIH AIM-AHEAD CLINAQ Fellowship. I want to thank the PhysioNet team for maintaining MIMIC-IV, HiRID, and eICU — the open datasets that made this validation possible.

The preprint is available on medRxiv. The DOI is on your handout. I'm happy to take questions. Thank you.`,
    tips: [
      'Practice the audience question at the start — it builds engagement',
      'Time each slide section: Problem (2 min), IDI (3 min), Validation (4 min), DBS (2 min), Equity (2 min), Conclusion (2 min)',
      'Have printed handouts with QR code to preprint',
      'For Q&A, reference the Q&A Prep section in this hub',
      'Bring backup slides for: SHAP explainability, full feature list, FDA classification details',
    ],
  },
  {
    id: 'patent-attorney',
    title: 'Patent Attorney First Meeting Briefing (20 min)',
    category: 'attorney',
    duration: '20 minutes',
    audience: 'Patent Attorney / IP Counsel',
    content: `Thank you for meeting with me. I'm Dr. Alexis Collier. I have 11 U.S. provisional patent applications that need non-provisional filing strategy, and I have time-sensitive deadlines.

Let me give you the overview, then we can dive into specifics.

[PORTFOLIO OVERVIEW]
I filed 11 provisional applications between December 2025 and February 2026. I'm the sole inventor on all 11. Total claims across the portfolio exceed 175. The underlying technology is an AI platform — VitaSignal — that predicts ICU mortality and nursing documentation burden from EHR timestamp patterns. No hardware required.

[CRITICAL DEADLINES]
My two most urgent deadlines:
— USPTO 63/932,953 (CRIS-E): non-provisional deadline December 6, 2026
— USPTO 63/946,187 (CDS-EQUITY): non-provisional deadline December 21, 2026

These two are the broadest systems and need to be filed first. I need a filing strategy for these within the next 60 days.

[THE 11 APPLICATIONS]
Let me walk through them quickly:

1. CRIS-E — Clinical Risk Intelligence System, Equity Edition. Filed December 2025. Comprehensive clinical decision support with equity monitoring. CRITICAL priority.

2. CDS-EQUITY — Equitable Clinical Decision Support. Filed December 2025. Equity-weighted risk scoring. CRITICAL priority. Consider bundling with CRIS-E.

3. DBS-v2 — Documentation Burden Score version 2. Filed January 2026. ML-based documentation burden quantification. Validated across 172 hospitals. HIGH priority.

4. UNIP — Unified Nursing Intelligence Platform. Filed January 2026. Integration platform connecting all subsystems. HIGH priority. Possible bundle with CDS-EQUITY.

5. IDI — Intensive Documentation Index. Filed February 2026. Foundational patent — temporal features from documentation timestamps predicting ICU mortality. STANDARD priority for NP deadline but HIGH strategic value.

6 through 11 — Six applications filed March 2026, all with March 2027 NP deadlines:
— TRACI — Temporal Risk Assessment with Contextual Intelligence
— ESDBI — EHR-Based Staffing and Documentation Burden Index
— SHQS — Surveillance-Based Healthcare Quality Score
— DTBL — Digital Twin Baseline Learning
— CTCI — Clinical Trial Cohort Intelligence
— SEDR — Syndromic Early Detection and Response

These share common infrastructure and may benefit from a continuation or CIP strategy.

[VALIDATION DATA]
The claims are supported by extensive validation:
— MIMIC-IV: Heart failure ICU patients, 2008–2019
— HiRID: Bern University Hospital, Switzerland
— eICU: 172 U.S. hospitals
— Total validated: ~88K patients across both studies

Key performance: Strong discriminative performance across all validation cohorts. Detailed metrics available under NDA.

[FUNDING & BAYH-DOLE]
This research is supported by an NIH fellowship. Under the Bayh-Dole Act, the U.S. Government retains certain rights. VitaSignal LLC retains commercialization rights as the small business entity. All filings must include proper government rights notices.

[ENTITY STATUS]
VitaSignal LLC is registered in Georgia. EIN is on file. Patent assignment execution is in progress.

[WHAT I NEED FROM YOU]
1. Filing strategy for priority NP filings (CRIS-E and CDS-EQUITY)
2. Bundle/continuation analysis for the Q-2 group
3. Patent assignment execution (Exhibit A for all 11)
4. Prior art search recommendation
5. Cost estimate for non-provisional filings — individual vs. bundled
6. Bayh-Dole compliance review
7. Timeline to have the first two NP applications ready

I have full claim summaries, technical specifications, and validation data available under NDA. What questions do you have?`,
    tips: [
      'Bring printed one-page summary of all 11 patents with deadlines',
      'Have the provisional applications accessible on a laptop',
      'Know your budget range for IP costs',
      'Ask about their experience with software/AI patents specifically',
      'Discuss PCT (international) filing strategy',
      'Ask about design patent possibilities for the dashboard UI',
    ],
  },
  {
    id: 'licensing-conversation',
    title: 'Hospital System / EHR Vendor Licensing Call (10 min)',
    category: 'licensing',
    duration: '10 minutes',
    audience: 'Hospital CIO/CMIO, EHR Vendor Product Teams',
    content: `Thank you for your time. I'm Dr. Alexis Collier, founder of VitaSignal LLC. I understand you're interested in learning more about our clinical AI platform.

Let me give you a quick overview, and then I'd love to hear about your specific challenges.

[THE PROBLEM YOU'RE SOLVING]
Your nurses spend 30 to 40 percent of their shift on documentation. Meanwhile, early warning scores require vital sign monitors, additional hardware, and complex integrations. What if I told you that the documentation itself — specifically, the timing pattern of when nurses document — is a powerful predictor of patient deterioration?

[OUR SOLUTION]
VitaSignal extracts temporal features from existing EHR documentation timestamps. No new hardware. No new sensors. No additional workflow for your clinical staff. We analyze the rhythm of documentation — how frequently nurses document, how regular or irregular the intervals are, where surveillance gaps occur.

Our flagship model, the Intensive Documentation Index, uses 9 timestamp-derived features to predict ICU mortality. The IDI was validated on 65,157 patients across MIMIC-IV and HiRID, achieving an external AUROC of 0.758 on the DBS system across 172 hospitals in the eICU dataset.

[WHY THIS MATTERS TO YOU]
Three value propositions:

First — patient safety. Earlier identification of deteriorating patients. Our temporal signal appears 4 to 6 hours before vital signs change.

Second — staffing optimization. Our Documentation Burden Score provides quartile-based staffing recommendations before each nursing shift. We've validated this across 172 hospitals.

Third — cost savings. We're developing detailed economic models to quantify per-patient savings from reduced ICU length of stay and improved resource allocation.

[INTEGRATION]
We're designed for EHR integration. We read from the chartevents table — or whatever your EHR calls timestamped documentation entries. We don't require HL7 FHIR, though we support it. We don't require real-time vital sign feeds. We need one data source: documentation timestamps.

For Epic shops, this maps to flowsheet entries. For Cerner, it's clinical events. The integration is lightweight because we're reading data that already exists.

[REGULATORY]
We classify as non-device clinical decision support under FDA Section 520(o)(1)(E) of the 21st Century Cures Act. No 510(k) required. Our SHAP-based explainability ensures every prediction is transparent — clinicians can see exactly which documentation patterns drove the risk score.

[ENGAGEMENT MODEL]
We offer three tiers:

1. Hospital System Pilot — $15,000 for a 6-month supervised pilot on one unit. We handle integration, training, and outcome tracking.

2. EHR Integration License — for vendors who want to embed our algorithms directly into their platform. Enterprise pricing, custom terms.

3. Research Collaboration — for academic medical centers interested in validating on their own data. MTA/DUA required.

All engagements begin with a technical review under NDA. We provide full documentation of our methodology, validation results, and patent-pending technology.

[NEXT STEPS]
I'd suggest a 30-minute technical deep dive with your informatics team. We can walk through the architecture, show you the SHAP explainability layer, and discuss integration specifics for your EHR environment.

What questions do you have? And can you tell me a bit about your current early warning system and where the pain points are?`,
    tips: [
      'Ask about THEIR current early warning system first if possible',
      'Have ROI calculator ready to customize with their bed count',
      'Know the difference between Epic, Cerner, and MEDITECH integration paths',
      'Don\'t quote specific pricing beyond the pilot — say "custom terms" for enterprise',
      'If they ask about competitors, emphasize "complementary to existing EWS, not replacement"',
      'Follow up within 24 hours with NDA and technical overview document',
    ],
  },
  {
    id: 'conference-qa',
    title: 'Conference Q&A Response Drills',
    category: 'conference',
    duration: '5–10 minutes prep',
    audience: 'Conference Audiences (ANIA, AMIA, SIIM)',
    content: `Practice these responses out loud. Each should be delivered in 30–60 seconds.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: "Why would documentation timing predict mortality better than vital signs?"

A: "Great question. Nursing documentation is discretionary — nurses choose when to document based on clinical judgment. When a patient deteriorates, nurses respond by documenting more frequently and more erratically. Our strongest predictor, the coefficient of variation of inter-event intervals, captures exactly this irregularity — OR 1.53 per standard deviation. Vital signs are measured at fixed intervals by protocol. Documentation rhythm is a purer signal of perceived acuity because it's driven by clinical intuition, not a schedule."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: "The AUC improvement is only 0.025 — isn't that trivial?"

A: "I appreciate the rigor of that question. Three points. First, it's statistically significant — p less than 0.05 by DeLong test with 12-year temporal validation. Second, at 80% specificity, sensitivity improved from 42% to 47% — in a population of 26,000 ICU patients at 16% mortality, that's hundreds of additional correctly identified at-risk patients. Third, this comes from a feature that costs nothing to extract and requires zero additional burden. It's a free add-on that improves any existing model."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: "How is this different from Epic's Deterioration Index?"

A: "Three key differences. First, equipment independence — Epic's DI requires vital signs, labs, and often ventilator data. Ours uses only timestamps. Second, we measure nursing surveillance behavior, not patient physiology — it's a complementary, additive signal. Third, resource equity — 80% of the world's hospitals can't afford the hardware ecosystem that traditional AI requires. Our system works with any EHR that records timestamped entries."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: "Is this FDA regulated?"

A: "Our system qualifies as non-device clinical decision support under Section 520(o)(1)(E) of the 21st Century Cures Act. This exemption applies because we don't replace clinical judgment, we display the basis for all recommendations through SHAP explainability, and we don't process medical images or signals. So no — no 510(k) required."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: "What about algorithmic bias?"

A: "Equity was pre-specified, not post-hoc. We stratified by race and ethnicity across all MIMIC-IV groups. No statistically significant differences in performance across demographic subgroups. Calibration was near-ideal across all groups. The IDI improvement was consistent across demographics. This equity validation is central to our value proposition and directly aligns with our NIH funding."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: "What datasets did you use?"

A: "Three publicly available databases through PhysioNet. MIMIC-IV from Beth Israel Deaconess — our primary development cohort. HiRID from Bern University Hospital in Switzerland — our external validation. And the eICU Collaborative Research Database — 172 hospitals for the DBS external validation. Total validated cohort: approximately 88,000 patients across both studies."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: "Can you explain the 9 IDI features?"

A: "All features are derived from nursing documentation timestamps in the first 24 hours. They cover documentation volume, surveillance gaps, rhythm analysis, and burstiness patterns. No clinical content is analyzed — only the timing. Detailed feature specifications are available under NDA."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: "Who funds this work?"

A: "NIH-funded research fellowship through Morehouse School of Medicine. Standard Bayh-Dole applies — the government retains certain rights, VitaSignal LLC retains commercialization rights. No industry funding, no conflicts beyond my own patent applications and company."`,
    tips: [
      'Practice each answer with a timer — target 30-45 seconds max',
      'Start every answer by acknowledging the question positively',
      'Have key talking points memorized: validation scope, 172 hospitals, equipment-independent',
      'If you don\'t know an answer, say "That\'s a great question — I\'d love to follow up with you after with the specific data"',
      'Keep a "parking lot" notepad for questions you want to address later',
    ],
  },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  investor: { label: 'Investor', color: '#10b981' },
  conference: { label: 'Conference', color: '#3b82f6' },
  attorney: { label: 'Legal / IP', color: '#8b5cf6' },
  licensing: { label: 'Licensing', color: '#f59e0b' },
};

const HubScripts = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Practice Scripts</h2>
        <p className="text-white/40 text-sm mt-1">Pre-written scripts for investor pitches, conferences, attorney meetings, and licensing calls</p>
      </div>

      <div className="space-y-3">
        {SCRIPTS.map(script => {
          const expanded = expandedId === script.id;
          const cat = CATEGORY_LABELS[script.category];
          return (
            <div key={script.id} className="rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
              {/* Header */}
              <button
                onClick={() => setExpandedId(expanded ? null : script.id)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
              >
                {expanded ? <ChevronDown className="w-4 h-4 text-white/40 shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/40 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{script.title}</p>
                  <p className="text-xs text-white/30 mt-0.5">{script.audience}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: cat?.color, background: `${cat?.color}15` }}>
                    {cat?.label}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-white/30">
                    <Clock className="w-3 h-3" /> {script.duration}
                  </span>
                </div>
              </button>

              {/* Expanded content */}
              {expanded && (
                <div className="border-t border-white/8">
                  {/* Copy button */}
                  <div className="px-5 pt-3 flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(script.content, script.id)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/30 transition-colors font-medium"
                    >
                      {copiedId === script.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === script.id ? 'Copied!' : 'Copy Full Script'}
                    </button>
                    <span className="text-[10px] text-white/40">Paste into notes or teleprompter</span>
                  </div>

                  {/* Script text */}
                  <div className="px-5 py-4">
                    <pre className="whitespace-pre-wrap text-sm text-white/70 leading-relaxed font-sans">{script.content}</pre>
                  </div>

                  {/* Practice tips */}
                  {script.tips.length > 0 && (
                    <div className="px-5 pb-4">
                      <div className="rounded-lg border border-white/8 p-4" style={{ background: 'rgba(0,200,180,0.03)' }}>
                        <p className="text-xs font-semibold flex items-center gap-1.5 mb-2" style={{ color: '#00c8b4' }}>
                          <Mic className="w-3.5 h-3.5" /> Practice Tips
                        </p>
                        <ul className="space-y-1.5">
                          {script.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-white/40 flex items-start gap-2">
                              <span className="text-white/20 shrink-0">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HubScripts;
