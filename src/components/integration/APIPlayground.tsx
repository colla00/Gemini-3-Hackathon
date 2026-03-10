import { useState, useCallback, useMemo } from 'react';
import { Play, Loader2, Copy, Check, Clock, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// ── Syntax highlighting (JSON) ──────────────────────────────────────
// JSON is rendered as plain preformatted text for security (no dangerouslySetInnerHTML)

// ── Sample payloads ─────────────────────────────────────────────────
const SAMPLE_PAYLOADS: Record<string, { label: string; method: string; endpoint: string; body: string; description: string }> = {
  patient: {
    label: 'GET Patient',
    method: 'GET',
    endpoint: '/Patient/example-001',
    body: '',
    description: 'Retrieve a single patient resource by ID',
  },
  observation: {
    label: 'POST Observation',
    method: 'POST',
    endpoint: '/Observation',
    body: JSON.stringify({
      resourceType: 'Observation',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', display: 'Vital Signs' }] }],
      code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }], text: 'Heart rate' },
      subject: { reference: 'Patient/example-001' },
      effectiveDateTime: new Date().toISOString(),
      valueQuantity: { value: 78, unit: 'beats/minute', system: 'http://unitsofmeasure.org', code: '/min' },
    }, null, 2),
    description: 'Submit a new vital-sign observation (LOINC-coded)',
  },
  condition: {
    label: 'POST Condition',
    method: 'POST',
    endpoint: '/Condition',
    body: JSON.stringify({
      resourceType: 'Condition',
      clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
      verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed' }] },
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-category', code: 'problem-list-item' }] }],
      code: { coding: [{ system: 'http://snomed.info/sct', code: '44054006', display: 'Type 2 diabetes mellitus' }] },
      subject: { reference: 'Patient/example-001' },
      onsetDateTime: '2023-06-15',
    }, null, 2),
    description: 'Create a clinical condition (SNOMED CT coded)',
  },
  encounter: {
    label: 'GET Encounter',
    method: 'GET',
    endpoint: '/Encounter?patient=example-001&status=in-progress',
    body: '',
    description: 'Search for active encounters by patient',
  },
  bundle: {
    label: 'POST Bundle (Batch)',
    method: 'POST',
    endpoint: '/',
    body: JSON.stringify({
      resourceType: 'Bundle',
      type: 'batch',
      entry: [
        { request: { method: 'GET', url: 'Patient/example-001' } },
        { request: { method: 'GET', url: 'Observation?patient=example-001&_count=5&code=http://loinc.org|8867-4' } },
        { request: { method: 'GET', url: 'Condition?patient=example-001&clinical-status=active' } },
      ],
    }, null, 2),
    description: 'Execute multiple FHIR operations in a single batch request',
  },
};

