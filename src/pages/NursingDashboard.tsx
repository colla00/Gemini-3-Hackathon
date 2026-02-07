import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, TrendingUp, AlertTriangle, CheckSquare, Heart, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WorkloadPrediction } from '@/components/nursing/WorkloadPrediction';
import { SurgeAlerts } from '@/components/nursing/SurgeAlerts';
import { TaskPrioritization } from '@/components/nursing/TaskPrioritization';
import { BurnoutTracking } from '@/components/nursing/BurnoutTracking';
import { WorkflowAnalytics } from '@/components/nursing/WorkflowAnalytics';

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
                <p className="text-xs text-muted-foreground">AI-Powered Nursing Workload Optimization</p>
              </div>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold">
            Aim 2 Prototype
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Disclaimer */}
        <Alert className="mb-8 border-l-4 border-l-amber-500 bg-amber-50 border-amber-200">
          <AlertDescription className="text-sm text-amber-900">
            <strong className="block mb-1 text-amber-800">Development Prototype - Mock Data Only</strong>
            This dashboard displays simulated data for demonstration purposes. The workload prediction model is currently undergoing clinical validation on real OCHIN EHR data. Data shown here does NOT represent actual patient information or clinical recommendations. For fellowship research use only.
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs defaultValue="workload">
          <TabsList className="mb-6 bg-card border border-border flex-wrap h-auto gap-1.5 p-1.5 rounded-xl shadow-sm">
            <TabsTrigger value="workload" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold">
              <TrendingUp className="h-4 w-4" />
              Workload Prediction
            </TabsTrigger>
            <TabsTrigger value="surge" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold">
              <AlertTriangle className="h-4 w-4" />
              Surge Alerts
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold">
              <CheckSquare className="h-4 w-4" />
              Task Prioritization
            </TabsTrigger>
            <TabsTrigger value="burnout" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold">
              <Heart className="h-4 w-4" />
              Burnout Tracking
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white font-semibold">
              <BarChart3 className="h-4 w-4" />
              Workflow Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workload"><WorkloadPrediction /></TabsContent>
          <TabsContent value="surge"><SurgeAlerts /></TabsContent>
          <TabsContent value="tasks"><TaskPrioritization /></TabsContent>
          <TabsContent value="burnout"><BurnoutTracking /></TabsContent>
          <TabsContent value="analytics"><WorkflowAnalytics /></TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-muted-foreground text-sm border-t border-border mt-12">
        <p><strong>VitaSignal Nursing Dashboard</strong> | NIH AIM-AHEAD CLINAQ Fellowship (Grant 1OT2OD032581)</p>
        <p className="mt-2">
          Developed by Dr. Alexis M. Collier | Research Prototype - Not for Clinical Use<br />
          For fellowship research and demonstration purposes only.
        </p>
      </footer>
    </div>
  );
};

export default NursingDashboard;
