import { useState } from 'react';
import { FileText, Download, Award, Shield, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PATENT_APP_NUMBER = '63/932,953';
const FILING_DATE = 'December 2024';

export const PatentNotice = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePatentNoticePDF = () => {
    setIsGenerating(true);
    
    // Create patent notice content
    const patentContent = `
PATENT NOTICE
U.S. Provisional Patent Application No. ${PATENT_APP_NUMBER}

================================================================================

TITLE: NSO Quality Dashboard - AI-Powered Nursing-Sensitive Outcome Prediction 
       and Clinical Decision Support System

FILING DATE: ${FILING_DATE}

APPLICATION STATUS: Patent Pending

================================================================================

NOTICE OF PROPRIETARY RIGHTS

This technology, including but not limited to the methodologies, algorithms, 
user interfaces, data processing techniques, and clinical decision support 
features demonstrated herein, is protected under U.S. patent law.

The following innovations are covered by this patent application:

1. REAL-TIME SHAP INTEGRATION
   Novel integration of SHapley Additive exPlanations (SHAP) with clinical 
   workflows for real-time, interpretable risk attribution in healthcare 
   settings.

2. MULTI-OUTCOME RISK PREDICTION
   Simultaneous prediction and monitoring of multiple nursing-sensitive 
   outcomes (Falls, HAPI, CAUTI) using ensemble machine learning with 
   explainable AI components.

3. CLINICAL WORKFLOW OPTIMIZATION
   AI-guided intervention suggestion system that integrates with existing 
   clinical workflows and provides evidence-based recommendations.

4. INTERVENTION EFFICACY TRACKING
   Novel methodology for measuring and validating the effectiveness of 
   AI-guided clinical interventions through continuous outcome monitoring.

5. CONFIDENCE-BASED RISK STRATIFICATION
   Dynamic risk scoring system with integrated confidence intervals and 
   model uncertainty quantification for clinical decision support.

================================================================================

LEGAL DISCLAIMER

Any unauthorized reproduction, distribution, modification, or use of this 
technology or its associated documentation without prior written consent 
from the patent holder(s) may result in legal action.

This patent notice accompanies all demonstrations, presentations, and 
documentation related to the NSO Quality Dashboard research prototype.

================================================================================

FOR LICENSING INQUIRIES:

Contact: Stanford AI+HEALTH Research Program
Reference: U.S. Provisional Patent App. No. ${PATENT_APP_NUMBER}

================================================================================

This document was auto-generated on: ${new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}

CONFIDENTIAL - RESEARCH PROTOTYPE - NOT FOR CLINICAL USE
    `.trim();

    // Create and download text file (can be converted to PDF by user)
    const blob = new Blob([patentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Patent_Notice_${PATENT_APP_NUMBER.replace('/', '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsGenerating(false);
  };

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            <CardTitle className="text-base">Patent Documentation</CardTitle>
          </div>
          <span className="text-xs text-accent font-medium px-2 py-0.5 rounded bg-accent/20 border border-accent/30">
            U.S. Prov. Pat. App. {PATENT_APP_NUMBER}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-medium block text-foreground">IP Protected</span>
              <span className="text-muted-foreground">Patent pending status</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-medium block text-foreground">Novel Methods</span>
              <span className="text-muted-foreground">5 key innovations</span>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded bg-background/50 border border-border/30">
            <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-medium block text-foreground">Filed</span>
              <span className="text-muted-foreground">{FILING_DATE}</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded bg-muted/20 border border-border/30 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Covered Innovations:</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Real-time SHAP integration for clinical workflows</li>
            <li>Multi-outcome NSO risk prediction system</li>
            <li>AI-guided intervention suggestion framework</li>
            <li>Intervention efficacy tracking methodology</li>
            <li>Confidence-based risk stratification</li>
          </ul>
        </div>

        <Button 
          onClick={generatePatentNoticePDF} 
          disabled={isGenerating}
          variant="outline"
          className="w-full border-accent/30 text-accent hover:bg-accent/10"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Download Patent Notice'}
        </Button>

        <p className="text-[10px] text-center text-muted-foreground">
          Attach this notice to all exported reports and presentations
        </p>
      </CardContent>
    </Card>
  );
};

export const PatentBadge = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded bg-accent/10 border border-accent/30 ${className}`}>
    <Award className="w-3 h-3 text-accent" />
    <span className="text-[10px] text-accent font-medium">
      U.S. Pat. App. 63/932,953
    </span>
  </div>
);
