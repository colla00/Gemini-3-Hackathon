import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  ChevronDown,
  Loader2,
  ExternalLink,
  Accessibility,
  Shield,
  Keyboard,
  Eye,
  FileText
} from 'lucide-react';
import { 
  runAccessibilityAudit, 
  getViolationSummary, 
  passesWCAG21AA,
  getComplianceSummary,
  checkAccessibilityFeatures,
  type AuditResult,
  type ViolationSummary,
  type FeatureCheck
} from '@/lib/accessibilityAudit';
import { cn } from '@/lib/utils';

interface AccessibilityAuditPanelProps {
  className?: string;
}

export const AccessibilityAuditPanel = ({ className }: AccessibilityAuditPanelProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AuditResult | null>(null);
  const [violations, setViolations] = useState<ViolationSummary[]>([]);
  const [featureChecks, setFeatureChecks] = useState<FeatureCheck[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const runAudit = useCallback(async () => {
    setIsRunning(true);
    try {
      const auditResults = await runAccessibilityAudit(document);
      setResults(auditResults);
      setViolations(getViolationSummary(auditResults));
      setFeatureChecks(checkAccessibilityFeatures(document.body));
    } catch (error) {
      console.error('Accessibility audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'serious':
        return 'bg-risk-high/20 text-risk-high';
      case 'moderate':
        return 'bg-risk-medium/20 text-risk-medium';
      case 'minor':
        return 'bg-risk-low/20 text-risk-low';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical':
      case 'serious':
        return <XCircle className="w-4 h-4" aria-hidden="true" />;
      case 'moderate':
        return <AlertTriangle className="w-4 h-4" aria-hidden="true" />;
      case 'minor':
        return <Info className="w-4 h-4" aria-hidden="true" />;
      default:
        return <Info className="w-4 h-4" aria-hidden="true" />;
    }
  };

  const summary = results ? getComplianceSummary(results) : null;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-lg">Accessibility Audit</CardTitle>
          </div>
          <Button 
            onClick={runAudit} 
            disabled={isRunning}
            size="sm"
            aria-label={isRunning ? 'Running accessibility audit' : 'Run accessibility audit'}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                Auditing...
              </>
            ) : (
              'Run Audit'
            )}
          </Button>
        </div>
        <CardDescription>
          WCAG 2.1 AA compliance verification with detailed feature checks
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!results && !isRunning && (
          <div className="text-center py-8 space-y-3">
            <Shield className="w-12 h-12 mx-auto text-muted-foreground/50" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Click "Run Audit" to check this page for accessibility issues
            </p>
            <p className="text-xs text-muted-foreground/70">
              Tests against WCAG 2.1 AA standards using axe-core
            </p>
          </div>
        )}

        {results && summary && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="text-xs">
                <Eye className="w-3 h-3 mr-1" aria-hidden="true" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="violations" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" aria-hidden="true" />
                Violations ({violations.length})
              </TabsTrigger>
              <TabsTrigger value="features" className="text-xs">
                <Keyboard className="w-3 h-3 mr-1" aria-hidden="true" />
                Features
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Score Card */}
              <div 
                className={cn(
                  "p-4 rounded-lg border",
                  summary.level === 'pass' 
                    ? "bg-risk-low/10 border-risk-low/30" 
                    : summary.level === 'warning'
                    ? "bg-risk-medium/10 border-risk-medium/30"
                    : "bg-risk-high/10 border-risk-high/30"
                )}
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {summary.level === 'pass' ? (
                      <CheckCircle className="w-6 h-6 text-risk-low" aria-hidden="true" />
                    ) : summary.level === 'warning' ? (
                      <AlertTriangle className="w-6 h-6 text-risk-medium" aria-hidden="true" />
                    ) : (
                      <XCircle className="w-6 h-6 text-risk-high" aria-hidden="true" />
                    )}
                    <div>
                      <span className="font-semibold text-lg">
                        {summary.level === 'pass' 
                          ? 'WCAG 2.1 AA Compliant' 
                          : summary.level === 'warning'
                          ? 'Minor Issues Found'
                          : 'Violations Detected'}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {summary.passCount} rules passed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-3xl font-bold",
                      summary.score >= 90 ? "text-risk-low" :
                      summary.score >= 70 ? "text-risk-medium" :
                      "text-risk-high"
                    )}>
                      {summary.score}
                    </span>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
                
                <Progress 
                  value={summary.score} 
                  className={cn(
                    "h-2",
                    summary.score >= 90 ? "[&>div]:bg-risk-low" :
                    summary.score >= 70 ? "[&>div]:bg-risk-medium" :
                    "[&>div]:bg-risk-high"
                  )}
                />
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="p-3 rounded-lg bg-risk-high/10 border border-risk-high/20 text-center">
                  <span className="text-2xl font-bold text-risk-high">{summary.criticalCount}</span>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
                <div className="p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/20 text-center">
                  <span className="text-2xl font-bold text-risk-medium">{summary.seriousCount}</span>
                  <p className="text-xs text-muted-foreground">Serious</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-center">
                  <span className="text-2xl font-bold text-warning">{summary.moderateCount}</span>
                  <p className="text-xs text-muted-foreground">Moderate</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
                  <span className="text-2xl font-bold text-muted-foreground">{summary.minorCount}</span>
                  <p className="text-xs text-muted-foreground">Minor</p>
                </div>
              </div>

              {/* Incomplete Notice */}
              {summary.incompleteCount > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <Info className="w-4 h-4 text-primary mt-0.5" aria-hidden="true" />
                  <div className="text-sm">
                    <span className="font-medium">{summary.incompleteCount} items need manual review</span>
                    <p className="text-xs text-muted-foreground">
                      Some checks require human verification
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Violations Tab */}
            <TabsContent value="violations">
              {violations.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto text-risk-low mb-2" aria-hidden="true" />
                  <p className="text-sm font-medium text-risk-low">No Violations Found</p>
                  <p className="text-xs text-muted-foreground">
                    This page meets WCAG 2.1 AA standards
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[280px]">
                  <div className="space-y-2 pr-4">
                    {violations.map((violation) => (
                      <Collapsible key={violation.id}>
                        <CollapsibleTrigger asChild>
                          <button
                            className="w-full text-left p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            aria-expanded="false"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                {getImpactIcon(violation.impact)}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge 
                                      className={cn("text-xs", getImpactColor(violation.impact))}
                                    >
                                      {violation.impact}
                                    </Badge>
                                    <code className="text-xs bg-muted px-1 rounded">
                                      {violation.id}
                                    </code>
                                  </div>
                                  <p className="text-sm mt-1 text-muted-foreground truncate">
                                    {violation.help}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {violation.nodes} element{violation.nodes !== 1 ? 's' : ''}
                                </Badge>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                              </div>
                            </div>
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-3 pt-0 space-y-2 text-sm">
                            <p className="text-muted-foreground">
                              {violation.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {violation.wcagTags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <a
                              href={violation.helpUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              Learn more <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            </a>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">
                  Quick checks for common accessibility features
                </p>
                {featureChecks.map((check, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      check.passed 
                        ? "bg-risk-low/5 border-risk-low/20" 
                        : "bg-risk-high/5 border-risk-high/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {check.passed ? (
                        <CheckCircle className="w-4 h-4 text-risk-low" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-4 h-4 text-risk-high" aria-hidden="true" />
                      )}
                      <div>
                        <span className="text-sm font-medium">{check.name}</span>
                        <p className="text-xs text-muted-foreground">{check.details}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={check.passed ? "secondary" : "destructive"} 
                      className="text-xs"
                    >
                      {check.passed ? 'Pass' : 'Fail'}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Timestamp */}
        {results && (
          <p className="text-xs text-muted-foreground text-right mt-4">
            Audited: {new Date(results.timestamp).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
