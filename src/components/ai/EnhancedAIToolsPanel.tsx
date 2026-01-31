import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAIToolsPowerPoint } from '@/lib/aiToolsPptExport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  RefreshCw,
  Stethoscope,
  Brain,
  Activity,
  AlertTriangle,
  Scale,
  Lightbulb,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  ChevronDown,
  Cpu,
  Upload,
  Copy,
  Download,
  Share2,
  Presentation,
  FileText,
  Bell,
  BarChart3,
  Shield,
  Users,
  Image as ImageIcon,
  Info,
  Target,
  AlertCircle,
  Ruler,
  MapPin,
  Bandage,
  Heart,
  Volume2,
  VolumeX,
  Printer,
  Eye,
  HelpCircle,
  PlayCircle,
  Loader2,
  Pause,
  Play
} from 'lucide-react';

// ============================================================================
// SAMPLE DATA FOR DEMOS
// ============================================================================

const CLINICAL_NOTE_EXAMPLES = {
  restless: "Patient restless overnight. Found attempting to climb out of bed at 0230hrs. Reoriented x3. States need to 'go home to feed cats.' Lorazepam 2mg PO given at 0300hrs per protocol. Patient now resting quietly. Bed alarm activated.",
  confusion: "Patient confused and combative during morning care. Unable to follow simple commands. Family reports this is new behavior. Vital signs stable. Urinalysis ordered to rule out UTI. Safety sitter assigned.",
  pain: "Patient reports 8/10 pain in left hip. Repositioned to right side. Pressure relief cushion applied. Pain reassessed after 30 min - reports 4/10. Wound care consult requested for Stage 2 sacral injury noted during repositioning."
};

const PATIENT_SCENARIOS = {
  elderly: { age: 82, gender: 'M', mobility: 'Walker', meds: 'Lorazepam 2mg, Ambien', braden: 14, catheterDays: 0, name: 'High Risk Elderly' },
  postSurgical: { age: 68, gender: 'F', mobility: 'Bedbound', meds: 'Opioids for pain', braden: 12, catheterDays: 4, name: 'Post-Surgical' },
  longTerm: { age: 79, gender: 'M', mobility: 'Wheelchair', meds: 'None significant', braden: 16, catheterDays: 8, name: 'Long-Term Care' }
};

const ALERT_SCENARIOS = [
  { id: '1', label: 'Sedation + Mobility Risk', patientId: '847261', room: '19', bed: 'A', riskType: 'Falls', trigger: 'Lorazepam 2mg administered at 14:30', details: 'Patient ambulates with walker. Recent near-fall incident (3 days ago). Age 82 with balance issues.' },
  { id: '2', label: 'Catheter Duration Alert', patientId: '892134', room: '12', bed: 'B', riskType: 'CAUTI', trigger: 'Catheter day 6 - exceeds 5-day guideline', details: 'No documented catheter necessity review in 48 hours.' },
  { id: '3', label: 'Wound Assessment Overdue', patientId: '783421', room: '8', bed: 'A', riskType: 'Pressure Injury', trigger: 'Sacral wound reassessment overdue by 4 hours', details: 'Stage II pressure injury documented. Last assessment at 0600.' },
  { id: '4', label: 'Vital Sign Deterioration', patientId: '654123', room: '22', bed: 'C', riskType: 'Clinical', trigger: 'MAP decreased 15% in last 2 hours', details: 'Post-op day 1, history of hypotension.' },
  { id: '5', label: 'Medication Interaction', patientId: '912345', room: '15', bed: 'A', riskType: 'Falls', trigger: 'New sedative + existing CNS depressant', details: 'Cumulative sedation score elevated.' }
];

const PATIENT_CONTEXT_FACTORS = [
  { id: 'age', label: 'Advanced age (>75)', checked: true },
  { id: 'sedation', label: 'Recent sedative medication', checked: true },
  { id: 'mobility', label: 'Mobility limitations', checked: true },
  { id: 'cognitive', label: 'Cognitive impairment', checked: false },
  { id: 'fallHistory', label: 'Previous fall history', checked: false },
  { id: 'sensory', label: 'Visual/hearing impairment', checked: false }
];

// ============================================================================
// MOCK RESULT GENERATORS
// ============================================================================

const generateClinicalNotesResult = (notes: string) => ({
  warningSigns: [
    { sign: 'Nocturnal confusion/delirium', severity: 'high', icon: 'brain' },
    { sign: 'Unsafe mobility attempt', severity: 'high', icon: 'alert' },
    { sign: 'Sedative administration', severity: 'medium', icon: 'pill' },
    { sign: 'Fall risk indicators', severity: 'high', icon: 'fall' }
  ],
  recommendedActions: [
    { action: 'Activate bed alarm', priority: 'immediate' },
    { action: 'Increase safety rounds to q1h', priority: 'immediate' },
    { action: 'Reassess fall risk score', priority: 'high' },
    { action: 'Consider bedside sitter', priority: 'routine' }
  ],
  riskLevel: 'HIGH',
  confidence: 0.94
});

const generateRiskNarrativeResult = (shapValue: number, factors: string[]) => {
  const factorDescriptions: Record<string, string> = {
    age: 'At 82 years old, this patient has age-related changes in balance, muscle strength, and bone density that increase both fall likelihood and injury severity.',
    sedation: 'The Lorazepam 2mg administered reduces balance awareness and reaction time. This medication effect will peak over the next 2-4 hours.',
    mobility: 'Walker dependence indicates existing balance and strength challenges. Combining this with sedative effects creates compounding risk.',
    cognitive: 'Cognitive impairment affects the patient\'s ability to recognize hazards and follow safety instructions.',
    fallHistory: 'A documented history of falls significantly increases the probability of future fall events.',
    sensory: 'Visual and/or hearing limitations reduce environmental awareness and hazard detection.'
  };

  const activeFactors = factors.map(f => factorDescriptions[f] || '').filter(Boolean);
  
  return {
    technicalOutput: {
      shapScore: shapValue,
      features: [
        { name: 'age_factor', weight: 0.24 },
        { name: 'medication_score', weight: 0.31 },
        { name: 'mobility_index', weight: 0.18 }
      ]
    },
    narrative: `This patient has a **${shapValue >= 0.6 ? 'HIGH' : shapValue >= 0.3 ? 'MODERATE' : 'LOW'} fall risk** (${(shapValue * 100).toFixed(0)}% probability).`,
    primaryFactors: activeFactors.slice(0, 3),
    clinicalInterpretation: 'The combination of these factors creates a temporary high-risk window. While the patient\'s baseline risk is moderate (mobility + age), the acute sedative administration elevates immediate fall risk significantly.',
    recommendedTimeframe: 'Heightened precautions needed for next 4-6 hours until medication effects diminish.',
    confidence: 0.91
  };
};

const generateInterventionsResult = (riskType: string, riskLevel: string) => ({
  riskType,
  riskLevel,
  header: `Evidence-Based Interventions for ${riskLevel} ${riskType} Risk`,
  categories: [
    {
      name: 'Environmental Modifications',
      priority: 'IMMEDIATE',
      interventions: [
        { action: 'Bed alarm activation', evidenceLevel: 'Class I (AHA/ACC)', rationale: '73% reduction in unwitnessed falls', timeline: 'NOW' },
        { action: 'Remove clutter from pathways', evidenceLevel: 'Best Practice', rationale: 'Reduces trip hazards', timeline: 'NOW' },
        { action: 'Adequate lighting (especially nighttime)', evidenceLevel: 'Class II', rationale: 'Improves spatial awareness', timeline: 'NOW' }
      ]
    },
    {
      name: 'Clinical Interventions',
      priority: 'URGENT',
      interventions: [
        { action: 'Medication review for fall risk drugs', evidenceLevel: 'Class I', rationale: 'Identifies modifiable risk factors', timeline: 'Within 24 hours' },
        { action: 'Physical therapy consultation', evidenceLevel: 'Class II', rationale: 'Improved balance/strength', timeline: 'Within 24 hours' },
        { action: 'Hip protector consideration', evidenceLevel: 'Class IIa', rationale: 'For high-risk patients with osteoporosis', timeline: 'As appropriate' }
      ]
    },
    {
      name: 'Monitoring & Documentation',
      priority: 'ONGOING',
      interventions: [
        { action: 'Increase rounding frequency to q1h', evidenceLevel: 'Best Practice', rationale: 'Duration: First 24-48 hours', timeline: 'Ongoing' },
        { action: 'Reassess fall risk score daily', evidenceLevel: 'Required (TJC standard)', rationale: 'Regulatory compliance', timeline: 'Each shift' },
        { action: 'Document interventions in EHR', evidenceLevel: 'Regulatory requirement', rationale: 'Legal documentation', timeline: 'Real-time' }
      ]
    }
  ],
  projectedReduction: 65,
  implementationTimeline: [
    { phase: 'Immediate (0-1 hour)', items: ['Bed alarm', 'Environment'] },
    { phase: 'Urgent (1-4 hours)', items: ['Medication review'] },
    { phase: 'Routine (24-48 hours)', items: ['PT consult', 'Ongoing monitoring'] }
  ]
});

