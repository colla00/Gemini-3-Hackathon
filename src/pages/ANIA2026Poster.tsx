import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, Upload, ExternalLink, Award, BarChart3, Users, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PATENT_5_TITLE } from '@/constants/patent';

const POSTER_FILE_URL = ''; // Will be replaced with actual file URL once uploaded

const ANIA2026Poster = () => {
  const [fileError, setFileError] = useState(false);

  return (
    <>
      <Helmet>
        <title>ANIA 2026 Poster — DBS System | VitaSignal</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="ANIA 2026 conference poster for the Documentation Burden Score (DBS) System." />
      </Helmet>

      <div className="min-h-screen bg-background">
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
                  <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                    Peer-Reviewed
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

        {/* Poster Embed Area */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {POSTER_FILE_URL && !fileError ? (
            <Card className="border-border/40 overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src={POSTER_FILE_URL}
                  className="w-full border-0"
                  style={{ height: '80vh', minHeight: '600px' }}
                  title="ANIA 2026 DBS Poster"
                  onError={() => setFileError(true)}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2 border-border/60">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="p-4 rounded-2xl bg-muted/50">
                  <Upload className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Poster Coming Soon</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    The ANIA 2026 presentation poster will be available here shortly. Check back soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
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
