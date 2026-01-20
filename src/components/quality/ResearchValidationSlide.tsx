// Research Validation Slide for Presentations
// Copyright © Dr. Alexis Collier - Patent Pending

import { 
  Award, Building2, Users, TrendingUp, Shield, 
  CheckCircle, BarChart3, FlaskConical, Globe, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RESEARCH_DATA, TIMELINE, PATENTS, PUBLICATIONS } from '@/data/researchData';

export const ResearchValidationSlide = () => {
  const { validation, dbs, risk, alerts } = RESEARCH_DATA;

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-primary/5 p-6 flex flex-col overflow-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FlaskConical className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Clinical Validation at Scale
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Multi-site validation across {validation.externalHospitals} hospitals with {validation.internalPatients.toLocaleString()} patients
        </p>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border-2 border-primary/50 bg-primary/5">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold text-primary">
              {validation.internalPatients.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Patients Analyzed</div>
            <Badge variant="outline" className="mt-2 text-[10px]">Internal Cohort</Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-500/50 bg-emerald-500/5">
          <CardContent className="p-4 text-center">
            <Building2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <div className="text-3xl font-bold text-emerald-500">
              {validation.externalHospitals}
            </div>
            <div className="text-xs text-muted-foreground">Hospitals Validated</div>
            <Badge variant="outline" className="mt-2 text-[10px] border-emerald-500/50 text-emerald-600">External Validation</Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <div className="text-3xl font-bold text-amber-500">
              {validation.cohensD}
            </div>
            <div className="text-xs text-muted-foreground">Cohen's d Effect Size</div>
            <Badge variant="outline" className="mt-2 text-[10px] border-amber-500/50 text-amber-600">Very Large Effect</Badge>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500/50 bg-purple-500/5">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="text-3xl font-bold text-purple-500">
              {(alerts.equityDisparity * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Equity Disparity</div>
            <Badge variant="outline" className="mt-2 text-[10px] border-purple-500/50 text-purple-600">Below 0.5% Target</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Left Column: Model Performance */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Model Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* DBS Performance */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Documentation Burden Score (DBS)</span>
                  <Badge variant="secondary" className="text-[10px]">ANIA 2026</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="text-lg font-bold text-primary">{validation.internalAUC}</div>
                    <div className="text-[10px] text-muted-foreground">Internal AUC</div>
                    <div className="text-[9px] text-muted-foreground mt-1">
                      95% CI: {validation.confidenceInterval[0]} - {validation.confidenceInterval[1]}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <div className="text-lg font-bold text-emerald-500">{validation.externalAUC}</div>
                    <div className="text-[10px] text-muted-foreground">External AUC</div>
                    <div className="text-[9px] text-muted-foreground mt-1">
                      r = {validation.correlation} (p &lt; 0.001)
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Prediction */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Clinical Risk Intelligence</span>
                  <Badge variant="secondary" className="text-[10px]">Patent #63/932,953</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Sepsis AUC</span>
                      <span className="text-sm font-bold text-foreground">{risk.sepsisAUC}</span>
                    </div>
                    <Progress value={risk.sepsisAUC * 100} className="h-1.5 mt-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Respiratory AUC</span>
                      <span className="text-sm font-bold text-foreground">{risk.respiratoryAUC}</span>
                    </div>
                    <Progress value={risk.respiratoryAUC * 100} className="h-1.5 mt-2" />
                  </div>
                </div>
              </div>

              {/* Alert System */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Trust-Based Alert System</span>
                  <Badge variant="secondary" className="text-[10px]">Patent Pending</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 rounded-lg bg-risk-low/10 text-center">
                    <div className="text-lg font-bold text-risk-low">{(alerts.reductionRate * 100).toFixed(0)}%</div>
                    <div className="text-[9px] text-muted-foreground">Alert Reduction</div>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10 text-center">
                    <div className="text-lg font-bold text-primary">{(alerts.sensitivity * 100).toFixed(0)}%</div>
                    <div className="text-[9px] text-muted-foreground">Sensitivity</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-center">
                    <div className="text-lg font-bold text-amber-500">{(alerts.trustScore * 100).toFixed(0)}%</div>
                    <div className="text-[9px] text-muted-foreground">Trust Score</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DBS Quartile Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                DBS Patient Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dbs.quartiles.map((q, i) => (
                  <div key={q.name} className="flex items-center gap-3">
                    <div className="w-20 text-xs font-medium">{q.name}</div>
                    <div className="flex-1">
                      <Progress 
                        value={q.percentage} 
                        className="h-3"
                      />
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-xs font-bold">{q.percentage.toFixed(1)}%</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] w-24 justify-center">
                      {q.staffingRatio}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timeline & Publications */}
        <div className="space-y-4">
          {/* Research Timeline */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Research Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-3">
                  {TIMELINE.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex items-start gap-3 relative">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center z-10 shrink-0">
                        <span className="text-xs">{item.icon}</span>
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-primary">{item.year}</span>
                          <span className="text-xs font-medium text-foreground">{item.title}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patents & Publications */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Patents & Publications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Patents */}
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Intellectual Property
                </div>
                <div className="space-y-2">
                  {PATENTS.map((patent, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                      <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div className="flex-1">
                        <span className="text-xs font-medium">{patent.title}</span>
                        <span className="text-[10px] text-muted-foreground ml-2">
                          #{patent.number} ({patent.status})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publications */}
              <div>
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Publications & Presentations
                </div>
                <div className="space-y-1.5">
                  {PUBLICATIONS.slice(0, 3).map((pub, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Badge variant="outline" className="text-[8px] shrink-0 mt-0.5">
                        {pub.type.slice(0, 4)}
                      </Badge>
                      <div>
                        <span className="text-[10px] font-medium text-foreground">{pub.title}</span>
                        <span className="text-[9px] text-muted-foreground block">{pub.venue} • {pub.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border/30 text-center">
        <p className="text-[9px] text-muted-foreground">
          AIM-AHEAD CLINAQ Fellowship • Dr. Alexis Collier • Clinical Risk Intelligence Dashboard – Patent Pending
        </p>
      </div>
    </div>
  );
};

export default ResearchValidationSlide;
