import { useState } from 'react';
import { Play, Loader2, Copy, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SAMPLE_PAYLOADS: Record<string, { label: string; method: string; endpoint: string; body: string }> = {
  patient: {
    label: 'GET Patient',
    method: 'GET',
    endpoint: '/Patient/example-001',
    body: '',
  },
  observation: {
    label: 'POST Observation',
    method: 'POST',
    endpoint: '/Observation',
    body: JSON.stringify({
      resourceType: 'Observation',
      status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
      code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }] },
      subject: { reference: 'Patient/example-001' },
      effectiveDateTime: new Date().toISOString(),
      valueQuantity: { value: 78, unit: 'beats/minute', system: 'http://unitsofmeasure.org', code: '/min' },
    }, null, 2),
  },
  encounter: {
    label: 'GET Encounter',
    method: 'GET',
    endpoint: '/Encounter?patient=example-001&status=in-progress',
    body: '',
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
        { request: { method: 'GET', url: 'Observation?patient=example-001&_count=5' } },
      ],
    }, null, 2),
  },
};

// Simulated FHIR responses
const MOCK_RESPONSES: Record<string, { status: number; body: object }> = {
  patient: {
    status: 200,
    body: {
      resourceType: 'Patient',
      id: 'example-001',
      meta: { versionId: '1', lastUpdated: new Date().toISOString() },
      identifier: [{ system: 'http://hospital.example.org/mrn', value: 'MRN-2024-001' }],
      name: [{ use: 'official', family: 'Johnson', given: ['Sarah', 'M'] }],
      gender: 'female',
      birthDate: '1965-03-15',
      active: true,
    },
  },
  observation: {
    status: 201,
    body: {
      resourceType: 'Observation',
      id: 'obs-vitals-001',
      meta: { versionId: '1', lastUpdated: new Date().toISOString() },
      status: 'final',
      code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }] },
      subject: { reference: 'Patient/example-001' },
      valueQuantity: { value: 78, unit: 'beats/minute' },
    },
  },
  encounter: {
    status: 200,
    body: {
      resourceType: 'Bundle',
      type: 'searchset',
      total: 1,
      entry: [{
        resource: {
          resourceType: 'Encounter',
          id: 'enc-001',
          status: 'in-progress',
          class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'IMP', display: 'inpatient encounter' },
          subject: { reference: 'Patient/example-001' },
          period: { start: new Date(Date.now() - 86400000).toISOString() },
          location: [{ location: { display: 'ICU Bed 4C-12' } }],
        },
      }],
    },
  },
  bundle: {
    status: 200,
    body: {
      resourceType: 'Bundle',
      type: 'batch-response',
      entry: [
        { response: { status: '200 OK' }, resource: { resourceType: 'Patient', id: 'example-001', name: [{ family: 'Johnson' }] } },
        { response: { status: '200 OK' }, resource: { resourceType: 'Bundle', type: 'searchset', total: 3 } },
      ],
    },
  },
};

export const APIPlayground = () => {
  const [selectedSample, setSelectedSample] = useState('patient');
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/Patient/example-001');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<{ status: number; body: string; time: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const loadSample = (key: string) => {
    const sample = SAMPLE_PAYLOADS[key];
    setSelectedSample(key);
    setMethod(sample.method);
    setEndpoint(sample.endpoint);
    setRequestBody(sample.body);
    setResponse(null);
  };

  const executeRequest = async () => {
    setIsLoading(true);
    const start = performance.now();

    // Simulate network latency
    await new Promise(r => setTimeout(r, 300 + Math.random() * 700));

    const mock = MOCK_RESPONSES[selectedSample] || MOCK_RESPONSES.patient;
    const elapsed = Math.round(performance.now() - start);

    setResponse({
      status: mock.status,
      body: JSON.stringify(mock.body, null, 2),
      time: elapsed,
    });
    setIsLoading(false);
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusColor = (code: number) =>
    code < 300 ? 'text-emerald-600' : code < 400 ? 'text-amber-600' : 'text-destructive';

  return (
    <div className="space-y-6">
      {/* Sample selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(SAMPLE_PAYLOADS).map(([key, val]) => (
          <Button
            key={key}
            variant={selectedSample === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => loadSample(key)}
            className="text-xs"
          >
            {val.label}
          </Button>
        ))}
      </div>

      {/* Request builder */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-[100px] h-9 text-xs font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['GET', 'POST', 'PUT', 'DELETE'].map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 flex items-center gap-0 bg-muted rounded-md border px-3">
              <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">https://api.vitasignal.com/fhir/r4</span>
              <input
                value={endpoint}
                onChange={e => setEndpoint(e.target.value)}
                className="flex-1 bg-transparent text-xs font-mono py-2 px-1 outline-none"
              />
            </div>
            <Button onClick={executeRequest} disabled={isLoading} size="sm" className="px-4">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>

          {(method === 'POST' || method === 'PUT') && (
            <div className="space-y-1.5">
              <Label className="text-xs">Request Body (JSON)</Label>
              <Textarea
                value={requestBody}
                onChange={e => setRequestBody(e.target.value)}
                className="font-mono text-xs min-h-[150px] bg-muted"
                placeholder='{"resourceType": "..."}'
              />
            </div>
          )}

          <div className="flex gap-2 text-[10px] text-muted-foreground">
            <Badge variant="outline" className="text-[10px]">FHIR R4</Badge>
            <Badge variant="outline" className="text-[10px]">HMAC-SHA256</Badge>
            <Badge variant="outline" className="text-[10px]">Sandbox Mode</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Response */}
      {response && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-3">
                Response
                <Badge variant="outline" className={cn('font-mono text-xs', statusColor(response.status))}>
                  {response.status} {response.status === 200 ? 'OK' : response.status === 201 ? 'Created' : 'Error'}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-normal">{response.time}ms</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={copyResponse} className="h-7 text-xs">
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted rounded-md p-4 text-xs font-mono overflow-x-auto max-h-[400px] overflow-y-auto whitespace-pre-wrap">
              {response.body}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
