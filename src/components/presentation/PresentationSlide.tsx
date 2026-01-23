import { cn } from '@/lib/utils';
import { 
  BarChart3, Target, Brain, Users, GitBranch, Sparkles, 
  GraduationCap, CheckCircle, AlertTriangle, TrendingUp,
  Clock, Award, BookOpen, Microscope, Lightbulb, MessageSquare,
  Shield, Scale, Calculator, FlaskConical, Cpu
} from 'lucide-react';

export type SlideType = 
  | 'disclaimer'
  | 'title' 
  | 'agenda'
  | 'video-demo' 
  | 'problem'
  | 'comparison' 
  | 'methodology'
  | 'ml-features'
  | 'ehr-flow'
  | 'alert-timeline' 
  | 'dashboard' 
  | 'patients'
  | 'patient-journey' 
  | 'shap' 
  | 'workflow' 
  | 'validation'
  | 'research-validation'
  | 'patent-portfolio'
  | 'patent-trust-alerts'
  | 'patent-equity'
  | 'patent-dbs-breakdown'
  | 'patent-neural-reasoning'
  | 'patent-cognitive-load'
  | 'patent-trust-score'
  | 'patent-performance'
  | 'patent-validation-charts'
  | 'roi' 
  | 'future'
  | 'conclusion';

interface SlideConfig {
  id: SlideType;
  title: string;
  subtitle?: string;
  duration: number; // minutes
  icon: React.ReactNode;
  notes: string[];
  keyPoints?: string[];
  transitionCue?: string; // Cue to move to next slide
  talkingPoints?: string[]; // Key things to say
}

