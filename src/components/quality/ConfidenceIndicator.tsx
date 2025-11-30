import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';

interface ConfidenceIndicatorProps {
  confidence: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ConfidenceIndicator = ({ confidence, showLabel = true, size = 'sm' }: ConfidenceIndicatorProps) => {
  // Determine confidence level
  const level = confidence >= 85 ? 'high' : confidence >= 70 ? 'medium' : 'low';
  
  const colors = {
    high: 'text-risk-low bg-risk-low/10',
    medium: 'text-risk-medium bg-risk-medium/10',
    low: 'text-muted-foreground bg-muted/20',
  };
  
  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-1',
  };
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1 rounded font-medium",
      colors[level],
      sizeClasses[size]
    )}>
      {showLabel && <span className="opacity-70">Conf:</span>}
      <span>{confidence}%</span>
    </div>
  );
};

// Tooltip version for more context
export const ConfidenceTooltip = ({ confidence }: { confidence: number }) => {
  const level = confidence >= 85 ? 'High' : confidence >= 70 ? 'Medium' : 'Low';
  
  return (
    <div className="group relative inline-flex items-center">
      <ConfidenceIndicator confidence={confidence} />
      <HelpCircle className="w-3 h-3 ml-1 text-muted-foreground cursor-help" />
      
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
        <div className="glass-card rounded px-2 py-1.5 text-[10px] whitespace-nowrap border border-border/30">
          <span className="text-foreground font-medium">Model Confidence: {level}</span>
          <p className="text-muted-foreground mt-0.5">
            {confidence >= 85 
              ? 'Prediction reliability is high'
              : confidence >= 70 
                ? 'Review contributing factors'
                : 'Consider additional assessment'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
