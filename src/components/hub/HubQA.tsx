import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const qaItems = [
  {
    q: 'Why would documentation timing predict mortality better than vital signs?',
    a: `Nursing documentation is discretionary — nurses choose WHEN to document based on clinical judgment. When a patient deteriorates, nurses respond by documenting more frequently, more urgently, and in a less regular pattern — creating an erratic temporal signature. Our strongest predictor, the coefficient of variation of inter-event intervals (idi_cv_interevent, OR 1.53), captures exactly this irregularity. Vital signs are measured at fixed intervals by protocol. Documentation rhythm is a purer signal of perceived acuity because it's driven by clinical intuition rather than a schedule.`,
  },
  {
    q: 'What exactly are the 9 IDI features?',
    a: `All 9 features are extracted from nursing documentation timestamps (the 'chartevents' table in MIMIC-IV) during the first 24 hours of ICU stay:
1. idi_events_24h — total documentation events
2. idi_events_per_hour — documentation rate
3. idi_max_gap_min — longest surveillance gap (minutes)
4. idi_gap_count_60m — gaps over 60 minutes
5. idi_gap_count_120m — gaps over 120 minutes
6. idi_mean_interevent_min — average time between events
7. idi_std_interevent_min — standard deviation of intervals
8. idi_cv_interevent — coefficient of variation (strongest predictor)
9. idi_burstiness — burstiness index B = (σ−μ)/(σ+μ), range −1 to +1`,
  },
  {
    q: 'Is this FDA regulated? Do you need 510(k) clearance?',
    a: `No. Our system qualifies as non-device clinical decision support under FDA §520(o)(1)(E) of the 21st Century Cures Act. This exemption applies to software that: (a) is not intended to replace clinical judgment, (b) displays the basis for recommendations so clinicians can independently review them, and (c) is not intended to acquire, process, or analyze medical images or signals. Our SHAP-based explainability ensures full transparency of every prediction, which is a core requirement for this classification.`,
  },
  {
    q: "How is this different from Epic's Deterioration Index or the Rothman Index?",
    a: `Three key differences: (1) Equipment independence — Epic DI and Rothman require vital signs, labs, and often ventilator data. Our IDI uses only EHR timestamps. (2) Nursing-specific signal — we measure nursing surveillance behavior, not patient physiology. This is a complementary, additive signal. (3) Resource equity — 80% of the world's hospitals cannot afford the hardware ecosystem required by traditional AI. Our system works with any EHR that records timestamped entries.`,
  },
  {
    q: 'Why does the AUC improvement seem modest (0.025)?',
    a: `Three points: (1) Statistical significance: p<0.05 by DeLong test with 12-year temporal validation — this is a robust, reproducible finding. (2) Clinical context: at 80% specificity, sensitivity improved from 42% to 47% — in a population of 26,153 ICU patients at 16% mortality, that 5-point sensitivity gain translates to hundreds of additional correctly identified deaths. (3) Additive value: IDI is designed to augment, not replace, existing risk scores. The modest incremental gain from a zero-cost, zero-burden feature is clinically meaningful. Think of IDI as a free add-on that improves any existing model.`,
  },
  {
    q: 'How do you handle algorithmic bias / health equity?',
    a: `Proactively. We conducted pre-specified equity analysis stratified by race and ethnicity across all patient groups in MIMIC-IV. AUC range: 0.673 (Black patients) to 0.691 (Hispanic patients) — no statistically significant differences (p=0.82 for interaction). Calibration slopes were near-ideal (0.96–1.01) for all groups. The IDI improvement was consistent across all groups (+0.025 to +0.028 ΔAUC). This equity validation is central to our value proposition — and directly aligns with our NIH AIM-AHEAD funding for equity-centered AI.`,
  },
  {
    q: 'What datasets did you use and how do I access them?',
    a: `Three databases, all publicly available through PhysioNet after CITI training and DUA:
• MIMIC-IV v2.2 — Beth Israel Deaconess Medical Center, Boston — 2008–2019 — physionet.org/content/mimiciv/2.2/
• HiRID v1.1.1 — Bern University Hospital, Switzerland — physionet.org/content/hirid/1.1.1/
• eICU Collaborative Research Database — 335 ICUs across 208 U.S. hospitals — used for DBS validation (172 hospitals subset)`,
  },
  {
    q: "What's the licensing model?",
    a: `Three tiers: (1) EHR Integration License — for vendors embedding IDI/DBS directly into their platform — enterprise pricing, custom terms. (2) Hospital System Pilot — $15,000 one-time pilot fee, 6 months, fully supervised. (3) Research Collaboration — MTA/DUA required. All engagements begin with full documentation under NDA. Contact: info@vitasignal.ai`,
  },
  {
    q: 'Tell me about your patent portfolio.',
    a: `11 U.S. provisional patent applications filed between December 2025 and February 2026. Sole inventor: Dr. Alexis Collier. Total claims: 175+. The two most critical NP deadlines are December 6 and December 21, 2026 (USPTO 63/932,953 and 63/946,187). The foundational IDI patent is 63/976,293, filed February 5, 2026. We are currently engaging a patent attorney for non-provisional filing strategy. Under NDA, we provide full claim summaries, filing dates, and technical specifications.`,
  },
  {
    q: 'Who funds this research?',
    a: `Primary funding: NIH AIM-AHEAD CLINAQ Fellowship, Agreement No. 1OT2OD032581, administered through Morehouse School of Medicine. This is federal funding, which means the U.S. Government retains certain rights to the inventions under the Bayh-Dole Act — standard for NIH-funded research. VitaSignal LLC retains commercialization rights as the small business entity. Additional funding support has been provided through the CLINAQ Consortium fellowship program.`,
  },
];

const HubQA = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Likely Questions & Expert Answers</h1>
        <p className="text-sm text-white/50 mt-1">Prepare for investor meetings, patent attorney briefings, conference Q&A, and licensing conversations</p>
      </div>

      <div className="space-y-2">
        {qaItems.map((item, i) => (
          <div key={i} className="rounded-xl border border-white/10" style={{ background: '#151f35' }}>
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-start gap-3 px-5 py-4 text-left"
            >
              {openIdx === i
                ? <ChevronDown className="w-4 h-4 mt-0.5 text-white/50 shrink-0" />
                : <ChevronRight className="w-4 h-4 mt-0.5 text-white/50 shrink-0" />
              }
              <span className="text-sm font-semibold text-white">Q{i + 1}: "{item.q}"</span>
            </button>
            {openIdx === i && (
              <div className="px-5 pb-5 pl-12">
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HubQA;
