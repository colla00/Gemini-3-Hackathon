import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  ChevronDown,
  Loader2,
  ExternalLink,
  Accessibility
} from 'lucide-react';
import { 
  runAccessibilityAudit, 
  getViolationSummary, 
  passesWCAG21AA,
  type AuditResult,
  type ViolationSummary
} from '@/lib/accessibilityAudit';
import { cn } from '@/lib/utils';

interface AccessibilityAuditPanelProps {
  className?: string;
}

export const AccessibilityAuditPanel = ({ className }: AccessibilityAuditPanelProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AuditResult | null>(null);
  const [violations, setViolations] = useState<ViolationSummary[]>([]);

  const runAudit = useCallback(async () => {
    setIsRunning(true);
    try {
      const auditResults = await runAccessibilityAudit(document);
      setResults(auditResults);
      setViolations(getViolationSummary(auditResults));
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
          WCAG 2.1 AA compliance verification
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!results && !isRunning && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Click "Run Audit" to check this page for accessibility issues
          </p>
        )}

        {results && (
          <div className="space-y-4">
            {/* Summary */}
            <div 
              className={cn(
                "p-4 rounded-lg border",
                passesWCAG21AA(results) 
                  ? "bg-risk-low/10 border-risk-low/30" 
                  : "bg-risk-high/10 border-risk-high/30"
              )}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 mb-2">
                {passesWCAG21AA(results) ? (
                  <CheckCircle className="w-5 h-5 text-risk-low" aria-hidden="true" />
                ) : (
                  <XCircle className="w-5 h-5 text-risk-high" aria-hidden="true" />
                )}
                <span className="font-semibold">
                  {passesWCAG21AA(results) 
                    ? 'Passes WCAG 2.1 AA' 
                    : 'Violations Found'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-risk-low" aria-hidden="true" />
                  <span>{results.passes.length} passed</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-risk-high" aria-hidden="true" />
                  <span>{results.violations.length} violations</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-risk-medium" aria-hidden="true" />
                  <span>{results.incomplete.length} review needed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Info className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                  <span>{results.inapplicable.length} N/A</span>
                </div>
              </div>
            </div>

            {/* Violations List */}
            {violations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Violations</h3>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2 pr-4">
                    {violations.map((violation, index) => (
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
              </div>
            )}

            {/* Timestamp */}
            <p className="text-xs text-muted-foreground text-right">
              Audited: {new Date(results.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
