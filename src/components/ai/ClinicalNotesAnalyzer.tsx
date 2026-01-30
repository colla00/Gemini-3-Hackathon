import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Stethoscope,
  Activity,
  Brain,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WarningSigns {
  sign: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
}

interface Recommendation {
  action: string;
  priority: 'urgent' | 'high' | 'routine';
  rationale: string;
}

interface AnalysisResult {
  warningSigns: WarningSigns[];
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
  riskScore: number;
  recommendations: Recommendation[];
  confidence: number;
  summary: string;
  clinicalContext: string;
}

interface ClinicalNotesAnalyzerProps {
  patientContext?: {
    name?: string;
    age?: number;
    diagnosis?: string;
  };
  onAnalysisComplete?: (analysis: AnalysisResult) => void;
}

export const ClinicalNotesAnalyzer = ({ 
  patientContext,
  onAnalysisComplete 
}: ClinicalNotesAnalyzerProps) => {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeNotes = async () => {
    if (!notes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please enter clinical observations to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("[Gemini 3] Starting clinical notes analysis...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-clinical-notes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ notes, patientContext }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      const data = await response.json();
      console.log("[Gemini 3] Analysis complete:", data);
      
      setAnalysis(data.analysis);
      onAnalysisComplete?.(data.analysis);

      toast({
        title: "✨ Analysis Complete",
        description: `Risk level: ${data.analysis.riskLevel.toUpperCase()} (${(data.analysis.riskScore * 100).toFixed(0)}%)`,
      });
    } catch (error) {
      console.error("[Gemini 3] Error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  const getSeverityVariant = (severity: string): "destructive" | "default" | "secondary" => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Clinical Notes Analyzer
                <Badge variant="outline" className="text-xs font-normal">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Gemini 3
                </Badge>
              </CardTitle>
              <CardDescription>
                AI-powered analysis of nurse observations
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Enter patient observations... (e.g., 'Patient showing increased respiratory effort, decreased responsiveness to verbal stimuli, SpO2 dropped from 96% to 91% over the past 2 hours...')"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={analyzeNotes} 
            disabled={isLoading || !notes.trim()}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                Analyze with AI
              </>
            )}
          </Button>
          {analysis && (
            <Button 
              variant="outline" 
              onClick={() => setAnalysis(null)}
              className="gap-2"
            >
              Clear Results
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {analysis && !isLoading && (
          <div className="space-y-4 animate-fade-in">
            {/* Risk Level Banner */}
            <div className={`p-4 rounded-lg ${getRiskColor(analysis.riskLevel)} text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <span className="font-semibold text-lg">
                    {analysis.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {(analysis.riskScore * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs opacity-80">
                    Confidence: {(analysis.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">{analysis.summary}</p>
            </div>

            {/* Warning Signs */}
            {analysis.warningSigns.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Warning Signs Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.warningSigns.map((sign, i) => (
                    <Badge 
                      key={i} 
                      variant={getSeverityVariant(sign.severity)}
                      className="text-xs"
                    >
                      {sign.sign}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Monitoring Recommendations
                </h4>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <div 
                      key={i}
                      className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{rec.action}</p>
                          <p className="text-xs opacity-70 mt-1">{rec.rationale}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {rec.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground italic">
              ⚠️ AI-generated analysis for decision support only. All findings require clinical verification.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