const generateEquityResult = (dateRange: string) => ({
  dateRange,
  unit: '4C',
  census: 24,
  heatmapData: [
    { outcome: 'Pressure Injury', ageOver75: 2.3, medicaid: 1.4, nonEnglish: 1.0, genderDiff: 1.1 },
    { outcome: 'Falls', ageOver75: 1.6, medicaid: 1.1, nonEnglish: 1.5, genderDiff: 2.1 },
    { outcome: 'CAUTI', ageOver75: 0.9, medicaid: 2.2, nonEnglish: 1.0, genderDiff: 1.3 },
    { outcome: 'Response Time', ageOver75: 1.4, medicaid: 1.5, nonEnglish: 2.0, genderDiff: 1.0 }
  ],
  findings: [
    {
      title: 'Age-Related Pressure Injury Gap',
      rate: '2.3x higher in patients >75 years old',
      significance: 'p < 0.05',
      affected: '6 of 26 total',
      rootCauses: [
        'Repositioning protocol not age-adjusted',
        'Skin assessment frequency identical across ages',
        'No age-specific Braden score thresholds',
        'Staff education gap on geriatric skin fragility'
      ]
    },
    {
      title: 'Language Barrier Impact',
      rate: '2.0x longer response time for non-English speakers',
      significance: 'p < 0.03',
      affected: '4 of 24 total',
      rootCauses: [
        'Interpreter delays averaging 12 minutes',
        'Limited multilingual staff on night shift',
        'Call light instructions not translated',
        'Pain assessment tools English-only'
      ]
    },
    {
      title: 'Medicaid CAUTI Elevation',
      rate: '2.2x higher CAUTI rate in Medicaid patients',
      significance: 'p < 0.048',
      affected: 'Extended catheter use',
      rootCauses: [
        'Delayed discharge planning',
        'Limited home care resources',
        'Extended catheter use pre-discharge',
        'Insurance pre-authorization delays'
      ]
    }
  ],
  recommendations: {
    immediate: [
      'Implement age-stratified Braden protocols',
      'Increase repositioning frequency for >75 age group',
      'Deploy video interpreter tablets (24/7 access)',
      'Expedite catheter removal reviews for Medicaid patients'
    ],
    systemChanges: [
      'Hire multilingual staff or contract interpreters',
      'Translate all patient education materials',
      'Create equity dashboard for monthly review',
      'Partner with social work for discharge planning'
    ]
  },
  metrics: [
    { target: 'Pressure injury rate parity by age', goal: '<1.2x' },
    { target: 'Response time equity', goal: '<1.3x across languages' },
    { target: 'CAUTI rate standardization', goal: '<1.3x by payer' }
  ],
  projectedImpact: 65,
  regulatory: ['CMS Health Equity Mandate', 'TJC Patient-Centered Standards', 'State health equity requirements']
});

const generatePressureInjuryResult = (sampleId: number) => ({
  stage: sampleId === 1 ? 'II (Partial Thickness)' : 'III (Full Thickness)',
  confidence: sampleId === 1 ? 0.94 : 0.89,
  assessment: {
    size: sampleId === 1 ? '~3cm x 2cm' : '~4cm x 3.5cm',
    location: sampleId === 1 ? 'Sacral region' : 'Left heel',
    woundBed: sampleId === 1 ? 'Pink/red, moist' : 'Granulating, some slough',
    healing: sampleId === 1 ? 'Appropriate progression' : 'Slow progression - monitor closely'
  },
  recommendations: sampleId === 1 ? [
    'Continue current treatment plan',
    'Maintain q2h repositioning',
    'Reassess in 48 hours',
    'Monitor for signs of infection'
  ] : [
    'Wound care consult recommended',
    'Consider enzymatic debridement',
    'Offload heel with positioning device',
    'Reassess in 24 hours',
    'Nutritional assessment for healing'
  ],
  stageColor: sampleId === 1 ? 'orange' : 'red'
});

