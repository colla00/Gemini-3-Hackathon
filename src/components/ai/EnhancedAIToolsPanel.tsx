import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  Play,
  ChevronDown,
  ChevronUp,
  Cpu,
  Upload,
  Copy,
  Download,
  Share2,
  FileText,
  Bell,
  BarChart3,
  Shield,
  Users,
  Calendar,
  Image as ImageIcon
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
  { id: '1', label: 'High Fall Risk - Night Shift', patientId: '847261', room: '19', riskType: 'Falls', trigger: 'Sedative administered' },
  { id: '2', label: 'CAUTI Alert - Extended Catheter', patientId: '892134', room: '12', riskType: 'CAUTI', trigger: 'Catheter day 6' },
  { id: '3', label: 'Pressure Injury Risk', patientId: '783421', room: '8', riskType: 'Pressure Injury', trigger: 'Braden score declined' },
  { id: '4', label: 'Post-Op Fall Risk', patientId: '654123', room: '22', riskType: 'Falls', trigger: 'First ambulation post-surgery' },
  { id: '5', label: 'Multi-Risk Patient', patientId: '912345', room: '15', riskType: 'Multiple', trigger: 'ICU transfer' }
];

// ============================================================================
// MOCK RESULT GENERATORS (for demo mode or simulated API)
// ============================================================================

const generateClinicalNotesResult = (notes: string) => ({
  warningSigns: [
    { sign: 'Nocturnal confusion/delirium', severity: 'high' },
    { sign: 'Unsafe mobility attempt', severity: 'high' },
    { sign: 'Sedative administration', severity: 'medium' },
    { sign: 'Fall risk indicators', severity: 'high' }
  ],
  recommendedActions: [
    'Activate bed alarm',
    'Increase safety rounds to q1h',
    'Reassess fall risk score',
    'Consider bedside sitter'
  ],
  riskLevel: 'HIGH',
  confidence: 0.94
});

const generateRiskNarrativeResult = (shapValue: number, context: string) => ({
  narrative: `High fall risk due to recent sedation (Lorazepam 2mg) combined with mobility limitations and advanced age (82 years). The sedative effect reduces balance awareness while existing mobility challenges increase fall likelihood. The SHAP value of ${shapValue.toFixed(2)} indicates this patient is in the top 15% for fall risk on the unit.`,
  shapValue,
  context,
  confidence: 0.91
});

const generateInterventionsResult = (riskType: string, riskLevel: string) => ({
  riskType,
  riskLevel,
  interventions: {
    environmental: [
      { action: 'Bed alarm activation', recommendation: 'Class I' },
      { action: 'Remove clutter from pathways', recommendation: 'Immediate' },
      { action: 'Ensure adequate lighting', recommendation: 'Immediate' }
    ],
    clinical: [
      { action: 'Reassess medications causing sedation', recommendation: 'High priority' },
      { action: 'Physical therapy consultation', recommendation: 'Within 24h' },
      { action: 'Consider hip protectors', recommendation: 'For high-risk patients' }
    ],
    monitoring: [
      { action: 'Increase rounding frequency to q1h', recommendation: 'Immediate' },
      { action: 'Document fall risk reassessment', recommendation: 'Each shift' }
    ]
  }
});

const generateEquityResult = (dateRange: string) => ({
  dateRange,
  unit: '4C',
  disparities: [
    { finding: 'Pressure injury rate 2.3x higher in patients >75', significance: 'high', pValue: 0.02 },
    { finding: 'CAUTI rate elevated in Medicaid patients', significance: 'medium', pValue: 0.048 },
    { finding: 'Longer response times during night shift', significance: 'medium', pValue: 0.03 }
  ],
  recommendations: [
    'Review repositioning protocols for elderly patients',
    'Audit catheter necessity assessments',
    'Consider staffing adjustments 2-6 AM'
  ],
  overallScore: 0.72
});

const generatePressureInjuryResult = () => ({
  stage: 'II (Partial Thickness)',
  confidence: 0.94,
  assessment: {
    size: '~3cm x 2cm',
    location: 'Sacral region',
    woundBed: 'Pink/red, moist',
    healing: 'Appropriate progression'
  },
  recommendations: [
    'Continue current treatment plan',
    'Maintain q2h repositioning',
    'Reassess in 48 hours'
  ]
});

const generateSmartAlertResult = (scenario: typeof ALERT_SCENARIOS[0]) => ({
  priority: 'IMMEDIATE',
  priorityColor: 'red',
  headline: `Patient ${scenario.patientId}, Room ${scenario.room}`,
  riskTransition: `${scenario.riskType} Risk: ELEVATED → HIGH`,
  reason: `${scenario.trigger}. Patient ambulates with walker. Recent near-fall (3 days ago).`,
  actions: [
    { action: 'Activate bed alarm NOW', urgency: 'immediate' },
    { action: 'Safety rounds q1h until 18:30', urgency: 'high' },
    { action: 'Reassess risk score before evening shift', urgency: 'routine' }
  ]
});

