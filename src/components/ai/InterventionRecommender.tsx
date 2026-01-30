import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, 
  AlertTriangle,
  RefreshCw,
  Clock,
  CheckCircle2,
  Lightbulb,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Intervention {
  id: number;
  intervention: string;
  priority: 'urgent' | 'high' | 'medium';
  rationale: string;
  expectedOutcome: string;
  timeframe: string;
  evidenceBasis: string;
}

interface Suggestions {
  interventions: Intervention[];
  escalationCriteria: string;
  monitoringFrequency: string;
  riskSummary: string;
}

interface InterventionRecommenderProps {
  riskProfile: {
    riskType: string;
    riskScore: number;
    riskLevel: string;
    primaryConcerns?: string[];
  };
  vitalSigns?: Record<string, number | string>;
  trends?: Record<string, string>;
  patientInfo?: {
    name?: string;
    age?: number;
    diagnosis?: string;
  };
  autoTrigger?: boolean;
  onInterventionComplete?: (interventionId: number) => void;
}

export const InterventionRecommender = ({
  riskProfile,
  vitalSigns,
  trends,
  patientInfo,
  autoTrigger = true,
  onInterventionComplete
}: InterventionRecommenderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [completedInterventions, setCompletedInterventions] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (autoTrigger && riskProfile.riskScore >= 0.7 && !suggestions) {
      generateSuggestions();
    }
  }, [autoTrigger, riskProfile.riskScore]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    console.log("[Gemini 3] Generating intervention suggestions...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-interventions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ riskProfile, vitalSigns, trends, patientInfo }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const data = await response.json();
      console.log("[Gemini 3] Interventions generated:", data);
      
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("[Gemini 3] Error:", error);
      toast({
        title: "Intervention Suggestions Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterventionComplete = (id: number) => {
    setCompletedInterventions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        onInterventionComplete?.(id);
        console.log("[Gemini 3] Intervention marked complete:", id);
      }
      return newSet;
    });
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent': 
        return {
          border: 'border-l-4 border-l-red-500 bg-red-50',
          badge: 'bg-red-500 text-white',
          icon: 'text-red-500'
        };
      case 'high': 
        return {
          border: 'border-l-4 border-l-orange-500 bg-orange-50',
          badge: 'bg-orange-500 text-white',
          icon: 'text-orange-500'
        };
      default: 
        return {
          border: 'border-l-4 border-l-yellow-500 bg-yellow-50',
          badge: 'bg-yellow-500 text-white',
          icon: 'text-yellow-500'
        };
    }
  };

  const shouldShow = riskProfile.riskScore >= 0.7;

  if (!shouldShow && !suggestions) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-100">
              <Lightbulb className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                AI Intervention Suggestions
                <Badge variant="outline" className="text-xs font-normal">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Gemini 3
                </Badge>
              </CardTitle>
              <CardDescription>
                Evidence-based nursing interventions
              </CardDescription>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={generateSuggestions}
            disabled={isLoading}
            className="gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Generating...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : suggestions ? (
          <>
            {/* Risk Summary */}
            <div className="p-3 bg-orange-100 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800">{suggestions.riskSummary}</p>
                <p className="text-xs text-orange-600 mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Monitoring: {suggestions.monitoringFrequency}
                </p>
              </div>
            </div>

            {/* Interventions */}
            <div className="space-y-3">
              {suggestions.interventions.map((intervention) => {
                const styles = getPriorityStyles(intervention.priority);
                const isCompleted = completedInterventions.has(intervention.id);

                return (
                  <div
                    key={intervention.id}
                    className={`p-4 rounded-lg ${styles.border} ${isCompleted ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => handleInterventionComplete(intervention.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {intervention.id}. {intervention.intervention}
                          </span>
                          <Badge className={`text-xs ${styles.badge}`}>
                            {intervention.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {intervention.rationale}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            {intervention.expectedOutcome}
                          </span>
                          <span className="flex items-center gap-1 text-blue-600">
                            <Clock className="h-3 w-3" />
                            {intervention.timeframe}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Escalation Criteria */}
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="font-medium text-sm text-red-800">Escalation Criteria</span>
              </div>
              <p className="text-xs text-red-700">{suggestions.escalationCriteria}</p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {completedInterventions.size} of {suggestions.interventions.length} interventions completed
              </span>
              <span className="italic">
                AI-generated • Requires clinical judgment
              </span>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <Lightbulb className="h-12 w-12 text-orange-300 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Generate evidence-based intervention suggestions for this high-risk patient
            </p>
            <Button onClick={generateSuggestions} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
