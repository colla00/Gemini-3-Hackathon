import { useState, useEffect, useRef } from 'react';
import { Activity, Sparkles, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { EnhancedAIToolsPanel } from '@/components/ai/EnhancedAIToolsPanel';
import { ArchitectureDiagram } from '@/components/ai/ArchitectureDiagram';
import { ResearchDisclaimer } from '@/components/ResearchDisclaimer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';

const AITools = () => {
  const [showIntro, setShowIntro] = useState(true);
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
                VitaSignal™
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
                className="text-sm text-primary-foreground/50 mb-6"
              >
                8 AI-powered clinical modules · Powered by Gemini 3
              </motion.p>

              {/* Impact stats for judges */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">11</p>
                  <p className="text-[10px] text-primary-foreground/40 uppercase tracking-wide">Patents Filed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">8</p>
                  <p className="text-[10px] text-primary-foreground/40 uppercase tracking-wide">AI Modules</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">&lt;5s</p>
                  <p className="text-[10px] text-primary-foreground/40 uppercase tracking-wide">Avg Latency</p>
                </div>
              </motion.div>

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
                VitaSignal™ AI Engine
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
              VitaSignal™ Home
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

      {/* Architecture & Documentation Section for Judges */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              How Gemini 3 Is Used
            </h3>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                <span><strong className="text-foreground">Clinical Notes Analysis</strong> — Gemini 3 extracts structured clinical insights from free-text nursing notes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                <span><strong className="text-foreground">Risk Narratives</strong> — Generates plain-language risk explanations with SHAP-style feature attribution</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                <span><strong className="text-foreground">Health Equity Analysis</strong> — Identifies demographic disparities using JAMIA-validated data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0" />
                <span><strong className="text-foreground">Intervention Suggestions</strong> — Evidence-based clinical recommendations with confidence scoring</span>
              </li>
            </ul>
          </div>
          <ArchitectureDiagram />
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t border-border/40 py-4 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          Research prototype · Not for clinical use · 11 U.S. patent applications filed ·{' '}
          <Link to="/" className="text-primary hover:underline">VitaSignal™ Home</Link>
          {' · '}
          <Link to="/watch" className="text-primary hover:underline">Watch Demo Video</Link>
        </p>
      </footer>

      <ResearchDisclaimer />
      <ScrollToTopButton />
    </div>
  );
};

export default AITools;
