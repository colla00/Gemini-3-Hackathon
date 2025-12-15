import { useState } from 'react';
import { 
  Award, CheckCircle2, FileText, Download, BarChart3, 
  Activity, Timer, TrendingDown, Brain, Shield, Lightbulb,
  ChevronDown, ChevronRight, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const PATENT_INFO = {
  applicationNumber: '63/932,953',
  filingDate: 'December 2024',
  title: 'AI-Powered Nursing-Sensitive Outcome Prediction and Clinical Decision Support System',
  inventor: 'Dr. Alexis Collier',
  status: 'Patent Pending',
};

interface ClaimMapping {
  claimNumber: number;
  claimTitle: string;
  claimType: 'independent' | 'dependent';
  description: string;
  implementedFeatures: {
    feature: string;
    component: string;
    location: string;
  }[];
  icon: typeof BarChart3;
  status: 'implemented' | 'partial' | 'planned';
}

const claimMappings: ClaimMapping[] = [
  {
    claimNumber: 1,
    claimTitle: 'Real-Time SHAP Integration',
    claimType: 'independent',
    description: 'Novel integration of SHapley Additive exPlanations (SHAP) with clinical workflows for real-time, interpretable risk attribution in healthcare settings.',
    implementedFeatures: [
      { feature: 'SHAP waterfall chart visualization', component: 'ShapChart.tsx', location: 'Patient Detail View' },
      { feature: 'Factor contribution display (+/-)', component: 'PatientDetail.tsx', location: 'Risk Assessment Card' },
      { feature: 'Workflow-aware clinical insights', component: 'PatientDetail.tsx', location: 'Insight Box' },
      { feature: 'Color-coded risk/protective factors', component: 'ShapExplainability.tsx', location: 'Deep Dive View' },
    ],
    icon: BarChart3,
    status: 'implemented',
  },
  {
    claimNumber: 2,
    claimTitle: 'Multi-Outcome Risk Prediction',
    claimType: 'independent',
    description: 'Simultaneous prediction and monitoring of multiple nursing-sensitive outcomes (Falls, HAPI, CAUTI) using ensemble machine learning with explainable AI components.',
    implementedFeatures: [
      { feature: 'Falls risk prediction display', component: 'PatientCard.tsx', location: 'Dashboard' },
      { feature: 'Pressure Injury (HAPI) tracking', component: 'PatientCard.tsx', location: 'Dashboard' },
      { feature: 'CAUTI risk monitoring', component: 'PatientCard.tsx', location: 'Dashboard' },
      { feature: 'Device Complication tracking', component: 'PatientCard.tsx', location: 'Dashboard' },
      { feature: 'Risk type filtering', component: 'FilterBar.tsx', location: 'Dashboard' },
    ],
    icon: Activity,
    status: 'implemented',
  },
  {
    claimNumber: 3,
    claimTitle: 'Clinical Workflow Optimization',
    claimType: 'independent',
    description: 'AI-guided intervention suggestion system that integrates with existing clinical workflows and provides evidence-based recommendations.',
    implementedFeatures: [
      { feature: 'Suggested action pathways', component: 'SuggestedActions.tsx', location: 'Patient Detail View' },
      { feature: 'Priority-ranked interventions', component: 'SuggestedActions.tsx', location: 'Patient Detail View' },
      { feature: 'Intervention countdown timers', component: 'InterventionTimer.tsx', location: 'Patient Detail View' },
      { feature: 'Clinical workflow bar', component: 'ClinicalWorkflowBar.tsx', location: 'Dashboard Header' },
      { feature: 'Shift handoff integration', component: 'HandoffReport.tsx', location: 'Reports' },
    ],
    icon: Timer,
    status: 'implemented',
  },
  {
    claimNumber: 4,
    claimTitle: 'Intervention Efficacy Tracking',
    claimType: 'independent',
    description: 'Novel methodology for measuring and validating the effectiveness of AI-guided clinical interventions through continuous outcome monitoring.',
    implementedFeatures: [
      { feature: 'Before/after risk comparison', component: 'EfficacyBadge.tsx', location: 'Patient Detail View' },
      { feature: 'Efficacy summary panel', component: 'EfficacyBadge.tsx', location: 'Patient Detail View' },
      { feature: 'Closed-loop feedback visualization', component: 'ClosedLoopFeedback.tsx', location: 'Quality View' },
      { feature: 'Intervention outcome quantification', component: 'InterventionTracking.tsx', location: 'Quality View' },
    ],
    icon: TrendingDown,
    status: 'implemented',
  },
  {
    claimNumber: 5,
    claimTitle: 'Confidence-Based Risk Stratification',
    claimType: 'independent',
    description: 'Dynamic risk scoring system with integrated confidence intervals and model uncertainty quantification for clinical decision support.',
    implementedFeatures: [
      { feature: '95% confidence interval display', component: 'PatientCard.tsx', location: 'Dashboard Cards' },
      { feature: 'Confidence bands on trend charts', component: 'RiskTrendChart.tsx', location: 'Patient Views' },
      { feature: 'Multi-horizon forecasting (4h-48h)', component: 'RiskTrendChart.tsx', location: 'Patient Detail' },
      { feature: 'Uncertainty visualization', component: 'PatientDetail.tsx', location: 'Risk Score Card' },
    ],
    icon: Brain,
    status: 'implemented',
  },
];

export const PatentFeatureMapping = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePatentDocument = () => {
    setIsGenerating(true);

    const documentContent = `
================================================================================
PATENT FEATURE MAPPING DOCUMENT
U.S. Provisional Patent Application No. ${PATENT_INFO.applicationNumber}
================================================================================

TITLE: ${PATENT_INFO.title}

INVENTOR: ${PATENT_INFO.inventor}
FILING DATE: ${PATENT_INFO.filingDate}
STATUS: ${PATENT_INFO.status}

================================================================================
CLAIM-TO-IMPLEMENTATION MAPPING
================================================================================

${claimMappings.map(claim => `
CLAIM ${claim.claimNumber}: ${claim.claimTitle.toUpperCase()}
Type: ${claim.claimType === 'independent' ? 'Independent Claim' : 'Dependent Claim'}
Status: ${claim.status.toUpperCase()}

Description:
${claim.description}

Implemented Features:
${claim.implementedFeatures.map((f, i) => `  ${i + 1}. ${f.feature}
     Component: ${f.component}
     Location: ${f.location}`).join('\n')}
`).join('\n--------------------------------------------------------------------------------\n')}

================================================================================
IMPLEMENTATION SUMMARY
================================================================================

Total Claims Mapped: ${claimMappings.length}
Fully Implemented: ${claimMappings.filter(c => c.status === 'implemented').length}
Partially Implemented: ${claimMappings.filter(c => c.status === 'partial').length}
Planned: ${claimMappings.filter(c => c.status === 'planned').length}

Total Features Documented: ${claimMappings.reduce((sum, c) => sum + c.implementedFeatures.length, 0)}

================================================================================
INTELLECTUAL PROPERTY NOTICE
================================================================================

Copyright © ${new Date().getFullYear()} ${PATENT_INFO.inventor}. All Rights Reserved.

This document and the technology it describes are protected under U.S. patent law.
Unauthorized reproduction, distribution, or commercial use is prohibited.

Clinical Risk Intelligence Dashboard – Patent Pending
Protected Design – Do Not Copy

================================================================================
Document Generated: ${new Date().toLocaleString()}
================================================================================
    `.trim();

    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Patent_Feature_Mapping_${PATENT_INFO.applicationNumber.replace('/', '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  const implementedCount = claimMappings.filter(c => c.status === 'implemented').length;
  const totalFeatures = claimMappings.reduce((sum, c) => sum + c.implementedFeatures.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-accent/20 border border-accent/30">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-xl">Patent Feature Mapping</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  U.S. Provisional Patent Application No. {PATENT_INFO.applicationNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium">
                {PATENT_INFO.status}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <div className="text-3xl font-bold text-primary">{claimMappings.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Patent Claims</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <div className="text-3xl font-bold text-risk-low">{implementedCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Fully Implemented</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <div className="text-3xl font-bold text-primary">{totalFeatures}</div>
              <div className="text-xs text-muted-foreground mt-1">Features Mapped</div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <div className="text-3xl font-bold text-accent">100%</div>
              <div className="text-xs text-muted-foreground mt-1">Coverage</div>
            </div>
          </div>

          <Button 
            onClick={generatePatentDocument}
            disabled={isGenerating}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Download Patent Feature Mapping Document'}
          </Button>
        </CardContent>
      </Card>

      {/* Claims Accordion */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Claim-to-Implementation Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-3">
            {claimMappings.map((claim) => (
              <AccordionItem 
                key={claim.claimNumber} 
                value={`claim-${claim.claimNumber}`}
                className="border border-border/50 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-secondary/30 [&[data-state=open]]:bg-secondary/50">
                  <div className="flex items-center gap-3 text-left">
                    <div className={cn(
                      "p-2 rounded-lg",
                      claim.status === 'implemented' ? "bg-risk-low/10" : "bg-risk-medium/10"
                    )}>
                      <claim.icon className={cn(
                        "w-4 h-4",
                        claim.status === 'implemented' ? "text-risk-low" : "text-risk-medium"
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          Claim {claim.claimNumber}: {claim.claimTitle}
                        </span>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-medium",
                          claim.claimType === 'independent' 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {claim.claimType}
                        </span>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-medium",
                          claim.status === 'implemented' 
                            ? "bg-risk-low/20 text-risk-low" 
                            : "bg-risk-medium/20 text-risk-medium"
                        )}>
                          {claim.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {claim.implementedFeatures.length} features implemented
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="pt-2 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {claim.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                        Implemented Features
                      </h4>
                      {claim.implementedFeatures.map((feature, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
                        >
                          <CheckCircle2 className="w-4 h-4 text-risk-low mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {feature.feature}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {feature.component}
                              </span>
                              <span>•</span>
                              <span>{feature.location}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* IP Notice Footer */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">Intellectual Property Protected</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {PATENT_INFO.inventor} | {PATENT_INFO.title}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          U.S. Provisional Patent Application No. {PATENT_INFO.applicationNumber} | {PATENT_INFO.status}
        </p>
      </div>
    </div>
  );
};