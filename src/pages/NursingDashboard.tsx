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
    <div className="min-h-screen bg-background">
      {/* Fellowship Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white py-3 px-4 text-center text-sm font-semibold sticky top-0 z-50 border-b-2 border-blue-400">
        NIH AIM-AHEAD CLINAQ Fellowship Project (Grant 1OT2OD032581) |{' '}
        <span className="text-amber-200 font-bold">VitaSignal Nursing Dashboard</span>
      </div>

      {/* Research Banner */}
      <div className="bg-red-50 text-red-800 py-2.5 px-4 text-center text-xs font-medium border-b border-red-200">
        RESEARCH PROTOTYPE - Not FDA cleared or approved. Not a medical device. Mock data for demonstration. Model validation pending.
      </div>

      {/* Header */}
      <header className="bg-card border-b border-border px-4 md:px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link to="/" aria-label="Back to Home">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight">VitaSignal Nursing</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Clinical Intelligence Platform</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold">
              Aim 2 Prototype
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold">
              SIMULATED DATA
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Disclaimer */}
        <Alert className="mb-8 border-l-4 border-l-amber-500 bg-amber-50 border-amber-200">
          <AlertDescription className="text-sm text-amber-900">
            <strong className="block mb-1 text-amber-800">Development Prototype - Mock Data Only</strong>
            This dashboard displays simulated data for demonstration purposes. Only VitaSignal Mortality (Patent #1, AUC 0.684, n=26,153) has completed validation. All other components are in design phase with clinical validation pending. Data shown does NOT represent actual patient information or clinical recommendations.
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs defaultValue="workload">
          <TabsList className="mb-6 bg-card border border-border flex-wrap h-auto gap-1.5 p-1.5 rounded-xl shadow-sm">
            {/* Nursing Tabs */}
            <TabsTrigger value="workload" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Workload</span> Prediction
            </TabsTrigger>
            <TabsTrigger value="surge" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <AlertTriangle className="h-4 w-4" />
              Surge Alerts
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <CheckSquare className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="burnout" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <Heart className="h-4 w-4" />
              Burnout
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            {/* Clinical Tools Tabs */}
            <TabsTrigger value="icu-mortality" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <HeartPulse className="h-4 w-4" />
              ICU Mortality
            </TabsTrigger>
            <TabsTrigger value="dbs" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              DBS Score
            </TabsTrigger>
            <TabsTrigger value="roi" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <DollarSign className="h-4 w-4" />
              ROI
            </TabsTrigger>
            <TabsTrigger value="linked" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <Link2 className="h-4 w-4" />
              Linked View
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              Research
            </TabsTrigger>
            <TabsTrigger value="ai-tools" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold text-xs sm:text-sm">
              <Sparkles className="h-4 w-4" />
              AI Tools
            </TabsTrigger>
          </TabsList>

          {/* Nursing Tabs */}
          <TabsContent value="workload"><WorkloadPrediction /></TabsContent>
          <TabsContent value="surge"><SurgeAlerts /></TabsContent>
          <TabsContent value="tasks"><TaskPrioritization /></TabsContent>
          <TabsContent value="burnout"><BurnoutTracking /></TabsContent>
          <TabsContent value="analytics"><WorkflowAnalytics /></TabsContent>

          {/* Clinical Tools Tabs */}
          <TabsContent value="icu-mortality"><ICUMortalityPrediction /></TabsContent>
          <TabsContent value="dbs"><DBSCalculator /></TabsContent>
          <TabsContent value="roi"><ROICalculator /></TabsContent>
          <TabsContent value="linked"><LinkedCalculatorView /></TabsContent>
          <TabsContent value="charts"><ResearchCharts /></TabsContent>
          <TabsContent value="ai-tools"><AIToolsPanel /></TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-muted-foreground text-sm border-t border-border mt-12">
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
