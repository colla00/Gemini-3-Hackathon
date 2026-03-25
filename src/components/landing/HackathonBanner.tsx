import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const HackathonBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border-b border-primary/20 py-2.5 px-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-bold text-primary tracking-wide">
            Gemini 3 Hackathon 2026
          </span>
        </div>
        <span className="text-muted-foreground hidden sm:inline">•</span>
        <span className="text-muted-foreground text-xs hidden sm:inline">
          11 Patents · 8 AI Modules · 225K+ Patient-Stays Validated
        </span>
        <Link
          to="/ai-tools"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors ml-1"
        >
          Try Live Demo
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
};
