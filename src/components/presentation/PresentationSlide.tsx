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
      'Say hi, introduce yourself',
      'Thank everyone for coming',
      'This is a prototype - still in research phase',
      'Patent pending - my own work',
    ],
    talkingPoints: [
      'Hi everyone! Thanks so much for being here today.',
      'I am Alexis Collier, and I am really excited to show you what I have been working on.',
      'Basically, I built a dashboard that uses AI to help nurses predict and prevent bad things from happening to patients - like falls, bed sores, and catheter infections.',
      'I have been working on this for about a year now.',
      'Quick heads up: this is still a research project, and I have a patent pending on it. I am happy to talk about how it works, just keeping some of the secret sauce proprietary for now.',
      'Also - I did this myself, so any mistakes are on me!',
    ],
    transitionCue: '→ "Let me show you what we will cover today..."',
  },
  {
    id: 'agenda',
    title: 'Presentation Agenda',
    subtitle: '38-Minute Walkthrough',
    duration: 2,
    icon: <BookOpen className="w-8 h-8" />,
    notes: [
      'Quick overview of what is coming',
      'Let them know they can ask questions anytime',
      'Point out the demo is the fun part',
    ],
    keyPoints: [
      'The Problem - Why This Matters (5 min)',
      'How It Works - The Tech Stuff (8 min)',
      'Live Demo - See It In Action (5 min)',
      'How Nurses Understand It - SHAP Explained (8 min)',
      'Does It Work? - Validation (5 min)',
      'What Is Next & Questions (7 min)',
    ],
    talkingPoints: [
      'Here is what we are going to cover in the next 38 minutes.',
      'First, I will talk about the problem - why we need something like this.',
      'Then I will explain how it works at a high level. I will keep the tech stuff simple, I promise.',
      'The fun part is the live demo where you can see the actual dashboard working.',
      'I will also show you something I think is really important - how nurses can actually understand WHY a patient is at risk, not just that they are.',
      'Then I will be honest about what I have proven so far and what still needs work.',
      'Please jump in with questions anytime! The best conversations happen when we go off-script a bit.',
    ],
    transitionCue: '→ "There is also a recorded version if you want to watch later..."',
  },
  {
    id: 'video-demo',
    title: 'Recorded Presentation',
    subtitle: 'Platform Overview Video',
    duration: 1,
    icon: <BarChart3 className="w-8 h-8" />,
    notes: [
      'This is for people watching the recording',
      '5-minute overview of what the system does',
      'They can pause and explore on their own',
    ],
    keyPoints: [
      'Stanford AI+HEALTH 2025',
      '5-minute platform overview',
      'Dashboard features demonstrated',
      'Available for async viewing',
    ],
    talkingPoints: [
      'If you are watching the recorded version, thanks for taking the time!',
      'This is a quick 5-minute walkthrough of the main features.',
      'Feel free to pause anytime to poke around the dashboard yourself.',
      'My email is at the end if you have questions.',
    ],
    transitionCue: '→ "So let me start with why this matters..."',
  },
  {
    id: 'problem',
    title: 'The Clinical Problem',
    subtitle: 'Preventable Adverse Events in Nursing Care',
    duration: 5,
    icon: <AlertTriangle className="w-8 h-8" />,
    notes: [
      'These numbers are shocking - let them sink in',
      'This is why I built this',
      'Current systems are too late - they tell you AFTER something bad happens',
      'What if we could predict problems BEFORE they happen?',
    ],
    keyPoints: [
      '700,000+ hospital falls every year in the US',
      '2.5 million pressure injuries (bed sores)',
      '75,000 catheter infections (CAUTIs)',
      'Costs hospitals over $50 billion per year',
      'Current monitoring tells us AFTER patients get hurt, not before',
    ],
    talkingPoints: [
      'Let me share some numbers that really got me motivated to build this.',
      'Every year in the US: 700,000 patients fall in hospitals. 2.5 million get bed sores. 75,000 get infections from catheters.',
      'These are not just numbers to me. Each one is a real person who got hurt - and many of these could have been prevented.',
      'Hospitals spend over 50 billion dollars a year dealing with these problems.',
      'Here is what frustrated me: the way quality monitoring works today, we only find out AFTER something bad happens. The patient already fell. The bed sore already formed.',
      'I kept thinking: what if we could see trouble coming? What if we could give nurses a heads up 30 minutes or an hour before things go wrong?',
      'That question is what started this whole project.',
    ],
    transitionCue: '→ "Let me show you how my approach is different..."',
  },
  {
    id: 'comparison',
    title: 'Traditional vs Predictive',
    subtitle: 'Paradigm Shift in Quality Monitoring',
    duration: 4,
    icon: <TrendingUp className="w-8 h-8" />,
    notes: [
      'Left side = old way (wait for bad stuff, then react)',
      'Right side = my way (predict and prevent)',
      'Not replacing nurses - helping them',
      'Like a spell-checker for patient risk',
      'COMPETITIVE NOTE: Epic and Cerner have basic reminders, but no real-time ML prediction with explainability',
    ],
    keyPoints: [
      'Old way: Wait for something bad, then analyze what happened',
      'My way: Watch data in real-time, predict problems before they happen',
      'Goal: Prevent 40% of falls before they occur',
      'AI helps nurses - it does NOT replace them',
      'Unlike existing solutions: Real-time + Explainable + Actionable',
    ],
    talkingPoints: [
      'This slide shows the big difference between how things work now and what I built.',
      'The old way: something bad happens, someone files an incident report, we analyze it, we try to prevent it next time. Problem is - the patient already got hurt.',
      'My approach: the system watches patient data constantly and predicts risk BEFORE bad things happen.',
      'Instead of asking "what happened?" we are asking "what MIGHT happen in the next few hours?"',
      'I want to be super clear about something: I am NOT trying to replace nurses. Nurses are amazing clinicians with instincts no AI can match.',
      'My goal is to help them by surfacing patterns that are hard to spot when you are juggling 6 patients at once.',
      'Think of it like spell-check. It does not write for you, but it highlights things you might want to look at.',
      'By the way - I researched what else is out there. Epic and Cerner have basic catheter reminder alerts, and there are some research papers using ML for prediction. But nothing I found combines real-time prediction with the explainability features I built. Most existing tools are either rule-based or black-box AI that nurses cannot understand.',
    ],
    transitionCue: '→ "Now let me explain how the tech works..."',
  },
  {
    id: 'methodology',
    title: 'Methodology & Architecture',
    subtitle: 'Machine Learning Pipeline & Clinical Integration',
    duration: 8,
    icon: <Microscope className="w-8 h-8" />,
    notes: [
      'Pull data from the EHR in real-time',
      '47 things we look at (vitals, assessments, labs, etc.)',
      'Gradient boosting = the AI technique I use',
      'Goal: update risk scores within 5 minutes of new data',
      'Keep it simple - they do not need to understand the math',
    ],
    keyPoints: [
      'Pulls data from the medical record system in real-time',
      'Looks at 47 different clinical factors',
      'Uses a type of AI called gradient boosting',
      'Goal: update within 5 minutes of new data',
      'Gives honest probability estimates',
    ],
    talkingPoints: [
      'Okay, let me explain how this actually works. I will keep it simple.',
      'The system pulls data from the hospital medical record system in real-time. It uses a standard called FHIR, which most modern systems support.',
      'I picked 47 different things to look at - vitals, nursing assessments, lab results, medications. Research shows these are the things that matter for predicting problems.',
      'For the AI part, I use something called gradient boosting. I chose this over fancier deep learning because it gives honest probability estimates.',
      'What do I mean by honest? If the system says a patient has 70% chance of falling, that should actually mean about 70 out of 100 similar patients would fall. Not higher, not lower.',
      'This matters because if nurses see the system crying wolf too often, they will ignore it.',
      'My goal is to update risk scores within 5 minutes of any new data - ideally much faster.',
      'Speed matters. The earlier the warning, the more time nurses have to do something about it.',
    ],
    transitionCue: '→ "Let me show you exactly what data I look at..."',
  },
  {
    id: 'ml-features',
    title: 'Clinical Feature Set',
    subtitle: '47 Features Across 7 Categories',
    duration: 3,
    icon: <Brain className="w-8 h-8" />,
    notes: [
      '7 categories of data',
      'Vital signs AND trends over time',
      'Standard nursing assessments (Morse, Braden)',
      'Lab values, meds, mobility, timing factors',
    ],
    keyPoints: [
      'Vital signs and how they change over 24 hours',
      'Standard nursing assessment scores',
      'Lab values like albumin and hemoglobin',
      'Risky medications and mobility status',
    ],
    talkingPoints: [
      'Here are the 47 things the system looks at, organized into 7 categories.',
      'First: vital signs. But not just one reading - I look at 24-hour trends. Is blood pressure going up? Is heart rate getting more jumpy?',
      'Next: nursing assessments you already do, like Morse Fall Scale and Braden Score. I am using data nurses already document.',
      'Lab values: albumin, hemoglobin, white blood cell count. These tell us about nutrition and infection risk.',
      'Medications: especially ones that increase fall risk like sedatives, pain meds, blood pressure pills.',
      'Mobility: Can the patient walk alone? Do they need help? Are they stuck in bed?',
      'And timing: How long since the last assessment? Days since admission? These help catch care gaps.',
      'You can click on any category to see the details. I tried to pick things that nurses already document and that research shows actually matter.',
    ],
    transitionCue: '→ "Now let me show you how the data flows through the system..."',
  },
  {
    id: 'ehr-flow',
    title: 'EHR Data Flow',
    subtitle: 'Standards-Based Integration Architecture',
    duration: 3,
    icon: <GitBranch className="w-8 h-8" />,
    notes: [
      'Data goes: EHR → My system → Dashboard',
      'Uses industry standards so it works with any modern EHR',
      'Target: under 30 seconds from data entry to updated score',
    ],
    keyPoints: [
      'Uses industry standards (HL7 FHIR)',
      'Goal: data to dashboard in under 30 seconds',
      'Predicts 4 types of problems (falls, pressure injuries, CAUTIs, med errors)',
      'Should work with Epic, Cerner, or any modern system',
    ],
    talkingPoints: [
      'This diagram shows how data flows through the system.',
      'Starting on the left: the hospital medical record system - Epic, Cerner, whatever they use.',
      'When a nurse documents something - vitals, an assessment, giving a medication - that triggers data to flow to my system.',
      'My system validates the data, runs it through the AI, and pushes updated risk scores to the dashboard.',
      'I am aiming for under 30 seconds end-to-end. Most of that time is actually waiting for the EHR to send the data.',
      'Because I built this on industry standards, it should work with any modern medical record system. I have only tested with Epic, but the design should be portable.',
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
      'Show how fast things happen',
      'Nurse enters data → 8 seconds → data arrives',
      '→ 15 seconds → AI calculates new score',
      '→ 22 seconds → nurse gets alert',
      'This is target timing for the prototype',
    ],
    keyPoints: [
      'Nurse enters data: time zero',
      'Data arrives at system: 8 seconds',
      'AI calculates new score: 15 seconds',
      'Nurse gets alert: 22 seconds total',
    ],
    talkingPoints: [
      'I love this part because it shows exactly what happens when a nurse enters data.',
      'Let us say a nurse just documented vital signs and hit save. That is time zero.',
      'Within about 8 seconds, that data arrives at my system.',
      'By 15 seconds, the AI has crunched the numbers and calculated a fresh risk score.',
      'At 22 seconds total, the dashboard updates. If the risk crossed a danger threshold, the nurse gets a notification.',
      'This speed was a key goal. Clinical situations can change fast, so I did not want nurses waiting around for updates.',
      'I should mention: in the prototype demo, I simulate these updates to show the concept.',
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
      'This is what charge nurses see at shift start',
      'Top: quick stats for the whole unit',
      'Priority queue: auto-ranked by risk',
      'Colors: red = danger, yellow = watch, green = okay',
      'Updates every 5 minutes',
    ],
    keyPoints: [
      'Quick stats at the top for the whole unit',
      'Patient list auto-ranked by risk level',
      'Updates every 5 minutes',
      'Red = danger, Yellow = watch, Green = okay',
    ],
    talkingPoints: [
      'Okay, here is the actual dashboard! This is what I have been building for the past year.',
      'Imagine you are a charge nurse starting your shift and you want a quick snapshot of your unit.',
      'At the top: quick stats. How many patients? How many are high-risk? Any assessments coming due?',
      'Below that is the priority queue. This is not just a patient list - it automatically ranks patients by how much attention they need.',
      'The ranking looks at risk across all four categories, weights them by how serious and preventable they are, and bubbles up the patients who need help first.',
      'See this "live" indicator? That means the dashboard is actively updating. In real use, it would refresh every 5 minutes or whenever new data comes in.',
      'Colors are simple: red means danger, yellow means watch closely, green means stable.',
      'I spent a lot of time on the design. Nurses are busy. I wanted something you can glance at and immediately understand.',
    ],
    transitionCue: '→ "Let me drill into individual patients..."',
  },
  {
    id: 'patients',
    title: 'Patient Worklist',
    subtitle: 'Individual Risk Stratification',
    duration: 5,
    icon: <Users className="w-8 h-8" />,
    notes: [
      'Each row = one patient with all their risks',
      'Sparklines show 24-hour trends',
      'Confidence indicator = how sure the AI is',
      'Click any row for details',
    ],
    keyPoints: [
      'Each patient shows all their risk scores',
      'Mini charts show 24-hour trends',
      'Confidence indicator shows how certain the AI is',
      'Click any patient for the full breakdown',
    ],
    talkingPoints: [
      'This is the patient worklist - where nurses spend most of their time.',
      'Each row is one patient with their complete risk picture.',
      'At a glance: this patient has 72% falls risk, 34% bed sore risk, 15% catheter infection risk.',
      'These little mini-charts show how risk has changed over the last 24 hours. Going up? Going down? Holding steady?',
      'I added these because a snapshot does not tell the whole story. A patient at 60% who was at 80% yesterday is very different from one at 40% who is climbing.',
      'See the confidence indicator? That tells nurses how certain the AI is about this prediction. Higher confidence means better data; lower might mean something is missing.',
      'I think this honesty is important. The system should admit when it is not sure.',
      'Click any patient row and you get the full detailed breakdown.',
    ],
    transitionCue: '→ "Let me walk you through a patient journey..."',
  },
  {
    id: 'patient-journey',
    title: 'Patient Journey',
    subtitle: 'From Admission to Safe Discharge',
    duration: 4,
    icon: <Users className="w-8 h-8" />,
    notes: [
      'Tell Margaret story - 78 year old hip replacement',
      'Risk starts at 55%, climbs to 71%',
      'Alert fires, nurse intervenes',
      'Risk drops, patient goes home safe',
    ],
    keyPoints: [
      'Risk tracked from day 1 to discharge',
      'Updates as new data comes in',
      'Alert fires when risk gets dangerous',
      'Intervention prevents the fall',
    ],
    talkingPoints: [
      'Let me walk you through a complete patient story to show how this works in practice.',
      'Meet Margaret Johnson. 78 years old, came in for a hip replacement. Classic high-risk patient for falls.',
      'At admission, the system calculates her starting risk based on age, fall risk score, medications, surgery type. She starts at about 55%.',
      'First 24 hours: things are stable. Pain is controlled, she is resting, vitals look good.',
      'But on day 2 after surgery, things change. Blood pressure drops a bit. She feels dizzy when PT visits. Pain meds get adjusted.',
      'Watch the risk score - it starts climbing. 55... 62... 71%.',
      'At 71%, the system crosses the danger threshold. The nurse gets an alert: "Margaret Johnson falls risk escalating - please review."',
      'The nurse checks in, puts up bed rails, increases how often they check on her, adjusts medication timing.',
      'Within 12 hours, risk starts dropping. She walks safely with PT the next day.',
      'Day 4: she goes home without falling. That is exactly what we want.',
    ],
    transitionCue: '→ "But how do nurses know WHY she was flagged? That is where explainability comes in..."',
  },
  {
    id: 'shap',
    title: 'Explainable AI',
    subtitle: 'SHAP-Based Risk Attribution',
    duration: 8,
    icon: <Brain className="w-8 h-8" />,
    notes: [
      'THIS IS THE BIG DIFFERENTIATOR',
      'Most AI is a black box - gives a number but no explanation',
      'SHAP shows exactly what factors pushed risk up or down',
      'Red bars = bad factors, Green bars = protective factors',
      'Nurses can actually DO something about specific factors',
    ],
    keyPoints: [
      'Shows exactly WHY a patient is at risk',
      'Red bars = factors increasing risk',
      'Green bars = protective factors',
      'Nurses can take action on specific items',
    ],
    talkingPoints: [
      'Okay, THIS is my favorite part, and I think it is what makes this system different from everything else out there.',
      'Here is the problem with most AI in healthcare: it gives you a number - "72% risk" - but it does not tell you WHY. It is a black box.',
      'I believe black-box predictions are not okay for patient care. Nurses need to understand the reasoning.',
      'So I built in something called SHAP - it shows how much each factor contributed to this specific patient risk score.',
      'Look at this chart. Each bar is one factor. Red bars pushed risk UP. Green bars pushed it DOWN.',
      'For this patient: being unable to walk well added 18 points. Being over 75 added 12 points. Recent pain medication added 8 points.',
      'But stable blood pressure subtracted 6 points. A recent safety check subtracted 4 points.',
      'Now the nurse can say: "I cannot change her age, but I CAN watch her more closely after pain meds. I CAN make sure the call button is in reach."',
      'This is useful information, not just a scary number.',
      'When I showed this to nurses, they told me this is exactly what they need to trust the system. They do not want to be told what to do - they want information to support their own judgment.',
    ],
    transitionCue: '→ "But predictions are only useful if they fit into how nurses actually work..."',
  },
  {
    id: 'workflow',
    title: 'Clinical Workflow Integration',
    subtitle: 'Human-in-the-Loop Design',
    duration: 5,
    icon: <GitBranch className="w-8 h-8" />,
    notes: [
      'Most AI projects fail because they do not fit the workflow',
      'Human-in-the-loop: AI informs, nurse decides',
      'Average 3 minutes from alert to nurse awareness',
      'System suggests actions, nurse has final say',
      'Like GPS - suggests a route, you still drive',
    ],
    keyPoints: [
      'Alert reaches nurse in about 3 minutes',
      'System suggests evidence-based actions',
      'Nurse always has the final decision',
      'Like GPS - suggests, but you drive',
    ],
    talkingPoints: [
      'Let me talk about workflow because honestly, this is where most AI projects fail.',
      'You can have the smartest AI in the world, but if it does not fit how nurses actually work, they will ignore it.',
      'My core philosophy: human-in-the-loop. The AI gives information, the nurse makes decisions. Period.',
      'Here is how it works: an alert fires. Within about 3 minutes, the nurse knows - either from the dashboard, a phone notification, or the charge nurse.',
      'The system suggests actions based on evidence. If falls risk is high, it might recommend bed sensors, more frequent checks, or medication review.',
      'But - and this is crucial - the nurse has all the decision power. They can follow the suggestion, modify it, or ignore it.',
      'This is not about automation. I am not trying to replace nursing judgment. I am trying to support it.',
      'Think of it like GPS. The GPS suggests a route, but you are still driving. You can take a different road if you know better.',
      'I also designed it to avoid alert fatigue. It does not ping nurses constantly - only when risk crosses meaningful thresholds and there is actually something to do about it.',
    ],
    transitionCue: '→ "So does it actually work? Let me be honest about that..."',
  },
  {
    id: 'validation',
    title: 'Validation Approach',
    subtitle: 'Planned Study Design & Target Metrics',
    duration: 5,
    icon: <Award className="w-8 h-8" />,
    notes: [
      'BE HONEST - these are targets, not proven results',
      '0.89 accuracy is from fake test data, not real patients',
      'No clinical trial yet - still planning',
      'IRB submission coming',
      'The tech works, proof with real patients is next',
    ],
    keyPoints: [
      'Target accuracy: 0.89 (tested on fake data only)',
      'Goal: 40-70% fewer false alarms',
      'NO real hospital testing done yet',
      'Clinical study is being planned',
    ],
    talkingPoints: [
      'Okay, I want to be really honest here because I think transparency matters.',
      'You might have seen that 0.89 accuracy number. I need to be clear: that came from test data I created, not from real hospitals.',
      'I have NOT done a clinical trial. I have NOT finished an IRB study. This is still a research prototype.',
      'The goals you see - 34% fewer falls, 40-70% fewer false alarms - those are targets, not measured results.',
      'I am actively working on setting up real-world testing. That means finding a hospital partner, getting IRB approval, and testing with real patients and nurses.',
      'But I am not there yet.',
      'My patent covers the technical approach - how I built it. It does not claim I have proven clinical outcomes.',
      'I share this because there is too much hype in healthcare AI. I would rather be honest than over-promise.',
      'The methodology is sound. The prototype works. But real-world proof is still ahead of me.',
    ],
    transitionCue: '→ "If it does work, here is what the payoff could look like..."',
  },
  {
    id: 'roi',
    title: 'ROI Calculator',
    subtitle: 'Projected Cost Savings from Prevention',
    duration: 4,
    icon: <Target className="w-8 h-8" />,
    notes: [
      'Hospital leadership cares about costs',
      'This calculator shows potential savings',
      'Falls cost about $30K each',
      'These are projections, not guarantees',
      'IF it works, the financial case is strong',
    ],
    keyPoints: [
      'Adjust numbers for your hospital size',
      'Falls cost about $30,000 each',
      'Bed sores cost $20K-$150K each',
      'Potential 3-5x return on investment',
    ],
    talkingPoints: [
      'I built this calculator because I know hospital leadership thinks about money.',
      'Let me walk through the math, but remember: these are projections, not proven.',
      'You can adjust this for your hospital. Change the bed count, the fall rate, the expected improvement.',
      'Say you have a 200-bed hospital with a typical fall rate. That might be 100 falls per year.',
      'If my system prevents even 40% of those - that is 40 fewer falls.',
      'At $30,000 average cost per fall - including extra hospital days, treatment, legal stuff - that is $1.2 million saved.',
      'Add in preventing bed sores ($20K-$150K each) and catheter infections ($5K-$10K each)...',
      'The combined savings could be several million dollars a year for a mid-sized hospital.',
      'But I want to emphasize: this assumes the system works as designed. Real-world testing is still needed.',
      'The point is not to make promises. It is to show that IF this works, the financial case is compelling.',
    ],
    transitionCue: '→ "Here is what comes next..."',
  },
  {
    id: 'future',
    title: 'Future Directions',
    subtitle: 'Roadmap & Research Opportunities',
    duration: 3,
    icon: <Lightbulb className="w-8 h-8" />,
    notes: [
      'Priority #1: Real hospital testing (2026 target)',
      'Want to work with more EHR systems',
      'Exploring FDA requirements',
      'Looking for partners and collaborators',
    ],
    keyPoints: [
      'Real hospital study planned for 2026',
      'Want to work with more medical record systems',
      'Looking into FDA requirements',
      'Seeking partners and collaborators',
    ],
    talkingPoints: [
      'Let me share what is next on my roadmap.',
      'Top priority is validation. I am looking for a hospital partner for a real study, hopefully starting in 2026.',
      'I also want to test with more medical record systems. So far I have worked with Epic, but I want to make sure it works with Cerner and others.',
      'Longer-term, I am excited about something called federated learning - basically training better AI using data from multiple hospitals without ever centralizing patient info.',
      'I am also figuring out FDA requirements. Depending on how this gets used, there might be specific regulatory hoops.',
      'And honestly? I need help. I built this prototype alone, but making it real is going to take partners.',
      'If anyone here is interested in discussing - validation studies, EHR integration, research collaboration - I would love to connect.',
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
      'Quick recap of the main points',
      'Thank everyone',
      'Open for questions',
      'Share email for follow-up',
    ],
    keyPoints: [
      'AI that predicts patient problems in real-time',
      'Shows nurses exactly WHY someone is at risk',
      'Helps nurses - does not replace them',
      'Contact: alexis.collier@ung.edu',
    ],
    talkingPoints: [
      'To sum up: I built a prototype AI system that predicts patient problems in real-time.',
      'The key difference from other AI: nurses can see exactly WHY a patient is flagged, not just that they are.',
      'It is designed to fit into how nurses actually work, not disrupt it.',
      'My philosophy: help nurses be even better, do not try to replace them.',
      'I want to be honest: this is a prototype. Clinical testing is still ahead.',
      'But I believe the approach is solid, and I am excited about the potential to prevent patient harm.',
      'Thank you so much for being here! I really appreciate your time.',
      'I am happy to take questions, hear concerns, discuss partnerships.',
      'My email is on the screen: alexis.collier@ung.edu. Please reach out!',
      '',
      '(See Q&A Prep tab for common questions and suggested answers)',
    ],
    transitionCue: '→ "Questions?"',
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
            <div className="mt-8 text-left max-w-2xl mx-auto space-y-3">
              {slide.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
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
