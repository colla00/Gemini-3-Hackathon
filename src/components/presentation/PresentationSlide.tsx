import { cn } from '@/lib/utils';
import { 
  BarChart3, Target, Brain, Users, GitBranch, Sparkles, 
  GraduationCap, CheckCircle, AlertTriangle, TrendingUp,
  Clock, Award, BookOpen, Microscope, Lightbulb, MessageSquare
} from 'lucide-react';

export type SlideType = 
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
    id: 'title',
    title: 'NSO Quality Dashboard',
    subtitle: 'AI-Assisted Nursing Quality Monitoring for Nurse-Sensitive Outcomes',
    duration: 2,
    icon: <BarChart3 className="w-12 h-12" />,
    notes: [
      'Welcome attendees and introduce yourself',
      'Thank the conference organizers',
      'Brief overview: This is a research prototype for predictive nursing quality monitoring',
      'Patent pending - proprietary technology',
    ],
    talkingPoints: [
      'Good morning everyone, and thank you so much for taking time out of your busy schedules to join this session.',
      'My name is Alexis Collier, and I am truly excited to be here today to share my research with you.',
      'What I have built is a prototype dashboard for AI-assisted nursing quality monitoring — specifically focused on predicting and preventing nurse-sensitive adverse outcomes like falls, pressure injuries, and catheter-associated infections.',
      'This work represents about a year of development, and I am genuinely passionate about bringing predictive analytics to the bedside.',
      'Before I dive in, I want to acknowledge that this is a research prototype with a provisional patent pending — so the technology is proprietary, but I am happy to discuss the concepts and methodology.',
      'I also want to be upfront: I am a solo researcher on this project, so any mistakes or limitations are entirely my own.',
    ],
    transitionCue: '→ "Let me walk you through what I will cover today..."',
  },
  {
    id: 'agenda',
    title: 'Presentation Agenda',
    subtitle: '38-Minute Walkthrough',
    duration: 2,
    icon: <BookOpen className="w-8 h-8" />,
    notes: [
      'Overview the structure: Problem → Methodology → Demo → Validation → Future',
      'Mention interactive Q&A throughout',
      'Highlight key sections attendees are interested in',
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
      'Here is the roadmap for the next 38 minutes. I have structured this to give you both the "why" and the "how."',
      'I will start by framing the clinical problem — why nurse-sensitive outcomes matter so much for patient safety and hospital quality metrics.',
      'Then I will walk through my technical methodology at a high level. I will not get too deep into the math, but I want you to understand the architecture.',
      'I will show a quick 5-minute demonstration of the actual dashboard. This is the fun part where you can see the system in action.',
      'I will spend some time on explainability, because I believe strongly that nurses need to understand WHY a patient is flagged as high-risk, not just that they are.',
      'Then I will be transparent about validation status and future directions.',
      'Please, please feel free to interrupt with questions at any point. I find the interactive discussions are often the most valuable part of these sessions.',
    ],
    transitionCue: '→ "You can also watch the full recorded demo..."',
  },
  {
    id: 'video-demo',
    title: 'Recorded Presentation',
    subtitle: 'Platform Overview Video',
    duration: 1,
    icon: <BarChart3 className="w-8 h-8" />,
    notes: [
      'This is the recorded version of the presentation',
      'Can be used for remote viewing or review',
      '5-minute overview of platform features',
    ],
    keyPoints: [
      'Stanford AI+HEALTH 2025',
      '5-minute platform overview',
      'Dashboard features demonstrated',
      'Available for async viewing',
    ],
    talkingPoints: [
      'If you are watching this recorded version, thank you for taking the time.',
      'This video covers a quick 5-minute overview of the platform.',
      'I recommend pausing at certain points to explore the dashboard yourself — the link should be available in the description.',
      'Feel free to reach out with questions afterwards; my email is in the final slide.',
    ],
    transitionCue: '→ "First, let me set the stage with the scope of the problem..."',
  },
  {
    id: 'problem',
    title: 'The Clinical Problem',
    subtitle: 'Preventable Adverse Events in Nursing Care',
    duration: 5,
    icon: <AlertTriangle className="w-8 h-8" />,
    notes: [
      'Emphasize the scale: 700,000 falls, 2.5M pressure injuries, 75,000 CAUTIs annually',
      'Discuss human and financial cost ($50B+ annually)',
      'Current state: retrospective quality metrics, delayed intervention',
      'Gap: Need for real-time, predictive risk monitoring',
      'Reference CMS quality measures and Hospital-Acquired Conditions program',
    ],
    keyPoints: [
      '700,000+ hospital falls annually in the US',
      '2.5 million pressure injuries per year',
      '75,000 catheter-associated UTIs',
      'Estimated $50B+ in preventable costs',
      'Current metrics are retrospective, not predictive',
    ],
    talkingPoints: [
      'Let me share some numbers that really motivated me to pursue this research.',
      'Every single year in the United States alone, over 700,000 patients fall in hospitals. 2.5 million develop pressure injuries. 75,000 get catheter-associated urinary tract infections.',
      'These are not just statistics to me — each one represents a real patient who suffered harm that could potentially have been prevented.',
      'The financial burden is staggering — over 50 billion dollars annually in preventable costs. But honestly, it is the human cost that drives me. These are preventable harms.',
      'Here is the core problem I wanted to solve: current quality monitoring is almost entirely retrospective. By the time we see the incident report, the patient has already fallen. The pressure injury has already formed.',
      'I kept asking myself: what if we could see the risk rising BEFORE the event happens? What if we could give nurses a heads-up, even 30 minutes or an hour earlier?',
      'That question became the foundation of this entire project.',
    ],
    transitionCue: '→ "Let me show you how my approach compares to traditional monitoring..."',
  },
  {
    id: 'comparison',
    title: 'Traditional vs Predictive',
    subtitle: 'Paradigm Shift in Quality Monitoring',
    duration: 4,
    icon: <TrendingUp className="w-8 h-8" />,
    notes: [
      'Contrast reactive vs proactive approaches',
      'Highlight key differentiators: timing, data richness, explainability',
      'Show projected outcome improvements',
      'Emphasize these are targets, not completed results',
    ],
    keyPoints: [
      'Traditional: Retrospective, post-event analysis',
      'Predictive: Real-time, prevention-focused',
      'Target: 40% reduction in preventable falls',
      'Augmented decision-making, not replacement',
    ],
    talkingPoints: [
      'This slide really captures the paradigm shift I am proposing.',
      'On the left is how quality monitoring typically works today: we wait for something bad to happen, we file an incident report, we analyze it retrospectively, and we try to prevent it from happening again.',
      'The problem is obvious: the patient has already been harmed by the time we learn from it.',
      'What I built is shown on the right: a system that continuously analyzes patient data in real-time and predicts risk BEFORE the event occurs.',
      'Instead of incident reports, the system generates proactive alerts. Instead of asking "what happened?" we are asking "what might happen in the next 4 to 8 hours?"',
      'I want to be really clear about something: the goal here is NOT to replace nursing judgment. Nurses are incredible clinicians with intuition that no AI can replicate.',
      'The goal is to augment that judgment with data — to surface patterns that might be hard to see when you are managing 6 patients simultaneously.',
      'Think of it like a spell-checker for clinical risk. It does not write for you, but it flags things you might want to look at.',
    ],
    transitionCue: '→ "Now let me explain my technical methodology..."',
  },
  {
    id: 'methodology',
    title: 'Methodology & Architecture',
    subtitle: 'Machine Learning Pipeline & Clinical Integration',
    duration: 8,
    icon: <Microscope className="w-8 h-8" />,
    notes: [
      'Data sources: EHR, nursing assessments, lab values, vitals',
      'Feature engineering: ~47 clinical features including validated scales',
      'Model: Gradient boosting ensemble with calibrated probabilities (proposed)',
      'Integration: HL7 FHIR for real-time data streaming (planned)',
      'Latency: Target sub-5-minute from EHR event to dashboard update',
      'Discuss planned validation approach',
    ],
    keyPoints: [
      'Real-time EHR integration via HL7 FHIR (planned)',
      '~47 clinical features from validated scales',
      'Gradient boosting ensemble model (proposed)',
      'Target: sub-5-minute data latency',
      'Calibrated probability outputs',
    ],
    talkingPoints: [
      'Now let me get a bit technical — but I promise to keep it accessible.',
      'The architecture I designed pulls data in real-time from the EHR via HL7 FHIR interfaces. FHIR is the modern healthcare interoperability standard, so this approach should work with any compliant EHR system.',
      'I identified approximately 47 clinical features that research suggests are predictive of nurse-sensitive outcomes. These include validated assessment scales like Braden for pressure injuries and Morse for falls.',
      'For the machine learning model, I chose a gradient boosting ensemble. I know deep learning is trendy, but I specifically wanted something that produces calibrated probabilities and is inherently interpretable.',
      'What do I mean by calibrated? If my model says a patient has a 70 percent risk of falling, that should mean that among 100 patients with similar profiles, about 70 would actually fall. Not higher, not lower.',
      'This calibration is crucial for clinical trust. If nurses see the system crying wolf too often, they will ignore it.',
      'My target is to get from a data change in the EHR — like a new vital sign entry — to an updated risk score on the dashboard in under 5 minutes. Ideally under 30 seconds.',
      'Speed matters because the earlier the warning, the more time for intervention.',
    ],
    transitionCue: '→ "Let me show you the specific features I use..."',
  },
  {
    id: 'ml-features',
    title: 'Clinical Feature Set',
    subtitle: '47 Features Across 7 Categories',
    duration: 3,
    icon: <Brain className="w-8 h-8" />,
    notes: [
      'Walk through the feature categories',
      'Highlight validated assessment scales (Morse, Braden)',
      'Explain how features map to different outcomes',
      'Click into categories for detail',
    ],
    keyPoints: [
      'Vital signs and trends',
      'Validated nursing assessments',
      'Laboratory values',
      'Mobility and medication factors',
    ],
    talkingPoints: [
      'Here is where I can show you the 47 clinical features I use, organized into 7 categories.',
      'The first category is vital signs — but not just point-in-time values. I capture 24-hour trends: is blood pressure trending up? Is heart rate becoming more variable? These temporal patterns are often more predictive than single measurements.',
      'Next are the validated nursing assessment scales that you are already familiar with: Morse Fall Scale, Braden Score, and others. These are gold-standard clinical tools, and I am leveraging the data that nurses are already documenting.',
      'Laboratory values come next — albumin, hemoglobin, white blood cell counts. Many of these correlate with nutritional status and infection risk.',
      'I also look at medications, particularly those known to increase fall risk: sedatives, opioids, blood pressure medications, certain psychotropics.',
      'Mobility status is huge — is the patient ambulating independently, using an assistive device, or bedbound?',
      'Finally, temporal factors: time since last assessment, time since last turn, days since admission. These help capture care gaps.',
      'You can click into any category here to see the specific features. I tried to select features that are routinely documented and clinically meaningful.',
    ],
    transitionCue: '→ "Now let me show you how data flows through the system..."',
  },
  {
    id: 'ehr-flow',
    title: 'EHR Data Flow',
    subtitle: 'Standards-Based Integration Architecture',
    duration: 3,
    icon: <GitBranch className="w-8 h-8" />,
    notes: [
      'Explain the data pipeline from EHR to dashboard',
      'Emphasize standards-based approach (HL7 FHIR, HL7v2)',
      'Highlight real-time processing with <30s latency target',
      'Note compatibility with any standards-compliant EHR',
    ],
    keyPoints: [
      'Standards-based: HL7 FHIR R4 & HL7v2',
      'Real-time ingestion with <30s target latency',
      'ML pipeline for 4 NSO predictions',
      'Compatible with any compliant EHR system',
    ],
    talkingPoints: [
      'This diagram shows the data flow architecture I designed.',
      'Starting on the left, we have the EHR — Epic, Cerner, Meditech, whatever the hospital uses. The key requirement is that it supports HL7 FHIR R4 or at minimum HL7v2 messaging.',
      'When a nurse documents something — vitals, an assessment, a medication administration — that event triggers a FHIR resource to be sent to my ingestion layer.',
      'The ingestion layer validates the data, maps it to my feature schema, and passes it to the ML pipeline.',
      'The ML pipeline computes updated risk scores for all four nursing-sensitive outcomes: falls, pressure injuries, CAUTIs, and medication errors.',
      'Those scores, along with SHAP explanations which I will show you shortly, get pushed to the dashboard in real-time.',
      'My target is end-to-end latency under 30 seconds. In practice, most of that time is spent waiting for the EHR to send the data.',
      'Because I built this on standards, it should be EHR-agnostic. I have only tested with Epic, but the architecture should work with any FHIR-compliant system.',
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
      'Walk through the animated timeline',
      'Emphasize sub-30-second end-to-end latency',
      'Highlight each processing stage with timestamps',
      'Show how quickly nurses are notified',
    ],
    keyPoints: [
      'EHR event captured in real-time',
      'FHIR data ingested within 8 seconds',
      'ML risk score computed in 15 seconds',
      'Nurse notified within 22 seconds total',
    ],
    talkingPoints: [
      'I love this visualization because it shows exactly what happens from the moment a nurse enters data to the moment an alert appears.',
      'Let us say a nurse just documented vital signs for a patient. At time zero, they hit save in the EHR.',
      'Within about 8 seconds, that data package — the FHIR bundle — arrives at my ingestion layer. The EHR is doing most of the heavy lifting here.',
      'By 15 seconds, my ML pipeline has ingested the new data, updated the feature vector, and computed a fresh risk score with full SHAP explanations.',
      'At 22 seconds total, the dashboard refreshes. If the risk crossed a threshold — say, went from 45 percent to 78 percent — the nurse receives a notification.',
      'This sub-30-second latency was a key design goal. I did not want nurses waiting minutes for updates. Clinical situations can change fast.',
      'I should note: this is the target architecture. In the prototype demo, I simulate these updates to show the concept.',
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
      'Point out the aggregate statistics at top',
      'Explain the risk distribution visualization',
      'Highlight the priority queue sorting algorithm',
      'Discuss the live update mechanism',
      'Show how risk levels map to clinical urgency',
    ],
    keyPoints: [
      'Aggregate statistics across all NSO categories',
      'Risk distribution by severity level',
      'Priority queue with composite ranking',
      'Real-time updates every 5 minutes',
    ],
    talkingPoints: [
      'Okay, now we are getting to the fun part — the actual dashboard. This is what I have been building for the past year.',
      'What you are looking at is the unit-level overview. Imagine you are a charge nurse coming on shift, and you want a quick snapshot of your unit.',
      'At the top, you can see aggregate statistics: how many patients are on the unit, how many are flagged as high-risk across different categories, and how many have assessments coming due.',
      'Below that is what I call the priority queue. This is not just a patient list — it is automatically ranked by composite risk score.',
      'The algorithm considers risk across all four outcomes, weights them by severity and preventability, and surfaces the patients who need attention first.',
      'See this live indicator in the corner? That tells you the dashboard is actively updating. In production, this would refresh every 5 minutes or whenever new data arrives.',
      'The color coding is intuitive: red means high risk, needs immediate attention. Yellow is elevated risk, close monitoring. Green is stable.',
      'I spent a lot of time on the visual design. Nurses are busy. I wanted something they could glance at and immediately understand.',
    ],
    transitionCue: '→ "Let me drill down into individual patient risk profiles..."',
  },
  {
    id: 'patients',
    title: 'Patient Worklist',
    subtitle: 'Individual Risk Stratification',
    duration: 5,
    icon: <Users className="w-8 h-8" />,
    notes: [
      'Walk through a specific patient row',
      'Explain the risk score interpretation (calibrated probabilities)',
      'Demonstrate the 24-hour trend sparklines',
      'Show confidence indicators and their meaning',
      'Click into a patient detail view',
    ],
    keyPoints: [
      'Calibrated risk probabilities per patient',
      '24-hour trend visualization',
      'Multi-outcome risk profiles',
      'Confidence intervals for clinical trust',
    ],
    talkingPoints: [
      'Now let me show you the patient worklist view. This is where nurses spend most of their time in the dashboard.',
      'Each row represents a single patient with their complete multi-outcome risk profile.',
      'You can see at a glance: this patient has 72 percent falls risk, 34 percent pressure injury risk, and 15 percent CAUTI risk.',
      'These little sparklines — the mini charts — show how risk has trended over the last 24 hours. Is it going up? Going down? Stable?',
      'I added these because static numbers do not tell the whole story. A patient at 60 percent risk who was at 80 percent yesterday is in a very different situation than one who was at 40 percent and is climbing.',
      'See this confidence indicator? It tells nurses how certain the model is about this particular prediction. Higher confidence means more reliable data; lower confidence might mean missing data or unusual patterns.',
      'I think this is important for clinical trust. The system should be honest when it is uncertain.',
      'If I click on any patient row, I can drill into the detailed breakdown... let me show you that.',
    ],
    transitionCue: '→ "Let me show you a complete patient journey through the system..."',
  },
  {
    id: 'patient-journey',
    title: 'Patient Journey',
    subtitle: 'From Admission to Safe Discharge',
    duration: 4,
    icon: <Users className="w-8 h-8" />,
    notes: [
      'Walk through the animated patient timeline',
      'Show risk score changes at each stage',
      'Highlight the intervention point',
      'Emphasize the successful prevention outcome',
    ],
    keyPoints: [
      'Risk tracked from admission to discharge',
      'Real-time updates as clinical data changes',
      'Intervention triggered at threshold',
      'Outcome: Fall prevented, safe discharge',
    ],
    talkingPoints: [
      'I want to walk you through a complete patient journey to show how this system works in practice. This is simulated, but based on realistic clinical patterns.',
      'Meet Margaret Johnson. She is 78 years old, admitted for a total hip replacement. Classic high-risk profile for falls.',
      'At admission, my system calculates her initial risk based on her age, Morse score, medications, and surgical status. She starts at about 55 percent falls risk.',
      'Over the first 24 hours, things are stable. Pain is controlled, she is resting, vitals are normal.',
      'But on day 2 post-op, things change. Her blood pressure drops slightly. She reports dizziness when the physical therapist visits. Her pain medication is adjusted.',
      'Watch the risk score on the right — it starts climbing. 55, then 62, then 71 percent.',
      'At 71 percent, the system crosses the alert threshold. The nurse receives a notification: "Margaret Johnson falls risk escalating — review recommended."',
      'The nurse checks in, adds bed rails, increases rounding frequency, adjusts the medication timing.',
      'Within 12 hours, the risk starts trending down. She mobilizes safely with PT the next day.',
      'Day 4: discharged home without a fall. That is the outcome we want.',
    ],
    transitionCue: '→ "But how do nurses know WHY a patient is high risk? This is where explainability comes in..."',
  },
  {
    id: 'shap',
    title: 'Explainable AI',
    subtitle: 'SHAP-Based Risk Attribution',
    duration: 8,
    icon: <Brain className="w-8 h-8" />,
    notes: [
      'Introduce SHAP: Shapley Additive Explanations',
      'Explain the waterfall visualization',
      'Walk through specific risk factors for demo patient',
      'Discuss why clinical validation of explanations matters',
      'Highlight how transparency builds trust',
      'Mention that explainability is expected to improve adoption',
    ],
    keyPoints: [
      'Shapley values from cooperative game theory',
      'Additive feature contributions',
      'Red = risk-increasing, Green = protective',
      'Explainability expected to improve nurse adoption',
    ],
    talkingPoints: [
      'This is probably my favorite part of the entire system, and I think it is what sets this approach apart.',
      'Here is the problem with most clinical AI: it gives you a number — "72 percent risk" — but it does not tell you WHY. It is a black box.',
      'I fundamentally believe that black-box predictions are not acceptable in clinical settings. Nurses need to understand the reasoning, not just the output.',
      'So I integrated SHAP — Shapley Additive Explanations. It comes from cooperative game theory, but the concept is simple: it shows how much each factor contributed to this specific prediction.',
      'Look at this waterfall chart. Each bar represents a clinical factor. Red bars pushed the risk UP. Green bars pushed it DOWN.',
      'For this patient, you can see: impaired mobility added 18 points to the risk. Age over 75 added 12 points. The recent opioid administration added 8 points.',
      'But stable blood pressure subtracted 6 points. A recent safety assessment subtracted 4 points.',
      'The nurse can look at this and say, "Okay, I cannot change the patient is age, but I CAN increase monitoring after opioid doses. I CAN ensure the call light is within reach."',
      'This is actionable intelligence, not just a scary number.',
      'In my informal user research, nurses told me this kind of transparency is what they need to trust the system. They do not want to be told what to do; they want information to support their own judgment.',
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
      'Present the case study timeline',
      'Emphasize the 3-minute alert-to-awareness time',
      'Discuss the intervention recommendation engine',
      'Show how AI augments, not replaces, nursing judgment',
      'Reference the pilot program results',
    ],
    keyPoints: [
      '3-minute average alert-to-awareness',
      'Evidence-based intervention recommendations',
      'Nurse retains clinical decision authority',
      'Seamless EHR workflow integration',
    ],
    talkingPoints: [
      'I want to talk about workflow integration because, frankly, this is where most clinical AI projects fail.',
      'You can have the most accurate model in the world, but if it does not fit into how nurses actually work, it will be ignored.',
      'I designed this system with a core philosophy: human-in-the-loop. The AI informs, the nurse decides. Period.',
      'Here is what the workflow looks like in practice: an alert fires. Within about 3 minutes on average, the nurse becomes aware — either through the dashboard, a mobile notification, or the charge nurse.',
      'The system does suggest evidence-based interventions. If falls risk is elevated, it might recommend bed sensor activation, increased rounding, or medication review.',
      'But — and this is crucial — the nurse retains all clinical decision authority. They can accept, modify, or dismiss the recommendation.',
      'This is not automation. I am not trying to replace nursing judgment. I am trying to augment it.',
      'Think of it like a GPS. The GPS suggests a route, but you are still driving. You can take a different road if you know better.',
      'I also designed it to minimize alert fatigue. The system is not constantly pinging nurses. It only alerts when risk crosses meaningful thresholds and there is something actionable to do.',
    ],
    transitionCue: '→ "So does it actually work? Let me share what I know so far..."',
  },
  {
    id: 'validation',
    title: 'Validation Approach',
    subtitle: 'Planned Study Design & Target Metrics',
    duration: 5,
    icon: <Award className="w-8 h-8" />,
    notes: [
      'Present DESIGN TARGETS (not validated): AUROC 0.89 from synthetic data',
      'Emphasize these are targets, NOT proven outcomes',
      'Highlight patent innovations: forecasting, adaptive thresholds, closed-loop feedback',
      'Address planned study design - no clinical trials conducted yet',
      'Mention IRB submission planned',
    ],
    keyPoints: [
      'Target AUROC: 0.89 (synthetic data only)',
      'Design targets for sensitivity/specificity',
      'Goal: 40-70% false positive reduction',
      'NO clinical validation completed yet',
      'Prospective study in planning',
    ],
    talkingPoints: [
      'Okay, I want to be really transparent here because I think honesty about validation status is crucial.',
      'You may have noticed an AUROC of 0.89 mentioned. I need to be clear: that number comes from synthetic validation data that I generated, not from real clinical settings.',
      'I have NOT conducted a clinical trial. I have NOT completed an IRB study. This is a research prototype.',
      'The targets you see — 34 percent reduction in falls, 40 to 70 percent reduction in false positives — those are design goals, not measured outcomes.',
      'I am actively preparing for prospective validation. That means partnering with a hospital, getting IRB approval, and testing this with real patients and real nurses.',
      'But I want to be upfront: I am not there yet.',
      'The provisional patent I have filed covers the technical approach — the architecture, the SHAP integration, the adaptive thresholds. It does not claim validated clinical outcomes.',
      'I share this because I think there is too much hype in healthcare AI. I would rather under-promise and over-deliver.',
      'The methodology is sound. The prototype works. But proof in real clinical settings is still ahead of me.',
    ],
    transitionCue: '→ "Let me show you the potential return on investment..."',
  },
  {
    id: 'roi',
    title: 'ROI Calculator',
    subtitle: 'Projected Cost Savings from Prevention',
    duration: 4,
    icon: <Target className="w-8 h-8" />,
    notes: [
      'Walk through the interactive calculator',
      'Adjust parameters for different hospital sizes',
      'Emphasize ALL projections require validation',
      'Be clear: no clinical trial data supports these numbers yet',
    ],
    keyPoints: [
      'Adjust parameters for your institution',
      'Falls cost $30K average per incident',
      'Additional savings from HAPI, CAUTI, LOS',
      'Projected 3-5x return on investment',
    ],
    talkingPoints: [
      'I built this ROI calculator because I know that hospital leadership thinks in terms of costs and savings.',
      'Let me walk you through the math, but remember: these are projections, not proven outcomes.',
      'This calculator lets you adjust parameters for your specific institution. You can change the bed count, the baseline fall rate, the assumed reduction percentage.',
      'Let us say you have a 200-bed hospital with a typical fall rate of about 3 per 1,000 patient days. That works out to maybe 100 falls per year.',
      'If my system achieves even a 40 percent reduction — which is the design target — that is 40 fewer falls.',
      'At an average cost of $30,000 per fall — including extended stay, treatment, and legal exposure — that represents $1.2 million in direct savings.',
      'Now add in pressure injury prevention. Stage 3 and 4 pressure injuries cost $20,000 to $150,000 each. CAUTI adds about $5,000 to $10,000 per infection.',
      'The combined potential savings could be several million dollars annually for a mid-sized hospital.',
      'But I want to emphasize: these projections assume the system performs as designed. Real-world validation is still needed.',
      'The point is not to make promises — it is to show that IF this works, the financial case is compelling.',
    ],
    transitionCue: '→ "Looking ahead, here is my roadmap..."',
  },
  {
    id: 'future',
    title: 'Future Directions',
    subtitle: 'Roadmap & Research Opportunities',
    duration: 3,
    icon: <Lightbulb className="w-8 h-8" />,
    notes: [
      'Multi-site validation study planned',
      'Integration with additional EHR vendors',
      'Expansion to additional nursing outcomes',
      'Federated learning for privacy-preserving training',
      'Regulatory pathway considerations (FDA)',
    ],
    keyPoints: [
      'Multi-site validation study (2026)',
      'Additional EHR integrations',
      'Federated learning implementation',
      'FDA regulatory pathway exploration',
    ],
    talkingPoints: [
      'Let me share my roadmap and where I am headed next.',
      'The biggest priority is validation. I am actively seeking a hospital partner for a prospective study, ideally starting in 2026.',
      'The study design would be a stepped-wedge cluster randomized trial — rolling out the system to different units over time and comparing outcomes.',
      'I also want to expand EHR compatibility. Right now, my testing has been with Epic. I want to integrate with Cerner, Meditech, and other major systems.',
      'Longer-term, I am excited about federated learning. This would allow me to train improved models using data from multiple institutions without ever centralizing patient data. Privacy-preserving machine learning.',
      'I am also exploring FDA regulatory pathways. Depending on how the system is used, it might be classified as clinical decision support software, which has specific regulatory requirements.',
      'And honestly? I am looking for collaborators. I am one person. I have built this prototype, but turning it into something that actually helps patients is going to require partnerships.',
      'If anyone here is interested in discussing — whether for validation studies, EHR integration, or research collaboration — I would love to connect.',
    ],
    transitionCue: '→ "To wrap up and take questions..."',
  },
  {
    id: 'conclusion',
    title: 'Thank You',
    subtitle: 'Questions & Discussion',
    duration: 2,
    icon: <MessageSquare className="w-8 h-8" />,
    notes: [
      'Summarize key takeaways',
      'Invite questions from the audience',
      'Provide contact information',
      'Mention collaboration opportunities',
    ],
    keyPoints: [
      'AI-augmented nursing quality monitoring',
      'Real-time, explainable risk prediction',
      'Human-in-the-loop design philosophy',
      'Contact: alexis.collier@ung.edu',
    ],
    talkingPoints: [
      'To summarize what I have shared today: I built a prototype AI system that predicts nursing-sensitive outcomes in real-time.',
      'The system is explainable — nurses can see exactly why a patient is flagged as high-risk using SHAP visualizations.',
      'It is designed to integrate into clinical workflow rather than disrupting it.',
      'The core philosophy is human-in-the-loop: augmenting nursing judgment, not replacing it.',
      'I want to be honest about where I am: this is a research prototype with a provisional patent. Clinical validation is still ahead of me.',
      'But I believe the approach is sound, and I am excited about the potential to help prevent patient harm.',
      'Thank you so much for your time and attention today. I genuinely appreciate you being here.',
      'I would love to hear your questions, answer any concerns, and discuss potential collaborations.',
      'My email is on the screen: alexis.collier@ung.edu. Please do not hesitate to reach out.',
      '',
      '--- ANTICIPATED Q&A CHEAT SHEET ---',
      '',
      '--- VALIDATION QUESTION (HARD) ---',
      'Q: "What validation studies have you completed?"',
      'A: This is currently a research prototype. I have designed the system based on clinical workflow analysis and literature review, but prospective validation studies are planned for 2026. The metrics shown today are targets and illustrative examples, not completed study results.',
      'Key points: Research prototype - not yet validated. IRB submission in preparation. Multi-site study planned for 2026. All metrics are projections/targets.',
      '',
      '--- MODEL ACCURACY QUESTION (MEDIUM) ---',
      'Q: "What is the model accuracy? How do you handle false positives?"',
      'A: My target is AUC of 0.85+ with balanced sensitivity and specificity around 80 percent. I use calibrated probabilities so a 70 percent risk means 70 out of 100 similar patients would have the event. Alert thresholds are adjustable to balance sensitivity vs alert fatigue for each unit.',
      'Key points: Target AUC 0.85+. Calibrated probabilities, not just classifications. Adjustable thresholds per unit. These are design targets, not validated results.',
      '',
      '--- EHR INTEGRATION QUESTION (EASY) ---',
      'Q: "How does this integrate with our EHR system?"',
      'A: The system is designed for standards-based integration using HL7 FHIR R4 and HL7v2 protocols. This means compatibility with any compliant EHR system. Implementation would involve working with your IT team to establish the data feed and on-premise deployment.',
      'Key points: HL7 FHIR R4 and HL7v2 standards. Works with any compliant EHR. On-premise deployment option. IT partnership required.',
      '',
      '--- WORKFLOW QUESTION (MEDIUM) ---',
      'Q: "How does this fit into nursing workflow without adding burden?"',
      'A: The system is designed as decision support, not additional documentation. Nurses review alerts and suggested interventions but retain full clinical authority. I target 3-minute average alert-to-awareness time. The goal is to surface relevant information, not create new charting requirements.',
      'Key points: No additional documentation required. Decision support, not automation. Nurse retains clinical authority. Information surfacing, not data entry.',
      '',
      '--- COST/ROI QUESTION (MEDIUM) ---',
      'Q: "What does implementation cost? What is the ROI timeline?"',
      'A: Implementation costs vary by institution size and IT infrastructure. My projections suggest a 3-5x ROI based on prevented adverse events, with break-even typically in the first year. I would be happy to discuss a more detailed analysis for your specific context.',
      'Key points: Varies by institution size. Projected 3-5x ROI. Break-even typically year 1. Happy to do institution-specific analysis.',
      '',
      '--- BIAS/ETHICS QUESTION (HARD) ---',
      'Q: "How do you address algorithmic bias in the model?"',
      'A: This is a critical consideration in my design. I plan to evaluate model performance across demographic subgroups during validation. The SHAP explainability allows me to detect if protected characteristics are inappropriately influencing predictions. Ongoing monitoring for disparate impact is part of my planned governance framework.',
      'Key points: Subgroup performance evaluation planned. SHAP enables bias detection. Ongoing monitoring planned. Governance framework in development.',
      '',
      '--- FDA/REGULATORY QUESTION (HARD) ---',
      'Q: "Is this FDA approved? What is the regulatory pathway?"',
      'A: Clinical decision support software may be exempt from FDA regulation depending on how it is used. I am exploring the regulatory pathway and working to ensure the system qualifies as a non-device CDS under the 21st Century Cures Act. Final regulatory status will depend on specific implementation and claims.',
      'Key points: Exploring regulatory pathway. May qualify as non-device CDS. 21st Century Cures Act considerations. Depends on implementation/claims.',
      '',
      '--- COLLABORATION QUESTION (EASY) ---',
      'Q: "How can our institution get involved or collaborate?"',
      'A: I am actively seeking validation partners for my planned multi-site study. This could involve pilot implementations, data sharing agreements, or research collaboration. Please reach out via email and I can discuss what partnership might look like for your institution.',
      'Key points: Seeking validation partners. Pilot implementation opportunities. Research collaboration possible. Contact: alexis.collier@ung.edu',
      '',
      '--- REMEMBER ---',
      'This is a research prototype. Metrics are targets, not results. Validation studies planned. Contact: alexis.collier@ung.edu',
    ],
    transitionCue: '→ "Thank you! I am happy to take questions..."',
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
            slide.id === 'problem' ? "bg-risk-high/20 text-risk-high" :
            slide.id === 'validation' ? "bg-risk-low/20 text-risk-low" :
            "bg-primary/20 text-primary"
          )}>
            {slide.icon}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {slide.title}
          </h1>
          
          {slide.subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {slide.subtitle}
            </p>
          )}

          {/* Key points for content slides */}
          {slide.keyPoints && (
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="grid gap-4 text-left">
                {slide.keyPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <span className="text-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Title slide branding */}
          {slide.id === 'title' && (
            <div className="mt-12">
              <div className="flex items-center justify-center gap-3 text-lg text-primary mb-4">
                <Sparkles className="w-5 h-5" />
                <span>Stanford AI+HEALTH 2025</span>
              </div>
              <p className="text-sm text-muted-foreground">
                December 10, 2025 • Research Prototype • Patent Pending
              </p>
            </div>
          )}

          {/* Conclusion slide contact */}
          {slide.id === 'conclusion' && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center gap-3 text-lg text-primary">
                <GraduationCap className="w-5 h-5" />
                <span>alexis.collier@ung.edu</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Patent Pending • All Rights Reserved • 2025
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