const generateUnitTrendsResult = (timeRange: string, riskTypes: string[]) => ({
  timeRange,
  unit: '4C',
  peakPeriods: [
    { riskType: 'Falls', period: '2:00 AM - 6:00 AM', context: 'night shift' },
    { riskType: 'Pressure injuries', period: '6:00 PM - 8:00 PM', context: 'shift change' },
    { riskType: 'CAUTI', period: 'Elevated consistently', context: 'catheter duration >5 days' }
  ],
  patterns: [
    'Correlation between staffing ratio and falls risk',
    'Repositioning compliance drops during meal times',
    'Alert response time slower on weekends'
  ],
  trendData: [
    { hour: '00:00', falls: 0.4, pressure: 0.3, cauti: 0.5 },
    { hour: '04:00', falls: 0.7, pressure: 0.3, cauti: 0.5 },
    { hour: '08:00', falls: 0.5, pressure: 0.4, cauti: 0.5 },
    { hour: '12:00', falls: 0.3, pressure: 0.5, cauti: 0.5 },
    { hour: '16:00', falls: 0.4, pressure: 0.6, cauti: 0.5 },
    { hour: '20:00', falls: 0.5, pressure: 0.7, cauti: 0.5 }
  ]
});

const generateMultiRiskResult = (patientData: typeof PATIENT_SCENARIOS.elderly) => ({
  patientSummary: `${patientData.age}yo ${patientData.gender}, ${patientData.mobility}`,
  assessments: {
    falls: {
      score: 8.2,
      level: 'HIGH',
      factors: ['Age 82', 'Recent sedation', 'Walker dependent'],
      interventions: ['Bed alarm', 'q1h rounds']
    },
    pressure: {
      score: 5.4,
      level: 'MODERATE',
      factors: ['Braden: 14', 'Limited mobility'],
      interventions: ['Continue protocol', 'Monitor skin']
    },
    cauti: {
      score: patientData.catheterDays > 0 ? 6.1 : 2.1,
      level: patientData.catheterDays > 0 ? 'MODERATE' : 'LOW',
      factors: patientData.catheterDays > 0 ? [`Catheter: ${patientData.catheterDays} days`] : ['No catheter'],
      interventions: patientData.catheterDays > 0 ? ['Consider removal', 'Reassess need'] : ['No action needed']
    }
  }
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
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
};

const resultVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.1 } }
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
        isExpanded && "ring-2 ring-primary/50",
        isActive && "border-primary/50 shadow-lg shadow-primary/10"
      )}>
        <CardHeader
          className="cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl bg-gradient-to-br", color)}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                  {title}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      model === 'pro' ? "border-purple-500 text-purple-600 dark:text-purple-400" : "border-blue-500 text-blue-600 dark:text-blue-400"
                    )}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Gemini 3 {model === 'pro' ? 'Pro' : 'Flash'}
                  </Badge>
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
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>
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
}

