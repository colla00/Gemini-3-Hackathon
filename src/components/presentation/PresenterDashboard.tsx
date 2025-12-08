import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Monitor, ExternalLink, Play, Pause, Clock, ChevronLeft, ChevronRight,
  MessageCircle, BarChart, BookOpen, FileText, Volume2, VolumeX,
  Users, AlertTriangle, CheckCircle, Settings, X, Maximize2, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PRESENTATION_SLIDES, 
  type SlideType,
  TOTAL_PRESENTATION_TIME 
} from '@/components/presentation/PresentationSlide';
import { PresenterCheatSheet } from '@/components/presentation/PresenterCheatSheet';
import { AudienceQuestions } from '@/components/engagement/AudienceQuestions';
import { LivePolls } from '@/components/engagement/LivePolls';
import { usePresenterSync } from '@/hooks/usePresenterSync';
import { usePresentationSession } from '@/hooks/usePresentationSession';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PresenterDashboardProps {
  onClose?: () => void;
}

export const PresenterDashboard = ({ onClose }: PresenterDashboardProps) => {
  const { isAdmin, loading } = useAuth();
  const [currentSlide, setCurrentSlide] = useState<SlideType>('title');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [slideElapsed, setSlideElapsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [audienceWindowOpen, setAudienceWindowOpen] = useState(false);
  
  const { broadcast, openAudienceWindow, closeAudienceWindow, isAudienceWindowOpen } = usePresenterSync(true);
  const { session, createSession } = usePresentationSession();

  // Admin-only access check
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <ShieldAlert className="w-12 h-12 text-risk-high mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              Presenter mode is restricted to administrators only.
            </p>
            <Link to="/presentation">
              <Button>Return to Presentation</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentIndex = PRESENTATION_SLIDES.findIndex(s => s.id === currentSlide);
  const currentSlideConfig = PRESENTATION_SLIDES[currentIndex];
  const nextSlideConfig = PRESENTATION_SLIDES[currentIndex + 1];
  
  const totalDurationSeconds = TOTAL_PRESENTATION_TIME * 60;
  const slideDurationSeconds = (currentSlideConfig?.duration || 5) * 60;
  const slideProgress = (slideElapsed / slideDurationSeconds) * 100;
  const overallProgress = (elapsedSeconds / totalDurationSeconds) * 100;
  const isOverTime = slideElapsed > slideDurationSeconds;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
        setSlideElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Pacing alerts
  useEffect(() => {
    if (!isRunning || !soundEnabled) return;
    
    const timeRemaining = slideDurationSeconds - slideElapsed;
    
    if (timeRemaining === 60) {
      toast.warning('1 minute remaining on this slide', { duration: 3000 });
    }
    if (timeRemaining === 0) {
      toast.error('Time is up for this slide!', { duration: 5000 });
    }
  }, [slideElapsed, slideDurationSeconds, isRunning, soundEnabled]);

  // Sync slide changes to audience window
  useEffect(() => {
    broadcast({ 
      currentSlide, 
      elapsedMinutes: Math.floor(elapsedSeconds / 60),
      isLive: true 
    });
  }, [currentSlide, elapsedSeconds, broadcast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const navigateSlide = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < PRESENTATION_SLIDES.length) {
      setCurrentSlide(PRESENTATION_SLIDES[newIndex].id);
      setSlideElapsed(0);
    }
  }, [currentIndex]);

  const goToSlide = useCallback((slideId: SlideType) => {
    setCurrentSlide(slideId);
    setSlideElapsed(0);
  }, []);

  const handleOpenAudienceWindow = useCallback(() => {
    openAudienceWindow();
    setAudienceWindowOpen(true);
    toast.success('Audience window opened - share this window on Zoom!');
  }, [openAudienceWindow]);

  const handleCloseAudienceWindow = useCallback(() => {
    closeAudienceWindow();
    setAudienceWindowOpen(false);
  }, [closeAudienceWindow]);

  // Create session on mount
  useEffect(() => {
    if (!session) {
      createSession('Presenter');
    }
  }, [session, createSession]);

  // Check audience window status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAudienceWindowOpen(isAudienceWindowOpen());
    }, 1000);
    return () => clearInterval(interval);
  }, [isAudienceWindowOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-secondary border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">Presenter Dashboard</h1>
            </div>
            <Badge variant={audienceWindowOpen ? "default" : "secondary"}>
              {audienceWindowOpen ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Audience Connected
                </>
              ) : (
                'Audience Disconnected'
              )}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={audienceWindowOpen ? "outline" : "default"}
              size="sm"
              onClick={audienceWindowOpen ? handleCloseAudienceWindow : handleOpenAudienceWindow}
            >
              {audienceWindowOpen ? (
                <>
                  <X className="w-4 h-4 mr-1" />
                  Close Audience View
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open Audience View
                </>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Exit
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="p-4 grid grid-cols-12 gap-4 h-[calc(100vh-4rem)]">
        {/* Left Column - Slide Navigation & Timer */}
        <div className="col-span-3 space-y-4">
          {/* Timer Card */}
          <Card className={cn(
            "border-2 transition-colors",
            isOverTime ? "border-risk-high bg-risk-high/5" : "border-primary/30"
          )}>
            <CardContent className="pt-4">
              <div className="text-center mb-4">
                <p className="text-xs text-muted-foreground mb-1">Current Slide</p>
                <p className={cn(
                  "text-4xl font-mono font-bold",
                  isOverTime ? "text-risk-high" : "text-foreground"
                )}>
                  {formatTime(slideElapsed)}
                </p>
                <p className="text-xs text-muted-foreground">
                  / {formatTime(slideDurationSeconds)} target
                </p>
                {isOverTime && (
                  <Badge variant="destructive" className="mt-2 animate-pulse">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Over Time!
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateSlide('prev')}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  className={cn(
                    "w-14 h-14 rounded-full",
                    isRunning ? "bg-risk-high hover:bg-risk-high/80" : "bg-risk-low hover:bg-risk-low/80"
                  )}
                  onClick={() => setIsRunning(!isRunning)}
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateSlide('next')}
                  disabled={currentIndex === PRESENTATION_SLIDES.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Slide Progress</span>
                    <span>{Math.min(Math.round(slideProgress), 100)}%</span>
                  </div>
                  <Progress 
                    value={Math.min(slideProgress, 100)} 
                    className={cn("h-2", isOverTime && "[&>div]:bg-risk-high")} 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Overall</span>
                    <span>{formatTime(elapsedSeconds)} / {formatTime(totalDurationSeconds)}</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Slide List */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Slides</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <div className="p-2 space-y-1">
                  {PRESENTATION_SLIDES.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(slide.id)}
                      className={cn(
                        "w-full flex items-center gap-2 p-2 rounded text-left transition-colors text-sm",
                        slide.id === currentSlide
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      )}
                    >
                      <span className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",
                        slide.id === currentSlide
                          ? "bg-primary-foreground/20"
                          : "bg-secondary"
                      )}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{slide.title}</p>
                        <p className={cn(
                          "text-xs",
                          slide.id === currentSlide ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {slide.duration}m
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Current Slide Preview */}
        <div className="col-span-5 space-y-4">
          {/* Current Slide Info */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{currentSlideConfig?.title}</CardTitle>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {currentSlideConfig?.duration}m
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Slide preview would go here - for now show talking points */}
              <div className="aspect-video bg-secondary rounded-lg border border-border flex items-center justify-center mb-4">
                <div className="text-center">
                  <Maximize2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Slide Preview</p>
                  <p className="text-xs text-muted-foreground">Visible in audience window</p>
                </div>
              </div>

              {/* Up Next */}
              {nextSlideConfig && (
                <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Up Next</p>
                  <p className="text-sm font-medium">{nextSlideConfig.title}</p>
                  <p className="text-xs text-muted-foreground">{nextSlideConfig.duration}m</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes / Cheat Sheet / Q&A Tabs */}
          <Card className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-0">
                <TabsList className="w-full">
                  <TabsTrigger value="notes" className="flex-1">
                    <FileText className="w-4 h-4 mr-1" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="cheatsheet" className="flex-1">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Q&A Prep
                  </TabsTrigger>
                  <TabsTrigger value="questions" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Questions
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-4">
                <ScrollArea className="h-[300px]">
                  <TabsContent value="notes" className="mt-0">
                    <div className="space-y-3">
                      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-sm font-medium">Current Slide</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentSlideConfig?.subtitle || 'Deliver your core message with confidence.'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Talking Points
                        </p>
                        <ul className="space-y-2">
                          {(currentSlideConfig?.talkingPoints || [
                            'Engage the audience with your opening',
                            'Present the key data points clearly',
                            'Transition smoothly to the next slide',
                          ]).map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary flex-shrink-0">
                                {i + 1}
                              </span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {currentSlideConfig?.transitionCue && (
                        <div className="p-2 bg-amber-500/10 rounded border border-amber-500/30">
                          <p className="text-xs text-amber-600 font-medium">Transition Cue</p>
                          <p className="text-sm text-muted-foreground">{currentSlideConfig.transitionCue}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="cheatsheet" className="mt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Common Q&A questions - click to expand answers
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 rounded bg-secondary border border-border/50">
                        <p className="font-medium">Why XGBoost over deep learning?</p>
                        <p className="text-muted-foreground text-xs mt-1">Better interpretability with SHAP, excellent tabular data performance.</p>
                      </div>
                      <div className="p-2 rounded bg-secondary border border-border/50">
                        <p className="font-medium">How do you handle alert fatigue?</p>
                        <p className="text-muted-foreground text-xs mt-1">Priority stratification - only top 3-5 patients highlighted per shift.</p>
                      </div>
                      <div className="p-2 rounded bg-secondary border border-border/50">
                        <p className="font-medium">What's the FDA pathway?</p>
                        <p className="text-muted-foreground text-xs mt-1">510(k) as Class II medical device with existing predicates.</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="questions" className="mt-0">
                    <AudienceQuestions 
                      sessionId={session?.id} 
                      isPresenter={true} 
                      currentSlide={currentSlide}
                    />
                  </TabsContent>
                </ScrollArea>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Right Column - Engagement & Stats */}
        <div className="col-span-4 space-y-4">
          {/* Session Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Live Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              {session?.session_key ? (
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Join Code</p>
                  <p className="text-2xl font-mono font-bold text-primary tracking-widest">
                    {session.session_key}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share this code for audience Q&A
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Creating session...
                </p>
              )}
            </CardContent>
          </Card>

          {/* Live Polls */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Polls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px]">
                <LivePolls sessionId={session?.id} isPresenter={true} />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Instructions */}
          <Card className="bg-amber-500/5 border-amber-500/30">
            <CardContent className="pt-4">
              <p className="text-xs font-semibold text-amber-600 mb-2">📋 Quick Guide</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Click "Open Audience View" to get shareable window</li>
                <li>• Share THAT window on Zoom, not this one</li>
                <li>• Your notes and controls stay private here</li>
                <li>• Use ←/→ arrows or buttons to navigate</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
