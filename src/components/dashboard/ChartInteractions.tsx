// Chart Interaction Components - Animated Legends & Zoom/Pan
// Provides interactive chart features for detailed data exploration
// Copyright © Dr. Alexis Collier - U.S. Patent Application Filed

import { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ZoomIn, ZoomOut, Move, RotateCcw, Maximize2, 
  Eye, EyeOff, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// ==========================================
// INTERACTIVE LEGEND COMPONENT
// ==========================================

export interface LegendItem {
  id: string;
  label: string;
  color: string;
  value?: number | string;
  unit?: string;
  description?: string;
}

interface InteractiveLegendProps {
  items: LegendItem[];
  onHover?: (id: string | null) => void;
  onToggle?: (id: string, visible: boolean) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  showValues?: boolean;
  collapsible?: boolean;
}

export function InteractiveLegend({
  items,
  onHover,
  onToggle,
  orientation = 'horizontal',
  className,
  showValues = false,
  collapsible = false,
}: InteractiveLegendProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleMouseEnter = useCallback((id: string) => {
    setHoveredId(id);
    onHover?.(id);
  }, [onHover]);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    onHover?.(null);
  }, [onHover]);

  const handleToggle = useCallback((id: string) => {
    setHiddenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        onToggle?.(id, true);
      } else {
        next.add(id);
        onToggle?.(id, false);
      }
      return next;
    });
  }, [onToggle]);

  return (
    <div className={cn("relative", className)}>
      {collapsible && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-1 right-0 h-6 w-6 p-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}
        </Button>
      )}
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex gap-3",
              orientation === 'vertical' ? "flex-col" : "flex-wrap items-center justify-center"
            )}
          >
            {items.map((item) => {
              const isHovered = hoveredId === item.id;
              const isHidden = hiddenIds.has(item.id);
              const isOtherHovered = hoveredId !== null && hoveredId !== item.id;

              return (
                <TooltipProvider key={item.id} delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        className={cn(
                          "flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer",
                          "border border-transparent hover:border-border/50",
                          isHovered && "bg-muted/80 border-primary/30 shadow-sm",
                          isOtherHovered && "opacity-40",
                          isHidden && "opacity-30 line-through"
                        )}
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleToggle(item.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        layout
                      >
                        {/* Color indicator with glow on hover */}
                        <motion.div
                          className="relative w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                          animate={{
                            scale: isHovered ? 1.3 : 1,
                            boxShadow: isHovered 
                              ? `0 0 12px ${item.color}` 
                              : `0 0 0px ${item.color}`,
                          }}
                          transition={{ duration: 0.2 }}
                        />

                        {/* Label */}
                        <span className={cn(
                          "text-xs font-medium transition-colors",
                          isHovered ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {item.label}
                        </span>

                        {/* Value (optional) */}
                        {showValues && item.value !== undefined && (
                          <motion.span
                            className="text-xs font-bold tabular-nums"
                            style={{ color: item.color }}
                            animate={{ opacity: isHovered ? 1 : 0.7 }}
                          >
                            {item.value}{item.unit || ''}
                          </motion.span>
                        )}

                        {/* Visibility indicator */}
                        <motion.div
                          className="ml-1"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: isHovered ? 1 : 0, 
                            scale: isHovered ? 1 : 0 
                          }}
                          transition={{ duration: 0.15 }}
                        >
                          {isHidden ? (
                            <EyeOff className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Eye className="h-3 w-3 text-primary" />
                          )}
                        </motion.div>
                      </motion.button>
                    </TooltipTrigger>
                    {item.description && (
                      <TooltipContent side="top" className="max-w-[200px]">
                        <p className="text-xs">{item.description}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// ZOOM/PAN CHART WRAPPER
// ==========================================

interface ZoomPanState {
  scale: number;
  translateX: number;
  translateY: number;
}

interface ChartZoomPanProps {
  children: ReactNode;
  className?: string;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  showControls?: boolean;
  onZoomChange?: (zoom: number) => void;
}

export function ChartZoomPan({
  children,
  className,
  minZoom = 0.5,
  maxZoom = 4,
  zoomStep = 0.25,
  showControls = true,
  onZoomChange,
}: ChartZoomPanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ZoomPanState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return; // Require Ctrl/Cmd for zoom
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    
    setState(prev => {
      const newScale = Math.min(maxZoom, Math.max(minZoom, prev.scale + delta));
      onZoomChange?.(newScale);
      return { ...prev, scale: newScale };
    });
  }, [minZoom, maxZoom, zoomStep, onZoomChange]);

  // Handle pan start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    if (state.scale <= 1) return; // Only pan when zoomed in
    
    setIsPanning(true);
    setStartPan({
      x: e.clientX - state.translateX,
      y: e.clientY - state.translateY,
    });
  }, [state.scale, state.translateX, state.translateY]);

  // Handle pan move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    
    setState(prev => ({
      ...prev,
      translateX: e.clientX - startPan.x,
      translateY: e.clientY - startPan.y,
    }));
  }, [isPanning, startPan]);

  // Handle pan end
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setState(prev => {
      const newScale = Math.min(maxZoom, prev.scale + zoomStep);
      onZoomChange?.(newScale);
      return { ...prev, scale: newScale };
    });
  }, [maxZoom, zoomStep, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    setState(prev => {
      const newScale = Math.max(minZoom, prev.scale - zoomStep);
      onZoomChange?.(newScale);
      return { ...prev, scale: newScale };
    });
  }, [minZoom, zoomStep, onZoomChange]);

  const handleReset = useCallback(() => {
    setState({ scale: 1, translateX: 0, translateY: 0 });
    onZoomChange?.(1);
  }, [onZoomChange]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const zoomPercentage = Math.round(state.scale * 100);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-lg",
        isPanning && "cursor-grabbing",
        state.scale > 1 && !isPanning && "cursor-grab",
        isFullscreen && "bg-background p-4",
        className
      )}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Zoom/Pan Controls */}
      {showControls && (
        <motion.div
          className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-lg border border-border/50 p-1 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={handleZoomOut}
                  disabled={state.scale <= minZoom}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Zoom Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Badge 
            variant="secondary" 
            className="text-[10px] px-1.5 py-0 h-5 min-w-[40px] justify-center font-mono"
          >
            {zoomPercentage}%
          </Badge>

          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={handleZoomIn}
                  disabled={state.scale >= maxZoom}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Zoom In</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-px h-4 bg-border mx-0.5" />

          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={handleReset}
                  disabled={state.scale === 1 && state.translateX === 0 && state.translateY === 0}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Reset View</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={toggleFullscreen}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      )}

      {/* Pan indicator */}
      {state.scale > 1 && (
        <motion.div
          className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 text-[10px] text-muted-foreground bg-background/80 backdrop-blur-sm rounded px-2 py-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Move className="h-3 w-3" />
          <span>Drag to pan</span>
        </motion.div>
      )}

      {/* Chart content with transforms */}
      <motion.div
        className="w-full h-full"
        style={{
          transformOrigin: 'center center',
        }}
        animate={{
          scale: state.scale,
          x: state.translateX,
          y: state.translateY,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        {children}
      </motion.div>

      {/* Zoom hint overlay */}
      {state.scale === 1 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.7 }}
        >
          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
            <ZoomIn className="h-3.5 w-3.5" />
            <span>Ctrl + Scroll to zoom</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ==========================================
// HIGHLIGHTED DATA SERIES WRAPPER
// ==========================================

interface HighlightedSeriesProps {
  children: ReactNode;
  seriesId: string;
  highlightedId: string | null;
  className?: string;
}

export function HighlightedSeries({
  children,
  seriesId,
  highlightedId,
  className,
}: HighlightedSeriesProps) {
  const isHighlighted = highlightedId === seriesId;
  const isDimmed = highlightedId !== null && highlightedId !== seriesId;

  return (
    <motion.div
      className={cn("transition-all", className)}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        filter: isHighlighted ? 'brightness(1.1)' : 'brightness(1)',
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// CHART LEGEND CONNECTOR LINES
// ==========================================

interface LegendConnectorProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  isActive: boolean;
}

export function LegendConnector({ from, to, color, isActive }: LegendConnectorProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 100 }}
    >
      <motion.path
        d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${from.y} ${to.x} ${to.y}`}
        fill="none"
        stroke={color}
        strokeWidth={isActive ? 2 : 0}
        strokeDasharray="4 2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: isActive ? 1 : 0, 
          opacity: isActive ? 0.6 : 0 
        }}
        transition={{ duration: 0.3 }}
      />
    </svg>
  );
}
