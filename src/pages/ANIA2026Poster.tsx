import { useState, useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Award, BarChart3, Users, Building2, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PATENT_5_TITLE } from '@/constants/patent';
import { cn } from '@/lib/utils';

const TOTAL_SLIDES = 15;
const slides = Array.from({ length: TOTAL_SLIDES }, (_, i) => `/slides/slide-${String(i + 1).padStart(2, '0')}.jpg`);

const ProtectedImage = ({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) => (
  <div
    className={cn("relative overflow-hidden", className)}
    onContextMenu={(e) => e.preventDefault()}
    onClick={onClick}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain pointer-events-none select-none"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitUserDrag: 'none', userSelect: 'none' } as React.CSSProperties}
    />
    {/* Transparent overlay to block direct image interaction — pointer-events-none so parent clicks work */}
    <div className="absolute inset-0 z-10 pointer-events-none" onContextMenu={(e) => e.preventDefault()} />
  </div>
);

const ANIA2026Poster = () => {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef<number | null>(null);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(TOTAL_SLIDES - 1, c + 1)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStart.current = null;
  }, [next, prev]);

  return (
    <>
      <Helmet>
        <title>ANIA 2026 Poster — DBS System | VitaSignal</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="ANIA 2026 conference poster for the Documentation Burden Score (DBS) System." />
      </Helmet>

      <div className="min-h-screen bg-background" onContextMenu={(e) => e.preventDefault()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-chart-2/10 border-b border-border/40">
          <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 hidden sm:flex">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/30">
                    <Award className="w-3 h-3 mr-1" />
                    ANIA 2026
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    Patent #5 — Filed Jan 2026
                  </Badge>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-2">
                  Documentation Burden Score (DBS) System
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  {PATENT_5_TITLE}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Inventor: Dr. Alexis Collier · NIH-funded research
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="max-w-5xl mx-auto px-4 -mt-4 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: BarChart3, label: 'Internal AUROC', value: '0.802', sub: 'MIMIC-IV · N=24,689' },
              { icon: BarChart3, label: 'External AUROC', value: '0.857', sub: 'eICU · N=297,030' },
              { icon: Building2, label: 'Hospitals', value: '208', sub: 'Multi-center validation' },
              { icon: Users, label: 'Total Patients', value: '321K+', sub: 'Combined cohort' },
            ].map((m) => (
              <Card key={m.label} className="border-border/40 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <m.icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
                  <p className="text-2xl font-bold text-foreground">{m.value}</p>
                  <p className="text-xs font-medium text-foreground/80">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground">{m.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Slide Viewer */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Card className="border-border/40 overflow-hidden">
            <CardContent className="p-0 relative select-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <ProtectedImage
                src={slides[current]}
                alt={`Slide ${current + 1} of ${TOTAL_SLIDES}`}
              />

              {/* Navigation overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/60 to-transparent z-20">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prev}
                  disabled={current === 0}
                  className="text-white hover:bg-white/20 disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-sm font-medium text-white/90">
                  {current + 1} / {TOTAL_SLIDES}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={next}
                  disabled={current === TOTAL_SLIDES - 1}
                  className="text-white hover:bg-white/20 disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail Strip */}
          <div className="mt-4 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max px-1">
              {slides.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "relative flex-shrink-0 w-24 sm:w-28 rounded-lg overflow-hidden border-2 transition-all hover:opacity-100",
                    current === i
                      ? "border-primary ring-2 ring-primary/30 opacity-100"
                      : "border-border/40 opacity-60 hover:border-border"
                  )}
                >
                  <img
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover pointer-events-none select-none aspect-[16/9]"
                    draggable={false}
                  />
                  <span className="absolute bottom-0 inset-x-0 text-[10px] font-medium text-white bg-black/50 py-0.5 text-center z-20">
                    {i + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/40 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} VitaSignal · Research Prototype · Not for clinical use
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <a href="/" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                VitaSignal Home <ExternalLink className="w-3 h-3" />
              </a>
              <a href="/patents" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                Patent Portfolio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ANIA2026Poster;
