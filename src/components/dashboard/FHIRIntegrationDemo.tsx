import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Server, Activity, FileText, Pill, Users, Shield, Code2, Play, Pause, ChevronRight, DollarSign, Zap, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// FHIR Resource types
type FHIRResourceType = 'Patient' | 'Observation' | 'Encounter' | 'Condition';

interface FHIRMessage {
  id: string;
  timestamp: string;
  resourceType: FHIRResourceType;
  action: 'CREATE' | 'UPDATE' | 'READ';
  status: 'success' | 'processing' | 'queued';
  latencyMs: number;
  patientId?: string;
  summary: string;
  vendor?: string;
}

type EHRVendor = 'all' | 'epic' | 'cerner' | 'meditech' | 'allscripts';

const vendorLabels: Record<EHRVendor, string> = {
  all: 'All Systems',
  epic: 'Epic',
  cerner: 'Oracle Health',
  meditech: 'MEDITECH',
  allscripts: 'Allscripts',
};

const vendorList: EHRVendor[] = ['epic', 'cerner', 'meditech', 'allscripts'];

const resourceColors: Record<FHIRResourceType, string> = {
  Patient: 'text-chart-1 bg-chart-1/10 border-chart-1/30',
  Observation: 'text-risk-low bg-risk-low/10 border-risk-low/30',
  Encounter: 'text-warning bg-warning/10 border-warning/30',
  Condition: 'text-destructive bg-destructive/10 border-destructive/30',
};

const resourceIcons: Record<FHIRResourceType, React.ReactNode> = {
  Patient: <Users className="h-3.5 w-3.5" />,
  Observation: <Activity className="h-3.5 w-3.5" />,
  Encounter: <FileText className="h-3.5 w-3.5" />,
  Condition: <AlertTriangle className="h-3.5 w-3.5" />,
};

const sampleEndpoints = [
  { method: 'GET', path: '/fhir/r4/Patient/{id}', description: 'Retrieve patient demographics' },
  { method: 'GET', path: '/fhir/r4/Patient/{id}/$everything', description: 'Full patient record bundle' },
  { method: 'GET', path: '/fhir/r4/Observation?patient={id}&category=vital-signs', description: 'Patient vital signs' },
  { method: 'GET', path: '/fhir/r4/Encounter?patient={id}&status=in-progress', description: 'Active encounters' },
  { method: 'POST', path: '/fhir/r4/Observation', description: 'Submit new observation' },
  { method: 'GET', path: '/fhir/r4/Condition?patient={id}&clinical-status=active', description: 'Active conditions' },
];

