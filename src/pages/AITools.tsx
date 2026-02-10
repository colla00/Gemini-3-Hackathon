import { useState, useEffect, useRef } from 'react';
import { Activity, Sparkles, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { EnhancedAIToolsPanel } from '@/components/ai/EnhancedAIToolsPanel';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';

const AITools = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [autoStarted, setAutoStarted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss intro after 6 seconds
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // After intro dismisses, auto-click "Run All Demos"
  useEffect(() => {
    if (!showIntro && !autoStarted) {
      const timer = setTimeout(() => {
        const runBtn = document.querySelector('[data-ai-tools-panel] button');
        // Find the "Run All Demos" button specifically
        const allButtons = document.querySelectorAll('[data-ai-tools-panel] button');
        allButtons.forEach(btn => {
          if (btn.textContent?.includes('Run All Demos')) {
            (btn as HTMLButtonElement).click();
            setAutoStarted(true);
          }
        });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showIntro, autoStarted]);

  const skipIntro = () => setShowIntro(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Intro Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground"
          >
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            <div className="relative text-center px-6 max-w-2xl">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Gemini 3 Hackathon 2026</span>
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="font-display text-4xl md:text-6xl text-primary-foreground mb-4"
              >
                VitaSignal
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-lg md:text-xl text-primary-foreground/70 mb-3"
              >
                Clinical Intelligence Without Equipment
              </motion.p>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="text-sm text-primary-foreground/50 mb-10"
              >
                8 AI-powered clinical modules · Powered by Gemini 3 Flash + Pro
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="flex flex-col items-center gap-4"
              >
                <Button
                  size="lg"
                  onClick={skipIntro}
                  className="text-base px-10 h-12 shadow-lg gap-2"
                >
                  <Play className="w-4 h-4" />
                  Launch Interactive Demo
                </Button>
                <motion.p
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xs text-primary-foreground/40"
                >
                  Auto-launching in a few seconds...
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal header */}
      <header className="w-full py-3 px-4 md:px-8 border-b border-border/40 bg-card/80 backdrop-blur-md sticky top-0 z-40">
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
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-primary transition-colors hidden sm:inline-flex items-center gap-1"
            >
              VitaSignal Home
              <ArrowRight className="w-3 h-3" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* AI Tools Panel */}
      <main ref={panelRef} className="max-w-7xl mx-auto px-4 md:px-8 py-6">
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
