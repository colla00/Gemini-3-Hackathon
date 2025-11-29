import { Activity, Shield } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full py-6 px-8 border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/20 shadow-glow">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              EHR-Driven Quality Dashboard
            </h1>
            <p className="text-sm text-muted-foreground font-medium tracking-wide">
              Live Research Prototype
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">
            Stanford AI+HEALTH 2025 Demo
          </span>
        </div>
      </div>
    </header>
  );
};