const generateMessage = (id: number): FHIRMessage => {
  const types: FHIRResourceType[] = ['Patient', 'Observation', 'Encounter', 'Condition'];
  const actions: Array<'CREATE' | 'UPDATE' | 'READ'> = ['CREATE', 'UPDATE', 'READ'];
  const type = types[Math.floor(Math.random() * types.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const summaries: Record<FHIRResourceType, string[]> = {
    Patient: ['Demographics updated', 'New admission registered', 'Insurance verified', 'Allergies updated'],
    Observation: ['Vitals recorded: HR 78, BP 120/80', 'Lab result: WBC 11.2', 'SpO₂ 96% documented', 'Temperature 98.6°F logged'],
    Encounter: ['ICU admission initiated', 'Transfer to Med-Surg', 'Discharge planning started', 'ED visit documented'],
    Condition: ['Sepsis risk flagged', 'Fall risk assessment updated', 'Pressure injury stage II noted', 'CAUTI screening completed'],
  };
  return {
    id: `MSG-${String(id).padStart(5, '0')}`,
    timestamp: new Date().toISOString(),
    resourceType: type,
    action,
    status: Math.random() > 0.1 ? 'success' : 'processing',
    latencyMs: Math.floor(Math.random() * 200) + 15,
    patientId: `PT-${Math.floor(Math.random() * 9000) + 1000}`,
    summary: summaries[type][Math.floor(Math.random() * summaries[type].length)],
  };
};

export const FHIRIntegrationDemo = () => {
  const [messages, setMessages] = useState<FHIRMessage[]>(() => Array.from({ length: 8 }, (_, i) => generateMessage(i + 1)));
  const [isStreaming, setIsStreaming] = useState(true);
  const [msgCounter, setMsgCounter] = useState(9);
  const [totalProcessed, setTotalProcessed] = useState(12847);
  const [avgLatency, setAvgLatency] = useState(42);
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Live message streaming
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setMsgCounter(prev => {
        const next = prev + 1;
        const msg = generateMessage(next);
        setMessages(prev => [msg, ...prev].slice(0, 20));
        setTotalProcessed(p => p + 1);
        setAvgLatency(p => Math.max(15, Math.min(80, p + (Math.random() - 0.5) * 4)));
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Call FHIR simulator edge function
  const callFHIREndpoint = useCallback(async (endpointIndex: number) => {
    setApiLoading(true);
    setSelectedEndpoint(endpointIndex);
    const ep = sampleEndpoints[endpointIndex];
    try {
      const resourceType = ep.path.includes('Patient') ? 'Patient'
        : ep.path.includes('Observation') ? 'Observation'
        : ep.path.includes('Encounter') ? 'Encounter'
        : 'Condition';

      const { data, error } = await supabase.functions.invoke('fhir-simulator', {
        body: { resourceType, patientId: 'PT-4821', action: ep.method === 'POST' ? 'create' : 'read' },
      });

      if (error) throw error;
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      // Fallback to local mock
      const mockResponses: Record<string, object> = {
        Patient: {
          resourceType: 'Patient', id: 'PT-4821', meta: { versionId: '3', lastUpdated: new Date().toISOString() },
          identifier: [{ system: 'urn:oid:2.16.840.1.113883.4.1', value: '***-**-4821' }],
          name: [{ family: 'Martinez', given: ['Rosa'], use: 'official' }],
          gender: 'female', birthDate: '1958-03-15',
          address: [{ city: 'Chicago', state: 'IL' }],
        },
        Observation: {
          resourceType: 'Bundle', type: 'searchset', total: 4,
          entry: [
            { resource: { resourceType: 'Observation', status: 'final', code: { text: 'Heart Rate' }, valueQuantity: { value: 78, unit: 'bpm' }, effectiveDateTime: new Date().toISOString() } },
            { resource: { resourceType: 'Observation', status: 'final', code: { text: 'Blood Pressure' }, component: [{ code: { text: 'Systolic' }, valueQuantity: { value: 128, unit: 'mmHg' } }, { code: { text: 'Diastolic' }, valueQuantity: { value: 82, unit: 'mmHg' } }] } },
            { resource: { resourceType: 'Observation', status: 'final', code: { text: 'SpO2' }, valueQuantity: { value: 96, unit: '%' } } },
            { resource: { resourceType: 'Observation', status: 'final', code: { text: 'Temperature' }, valueQuantity: { value: 98.4, unit: '°F' } } },
          ],
        },
        Encounter: {
          resourceType: 'Bundle', type: 'searchset', total: 1,
          entry: [{ resource: { resourceType: 'Encounter', status: 'in-progress', class: { code: 'IMP', display: 'Inpatient' }, period: { start: '2026-03-04T08:00:00Z' }, location: [{ location: { display: 'ICU-A Room 412' } }] } }],
        },
        Condition: {
          resourceType: 'Bundle', type: 'searchset', total: 2,
          entry: [
            { resource: { resourceType: 'Condition', clinicalStatus: { coding: [{ code: 'active' }] }, code: { text: 'Fall Risk - High' }, severity: { text: 'High' } } },
            { resource: { resourceType: 'Condition', clinicalStatus: { coding: [{ code: 'active' }] }, code: { text: 'Pressure Injury Risk' }, severity: { text: 'Moderate' } } },
          ],
        },
      };
      const resourceType = ep.path.includes('Patient') ? 'Patient'
        : ep.path.includes('Observation') ? 'Observation'
        : ep.path.includes('Encounter') ? 'Encounter' : 'Condition';
      setApiResponse(JSON.stringify(mockResponses[resourceType] || {}, null, 2));
    } finally {
      setApiLoading(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-chart-1/30 bg-gradient-to-br from-chart-1/[0.06] to-transparent overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--chart-1)/0.08),transparent_70%)]" />
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-chart-1/15 border border-chart-1/25 shadow-lg shadow-chart-1/10">
                <Database className="w-5 h-5 text-chart-1" />
              </div>
              <div>
                <CardTitle className="text-lg">Real-Time EHR FHIR Integration</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">HL7 FHIR R4 compliant data pipeline with live message streaming and API explorer</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                className={cn("text-[10px] h-7", isStreaming && "border-risk-low/30 text-risk-low")}
                onClick={() => setIsStreaming(!isStreaming)}
              >
                {isStreaming ? <><Pause className="h-3 w-3 mr-1" /> Pause</> : <><Play className="h-3 w-3 mr-1" /> Resume</>}
              </Button>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-risk-low/10 border border-risk-low/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low" />
                </span>
                <span className="text-[10px] font-semibold text-risk-low">FHIR R4</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Messages Processed', value: totalProcessed.toLocaleString(), icon: <Activity className="h-4 w-4" />, color: 'text-chart-1' },
          { label: 'Avg Latency', value: `${avgLatency.toFixed(0)}ms`, icon: <Clock className="h-4 w-4" />, color: 'text-warning' },
          { label: 'Success Rate', value: '99.7%', icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-risk-low' },
          { label: 'Integration ROI', value: '$1.2M', icon: <DollarSign className="h-4 w-4" />, color: 'text-primary' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.08 }}>
            <Card className="border-border/40 bg-gradient-to-b from-background to-muted/20 hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className={cn('mx-auto mb-1.5', k.color)}>{k.icon}</div>
                <p className={cn('text-2xl font-bold tabular-nums', k.color)}>{k.value}</p>
                <p className="text-[10px] font-semibold text-foreground mt-0.5">{k.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="stream" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="stream" className="flex-1 text-xs">Live Message Stream</TabsTrigger>
          <TabsTrigger value="api" className="flex-1 text-xs">API Explorer</TabsTrigger>
        </TabsList>

        {/* Live Stream Tab */}
        <TabsContent value="stream">
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <RefreshCw className={cn("h-4 w-4 text-chart-1", isStreaming && "animate-spin")} />
                HL7 FHIR R4 Message Stream
                <Badge variant="outline" className="text-[9px] ml-auto tabular-nums">{totalProcessed.toLocaleString()} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn("flex items-center gap-3 p-2.5 rounded-lg border", resourceColors[msg.resourceType])}
                    >
                      <div className="shrink-0">{resourceIcons[msg.resourceType]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("text-[8px] font-mono", resourceColors[msg.resourceType])}>{msg.resourceType}</Badge>
                          <Badge variant="outline" className="text-[8px]">{msg.action}</Badge>
                          <span className="text-[9px] text-muted-foreground font-mono">{msg.patientId}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{msg.summary}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-bold text-foreground tabular-nums">{msg.latencyMs}ms</p>
                        <p className="text-[8px] text-muted-foreground">{msg.id}</p>
                      </div>
                      <CheckCircle2 className={cn("h-3.5 w-3.5 shrink-0", msg.status === 'success' ? 'text-risk-low' : 'text-warning animate-pulse')} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Explorer Tab */}
        <TabsContent value="api">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Server className="h-4 w-4 text-chart-1" />
                  FHIR R4 Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sampleEndpoints.map((ep, i) => (
                  <button
                    key={i}
                    onClick={() => callFHIREndpoint(i)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-all',
                      selectedEndpoint === i ? 'border-chart-1/40 bg-chart-1/5 shadow-sm' : 'border-border/30 hover:border-chart-1/20'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn("text-[9px] font-mono", ep.method === 'GET' ? 'bg-risk-low/10 text-risk-low border-risk-low/30' : 'bg-warning/10 text-warning border-warning/30')} variant="outline">
                        {ep.method}
                      </Badge>
                      <code className="text-[10px] text-foreground font-mono truncate">{ep.path}</code>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{ep.description}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-chart-1" />
                  Response
                  {apiLoading && <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground ml-auto" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {apiResponse ? (
                  <pre className="text-[10px] font-mono bg-secondary/50 p-4 rounded-lg border border-border/30 overflow-auto max-h-[340px] text-foreground whitespace-pre-wrap">
                    {apiResponse}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[340px] text-muted-foreground">
                    <Code2 className="h-8 w-8 mb-2 opacity-40" />
                    <p className="text-xs">Select an endpoint to view response</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Enterprise ROI */}
      <Card className="bg-gradient-to-r from-chart-1/10 via-primary/5 to-transparent border-chart-1/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-chart-1/15">
              <Shield className="w-5 h-5 text-chart-1" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">Enterprise FHIR Integration Value</p>
              <p className="text-[10px] text-muted-foreground">
                Standards-based HL7 FHIR R4 integration eliminates vendor-specific adapters. One connection
                unlocks all 11 VitaSignal patent capabilities — predictive risk, staffing optimization,
                quality surveillance, digital twins, clinical trial matching, and syndromic surveillance.
                Reduces integration from 6-12 months to 4-6 weeks*.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-chart-1">$1.2M</p>
              <p className="text-[9px] text-muted-foreground">integration savings*</p>
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/60 mt-2">*Design-phase estimates. For illustration only.</p>
        </CardContent>
      </Card>
    </div>
  );
};