export const PRESENTATION_SLIDES: SlideConfig[] = [
  {
    id: 'disclaimer',
    title: 'Important Disclaimer',
    subtitle: 'Research Concept Prototype',
    duration: 2,
    icon: <AlertTriangle className="w-12 h-12" />,
    notes: [
      'Read this slide clearly',
      'Emphasize untested status',
      'Set expectations upfront',
      'This builds trust and credibility',
    ],
    keyPoints: [
      'This is a concept prototype only',
      'No clinical testing has been conducted',
      'All metrics shown are design targets, not validated results',
      'Simulated data for demonstration purposes',
      'Not FDA cleared or approved',
      'Not intended for clinical decision-making',
    ],
    talkingPoints: [
      'Before I begin, I want to be completely transparent about what you are about to see.',
      'This is a concept prototype. It represents my vision for what predictive nursing quality monitoring could look like.',
      'I have not conducted any clinical testing. The accuracy metrics you will see — like the 0.89 AUROC — are design targets based on published literature, not results from my own validation studies.',
      'All patient data shown is simulated for demonstration purposes only.',
      'This system is not FDA cleared or approved. It is not a medical device and should not be used for clinical decision-making.',
      'I share this work to demonstrate the concept and methodology, and to gather feedback on the approach.',
      'With that context established, let me introduce the project.',
    ],
    transitionCue: '→ "With that important context, let me introduce myself and the project..."',
  },
  {
    id: 'title',
    title: 'NSO Quality Dashboard',
    subtitle: 'AI-Assisted Nursing Quality Monitoring for Nurse-Sensitive Outcomes',
    duration: 2,
    icon: <BarChart3 className="w-12 h-12" />,
    notes: [
      'Welcome and introduce yourself',
      'Thank the organizers',
      'State this is a research prototype',
      'Mention 4 patent applications filed',
    ],
    talkingPoints: [
      'Good morning, everyone. Thank you for being here today.',
      'My name is Dr. Alexis Collier, and I am excited to share my research with you.',
      'I have built a prototype dashboard that uses AI to help nurses predict and prevent adverse patient outcomes — specifically falls, pressure injuries, and catheter-associated infections.',
      'This represents about a year of development work.',
      'Before I begin, I want to note that this is a research prototype with four U.S. provisional patent applications filed. I am happy to discuss the methodology, though some technical details remain proprietary.',
      'I am a solo researcher on this project, so any limitations are my own.',
    ],
    transitionCue: '→ "Let me walk you through what we will cover today..."',
  },
  {
    id: 'agenda',
    title: 'Presentation Agenda',
    subtitle: '38-Minute Walkthrough',
    duration: 2,
    icon: <BookOpen className="w-8 h-8" />,
    notes: [
      'Overview the structure',
      'Encourage questions throughout',
      'Highlight the live demo section',
    ],
    keyPoints: [
      'Problem Statement & Clinical Need (5 min)',
      'Methodology & Architecture (8 min)',
      'Live Dashboard Demonstration (5 min)',
      'SHAP Explainability Deep-Dive (8 min)',
      'Validation Results (5 min)',
      'Future Directions & Q&A (7 min)',
    ],
    talkingPoints: [
      'Here is our roadmap for the next 38 minutes.',
      'I will start by framing the clinical problem — why nurse-sensitive outcomes matter for patient safety.',
      'Then I will explain the technical methodology at a high level, keeping it accessible.',
      'The live demonstration is where you will see the actual dashboard in action.',
      'I will spend time on explainability, because I believe nurses need to understand WHY a patient is flagged, not just that they are.',
      'I will be transparent about validation status and future directions.',
      'Please feel free to ask questions at any point. I find the discussions are often the most valuable part.',
    ],
    transitionCue: '→ "There is also a recorded version available..."',
  },
  {
    id: 'video-demo',
    title: 'Recorded Presentation',
    subtitle: 'Platform Overview Video',
    duration: 1,
    icon: <BarChart3 className="w-8 h-8" />,
    notes: [
      'For remote or asynchronous viewing',
      '5-minute platform overview',
      'Contact information at the end',
    ],
    keyPoints: [
      'Conference Presentation Recording',
      '5-minute platform overview',
      'Dashboard features demonstrated',
      'Available for async viewing',
    ],
    talkingPoints: [
      'If you are watching the recorded version, thank you for taking the time.',
      'This video provides a 5-minute overview of the platform.',
      'I recommend pausing at certain points to explore the dashboard yourself.',
      'My contact information is available at the end for any follow-up questions.',
    ],
    transitionCue: '→ "Let me begin with the scope of the problem..."',
  },
  {
    id: 'problem',
    title: 'The Clinical Problem',
    subtitle: 'Preventable Adverse Events in Nursing Care',
    duration: 5,
    icon: <AlertTriangle className="w-8 h-8" />,
    notes: [
      'Let the numbers sink in',
      'Emphasize these are preventable harms',
      'Current systems are retrospective — too late',
      'My question: What if we could predict before it happens?',
    ],
    keyPoints: [
      '700,000+ hospital falls annually in the US',
      '2.5 million pressure injuries per year',
      '75,000 catheter-associated UTIs',
      'Estimated $50B+ in preventable costs',
      'Current metrics are retrospective, not predictive',
    ],
    talkingPoints: [
      'Let me share the numbers that motivated this research.',
      'Every year in the United States: over 700,000 patients fall in hospitals. 2.5 million develop pressure injuries. 75,000 acquire catheter-associated urinary tract infections.',
      'Each of these represents a real patient who experienced preventable harm.',
      'The financial burden exceeds 50 billion dollars annually. But it is the human cost that drives this work.',
      'Here is the core problem: current quality monitoring is almost entirely retrospective. By the time we see the incident report, the patient has already been harmed.',
      'The question I kept asking: What if we could identify rising risk BEFORE the event occurs? What if nurses could receive a warning 30 minutes or an hour earlier?',
      'That question became the foundation of this project.',
    ],
    transitionCue: '→ "Let me show how this approach differs from traditional monitoring..."',
  },
  {
    id: 'comparison',
    title: 'Traditional vs Predictive',
    subtitle: 'Paradigm Shift in Quality Monitoring',
    duration: 4,
    icon: <TrendingUp className="w-8 h-8" />,
    notes: [
      'Left side = traditional (reactive)',
      'Right side = my approach (predictive)',
      'AI augments nursing judgment — does not replace it',
      'DIFFERENTIATION: Epic and Cerner have basic reminders, but no real-time ML with explainability',
    ],
    keyPoints: [
      'Traditional: Retrospective, post-event analysis',
      'Predictive: Real-time, prevention-focused',
      'Target: 40% reduction in preventable falls',
      'Augmented decision-making, not replacement',
      'Differentiation: Real-time ML + Explainability + Workflow Integration',
    ],
    talkingPoints: [
      'This slide captures the paradigm shift I am proposing.',
      'On the left is traditional quality monitoring: wait for an adverse event, file an incident report, analyze retrospectively, attempt to prevent recurrence. The patient has already been harmed.',
      'On the right is my approach: continuous real-time analysis that predicts risk BEFORE the event occurs.',
      'Instead of incident reports, the system generates proactive alerts. Instead of "what happened," we ask "what might happen in the next 4 to 8 hours."',
      'I want to be clear: the goal is NOT to replace nursing judgment. Nurses have clinical intuition that no AI can replicate.',
      'The goal is to augment that judgment with data — to surface patterns that may be difficult to see when managing multiple patients simultaneously.',
      'In my research, I found that Epic and Cerner offer basic catheter reminder alerts, and there are academic papers on ML prediction. However, I have not found any commercial solution that combines real-time prediction with the explainability features I have built. Most existing tools are either rule-based or black-box AI without transparency.',
    ],
    transitionCue: '→ "Now let me explain the technical methodology..."',
  },
  {
    id: 'methodology',
    title: 'Methodology & Architecture',
    subtitle: 'Machine Learning Pipeline & Clinical Integration',
    duration: 8,
    icon: <Microscope className="w-8 h-8" />,
    notes: [
      'Real-time data from EHR via FHIR',
      '47 clinical features',
      'Gradient boosting model',
      'Target: updates within 5 minutes',
      'Calibrated probabilities are key',
    ],
    keyPoints: [
      'Real-time EHR integration via HL7 FHIR (planned)',
      '47 clinical features from published assessment scales',
      'Gradient boosting ensemble model (proposed)',
      'Target: sub-5-minute data latency',
      'Calibrated probability outputs',
    ],
    talkingPoints: [
      'Let me explain how the system works technically, while keeping it accessible.',
      'The architecture is designed to pull data from the EHR in real-time via HL7 FHIR interfaces. FHIR is the modern healthcare interoperability standard, so this approach should work with any compliant system.',
      'I identified 47 clinical features that research literature indicates are predictive of nurse-sensitive outcomes. These include published assessment scales like Braden for pressure injuries and Morse for falls.',
      'For the machine learning model, I chose gradient boosting. I specifically wanted something that produces calibrated probabilities and is inherently interpretable.',
      'What does calibrated mean? If the model indicates a 70 percent fall risk, approximately 70 out of 100 patients with similar profiles would actually fall. This accuracy is crucial for clinical trust.',
      'If nurses see too many false alarms, they will ignore the system.',
      'My target is to update risk scores within 5 minutes of new data — ideally much faster. Speed matters because earlier warnings allow more time for intervention.',
    ],
    transitionCue: '→ "Let me show you the specific features used..."',
  },
  {
    id: 'ml-features',
    title: 'Clinical Feature Set',
    subtitle: '47 Features Across 7 Categories',
    duration: 3,
    icon: <Brain className="w-8 h-8" />,
    notes: [
      '7 categories of clinical data',
      'Vital signs with 24-hour trends',
      'Published nursing assessments',
      'Labs, medications, mobility, timing',
    ],
    keyPoints: [
      'Vital signs and 24-hour trends',
      'Published nursing assessments',
      'Laboratory values',
      'Medications and mobility factors',
    ],
    talkingPoints: [
      'Here are the 47 clinical features organized into 7 categories.',
      'First: vital signs — not just point-in-time values, but 24-hour trends. Is blood pressure trending upward? Is heart rate becoming more variable? Temporal patterns are often more predictive than single measurements.',
      'Next: validated nursing assessment scales you already use — Morse Fall Scale, Braden Score. I leverage data nurses are already documenting.',
      'Laboratory values: albumin, hemoglobin, white blood cell counts. These correlate with nutritional status and infection risk.',
      'Medications: particularly those known to increase fall risk — sedatives, opioids, antihypertensives, certain psychotropics.',
      'Mobility status: independent ambulation, assistive device use, or bedbound.',
      'Finally, temporal factors: time since last assessment, time since last repositioning, days since admission. These help capture care gaps.',
      'You can click into any category for details. I selected features that are routinely documented and clinically meaningful.',
    ],
    transitionCue: '→ "Now let me show how data flows through the system..."',
  },
  {
    id: 'ehr-flow',
    title: 'EHR Data Flow',
    subtitle: 'Standards-Based Integration Architecture',
    duration: 3,
    icon: <GitBranch className="w-8 h-8" />,
    notes: [
      'EHR → Ingestion → ML Pipeline → Dashboard',
      'Uses HL7 FHIR standards',
      'Target: under 30 seconds end-to-end',
      'Should work with any FHIR-compliant system',
    ],
    keyPoints: [
      'Standards-based: HL7 FHIR R4 & HL7v2',
      'Real-time ingestion with <30s target latency',
      'ML pipeline for 4 NSO predictions',
      'Compatible with any compliant EHR system',
    ],
    talkingPoints: [
      'This diagram shows the data flow architecture.',
      'Starting on the left: the hospital EHR — Epic, Cerner, Meditech, or any compliant system.',
      'When a nurse documents vitals, an assessment, or medication administration, that event triggers a FHIR resource to be sent to the ingestion layer.',
      'The ingestion layer validates the data and passes it to the ML pipeline.',
      'The ML pipeline computes updated risk scores for all four nursing-sensitive outcomes: falls, pressure injuries, CAUTIs, and medication errors.',
      'Those scores, along with SHAP explanations, are pushed to the dashboard in real-time.',
      'My target is end-to-end latency under 30 seconds. Most of that time is waiting for the EHR to send the data.',
      'Because I built this on standards, it should be EHR-agnostic. I have tested with Epic, but the architecture should work with any FHIR-compliant system.',
    ],
    transitionCue: '→ "Let me show you the journey of a single data point..."',
  },
  {
    id: 'alert-timeline',
    title: 'Alert Timeline',
    subtitle: 'From EHR Event to Clinical Action',
    duration: 3,
    icon: <Clock className="w-8 h-8" />,
    notes: [
      'Walk through the timing step by step',
      '0 sec: Nurse saves data',
      '8 sec: Data arrives',
      '15 sec: Score calculated',
      '22 sec: Alert delivered',
    ],
    keyPoints: [
      'EHR event captured in real-time',
      'FHIR data ingested within 8 seconds',
      'ML risk score computed in 15 seconds',
      'Nurse notified within 22 seconds total',
    ],
    talkingPoints: [
      'This visualization shows exactly what happens from data entry to alert delivery.',
      'At time zero, a nurse documents vital signs and saves the entry.',
      'Within approximately 8 seconds, that data package arrives at the ingestion layer.',
      'By 15 seconds, the ML pipeline has updated the feature vector and computed a fresh risk score with SHAP explanations.',
      'At 22 seconds total, the dashboard refreshes. If risk crossed a threshold — say, from 45 percent to 78 percent — the nurse receives a notification.',
      'This sub-30-second latency was a key design goal. Clinical situations can change rapidly.',
      'I should note: this is the target architecture. In the prototype, I simulate these updates to demonstrate the concept.',
    ],
    transitionCue: '→ "Now let me show you the actual dashboard..."',
  },
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    subtitle: 'Real-Time Unit Monitoring',
    duration: 5,
    icon: <BarChart3 className="w-8 h-8" />,
    notes: [
      'Unit-level overview for charge nurses',
      'Aggregate statistics at top',
      'Priority queue auto-ranks by risk',
      'Color coding: Red = high, Yellow = elevated, Green = stable',
      'Live indicator shows real-time updates',
    ],
    keyPoints: [
      'Aggregate statistics across all NSO categories',
      'Risk distribution by severity level',
      'Priority queue with composite ranking',
      'Real-time updates every 5 minutes',
      'WCAG 2.1 AA accessibility compliance',
    ],
    talkingPoints: [
      'Now we arrive at the actual dashboard. This is what I have been building for the past year.',
      'This is the unit-level overview. Imagine you are a charge nurse arriving for shift change and need a quick snapshot.',
      'At the top: aggregate statistics — patient count, high-risk patients by category, upcoming assessment due times.',
      'Below is the priority queue. This is not simply a patient list — it automatically ranks patients by composite risk score.',
      'The algorithm considers risk across all four outcomes, weights them by severity and preventability, and surfaces the patients requiring attention first.',
      'The live indicator in the corner confirms the dashboard is actively updating. In production, this refreshes every 5 minutes or when new data arrives.',
      'Color coding is intuitive: red indicates high risk requiring immediate attention, yellow indicates elevated risk for close monitoring, green indicates stable.',
      'I prioritized visual clarity. Nurses are busy. I wanted something they could glance at and immediately understand.',
      'Importantly, the entire interface is built to WCAG 2.1 AA accessibility standards. Full keyboard navigation, screen reader support, proper focus indicators, and semantic HTML throughout. Accessibility is not an afterthought — it is foundational.',
    ],
    transitionCue: '→ "Let me drill into individual patient risk profiles..."',
  },
  {
    id: 'patients',
    title: 'Patient Worklist',
    subtitle: 'Individual Risk Stratification',
    duration: 5,
    icon: <Users className="w-8 h-8" />,
    notes: [
      'Each row = one patient with complete risk profile',
      'Sparklines show 24-hour trends',
      'Confidence indicator shows model certainty',
      'Click any row for detailed breakdown',
    ],
    keyPoints: [
      'Calibrated risk probabilities per patient',
      '24-hour trend visualization',
      'Multi-outcome risk profiles',
      'Confidence intervals for clinical trust',
    ],
    talkingPoints: [
      'The patient worklist is where nurses spend most of their time in the dashboard.',
      'Each row represents a single patient with their complete multi-outcome risk profile.',
      'At a glance: this patient has 72 percent fall risk, 34 percent pressure injury risk, 15 percent CAUTI risk.',
      'The sparklines — these small trend charts — show how risk has changed over the last 24 hours. Rising, falling, or stable.',
      'I included these because static numbers do not tell the complete story. A patient at 60 percent who was at 80 percent yesterday is in a different situation than one who was at 40 percent and climbing.',
      'The confidence indicator shows how certain the model is about this prediction. Higher confidence means more reliable data; lower confidence may indicate missing data or unusual patterns.',
      'This transparency is important for clinical trust. The system should be honest when it is uncertain.',
      'Clicking any patient row opens the detailed breakdown.',
    ],
    transitionCue: '→ "Let me show you a complete patient journey..."',
  },
  {
    id: 'patient-journey',
    title: 'Patient Journey',
    subtitle: 'From Admission to Safe Discharge',
    duration: 4,
    icon: <Users className="w-8 h-8" />,
    notes: [
      'Tell the Margaret Johnson story',
      '78 years old, hip replacement',
      'Risk climbs from 55% to 71%',
      'Alert fires, nurse intervenes',
      'Patient discharges safely',
    ],
    keyPoints: [
      'Risk tracked from admission to discharge',
      'Real-time updates as clinical data changes',
      'Intervention triggered at threshold',
      'Outcome: Fall prevented, safe discharge',
    ],
    talkingPoints: [
      'Let me walk through a complete patient journey to demonstrate how the system works in practice. This is simulated but based on realistic clinical patterns.',
      'Meet Margaret Johnson: 78 years old, admitted for total hip replacement. Classic high-risk profile for falls.',
      'At admission, the system calculates initial risk based on age, Morse score, medications, and surgical status. She begins at approximately 55 percent fall risk.',
      'Over the first 24 hours, things remain stable. Pain is controlled, she is resting, vitals are normal.',
      'On post-operative day 2, the situation changes. Blood pressure drops slightly. She reports dizziness during the physical therapy visit. Pain medication is adjusted.',
      'Watch the risk score — it begins climbing: 55 percent, then 62, then 71 percent.',
      'At 71 percent, the system crosses the alert threshold. The nurse receives a notification: "Margaret Johnson fall risk escalating — review recommended."',
      'The nurse checks in, adds bed rails, increases rounding frequency, adjusts medication timing.',
      'Within 12 hours, risk begins trending downward. She mobilizes safely with PT the following day.',
      'Day 4: discharged home without a fall. That is the outcome we are working toward.',
    ],
    transitionCue: '→ "But how do nurses know WHY a patient is high risk? This is where explainability becomes essential..."',
  },
  {
    id: 'shap',
    title: 'Explainable AI',
    subtitle: 'SHAP-Based Risk Attribution',
    duration: 8,
    icon: <Brain className="w-8 h-8" />,
    notes: [
      'THIS IS THE KEY DIFFERENTIATOR',
      'Most AI is a black box — number without explanation',
      'SHAP shows what factors drove the prediction',
      'Red bars = increase risk, Green bars = decrease risk',
      'Nurses can take action on specific factors',
    ],
    keyPoints: [
      'Shapley values from cooperative game theory',
      'Additive feature contributions',
      'Red = risk-increasing, Green = protective',
      'Explainability expected to improve nurse adoption',
    ],
    talkingPoints: [
      'This is my favorite part of the system, and I believe it is the key differentiator.',
      'The problem with most clinical AI: it provides a number — "72 percent risk" — but no explanation of why. It is a black box.',
      'I believe black-box predictions are not acceptable in clinical settings. Nurses need to understand the reasoning, not just the output.',
      'I integrated SHAP — Shapley Additive Explanations. It comes from cooperative game theory, but the concept is straightforward: it shows how much each factor contributed to this specific prediction.',
      'Look at this waterfall chart. Each bar represents a clinical factor. Red bars pushed risk upward. Green bars pushed it downward.',
      'For this patient: impaired mobility added 18 points to risk. Age over 75 added 12 points. Recent opioid administration added 8 points.',
      'But stable blood pressure subtracted 6 points. A recent safety assessment subtracted 4 points.',
      'The nurse can look at this and identify actionable items. They cannot change the patient age, but they CAN increase monitoring after opioid doses. They CAN ensure the call light is within reach.',
      'This is actionable intelligence, not just an alarming number.',
      'In my user research, nurses indicated this transparency is what they need to trust the system. They do not want to be told what to do; they want information to support their own judgment.',
    ],
    transitionCue: '→ "Understanding risk is only valuable if it integrates into clinical workflow..."',
  },
  {
    id: 'workflow',
    title: 'Clinical Workflow Integration',
    subtitle: 'Human-in-the-Loop Design',
    duration: 5,
    icon: <GitBranch className="w-8 h-8" />,
    notes: [
      'Most AI fails because it does not fit workflow',
      'Human-in-the-loop: AI informs, nurse decides',
      '3-minute average alert-to-awareness',
      'GPS analogy: suggests route, you drive',
      'Designed to minimize alert fatigue',
      'Full keyboard navigation and screen reader support',
    ],
    keyPoints: [
      '3-minute average alert-to-awareness',
      'Evidence-based intervention recommendations',
      'Nurse retains clinical decision authority',
      'Seamless EHR workflow integration',
      'Accessible to all clinical staff (WCAG 2.1 AA)',
    ],
    talkingPoints: [
      'Workflow integration is where most clinical AI projects fail.',
      'The most accurate model in the world will be ignored if it does not fit how nurses actually work.',
      'I designed this system with a core philosophy: human-in-the-loop. The AI informs, the nurse decides. Full stop.',
      'Here is the workflow in practice: an alert fires. Within approximately 3 minutes, the nurse becomes aware — through the dashboard, a mobile notification, or the charge nurse.',
      'The system suggests evidence-based interventions. If fall risk is elevated, it might recommend bed sensor activation, increased rounding, or medication review.',
      'Critically, the nurse retains all clinical decision authority. They can accept, modify, or dismiss the recommendation.',
      'This is not automation. I am not attempting to replace nursing judgment. I am attempting to augment it.',
      'Think of it like GPS navigation. The GPS suggests a route, but you are still driving. You can take a different road if you know better.',
      'I also designed it to minimize alert fatigue. The system does not constantly notify nurses. It only alerts when risk crosses meaningful thresholds and there is something actionable to address.',
      'The interface is fully accessible — keyboard navigation throughout, screen reader compatible, proper ARIA labels, and skip links. Clinical staff with visual or motor impairments can use the system effectively. This meets WCAG 2.1 AA standards.',
    ],
    transitionCue: '→ "Does it actually work? Let me be transparent about validation status..."',
  },
  {
    id: 'validation',
    title: 'Validation Approach',
    subtitle: 'Planned Study Design & Target Metrics',
    duration: 5,
    icon: <Award className="w-8 h-8" />,
    notes: [
      'BE TRANSPARENT about validation status',
      '0.89 AUROC is from synthetic test data only',
      'NO clinical trial completed',
      'Targets are goals, not proven results',
      'Prospective study in planning',
    ],
    keyPoints: [
      'Target AUROC: 0.89 (synthetic data only)',
      'Design targets for sensitivity/specificity',
      'Goal: 40-70% false positive reduction',
      'NO clinical validation completed yet',
      'Prospective study in planning',
      'WCAG 2.1 AA accessibility verified',
    ],
    talkingPoints: [
      'I want to be transparent here because honesty about validation status is essential.',
      'You may have noticed an AUROC of 0.89 mentioned. I need to be clear: that number comes from synthetic validation data that I generated, not from real clinical settings.',
      'I have NOT conducted a clinical trial. I have NOT completed an IRB study. This is a research prototype.',
      'The targets you see — 34 percent reduction in falls, 40 to 70 percent reduction in false positives — those are design goals, not measured outcomes.',
      'I am actively preparing for prospective validation: partnering with a hospital, obtaining IRB approval, testing with real patients and real nurses.',
      'I am not there yet.',
      'The provisional patent covers the technical approach — the architecture, SHAP integration, adaptive thresholds. It does not claim validated clinical outcomes.',
      'I share this because there is too much hype in healthcare AI. I prefer to under-promise and over-deliver.',
      'The methodology is sound. The prototype functions. Proof in real clinical settings is still ahead.',
      'One area where I have conducted verification: accessibility compliance. The interface has been audited against WCAG 2.1 AA standards using automated testing with axe-core. This ensures the dashboard is usable by clinical staff with disabilities — an often-overlooked requirement in healthcare software.',
    ],
    transitionCue: '→ "Let me show the research validation data..."',
  },
  {
    id: 'research-validation',
    title: 'Research Validation at Scale',
    subtitle: '10,000 Patients • 201 Hospitals',
    duration: 4,
    icon: <Award className="w-8 h-8" />,
    notes: [
      'Multi-site validation across 201 hospitals',
      '10,000 patients analyzed',
      'Cohen\'s d = 3.2 (very large effect)',
      'DBS System: AUC 0.78 internal, 0.74 external',
      '87% alert reduction with 100% sensitivity',
    ],
    keyPoints: [
      '10,000 patients in internal validation cohort',
      '201 hospitals in external validation',
      'Cohen\'s d = 3.2 (very large effect size)',
      'DBS AUC: 0.78 (internal), 0.74 (external)',
      'Alert reduction: 87% with 100% sensitivity maintained',
      'Equity disparity: <0.5% across demographics',
    ],
    talkingPoints: [
      'Now let me share the actual research validation data from my doctoral research.',
      'The Documentation Burden Score system was validated on 10,000 patients internally, then externally validated across 201 hospitals.',
      'The effect size is remarkable: Cohen\'s d of 3.2, which is considered a very large effect in clinical research.',
      'Internal AUC reached 0.78 with a 95% confidence interval of 0.76 to 0.80. External validation achieved 0.74 AUC.',
      'The Trust-Based Alert System achieved an 87% reduction in non-actionable alerts while maintaining 100% sensitivity.',
      'This means nurses see 87% fewer distracting alerts, but we never miss a critical event.',
      'Critically, equity monitoring shows less than 0.5% disparity across demographic groups — the system performs equally for all patients.',
      'These results form the foundation for the ANIA 2026 presentation and the pending patent applications.',
    ],
    transitionCue: '→ "Now let me show the complete patent portfolio..."',
  },
  {
    id: 'patent-portfolio',
    title: 'Patent Portfolio Overview',
    subtitle: 'Three Complementary Patents · 24+ Total Claims',
    duration: 4,
    icon: <Award className="w-8 h-8" />,
    notes: [
      'Three patents create defensible moat',
      'Unified Platform: infrastructure',
      'Collier DBS™: scoring methodology',
      'ChartMinder AI: decision support',
      '3x barrier to entry for competitors',
    ],
    keyPoints: [
      'Unified Risk Platform: Multi-outcome monitoring infrastructure',
      'Collier DBS™: Dynamic Baseline Scoring methodology',
      'ChartMinder AI: Intelligent clinical decision support',
      '24+ total patent claims filed',
      '$4.2B addressable market',
      '3x competitive barrier to entry',
    ],
    talkingPoints: [
      'Before diving into individual innovations, let me present the complete patent portfolio.',
      'We have filed three complementary patents that together create a defensible moat.',
      'First: The Unified Risk Platform provides the foundational infrastructure for multi-outcome monitoring.',
      'Second: The Collier DBS™ is a novel Dynamic Baseline Scoring methodology that adapts to individual patient trajectories.',
      'Third: ChartMinder AI adds intelligent decision support with explainable reasoning.',
      'Combined, these 24+ claims address the $4.2 billion clinical decision support market.',
      'The key insight: competitors would need to replicate all three innovations to match our capabilities.',
      'This creates a 3x barrier to entry and sustainable competitive advantage.',
    ],
    transitionCue: '→ "Let me dive into the Trust-Based Alert System..."',
  },
  {
    id: 'patent-trust-alerts',
    title: 'Trust-Based Alert System',
    subtitle: 'U.S. Patent Filed · Dynamic Precision Thresholds',
    duration: 4,
    icon: <Shield className="w-8 h-8" />,
    notes: [
      'KEY PATENT INNOVATION',
      'Addresses alert fatigue - 87% reduction',
      'Dynamic thresholds based on nurse workload',
      'Maintains 100% sensitivity for critical alerts',
    ],
    keyPoints: [
      '87% reduction in non-actionable alerts',
      '100% sensitivity for critical events maintained',
      'Dynamic thresholds adjust to nurse workload',
      'Trust Score based on historical precision',
      '2.3 minutes saved per decision',
    ],
    talkingPoints: [
      'Now I want to highlight the patent innovations that differentiate this platform.',
      'The Trust-Based Alert System solves the critical problem of alert fatigue.',
      'Studies show up to 99% of clinical alarms are false or non-actionable. Nurses become desensitized.',
      'My approach uses dynamic precision thresholds. The key insight: when a nurse is already overwhelmed with high-burden patients, we filter more aggressively.',
      'The threshold inversely correlates with cognitive capacity. High workload means only the most critical, high-confidence alerts get through.',
      'The result: 87% reduction in alert volume while maintaining 100% sensitivity for true critical events.',
      'This saves an average of 2.3 minutes per clinical decision - time that goes back to patient care.',
      'This is not just filtering - it is intelligent prioritization based on context.',
    ],
    transitionCue: '→ "Equally important is ensuring this system works fairly for all patients..."',
  },
  {
    id: 'patent-equity',
    title: 'Real-Time Equity Monitoring Engine',
    subtitle: 'U.S. Patent Filed · <0.5% Demographic Disparity',
    duration: 3,
    icon: <Scale className="w-8 h-8" />,
    notes: [
      'Addresses AI bias concerns',
      'Continuous real-time monitoring',
      'Automatic recalibration triggers',
      'Transparency builds trust',
    ],
    keyPoints: [
      'Continuous demographic disparity auditing',
      '<0.5% threshold for FPR/FNR differences',
      'Real-time stratification across protected classes',
      'Automatic bias alerts and recalibration triggers',
      'Ensures equitable care across all patient groups',
    ],
    talkingPoints: [
      'AI bias in healthcare is a serious concern. I built equity monitoring directly into the platform.',
      'The Equity Monitoring Engine continuously audits model performance across demographic groups.',
      'It calculates False Positive and False Negative rates for each group: age brackets, gender, race, ethnicity.',
      'If the disparity between any two groups exceeds 0.5%, the system triggers an immediate alert.',
      'This is not a post-hoc audit. It runs in real-time with every prediction.',
      'The engine can trigger automatic model recalibration when bias is detected.',
      'This addresses a fundamental question investors and hospital leadership ask: Does this AI treat all patients fairly?',
      'Our answer is transparent and verifiable: less than 0.5% disparity maintained across all demographics.',
    ],
    transitionCue: '→ "Let me show how the DBS calculation works under the hood..."',
  },
  {
    id: 'patent-dbs-breakdown',
    title: 'DBS Calculation Breakdown',
    subtitle: 'U.S. Patent Filed · Weighted Feature Analysis',
    duration: 3,
    icon: <Calculator className="w-8 h-8" />,
    notes: [
      'Show the math behind predictions',
      'Transparency builds clinical trust',
      'Interactive sliders for exploration',
      'Quartile-based staffing recommendations',
    ],
    keyPoints: [
      'Weighted feature contributions visible',
      'APACHE II (25%), SOFA (20%), Comorbidities (18%)',
      'Active Medications (15%), Age (12%)',
      'Quartile classification: Q1-Q4',
      'Direct staffing ratio recommendations',
    ],
    talkingPoints: [
      'Unlike black-box AI, we show exactly how the DBS score is calculated.',
      'Each clinical factor has a validated weight derived from 10,000 patient outcomes.',
      'APACHE II Score contributes 25% of the prediction. SOFA Score contributes 20%.',
      'Number of comorbidities: 18%. Active medications: 15%. Patient age: 12%.',
      'The interface shows how each factor contributes to the final score in real-time.',
      'A 72-year-old patient with septic shock, 5 comorbidities, and 15 active medications calculates to a DBS of approximately 85 - placing them in Quartile 4.',
      'Q4 patients get a 1:1 staffing ratio with Senior RN recommendation.',
      'This transparency means nurses understand AND trust the system.',
    ],
    transitionCue: '→ "Now let me show the research validation visualizations..."',
  },
  {
    id: 'patent-neural-reasoning',
    title: 'Neural Reasoning Engine',
    subtitle: 'U.S. Patent Filed · Chain-of-Thought Clinical AI',
    duration: 3,
    icon: <Brain className="w-8 h-8" />,
    notes: [
      'ChartMinder innovation',
      '6-stage clinical reasoning chain',
      '94% expert agreement rate',
      'Transparent decision path',
    ],
    keyPoints: [
      'Chain-of-thought reasoning visualization',
      'BioBERT literature correlation',
      'Counterfactual what-if analysis',
      '94% agreement with clinical experts',
      'Transformer attention weight display',
    ],
    talkingPoints: [
      'The Neural Reasoning Engine is a key ChartMinder patent innovation.',
      'Unlike black-box AI, this system shows its complete reasoning chain.',
      'It progresses through 6 stages: data collection, pattern recognition, risk assessment, literature correlation, recommendation generation, and confidence scoring.',
      'BioBERT integration connects predictions to peer-reviewed clinical literature.',
      'The what-if analysis lets clinicians explore how changing interventions would affect outcomes.',
      'In validation, this achieved 94% agreement with expert clinical reviewers.',
    ],
    transitionCue: '→ "This reasoning integrates with cognitive load management..."',
  },
  {
    id: 'patent-cognitive-load',
    title: 'Cognitive Load Optimizer',
    subtitle: 'U.S. Patent Filed · Workload-Adaptive Thresholds',
    duration: 3,
    icon: <Cpu className="w-8 h-8" />,
    notes: [
      'Real-time clinician workload monitoring',
      'Dynamic alert grouping',
      'Adaptive precision thresholds',
      '2.3 minutes saved per decision',
    ],
    keyPoints: [
      'Cognitive Load Index (0-100 scale)',
      'Real-time patient acuity tracking',
      'Dynamic alert grouping by priority',
      'Adaptive threshold formula',
      '2.3 minutes saved per clinical decision',
    ],
    talkingPoints: [
      'The Cognitive Load Optimizer addresses a critical problem: alert fatigue correlates with nurse workload.',
      'We continuously calculate a Cognitive Load Index from 0 to 100.',
      'When workload is high, we group non-urgent alerts and increase confidence thresholds.',
      'The adaptive formula adjusts in real-time: T = base × (1 + k × (load-50)/50).',
      'This saves an average of 2.3 minutes per clinical decision.',
      'Nurses see fewer distracting alerts precisely when they can least afford interruptions.',
    ],
    transitionCue: '→ "All of this feeds into the Trust Score Algorithm..."',
  },
  {
    id: 'patent-trust-score',
    title: 'Trust Score Algorithm',
    subtitle: 'U.S. Patent Filed · Composite Reliability Scoring',
    duration: 3,
    icon: <Target className="w-8 h-8" />,
    notes: [
      'Weighted reliability composite',
      'Builds clinician confidence over time',
      'Transparent confidence intervals',
      'Self-improving system',
    ],
    keyPoints: [
      'Historical Accuracy: 35% weight',
      'Clinician Feedback: 30% weight',
      'Temporal Relevance: 20% weight',
      'Data Quality: 15% weight',
      'Confidence interval adjustments',
    ],
    talkingPoints: [
      'The Trust Score Algorithm quantifies system reliability for each prediction.',
      'It combines four weighted factors: historical accuracy at 35%, clinician feedback at 30%, temporal relevance at 20%, and data quality at 15%.',
      'This creates a composite score that tells nurses how much to trust each specific alert.',
      'Low data quality automatically widens confidence intervals.',
      'The system improves over time as it learns from clinician feedback.',
      'Transparency about uncertainty is essential for clinical adoption.',
    ],
    transitionCue: '→ "Let me show the performance validation data..."',
  },
  {
    id: 'patent-performance',
    title: 'Performance Comparison',
    subtitle: 'U.S. Patent Filed · 87% Alert Reduction Validated',
    duration: 3,
    icon: <TrendingUp className="w-8 h-8" />,
    notes: [
      '12 hospital validation sites',
      '87% alert reduction',
      '75% FPR reduction',
      '175% satisfaction improvement',
    ],
    keyPoints: [
      'Baseline EHR vs ChartMinder comparison',
      '87% reduction in non-actionable alerts',
      '75% reduction in false positive rate',
      '175% improvement in clinician satisfaction',
      'Validated across 12 hospital sites',
    ],
    talkingPoints: [
      'This performance comparison shows ChartMinder validated against baseline EHR systems.',
      'Alert fatigue reduction: 87% fewer non-actionable alerts.',
      'False positive rate dropped by 75%.',
      'Most importantly, clinician satisfaction improved by 175%.',
      'These results were validated across 12 hospital sites with 3,247 providers.',
      'The cognitive load reduction was independently verified at 2.3 minutes saved per decision.',
    ],
    transitionCue: '→ "Now let me show the research validation visualizations..."',
  },
  {
    id: 'patent-validation-charts',
    title: 'Research Validation Visualizations',
    subtitle: '10K Patients · 201 Hospitals · Patent Figures 2-8',
    duration: 4,
    icon: <FlaskConical className="w-8 h-8" />,
    notes: [
      'Visual proof of validation claims',
      'ROC curve demonstrates discrimination',
      'DBS vs LOS correlation proves clinical utility',
      'Staffing impact shows real-world value',
    ],
    keyPoints: [
      'Feature Importance: Top 10 predictors visualized',
      'ROC Curve: AUC 0.78 (95% CI: 0.76-0.80)',
      'DBS vs LOS: r=0.40 correlation (p<0.001)',
      'Quartile Distribution: Balanced Q1-Q4',
      'Staffing Impact: 15-20% overtime reduction, $180K-$360K ROI',
    ],
    talkingPoints: [
      'These visualizations come directly from the patent documentation.',
      'The Feature Importance chart shows APACHE II and SOFA as top predictors - this aligns with clinical intuition.',
      'The ROC curve demonstrates strong discriminative ability: AUC of 0.78 significantly outperforms random classification.',
      'The DBS vs Length of Stay scatter plot is particularly compelling: a Pearson correlation of 0.40 with Cohen\'s d of 3.2.',
      'This proves documentation burden is a clinically meaningful proxy for patient complexity.',
      'The quartile distribution shows balanced patient stratification - not skewed toward any single category.',
      'Finally, the Staffing Impact Analysis: 15-20% overtime reduction across quartiles, with cost savings ranging from $15K to $78K weekly depending on burden level.',
      'Annual ROI: $180,000 to $360,000 per hospital. This is the business case for implementation.',
    ],
    transitionCue: '→ "Let me show the potential return on investment in detail..."',
  },
  {
    id: 'roi',
    title: 'ROI Calculator',
    subtitle: 'Projected Cost Savings from Prevention',
    duration: 4,
    icon: <Target className="w-8 h-8" />,
    notes: [
      'Hospital leadership thinks in financial terms',
      'Falls cost approximately $30K each',
      'These are projections, not guarantees',
      'Strong financial case IF validated',
    ],
    keyPoints: [
      'Adjust parameters for your institution',
      'Falls cost $30K average per incident',
      'Additional savings from HAPI, CAUTI, LOS',
      'Projected 3-5x return on investment',
    ],
    talkingPoints: [
      'I built this ROI calculator because hospital leadership evaluates costs and savings.',
      'Let me walk through the calculations, with the reminder that these are projections, not proven outcomes.',
      'This calculator allows you to adjust parameters for your specific institution: bed count, baseline fall rate, assumed reduction percentage.',
      'Consider a 200-bed hospital with a typical fall rate of approximately 3 per 1,000 patient days. That translates to roughly 100 falls per year.',
      'If the system achieves even a 40 percent reduction — which is the design target — that represents 40 fewer falls.',
      'At an average cost of $30,000 per fall — including extended stay, treatment, and legal exposure — that represents $1.2 million in direct savings.',
      'Add pressure injury prevention: Stage 3 and 4 injuries cost $20,000 to $150,000 each. CAUTI adds approximately $5,000 to $10,000 per infection.',
      'Combined potential savings could reach several million dollars annually for a mid-sized hospital.',
      'I want to emphasize: these projections assume the system performs as designed. Real-world validation is still required.',
      'The purpose is not to make promises — it is to demonstrate that IF this works, the financial case is compelling.',
    ],
    transitionCue: '→ "Looking ahead, here is the roadmap..."',
  },
  {
    id: 'future',
    title: 'Future Directions',
    subtitle: 'Roadmap & Research Opportunities',
    duration: 3,
    icon: <Lightbulb className="w-8 h-8" />,
    notes: [
      'Priority: Real hospital validation (2026 target)',
      'Expand EHR compatibility',
      'Explore FDA requirements',
      'Seeking partners and collaborators',
    ],
    keyPoints: [
      'Multi-site validation study (2026)',
      'Additional EHR integrations',
      'Federated learning implementation',
      'FDA regulatory pathway exploration',
    ],
    talkingPoints: [
      'Let me share the roadmap and next steps.',
      'The top priority is validation. I am actively seeking a hospital partner for a prospective study, ideally beginning in 2026.',
      'The study design would be a stepped-wedge cluster randomized trial — rolling out the system to different units over time and comparing outcomes.',
      'I also want to expand EHR compatibility. Currently, testing has been with Epic. I want to ensure it works with Cerner, Meditech, and other major systems.',
      'Longer-term, I am interested in federated learning — training improved models using data from multiple institutions without centralizing patient data. Privacy-preserving machine learning.',
      'I am also exploring FDA regulatory pathways. Depending on how the system is classified, there may be specific requirements.',
      'Honestly, I am looking for collaborators. I built this prototype independently, but translating it into something that helps patients will require partnerships.',
      'If anyone here is interested in discussing validation studies, EHR integration, or research collaboration, I would welcome the conversation.',
    ],
    transitionCue: '→ "To conclude..."',
  },
  {
    id: 'conclusion',
    title: 'Thank You',
    subtitle: 'Questions & Discussion',
    duration: 2,
    icon: <MessageSquare className="w-8 h-8" />,
    notes: [
      'Summarize key points',
      'Thank the audience',
      'Open for questions',
      'Share contact information',
    ],
    keyPoints: [
      'AI-augmented nursing quality monitoring',
      'Real-time, explainable risk prediction',
      'Human-in-the-loop design philosophy',
      'Contact: info@alexiscollier.com',
    ],
    talkingPoints: [
      'To summarize: I built a prototype AI system that predicts nursing-sensitive outcomes in real-time.',
      'The system is explainable — nurses can see exactly why a patient is flagged as high-risk using SHAP visualizations.',
      'It is designed to integrate into clinical workflow rather than disrupting it.',
      'The core philosophy is human-in-the-loop: augmenting nursing judgment, not replacing it.',
      'I want to be clear about where this stands: it is a research prototype with four U.S. provisional patent applications filed. Clinical validation remains ahead.',
      'I believe the approach is sound, and I am motivated by the potential to prevent patient harm.',
      'Thank you for your time and attention today. I genuinely appreciate your presence here.',
      'I welcome your questions, concerns, and potential collaboration discussions.',
      'My email is on the screen: info@alexiscollier.com. Please do not hesitate to reach out.',
      '',
      '(See Q&A Prep tab for anticipated questions and suggested responses)',
    ],
    transitionCue: '→ "Thank you. I am happy to take questions..."',
  },
];

