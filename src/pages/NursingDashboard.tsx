import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, TrendingUp, AlertTriangle, CheckSquare, Heart, BarChart3, FileText, DollarSign, Link2, Sparkles, HeartPulse } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-4 text-center text-sm font-semibold sticky top-0 z-50 border-b-2 border-accent/60">
        NIH AIM-AHEAD CLINAQ Fellowship Project (Grant 1OT2OD032581) |{' '}
        <span className="font-bold">VitaSignal Nursing Dashboard</span>
      </div>

      {/* Research Banner */}
      <div className="bg-destructive/10 text-destructive py-2.5 px-4 text-center text-xs font-medium border-b border-destructive/20">
        RESEARCH PROTOTYPE - Not FDA cleared or approved. Not a medical device. Mock data for demonstration. Model validation pending.
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
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground">VitaSignal Nursing</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Clinical Intelligence Platform</p>
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

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pb-24" role="main" aria-label="VitaSignal Nursing Dashboard">
        {/* Disclaimer */}
        <Alert className="mb-6 border-l-4 border-l-warning bg-warning/10 border-warning/30">
          <AlertDescription className="text-sm">
            <strong className="block mb-1">Development Prototype - Mock Data Only</strong>
            This dashboard displays simulated data for demonstration purposes. Only VitaSignal Mortality (Patent #1, AUC 0.684, n=26,153) has completed validation. All other components are in design phase with clinical validation pending.
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs defaultValue="workload" className="animate-fade-in">
          <TabsList className="mb-6 bg-card/60 border border-border/40 flex-wrap h-auto gap-1.5 p-1.5 rounded-2xl shadow-sm">
            <TabsTrigger value="workload" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4" />
              Workload
            </TabsTrigger>
            <TabsTrigger value="surge" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <AlertTriangle className="h-4 w-4" />
              Surge Alerts
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="burnout" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <Heart className="h-4 w-4" />
              Burnout
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="icu-mortality" className="gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <HeartPulse className="h-4 w-4" />
              ICU Mortality
            </TabsTrigger>
            <TabsTrigger value="dbs" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              DBS Score
            </TabsTrigger>
            <TabsTrigger value="roi" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <DollarSign className="h-4 w-4" />
              ROI
            </TabsTrigger>
            <TabsTrigger value="linked" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <Link2 className="h-4 w-4" />
              Linked View
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              Research
            </TabsTrigger>
            <TabsTrigger value="ai-tools" className="gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs sm:text-sm">
              <Sparkles className="h-4 w-4" />
              AI Tools
            </TabsTrigger>
          </TabsList>

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
        <p><strong>VitaSignal Nursing Dashboard</strong> | NIH AIM-AHEAD CLINAQ Fellowship (Grant 1OT2OD032581)</p>
        <p className="mt-2">
          Developed by Dr. Alexis M. Collier, DHA, MHA, RN | University of North Georgia<br />
          Research Prototype - Not for Clinical Use | For fellowship research and demonstration purposes only.
        </p>
      </footer>
    </div>
  );
};

export default NursingDashboard;