const generateSmartAlertResult = (scenario: typeof ALERT_SCENARIOS[0]) => ({
  priority: scenario.riskType === 'Clinical' ? 'CRITICAL' : 'IMMEDIATE',
  priorityColor: scenario.riskType === 'Clinical' ? 'red' : scenario.riskType === 'Falls' ? 'red' : 'amber',
  patient: `${scenario.patientId}, Room ${scenario.room}, Bed ${scenario.bed}`,
  headline: `${scenario.riskType} Risk: ELEVATED → HIGH`,
  timestamp: new Date().toLocaleTimeString(),
  trigger: scenario.trigger,
  clinicalContext: scenario.details,
  actions: [
    { action: 'Activate bed alarm NOW', urgency: 'immediate', checked: false },
    { action: `Safety rounds q1h until ${new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, urgency: 'immediate', checked: false },
    { action: 'Reassess risk score (current: 8.2/10)', urgency: 'high', checked: false },
    { action: 'Brief evening shift during handoff', urgency: 'routine', checked: false }
  ],
  rationale: 'Sedative medication temporarily impairs balance and judgment in elderly patients. Peak effect window: next 4 hours. Existing mobility limitations compound risk.',
  reassessAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  alertId: `ALT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`
});

const generateUnitTrendsResult = (timeRange: string, riskTypes: { falls: boolean; pressure: boolean; cauti: boolean }) => ({
  timeRange,
  unit: '4C',
  census: 24,
  trendData: [
    { hour: '00:00', falls: 0.4, pressure: 0.3, cauti: 0.5 },
    { hour: '02:00', falls: 0.6, pressure: 0.3, cauti: 0.5 },
    { hour: '04:00', falls: 0.7, pressure: 0.3, cauti: 0.5 },
    { hour: '06:00', falls: 0.5, pressure: 0.4, cauti: 0.5 },
    { hour: '08:00', falls: 0.4, pressure: 0.4, cauti: 0.5 },
    { hour: '10:00', falls: 0.3, pressure: 0.5, cauti: 0.5 },
    { hour: '12:00', falls: 0.3, pressure: 0.5, cauti: 0.5 },
    { hour: '14:00', falls: 0.4, pressure: 0.5, cauti: 0.5 },
    { hour: '16:00', falls: 0.4, pressure: 0.6, cauti: 0.5 },
    { hour: '18:00', falls: 0.5, pressure: 0.7, cauti: 0.5 },
    { hour: '20:00', falls: 0.5, pressure: 0.6, cauti: 0.5 },
    { hour: '22:00', falls: 0.5, pressure: 0.4, cauti: 0.5 }
  ],
  peakPeriods: [
    { riskType: 'Falls', period: '2:00 AM - 6:00 AM', context: 'night shift', factors: 'Reduced staffing ratio (1:8), patient confusion peaks, bathroom visits' },
    { riskType: 'Pressure Injuries', period: '6:00 PM - 8:00 PM', context: 'shift change', factors: 'Delayed repositioning during handoff, meal service interruptions' },
    { riskType: 'CAUTI', period: 'Elevated consistently', context: 'no diurnal pattern', factors: '4 patients with catheters >5 days, average duration: 6.3 days' }
  ],
  patterns: [
    { pattern: 'Strong correlation between staffing ratio and falls risk', correlation: 'r=0.78' },
    { pattern: 'Repositioning compliance drops 34% during meal times', correlation: '11:30-13:00' },
    { pattern: 'Alert response time 2.4x slower on weekends vs weekdays', correlation: '' },
    { pattern: 'Catheter duration exceeds clinical guidelines in 60% of cases', correlation: '' }
  ],
  recommendations: {
    immediate: [
      'Add safety rounds 2-6 AM (peak falls window)',
      'Designate handoff coordinator for continuity',
      'Catheter necessity review for 4 patients'
    ],
    systemChanges: [
      'Consider staffing adjustment for night shift',
      'Implement "meal coverage" protocol',
      'Weekend alert escalation pathway'
    ],
    qualityMetrics: [
      { metric: 'Reduce night falls by 40%', status: 'Target' },
      { metric: '100% catheter justification documentation', status: 'Goal' },
      { metric: 'Repositioning compliance >90%', status: 'Monitor' }
    ]
  },
  projectedImpact: 28
});

const generateMultiRiskResult = (patientData: typeof PATIENT_SCENARIOS.elderly) => ({
  patientSummary: `${patientData.age}yo ${patientData.gender}, ${patientData.mobility}`,
  assessments: {
    falls: {
      score: patientData.mobility === 'Bedbound' ? 6.0 : patientData.mobility === 'Walker' ? 8.2 : patientData.mobility === 'Wheelchair' ? 5.5 : 3.0,
      level: patientData.mobility === 'Walker' || patientData.meds.includes('Lorazepam') ? 'HIGH' : patientData.mobility === 'Wheelchair' ? 'MODERATE' : 'LOW',
      factors: [
        `Age ${patientData.age}${patientData.age >= 75 ? ' (high risk)' : ''}`,
        patientData.meds !== 'None significant' ? `Recent sedation (${patientData.meds})` : 'No sedating medications',
        `${patientData.mobility} dependent`,
        patientData.mobility === 'Walker' ? 'History of near-fall' : ''
      ].filter(Boolean),
      interventions: patientData.mobility === 'Walker' || patientData.meds.includes('Lorazepam') ? 
        ['Bed alarm activation', 'q1h safety rounds', 'Physical therapy consult'] :
        ['Standard precautions', 'Monitor mobility']
    },
    pressure: {
      score: patientData.braden <= 12 ? 7.5 : patientData.braden <= 14 ? 5.4 : 3.0,
      level: patientData.braden <= 12 ? 'HIGH' : patientData.braden <= 14 ? 'MODERATE' : 'LOW',
      factors: [
        `Braden score: ${patientData.braden}`,
        patientData.mobility === 'Bedbound' ? 'Bedbound - high risk' : 'Limited mobility',
        patientData.age >= 75 ? 'Age-related skin fragility' : ''
      ].filter(Boolean),
      interventions: patientData.braden <= 14 ? 
        ['Continue q2h repositioning', 'Pressure relief devices', 'Monitor bony prominences'] :
        ['Standard repositioning protocol']
    },
    cauti: {
      score: patientData.catheterDays >= 5 ? 7.8 : patientData.catheterDays > 0 ? 4.5 : 2.1,
      level: patientData.catheterDays >= 5 ? 'HIGH' : patientData.catheterDays > 0 ? 'MODERATE' : 'LOW',
      factors: patientData.catheterDays > 0 ? 
        [`Catheter: ${patientData.catheterDays} days`, patientData.catheterDays >= 5 ? 'Exceeds 5-day guideline' : '', 'No UTI symptoms'] :
        ['No catheter in place', 'No urinary symptoms'],
      interventions: patientData.catheterDays >= 5 ? 
        ['URGENT: Catheter necessity review', 'Consider removal TODAY', 'Document justification'] :
        patientData.catheterDays > 0 ? ['Daily catheter review', 'Consider removal', 'Monitor for symptoms'] :
        ['No catheter indicated', 'Monitor for symptoms']
    }
  },
  overallPriority: patientData.mobility === 'Walker' || patientData.meds.includes('Lorazepam') ? 'HIGH - Falls Prevention' : 
    patientData.braden <= 12 ? 'HIGH - Skin Integrity' : 
    patientData.catheterDays >= 5 ? 'HIGH - Catheter Review' : 'MODERATE - Standard Care'
});

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const moduleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.01, boxShadow: '0 8px 30px -10px rgba(0,0,0,0.15)' }
};

const contentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
};

const resultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } }
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const staggerItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

// ============================================================================
// MODULE CARD WRAPPER
// ============================================================================

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  model: 'flash' | 'pro';
  color: string;
  isExpanded: boolean;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const ModuleCard = ({
  id,
  title,
  description,
  icon: Icon,
  model,
  color,
  isExpanded,
  isActive,
  onToggle,
  children
}: ModuleCardProps) => {
  return (
    <motion.div
      variants={moduleVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card className={cn(
        "transition-all duration-300 overflow-hidden",
        isExpanded && "ring-2 ring-primary/50 shadow-lg",
        isActive && "border-primary/50 shadow-lg shadow-primary/10"
      )}>
        <CardHeader
          className="cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg", color)}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                  {title}
                  {isActive && (
                    <Badge className="bg-green-500 text-white text-[10px] animate-pulse">
                      Demo Active
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium",
                  model === 'pro' ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/10" : "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/10"
                )}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Gemini 3 {model === 'pro' ? 'Pro' : 'Flash'}
              </Badge>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CardContent className="pt-0 pb-4">
                <Separator className="mb-4" />
                {children}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// ============================================================================
// PREMIUM LOADING INDICATOR
// ============================================================================

interface LoadingIndicatorProps {
  model: 'flash' | 'pro';
  estimatedTime?: number;
  message?: string;
}

const LoadingIndicator = ({ model, estimatedTime = 1.5, message }: LoadingIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  React.useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 8, 95));
    }, estimatedTime * 80);
    
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    
    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [estimatedTime]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-5"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
      
      <div className="relative space-y-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut'
            }}
            className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30"
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-foreground">
                {message || `Processing with Gemini 3 ${model === 'pro' ? 'Pro' : 'Flash'}`}
              </span>
              <span className="text-primary font-mono text-sm w-6">{dots}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Analyzing clinical patterns and generating insights
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full blur-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Est. {estimatedTime}s remaining
            </span>
            <span className="font-mono">{progress.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// RESULT ACTIONS (Demo only - no actual functionality)
// ============================================================================

interface ResultActionsProps {
  processingTime: number;
  model?: 'flash' | 'pro';
}

const ResultActions = ({ processingTime, model = 'flash' }: ResultActionsProps) => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({ 
      title: `📋 ${action}`, 
      description: "This feature is for demo purposes only",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center justify-between mt-4 pt-3 border-t border-border/50"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.4 }}
        >
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </motion.div>
        <div className="flex items-center gap-2">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground"
          >
            Analyzed in
          </motion.span>
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold"
          >
            <Zap className="h-3 w-3" />
            {processingTime.toFixed(1)}s
          </motion.span>
        </div>
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Badge className="gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg shadow-blue-500/25 text-xs font-bold px-2.5 py-1">
            <Sparkles className="h-3 w-3" />
            Gemini 3 {model === 'pro' ? 'Pro' : 'Flash'}
          </Badge>
        </motion.div>
      </div>
      <div className="flex gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleAction('Copy to Clipboard')} 
                className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Copy Results</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleAction('Download PDF')} 
                className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Download PDF</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleAction('Share Results')} 
                className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Share</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};


// ============================================================================
// EQUITY HEATMAP CELL
// ============================================================================

const HeatmapCell = ({ value }: { value: number }) => {
  const getColor = (v: number) => {
    if (v >= 1.8) return 'bg-red-500 text-white';
    if (v >= 1.3) return 'bg-yellow-500 text-black';
    return 'bg-green-500 text-white';
  };

  const getEmoji = (v: number) => {
    if (v >= 1.8) return '🔴';
    if (v >= 1.3) return '🟡';
    return '🟢';
  };

  return (
    <span className={cn("px-2 py-1 rounded text-xs font-medium", getColor(value))}>
      {getEmoji(value)} {value.toFixed(1)}x
    </span>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const EnhancedAIToolsPanel = () => {
  const { toast } = useToast();
  const [demoMode, setDemoMode] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['clinical-notes']));
  const [activeModules, setActiveModules] = useState<Set<string>>(new Set());
  const [analysisCount, setAnalysisCount] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<{ times: number[]; modules: string[] }>({ times: [], modules: [] });
  const [runningAllDemos, setRunningAllDemos] = useState(false);
  const [demoPaused, setDemoPaused] = useState(false);
  const demoPausedRef = React.useRef(false);
  const [currentDemoModule, setCurrentDemoModule] = useState<string | null>(null);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);

  // Module states
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [clinicalNotesResult, setClinicalNotesResult] = useState<ReturnType<typeof generateClinicalNotesResult> | null>(null);
  const [clinicalNotesLoading, setClinicalNotesLoading] = useState(false);

  const [shapValue, setShapValue] = useState([0.73]);
  const [contextFactors, setContextFactors] = useState<Record<string, boolean>>({
    age: true, sedation: true, mobility: true, cognitive: false, fallHistory: false, sensory: false
  });
  const [narrativeResult, setNarrativeResult] = useState<ReturnType<typeof generateRiskNarrativeResult> | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  const [interventionRiskType, setInterventionRiskType] = useState('Falls');
  const [interventionRiskLevel, setInterventionRiskLevel] = useState('HIGH');
  const [interventionConstraints, setInterventionConstraints] = useState<Record<string, boolean>>({
    limitedMobility: false, cognitive: false, language: false, sensory: false
  });
  const [interventionResult, setInterventionResult] = useState<ReturnType<typeof generateInterventionsResult> | null>(null);
  const [interventionLoading, setInterventionLoading] = useState(false);

  const [equityDateRange, setEquityDateRange] = useState('7d');
  const [equityResult, setEquityResult] = useState<ReturnType<typeof generateEquityResult> | null>(null);
  const [equityLoading, setEquityLoading] = useState(false);

  const [pressureSampleId, setPressureSampleId] = useState(1);
  const [pressureResult, setPressureResult] = useState<ReturnType<typeof generatePressureInjuryResult> | null>(null);
  const [pressureLoading, setPressureLoading] = useState(false);
  const [pressureNotes, setPressureNotes] = useState('');

  const [alertScenario, setAlertScenario] = useState(ALERT_SCENARIOS[0]);
  const [alertResult, setAlertResult] = useState<ReturnType<typeof generateSmartAlertResult> | null>(null);
  const [alertLoading, setAlertLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [trendTimeRange, setTrendTimeRange] = useState('24h');
  const [trendRiskTypes, setTrendRiskTypes] = useState({ falls: true, pressure: true, cauti: true });
  const [trendResult, setTrendResult] = useState<ReturnType<typeof generateUnitTrendsResult> | null>(null);
  const [trendLoading, setTrendLoading] = useState(false);

  const [multiRiskPatient, setMultiRiskPatient] = useState(PATIENT_SCENARIOS.elderly);
  const [multiRiskAge, setMultiRiskAge] = useState(82);
  const [multiRiskGender, setMultiRiskGender] = useState('M');
  const [multiRiskMobility, setMultiRiskMobility] = useState('Walker');
  const [multiRiskMeds, setMultiRiskMeds] = useState('Lorazepam 2mg');
  const [multiRiskBraden, setMultiRiskBraden] = useState(14);
  const [multiRiskCatheter, setMultiRiskCatheter] = useState(0);
  const [multiRiskResult, setMultiRiskResult] = useState<ReturnType<typeof generateMultiRiskResult> | null>(null);
  const [multiRiskLoading, setMultiRiskLoading] = useState(false);

  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }, []);

  const simulateProcessing = async (duration: number, moduleId: string): Promise<number> => {
    const delay = demoMode ? 0.1 : duration;
    await new Promise(resolve => setTimeout(resolve, delay * 1000));
    setActiveModules(prev => new Set([...prev, moduleId]));
    setAnalysisCount(prev => prev + 1);
    const time = demoMode ? 0.1 : duration;
    setPerformanceMetrics(prev => ({
      times: [...prev.times, time],
      modules: [...prev.modules, moduleId]
    }));
    return time;
  };

  // ============================================================================
  // MODULE HANDLERS
  // ============================================================================

  const handleClinicalNotesAnalysis = async (notesOverride?: string) => {
    const notes = notesOverride ?? clinicalNotes;
    if (!notes.trim()) {
      toast({ title: "Notes required", description: "Please enter clinical observations", variant: "destructive" });
      return;
    }
    setClinicalNotesLoading(true);
    await simulateProcessing(1.4, 'clinical-notes');
    setClinicalNotesResult(generateClinicalNotesResult(notes));
    setClinicalNotesLoading(false);
  };

  const handleNarrativeGeneration = async () => {
    setNarrativeLoading(true);
    const activeFactors = Object.entries(contextFactors).filter(([_, v]) => v).map(([k]) => k);
    await simulateProcessing(1.1, 'risk-narrative');
    setNarrativeResult(generateRiskNarrativeResult(shapValue[0], activeFactors));
    setNarrativeLoading(false);
  };

  const handleInterventionSuggestions = async () => {
    setInterventionLoading(true);
    await simulateProcessing(1.6, 'interventions');
    setInterventionResult(generateInterventionsResult(interventionRiskType, interventionRiskLevel));
    setInterventionLoading(false);
  };

  const handleEquityAnalysis = async () => {
    setEquityLoading(true);
    await simulateProcessing(2.8, 'health-equity');
    setEquityResult(generateEquityResult(equityDateRange));
    setEquityLoading(false);
  };

  const handlePressureAnalysis = async (sampleId: number) => {
    setPressureSampleId(sampleId);
    setPressureLoading(true);
    await simulateProcessing(1.8, 'pressure-injury');
    setPressureResult(generatePressureInjuryResult(sampleId));
    setPressureLoading(false);
  };

  const handleAlertGeneration = async () => {
    setAlertLoading(true);
    await simulateProcessing(0.9, 'smart-alert');
    setAlertResult(generateSmartAlertResult(alertScenario));
    setAlertLoading(false);
  };

  const handleTrendAnalysis = async () => {
    setTrendLoading(true);
    await simulateProcessing(2.3, 'unit-trends');
    setTrendResult(generateUnitTrendsResult(trendTimeRange, trendRiskTypes));
    setTrendLoading(false);
  };

  const handleMultiRiskAssessment = async () => {
    setMultiRiskLoading(true);
    const patientData = {
      ...multiRiskPatient,
      age: multiRiskAge,
      gender: multiRiskGender,
      mobility: multiRiskMobility,
      meds: multiRiskMeds,
      braden: multiRiskBraden,
      catheterDays: multiRiskCatheter
    };
    await simulateProcessing(1.5, 'multi-risk');
    setMultiRiskResult(generateMultiRiskResult(patientData));
    setMultiRiskLoading(false);
  };

  const loadPatientScenario = (scenario: typeof PATIENT_SCENARIOS.elderly) => {
    setMultiRiskPatient(scenario);
    setMultiRiskAge(scenario.age);
    setMultiRiskGender(scenario.gender);
    setMultiRiskMobility(scenario.mobility);
    setMultiRiskMeds(scenario.meds);
    setMultiRiskBraden(scenario.braden);
    setMultiRiskCatheter(scenario.catheterDays);
  };


  // ============================================================================
  // RUN ALL DEMOS SEQUENTIALLY
  // ============================================================================

  const MODULE_ORDER = [
    'clinical-notes',
    'risk-narrative',
    'interventions',
    'pressure-injury',
    'smart-alert',
    'unit-trends',
    'health-equity',
    'multi-risk'
  ] as const;

  const runAllDemos = async () => {
    if (runningAllDemos) return;
    
    setRunningAllDemos(true);
    setDemoMode(true);
    
    // Reset all results first
    setClinicalNotesResult(null);
    setNarrativeResult(null);
    setInterventionResult(null);
    setPressureResult(null);
    setAlertResult(null);
    setTrendResult(null);
    setEquityResult(null);
    setMultiRiskResult(null);
    
    // Expand all modules
    setExpandedModules(new Set(MODULE_ORDER));

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Wait while paused
    const waitWhilePaused = async () => {
      while (demoPausedRef.current) {
        await delay(100);
      }
    };

    for (let i = 0; i < MODULE_ORDER.length; i++) {
      const moduleId = MODULE_ORDER[i];
      setCurrentDemoIndex(i + 1);
      setCurrentDemoModule(moduleId);
      
      switch (moduleId) {
        case 'clinical-notes':
          setClinicalNotes(CLINICAL_NOTE_EXAMPLES.restless);
          await delay(500);
          await handleClinicalNotesAnalysis(CLINICAL_NOTE_EXAMPLES.restless);
          break;
        case 'risk-narrative':
          await delay(500);
          await handleNarrativeGeneration();
          break;
        case 'interventions':
          await delay(500);
          await handleInterventionSuggestions();
          break;
        case 'pressure-injury':
          await delay(500);
          await handlePressureAnalysis(1);
          break;
        case 'smart-alert':
          await delay(500);
          await handleAlertGeneration();
          break;
        case 'unit-trends':
          await delay(500);
          await handleTrendAnalysis();
          break;
        case 'health-equity':
          await delay(500);
          await handleEquityAnalysis();
          break;
        case 'multi-risk':
          loadPatientScenario(PATIENT_SCENARIOS.elderly);
          await delay(500);
          await handleMultiRiskAssessment();
          break;
      }
      
      // Delay between modules
      await delay(5000);
      // Check if paused before moving to next module
      await waitWhilePaused();
    }
    
    setCurrentDemoModule(null);
    setRunningAllDemos(false);
    
    toast({
      title: "🎬 All Demos Complete!",
      description: `Successfully ran all 8 AI modules. Total analyses: ${analysisCount + MODULE_ORDER.length}`,
    });
  };

  const stopAllDemos = () => {
    setRunningAllDemos(false);
    setDemoPaused(false);
    demoPausedRef.current = false;
    setCurrentDemoModule(null);
  };

  const toggleDemoPause = () => {
    const newPaused = !demoPaused;
    setDemoPaused(newPaused);
    demoPausedRef.current = newPaused;
  };

  const averageTime = performanceMetrics.times.length > 0
    ? (performanceMetrics.times.reduce((a, b) => a + b, 0) / performanceMetrics.times.length).toFixed(1)
    : '0.0';
  const fastestTime = performanceMetrics.times.length > 0
    ? Math.min(...performanceMetrics.times).toFixed(1)
    : '0.0';
  const slowestTime = performanceMetrics.times.length > 0
    ? Math.max(...performanceMetrics.times).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header Banner */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-primary/95 to-accent text-primary-foreground shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
        <CardContent className="relative py-6 px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                <Cpu className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  Clinical AI Engine
                  <Badge className="bg-white/20 text-white border-white/30 text-xs uppercase">
                    8 Interactive Modules
                  </Badge>
                </h1>
                <p className="text-primary-foreground/80 text-sm mt-1">
                  Enterprise-grade AI-powered clinical decision support · Gemini 3 Flash + Pro
                </p>
              </div>
            </div>

            {/* Run All Demos Button */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* PowerPoint Export Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={async () => {
                        toast({ title: '📊 Generating PowerPoint...', description: 'Creating demo voiceover slides' });
                        try {
                          const fileName = await generateAIToolsPowerPoint({ includeVoiceover: true, includeNotes: true });
                          toast({ title: '✅ PowerPoint Generated', description: `Downloaded: ${fileName}` });
                        } catch (err) {
                          toast({ title: '❌ Export Failed', description: 'Please try again', variant: 'destructive' });
                        }
                      }}
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      <Presentation className="h-4 w-4 mr-2" />
                      Export PPTX
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Download PowerPoint with voiceover scripts and speaker notes for all 8 AI modules.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={runningAllDemos ? stopAllDemos : runAllDemos}
                      size="sm"
                      className={cn(
                        "transition-all duration-300 font-semibold",
                        runningAllDemos 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "bg-white text-primary hover:bg-white/90"
                      )}
                    >
                      {runningAllDemos ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Stop
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Run All Demos
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Automatically trigger all 8 modules in sequence with 5-second delays. Perfect for hands-free demo video recording.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Pause/Resume Button - only show when running */}
              <AnimatePresence>
                {runningAllDemos && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={toggleDemoPause}
                            size="sm"
                            className={cn(
                              "transition-all duration-300 font-semibold",
                              demoPaused 
                                ? "bg-green-500 hover:bg-green-600 text-white" 
                                : "bg-amber-500 hover:bg-amber-600 text-white"
                            )}
                          >
                            {demoPaused ? (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                Resume
                              </>
                            ) : (
                              <>
                                <Pause className="h-4 w-4 mr-1" />
                                Pause
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{demoPaused ? 'Resume the demo sequence' : 'Pause to read current module'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current Demo Progress */}
              <AnimatePresence>
                {runningAllDemos && currentDemoModule && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2"
                  >
                    <Badge className="bg-white/20 text-white text-xs font-bold border border-white/30">
                      {currentDemoIndex} of 8
                    </Badge>
                    <Badge className="bg-accent/80 text-white text-[10px] font-medium animate-pulse">
                      {currentDemoModule.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    <Progress 
                      value={(currentDemoIndex / 8) * 100} 
                      className="w-20 h-1.5 bg-white/20 [&>div]:bg-white"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide">Analyses Run</p>
              <p className="text-2xl font-bold mt-0.5">{analysisCount}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide">Avg Response</p>
              <p className="text-2xl font-bold mt-0.5">{averageTime}s</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide">Fastest</p>
              <p className="text-2xl font-bold mt-0.5">{fastestTime}s</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide">Slowest</p>
              <p className="text-2xl font-bold mt-0.5">{slowestTime}s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* MODULE 1: Clinical Notes Analysis */}
        <ModuleCard
          id="clinical-notes"
          title="Clinical Notes Analysis"
          description="Extract warning signs from nurse observations"
          icon={FileText}
          model="flash"
          color="from-blue-500 to-cyan-500"
          isExpanded={expandedModules.has('clinical-notes')}
          isActive={activeModules.has('clinical-notes')}
          onToggle={() => toggleModule('clinical-notes')}
        >
          <div className="space-y-4">
            {/* Quick Examples */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Quick Examples:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setClinicalNotes(CLINICAL_NOTE_EXAMPLES.restless)}
                  className="text-xs h-8 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  Load Example 1: Restless Patient
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setClinicalNotes(CLINICAL_NOTE_EXAMPLES.confusion)}
                  className="text-xs h-8 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  Load Example 2: Confusion
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setClinicalNotes(CLINICAL_NOTE_EXAMPLES.pain)}
                  className="text-xs h-8 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  Load Example 3: Pain Assessment
                </Button>
              </div>
            </div>

            {/* Textarea */}
            <Textarea
              placeholder="Enter nurse observation notes..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="min-h-[120px] resize-none text-sm focus:ring-2 focus:ring-blue-500"
              aria-label="Clinical notes input"
            />

            {/* Analyze Button */}
            <Button
              onClick={() => handleClinicalNotesAnalysis()}
              disabled={clinicalNotesLoading || !clinicalNotes.trim()}
              className="w-full gap-2 bg-[#0066CC] hover:bg-[#0055AA] text-white font-semibold py-3 text-base shadow-lg disabled:opacity-50"
            >
              {clinicalNotesLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing with Gemini 3 Flash...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze with Gemini 3
                </>
              )}
            </Button>

            {clinicalNotesLoading && <LoadingIndicator model="flash" estimatedTime={1.4} />}

            {clinicalNotesResult && !clinicalNotesLoading && (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* Warning Signs Card - Amber */}
                <motion.div 
                  variants={staggerItemVariants}
                  className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200">Warning Signs Detected:</h4>
                  </div>
                  <ul className="space-y-2">
                    {clinicalNotesResult.warningSigns.map((item, i) => (
                      <motion.li 
                        key={i} 
                        variants={staggerItemVariants}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          item.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                        )} />
                        <span>{item.sign}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Recommended Actions Card - Blue */}
                <motion.div 
                  variants={staggerItemVariants}
                  className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 border border-blue-200 dark:border-blue-800 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">Recommended Actions:</h4>
                  </div>
                  <ol className="space-y-2">
                    {clinicalNotesResult.recommendedActions.map((item, i) => (
                      <motion.li 
                        key={i} 
                        variants={staggerItemVariants}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">
                          {i + 1}
                        </span>
                        <span>{item.action}</span>
                        <Badge variant="outline" className={cn(
                          "text-[10px] ml-auto",
                          item.priority === 'immediate' ? 'border-red-500 text-red-600' : 
                          item.priority === 'high' ? 'border-orange-500 text-orange-600' : 'border-gray-400'
                        )}>
                          {item.priority}
                        </Badge>
                      </motion.li>
                    ))}
                  </ol>
                </motion.div>

                <ResultActions processingTime={1.4} />
              </motion.div>
            )}
          </div>
        </ModuleCard>

        {/* MODULE 2: Explainable Risk Narrative */}
        <ModuleCard
          id="risk-narrative"
          title="Explainable Risk Narrative"
          description="Convert SHAP values to plain-language explanations"
          icon={Brain}
          model="flash"
          color="from-purple-500 to-pink-500"
          isExpanded={expandedModules.has('risk-narrative')}
          isActive={activeModules.has('risk-narrative')}
          onToggle={() => toggleModule('risk-narrative')}
        >
          <div className="space-y-4">
            {/* SHAP Score Slider */}
            <div>
              <Label className="text-sm font-medium mb-2 block">SHAP Risk Score</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Slider
                    value={shapValue}
                    onValueChange={setShapValue}
                    min={0}
                    max={1}
                    step={0.01}
                    className="py-2"
                  />
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-lg font-mono text-lg font-bold",
                  shapValue[0] >= 0.6 ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' :
                  shapValue[0] >= 0.3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' :
                  'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                )}>
                  {shapValue[0].toFixed(2)}
                </div>
              </div>
            </div>

            {/* Patient Context Checkboxes */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Patient Context Factors:</Label>
              <div className="grid grid-cols-2 gap-2">
                {PATIENT_CONTEXT_FACTORS.map(factor => (
                  <div key={factor.id} className="flex items-center gap-2">
                    <Checkbox
                      id={factor.id}
                      checked={contextFactors[factor.id]}
                      onCheckedChange={(checked) => setContextFactors(prev => ({ ...prev, [factor.id]: !!checked }))}
                    />
                    <Label htmlFor={factor.id} className="text-xs cursor-pointer">{factor.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleNarrativeGeneration} disabled={narrativeLoading} className="w-full gap-2">
              {narrativeLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Translating AI output...</>
              ) : (
                <><Brain className="h-4 w-4" />Generate Plain-Language Explanation</>
              )}
            </Button>

            {narrativeLoading && <LoadingIndicator model="flash" estimatedTime={1.1} message="Translating AI output..." />}

            {narrativeResult && !narrativeLoading && (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* Before/After Comparison */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Technical Output */}
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-sm text-muted-foreground">Technical Output:</span>
                    </div>
                    <pre className="text-xs font-mono text-muted-foreground bg-background/50 p-2 rounded">
{`SHAP Risk Score: ${narrativeResult.technicalOutput.shapScore.toFixed(2)}
Feature Weights:
${narrativeResult.technicalOutput.features.map(f => `  ${f.name}: ${f.weight.toFixed(2)}`).join('\n')}`}
                    </pre>
                  </div>

                  {/* Human Explanation */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="font-semibold text-sm">Plain-Language Narrative:</span>
                    </div>
                    <p className="text-sm font-medium mb-3" dangerouslySetInnerHTML={{ __html: narrativeResult.narrative.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    
                    <div className="space-y-2 text-xs">
                      <p className="font-semibold text-purple-700 dark:text-purple-300">Primary Factors:</p>
                      {narrativeResult.primaryFactors.map((factor, i) => (
                        <p key={i} className="text-muted-foreground pl-2 border-l-2 border-purple-300">{factor}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-lg text-xs">
                  <p className="font-semibold mb-1">Clinical Interpretation:</p>
                  <p className="text-muted-foreground">{narrativeResult.clinicalInterpretation}</p>
                  <p className="mt-2 text-primary font-medium">⏱ {narrativeResult.recommendedTimeframe}</p>
                </div>

                <ResultActions processingTime={1.1} />
              </motion.div>
            )}
          </div>
        </ModuleCard>

        {/* MODULE 3: Intervention Suggestions */}
        <ModuleCard
          id="interventions"
          title="Intervention Suggestions"
          description="Evidence-based nursing interventions"
          icon={Lightbulb}
          model="flash"
          color="from-orange-500 to-amber-500"
          isExpanded={expandedModules.has('interventions')}
          isActive={activeModules.has('interventions')}
          onToggle={() => toggleModule('interventions')}
        >
          <div className="space-y-4">
            {/* Risk Type */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Risk Type</Label>
              <Select value={interventionRiskType} onValueChange={setInterventionRiskType}>
                <SelectTrigger aria-label="Select risk type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Falls">Falls Risk</SelectItem>
                  <SelectItem value="Pressure Injury">Pressure Injury Risk</SelectItem>
                  <SelectItem value="CAUTI">CAUTI Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Risk Level */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Patient Risk Level</Label>
              <RadioGroup value={interventionRiskLevel} onValueChange={setInterventionRiskLevel} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="LOW" id="int-low" />
                  <Label htmlFor="int-low" className="text-sm cursor-pointer flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500" /> LOW
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="MODERATE" id="int-moderate" />
                  <Label htmlFor="int-moderate" className="text-sm cursor-pointer flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" /> MODERATE
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="HIGH" id="int-high" />
                  <Label htmlFor="int-high" className="text-sm cursor-pointer flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> HIGH
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Optional Constraints */}
            <div>
              <Label className="text-sm font-medium mb-2 block text-muted-foreground">Patient Constraints (optional):</Label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'limitedMobility', label: 'Limited mobility' },
                  { id: 'cognitive', label: 'Cognitive impairment' },
                  { id: 'language', label: 'Language barrier' },
                  { id: 'sensory', label: 'Sensory limitations' }
                ].map(c => (
                  <div key={c.id} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`constraint-${c.id}`}
                      checked={interventionConstraints[c.id]}
                      onCheckedChange={(checked) => setInterventionConstraints(prev => ({ ...prev, [c.id]: !!checked }))}
                    />
                    <Label htmlFor={`constraint-${c.id}`} className="text-xs cursor-pointer">{c.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleInterventionSuggestions} disabled={interventionLoading} className="w-full gap-2">
              {interventionLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Retrieving best practices...</>
              ) : (
                <><Lightbulb className="h-4 w-4" />Get Evidence-Based Interventions</>
              )}
            </Button>

            {interventionLoading && <LoadingIndicator model="flash" estimatedTime={1.6} message="Retrieving best practices..." />}

            {interventionResult && !interventionLoading && (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/50 dark:to-amber-950/50 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-sm">{interventionResult.header}</span>
                </div>

                {interventionResult.categories.map((cat, catIdx) => (
                  <motion.div 
                    key={catIdx}
                    variants={staggerItemVariants}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className={cn(
                      "px-3 py-2 flex items-center justify-between",
                      cat.priority === 'IMMEDIATE' ? 'bg-red-100 dark:bg-red-950/50' :
                      cat.priority === 'URGENT' ? 'bg-orange-100 dark:bg-orange-950/50' :
                      'bg-blue-100 dark:bg-blue-950/50'
                    )}>
                      <span className="font-semibold text-sm">{cat.name}</span>
                      <Badge variant="outline" className={cn(
                        "text-[10px]",
                        cat.priority === 'IMMEDIATE' ? 'border-red-500 text-red-600' :
                        cat.priority === 'URGENT' ? 'border-orange-500 text-orange-600' :
                        'border-blue-500 text-blue-600'
                      )}>
                        {cat.priority}
                      </Badge>
                    </div>
                    <div className="p-3 space-y-2">
                      {cat.interventions.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm p-2 bg-muted/30 rounded">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium">{item.action}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              <span className="font-medium">Evidence:</span> {item.evidenceLevel}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Rationale:</span> {item.rationale}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-[10px] shrink-0">{item.timeline}</Badge>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm">
                    📊 <span className="font-semibold">Projected Risk Reduction:</span>{' '}
                    <span className="text-green-600 font-bold">{interventionResult.projectedReduction}%</span> with full implementation
                  </p>
                </div>

                <ResultActions processingTime={1.6} />
              </motion.div>
            )}
          </div>
        </ModuleCard>

        {/* MODULE 4: Health Equity Analysis */}
        <ModuleCard
          id="health-equity"
          title="Health Equity Analysis"
          description="Detect demographic disparities in care"
          icon={Scale}
          model="pro"
          color="from-green-500 to-emerald-500"
          isExpanded={expandedModules.has('health-equity')}
          isActive={activeModules.has('health-equity')}
          onToggle={() => toggleModule('health-equity')}
        >
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Date Range</Label>
              <Select value={equityDateRange} onValueChange={setEquityDateRange}>
                <SelectTrigger aria-label="Select date range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleEquityAnalysis} disabled={equityLoading} className="w-full gap-2">
              {equityLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Analyzing equity patterns...</>
              ) : (
                <><Scale className="h-4 w-4" />Analyze Demographics & Outcomes</>
              )}
            </Button>

            {equityLoading && <LoadingIndicator model="pro" estimatedTime={2.8} message="Analyzing equity patterns with Gemini 3 Pro..." />}

            {equityResult && !equityLoading && (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-sm">
                      Health Equity Assessment - Unit {equityResult.unit}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">N={equityResult.census} patients</Badge>
                </div>

                {/* Heatmap */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border rounded-lg overflow-hidden">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2 font-medium">Outcome Type</th>
                        <th className="text-center p-2 font-medium">Age &gt;75</th>
                        <th className="text-center p-2 font-medium">Medicaid</th>
                        <th className="text-center p-2 font-medium">Non-English</th>
                        <th className="text-center p-2 font-medium">Gender Diff</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equityResult.heatmapData.map((row, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2 font-medium">{row.outcome}</td>
                          <td className="text-center p-2"><HeatmapCell value={row.ageOver75} /></td>
                          <td className="text-center p-2"><HeatmapCell value={row.medicaid} /></td>
                          <td className="text-center p-2"><HeatmapCell value={row.nonEnglish} /></td>
                          <td className="text-center p-2"><HeatmapCell value={row.genderDiff} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[10px] text-muted-foreground mt-1 text-center">
                    Legend: 🟢 &lt;1.3x | 🟡 1.3-1.8x | 🔴 &gt;1.8x (compared to baseline)
                  </p>
                </div>

                {/* Findings */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Significant Disparities Detected:
                  </p>
                  {equityResult.findings.map((finding, i) => (
                    <motion.div
                      key={i}
                      variants={staggerItemVariants}
                      className="p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-sm">{finding.title}</span>
                        <Badge variant="outline" className="text-[10px]">{finding.significance}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">Rate:</span> {finding.rate}
                      </p>
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          View Root Cause Analysis
                        </summary>
                        <ul className="mt-2 space-y-1 pl-4">
                          {finding.rootCauses.map((cause, j) => (
                            <li key={j} className="text-muted-foreground">• {cause}</li>
                          ))}
                        </ul>
                      </details>
                    </motion.div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="font-semibold text-xs text-red-700 dark:text-red-400 mb-2">Immediate Actions (0-7 days):</p>
                    <ul className="text-xs space-y-1">
                      {equityResult.recommendations.immediate.map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-500">→</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-semibold text-xs text-blue-700 dark:text-blue-400 mb-2">System Changes (30-90 days):</p>
                    <ul className="text-xs space-y-1">
                      {equityResult.recommendations.systemChanges.map((rec, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-500">→</span> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800 text-sm">
                  📈 <span className="font-semibold">Expected Impact:</span> Full implementation projected to reduce disparities by{' '}
                  <span className="font-bold text-green-600">{equityResult.projectedImpact}%</span> within 6 months.
                </div>

                <ResultActions processingTime={2.8} model="pro" />
              </motion.div>
            )}
          </div>
        </ModuleCard>

        {/* MODULE 5: Pressure Injury Assessment */}
        <ModuleCard
          id="pressure-injury"
          title="Pressure Injury Assessment"
          description="Multimodal wound analysis with images"
          icon={Activity}
          model="flash"
          color="from-red-500 to-rose-500"
          isExpanded={expandedModules.has('pressure-injury')}
          isActive={activeModules.has('pressure-injury')}
          onToggle={() => toggleModule('pressure-injury')}
        >
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground font-medium">Drop wound image here or click to upload</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Accepts .jpg, .jpeg, .png</p>
            </div>

            {/* Sample Buttons */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handlePressureAnalysis(1)} className="flex-1">
                <ImageIcon className="h-3 w-3 mr-1" />
                Load Sample Wound 1 (Stage II sacral)
              </Button>
              <Button size="sm" variant="outline" onClick={() => handlePressureAnalysis(2)} className="flex-1">
                <ImageIcon className="h-3 w-3 mr-1" />
                Load Sample Wound 2 (Stage III heel)
              </Button>
            </div>

            {/* Clinical Notes */}
            <Textarea
              placeholder="Optional: Add clinical context..."
              value={pressureNotes}
              onChange={(e) => setPressureNotes(e.target.value)}
              className="min-h-[60px] resize-none text-sm"
              aria-label="Clinical notes for wound assessment"
            />

            <Button onClick={() => handlePressureAnalysis(pressureSampleId)} disabled={pressureLoading} className="w-full gap-2">
              {pressureLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Analyzing image and notes...</>
              ) : (
                <><Activity className="h-4 w-4" />Analyze Wound with Gemini 3</>
              )}
            </Button>

            {pressureLoading && <LoadingIndicator model="flash" estimatedTime={1.8} message="🔄 Analyzing image and notes..." />}

            {pressureResult && !pressureLoading && (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* Stage Classification */}
                <motion.div 
                  variants={staggerItemVariants}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                    <div>
                      <p className="text-lg font-bold">Stage: {pressureResult.stage}</p>
                      <p className="text-sm text-muted-foreground">Confidence: {(pressureResult.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "text-sm px-3 py-1",
                    pressureResult.stageColor === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                  )}>
                    Stage {pressureSampleId === 1 ? 'II' : 'III'}
                  </Badge>
                </motion.div>

                {/* Assessment Details */}
                <motion.div 
                  variants={staggerItemVariants}
                  className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Assessment Details:
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Size:</strong> {pressureResult.assessment.size}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Location:</strong> {pressureResult.assessment.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bandage className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Wound Bed:</strong> {pressureResult.assessment.woundBed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Healing:</strong> {pressureResult.assessment.healing}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div 
                  variants={staggerItemVariants}
                  className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <p className="font-semibold text-sm mb-2 text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Recommendations:
                  </p>
                  <ul className="space-y-2">
                    {pressureResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: "Copy Report", description: "Demo mode only" })}>
                    <Copy className="h-3 w-3 mr-1" /> Copy Report
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 opacity-50" disabled>
                          <Eye className="h-3 w-3 mr-1" /> Compare to Previous
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>No previous assessment available</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <ResultActions processingTime={1.8} />
              </motion.div>
            )}
          </div>
        </ModuleCard>

        {/* MODULE 6: Smart Alert Generation */}
        <ModuleCard
          id="smart-alert"
          title="Smart Alert Generation"
          description="Actionable nursing cues and alerts"
          icon={Bell}
          model="flash"
          color="from-yellow-500 to-orange-500"
          isExpanded={expandedModules.has('smart-alert')}
          isActive={activeModules.has('smart-alert')}
          onToggle={() => toggleModule('smart-alert')}
        >
          <div className="space-y-4">
            {/* Scenario Selector */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Patient Scenario</Label>
              <Select
                value={alertScenario.id}
                onValueChange={(id) => setAlertScenario(ALERT_SCENARIOS.find(s => s.id === id) || ALERT_SCENARIOS[0])}
              >
                <SelectTrigger aria-label="Select patient scenario">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALERT_SCENARIOS.map(scenario => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Scenario Preview */}
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="text-xs text-muted-foreground uppercase mb-1 font-medium">Selected Scenario:</p>
              <p><span className="font-medium">Patient:</span> {alertScenario.patientId} | Room {alertScenario.room}</p>
              <p><span className="font-medium">Trigger:</span> {alertScenario.trigger}</p>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <span className="text-sm flex items-center gap-2">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                Alert Sound
              </span>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            <Button onClick={handleAlertGeneration} disabled={alertLoading} className="w-full gap-2">
              {alertLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Crafting actionable alert...</>
              ) : (
                <><Bell className="h-4 w-4" />Generate Smart Alert</>
              )}
            </Button>

            {alertLoading && <LoadingIndicator model="flash" estimatedTime={0.9} message="Crafting actionable alert..." />}

            {alertResult && !alertLoading && (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Alert Card */}
                <motion.div 
                  className={cn(
                    "rounded-lg border-2 overflow-hidden",
                    alertResult.priority === 'CRITICAL' ? 'border-red-500 shadow-lg shadow-red-500/20' :
                    alertResult.priority === 'IMMEDIATE' ? 'border-red-400' : 'border-orange-400'
                  )}
                  animate={alertResult.priority === 'CRITICAL' || alertResult.priority === 'IMMEDIATE' ? {
                    boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0)', '0 0 0 8px rgba(239, 68, 68, 0.1)', '0 0 0 0 rgba(239, 68, 68, 0)']
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Header */}
                  <div className={cn(
                    "p-3 flex items-center justify-between",
                    alertResult.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                    alertResult.priority === 'IMMEDIATE' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                  )}>
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 animate-pulse" />
                      <span className="font-bold">🔔 PRIORITY ALERT - {alertResult.priority} ACTION</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">
                      🔴 {alertResult.priority}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Patient</p>
                        <p className="font-semibold">{alertResult.patient}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-medium">Timestamp</p>
                        <p className="font-semibold">{alertResult.timestamp}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-medium">Risk Transition</p>
                      <p className="font-bold text-lg text-red-600">{alertResult.headline}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Clinical Context</p>
                      <p className="text-sm">{alertResult.clinicalContext}</p>
                    </div>

                    {/* Required Actions */}
                    <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <p className="font-bold text-sm mb-2 text-red-700 dark:text-red-400">REQUIRED ACTIONS:</p>
                      <div className="space-y-2">
                        {alertResult.actions.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Checkbox id={`action-${i}`} />
                            <Label htmlFor={`action-${i}`} className="text-sm cursor-pointer flex-1">
                              {i + 1}. {item.action}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="font-medium mb-1">Rationale:</p>
                      <p className="text-muted-foreground">{alertResult.rationale}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span><strong>Reassess At:</strong> {alertResult.reassessAt}</span>
                      <span className="text-xs text-muted-foreground">Alert ID: {alertResult.alertId}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-3 bg-muted/50 flex flex-wrap gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => toast({ title: "Acknowledge Alert", description: "Demo mode only" })}>
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Acknowledge
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-500 text-orange-600" onClick={() => toast({ title: "Escalate", description: "Demo mode only" })}>
                      <AlertCircle className="h-3 w-3 mr-1" /> Escalate to Charge Nurse
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toast({ title: "Print Alert", description: "Demo mode only" })}>
                      <Printer className="h-3 w-3 mr-1" /> Print
                    </Button>
                  </div>
                </motion.div>

                <ResultActions processingTime={0.9} />
              </motion.div>
            )}
          </div>
        </ModuleCard>

        {/* MODULE 7: Unit Trend Analysis */}
        <ModuleCard
          id="unit-trends"
          title="Unit Trend Analysis"
          description="24-hour aggregate pattern detection"
          icon={BarChart3}
          model="pro"
          color="from-indigo-500 to-violet-500"
          isExpanded={expandedModules.has('unit-trends')}
          isActive={activeModules.has('unit-trends')}
          onToggle={() => toggleModule('unit-trends')}
        >
          <div className="space-y-4">
            {/* Time Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Time Range</Label>
              <RadioGroup value={trendTimeRange} onValueChange={setTrendTimeRange} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="8h" id="trend-8h" />
                  <Label htmlFor="trend-8h" className="text-sm cursor-pointer">Last 8 hours</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="24h" id="trend-24h" />
                  <Label htmlFor="trend-24h" className="text-sm cursor-pointer">Last 24 hours</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="7d" id="trend-7d" />
                  <Label htmlFor="trend-7d" className="text-sm cursor-pointer">Last 7 days</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Risk Types */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Risk Types to Analyze</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="trend-falls"
                    checked={trendRiskTypes.falls}
                    onCheckedChange={(checked) => setTrendRiskTypes(prev => ({ ...prev, falls: !!checked }))}
                  />
                  <Label htmlFor="trend-falls" className="text-sm cursor-pointer flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-blue-500" /> Falls Risk
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="trend-pressure"
                    checked={trendRiskTypes.pressure}
                    onCheckedChange={(checked) => setTrendRiskTypes(prev => ({ ...prev, pressure: !!checked }))}
                  />
                  <Label htmlFor="trend-pressure" className="text-sm cursor-pointer flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-orange-500" /> Pressure Injury
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="trend-cauti"
                    checked={trendRiskTypes.cauti}
                    onCheckedChange={(checked) => setTrendRiskTypes(prev => ({ ...prev, cauti: !!checked }))}
                  />
                  <Label htmlFor="trend-cauti" className="text-sm cursor-pointer flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-red-500" /> CAUTI Risk
                  </Label>
                </div>
              </div>
            </div>

            <Button onClick={handleTrendAnalysis} disabled={trendLoading} className="w-full gap-2">
              {trendLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Processing with Gemini 3 Pro...</>
              ) : (
                <><BarChart3 className="h-4 w-4" />Analyze Unit Trends</>
              )}
            </Button>

            {trendLoading && <LoadingIndicator model="pro" estimatedTime={2.3} message="Processing 24h data with Gemini 3 Pro..." />}

            {trendResult && !trendLoading && (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-950/50 dark:to-violet-950/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold text-sm">
                      {trendResult.timeRange === '24h' ? '24-Hour' : trendResult.timeRange === '8h' ? '8-Hour' : '7-Day'} Pattern Analysis - Unit {trendResult.unit}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">Census: {trendResult.census}</Badge>
                </div>

                {/* Simple Chart */}
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-3 font-medium">Risk Levels Over Time</p>
                  <div className="h-32 flex items-end gap-1">
                    {trendResult.trendData.map((point, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="flex flex-col gap-0.5 w-full">
                          {trendRiskTypes.falls && (
                            <div
                              className="w-full bg-blue-500 rounded-t transition-all"
                              style={{ height: `${point.falls * 80}px` }}
                              title={`Falls: ${(point.falls * 10).toFixed(1)}`}
                            />
                          )}
                          {trendRiskTypes.pressure && (
                            <div
                              className="w-full bg-orange-500 rounded-t transition-all"
                              style={{ height: `${point.pressure * 60}px` }}
                              title={`Pressure: ${(point.pressure * 10).toFixed(1)}`}
                            />
                          )}
                          {trendRiskTypes.cauti && (
                            <div
                              className="w-full bg-red-500 rounded-t transition-all"
                              style={{ height: `${point.cauti * 50}px` }}
                              title={`CAUTI: ${(point.cauti * 10).toFixed(1)}`}
                            />
                          )}
                        </div>
                        <span className="text-[8px] text-muted-foreground">{point.hour.slice(0, 2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                    {trendRiskTypes.falls && <span className="text-xs flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded" /> Falls</span>}
                    {trendRiskTypes.pressure && <span className="text-xs flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded" /> Pressure</span>}
                    {trendRiskTypes.cauti && <span className="text-xs flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded" /> CAUTI</span>}
                  </div>
                </div>

                {/* Peak Periods */}
                <motion.div variants={staggerItemVariants} className="space-y-2">
                  <p className="font-semibold text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    Peak Risk Periods Detected:
                  </p>
                  {trendResult.peakPeriods.map((peak, i) => (
                    <div key={i} className="p-2 bg-muted/30 rounded text-sm">
                      <span className="font-medium">{peak.riskType}:</span> {peak.period} <span className="text-muted-foreground">({peak.context})</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{peak.factors}</p>
                    </div>
                  ))}
                </motion.div>

                {/* Patterns */}
                <motion.div variants={staggerItemVariants} className="space-y-2">
                  <p className="font-semibold text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-indigo-500" />
                    Patterns & Correlations:
                  </p>
                  <ul className="space-y-1">
                    {trendResult.patterns.map((p, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-indigo-500">•</span>
                        <span>{p.pattern}</span>
                        {p.correlation && <Badge variant="outline" className="text-[10px]">{p.correlation}</Badge>}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Recommendations */}
                <motion.div variants={staggerItemVariants} className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <p className="font-semibold text-sm mb-2 text-indigo-700 dark:text-indigo-400">🎯 Gemini 3 Pro Recommendations:</p>
                  <div className="grid md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="font-medium mb-1">Immediate Actions:</p>
                      <ul className="space-y-0.5">
                        {trendResult.recommendations.immediate.map((rec, i) => (
                          <li key={i}>→ {rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">System Changes:</p>
                      <ul className="space-y-0.5">
                        {trendResult.recommendations.systemChanges.map((rec, i) => (
                          <li key={i}>→ {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800 text-sm">
                  📈 <span className="font-semibold">Predicted Impact:</span> If implemented, projected{' '}
                  <span className="font-bold text-green-600">{trendResult.projectedImpact}% reduction</span> in adverse events over next 30 days.
                </div>

                <ResultActions processingTime={2.3} model="pro" />
              </motion.div>
            )}
          </div>
        </ModuleCard>

        {/* MODULE 8: Multi-Risk Assessment */}
        <ModuleCard
          id="multi-risk"
          title="Multi-Risk Assessment"
          description="Falls, Pressure Injury, CAUTI risk scoring"
          icon={Shield}
          model="flash"
          color="from-teal-500 to-cyan-500"
          isExpanded={expandedModules.has('multi-risk')}
          isActive={activeModules.has('multi-risk')}
          onToggle={() => toggleModule('multi-risk')}
        >
          <div className="space-y-4">
            {/* Quick Load Scenarios */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Quick Load Scenarios:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={multiRiskPatient.name === 'High Risk Elderly' ? 'default' : 'outline'}
                  onClick={() => loadPatientScenario(PATIENT_SCENARIOS.elderly)}
                >
                  Load Scenario 1: High-Risk Elderly
                </Button>
                <Button
                  size="sm"
                  variant={multiRiskPatient.name === 'Post-Surgical' ? 'default' : 'outline'}
                  onClick={() => loadPatientScenario(PATIENT_SCENARIOS.postSurgical)}
                >
                  Load Scenario 2: Post-Surgical
                </Button>
                <Button
                  size="sm"
                  variant={multiRiskPatient.name === 'Long-Term Care' ? 'default' : 'outline'}
                  onClick={() => loadPatientScenario(PATIENT_SCENARIOS.longTerm)}
                >
                  Load Scenario 3: Long-Term Care
                </Button>
              </div>
            </div>

            {/* Patient Data Form - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1 block">Age</Label>
                <Input
                  type="number"
                  value={multiRiskAge}
                  onChange={(e) => setMultiRiskAge(Number(e.target.value))}
                  className="h-9"
                  placeholder="82"
                  aria-label="Patient age"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Gender</Label>
                <Select value={multiRiskGender} onValueChange={setMultiRiskGender}>
                  <SelectTrigger className="h-9" aria-label="Gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Mobility Status</Label>
                <Select value={multiRiskMobility} onValueChange={setMultiRiskMobility}>
                  <SelectTrigger className="h-9" aria-label="Mobility status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Independent">Independent</SelectItem>
                    <SelectItem value="Walker">Walker</SelectItem>
                    <SelectItem value="Wheelchair">Wheelchair</SelectItem>
                    <SelectItem value="Bedbound">Bedbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Braden Score</Label>
                <Input
                  type="number"
                  value={multiRiskBraden}
                  onChange={(e) => setMultiRiskBraden(Number(e.target.value))}
                  className="h-9"
                  min={6}
                  max={23}
                  placeholder="14"
                  aria-label="Braden score"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Catheter Days</Label>
                <Input
                  type="number"
                  value={multiRiskCatheter}
                  onChange={(e) => setMultiRiskCatheter(Number(e.target.value))}
                  className="h-9"
                  min={0}
                  placeholder="0"
                  aria-label="Catheter days"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Recent Medications</Label>
                <Input
                  value={multiRiskMeds}
                  onChange={(e) => setMultiRiskMeds(e.target.value)}
                  placeholder="Lorazepam 2mg"
                  className="h-9"
                  aria-label="Recent medications"
                />
              </div>
            </div>

            <Button onClick={handleMultiRiskAssessment} disabled={multiRiskLoading} className="w-full gap-2">
              {multiRiskLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Analyzing multiple risk factors...</>
              ) : (
                <><Shield className="h-4 w-4" />Calculate All Risks with Gemini 3</>
              )}
            </Button>

            {multiRiskLoading && <LoadingIndicator model="flash" estimatedTime={1.5} message="Analyzing multiple risk factors..." />}

            {multiRiskResult && !multiRiskLoading && (
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* 3 Risk Cards Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Falls Risk */}
                  <motion.div
                    variants={staggerItemVariants}
                    className={cn(
                      "p-4 rounded-lg border-2 text-center",
                      multiRiskResult.assessments.falls.level === 'HIGH' && "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700",
                      multiRiskResult.assessments.falls.level === 'MODERATE' && "bg-orange-50 border-orange-300 dark:bg-orange-950/30 dark:border-orange-700",
                      multiRiskResult.assessments.falls.level === 'LOW' && "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700"
                    )}
                  >
                    <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Falls Risk</p>
                    <Badge className={cn(
                      "text-lg px-4 py-1 mb-2",
                      multiRiskResult.assessments.falls.level === 'HIGH' ? 'bg-red-500' :
                      multiRiskResult.assessments.falls.level === 'MODERATE' ? 'bg-orange-500' : 'bg-green-500'
                    )}>
                      {multiRiskResult.assessments.falls.level}
                    </Badge>
                    <p className="text-sm mb-2">Score: {multiRiskResult.assessments.falls.score}/10</p>
                    <Progress value={multiRiskResult.assessments.falls.score * 10} className="h-2 mb-3" />
                    
                    <div className="text-left text-xs space-y-2">
                      <div>
                        <p className="font-semibold mb-1">Key Factors:</p>
                        {multiRiskResult.assessments.falls.factors.map((f, i) => (
                          <p key={i} className="text-muted-foreground">• {f}</p>
                        ))}
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-green-600">Interventions:</p>
                        {multiRiskResult.assessments.falls.interventions.map((int, i) => (
                          <p key={i} className="text-green-700 dark:text-green-400">→ {int}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Pressure Injury */}
                  <motion.div
                    variants={staggerItemVariants}
                    className={cn(
                      "p-4 rounded-lg border-2 text-center",
                      multiRiskResult.assessments.pressure.level === 'HIGH' && "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700",
                      multiRiskResult.assessments.pressure.level === 'MODERATE' && "bg-orange-50 border-orange-300 dark:bg-orange-950/30 dark:border-orange-700",
                      multiRiskResult.assessments.pressure.level === 'LOW' && "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700"
                    )}
                  >
                    <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Pressure Injury</p>
                    <Badge className={cn(
                      "text-lg px-4 py-1 mb-2",
                      multiRiskResult.assessments.pressure.level === 'HIGH' ? 'bg-red-500' :
                      multiRiskResult.assessments.pressure.level === 'MODERATE' ? 'bg-orange-500' : 'bg-green-500'
                    )}>
                      {multiRiskResult.assessments.pressure.level}
                    </Badge>
                    <p className="text-sm mb-2">Score: {multiRiskResult.assessments.pressure.score}/10</p>
                    <Progress value={multiRiskResult.assessments.pressure.score * 10} className="h-2 mb-3" />
                    
                    <div className="text-left text-xs space-y-2">
                      <div>
                        <p className="font-semibold mb-1">Key Factors:</p>
                        {multiRiskResult.assessments.pressure.factors.map((f, i) => (
                          <p key={i} className="text-muted-foreground">• {f}</p>
                        ))}
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-green-600">Interventions:</p>
                        {multiRiskResult.assessments.pressure.interventions.map((int, i) => (
                          <p key={i} className="text-green-700 dark:text-green-400">→ {int}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* CAUTI Risk */}
                  <motion.div
                    variants={staggerItemVariants}
                    className={cn(
                      "p-4 rounded-lg border-2 text-center",
                      multiRiskResult.assessments.cauti.level === 'HIGH' && "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700",
                      multiRiskResult.assessments.cauti.level === 'MODERATE' && "bg-orange-50 border-orange-300 dark:bg-orange-950/30 dark:border-orange-700",
                      multiRiskResult.assessments.cauti.level === 'LOW' && "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700"
                    )}
                  >
                    <p className="text-xs uppercase font-bold text-muted-foreground mb-1">CAUTI Risk</p>
                    <Badge className={cn(
                      "text-lg px-4 py-1 mb-2",
                      multiRiskResult.assessments.cauti.level === 'HIGH' ? 'bg-red-500' :
                      multiRiskResult.assessments.cauti.level === 'MODERATE' ? 'bg-orange-500' : 'bg-green-500'
                    )}>
                      {multiRiskResult.assessments.cauti.level}
                    </Badge>
                    <p className="text-sm mb-2">Score: {multiRiskResult.assessments.cauti.score}/10</p>
                    <Progress value={multiRiskResult.assessments.cauti.score * 10} className="h-2 mb-3" />
                    
                    <div className="text-left text-xs space-y-2">
                      <div>
                        <p className="font-semibold mb-1">Key Factors:</p>
                        {multiRiskResult.assessments.cauti.factors.map((f, i) => (
                          <p key={i} className="text-muted-foreground">• {f}</p>
                        ))}
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-green-600">Interventions:</p>
                        {multiRiskResult.assessments.cauti.interventions.map((int, i) => (
                          <p key={i} className="text-green-700 dark:text-green-400">→ {int}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Summary Footer */}
                <div className="p-3 bg-muted/50 rounded-lg border flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">Overall Priority:</span>{' '}
                    <span className={cn(
                      "font-bold",
                      multiRiskResult.overallPriority.includes('HIGH') ? 'text-red-600' : 'text-orange-600'
                    )}>
                      {multiRiskResult.overallPriority}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Download Risk Report", description: "Demo mode only" })}>
                      <Download className="h-3 w-3 mr-1" /> Download
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Add to Care Plan", description: "Demo mode only" })}>
                      <FileText className="h-3 w-3 mr-1" /> Care Plan
                    </Button>
                  </div>
                </div>

                <ResultActions processingTime={1.5} />
              </motion.div>
            )}
          </div>
        </ModuleCard>
      </div>

      {/* Performance Summary Card */}
      {performanceMetrics.times.length > 0 && (
        <Card className="bg-secondary/50 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Average response time</p>
                <p className="text-lg font-bold">{averageTime}s</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fastest</p>
                <p className="text-lg font-bold text-green-600">{fastestTime}s</p>
                <p className="text-[10px] text-muted-foreground">(Smart Alert Generation)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Slowest</p>
                <p className="text-lg font-bold text-orange-600">{slowestTime}s</p>
                <p className="text-[10px] text-muted-foreground">(Health Equity - Complex reasoning)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total analyses run</p>
                <p className="text-lg font-bold">{analysisCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted-foreground italic p-4 bg-muted/30 rounded-lg">
        ⚠️ AI-generated analysis for decision support only. All findings require clinical verification.
        <br />
        Powered by Google Gemini 3 Flash + Pro · For research and demonstration purposes.
      </div>
    </div>
  );
};

export default EnhancedAIToolsPanel;
