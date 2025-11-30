import { cn } from '@/lib/utils';
import { BookOpen, Users, Brain, Workflow, CheckCircle } from 'lucide-react';
import type { ViewType } from '@/hooks/useAutoDemo';

interface Chapter {
  id: ViewType;
  label: string;
  academicLabel: string;
  icon: React.ReactNode;
  duration: string;
}

const chapters: Chapter[] = [
  { 
    id: 'dashboard', 
    label: 'Overview', 
    academicLabel: 'System Architecture',
    icon: <BookOpen className="w-3 h-3" />,
    duration: '~2 min'
  },
  { 
    id: 'patients', 
    label: 'Patient Worklist', 
    academicLabel: 'Risk Stratification',
    icon: <Users className="w-3 h-3" />,
    duration: '~1.5 min'
  },
  { 
    id: 'shap', 
    label: 'Risk Attribution', 
    academicLabel: 'Explainable AI',
    icon: <Brain className="w-3 h-3" />,
    duration: '~2 min'
  },
  { 
    id: 'workflow', 
    label: 'Workflow Demo', 
    academicLabel: 'Clinical Validation',
    icon: <Workflow className="w-3 h-3" />,
    duration: '~1.5 min'
  },
];

interface PresentationTimelineProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  completedViews: ViewType[];
  isAcademicMode?: boolean;
}

export const PresentationTimeline = ({
  currentView,
  onNavigate,
  completedViews,
  isAcademicMode = true,
}: PresentationTimelineProps) => {
  const currentIndex = chapters.findIndex(c => c.id === currentView);
  
  return (
    <div className="fixed top-20 left-4 z-50 print:hidden">
      <div className="bg-background/90 border border-border/30 rounded-lg p-3 backdrop-blur-sm shadow-lg max-w-[200px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-semibold text-foreground uppercase tracking-wide">
            Presentation Outline
          </span>
        </div>

        {/* Chapters */}
        <div className="space-y-1">
          {chapters.map((chapter, index) => {
            const isActive = chapter.id === currentView;
            const isCompleted = completedViews.includes(chapter.id);
            const isPast = index < currentIndex;
            
            return (
              <button
                key={chapter.id}
                onClick={() => onNavigate(chapter.id)}
                className={cn(
                  "w-full flex items-start gap-2 px-2 py-1.5 rounded text-left transition-all group",
                  isActive 
                    ? "bg-primary/20 border border-primary/30" 
                    : "hover:bg-secondary/50"
                )}
              >
                {/* Progress indicator */}
                <div className={cn(
                  "mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  isActive ? "bg-primary text-primary-foreground" :
                  isCompleted || isPast ? "bg-risk-low/20 text-risk-low" :
                  "bg-secondary text-muted-foreground"
                )}>
                  {isCompleted || isPast ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <span className="text-[8px] font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-[10px] font-medium truncate",
                    isActive ? "text-primary" : "text-foreground"
                  )}>
                    {isAcademicMode ? chapter.academicLabel : chapter.label}
                  </div>
                  <div className="text-[8px] text-muted-foreground flex items-center gap-1">
                    {chapter.icon}
                    <span>{chapter.duration}</span>
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="w-1 h-full bg-primary rounded-full absolute left-0 top-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-3 pt-2 border-t border-border/30">
          <div className="flex items-center justify-between text-[8px] text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{Math.round(((currentIndex + 1) / chapters.length) * 100)}%</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / chapters.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Estimated time */}
        <div className="mt-2 text-[8px] text-center text-muted-foreground">
          Est. total: ~7 minutes
        </div>
      </div>
    </div>
  );
};
