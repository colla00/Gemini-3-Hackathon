import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AcknowledgmentModal } from '@/components/demo/AcknowledgmentModal';
import { PatentHeroSection } from '@/components/demo/PatentHeroSection';
import { IDIFeaturesSection } from '@/components/demo/IDIFeaturesSection';
import { DesignPhaseComponents } from '@/components/demo/DesignPhaseComponents';
import { PatentPublicationInfo } from '@/components/demo/PatentPublicationInfo';
import { DemoFooterDisclaimer } from '@/components/demo/DemoFooterDisclaimer';

const STORAGE_KEY = 'vitasignal-demo-acknowledged';

export const Dashboard = () => {
  const [acknowledged, setAcknowledged] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true'
  );

  const handleAccept = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setAcknowledged(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/60">
      {/* Acknowledgment Modal */}
      <AcknowledgmentModal open={!acknowledged} onAccept={handleAccept} />

      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary w-full" aria-hidden="true" />

      {/* Header */}
      <header className="px-4 md:px-8 py-4 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link to="/" aria-label="Back to Home">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold text-foreground tracking-tight">
                  VitaSignal Technology Demo
                </h1>
                <p className="text-[11px] text-muted-foreground font-medium tracking-wide">
                  Clinical Intelligence Platform
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-primary/15 text-primary border border-primary/30 text-[10px] font-semibold">
              DEMO MODE
            </Badge>
            <Badge className="bg-warning/15 text-warning border border-warning/30 text-[10px] font-semibold">
              SIMULATED DATA
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10">
        {/* Patent #1 Hero */}
        <PatentHeroSection />

        {/* 9 IDI Features */}
        <IDIFeaturesSection />

        {/* Design Phase Components */}
        <DesignPhaseComponents />

        {/* Patent & Publication Info */}
        <PatentPublicationInfo />

        {/* Footer Disclaimer */}
        <DemoFooterDisclaimer />
      </main>
    </div>
  );
};
