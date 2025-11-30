import { Activity } from 'lucide-react';

export const QualityHeader = () => {
  return (
    <header className="px-4 md:px-8 lg:px-16 py-6 border-b border-border/20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              EHR-Driven Quality Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Predictive Analytics for Nurse-Sensitive Outcomes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">Synthetic Data Mode</span>
          </div>
          <span className="text-xs text-muted-foreground">Stanford AI+HEALTH 2025</span>
        </div>
      </div>
    </header>
  );
};