const LoadingIndicator = ({ model, estimatedTime = 1.5 }: LoadingIndicatorProps) => {
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
      {/* Animated background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" 
        style={{ animation: 'shimmer 2s infinite' }}
      />
      
      <div className="relative space-y-4">
        {/* Header with pulsing icon */}
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
                Processing with Gemini 3 {model === 'pro' ? 'Pro' : 'Flash'}
              </span>
              <span className="text-primary font-mono text-sm w-6">{dots}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Analyzing clinical patterns and generating insights
            </p>
          </div>
        </div>

        {/* Progress bar with glow effect */}
        <div className="space-y-2">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
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
// RESULT ACTIONS (Visual only - no actual functionality)
// ============================================================================

interface ResultActionsProps {
  processingTime: number;
}

const ResultActions = ({ processingTime }: ResultActionsProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    toast({ 
      title: "📋 Copy to Clipboard", 
      description: "This feature is for demo purposes only",
    });
  };

  const handleDownload = () => {
    toast({ 
      title: "📥 Download PDF", 
      description: "This feature is for demo purposes only",
    });
  };

  const handleShare = () => {
    toast({ 
      title: "🔗 Share Results", 
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
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.4 }}
        >
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </motion.div>
        <span className="text-xs text-muted-foreground">
          Analyzed in <span className="font-semibold text-foreground">{processingTime.toFixed(1)}s</span>
        </span>
        <Badge variant="outline" className="text-[10px] gap-1 border-primary/30">
          <Sparkles className="h-2.5 w-2.5" />
          Gemini 3
        </Badge>
      </div>
      <div className="flex gap-1">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleCopy} 
          className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
          title="Copy Results"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleDownload} 
          className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
          title="Download PDF"
        >
          <Download className="h-3.5 w-3.5" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleShare} 
          className="h-7 px-2 hover:bg-primary/10 hover:text-primary"
          title="Share"
        >
          <Share2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
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

  // Module states
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [clinicalNotesResult, setClinicalNotesResult] = useState<ReturnType<typeof generateClinicalNotesResult> | null>(null);
  const [clinicalNotesLoading, setClinicalNotesLoading] = useState(false);

  const [shapValue, setShapValue] = useState([0.73]);
  const [patientContext, setPatientContext] = useState('age');
  const [narrativeResult, setNarrativeResult] = useState<ReturnType<typeof generateRiskNarrativeResult> | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  const [interventionRiskType, setInterventionRiskType] = useState('Falls');
  const [interventionRiskLevel, setInterventionRiskLevel] = useState('HIGH');
  const [interventionResult, setInterventionResult] = useState<ReturnType<typeof generateInterventionsResult> | null>(null);
  const [interventionLoading, setInterventionLoading] = useState(false);

  const [equityDateRange, setEquityDateRange] = useState('7d');
  const [equityResult, setEquityResult] = useState<ReturnType<typeof generateEquityResult> | null>(null);
  const [equityLoading, setEquityLoading] = useState(false);

  const [pressureResult, setPressureResult] = useState<ReturnType<typeof generatePressureInjuryResult> | null>(null);
  const [pressureLoading, setPressureLoading] = useState(false);

  const [alertScenario, setAlertScenario] = useState(ALERT_SCENARIOS[0]);
  const [alertResult, setAlertResult] = useState<ReturnType<typeof generateSmartAlertResult> | null>(null);
  const [alertLoading, setAlertLoading] = useState(false);

  const [trendTimeRange, setTrendTimeRange] = useState('24h');
  const [trendRiskTypes, setTrendRiskTypes] = useState({ falls: true, pressure: true, cauti: true });
  const [trendResult, setTrendResult] = useState<ReturnType<typeof generateUnitTrendsResult> | null>(null);
  const [trendLoading, setTrendLoading] = useState(false);

  const [multiRiskPatient, setMultiRiskPatient] = useState(PATIENT_SCENARIOS.elderly);
  const [multiRiskAge, setMultiRiskAge] = useState(82);
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

  const handleClinicalNotesAnalysis = async () => {
    if (!clinicalNotes.trim()) {
      toast({ title: "Notes required", description: "Please enter clinical observations", variant: "destructive" });
      return;
    }
    setClinicalNotesLoading(true);
    const time = await simulateProcessing(1.4, 'clinical-notes');
    setClinicalNotesResult(generateClinicalNotesResult(clinicalNotes));
    setClinicalNotesLoading(false);
  };

  const handleNarrativeGeneration = async () => {
    setNarrativeLoading(true);
    const time = await simulateProcessing(1.1, 'risk-narrative');
    setNarrativeResult(generateRiskNarrativeResult(shapValue[0], patientContext));
    setNarrativeLoading(false);
  };

  const handleInterventionSuggestions = async () => {
    setInterventionLoading(true);
    const time = await simulateProcessing(1.6, 'interventions');
    setInterventionResult(generateInterventionsResult(interventionRiskType, interventionRiskLevel));
    setInterventionLoading(false);
  };

  const handleEquityAnalysis = async () => {
    setEquityLoading(true);
    const time = await simulateProcessing(2.8, 'health-equity');
    setEquityResult(generateEquityResult(equityDateRange));
    setEquityLoading(false);
  };

  const handlePressureAnalysis = async () => {
    setPressureLoading(true);
    const time = await simulateProcessing(1.8, 'pressure-injury');
    setPressureResult(generatePressureInjuryResult());
    setPressureLoading(false);
  };

  const handleAlertGeneration = async () => {
    setAlertLoading(true);
    const time = await simulateProcessing(0.9, 'smart-alert');
    setAlertResult(generateSmartAlertResult(alertScenario));
    setAlertLoading(false);
  };

  const handleTrendAnalysis = async () => {
    setTrendLoading(true);
    const riskTypes = Object.entries(trendRiskTypes).filter(([_, v]) => v).map(([k]) => k);
    const time = await simulateProcessing(2.3, 'unit-trends');
    setTrendResult(generateUnitTrendsResult(trendTimeRange, riskTypes));
    setTrendLoading(false);
  };

  const handleMultiRiskAssessment = async () => {
    setMultiRiskLoading(true);
    const patientData = {
      ...multiRiskPatient,
      age: multiRiskAge,
      mobility: multiRiskMobility,
      meds: multiRiskMeds,
      braden: multiRiskBraden,
      catheterDays: multiRiskCatheter
    };
    const time = await simulateProcessing(1.5, 'multi-risk');
    setMultiRiskResult(generateMultiRiskResult(patientData));
    setMultiRiskLoading(false);
  };

  const loadPatientScenario = (scenario: typeof PATIENT_SCENARIOS.elderly) => {
    setMultiRiskPatient(scenario);
    setMultiRiskAge(scenario.age);
    setMultiRiskMobility(scenario.mobility);
    setMultiRiskMeds(scenario.meds);
    setMultiRiskBraden(scenario.braden);
    setMultiRiskCatheter(scenario.catheterDays);
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
    <div className="space-y-6 animate-fade-in">
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

            <div className="flex items-center gap-4">
              <motion.div 
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 border transition-all duration-300",
                  demoMode 
                    ? "bg-green-500/20 border-green-400/50 shadow-lg shadow-green-500/20" 
                    : "bg-white/10 border-white/20"
                )}
                animate={demoMode ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Switch
                  id="demo-mode"
                  checked={demoMode}
                  onCheckedChange={setDemoMode}
                  aria-label="Toggle demo mode"
                  className="data-[state=checked]:bg-green-500"
                />
                <Label htmlFor="demo-mode" className="text-sm font-semibold cursor-pointer select-none">
                  Demo Mode
                </Label>
                <AnimatePresence>
                  {demoMode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge className="bg-green-500 text-white text-[10px] font-bold uppercase animate-pulse shadow-lg">
                        DEMO MODE ACTIVE
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
          icon={Stethoscope}
          model="flash"
          color="from-blue-500 to-cyan-500"
          isExpanded={expandedModules.has('clinical-notes')}
          isActive={activeModules.has('clinical-notes')}
          onToggle={() => toggleModule('clinical-notes')}
        >
          <div className="space-y-4">
            {/* Example buttons above textarea */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setClinicalNotes(CLINICAL_NOTE_EXAMPLES.restless)}
                className="text-xs"
              >
                📋 Example 1: Restless Patient
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setClinicalNotes(CLINICAL_NOTE_EXAMPLES.confusion)}
                className="text-xs"
              >
                📋 Example 2: Confusion
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setClinicalNotes(CLINICAL_NOTE_EXAMPLES.pain)}
                className="text-xs"
              >
                📋 Example 3: Pain
              </Button>
            </div>

            {/* Large textarea */}
            <Textarea
              placeholder="Enter nurse observation notes here...

