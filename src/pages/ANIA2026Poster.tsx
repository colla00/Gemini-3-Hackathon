import { useState, useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Award, BarChart3, Users, Building2, ChevronLeft, ChevronRight, ExternalLink, Maximize, X, Play, Pause } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PATENT_5_TITLE } from '@/constants/patent';
import { cn } from '@/lib/utils';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';

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

const INTERVAL_OPTIONS = [3, 5, 8, 12];

const ANIA2026Poster = () => {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [interval, setInterval_] = useState(5);
  const touchStart = useRef<number | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(TOTAL_SLIDES - 1, c + 1)), []);

  const toggleFullscreen = useCallback(() => setFullscreen((f) => !f), []);

  // Auto-play timer
  useEffect(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (!autoPlay) return;
    autoPlayRef.current = setInterval(() => {
      setCurrent((c) => {
        if (c >= TOTAL_SLIDES - 1) {
          // Loop back to start
          return 0;
        }
        return c + 1;
      });
    }, interval * 1000);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [autoPlay, interval]);

  // Pause auto-play on manual navigation
  const manualPrev = useCallback(() => { setAutoPlay(false); prev(); }, [prev]);
  const manualNext = useCallback(() => { setAutoPlay(false); next(); }, [next]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') manualPrev();
      if (e.key === 'ArrowRight') manualNext();
      if (e.key === 'Escape') { setFullscreen(false); setAutoPlay(false); }
      if (e.key === 'f' || e.key === 'F') setFullscreen((f) => !f);
      if (e.key === ' ') { e.preventDefault(); setAutoPlay((a) => !a); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [manualPrev, manualNext]);

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

  // Preload adjacent slides for instant navigation
  useEffect(() => {
    const toPreload = [current - 1, current + 1, current + 2].filter(
      (i) => i >= 0 && i < TOTAL_SLIDES && i !== current
    );
    toPreload.forEach((i) => {
      const img = new Image();
      img.src = slides[i];
    });
  }, [current]);

  return (
    <>
      <Helmet>
        <title>ANIA 2026 Poster — DBS System | VitaSignal</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="ANIA 2026 conference poster for the Documentation Burden Score (DBS) System." />
      </Helmet>

      <div className="min-h-screen bg-background" onContextMenu={(e) => e.preventDefault()}>
        <WatermarkOverlay />
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
                  onClick={manualPrev}
                  disabled={current === 0 && !autoPlay}
                  className="text-white hover:bg-white/20 disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAutoPlay((a) => !a)}
                    className="text-white hover:bg-white/20"
                    title={autoPlay ? 'Pause (Space)' : 'Auto-play (Space)'}
                  >
                    {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  {autoPlay && (
                    <select
                      value={interval}
                      onChange={(e) => setInterval_(Number(e.target.value))}
                      className="bg-white/20 text-white text-xs rounded px-1.5 py-0.5 border border-white/20 outline-none cursor-pointer"
                    >
                      {INTERVAL_OPTIONS.map((s) => (
                        <option key={s} value={s} className="text-black">{s}s</option>
                      ))}
                    </select>
                  )}
                  <span className="text-sm font-medium text-white/90">
                    {current + 1} / {TOTAL_SLIDES}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                    title="Fullscreen (F)"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={manualNext}
                    disabled={current === TOTAL_SLIDES - 1 && !autoPlay}
                    className="text-white hover:bg-white/20 disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
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

      {/* Fullscreen Lightbox */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[9998] bg-black flex items-center justify-center select-none"
          onContextMenu={(e) => e.preventDefault()}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <ProtectedImage
            src={slides[current]}
            alt={`Slide ${current + 1} of ${TOTAL_SLIDES}`}
            className="max-h-screen max-w-full"
          />

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 z-10"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-4 bg-gradient-to-t from-black/70 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              onClick={manualPrev}
              disabled={current === 0 && !autoPlay}
              className="text-white hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAutoPlay((a) => !a)}
                className="text-white hover:bg-white/20"
                title={autoPlay ? 'Pause (Space)' : 'Auto-play (Space)'}
              >
                {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              {autoPlay && (
                <select
                  value={interval}
                  onChange={(e) => setInterval_(Number(e.target.value))}
                  className="bg-white/20 text-white text-xs rounded px-1.5 py-0.5 border border-white/20 outline-none cursor-pointer"
                >
                  {INTERVAL_OPTIONS.map((s) => (
                    <option key={s} value={s} className="text-black">{s}s</option>
                  ))}
                </select>
              )}
              <span className="text-sm font-medium text-white/90">
                {current + 1} / {TOTAL_SLIDES}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={manualNext}
              disabled={current === TOTAL_SLIDES - 1 && !autoPlay}
              className="text-white hover:bg-white/20 disabled:opacity-30"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ANIA2026Poster;
