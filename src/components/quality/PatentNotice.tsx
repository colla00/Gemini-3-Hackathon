import { FileText, Award, Shield, Lightbulb, User, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PATENT_PORTFOLIO, PATENT_NUMBER, PATENT_2_NUMBER, PATENT_3_NUMBER, PATENT_4_NUMBER } from '@/constants/patent';

export const PatentNotice = () => {
  const filedPatents = PATENT_PORTFOLIO.filter(p => p.status === 'filed');
  
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" aria-hidden="true" />
            <CardTitle className="text-base">U.S. Patent Portfolio</CardTitle>
          </div>
          <Badge variant="outline" className="bg-risk-low/10 border-risk-low/30 text-risk-low">
            {filedPatents.length} Patents Filed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patent List - Simplified for IP Protection */}
        <div className="space-y-2">
          {PATENT_PORTFOLIO.map((patent) => (
            <div 
              key={patent.id} 
              className="p-3 rounded bg-background/50 border border-border/30 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">
                  {patent.shortName}
                </h4>
                {patent.status === 'filed' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-risk-low shrink-0" />
                )}
              </div>
              <Badge 
                variant="outline" 
                className={patent.status === 'filed' 
                  ? 'bg-risk-low/10 border-risk-low/30 text-risk-low text-[10px]' 
                  : 'bg-warning/10 border-warning/30 text-warning text-[10px]'
                }
              >
                {patent.status === 'filed' ? 'Filed' : 'Pending'}
              </Badge>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-medium block text-foreground">IP Protected</span>
              <span className="text-muted-foreground">35 U.S.C. § 111(b)</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-medium block text-foreground">80+ Claims</span>
              <span className="text-muted-foreground">4 integrated systems</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <User className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-medium block text-foreground">Inventor</span>
              <span className="text-muted-foreground">Dr. Alexis Collier</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground">
          © 2025-2026 Alexis Collier. All rights reserved. Patents pending pursuant to 35 U.S.C. § 111(b).
        </p>
      </CardContent>
    </Card>
  );
};

export const PatentBadge = ({ className = '', contextPatent }: { className?: string; contextPatent?: 'trust' | 'risk' | 'unified' | 'dbs' }) => {
  // Context-specific patent display
  const getPatentInfo = () => {
    switch (contextPatent) {
      case 'trust':
        return { number: PATENT_NUMBER, name: 'Trust-Based Alerts' };
      case 'risk':
        return { number: PATENT_2_NUMBER, name: 'Risk Intelligence' };
      case 'unified':
        return { number: PATENT_3_NUMBER, name: 'Unified Platform' };
      case 'dbs':
        return { number: PATENT_4_NUMBER, name: 'DBS System' };
      default:
        return null;
    }
  };

  const patentInfo = getPatentInfo();
  const filedCount = PATENT_PORTFOLIO.filter(p => p.status === 'filed').length;

  if (patentInfo) {
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded bg-accent/10 border border-accent/30 ${className}`}>
        <Award className="w-3 h-3 text-accent" aria-hidden="true" />
        <span className="text-[10px] text-accent font-medium">
          U.S. Patent {patentInfo.number} · {patentInfo.name}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded bg-accent/10 border border-accent/30 ${className}`}>
      <Award className="w-3 h-3 text-accent" aria-hidden="true" />
      <span className="text-[10px] text-accent font-medium">
        {filedCount} U.S. Patents Filed · Alexis Collier
      </span>
    </div>
  );
};