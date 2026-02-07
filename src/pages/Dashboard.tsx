import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, ArrowLeft, BarChart3, AlertTriangle, CheckSquare, Heart, LineChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AcknowledgmentModal } from '@/components/demo/AcknowledgmentModal';
import { PatentHeroSection } from '@/components/demo/PatentHeroSection';
import { IDIFeaturesSection } from '@/components/demo/IDIFeaturesSection';
import { DesignPhaseComponents } from '@/components/demo/DesignPhaseComponents';
import { PatentPublicationInfo } from '@/components/demo/PatentPublicationInfo';
import { DemoFooterDisclaimer } from '@/components/demo/DemoFooterDisclaimer';
import { WorkloadPredictionTab } from '@/components/nursing/WorkloadPredictionTab';
import { SurgeAlertsTab } from '@/components/nursing/SurgeAlertsTab';
import { TaskPrioritizationTab } from '@/components/nursing/TaskPrioritizationTab';
import { BurnoutTrackingTab } from '@/components/nursing/BurnoutTrackingTab';
import { WorkflowAnalyticsTab } from '@/components/nursing/WorkflowAnalyticsTab';

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

      {/* Fellowship Banner */}
      <div className="py-3 px-5 text-center text-sm font-semibold tracking-wide shadow-md border-b-[3px] sticky top-0 z-50" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', borderBottomColor: '#60a5fa' }}>
        NIH AIM-AHEAD CLINAQ Fellowship Project (Grant 1OT2OD032581) | VitaSignal Nursing Dashboard
      </div>

      {/* Research Prototype Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center text-sm">
        <span className="font-semibold text-destructive">RESEARCH PROTOTYPE</span>
        <span className="text-muted-foreground mx-2">|</span>
        <span className="text-muted-foreground">Not FDA cleared or approved. Not a medical device. Mock data for demonstration. Model validation pending.</span>
      </div>

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
                  VitaSignal Nursing
                </h1>
                <p className="text-[11px] text-muted-foreground font-medium tracking-wide">
                  AI-Powered Nursing Workload Optimization
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-primary/15 text-primary border border-primary/30 text-[10px] font-semibold">
              Aim 2 Prototype
            </Badge>
            <Badge className="bg-warning/15 text-warning border border-warning/30 text-[10px] font-semibold">
              SIMULATED DATA
            </Badge>
          </div>
        </div>
      </header>

      {/* Disclaimer */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6">
        <div className="bg-warning/5 border-l-4 border-warning p-4 rounded-lg">
          <p className="font-semibold text-sm text-warning mb-1">Development Prototype - Mock Data Only</p>
          <p className="text-xs text-muted-foreground">
            This dashboard displays simulated data for demonstration purposes. The workload prediction model is currently undergoing clinical validation on real OCHIN EHR data. Data shown here does NOT represent actual patient information or clinical recommendations. For fellowship research use only.
          </p>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6 h-auto p-1.5 bg-card border border-border">
            <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Shield className="h-3.5 w-3.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="workload" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <BarChart3 className="h-3.5 w-3.5" />
              Workload Prediction
            </TabsTrigger>
            <TabsTrigger value="surge" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <AlertTriangle className="h-3.5 w-3.5" />
              Surge Alerts
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <CheckSquare className="h-3.5 w-3.5" />
              Task Prioritization
            </TabsTrigger>
            <TabsTrigger value="burnout" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <Heart className="h-3.5 w-3.5" />
              Burnout Tracking
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
              <LineChart className="h-3.5 w-3.5" />
              Workflow Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-10">
            <PatentHeroSection />
            <IDIFeaturesSection />
            <DesignPhaseComponents />
            <PatentPublicationInfo />
            <DemoFooterDisclaimer />
          </TabsContent>

          <TabsContent value="workload">
            <WorkloadPredictionTab />
          </TabsContent>

          <TabsContent value="surge">
            <SurgeAlertsTab />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskPrioritizationTab />
          </TabsContent>

          <TabsContent value="burnout">
            <BurnoutTrackingTab />
          </TabsContent>

          <TabsContent value="analytics">
            <WorkflowAnalyticsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
