import { cn } from '@/lib/utils';

interface SkipLinkTarget {
  id: string;
  label: string;
  shortcut?: string;
}

interface SkipLinkProps {
  targets?: SkipLinkTarget[];
  className?: string;
  variant?: 'default' | 'dashboard' | 'presentation';
}

const defaultTargets: SkipLinkTarget[] = [
  { id: 'main-content', label: 'Skip to main content', shortcut: 'Alt+1' },
];

const dashboardTargets: SkipLinkTarget[] = [
  { id: 'main-content', label: 'Skip to main content', shortcut: 'Alt+1' },
  { id: 'filters', label: 'Skip to filters', shortcut: 'Alt+2' },
  { id: 'patient-list', label: 'Skip to patient list', shortcut: 'Alt+3' },
];

const presentationTargets: SkipLinkTarget[] = [
  { id: 'main-content', label: 'Skip to slide content', shortcut: 'Alt+1' },
];

const getTargetsForVariant = (variant: SkipLinkProps['variant']) => {
  switch (variant) {
    case 'dashboard':
      return dashboardTargets;
    case 'presentation':
      return presentationTargets;
    default:
      return defaultTargets;
  }
};

export const SkipLink = ({ 
  targets, 
  className, 
  variant = 'default' 
}: SkipLinkProps) => {
  const resolvedTargets = targets || getTargetsForVariant(variant);
  
  return (
    <nav 
      aria-label="Skip navigation"
      className={cn("skip-links", className)}
    >
      {resolvedTargets.map((target, index) => (
        <a
          key={target.id}
          href={`#${target.id}`}
          className={cn(
            "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:z-[100]",
            "focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground",
            "focus:rounded-md focus:font-medium focus:shadow-lg",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "transition-all duration-200 focus:flex focus:items-center focus:gap-2"
          )}
          style={{ left: `${index * 200 + 16}px` }}
        >
          <span>{target.label}</span>
          {target.shortcut && (
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-primary-foreground/20 font-mono">
              {target.shortcut}
            </kbd>
          )}
        </a>
      ))}
    </nav>
  );
};

// Export targets for reuse
export { dashboardTargets, presentationTargets, defaultTargets };
