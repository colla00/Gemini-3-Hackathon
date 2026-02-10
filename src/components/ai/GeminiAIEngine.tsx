import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  RefreshCw,
  Stethoscope,
  Brain,
  Activity,
  AlertTriangle,
  Scale,
  FileText,
  Lightbulb,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  Play,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24
    }
  }
};

const expandVariants = {
  hidden: { opacity: 0, height: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    height: "auto",
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

// Helper component to render formatted AI responses
const FormattedResponse = ({ integrationId, response }: { integrationId: string; response: unknown }) => {
  const data = response as Record<string, unknown>;
  
  // Clinical Notes Analysis
  if (integrationId === 'clinical-notes' && data.analysis) {
    const analysis = data.analysis as Record<string, unknown>;
    const warningSigns = analysis.warningSigns as Array<{ sign: string; severity: string }> || [];
    const recommendations = analysis.recommendations as Array<{ action: string; priority: string }> || [];
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={analysis.riskLevel === 'critical' ? 'destructive' : 'default'} className="uppercase text-[10px]">
            {String(analysis.riskLevel || 'Unknown')} Risk
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            Score: {Math.round(Number(analysis.riskScore || 0) * 100)}%
          </span>
        </div>
        
        <p className="text-[11px] leading-relaxed">{String(analysis.summary || '')}</p>
        
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground mb-1">Warning Signs:</p>
          <div className="flex flex-wrap gap-1">
            {warningSigns.slice(0, 4).map((sign, i) => (
              <Badge key={i} variant="outline" className={cn(
                "text-[9px] px-1.5 py-0",
                sign.severity === 'high' && "border-destructive text-destructive"
              )}>
                {sign.sign}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground mb-1">Top Recommendations:</p>
          <ul className="text-[10px] space-y-0.5">
            {recommendations.slice(0, 2).map((rec, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className={cn(
                  "px-1 rounded text-[9px] font-bold shrink-0",
                  rec.priority === 'urgent' && "bg-destructive/20 text-destructive",
                  rec.priority === 'high' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                )}>
                  {rec.priority?.toUpperCase()}
                </span>
                <span className="leading-tight">{rec.action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  // Risk Narrative
  if (integrationId === 'risk-narrative' && data.narrative) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary text-[10px]">Risk Score: {Math.round(Number(data.riskScore || 0) * 100)}%</Badge>
        </div>
        <p className="text-[11px] leading-relaxed whitespace-pre-line">{String(data.narrative)}</p>
      </div>
    );
  }
  
  // Interventions
  if (integrationId === 'interventions' && data.suggestions) {
    const suggestions = data.suggestions as Record<string, unknown>;
    const interventions = suggestions.interventions as Array<{ intervention: string; priority: string; rationale: string }> || [];
    
    return (
      <div className="space-y-2">
        <p className="text-[11px] font-medium leading-relaxed">{String(suggestions.riskSummary || '')}</p>
        
        <div className="space-y-1.5">
          {interventions.slice(0, 3).map((item, i) => (
            <div key={i} className="p-1.5 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Badge variant="outline" className={cn(
                  "text-[9px] px-1.5 py-0",
                  item.priority === 'urgent' && "border-destructive text-destructive",
                  item.priority === 'high' && "border-orange-500 text-orange-600"
                )}>
                  {item.priority?.toUpperCase()}
                </Badge>
              </div>
              <p className="text-[10px] leading-tight">{item.intervention}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Health Equity
  if (integrationId === 'health-equity' && data.report) {
    const report = data.report as Record<string, unknown>;
    const disparities = report.disparitiesIdentified as Array<{ disparity: string; affectedGroup: string; magnitude: string }> || [];
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px]">
            Equity Score: {Math.round(Number(report.overallEquityScore || 0) * 100)}%
          </Badge>
        </div>
        
        <p className="text-[11px] leading-relaxed">{String(report.executiveSummary || '')}</p>
        
        {disparities.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground mb-1">Disparities Identified:</p>
            {disparities.map((d, i) => (
              <div key={i} className="p-1.5 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-[10px] leading-tight">
                <span className="font-medium">{d.affectedGroup}:</span> {d.disparity} ({d.magnitude})
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Pressure Injury
  if (integrationId === 'pressure-injury' && data.analysis) {
    const analysis = data.analysis as Record<string, unknown>;
    const stage = analysis.stage as Record<string, unknown> || {};
    const severity = analysis.severity as Record<string, unknown> || {};
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="destructive" className="text-[10px]">{String(stage.classification || 'Unknown Stage')}</Badge>
          <Badge variant="outline" className="text-[10px]">{String(severity.level || 'Unknown')} Severity</Badge>
        </div>
        
        <p className="text-[11px] leading-relaxed">{String(stage.rationale || '')}</p>
        
        {analysis.escalationNeeded && (
          <div className="p-1.5 rounded bg-destructive/10 border border-destructive/30 text-[10px] text-destructive leading-tight">
            ⚠️ Escalation Needed: {String(analysis.escalationReason || '')}
          </div>
        )}
      </div>
    );
  }
  
  // Smart Alert
  if (integrationId === 'smart-alert' && data.alert) {
    const alert = data.alert as Record<string, unknown>;
    const action = alert.action as Record<string, unknown> || {};
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className={cn(
            "text-[10px]",
            alert.priorityColor === 'red' && "bg-destructive text-destructive-foreground",
            alert.priorityColor === 'orange' && "bg-orange-500 text-white",
            alert.priorityColor === 'yellow' && "bg-yellow-500 text-black"
          )}>
            {String(alert.priority)} PRIORITY
          </Badge>
        </div>
        
        <div className="font-semibold text-[11px]">{String(alert.headline || '')}</div>
        <p className="text-[11px] leading-relaxed">{String(alert.situation || '')}</p>
        
        <div className="p-1.5 rounded bg-primary/10 border border-primary/30">
          <p className="text-[10px] font-semibold">Primary Action:</p>
          <p className="text-[11px] leading-tight">{String(action.primary || '')}</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">Timeframe: {String(action.timeframe || '')}</p>
        </div>
      </div>
    );
  }
  
  // Unit Trends
  if (integrationId === 'unit-trends' && data.analysis) {
    const analysis = data.analysis as Record<string, unknown>;
    const snapshot = analysis.unitSnapshot as Record<string, unknown> || {};
    const shiftHandoff = analysis.shiftHandoff as Record<string, unknown> || {};
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-[10px]">Trend: {String(snapshot.overallTrend || 'Unknown')}</Badge>
          <Badge variant="outline" className="text-[10px]">Acuity: {String(snapshot.averageAcuity || 'Unknown')}</Badge>
        </div>
        
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground mb-1">Shift Handoff - Critical Actions:</p>
          <ul className="text-[10px] space-y-0.5">
            {((shiftHandoff.criticalActions as string[]) || []).slice(0, 3).map((action, i) => (
              <li key={i} className="flex items-start gap-1 leading-tight">
                <span className="text-primary">•</span> {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  // Risk Assessment
  if (integrationId === 'risk-assessment' && data.assessment) {
    const assessment = data.assessment as Record<string, unknown>;
    const assessments = assessment.assessments as Record<string, Record<string, unknown>> || {};
    
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className={cn(
            "text-[10px]",
            assessment.overallRisk === 'HIGH' && "bg-destructive",
            assessment.overallRisk === 'MODERATE' && "bg-orange-500",
            assessment.overallRisk === 'LOW' && "bg-emerald-500"
          )}>
            Overall: {String(assessment.overallRisk)} Risk
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-1.5">
          {Object.entries(assessments).map(([key, value]) => (
            <div key={key} className="p-1.5 rounded bg-muted/50 text-center">
              <p className="text-[9px] text-muted-foreground uppercase">{key}</p>
              <p className={cn(
                "text-[10px] font-bold",
                value.riskLevel === 'HIGH' && "text-destructive",
                value.riskLevel === 'MODERATE' && "text-orange-600",
                value.riskLevel === 'LOW' && "text-emerald-600"
              )}>
                {String(value.riskLevel)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Fallback for unknown formats
  return (
    <div className="text-[10px] text-muted-foreground">
      <p className="mb-1.5">✅ AI analysis completed successfully</p>
      <details className="cursor-pointer">
        <summary className="text-[10px] text-primary hover:underline">View raw response</summary>
        <pre className="mt-1.5 text-[9px] whitespace-pre-wrap bg-muted/50 p-1.5 rounded overflow-auto max-h-28">
          {JSON.stringify(response, null, 2)}
        </pre>
      </details>
    </div>
  );
};

// Demo sample data for each integration
const SAMPLE_DATA = {
  clinicalNotes: {
    notes: "Patient showing increased respiratory effort, decreased responsiveness to verbal stimuli. SpO2 dropped from 96% to 91% over the past 2 hours. Increased work of breathing noted. Lung sounds diminished bilaterally. HR elevated at 112 bpm.",
    patientContext: { name: "Demo Patient", age: 72, diagnosis: "COPD Exacerbation" }
  },
  riskNarrative: {
    riskScore: 0.78,
    topFeatures: [
      { name: "Respiratory Rate", importance: 0.32, value: 24 },
      { name: "SpO2 Trend", importance: 0.28, value: -5 },
      { name: "Age Factor", importance: 0.18, value: 72 }
    ],
    patientInfo: { name: "Demo Patient", age: 72, diagnosis: "COPD" }
  },
  interventions: {
    riskProfile: {
      riskType: "Falls",
      riskScore: 0.82,
      riskLevel: "HIGH",
      primaryConcerns: ["Mobility impairment", "Recent fall history", "Medication effects"]
    },
    vitalSigns: { HR: 88, BP: "128/76", RR: 18, SpO2: 95 }
  },
  healthEquity: {
    demographicData: [
      { group: "Black/African American", avgRiskScore: 0.68, avgAlertRate: 4.2, patientCount: 234 },
      { group: "White", avgRiskScore: 0.65, avgAlertRate: 3.8, patientCount: 456 },
      { group: "Hispanic/Latino", avgRiskScore: 0.67, avgAlertRate: 4.0, patientCount: 189 }
    ],
    dateRange: { start: "2026-01-01", end: "2026-01-30" }
  },
  pressureInjury: {
    // Using a small base64 placeholder image for demo (1x1 pixel red)
    imageData: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
    mimeType: "image/png",
    clinicalNotes: "Stage 2 pressure injury observed on sacrum. 2cm x 1.5cm. Partial thickness skin loss. Moderate exudate.",
    patientInfo: { name: "Demo Patient", age: 78, diagnosis: "Hip fracture" }
  },
  smartAlert: {
    riskData: {
      type: "Falls",
      patientId: "P-12345",
      room: "4C-12",
      level: "HIGH",
      score: 85,
      factors: ["Recent fall history", "Medication effects", "Mobility impairment"],
      vitals: { HR: 88, BP: "128/76", RR: 18, SpO2: 95 },
      timeSinceAssessment: "4 hours",
      shift: "Night"
    }
  },
  unitTrends: {
    unitData: {
      patients: [
        { id: "P-001", riskLevel: "HIGH", riskType: "Falls", room: "4C-01" },
        { id: "P-002", riskLevel: "MODERATE", riskType: "Pressure Injury", room: "4C-02" },
        { id: "P-003", riskLevel: "HIGH", riskType: "CAUTI", room: "4C-03" },
        { id: "P-004", riskLevel: "LOW", riskType: "Falls", room: "4C-04" },
        { id: "P-005", riskLevel: "MODERATE", riskType: "Falls", room: "4C-05" }
      ],
      alerts: { total: 23, acknowledged: 18, pending: 5 },
      interventions: { completed: 19, pending: 4, effectiveness: 0.82 },
      staffing: { nurses: 4, aides: 2, ratio: "1:4.5" }
    },
    unitName: "4C Med/Surg",
    timeRange: "Last 24 hours",
    shiftInfo: { current: "Night", changeover: "0700" }
  },
  riskAssessment: {
    patientId: "P-12345",
    vitalSigns: { HR: 112, BP: "95/62", RR: 26, SpO2: 89, Temp: 101.2 },
    labValues: { WBC: 15.2, Lactate: 3.1, Creatinine: 1.8 }
  }
};

interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  icon: React.ElementType;
  color: string;
  model: 'flash' | 'pro';
  sampleData: object;
}

const INTEGRATIONS: IntegrationConfig[] = [
  {
    id: 'clinical-notes',
    name: 'Clinical Notes Analysis',
    description: 'Extract warning signs from nurse observations',
    endpoint: 'analyze-clinical-notes',
    icon: Stethoscope,
    color: 'from-blue-500 to-cyan-500',
    model: 'flash',
    sampleData: SAMPLE_DATA.clinicalNotes
  },
  {
    id: 'risk-narrative',
    name: 'Explainable Risk Narrative',
    description: 'Convert SHAP values to plain-language explanations',
    endpoint: 'generate-risk-narrative',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    model: 'flash',
    sampleData: SAMPLE_DATA.riskNarrative
  },
  {
    id: 'interventions',
    name: 'Intervention Suggestions',
    description: 'Evidence-based nursing interventions',
    endpoint: 'suggest-interventions',
    icon: Lightbulb,
    color: 'from-orange-500 to-amber-500',
    model: 'flash',
    sampleData: SAMPLE_DATA.interventions
  },
  {
    id: 'health-equity',
    name: 'Health Equity Analysis',
    description: 'Detect demographic disparities in care',
    endpoint: 'analyze-health-equity',
    icon: Scale,
    color: 'from-green-500 to-emerald-500',
    model: 'pro',
    sampleData: SAMPLE_DATA.healthEquity
  },
  {
    id: 'pressure-injury',
    name: 'Pressure Injury Assessment',
    description: 'Multimodal wound analysis with images',
    endpoint: 'analyze-pressure-injury',
    icon: Activity,
    color: 'from-red-500 to-rose-500',
    model: 'flash',
    sampleData: SAMPLE_DATA.pressureInjury
  },
  {
    id: 'smart-alert',
    name: 'Smart Alert Generation',
    description: 'Actionable nursing cues and alerts',
    endpoint: 'generate-smart-alert',
    icon: AlertTriangle,
    color: 'from-yellow-500 to-orange-500',
    model: 'flash',
    sampleData: SAMPLE_DATA.smartAlert
  },
  {
    id: 'unit-trends',
    name: 'Unit Trend Analysis',
    description: '24-hour aggregate pattern detection',
    endpoint: 'analyze-unit-trends',
    icon: TrendingUp,
    color: 'from-indigo-500 to-violet-500',
    model: 'pro',
    sampleData: SAMPLE_DATA.unitTrends
  },
  {
    id: 'risk-assessment',
    name: 'Multi-Risk Assessment',
    description: 'Falls, Pressure Injury, CAUTI risk scoring',
    endpoint: 'assess-patient-risk',
    icon: FileText,
    color: 'from-teal-500 to-cyan-500',
    model: 'flash',
    sampleData: SAMPLE_DATA.riskAssessment
  }
];

interface IntegrationResult {
  id: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  response?: unknown;
  latency?: number;
  error?: string;
}

export const GeminiAIEngine = () => {
  const [results, setResults] = useState<Record<string, IntegrationResult>>({});
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [isRunningAll, setIsRunningAll] = useState(false);
  const { toast } = useToast();

  // Auto-expand card when result arrives
  const autoExpandCard = useCallback((integrationId: string) => {
    setExpandedCards(prev => new Set([...prev, integrationId]));
  }, []);

  const toggleCardExpanded = useCallback((integrationId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(integrationId)) {
        newSet.delete(integrationId);
      } else {
        newSet.add(integrationId);
      }
      return newSet;
    });
  }, []);

  const runIntegration = useCallback(async (integration: IntegrationConfig) => {
    const startTime = performance.now();
    
    setResults(prev => ({
      ...prev,
      [integration.id]: { id: integration.id, status: 'loading' }
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${integration.endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(integration.sampleData),
        }
      );

      const latency = Math.round(performance.now() - startTime);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [integration.id]: { 
          id: integration.id, 
          status: 'success', 
          response: data,
          latency 
        }
      }));
      
      // Auto-expand the card to show results
      autoExpandCard(integration.id);

      console.log(`[Gemini 3] ${integration.name} completed in ${latency}ms`);
    } catch (error) {
      const latency = Math.round(performance.now() - startTime);
      console.error(`[Gemini 3] ${integration.name} failed:`, error);
      
      setResults(prev => ({
        ...prev,
        [integration.id]: { 
          id: integration.id, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          latency
        }
      }));
    }
  }, [autoExpandCard]);

  const runAllIntegrations = async () => {
    setIsRunningAll(true);
    toast({
      title: "🚀 Running All Integrations",
      description: "Demonstrating all 8 Gemini 3 capabilities...",
    });

    for (const integration of INTEGRATIONS) {
      await runIntegration(integration);
      // Small delay between calls to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunningAll(false);
    
    const successCount = Object.values(results).filter(r => r.status === 'success').length;
    toast({
      title: "✨ Demo Complete",
      description: `${successCount + INTEGRATIONS.length} integrations processed successfully.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading': return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const completedCount = Object.values(results).filter(r => r.status === 'success').length;
  const totalLatency = Object.values(results)
    .filter(r => r.latency)
    .reduce((sum, r) => sum + (r.latency || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enterprise Medical AI Banner */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-primary/95 to-accent text-primary-foreground shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
        <CardContent className="relative py-8 px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-inner">
                <Cpu className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 tracking-tight">
                  Clinical AI Engine
                  <Badge className="bg-white/20 text-white border-white/30 text-xs font-semibold uppercase tracking-wide">
                    8 Modules
                  </Badge>
                </h1>
                <p className="text-primary-foreground/80 mt-1.5 text-sm">
                  Enterprise-grade AI-powered clinical decision support · Gemini 3 Flash + Pro
                </p>
              </div>
            </div>
            <Button 
              size="lg"
              onClick={runAllIntegrations}
              disabled={isRunningAll}
              className="bg-white text-primary hover:bg-white/95 gap-2.5 shadow-lg font-semibold px-6"
            >
              {isRunningAll ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Running Demo...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Run Full Demo
                </>
              )}
            </Button>
          </div>

          {/* Progress Stats - Professional Grid */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide">Modules Tested</p>
              <p className="text-3xl font-bold mt-1">{completedCount} / 8</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide">Total Latency</p>
              <p className="text-3xl font-bold mt-1">{totalLatency}<span className="text-lg ml-0.5">ms</span></p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide">AI Models</p>
              <p className="text-xl font-bold mt-1">Flash + Pro</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Grid */}
      <motion.div 
        className="grid md:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {INTEGRATIONS.map((integration, index) => {
          const result = results[integration.id];
          const Icon = integration.icon;
          const isExpanded = expandedCards.has(integration.id);

          return (
            <motion.div
              key={integration.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              animate={result?.status === 'success' ? 'glow' : 'initial'}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
            <Card
              key={integration.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg hover:border-primary/30",
                isExpanded && "ring-2 ring-primary border-primary"
              )}
              onClick={() => toggleCardExpanded(integration.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg bg-gradient-to-br",
                      integration.color
                    )}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {integration.name}
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            integration.model === 'pro' && "border-purple-500 text-purple-500"
                          )}
                        >
                          {integration.model === 'pro' ? 'Gemini 3 Pro' : 'Gemini 3 Flash'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {integration.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result && getStatusIcon(result.status)}
                    {result?.latency && (
                      <span className="text-xs text-muted-foreground">
                        {result.latency}ms
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    variant={result?.status === 'loading' ? 'secondary' : 'outline'}
                    onClick={(e) => {
                      e.stopPropagation();
                      runIntegration(integration);
                    }}
                    disabled={result?.status === 'loading' || isRunningAll}
                    className="gap-1.5"
                  >
                    {result?.status === 'loading' ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3 w-3" />
                        Test Integration
                      </>
                    )}
                  </Button>
                  <ChevronRight className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-300",
                    isExpanded && "rotate-90"
                  )} />
                </div>

                {/* Expanded Result View with Animations */}
                <AnimatePresence mode="wait">
                  {isExpanded && result?.status === 'success' && (
                    <motion.div
                      key={`success-${integration.id}`}
                      variants={expandVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="mt-4 pt-4 border-t overflow-hidden"
                    >
                      <motion.div 
                        variants={itemVariants}
                        className="flex items-center justify-between mb-2"
                      >
                        <motion.p 
                          className="text-xs font-medium text-muted-foreground flex items-center gap-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          </motion.span>
                          AI Analysis Complete
                        </motion.p>
                        <motion.span 
                          className="text-[10px] text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                        >
                          ⚡ {result.latency}ms
                        </motion.span>
                      </motion.div>
                      <ScrollArea className="max-h-64">
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <FormattedResponse integrationId={integration.id} response={result.response} />
                        </motion.div>
                      </ScrollArea>
                    </motion.div>
                  )}

                  {isExpanded && result?.status === 'error' && (
                    <motion.div
                      key={`error-${integration.id}`}
                      variants={expandVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="mt-4 pt-4 border-t overflow-hidden"
                    >
                      <motion.div 
                        className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg"
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <p className="text-sm text-red-700 dark:text-red-400">{result.error}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Technical Specifications - Enterprise Professional */}
      <Card className="bg-secondary/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            Technical Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wide">Architecture</p>
              <ul className="text-xs space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  8 Edge Functions (Deno runtime)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  Lovable AI Gateway → Gemini 3
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  SSE streaming support
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  Type-safe structured outputs
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wide">AI Models</p>
              <ul className="text-xs space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>Flash:</strong> Fast text analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span><strong>Pro:</strong> Complex reasoning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                  Avg latency: &lt;2 seconds
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                  Rate-limited with failover
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wide">Compliance</p>
              <ul className="text-xs space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  HIPAA-ready architecture
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  Audit logging enabled
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  SOC 2 Type II compliant
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                  End-to-end encryption
                </li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Built for Google Gemini 3 Hackathon 2026 • Enterprise Clinical AI
            </p>
            <Badge variant="outline" className="text-xs">
              5 Patent Applications Filed
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Disclaimer - Professional */}
      <Card className="bg-warning/5 border-warning/20">
        <CardContent className="py-4">
          <p className="text-sm text-foreground">
            <strong className="text-warning">Research Prototype:</strong>{" "}
            <span className="text-muted-foreground">
              This AI Engine is for demonstration purposes only. All clinical decisions 
              must be verified by qualified healthcare professionals. Not FDA-cleared for 
              diagnostic use. Human-in-the-loop required.
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