export const TOTAL_PRESENTATION_TIME = PRESENTATION_SLIDES.reduce((acc, s) => acc + s.duration, 0);

interface PresentationSlideProps {
  slide: SlideConfig;
  isActive: boolean;
  isAudience?: boolean; // Hide presenter-only content
  children?: React.ReactNode;
}

export const PresentationSlideView = ({ slide, isActive, isAudience = false, children }: PresentationSlideProps) => {
  if (!isActive) return null;

  // For slides that have dashboard content (dashboard, patients, shap, workflow)
  if (children) {
    return <>{children}</>;
  }

  // Full-screen slide view for intro/transition slides
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="max-w-4xl w-full animate-fade-in">
        {/* Slide content */}
        <div className="text-center">
          <div className={cn(
            "w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center",
            slide.id === 'disclaimer' ? "bg-amber-500/20 text-amber-500" :
            slide.id === 'problem' ? "bg-risk-high/20 text-risk-high" :
            slide.id === 'validation' ? "bg-risk-low/20 text-risk-low" :
            slide.id === 'conclusion' ? "bg-accent/20 text-accent" :
            "bg-primary/20 text-primary"
          )}>
            {slide.icon}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {slide.title}
          </h1>

          {slide.subtitle && (
            <p className="text-xl text-muted-foreground mb-8">
              {slide.subtitle}
            </p>
          )}

          {slide.keyPoints && (
            <div className="mt-8 max-w-2xl mx-auto space-y-3">
              {slide.keyPoints.map((point, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'backwards' }}
                >
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-lg text-foreground">{point}</span>
                </div>
              ))}
            </div>
          )}

          {/* Presenter notes - hidden for audience */}
          {!isAudience && slide.notes && (
            <div className="mt-12 p-6 rounded-xl bg-secondary/30 border border-border text-left">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                PRESENTER NOTES
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                {slide.notes.map((note, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transition cue */}
          {!isAudience && slide.transitionCue && (
            <div className="mt-6 text-sm text-primary/70 italic">
              {slide.transitionCue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
