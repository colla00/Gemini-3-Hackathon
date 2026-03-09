import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Clock, Zap, Brain, Activity, Shield, TrendingUp, GripVertical } from 'lucide-react';

interface ComparisonItem {
  icon: React.ElementType;
  label: string;
  traditional: string;
  vitasignal: string;
}

const comparisons: ComparisonItem[] = [
  { icon: Brain, label: 'Data Source', traditional: 'Vital sign monitors, sensors, wearables', vitasignal: 'EHR timestamp patterns only — no hardware' },
  { icon: Activity, label: 'Mortality Prediction', traditional: 'MEWS/NEWS: AUROC 0.65–0.72', vitasignal: 'VitaSignal: AUROC 0.906 (HiRID)' },
  { icon: Clock, label: 'Implementation Time', traditional: '6–18 months, hardware procurement', vitasignal: 'Weeks — integrates with existing EHR' },
  { icon: Shield, label: 'Cost Per Bed', traditional: '$8,000–$15,000 sensor infrastructure', vitasignal: '$0 additional hardware cost' },
  { icon: TrendingUp, label: 'Documentation Burden', traditional: 'Not measured — invisible problem', vitasignal: 'DBS quantified across 172 hospitals' },
  { icon: AlertTriangle, label: 'Alert Fatigue', traditional: '85–99% false alarm rate', vitasignal: 'Trust-calibrated alert governance' },
];

const ComparisonColumn = ({ side, items }: { side: 'traditional' | 'vitasignal'; items: ComparisonItem[] }) => {
  const isVita = side === 'vitasignal';
  return (
    <div className={cn("p-6 md:p-8", isVita ? "bg-primary/5" : "bg-muted/50")}>
      <div className="flex items-center gap-2 mb-6">
        {isVita
          ? <CheckCircle2 className="w-5 h-5 text-primary" />
          : <AlertTriangle className="w-5 h-5 text-destructive" />}
        <h3 className="font-bold text-foreground text-lg whitespace-nowrap">
          {isVita ? 'VitaSignal™' : 'Traditional EWS'}
        </h3>
      </div>
      <div className="space-y-4">
        {items.map((c) => (
          <div key={c.label} className="flex items-start gap-3">
            <c.icon className={cn("w-4 h-4 mt-0.5 shrink-0", isVita ? "text-primary" : "text-muted-foreground")} />
            <div className="min-w-0">
              <p className={cn("text-xs font-semibold uppercase tracking-wider", isVita ? "text-primary" : "text-muted-foreground")}>{c.label}</p>
              <p className={cn("text-sm", isVita ? "text-foreground font-medium" : "text-foreground/70")}>{isVita ? c.vitasignal : c.traditional}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ComparisonSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  // Track container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updateSlider = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pct)));
  }, []);

  // Use document-level listeners for reliable drag
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      updateSlider(e.clientX);
    };
    const onUp = () => setIsDragging(false);

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, [isDragging, updateSlider]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateSlider(e.clientX);
  }, [updateSlider]);

  // Auto-animate on first view
  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      let frame = 0;
      const total = 40;
      const iv = setInterval(() => {
        frame++;
        const t = frame / total;
        if (t <= 0.33) setSliderPos(50 - 25 * (t / 0.33));
        else if (t <= 0.66) setSliderPos(25 + 50 * ((t - 0.33) / 0.33));
        else setSliderPos(75 - 25 * ((t - 0.66) / 0.34));
        if (frame >= total) { clearInterval(iv); setSliderPos(50); }
      }, 30);
      return () => clearInterval(iv);
    }, 600);
    return () => clearTimeout(timer);
  }, [inView]);

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-background" aria-label="VitaSignal vs Traditional EWS comparison">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Side-by-Side Comparison</p>
          <h2 className="font-display text-2xl md:text-4xl text-foreground mb-3">Traditional EWS vs VitaSignal™</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Drag the slider to compare legacy monitoring with equipment-independent clinical AI.
          </p>
        </motion.div>

        {/* Slider container */}
        <div
          ref={containerRef}
          className="relative rounded-2xl border border-border/50 overflow-hidden select-none cursor-ew-resize"
          onPointerDown={handlePointerDown}
          role="slider"
          aria-label="Comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPos)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setSliderPos((p) => Math.max(5, p - 3));
            if (e.key === 'ArrowRight') setSliderPos((p) => Math.min(95, p + 3));
          }}
        >
          {/* Traditional (full background) */}
          <ComparisonColumn side="traditional" items={comparisons} />

          {/* VitaSignal overlay clipped by slider */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            <div style={{ width: containerWidth || '100%' }}>
              <ComparisonColumn side="vitasignal" items={comparisons} />
            </div>
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute inset-y-0 w-0.5 bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.4)]" />
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary border-2 border-primary-foreground/20 shadow-lg flex items-center justify-center transition-transform",
                isDragging ? 'scale-110' : ''
              )}
            >
              <GripVertical className="w-4 h-4 text-primary-foreground" />
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
