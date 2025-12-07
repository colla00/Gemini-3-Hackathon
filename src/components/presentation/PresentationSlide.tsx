import { cn } from '@/lib/utils';
import { 
  BarChart3, Target, Brain, Users, GitBranch, Sparkles, 
  GraduationCap, CheckCircle, AlertTriangle, TrendingUp,
  Clock, Award, BookOpen, Microscope, Lightbulb, MessageSquare
} from 'lucide-react';

export type SlideType = 
  | 'title' 
  | 'agenda' 
  | 'problem' 
  | 'methodology' 
  | 'dashboard' 
  | 'patients' 
  | 'shap' 
  | 'workflow' 
  | 'validation' 
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
      'Good morning/afternoon, thank you for joining this session on AI-augmented nursing quality monitoring.',
      'I am [Name], and I am excited to share our research prototype developed at [Institution].',
      'This work represents a novel approach to predicting and preventing nurse-sensitive adverse outcomes.',
    ],
    transitionCue: '→ "Let me walk you through what we will cover today..."',
  },
  {
    id: 'agenda',
    title: 'Presentation Agenda',
    subtitle: '45-Minute Walkthrough',
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
      'Live Dashboard Demonstration (15 min)',
      'SHAP Explainability Deep-Dive (8 min)',
      'Validation Results (5 min)',
      'Future Directions & Q&A (7 min)',
    ],
    talkingPoints: [
      'We will start by framing the clinical problem — why this matters for patient safety.',
      'Then I will explain our technical methodology at a high level.',
      'The bulk of our time will be a live demonstration of the dashboard.',
      'Feel free to ask questions as we go — this is meant to be interactive.',
    ],
    transitionCue: '→ "First, let us understand the scope of the problem..."',
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
      'Every year, hundreds of thousands of patients experience preventable adverse events.',
      'These are not just statistics — each represents a patient who suffered harm that could have been avoided.',
      'The financial burden exceeds 50 billion dollars annually, but the human cost is immeasurable.',
      'Current quality monitoring is retrospective — we find out after the harm has occurred.',
      'What if we could predict these events before they happen?',
    ],
    transitionCue: '→ "This gap motivated our approach. Let me show you how we built a solution..."',
  },
  {
    id: 'methodology',
    title: 'Methodology & Architecture',
    subtitle: 'Machine Learning Pipeline & Clinical Integration',
    duration: 8,
    icon: <Microscope className="w-8 h-8" />,
    notes: [
      'Data sources: EHR, nursing assessments, lab values, vitals',
      'Feature engineering: 47 clinical features including validated scales',
      'Model: Gradient boosting ensemble with calibrated probabilities',
      'Integration: HL7 FHIR for real-time data streaming',
      'Latency: Sub-5-minute from EHR event to dashboard update',
      'Discuss model training cohort (n=2,847) and validation approach',
    ],
    keyPoints: [
      'Real-time EHR integration via HL7 FHIR',
      '47 clinical features from validated scales',
      'Gradient boosting ensemble model',
      'Sub-5-minute data latency',
      'Calibrated probability outputs',
    ],
    talkingPoints: [
      'We pull data in real-time from the EHR via HL7 FHIR interfaces.',
      'Our feature set includes 47 clinically-validated variables — Braden scores, Morse falls, lab trends.',
      'The model is a gradient boosting ensemble, chosen for its interpretability and calibration.',
      'Critically, outputs are calibrated probabilities — a 70% risk means 70 out of 100 similar patients will have the event.',
      'From data change to dashboard update is under 5 minutes.',
    ],
    transitionCue: '→ "Now let me show you the dashboard in action..."',
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
      'This is the unit-level overview — what a charge nurse would see at shift start.',
      'The top cards show aggregate counts: total patients, high-risk patients, pending assessments.',
      'The priority queue automatically ranks patients by composite risk score.',
      'Notice the live indicator — this updates every 5 minutes as new data flows in.',
      'Red means immediate attention needed; yellow means close monitoring; green is stable.',
    ],
    transitionCue: '→ "Let us drill down into individual patient risk profiles..."',
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
      'Each row represents a patient with their multi-outcome risk profile.',
      'You can see falls risk, pressure injury risk, and CAUTI risk side by side.',
      'The sparklines show how risk has trended over the last 24 hours — is it increasing or decreasing?',
      'The confidence indicator tells nurses how certain the model is about this prediction.',
      'Clicking on a patient reveals the detailed breakdown...',
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
      'Discuss clinical validation of explanations',
      'Highlight how transparency builds trust',
      'Mention the nursing acceptance study (62% → 89%)',
    ],
    keyPoints: [
      'Shapley values from cooperative game theory',
      'Additive feature contributions',
      'Red = risk-increasing, Green = protective',
      '89% nurse acceptance with explanations',
    ],
    talkingPoints: [
      'Black-box predictions are not acceptable in clinical settings. Nurses need to understand WHY.',
      'We use SHAP — Shapley Additive Explanations — from cooperative game theory.',
      'Each bar shows how much a specific factor contributed to this patients risk.',
      'Red bars push risk up — impaired mobility, age over 75, abnormal labs.',
      'Green bars are protective — stable vitals, recent assessment, appropriate interventions.',
      'In our usability study, nurse acceptance jumped from 62% to 89% when explanations were shown.',
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
      'The best predictions are useless if they do not fit into clinical workflow.',
      'We designed for a human-in-the-loop model — AI informs, nurse decides.',
      'Average time from alert to nurse awareness is 3 minutes.',
      'The system suggests evidence-based interventions but the nurse retains authority.',
      'This is not automation — it is augmentation of clinical judgment.',
    ],
    transitionCue: '→ "So does it actually work? Let me share our pilot results..."',
  },
  {
    id: 'validation',
    title: 'Validation Results',
    subtitle: 'Pilot Program Outcomes',
    duration: 5,
    icon: <Award className="w-8 h-8" />,
    notes: [
      'Present the key metrics: AUC-ROC 0.89, sensitivity 0.84, specificity 0.91',
      'Discuss the 34% reduction in preventable falls',
      'Mention nurse satisfaction scores (4.2/5)',
      'Address limitations and confounders',
      'Compare to historical controls',
    ],
    keyPoints: [
      'AUC-ROC: 0.89 (aggregate)',
      'Sensitivity: 84%, Specificity: 91%',
      '34% reduction in preventable falls (p<0.01)',
      'Nurse satisfaction: 4.2/5.0',
      '847 patient encounters in pilot',
    ],
    talkingPoints: [
      'Our 6-month pilot included 847 patient encounters across two units.',
      'Model performance: AUC of 0.89, sensitivity 84%, specificity 91%.',
      'Most importantly — we saw a 34% reduction in preventable falls compared to historical controls.',
      'This was statistically significant at p less than 0.01.',
      'Nurse satisfaction averaged 4.2 out of 5 — they found it genuinely useful.',
      'I should note limitations: this was a single-site study with historical controls, not a randomized trial.',
    ],
    transitionCue: '→ "Looking ahead, here is our roadmap..."',
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
      'We are planning a multi-site validation study for 2026.',
      'We want to expand beyond Epic to other EHR vendors.',
      'Federated learning will allow training across institutions without sharing patient data.',
      'We are also exploring FDA regulatory pathways as this could be classified as clinical decision support.',
      'I would love to discuss collaboration opportunities with anyone interested.',
    ],
    transitionCue: '→ "To wrap up..."',
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
      'To summarize: we built an AI system that predicts nursing-sensitive outcomes in real-time.',
      'It is explainable, it integrates into workflow, and early results are promising.',
      'The key philosophy is human-in-the-loop — augmenting nurses, not replacing them.',
      'I would love to hear your questions and discuss potential collaborations.',
      'My email is on screen — please reach out.',
    ],
    transitionCue: '→ "Thank you! I am happy to take questions..."',
  },
];
export const TOTAL_PRESENTATION_TIME = PRESENTATION_SLIDES.reduce((acc, s) => acc + s.duration, 0);

interface PresentationSlideProps {
  slide: SlideConfig;
  isActive: boolean;
  children?: React.ReactNode;
}

export const PresentationSlideView = ({ slide, isActive, children }: PresentationSlideProps) => {
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
