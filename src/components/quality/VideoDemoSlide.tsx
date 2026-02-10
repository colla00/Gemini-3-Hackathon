import { Play, ExternalLink, Clock, Sparkles, Video, Brain, Stethoscope, Scale, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VideoDemoSlideProps {
  videoId?: string;
  variant?: 'hackathon' | 'stanford';
}

export const VideoDemoSlide = ({ 
  videoId = 'DA5pwKx5o0s',
  variant = 'hackathon'
}: VideoDemoSlideProps) => {
  const videoUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

  const isHackathon = variant === 'hackathon';

  const geminiFeatures = [
    { icon: Stethoscope, label: 'Clinical Notes Analysis', color: 'text-blue-500' },
    { icon: Brain, label: 'Risk Narratives', color: 'text-purple-500' },
    { icon: Lightbulb, label: 'Intervention Suggestions', color: 'text-amber-500' },
    { icon: Scale, label: 'Health Equity', color: 'text-emerald-500' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-background via-background to-primary/5 p-6 flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-primary/30 text-primary text-xs font-medium mb-2">
          {isHackathon ? (
            <>
              <Sparkles className="w-3 h-3" />
              GEMINI 3 HACKATHON 2026
            </>
          ) : (
            <>
              <Video className="w-3 h-3" />
              CONFERENCE PRESENTATION
            </>
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {isHackathon 
            ? 'AI-Powered Clinical Decision Support Demo'
            : 'EHR Driven Quality Dashboard for Nurse Sensitive Outcomes'
          }
        </h1>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          {isHackathon ? (
            <>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                Powered by Gemini 3
              </Badge>
              <span>NSO Quality Dashboard • 3 Minute Overview</span>
            </>
          ) : (
            'Stanford AI+HEALTH 2025 - Platform Overview'
          )}
        </p>
      </div>

      {/* Video Container */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-4xl border-2 border-primary/30 overflow-hidden shadow-xl">
          <CardContent className="p-0">
            {/* Video Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={videoUrl}
                title={isHackathon ? "Gemini 3 Hackathon Demo" : "NSO Quality Dashboard Presentation"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gemini Features Bar (Hackathon only) */}
      {isHackathon && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {geminiFeatures.map((feature, idx) => (
            <Card key={idx} className="border-border/50 bg-card/50">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center`}>
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <div className="text-xs font-medium text-foreground">{feature.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Bar */}
      <div className={`mt-4 grid ${isHackathon ? 'grid-cols-3' : 'grid-cols-4'} gap-4`}>
        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              {isHackathon ? (
                <Sparkles className="w-5 h-5 text-primary" />
              ) : (
                <Play className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">
                {isHackathon ? 'Gemini 3 Flash + Pro' : 'Stanford AI+HEALTH'}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {isHackathon ? 'Dual Model Integration' : 'December 2025'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">
                {isHackathon ? '3 Minutes' : '5 Minutes'}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {isHackathon ? 'Hackathon Demo' : 'Video Overview'}
              </div>
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

        {!isHackathon && (
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
        )}
      </div>

      {/* Presenter Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          {isHackathon ? (
            <>
               Dr. Alexis Collier • Gemini 3 Hackathon 2026 Submission • 5 U.S. Patent Applications Filed • 
               <span className="text-primary"> info@alexiscollier.com</span>
             </>
           ) : (
             'Presented by Dr. Alexis Collier • info@alexiscollier.com • Research Prototype • 5 U.S. Patent Applications Filed'
          )}
        </p>
      </div>
    </div>
  );
};
