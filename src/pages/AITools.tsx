import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { EnhancedAIToolsPanel } from '@/components/ai/EnhancedAIToolsPanel';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';

const AITools = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <header className="w-full py-3 px-4 md:px-8 border-b border-border/40 bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/15 border border-primary/30">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-bold tracking-tight text-foreground">
                VitaSignal AI Engine
              </h1>
              <p className="text-[10px] text-muted-foreground font-semibold tracking-wide">
                Gemini 3 Hackathon · Research Demo
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* AI Tools Panel */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <EnhancedAIToolsPanel />
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-border/40 py-4 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          Research prototype · Not for clinical use · Patent pending ·{' '}
          <Link to="/" className="text-primary hover:underline">VitaSignal Home</Link>
        </p>
      </footer>

      <ResearchDisclaimer />
    </div>
  );
};

export default AITools;
