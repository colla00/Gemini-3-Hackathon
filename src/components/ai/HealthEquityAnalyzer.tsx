import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  RefreshCw,
  Download,
  Scale,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Disparity {
  disparity: string;
  affectedGroup: string;
  magnitude: string;
  clinicalSignificance: 'high' | 'moderate' | 'low';
  potentialCauses: string[];
}

interface Recommendation {
  recommendation: string;
  targetedGroup: string;
  expectedImpact: string;
  implementationLevel: 'unit' | 'department' | 'system';
  priority: 'immediate' | 'short-term' | 'long-term';
}

interface EquityReport {
  executiveSummary: string;
  disparitiesIdentified: Disparity[];
  recommendations: Recommendation[];
  monitoringMetrics: string[];
  limitations: string;
  overallEquityScore: number;
}

// Sample demographic data for demo
const sampleDemographicData = [
  {
    group: "Black/African American",
    avgRiskScore: 0.68,
    avgAlertRate: 4.2,
    avgInterventionTime: 18.5,
    patientCount: 234
  },
  {
    group: "White",
    avgRiskScore: 0.65,
    avgAlertRate: 3.8,
    avgInterventionTime: 14.2,
    patientCount: 456
  },
  {
    group: "Hispanic/Latino",
    avgRiskScore: 0.67,
    avgAlertRate: 4.0,
    avgInterventionTime: 16.8,
    patientCount: 189
  },
  {
    group: "Asian",
    avgRiskScore: 0.62,
    avgAlertRate: 3.5,
    avgInterventionTime: 13.9,
    patientCount: 112
  },
  {
    group: "Other/Unknown",
    avgRiskScore: 0.64,
    avgAlertRate: 3.9,
    avgInterventionTime: 15.5,
    patientCount: 67
  }
];

export const HealthEquityAnalyzer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<EquityReport | null>(null);
  const { toast } = useToast();

  const generateReport = async () => {
    setIsLoading(true);
    console.log("[Gemini 3] Generating health equity report...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-health-equity`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            demographicData: sampleDemographicData,
            dateRange: {
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              end: new Date().toISOString().split('T')[0]
            }
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      const data = await response.json();
      console.log("[Gemini 3] Equity report generated:", data);
      
      setReport(data.report);
      
      toast({
        title: "✨ Equity Report Generated",
        description: `Found ${data.report.disparitiesIdentified?.length || 0} disparities to address.`,
      });
    } catch (error) {
      console.error("[Gemini 3] Error:", error);
      toast({
        title: "Report Generation Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return 'bg-red-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'border-red-300 bg-red-50';
      case 'short-term': return 'border-orange-300 bg-orange-50';
      default: return 'border-blue-300 bg-blue-50';
    }
  };

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Health Equity Analysis
                <Badge variant="outline" className="text-xs font-normal">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Gemini 3
                </Badge>
              </CardTitle>
              <CardDescription>
                AI-powered demographic disparity detection
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Demographic Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {sampleDemographicData.map((group) => (
            <div key={group.group} className="p-2 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground truncate">{group.group}</p>
              <p className="font-semibold">{group.patientCount}</p>
              <p className="text-xs text-muted-foreground">patients</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateReport} 
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Scale className="h-4 w-4" />
                Generate Equity Report
              </>
            )}
          </Button>
          {report && (
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        )}

        {report && !isLoading && (
          <div className="space-y-5 animate-fade-in">
            {/* Equity Score */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Overall Equity Score</span>
                <span className="text-2xl font-bold text-primary">
                  {(report.overallEquityScore * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={report.overallEquityScore * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                100% = perfect equity across all demographic groups
              </p>
            </div>

            {/* Executive Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Executive Summary
              </h4>
              <p className="text-sm">{report.executiveSummary}</p>
            </div>

            {/* Disparities */}
            {report.disparitiesIdentified.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Disparities Identified ({report.disparitiesIdentified.length})
                </h4>
                <div className="space-y-3">
                  {report.disparitiesIdentified.map((disparity, i) => (
                    <div key={i} className="p-3 border rounded-lg bg-card">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-medium text-sm">{disparity.disparity}</p>
                          <p className="text-xs text-muted-foreground">
                            Affecting: {disparity.affectedGroup}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSignificanceColor(disparity.clinicalSignificance)}>
                            {disparity.clinicalSignificance}
                          </Badge>
                          <span className="text-sm font-medium flex items-center">
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            {disparity.magnitude}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {disparity.potentialCauses.map((cause, j) => (
                          <Badge key={j} variant="outline" className="text-xs">
                            {cause}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Recommendations ({report.recommendations.length})
                </h4>
                <div className="space-y-2">
                  {report.recommendations.map((rec, i) => (
                    <div 
                      key={i} 
                      className={`p-3 border rounded-lg ${getPriorityStyles(rec.priority)}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{rec.recommendation}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Target: {rec.targetedGroup} • Level: {rec.implementationLevel}
                          </p>
                          <p className="text-xs mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            {rec.expectedImpact}
                          </p>
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

            {/* Monitoring Metrics */}
            {report.monitoringMetrics.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-sm text-blue-800 mb-2">
                  Recommended Monitoring Metrics
                </h4>
                <ul className="list-disc list-inside text-xs text-blue-700 space-y-1">
                  {report.monitoringMetrics.map((metric, i) => (
                    <li key={i}>{metric}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Limitations */}
            <p className="text-xs text-muted-foreground italic">
              ⚠️ Limitations: {report.limitations}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
