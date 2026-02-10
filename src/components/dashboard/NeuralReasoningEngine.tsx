import { useState } from 'react';
import { Brain, BookOpen, GitBranch, ArrowRight, Sparkles, FileText, Lightbulb, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { PatentBadge } from '@/components/quality/PatentNotice';

interface ReasoningStep {
  id: number;
  stage: string;
  description: string;
  dataPoints: string[];
  confidence: number;
}

interface LiteratureMatch {
  title: string;
  source: string;
  similarity: number;
  year: number;
}

interface Counterfactual {
  change: string;
  originalValue: string;
  newValue: string;
  outcomeChange: string;
}

const sampleReasoningChain: ReasoningStep[] = [
  { id: 1, stage: 'Patient Context', description: '67-year-old male with CHF, CKD Stage III', dataPoints: ['Age: 67', 'Dx: CHF, CKD'], confidence: 0.98 },
  { id: 2, stage: 'Data Identification', description: 'Creatinine increased 1.8 → 2.4 mg/dL over 48h', dataPoints: ['Cr: 2.4 (↑33%)', 'BUN: 42'], confidence: 0.95 },
  { id: 3, stage: 'Pattern Recognition', description: 'Pattern suggests AKI on CKD baseline', dataPoints: ['Trend: Rising', 'RIFLE: Risk'], confidence: 0.89 },
  { id: 4, stage: 'Differential Analysis', description: 'Nephrotoxic agents: Vancomycin therapy active', dataPoints: ['Vanco trough: 22', 'Day 5 therapy'], confidence: 0.92 },
  { id: 5, stage: 'Risk Stratification', description: 'High risk for worsening renal function', dataPoints: ['DBS: 78', 'Falls: Moderate'], confidence: 0.87 },
  { id: 6, stage: 'Recommendation', description: 'Consider dose adjustment, nephrology consult', dataPoints: ['Action: Adjust', 'Priority: High'], confidence: 0.91 },
];

const literatureMatches: LiteratureMatch[] = [
  { title: 'Vancomycin nephrotoxicity in critically ill patients', source: 'AJKD', similarity: 0.89, year: 2023 },
  { title: 'AKI risk stratification using RIFLE criteria', source: 'Kidney Int', similarity: 0.84, year: 2022 },
  { title: 'Drug-induced kidney injury in hospital settings', source: 'NEJM', similarity: 0.81, year: 2024 },
];

const counterfactuals: Counterfactual[] = [
  { change: 'Creatinine', originalValue: '2.4', newValue: '2.0', outcomeChange: 'Risk → Moderate (↓15%)' },
  { change: 'Vanco trough', originalValue: '22', newValue: '15', outcomeChange: 'Alert suppressed' },
  { change: 'Age', originalValue: '67', newValue: '55', outcomeChange: 'Risk → Low (↓22%)' },
];

// Simulated attention weights for saliency map
const attentionWeights = [
  { feature: 'Creatinine Change', weight: 0.28, category: 'Labs' },
  { feature: 'Vancomycin Level', weight: 0.22, category: 'Medications' },
  { feature: 'CKD History', weight: 0.18, category: 'History' },
  { feature: 'Age', weight: 0.12, category: 'Demographics' },
  { feature: 'CHF Diagnosis', weight: 0.10, category: 'History' },
  { feature: 'BUN Level', weight: 0.06, category: 'Labs' },
  { feature: 'Fluid Balance', weight: 0.04, category: 'Vitals' },
];

export const NeuralReasoningEngine = () => {
  const [activeTab, setActiveTab] = useState<'chain' | 'literature' | 'counterfactual' | 'attention'>('chain');
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  return (
    <TooltipProvider>
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10 border border-chart-2/20">
                <Brain className="w-4 h-4 text-chart-2" />
              </div>
              <div>
                <CardTitle className="text-base">Neural Reasoning Engine</CardTitle>
                <PatentBadge contextPatent="unified" className="mt-1" />
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] bg-chart-2/10 border-chart-2/30 text-chart-2">
              94% Expert Agreement
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-1 bg-secondary/30 rounded-lg p-1">
            {[
              { id: 'chain', label: 'Reasoning Chain', icon: GitBranch },
              { id: 'literature', label: 'Literature', icon: BookOpen },
              { id: 'counterfactual', label: 'What-If', icon: Lightbulb },
              { id: 'attention', label: 'Attention Map', icon: Sparkles },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-medium transition-all",
                  activeTab === id
                    ? "bg-chart-2 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'chain' && (
              <motion.div
                key="chain"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <p className="text-[10px] text-muted-foreground mb-3">
                  6-stage clinical reasoning pathway mirroring expert decision-making
                </p>
                {sampleReasoningChain.map((step, idx) => (
                  <Collapsible
                    key={step.id}
                    open={expandedStep === step.id}
                    onOpenChange={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className={cn(
                        "flex items-center gap-3 p-2.5 rounded-lg border transition-all",
                        expandedStep === step.id
                          ? "bg-chart-2/10 border-chart-2/30"
                          : "bg-secondary/30 border-border/40 hover:border-chart-2/20"
                      )}>
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                          expandedStep === step.id ? "bg-chart-2 text-white" : "bg-secondary text-muted-foreground"
                        )}>
                          {step.id}
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-xs font-medium text-foreground">{step.stage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={step.confidence * 100} className="w-12 h-1.5" />
                          <ChevronDown className={cn(
                            "w-3.5 h-3.5 text-muted-foreground transition-transform",
                            expandedStep === step.id && "rotate-180"
                          )} />
                        </div>
                        {idx < sampleReasoningChain.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-muted-foreground absolute right-[-16px] hidden" />
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="ml-9 mt-1 p-2 bg-secondary/20 rounded-lg border border-border/30"
                      >
                        <p className="text-xs text-foreground mb-2">{step.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {step.dataPoints.map((dp, i) => (
                            <Badge key={i} variant="secondary" className="text-[9px] bg-chart-2/10 text-chart-2">
                              {dp}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </motion.div>
            )}

            {activeTab === 'literature' && (
              <motion.div
                key="literature"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <p className="text-[10px] text-muted-foreground mb-3">
                  BioBERT correlation against 2.5M+ clinical papers (top-5 shown)
                </p>
                {literatureMatches.map((match, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/40 hover:border-chart-2/30 transition-all"
                  >
                    <div className="p-1.5 rounded bg-chart-2/10">
                      <FileText className="w-3.5 h-3.5 text-chart-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{match.title}</p>
                      <p className="text-[10px] text-muted-foreground">{match.source} · {match.year}</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-[9px] bg-chart-2/10 border-chart-2/30 text-chart-2">
                          {(match.similarity * 100).toFixed(0)}%
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>Semantic similarity score</TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'counterfactual' && (
              <motion.div
                key="counterfactual"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <p className="text-[10px] text-muted-foreground mb-3">
                  "What-if" analysis: minimal changes to alter alert decision
                </p>
                {counterfactuals.map((cf, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-secondary/30 border border-border/40"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-3.5 h-3.5 text-chart-1" />
                      <span className="text-xs font-medium text-foreground">If {cf.change} changed:</span>
                    </div>
                    <div className="flex items-center gap-3 ml-5">
                      <div className="text-center">
                        <div className="text-sm font-bold text-risk-high">{cf.originalValue}</div>
                        <div className="text-[9px] text-muted-foreground">Current</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <div className="text-center">
                        <div className="text-sm font-bold text-risk-low">{cf.newValue}</div>
                        <div className="text-[9px] text-muted-foreground">Modified</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline" className="text-[10px] bg-risk-low/10 border-risk-low/30 text-risk-low">
                        {cf.outcomeChange}
                      </Badge>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'attention' && (
              <motion.div
                key="attention"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <p className="text-[10px] text-muted-foreground mb-3">
                  Aggregated attention weights from 12-layer, 16-head transformer
                </p>
                <div className="space-y-2">
                  {attentionWeights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-28 text-xs text-foreground truncate">{item.feature}</div>
                      <div className="flex-1 relative">
                        <div className="h-4 bg-secondary/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.weight * 100}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={cn(
                              "h-full rounded-full",
                              item.weight > 0.2 ? "bg-gradient-to-r from-chart-2 to-chart-1" :
                              item.weight > 0.1 ? "bg-chart-2" : "bg-chart-2/50"
                            )}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-right text-xs font-medium text-foreground">
                        {(item.weight * 100).toFixed(0)}%
                      </div>
                      <Badge variant="secondary" className="text-[9px] w-20 justify-center">
                        {item.category}
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-muted-foreground text-center mt-2">
                  Aᵢ = Σₗ,ₕ(wₗ,ₕ × αₗ,ₕ,ᵢ) - weighted aggregation across all layers and heads
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
