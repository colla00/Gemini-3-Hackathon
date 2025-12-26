import { cn } from '@/lib/utils';

interface SkipLinkTarget {
  id: string;
  label: string;
}

interface SkipLinkProps {
  targets?: SkipLinkTarget[];
  className?: string;
}

const defaultTargets: SkipLinkTarget[] = [
  { id: 'main-content', label: 'Skip to main content' },
];

export const SkipLink = ({ targets = defaultTargets, className }: SkipLinkProps) => {
  return (
    <nav 
      aria-label="Skip navigation"
      className={cn("skip-links", className)}
    >
      {targets.map((target) => (
        <a
          key={target.id}
          href={`#${target.id}`}
          className={cn(
            "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:z-[100]",
            "focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground",
            "focus:rounded-md focus:font-medium focus:shadow-lg",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "transition-all duration-200"
          )}
          style={{ left: `${targets.indexOf(target) * 180 + 16}px` }}
        >
          {target.label}
        </a>
      ))}
    </nav>
  );
};