// ── Mock response generator ─────────────────────────────────────────
const generateResponse = (sampleKey: string): { status: number; headers: Record<string, string>; body: object } => {
  const now = new Date().toISOString();
  const headers = {
    'Content-Type': 'application/fhir+json; charset=utf-8',
    'X-Request-Id': crypto.randomUUID().slice(0, 8),
    'X-Correlation-Id': crypto.randomUUID(),
    'X-RateLimit-Limit': '120',
    'X-RateLimit-Remaining': String(Math.floor(80 + Math.random() * 39)),
    'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60),
    'ETag': `W/"${Math.floor(Math.random() * 999)}"`,
    'Cache-Control': 'no-store',
    'X-FHIR-Version': '4.0.1',
  };

  const responses: Record<string, { status: number; body: object }> = {
    patient: {
      status: 200,
      body: {
        resourceType: 'Patient', id: 'example-001',
        meta: { versionId: '3', lastUpdated: now, profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'] },
        identifier: [
          { system: 'http://hospital.example.org/mrn', value: 'MRN-2024-001' },
          { system: 'http://vitasignal.ai/fhir/nso-id', value: 'NSO-P-00412' },
        ],
        name: [{ use: 'official', family: 'Johnson', given: ['Sarah', 'M'] }],
        telecom: [{ system: 'phone', value: '555-0142', use: 'mobile' }],
        gender: 'female', birthDate: '1965-03-15',
        address: [{ use: 'home', city: 'Rochester', state: 'MN', postalCode: '55901' }],
        active: true,
        extension: [
          { url: 'http://vitasignal.ai/fhir/StructureDefinition/nso-risk-score', valueDecimal: 7.2 },
          { url: 'http://vitasignal.ai/fhir/StructureDefinition/monitoring-tier', valueString: 'continuous' },
        ],
      },
    },
    observation: {
      status: 201,
      body: {
        resourceType: 'Observation', id: `obs-${Date.now().toString(36)}`,
        meta: { versionId: '1', lastUpdated: now },
        status: 'final',
        category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs', display: 'Vital Signs' }] }],
        code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }], text: 'Heart rate' },
        subject: { reference: 'Patient/example-001', display: 'Johnson, Sarah M' },
        effectiveDateTime: now,
        valueQuantity: { value: 78, unit: 'beats/minute', system: 'http://unitsofmeasure.org', code: '/min' },
        interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'N', display: 'Normal' }] }],
        device: { display: 'VitaSignal NSO Patch v2.1' },
      },
    },
    condition: {
      status: 201,
      body: {
        resourceType: 'Condition', id: `cond-${Date.now().toString(36)}`,
        meta: { versionId: '1', lastUpdated: now },
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
        verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'confirmed' }] },
        code: { coding: [{ system: 'http://snomed.info/sct', code: '44054006', display: 'Type 2 diabetes mellitus' }] },
        subject: { reference: 'Patient/example-001', display: 'Johnson, Sarah M' },
        onsetDateTime: '2023-06-15',
        recorder: { display: 'VitaSignal Clinical AI' },
      },
    },
    encounter: {
      status: 200,
      body: {
        resourceType: 'Bundle', type: 'searchset', total: 1,
        link: [{ relation: 'self', url: 'https://api.vitasignal.com/fhir/r4/Encounter?patient=example-001&status=in-progress' }],
        entry: [{
          fullUrl: 'https://api.vitasignal.com/fhir/r4/Encounter/enc-001',
          resource: {
            resourceType: 'Encounter', id: 'enc-001', status: 'in-progress',
            class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'IMP', display: 'inpatient encounter' },
            type: [{ coding: [{ system: 'http://snomed.info/sct', code: '183452005', display: 'General examination' }] }],
            subject: { reference: 'Patient/example-001', display: 'Johnson, Sarah M' },
            period: { start: new Date(Date.now() - 86400000).toISOString() },
            location: [{ location: { display: 'ICU Bed 4C-12' }, status: 'active' }],
            serviceProvider: { display: 'VitaSignal Connected Care' },
          },
          search: { mode: 'match' },
        }],
      },
    },
    bundle: {
      status: 200,
      body: {
        resourceType: 'Bundle', type: 'batch-response',
        entry: [
          { response: { status: '200 OK', etag: 'W/"3"' }, resource: { resourceType: 'Patient', id: 'example-001', name: [{ family: 'Johnson', given: ['Sarah'] }], active: true } },
          { response: { status: '200 OK' }, resource: { resourceType: 'Bundle', type: 'searchset', total: 3 } },
          { response: { status: '200 OK' }, resource: { resourceType: 'Bundle', type: 'searchset', total: 1 } },
        ],
      },
    },
  };

  const r = responses[sampleKey] || responses.patient;
  return { ...r, headers };
};

// ── History entry ───────────────────────────────────────────────────
interface HistoryEntry {
  id: string;
  method: string;
  endpoint: string;
  status: number;
  time: number;
  timestamp: Date;
  sampleKey: string;
}

