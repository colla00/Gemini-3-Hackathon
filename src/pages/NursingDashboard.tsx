import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, TrendingUp, AlertTriangle, CheckSquare, Heart, BarChart3, FileText, DollarSign, Link2, Sparkles, HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { WorkloadPrediction } from '@/components/nursing/WorkloadPrediction';
import { SurgeAlerts } from '@/components/nursing/SurgeAlerts';
import { TaskPrioritization } from '@/components/nursing/TaskPrioritization';
import { BurnoutTracking } from '@/components/nursing/BurnoutTracking';
import { WorkflowAnalytics } from '@/components/nursing/WorkflowAnalytics';
import { ICUMortalityPrediction } from '@/components/dashboard/ICUMortalityPrediction';
import { DBSCalculator } from '@/components/dashboard/DBSCalculator';
import { ROICalculator } from '@/components/dashboard/ROICalculator';
import { LinkedCalculatorView } from '@/components/dashboard/LinkedCalculatorView';
import { ResearchCharts } from '@/components/dashboard/ResearchCharts';
import { AIToolsPanel } from '@/components/dashboard/AIToolsPanel';

export const NursingDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col gradient-burgundy">
      {/* Fellowship Banner */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-2.5 px-4 text-center text-xs font-semibold sticky top-0 z-50">
        NIH AIM-AHEAD CLINAQ Fellowship (Grant 1OT2OD032581) | K12 HL138039-06 |{' '}
        <span className="font-bold">VitaSignal Clinical Intelligence Platform</span>
      </div>

      {/* Research Banner */}
      <div className="bg-destructive/10 text-destructive py-2 px-4 text-center text-[11px] font-medium border-b border-destructive/20">
        RESEARCH PROTOTYPE | Not FDA cleared | Not a medical device | Simulated data only | Model validation pending
      </div>

      {/* Header */}
      <header className="bg-card border-b border-border px-4 md:px-8 py-4" role="banner">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link to="/" aria-label="Back to Home">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground">VitaSignal</h1>
                <p className="text-xs text-muted-foreground">Clinical Intelligence Platform | Dr. Alexis M. Collier</p>
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
      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pb-24" role="main" aria-label="VitaSignal Dashboard">
        {/* Disclaimer */}
        <Alert className="mb-6 border-l-4 border-l-warning bg-warning/10 border-warning/30">
          <AlertDescription className="text-sm">
            <strong className="block mb-1">Development Prototype | Mock Data Only</strong>
            Only VitaSignal Mortality (Patent #1, AUC 0.684, 95% CI: 0.653-0.715, n=26,153) has completed validation. All other components are in design phase with clinical validation pending. Data shown does NOT represent actual patient information.
          </AlertDescription>
        </Alert>

        {/* Tabs with grouped sections */}
        <Tabs defaultValue="workload" className="animate-fade-in">
          <div className="bg-card/60 border border-border/40 rounded-2xl shadow-sm p-2 mb-6">
            {/* Section: Nursing Operations */}
            <div className="mb-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-1">Nursing Operations</p>
              <TabsList className="bg-transparent flex-wrap h-auto gap-1 p-0">
                <TabsTrigger value="workload" className="gap-1.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Workload
                </TabsTrigger>
                <TabsTrigger value="surge" className="gap-1.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Surge Alerts
                </TabsTrigger>
                <TabsTrigger value="tasks" className="gap-1.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <CheckSquare className="h-3.5 w-3.5" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="burnout" className="gap-1.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <Heart className="h-3.5 w-3.5" />
                  Burnout
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-1.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <Separator className="my-1.5" />

            {/* Section: Clinical Tools */}
            <div className="mb-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-1">Clinical Tools</p>
              <TabsList className="bg-transparent flex-wrap h-auto gap-1 p-0">
                <TabsTrigger value="icu-mortality" className="gap-1.5 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <HeartPulse className="h-3.5 w-3.5" />
                  ICU Mortality
                </TabsTrigger>
                <TabsTrigger value="dbs" className="gap-1.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <FileText className="h-3.5 w-3.5" />
                  DBS Score
                </TabsTrigger>
                <TabsTrigger value="roi" className="gap-1.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <DollarSign className="h-3.5 w-3.5" />
                  ROI
                </TabsTrigger>
                <TabsTrigger value="linked" className="gap-1.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <Link2 className="h-3.5 w-3.5" />
                  Linked View
                </TabsTrigger>
              </TabsList>
            </div>

            <Separator className="my-1.5" />

            {/* Section: Research & AI */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-1">Research & AI</p>
              <TabsList className="bg-transparent flex-wrap h-auto gap-1 p-0">
                <TabsTrigger value="charts" className="gap-1.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Research Charts
                </TabsTrigger>
                <TabsTrigger value="ai-tools" className="gap-1.5 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Tools
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="workload" className="mt-0"><WorkloadPrediction /></TabsContent>
          <TabsContent value="surge" className="mt-0"><SurgeAlerts /></TabsContent>
          <TabsContent value="tasks" className="mt-0"><TaskPrioritization /></TabsContent>
          <TabsContent value="burnout" className="mt-0"><BurnoutTracking /></TabsContent>
          <TabsContent value="analytics" className="mt-0"><WorkflowAnalytics /></TabsContent>
          <TabsContent value="icu-mortality" className="mt-0"><ICUMortalityPrediction /></TabsContent>
          <TabsContent value="dbs" className="mt-0"><DBSCalculator /></TabsContent>
          <TabsContent value="roi" className="mt-0"><ROICalculator /></TabsContent>
          <TabsContent value="linked" className="mt-0"><LinkedCalculatorView /></TabsContent>
          <TabsContent value="charts" className="mt-0"><ResearchCharts /></TabsContent>
          <TabsContent value="ai-tools" className="mt-0"><AIToolsPanel /></TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-muted-foreground text-sm border-t border-border" role="contentinfo">
        <p><strong>VitaSignal Clinical Intelligence Platform</strong> | NIH AIM-AHEAD CLINAQ Fellowship (Grant 1OT2OD032581)</p>
        <p className="mt-2">
          Dr. Alexis M. Collier, DHA, MHA, RN | University of North Georgia<br />
          Research Prototype | Not for Clinical Use | For fellowship research and demonstration purposes only
        </p>
        <p className="mt-1 text-xs">
          Contact: info@alexiscollier.com | licensing@alexiscollier.com
        </p>
      </footer>
    </div>
  );
};

export default NursingDashboard;
