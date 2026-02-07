import { SiteLayout } from '@/components/layout/SiteLayout';
import { WatermarkOverlay } from '@/components/WatermarkOverlay';
import { Activity, TrendingUp, AlertTriangle, CheckSquare, Heart, BarChart3, FileText, DollarSign, Link2, Sparkles, HeartPulse, FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { ResearchValidationSection } from '@/components/dashboard/ResearchValidationSection';
import heroBg from '@/assets/hero-bg.jpg';

const stats = [
  { value: '0.684', label: 'AUC', detail: 'Predictive Performance' },
  { value: '26,153', label: 'ICU Admissions', detail: 'Validation Cohort' },
  { value: '5', label: 'Patents Filed', detail: '175+ Claims' },
  { value: '9', label: 'IDI Features', detail: 'Temporal Domains' },
];

export const NursingDashboard = () => {
  return (
    <SiteLayout
      title="Technology Demo"
      description="VitaSignal Clinical Intelligence Platform — interactive technology demonstration."
    >
      <WatermarkOverlay />

      {/* Dark Hero Section — matches landing page */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-20 md:pb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">VitaSignal Technology Demo</h1>
              <p className="text-sm text-primary-foreground/60">Clinical Intelligence Platform · Dr. Alexis Collier</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-semibold">DEMO MODE</Badge>
            <Badge className="bg-warning/20 text-warning border border-warning/30 text-[10px] font-semibold">SIMULATED DATA</Badge>
            <Badge className="bg-destructive/20 text-destructive border border-destructive/30 text-[10px] font-semibold">NOT FOR CLINICAL USE</Badge>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl px-4 py-3 text-center backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-[10px] font-semibold text-primary-foreground/70 uppercase tracking-wider">{s.label}</p>
                <p className="text-[10px] text-primary-foreground/40">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer bar */}
      <div className="bg-destructive/5 border-b border-destructive/20 py-2 px-4 text-center text-[11px] text-destructive font-medium">
        Development Prototype · Only VitaSignal Mortality (Patent #1) has completed validation · All other components are design phase · Mock data only
      </div>

      {/* Main Content */}
      <section className="py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="workload" className="animate-fade-in">
            <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-2 mb-6">
              {/* Nursing Operations */}
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

              {/* Clinical Tools */}
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

              {/* Research & AI */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-1">Research & AI</p>
                <TabsList className="bg-transparent flex-wrap h-auto gap-1 p-0">
                  <TabsTrigger value="research" className="gap-1.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md font-semibold text-xs">
                    <FlaskConical className="h-3.5 w-3.5" />
                    Validation
                  </TabsTrigger>
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
            <TabsContent value="research" className="mt-0"><ResearchValidationSection /></TabsContent>
            <TabsContent value="charts" className="mt-0"><ResearchCharts /></TabsContent>
            <TabsContent value="ai-tools" className="mt-0"><AIToolsPanel /></TabsContent>
          </Tabs>
        </div>
      </section>
    </SiteLayout>
  );
};

export default NursingDashboard;