// ── Component ───────────────────────────────────────────────────────
export const APIPlayground = () => {
  const [selectedSample, setSelectedSample] = useState('patient');
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/Patient/example-001');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<{ status: number; headers: Record<string, string>; body: string; time: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [responseTab, setResponseTab] = useState('body');

  const loadSample = useCallback((key: string) => {
    const sample = SAMPLE_PAYLOADS[key];
    setSelectedSample(key);
    setMethod(sample.method);
    setEndpoint(sample.endpoint);
    setRequestBody(sample.body);
    setResponse(null);
  }, []);

  const executeRequest = useCallback(async () => {
    setIsLoading(true);
    const start = performance.now();

    // Simulate realistic latency
    await new Promise(r => setTimeout(r, 200 + Math.random() * 500));

    const mock = generateResponse(selectedSample);
    const elapsed = Math.round(performance.now() - start);
    const bodyStr = JSON.stringify(mock.body, null, 2);

    setResponse({ status: mock.status, headers: mock.headers, body: bodyStr, time: elapsed });
    setHistory(prev => [{
      id: crypto.randomUUID(),
      method,
      endpoint,
      status: mock.status,
      time: elapsed,
      timestamp: new Date(),
      sampleKey: selectedSample,
    }, ...prev].slice(0, 20));
    setResponseTab('body');
    setIsLoading(false);
  }, [selectedSample, method, endpoint]);

  const replayHistory = useCallback((entry: HistoryEntry) => {
    loadSample(entry.sampleKey);
  }, [loadSample]);

  const copyResponse = useCallback(() => {
    if (response) {
      navigator.clipboard.writeText(response.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [response]);

  const statusColor = (code: number) =>
    code < 300 ? 'text-emerald-600 dark:text-emerald-400' : code < 400 ? 'text-amber-600' : 'text-destructive';

  const statusBg = (code: number) =>
    code < 300 ? 'bg-emerald-500/10 border-emerald-500/20' : code < 400 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-destructive/10 border-destructive/20';

  const methodColor = (m: string) => {
    switch (m) {
      case 'GET': return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20';
      case 'POST': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
      case 'PUT': return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20';
      case 'DELETE': return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const highlightedBody = useMemo(() => {
    if (!response) return '';
    return highlightJSON(response.body);
  }, [response]);

  const sampleDescription = SAMPLE_PAYLOADS[selectedSample]?.description || '';

  return (
    <div className="space-y-5">
      {/* Header info */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">FHIR R4 API Playground</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Send test requests against the VitaSignal sandbox. All responses follow HL7 FHIR R4 (v4.0.1) with US Core profiles.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">Sandbox Active</span>
        </div>
      </div>

      {/* Sample selector chips */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(SAMPLE_PAYLOADS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => loadSample(key)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              selectedSample === key
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            )}
          >
            <span className={cn('inline-block w-1.5 h-1.5 rounded-full', methodColor(val.method))} />
            {val.label}
          </button>
        ))}
      </div>

      {sampleDescription && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2 border border-border/50">
          {sampleDescription}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Request panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="flex gap-2">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className={cn('w-[90px] h-9 text-xs font-mono font-semibold border', methodColor(method))}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
                      <SelectItem key={m} value={m} className="font-mono text-xs">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex-1 flex items-center bg-muted/50 rounded-md border border-border/60 px-3 overflow-hidden">
                  <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap select-none">https://api.vitasignal.com/fhir/r4</span>
                  <input
                    value={endpoint}
                    onChange={e => setEndpoint(e.target.value)}
                    className="flex-1 bg-transparent text-xs font-mono py-2 px-1 outline-none text-foreground min-w-0"
                    spellCheck={false}
                  />
                </div>
                <Button onClick={executeRequest} disabled={isLoading} size="sm" className="px-5 h-9 gap-1.5">
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  Send
                </Button>
              </div>

              {(method === 'POST' || method === 'PUT') && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Request Body (JSON)</Label>
                  <Textarea
                    value={requestBody}
                    onChange={e => setRequestBody(e.target.value)}
                    className="font-mono text-xs min-h-[180px] bg-[#0d1117] text-emerald-300 border-border/40 rounded-md"
                    placeholder='{"resourceType": "..."}'
                    spellCheck={false}
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono">FHIR R4 v4.0.1</Badge>
                <Badge variant="outline" className="text-[10px] font-mono">HMAC-SHA256</Badge>
                <Badge variant="outline" className="text-[10px] font-mono">US Core 6.1</Badge>
                <Badge variant="outline" className="text-[10px] font-mono">Sandbox</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Response panel */}
          {response && (
            <Card className="border-border/60">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Response</CardTitle>
                    <Badge variant="outline" className={cn('font-mono text-xs border', statusBg(response.status), statusColor(response.status))}>
                      {response.status} {response.status === 200 ? 'OK' : response.status === 201 ? 'Created' : 'Error'}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">{response.time}ms</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {(new Blob([response.body]).size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyResponse} className="h-7 text-xs gap-1">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <Tabs value={responseTab} onValueChange={setResponseTab}>
                  <TabsList className="h-8 mb-3">
                    <TabsTrigger value="body" className="text-xs h-6 px-3">Body</TabsTrigger>
                    <TabsTrigger value="headers" className="text-xs h-6 px-3">
                      Headers
                      <Badge variant="secondary" className="ml-1.5 text-[9px] h-4 px-1">{Object.keys(response.headers).length}</Badge>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="body" className="mt-0">
                    <ScrollArea className="h-[380px] rounded-md">
                      <pre className="bg-[#0d1117] text-[#e6edf3] rounded-md p-4 text-xs font-mono leading-5 overflow-x-auto whitespace-pre-wrap">
                        {response.body}
                      </pre>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="headers" className="mt-0">
                    <div className="bg-[#0d1117] rounded-md p-4 space-y-1">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="flex items-baseline gap-2 text-xs font-mono">
                          <span className="text-sky-400 select-all">{key}:</span>
                          <span className="text-[#e6edf3] break-all">{value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* History sidebar */}
        <div className="space-y-3">
          <Card className="border-border/60">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> History
                </CardTitle>
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => setHistory([])}>
                    <Trash2 className="w-3 h-3 mr-1" /> Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              {history.length === 0 ? (
                <p className="text-[11px] text-muted-foreground text-center py-6">
                  No requests yet. Send a request to see history.
                </p>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-1 px-2">
                    {history.map(entry => (
                      <button
                        key={entry.id}
                        onClick={() => replayHistory(entry)}
                        className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left hover:bg-muted/70 transition-colors group"
                      >
                        <Badge variant="outline" className={cn('text-[9px] font-mono px-1.5 py-0 shrink-0', methodColor(entry.method))}>
                          {entry.method}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-mono text-foreground truncate">{entry.endpoint}</p>
                          <p className="text-[9px] text-muted-foreground">
                            {entry.timestamp.toLocaleTimeString()} · {entry.time}ms
                          </p>
                        </div>
                        <Badge variant="outline" className={cn('text-[9px] font-mono shrink-0', statusColor(entry.status))}>
                          {entry.status}
                        </Badge>
                        <RotateCcw className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Quick reference */}
          <Card className="border-border/60">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Auth Headers</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="bg-[#0d1117] rounded-md p-3 space-y-1.5 text-[10px] font-mono">
                <div><span className="text-sky-400">Authorization:</span> <span className="text-[#e6edf3]">Bearer {'<'}api_key{'>'}</span></div>
                <div><span className="text-sky-400">X-VS-Signature:</span> <span className="text-[#e6edf3]">hmac-sha256=...</span></div>
                <div><span className="text-sky-400">Content-Type:</span> <span className="text-[#e6edf3]">application/fhir+json</span></div>
                <div><span className="text-sky-400">X-VS-Timestamp:</span> <span className="text-[#e6edf3]">{Math.floor(Date.now() / 1000)}</span></div>
              </div>
              <Separator className="my-3" />
              <div className="text-[10px] text-muted-foreground space-y-1">
                <p><strong className="text-foreground">Rate Limit:</strong> 120 req/min per key</p>
                <p><strong className="text-foreground">Max Payload:</strong> 500 KB</p>
                <p><strong className="text-foreground">Sandbox TTL:</strong> Data resets every 24h</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
