import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Stethoscope, GraduationCap, Eye, ChevronDown, ChevronUp, Info, Brain, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type UserRole = 'nurse' | 'physician' | 'researcher';

interface RoleConfig {
  icon: React.ReactNode;
  label: string;
  description: string;
  detailLevel: 'simple' | 'clinical' | 'technical';
  features: string[];
}

const roleConfigs: Record<UserRole, RoleConfig> = {
  nurse: {
    icon: <Users className="w-5 h-5" />,
    label: 'Bedside Nurse',
    description: 'Action-focused explanations with immediate interventions',
    detailLevel: 'simple',
    features: ['Quick action items', 'Visual risk indicators', 'Plain language', 'Time-sensitive alerts'],
  },
  physician: {
    icon: <Stethoscope className="w-5 h-5" />,
    label: 'Physician',
    description: 'Clinical context with differential considerations',
    detailLevel: 'clinical',
    features: ['Clinical correlations', 'Diagnostic considerations', 'Evidence references', 'Treatment implications'],
  },
  researcher: {
    icon: <GraduationCap className="w-5 h-5" />,
    label: 'Researcher',
    description: 'Full statistical details and model interpretability',
    detailLevel: 'technical',
    features: ['SHAP values', 'Confidence intervals', 'Model coefficients', 'Feature interactions'],
  },
};

interface ExplanationContent {
  summary: string;
  details: string[];
  actions: string[];
  evidence?: string;
  statistical?: {
    shapValue: number;
    confidence: number;
    pValue?: number;
  };
}

const explanationsByRole: Record<UserRole, ExplanationContent> = {
  nurse: {
    summary: "This patient is at HIGH RISK for falls. The main concern is their recent mobility issues combined with sedating medications.",
    details: [
      "Mobility score dropped from 3 to 1 in the past 24 hours",
      "Currently on 2 sedating medications",
      "Has had a previous fall during this admission",
    ],
    actions: [
      "Activate bed alarm immediately",
      "Ensure call light is within reach",
      "Implement hourly rounding",
      "Consider 1:1 observation if risk increases",
    ],
  },
  physician: {
    summary: "Elevated fall risk (82%) driven by polypharmacy and acute mobility decline. Consider medication reconciliation and PT evaluation.",
    details: [
      "Mobility Assessment: Declined from independent (3) to requires assistance (1) over 24h—suggests acute deconditioning or medication effect",
      "Pharmacological Factors: Concurrent benzodiazepine and opioid use contributing to fall risk (OR 2.4, 95% CI: 1.8-3.2)",
      "Historical Risk: Previous fall on HD#3 increases recurrence probability by 45%",
      "Comorbidities: HTN, DM2, and CKD Stage 3 may contribute to orthostatic hypotension risk",
    ],
    actions: [
      "Review sedating medications for tapering opportunities",
      "Order orthostatic vital signs",
      "Consult PT for mobility evaluation and fall prevention plan",
      "Consider delirium screening (CAM-ICU)",
    ],
    evidence: "Based on AHRQ Fall Prevention Toolkit (2023) and institutional fall prediction model (AUC 0.89)",
  },
  researcher: {
    summary: "Multi-factor fall risk prediction with dominant SHAP contributions from mobility decline (ΔS=+0.23) and medication burden (ΔS=+0.18).",
    details: [
      "Primary Feature: mobility_score (SHAP: +0.234, 95% CI: 0.198-0.270, p<0.001)",
      "Secondary Feature: sedating_med_count (SHAP: +0.178, 95% CI: 0.142-0.214, p<0.001)",
      "Tertiary Feature: fall_history_flag (SHAP: +0.145, 95% CI: 0.112-0.178, p<0.001)",
      "Model: XGBoost ensemble with 500 trees, max_depth=6, trained on n=12,847 patient-days",
      "Calibration: Hosmer-Lemeshow χ²=8.2, p=0.41 (well-calibrated)",
      "Feature Interaction: mobility × sedating_meds shows synergistic effect (interaction SHAP: +0.067)",
    ],
    actions: [
      "Flag for retrospective outcome tracking (30-day fall occurrence)",
      "Include in model retraining cohort for continuous learning",
      "Document intervention for closed-loop feedback analysis",
    ],
    evidence: "Model performance: AUC-ROC 0.89 (0.87-0.91), Brier score 0.12, Net benefit at 70% threshold: +0.15",
    statistical: {
      shapValue: 0.234,
      confidence: 0.95,
      pValue: 0.001,
    },
  },
};

