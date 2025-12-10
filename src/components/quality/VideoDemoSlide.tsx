import { Play, ExternalLink, Clock, GraduationCap, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const VideoDemoSlide = () => {
  const videoId = 'DA5pwKx5o0s';
  const videoUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-primary/5 p-6 flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-2">
          <Video className="w-3 h-3" />
          CONFERENCE PRESENTATION
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          EHR Driven Quality Dashboard for Nurse Sensitive Outcomes
        </h1>
        <p className="text-sm text-muted-foreground">
          Stanford AI+HEALTH 2025 - Platform Overview
        </p>
      </div>

      {/* Video Container */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-4xl border-2 border-primary/30 overflow-hidden">
          <CardContent className="p-0">
            {/* Video Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={videoUrl}
                title="NSO Quality Dashboard Presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Bar */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Stanford AI+HEALTH</div>
              <div className="text-[10px] text-muted-foreground">December 2025</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">5 Minutes</div>
              <div className="text-[10px] text-muted-foreground">Video Overview</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Live Demo</div>
              <div className="text-[10px] text-muted-foreground">Interactive Dashboard</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open(`https://youtu.be/${videoId}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in YouTube
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Presenter Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Presented by Alexis Collier • alexis.collier@ung.edu • Research Prototype • Patent Pending
        </p>
      </div>
    </div>
  );
};