Example: Patient restless overnight. Found attempting to climb out of bed at 0230hrs. Reoriented x3. States need to 'go home to feed cats.' Lorazepam 2mg PO given at 0300hrs per protocol. Patient now resting quietly. Bed alarm activated."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="min-h-[140px] resize-none text-sm"
              aria-label="Clinical notes input"
            />

            {/* Blue analyze button */}
            <Button
              onClick={handleClinicalNotesAnalysis}
              disabled={clinicalNotesLoading || !clinicalNotes.trim()}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base shadow-lg shadow-blue-600/25"
            >
              {clinicalNotesLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing...
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Results Header */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/20">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">AI Analysis Complete</p>
                      <p className="text-xs text-muted-foreground">Gemini 3 Flash</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "text-xs uppercase font-bold",
                    clinicalNotesResult.riskLevel === 'HIGH' ? "bg-destructive" : 
                    clinicalNotesResult.riskLevel === 'MODERATE' ? "bg-orange-500" : "bg-green-500"
                  )}>
                    {clinicalNotesResult.riskLevel} Risk
                  </Badge>
                </motion.div>

                {/* Warning Signs Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-gradient-to-br from-orange-50 to-amber-50/50 dark:from-orange-950/30 dark:to-amber-950/20 rounded-xl border border-orange-200 dark:border-orange-800 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="font-bold text-sm text-orange-800 dark:text-orange-300">Warning Signs Detected:</span>
                  </div>
                  <div className="space-y-2">
                    {clinicalNotesResult.warningSigns.map((sign, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                        className="flex items-center gap-3 p-2 bg-white/60 dark:bg-black/20 rounded-lg"
                      >
                        <span className="text-orange-500 text-lg">•</span>
                        <span className="flex-1 text-sm">{sign.sign}</span>
                        <Badge 
                          variant={sign.severity === 'high' ? 'destructive' : 'secondary'} 
                          className={cn(
                            "text-[10px] font-bold uppercase",
                            sign.severity === 'high' && "bg-red-600 text-white"
                          )}
                        >
                          {sign.severity}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recommended Actions Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="p-4 bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-bold text-sm text-green-800 dark:text-green-300">Recommended Actions:</span>
                  </div>
                  <div className="space-y-2">
                    {clinicalNotesResult.recommendedActions.map((action, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="flex items-center gap-3 p-2 bg-white/60 dark:bg-black/20 rounded-lg"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        <span className="text-sm">{action}</span>
                      </motion.div>
                    ))}
                  </div>
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
            <div>
              <Label className="text-sm font-medium mb-2 block">
                SHAP Value: {shapValue[0].toFixed(2)}
              </Label>
              <Slider
                value={shapValue}
                onValueChange={setShapValue}
                min={0}
                max={1}
                step={0.01}
                className="py-2"
                aria-label="SHAP value slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Low Risk (0.0)</span>
                <span>High Risk (1.0)</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Patient Context</Label>
              <Select value={patientContext} onValueChange={setPatientContext}>
                <SelectTrigger aria-label="Select patient context">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="age">Age (82 years)</SelectItem>
                  <SelectItem value="mobility">Mobility Limitations</SelectItem>
                  <SelectItem value="meds">Recent Medications</SelectItem>
                  <SelectItem value="history">Fall History</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="font-medium mb-1">Before:</p>
              <p className="text-muted-foreground">SHAP value: {shapValue[0].toFixed(2)}</p>
            </div>

            <Button onClick={handleNarrativeGeneration} disabled={narrativeLoading} className="w-full gap-2">
              {narrativeLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Generating...</>
              ) : (
                <><Brain className="h-4 w-4" />Generate Explanation</>
              )}
            </Button>

            {narrativeLoading && <LoadingIndicator model="flash" estimatedTime={1.1} />}

            {narrativeResult && !narrativeLoading && (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold text-sm">After:</span>
                </div>
                <p className="text-sm leading-relaxed">{narrativeResult.narrative}</p>
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
            <div>
              <Label className="text-sm font-medium mb-2 block">Risk Type</Label>
              <Select value={interventionRiskType} onValueChange={setInterventionRiskType}>
                <SelectTrigger aria-label="Select risk type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Falls">Falls</SelectItem>
                  <SelectItem value="Pressure Injury">Pressure Injury</SelectItem>
                  <SelectItem value="CAUTI">CAUTI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Patient Risk Level</Label>
              <RadioGroup value={interventionRiskLevel} onValueChange={setInterventionRiskLevel} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="LOW" id="low" />
                  <Label htmlFor="low" className="text-sm cursor-pointer">LOW</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="MODERATE" id="moderate" />
                  <Label htmlFor="moderate" className="text-sm cursor-pointer">MODERATE</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="HIGH" id="high" />
                  <Label htmlFor="high" className="text-sm cursor-pointer">HIGH</Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={handleInterventionSuggestions} disabled={interventionLoading} className="w-full gap-2">
              {interventionLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Generating...</>
              ) : (
                <><Lightbulb className="h-4 w-4" />Get Evidence-Based Interventions</>
              )}
            </Button>

            {interventionLoading && <LoadingIndicator model="flash" estimatedTime={1.6} />}

            {interventionResult && !interventionLoading && (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border border-orange-200 dark:border-orange-800"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold text-sm">
                    Evidence-Based Interventions for {interventionResult.riskLevel} {interventionResult.riskType} Risk:
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Environmental Modifications</p>
                    <ul className="text-sm space-y-1">
                      {interventionResult.interventions.environmental.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-orange-500">•</span>
                          <span>{item.action}</span>
                          <Badge variant="outline" className="text-[10px] ml-auto">{item.recommendation}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Clinical Interventions</p>
                    <ul className="text-sm space-y-1">
                      {interventionResult.interventions.clinical.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-orange-500">•</span>
                          <span>{item.action}</span>
                          <Badge variant="outline" className="text-[10px] ml-auto">{item.recommendation}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Monitoring</p>
                    <ul className="text-sm space-y-1">
                      {interventionResult.interventions.monitoring.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-orange-500">•</span>
                          <span>{item.action}</span>
                          <Badge variant="outline" className="text-[10px] ml-auto">{item.recommendation}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
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
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleEquityAnalysis} disabled={equityLoading} className="w-full gap-2">
              {equityLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Analyzing...</>
              ) : (
                <><Scale className="h-4 w-4" />Analyze Unit Demographics</>
              )}
            </Button>

            {equityLoading && <LoadingIndicator model="pro" estimatedTime={2.8} />}

            {equityResult && !equityLoading && (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-sm">
                      Equity Analysis - Unit {equityResult.unit} ({equityResult.dateRange === '7d' ? 'Last 7 Days' : equityResult.dateRange === '24h' ? 'Last 24h' : 'Last 30 Days'})
                    </span>
                  </div>
                  <Badge className={cn(
                    "text-xs",
                    equityResult.overallScore >= 0.8 ? "bg-green-500" : equityResult.overallScore >= 0.6 ? "bg-yellow-500" : "bg-red-500"
                  )}>
                    Score: {(equityResult.overallScore * 100).toFixed(0)}%
                  </Badge>
                </div>

                <div>
                  <p className="text-xs font-semibold text-orange-600 uppercase mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Disparities Detected:
                  </p>
                  <ul className="text-sm space-y-2">
                    {equityResult.disparities.map((d, i) => (
                      <li key={i} className="p-2 bg-white/50 dark:bg-black/20 rounded flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        <span>{d.finding}</span>
                        <Badge variant="outline" className="text-[10px] ml-auto shrink-0">p&lt;{d.pValue}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase mb-2 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" /> Recommendations:
                  </p>
                  <ul className="text-sm space-y-1">
                    {equityResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <ResultActions processingTime={2.8} />
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
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">Drop wound image here or click to upload</p>
              <p className="text-xs text-muted-foreground/70 mt-1">(Demo mode: sample images available)</p>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handlePressureAnalysis} className="flex-1">
                <Upload className="h-3 w-3 mr-1" />
                Load Sample Wound 1
              </Button>
              <Button size="sm" variant="outline" onClick={handlePressureAnalysis} className="flex-1">
                <Upload className="h-3 w-3 mr-1" />
                Load Sample Wound 2
              </Button>
            </div>

            <Textarea
              placeholder="Clinical notes (optional)"
              className="min-h-[60px] resize-none"
              aria-label="Clinical notes for wound assessment"
            />

            <Button onClick={handlePressureAnalysis} disabled={pressureLoading} className="w-full gap-2">
              {pressureLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Analyzing...</>
              ) : (
                <><Activity className="h-4 w-4" />Analyze Wound</>
              )}
            </Button>

            {pressureLoading && <LoadingIndicator model="flash" estimatedTime={1.8} />}

            {pressureResult && !pressureLoading && (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3 p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-lg border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-sm">Multimodal Analysis Results:</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Stage: {pressureResult.stage}</p>
                    <p className="text-xs text-muted-foreground">Confidence: {(pressureResult.confidence * 100).toFixed(0)}%</p>
                  </div>
                  <Badge className="ml-auto bg-orange-500">Stage II</Badge>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Assessment:</p>
                  <ul className="text-sm space-y-1">
                    <li><span className="text-muted-foreground">Size:</span> {pressureResult.assessment.size}</li>
                    <li><span className="text-muted-foreground">Location:</span> {pressureResult.assessment.location}</li>
                    <li><span className="text-muted-foreground">Wound bed:</span> {pressureResult.assessment.woundBed}</li>
                    <li><span className="text-muted-foreground">Healing:</span> {pressureResult.assessment.healing}</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase mb-1">Recommendations:</p>
                  <ul className="text-sm space-y-1">
                    {pressureResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
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

            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="text-xs text-muted-foreground uppercase mb-1">Selected Scenario:</p>
              <p><span className="font-medium">Patient:</span> {alertScenario.patientId} | Room {alertScenario.room}</p>
              <p><span className="font-medium">Risk Type:</span> {alertScenario.riskType}</p>
              <p><span className="font-medium">Trigger:</span> {alertScenario.trigger}</p>
            </div>

            <Button onClick={handleAlertGeneration} disabled={alertLoading} className="w-full gap-2">
              {alertLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Generating...</>
              ) : (
                <><Bell className="h-4 w-4" />Generate Smart Alert</>
              )}
            </Button>

            {alertLoading && <LoadingIndicator model="flash" estimatedTime={0.9} />}

            {alertResult && !alertLoading && (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3 p-4 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950/50 dark:to-orange-950/50 rounded-lg border-2 border-red-300 dark:border-red-700"
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-600 animate-pulse" />
                  <Badge className="bg-red-600 text-white uppercase">
                    {alertResult.priority} PRIORITY
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-lg">{alertResult.headline}</p>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                    {alertResult.riskTransition}
                  </p>
                  <p className="text-sm">{alertResult.reason}</p>
                </div>

                <div className="p-3 bg-white/70 dark:bg-black/30 rounded-lg">
                  <p className="text-xs font-semibold text-red-600 uppercase mb-2">ACTION REQUIRED:</p>
                  <ul className="text-sm space-y-1">
                    {alertResult.actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] shrink-0",
                            action.urgency === 'immediate' && "border-red-500 text-red-600",
                            action.urgency === 'high' && "border-orange-500 text-orange-600",
                            action.urgency === 'routine' && "border-blue-500 text-blue-600"
                          )}
                        >
                          {action.urgency}
                        </Badge>
                        <span>{action.action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

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
          icon={TrendingUp}
          model="pro"
          color="from-indigo-500 to-violet-500"
          isExpanded={expandedModules.has('unit-trends')}
          isActive={activeModules.has('unit-trends')}
          onToggle={() => toggleModule('unit-trends')}
        >
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Time Range</Label>
              <RadioGroup value={trendTimeRange} onValueChange={setTrendTimeRange} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="8h" id="8h" />
                  <Label htmlFor="8h" className="text-sm cursor-pointer">Last 8h</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h" className="text-sm cursor-pointer">24h</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="7d" id="7d-trend" />
                  <Label htmlFor="7d-trend" className="text-sm cursor-pointer">7 days</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Risk Types</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trendRiskTypes.falls}
                    onChange={(e) => setTrendRiskTypes(prev => ({ ...prev, falls: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Falls</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trendRiskTypes.pressure}
                    onChange={(e) => setTrendRiskTypes(prev => ({ ...prev, pressure: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Pressure Injury</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trendRiskTypes.cauti}
                    onChange={(e) => setTrendRiskTypes(prev => ({ ...prev, cauti: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">CAUTI</span>
                </label>
              </div>
            </div>

            <Button onClick={handleTrendAnalysis} disabled={trendLoading} className="w-full gap-2">
              {trendLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Analyzing...</>
              ) : (
                <><BarChart3 className="h-4 w-4" />Analyze Trends</>
              )}
            </Button>

            {trendLoading && <LoadingIndicator model="pro" estimatedTime={2.3} />}

            {trendResult && !trendLoading && (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 p-4 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />
                  <span className="font-semibold text-sm">
                    {trendResult.timeRange === '24h' ? '24-Hour' : trendResult.timeRange === '8h' ? '8-Hour' : '7-Day'} Trend Analysis - Unit {trendResult.unit}
                  </span>
                </div>

                {/* Simple trend visualization */}
                <div className="h-24 flex items-end gap-1 p-2 bg-white/50 dark:bg-black/20 rounded">
                  {trendResult.trendData.map((point, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${point.falls * 60}px` }}
                        title={`Falls: ${(point.falls * 100).toFixed(0)}%`}
                      />
                      <span className="text-[8px] text-muted-foreground">{point.hour.slice(0, 2)}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs font-semibold text-red-600 uppercase mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Peak Risk Periods:
                  </p>
                  <ul className="text-sm space-y-1">
                    {trendResult.peakPeriods.map((peak, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-500">•</span>
                        <span><strong>{peak.riskType}:</strong> {peak.period} ({peak.context})</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-indigo-600 uppercase mb-2 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" /> Patterns Detected:
                  </p>
                  <ul className="text-sm space-y-1">
                    {trendResult.patterns.map((pattern, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-500">•</span>
                        <span>{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <ResultActions processingTime={2.3} />
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
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={multiRiskPatient.name === 'High Risk Elderly' ? 'default' : 'outline'}
                onClick={() => loadPatientScenario(PATIENT_SCENARIOS.elderly)}
              >
                High Risk Elderly
              </Button>
              <Button
                size="sm"
                variant={multiRiskPatient.name === 'Post-Surgical' ? 'default' : 'outline'}
                onClick={() => loadPatientScenario(PATIENT_SCENARIOS.postSurgical)}
              >
                Post-Surgical
              </Button>
              <Button
                size="sm"
                variant={multiRiskPatient.name === 'Long-Term Care' ? 'default' : 'outline'}
                onClick={() => loadPatientScenario(PATIENT_SCENARIOS.longTerm)}
              >
                Long-Term Care
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1 block">Age</Label>
                <Input
                  type="number"
                  value={multiRiskAge}
                  onChange={(e) => setMultiRiskAge(Number(e.target.value))}
                  className="h-8"
                  aria-label="Patient age"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Mobility Status</Label>
                <Select value={multiRiskMobility} onValueChange={setMultiRiskMobility}>
                  <SelectTrigger className="h-8" aria-label="Mobility status">
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
                  className="h-8"
                  min={6}
                  max={23}
                  aria-label="Braden score"
                />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Catheter Days</Label>
                <Input
                  type="number"
                  value={multiRiskCatheter}
                  onChange={(e) => setMultiRiskCatheter(Number(e.target.value))}
                  className="h-8"
                  min={0}
                  aria-label="Catheter days"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1 block">Recent Medications</Label>
              <Input
                value={multiRiskMeds}
                onChange={(e) => setMultiRiskMeds(e.target.value)}
                placeholder="e.g., Lorazepam 2mg, Ambien"
                className="h-8"
                aria-label="Recent medications"
              />
            </div>

            <Button onClick={handleMultiRiskAssessment} disabled={multiRiskLoading} className="w-full gap-2">
              {multiRiskLoading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Calculating...</>
              ) : (
                <><Shield className="h-4 w-4" />Calculate All Risks</>
              )}
            </Button>

            {multiRiskLoading && <LoadingIndicator model="flash" estimatedTime={1.5} />}

            {multiRiskResult && !multiRiskLoading && (
              <motion.div
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                <div className="grid grid-cols-3 gap-2">
                  {/* Falls */}
                  <div className={cn(
                    "p-3 rounded-lg border-2 text-center",
                    multiRiskResult.assessments.falls.level === 'HIGH' && "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700",
                    multiRiskResult.assessments.falls.level === 'MODERATE' && "bg-orange-50 border-orange-300 dark:bg-orange-950/30 dark:border-orange-700",
                    multiRiskResult.assessments.falls.level === 'LOW' && "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700"
                  )}>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Falls Risk</p>
                    <p className={cn(
                      "text-lg font-bold",
                      multiRiskResult.assessments.falls.level === 'HIGH' && "text-red-600",
                      multiRiskResult.assessments.falls.level === 'MODERATE' && "text-orange-600",
                      multiRiskResult.assessments.falls.level === 'LOW' && "text-green-600"
                    )}>
                      {multiRiskResult.assessments.falls.level}
                    </p>
                    <p className="text-xs">Score: {multiRiskResult.assessments.falls.score}/10</p>
                    <div className="mt-2 text-[10px] text-left">
                      <p className="font-semibold mb-0.5">Key Factors:</p>
                      {multiRiskResult.assessments.falls.factors.map((f, i) => (
                        <p key={i}>• {f}</p>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] text-left">
                      <p className="font-semibold mb-0.5 text-green-600">Interventions:</p>
                      {multiRiskResult.assessments.falls.interventions.map((int, i) => (
                        <p key={i}>→ {int}</p>
                      ))}
                    </div>
                  </div>

                  {/* Pressure Injury */}
                  <div className={cn(
                    "p-3 rounded-lg border-2 text-center",
                    multiRiskResult.assessments.pressure.level === 'HIGH' && "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700",
                    multiRiskResult.assessments.pressure.level === 'MODERATE' && "bg-orange-50 border-orange-300 dark:bg-orange-950/30 dark:border-orange-700",
                    multiRiskResult.assessments.pressure.level === 'LOW' && "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700"
                  )}>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Pressure Injury</p>
                    <p className={cn(
                      "text-lg font-bold",
                      multiRiskResult.assessments.pressure.level === 'HIGH' && "text-red-600",
                      multiRiskResult.assessments.pressure.level === 'MODERATE' && "text-orange-600",
                      multiRiskResult.assessments.pressure.level === 'LOW' && "text-green-600"
                    )}>
                      {multiRiskResult.assessments.pressure.level}
                    </p>
                    <p className="text-xs">Score: {multiRiskResult.assessments.pressure.score}/10</p>
                    <div className="mt-2 text-[10px] text-left">
                      <p className="font-semibold mb-0.5">Key Factors:</p>
                      {multiRiskResult.assessments.pressure.factors.map((f, i) => (
                        <p key={i}>• {f}</p>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] text-left">
                      <p className="font-semibold mb-0.5 text-green-600">Interventions:</p>
                      {multiRiskResult.assessments.pressure.interventions.map((int, i) => (
                        <p key={i}>→ {int}</p>
                      ))}
                    </div>
                  </div>

                  {/* CAUTI */}
                  <div className={cn(
                    "p-3 rounded-lg border-2 text-center",
                    multiRiskResult.assessments.cauti.level === 'HIGH' && "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700",
                    multiRiskResult.assessments.cauti.level === 'MODERATE' && "bg-orange-50 border-orange-300 dark:bg-orange-950/30 dark:border-orange-700",
                    multiRiskResult.assessments.cauti.level === 'LOW' && "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700"
                  )}>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">CAUTI Risk</p>
                    <p className={cn(
                      "text-lg font-bold",
                      multiRiskResult.assessments.cauti.level === 'HIGH' && "text-red-600",
                      multiRiskResult.assessments.cauti.level === 'MODERATE' && "text-orange-600",
                      multiRiskResult.assessments.cauti.level === 'LOW' && "text-green-600"
                    )}>
                      {multiRiskResult.assessments.cauti.level}
                    </p>
                    <p className="text-xs">Score: {multiRiskResult.assessments.cauti.score}/10</p>
                    <div className="mt-2 text-[10px] text-left">
                      <p className="font-semibold mb-0.5">Key Factors:</p>
                      {multiRiskResult.assessments.cauti.factors.map((f, i) => (
                        <p key={i}>• {f}</p>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] text-left">
                      <p className="font-semibold mb-0.5 text-green-600">Interventions:</p>
                      {multiRiskResult.assessments.cauti.interventions.map((int, i) => (
                        <p key={i}>→ {int}</p>
                      ))}
                    </div>
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