const shapDataByRole: Record<UserRole, { factor: string; value: number; color: string }[]> = {
  nurse: [
    { factor: 'Mobility Issues', value: 35, color: 'hsl(var(--destructive))' },
    { factor: 'Medications', value: 25, color: 'hsl(var(--destructive))' },
    { factor: 'Fall History', value: 20, color: 'hsl(var(--warning))' },
    { factor: 'Age Factor', value: 10, color: 'hsl(var(--warning))' },
    { factor: 'Other', value: 10, color: 'hsl(var(--muted))' },
  ],
  physician: [
    { factor: 'Mobility Decline (Δ24h)', value: 0.23, color: 'hsl(var(--destructive))' },
    { factor: 'Sedating Medications', value: 0.18, color: 'hsl(var(--destructive))' },
    { factor: 'Prior Fall Event', value: 0.15, color: 'hsl(var(--warning))' },
    { factor: 'Age ≥65', value: 0.08, color: 'hsl(var(--warning))' },
    { factor: 'Comorbidity Index', value: 0.06, color: 'hsl(var(--muted))' },
  ],
  researcher: [
    { factor: 'mobility_score', value: 0.234, color: 'hsl(var(--destructive))' },
    { factor: 'sedating_med_count', value: 0.178, color: 'hsl(var(--destructive))' },
    { factor: 'fall_history_flag', value: 0.145, color: 'hsl(var(--warning))' },
    { factor: 'age_normalized', value: 0.082, color: 'hsl(var(--warning))' },
    { factor: 'charlson_index', value: 0.058, color: 'hsl(var(--muted))' },
    { factor: 'mobility×meds_interaction', value: 0.067, color: 'hsl(var(--chart-4))' },
  ],
};

export const ContextAwareExplanations = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('nurse');
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');

  const config = roleConfigs[selectedRole];
  const explanation = explanationsByRole[selectedRole];
  const shapData = shapDataByRole[selectedRole];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Context-Aware Explanations
          </h2>
          <p className="text-sm text-muted-foreground">
            Explanations that adapt complexity based on user role
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          Patent Claim #6
        </Badge>
      </div>

      {/* Role Selector */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.keys(roleConfigs) as UserRole[]).map((role) => {
          const cfg = roleConfigs[role];
          const isSelected = selectedRole === role;
          
          return (
            <Card
              key={role}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'bg-primary/10 border-primary/50 ring-2 ring-primary/20'
                  : 'bg-secondary/30 border-border hover:bg-secondary/50'
              }`}
              onClick={() => setSelectedRole(role)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
                    {cfg.icon}
                  </div>
                  <span className="font-medium">{cfg.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{cfg.description}</p>
                <div className="flex flex-wrap gap-1">
                  {cfg.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-[10px]">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Explanation Content */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Text Explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Explanation for {config.label}
              <Badge variant="outline" className="text-xs ml-2">
                {config.detailLevel} detail
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div
              className="p-3 bg-primary/10 rounded-lg border border-primary/30 cursor-pointer"
              onClick={() => setExpandedSection(expandedSection === 'summary' ? null : 'summary')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-primary uppercase">Summary</span>
                {expandedSection === 'summary' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              {expandedSection === 'summary' && (
                <p className="text-sm">{explanation.summary}</p>
              )}
            </div>

            {/* Details */}
            <div
              className="p-3 bg-secondary/30 rounded-lg border border-border cursor-pointer"
              onClick={() => setExpandedSection(expandedSection === 'details' ? null : 'details')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase">Key Factors</span>
                {expandedSection === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              {expandedSection === 'details' && (
                <ul className="space-y-2">
                  {explanation.details.map((detail, i) => (
                    <li key={i} className="text-xs flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Actions */}
            <div
              className="p-3 bg-success/10 rounded-lg border border-success/30 cursor-pointer"
              onClick={() => setExpandedSection(expandedSection === 'actions' ? null : 'actions')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-success uppercase">Recommended Actions</span>
                {expandedSection === 'actions' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              {expandedSection === 'actions' && (
                <ul className="space-y-2">
                  {explanation.actions.map((action, i) => (
                    <li key={i} className="text-xs flex items-start gap-2">
                      <span className="text-success font-bold">{i + 1}.</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Evidence (for physician and researcher) */}
            {explanation.evidence && (
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase">Evidence Base</span>
                </div>
                <p className="text-xs text-muted-foreground">{explanation.evidence}</p>
              </div>
            )}

            {/* Statistical details (researcher only) */}
            {explanation.statistical && (
              <div className="p-3 bg-chart-4/10 rounded-lg border border-chart-4/30">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-chart-4" />
                  <span className="text-xs font-semibold uppercase">Statistical Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Primary SHAP:</span>
                    <span className="ml-1 font-mono">{explanation.statistical.shapValue.toFixed(3)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CI:</span>
                    <span className="ml-1 font-mono">{(explanation.statistical.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">p-value:</span>
                    <span className="ml-1 font-mono">&lt;{explanation.statistical.pValue}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Visual SHAP */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Feature Contributions ({config.detailLevel} view)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(v) => selectedRole === 'nurse' ? `${v}%` : v.toFixed(2)}
                  />
                  <YAxis dataKey="factor" type="category" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [
                      selectedRole === 'nurse' ? `${value}%` : value.toFixed(3),
                      'Contribution'
                    ]}
                  />
                  <Bar dataKey="value">
                    {shapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
              <p className="text-xs text-muted-foreground">
                <strong>Innovation:</strong> Same underlying model, different explanation complexity. 
                This ensures appropriate information density for each user's decision-making context.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
