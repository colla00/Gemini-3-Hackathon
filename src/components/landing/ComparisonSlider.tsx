import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Clock, Zap, Brain, Activity, Shield, TrendingUp } from 'lucide-react';

interface ComparisonItem {
  icon: React.ElementType;
  label: string;
  traditional: string;
  vitasignal: string;
}

const comparisons: ComparisonItem[] = [
  {
    icon: Brain,
    label: 'Data Source',
    traditional: 'Vital sign monitors, sensors, wearables',
    vitasignal: 'EHR timestamp patterns only — no hardware',
  },
  {
    icon: Activity,
    label: 'Mortality Prediction',
    traditional: 'MEWS/NEWS: AUROC 0.65–0.72',
    vitasignal: 'VitaSignal: AUROC 0.906 (HiRID)',
  },
  {
    icon: Clock,
    label: 'Implementation Time',
    traditional: '6–18 months, hardware procurement',
    vitasignal: 'Weeks — integrates with existing EHR',
  },
  {
    icon: Shield,
    label: 'Cost Per Bed',
    traditional: '$8,000–$15,000 sensor infrastructure',
    vitasignal: '$0 additional hardware cost',
  },
  {
    icon: TrendingUp,
    label: 'Documentation Burden',
    traditional: 'Not measured — invisible problem',
    vitasignal: 'DBS quantified across 172 hospitals',
  },
  {
    icon: AlertTriangle,
    label: 'Alert Fatigue',
    traditional: '85–99% false alarm rate',
    vitasignal: 'Trust-calibrated alert governance',
  },
];

export const ComparisonSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pct)));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  }, [updateSlider]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  }, [isDragging, updateSlider]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Auto-animate on first view
  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      let frame = 0;
      const totalFrames = 40;
      const interval = setInterval(() => {
        frame++;
        const t = frame / totalFrames;
        // Ease-in-out: slide from 50 → 25 → 75 → 50
        if (t <= 0.33) {
          setSliderPos(50 - 25 * (t / 0.33));
        } else if (t <= 0.66) {
          setSliderPos(25 + 50 * ((t - 0.33) / 0.33));
        } else {
          setSliderPos(75 - 25 * ((t - 0.66) / 0.34));
        }
        if (frame >= totalFrames) {
          clearInterval(interval);
          setSliderPos(50);
        }
      }, 30);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(timer);
  }, [inView]);

  return (
    <section className="py-20 px-6 bg-background" aria-label="VitaSignal vs Traditional EWS comparison">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
            Side-by-Side Comparison
          </p>
          <h2 className="font-display text-2xl md:text-4xl text-foreground mb-3">
            Traditional EWS vs VitaSignal™
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Drag the slider to compare legacy monitoring with equipment-independent clinical AI.
          </p>
        </motion.div>

        {/* Slider container */}
        <div
          ref={containerRef}
          className="relative rounded-2xl border border-border/50 overflow-hidden select-none touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="slider"
          aria-label="Comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPos)}
        >
          {/* Traditional side (full width, clipped) */}
          <div className="relative">
            {/* Traditional background */}
            <div className="bg-muted/50 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-bold text-foreground text-lg">Traditional EWS</h3>
              </div>
              <div className="space-y-4">
                {comparisons.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <c.icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{c.label}</p>
                      <p className="text-sm text-foreground/70">{c.traditional}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VitaSignal overlay (clipped by slider position) */}
            <div
              className="absolute inset-0 bg-primary/5 border-r-2 border-primary/50 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="p-6 md:p-8 min-w-[calc(100vw-3rem)] md:min-w-0" style={{ width: containerRef.current?.offsetWidth || '100%' }}>
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground text-lg">VitaSignal™</h3>
                </div>
                <div className="space-y-4">
                  {comparisons.map((c) => (
                    <div key={c.label} className="flex items-start gap-3">
                      <c.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider">{c.label}</p>
                        <p className="text-sm text-foreground font-medium">{c.vitasignal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 z-10"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute inset-y-0 w-0.5 bg-primary" />
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary border-2 border-primary-foreground/20 shadow-lg flex items-center justify-center cursor-ew-resize transition-transform",
                isDragging ? 'scale-110' : 'hover:scale-105'
              )}
            >
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-4 px-2">
          <span className="text-xs font-semibold text-primary">← VitaSignal™</span>
          <span className="text-xs font-semibold text-muted-foreground">Traditional EWS →</span>
        </div>
      </div>
    </section>
  );
};
