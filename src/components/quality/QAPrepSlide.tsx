import { useState } from 'react';
import { 
  MessageSquare, ChevronDown, ChevronUp, Lightbulb, 
  AlertTriangle, Shield, Brain, DollarSign, Users, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QAItem {
  id: string;
  category: string;
  categoryColor: string;
  question: string;
  suggestedResponse: string;
  keyPoints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const anticipatedQuestions: QAItem[] = [
  {
    id: 'validation',
    category: 'Validation',
    categoryColor: 'bg-blue-500',
    question: 'What validation studies have you completed?',
    suggestedResponse: 'This is currently a research prototype. We have designed the system based on clinical workflow analysis and literature review, but prospective validation studies are planned for 2026. The metrics shown today are targets and illustrative examples, not completed study results.',
    keyPoints: [
      'Research prototype - not yet validated',
      'IRB submission in preparation',
      'Multi-site study planned for 2026',
      'All metrics are projections/targets',
    ],
    difficulty: 'hard',
  },
  {
    id: 'accuracy',
    category: 'Model Performance',
    categoryColor: 'bg-purple-500',
    question: 'What is the model accuracy? How do you handle false positives?',
    suggestedResponse: 'Our target is AUC of 0.85+ with balanced sensitivity and specificity around 80%. We use calibrated probabilities so a 70% risk means 70 out of 100 similar patients would have the event. Alert thresholds are adjustable to balance sensitivity vs alert fatigue for each unit.',
    keyPoints: [
      'Target AUC: 0.85+',
      'Calibrated probabilities, not just classifications',
      'Adjustable thresholds per unit',
      'These are design targets, not validated results',
    ],
    difficulty: 'medium',
  },
  {
    id: 'ehr-integration',
    category: 'Technical',
    categoryColor: 'bg-emerald-500',
    question: 'How does this integrate with our EHR system?',
    suggestedResponse: 'The system is designed for standards-based integration using HL7 FHIR R4 and HL7v2 protocols. This means compatibility with any compliant EHR system. Implementation would involve working with your IT team to establish the data feed and on-premise deployment.',
    keyPoints: [
      'HL7 FHIR R4 and HL7v2 standards',
      'Works with any compliant EHR',
      'On-premise deployment option',
      'IT partnership required for implementation',
    ],
    difficulty: 'easy',
  },
  {
    id: 'workflow',
    category: 'Clinical Workflow',
    categoryColor: 'bg-amber-500',
    question: 'How does this fit into nursing workflow without adding burden?',
    suggestedResponse: 'The system is designed as decision support, not additional documentation. Nurses review alerts and suggested interventions but retain full clinical authority. We target 3-minute average alert-to-awareness time. The goal is to surface relevant information, not create new charting requirements.',
    keyPoints: [
      'No additional documentation required',
      'Decision support, not automation',
      'Nurse retains clinical authority',
      'Information surfacing, not data entry',
    ],
    difficulty: 'medium',
  },
  {
    id: 'cost',
    category: 'Implementation',
    categoryColor: 'bg-red-500',
    question: 'What does implementation cost? What is the ROI timeline?',
    suggestedResponse: 'Implementation costs vary by institution size and IT infrastructure. Our projections suggest a 3-5x ROI based on prevented adverse events, with break-even typically in the first year. I would be happy to discuss a more detailed analysis for your specific context.',
    keyPoints: [
      'Varies by institution size',
      'Projected 3-5x ROI',
      'Break-even typically year 1',
      'Happy to do institution-specific analysis',
    ],
    difficulty: 'medium',
  },
  {
    id: 'bias',
    category: 'Ethics',
    categoryColor: 'bg-pink-500',
    question: 'How do you address algorithmic bias in the model?',
    suggestedResponse: 'This is a critical consideration in our design. We plan to evaluate model performance across demographic subgroups during validation. The SHAP explainability allows us to detect if protected characteristics are inappropriately influencing predictions. Ongoing monitoring for disparate impact is part of our planned governance framework.',
    keyPoints: [
      'Subgroup performance evaluation planned',
      'SHAP enables bias detection',
      'Ongoing monitoring planned',
      'Governance framework in development',
    ],
    difficulty: 'hard',
  },
  {
    id: 'fda',
    category: 'Regulatory',
    categoryColor: 'bg-slate-500',
    question: 'Is this FDA approved? What is the regulatory pathway?',
    suggestedResponse: 'Clinical decision support software may be exempt from FDA regulation depending on how it is used. We are exploring the regulatory pathway and working to ensure the system qualifies as a non-device CDS under the 21st Century Cures Act. Final regulatory status will depend on specific implementation and claims.',
    keyPoints: [
      'Exploring regulatory pathway',
      'May qualify as non-device CDS',
      '21st Century Cures Act considerations',
      'Depends on implementation/claims',
    ],
    difficulty: 'hard',
  },
  {
    id: 'collaboration',
    category: 'Next Steps',
    categoryColor: 'bg-cyan-500',
    question: 'How can our institution get involved or collaborate?',
    suggestedResponse: 'We are actively seeking validation partners for our planned multi-site study. This could involve pilot implementations, data sharing agreements, or research collaboration. Please reach out via email and we can discuss what partnership might look like for your institution.',
    keyPoints: [
      'Seeking validation partners',
      'Pilot implementation opportunities',
      'Research collaboration possible',
      'Contact: info@alexiscollier.com',
    ],
    difficulty: 'easy',
  },
];

const difficultyColors = {
  easy: 'bg-risk-low/20 text-risk-low',
  medium: 'bg-risk-medium/20 text-risk-medium',
  hard: 'bg-risk-high/20 text-risk-high',
};

export const QAPrepSlide = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-amber-500/5 p-6 flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-medium mb-2">
          <Shield className="w-3 h-3" />
          PRESENTER ONLY - NOT VISIBLE TO AUDIENCE
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Q&A Preparation Guide
        </h1>
        <p className="text-sm text-muted-foreground">
          Anticipated questions with suggested responses
        </p>
      </div>

      {/* Questions Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 gap-3">
          {anticipatedQuestions.map((item) => {
            const isExpanded = expandedId === item.id;
            
            return (
              <Card 
                key={item.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isExpanded && "col-span-2 border-primary"
                )}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Badge className={cn("text-[9px] text-white", item.categoryColor)}>
                      {item.category}
                    </Badge>
                    <Badge variant="outline" className={cn("text-[9px]", difficultyColors[item.difficulty])}>
                      {item.difficulty}
                    </Badge>
                    <div className="flex-1" />
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Question */}
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-foreground">
                      {item.question}
                    </p>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-3 space-y-3 animate-fade-in">
                      {/* Suggested Response */}
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-primary">Suggested Response</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">
                          {item.suggestedResponse}
                        </p>
                      </div>

                      {/* Key Points */}
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2">
                          Key Points to Hit:
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {item.keyPoints.map((point, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 rounded bg-secondary/50 text-xs text-foreground"
                            >
                              <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                {idx + 1}
                              </span>
                              {point}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Reference Footer */}
      <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-500">Remember</span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-[11px] text-muted-foreground">
          <div>• This is a research prototype</div>
          <div>• Metrics are targets, not results</div>
          <div>• Validation studies planned</div>
          <div>• Contact: info@alexiscollier.com</div>
        </div>
      </div>
    </div>
  );
};
