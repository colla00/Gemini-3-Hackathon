import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, Play, CheckCircle2, ArrowRight, User, FileText, 
  Key, Server, Zap, RotateCcw, Copy, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface LaunchStep {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  code?: string;
  status: 'pending' | 'active' | 'complete';
}

const initialSteps: LaunchStep[] = [
  {
    id: 1,
    name: 'EHR Launch Request',
    description: 'User clicks "Launch VitaSignal" in Epic/Cerner toolbar',
    icon: User,
    code: `GET /launch?iss=https://fhir.epic.com/sandbox&launch=abc123`,
    status: 'pending',
  },
  {
    id: 2,
    name: 'SMART Authorization',
    description: 'Redirect to EHR authorization server with scopes',
    icon: Shield,
    code: `GET /authorize?
  response_type=code
  &client_id=vitasignal-app
  &redirect_uri=https://vitasignal.ai/callback
  &scope=launch patient/*.read openid fhirUser
  &state=xyz789
  &aud=https://fhir.epic.com/api/FHIR/R4`,
    status: 'pending',
  },
  {
    id: 3,
    name: 'Token Exchange',
    description: 'Exchange authorization code for access token',
    icon: Key,
    code: `POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https://vitasignal.ai/callback
&client_id=vitasignal-app`,
    status: 'pending',
  },
  {
    id: 4,
    name: 'FHIR Context',
    description: 'Retrieve patient context from launch parameters',
    icon: FileText,
    code: `{
  "access_token": "eyJ0eXAiOiJKV1QiLC...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "launch patient/*.read openid",
  "patient": "12345",
  "encounter": "67890"
}`,
    status: 'pending',
  },
  {
    id: 5,
    name: 'Load Patient Data',
    description: 'Fetch patient resources using access token',
    icon: Server,
    code: `GET /fhir/r4/Patient/12345
Authorization: Bearer eyJ0eXAiOiJKV1QiLC...

GET /fhir/r4/Observation?patient=12345&category=vital-signs
GET /fhir/r4/Encounter?patient=12345&status=in-progress`,
    status: 'pending',
  },
  {
    id: 6,
    name: 'VitaSignal Ready',
    description: 'App displays embedded within EHR with patient context',
    icon: Zap,
    status: 'pending',
  },
];

export const SMARTLaunchDemo = () => {
  const [steps, setSteps] = useState<LaunchStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const runDemo = async () => {
    setIsRunning(true);
    setSteps(initialSteps);
    setCurrentStep(0);

    for (let i = 0; i < initialSteps.length; i++) {
      setCurrentStep(i);
      setSteps(prev => prev.map((s, idx) => ({
        ...s,
        status: idx < i ? 'complete' : idx === i ? 'active' : 'pending'
      })));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Mark all complete
    setSteps(prev => prev.map(s => ({ ...s, status: 'complete' })));
    setCurrentStep(initialSteps.length);
    setIsRunning(false);
    toast.success('SMART on FHIR launch complete!');
  };

  const resetDemo = () => {
    setSteps(initialSteps);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard');
  };

  const activeStep = steps.find(s => s.status === 'active') || steps[0];

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">SMART on FHIR Launch Flow</CardTitle>
              <p className="text-xs text-muted-foreground">
                Interactive demo of EHR app authorization sequence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetDemo}
              disabled={isRunning}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={runDemo}
              disabled={isRunning}
              className="bg-primary"
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              {isRunning ? 'Running...' : 'Run Demo'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Flow diagram */}
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all duration-300",
                  step.status === 'active' && "bg-primary/10 border-primary shadow-sm",
                  step.status === 'complete' && "bg-green-500/5 border-green-500/30",
                  step.status === 'pending' && "bg-secondary/30 border-border/50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  step.status === 'active' && "bg-primary text-primary-foreground",
                  step.status === 'complete' && "bg-green-500 text-white",
                  step.status === 'pending' && "bg-muted text-muted-foreground"
                )}>
                  {step.status === 'complete' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      "text-sm font-medium",
                      step.status === 'active' && "text-primary",
                      step.status === 'complete' && "text-green-600",
                      step.status === 'pending' && "text-muted-foreground"
                    )}>
                      {step.name}
                    </p>
                    {step.status === 'active' && (
                      <Badge variant="outline" className="text-[10px] animate-pulse border-primary text-primary">
                        Processing
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className={cn(
                    "w-4 h-4 shrink-0 mt-2",
                    step.status === 'complete' ? "text-green-500" : "text-muted-foreground/30"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Right: Code panel */}
          <div>
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {activeStep?.name || 'Launch Request'}
                </p>
                {activeStep?.code && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCode(activeStep.code!)}
                    className="h-6 px-2"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                )}
              </div>
              <pre className="bg-foreground text-primary-foreground rounded-lg p-4 text-xs font-mono overflow-x-auto min-h-[200px]">
                {activeStep?.code || `// Click "Run Demo" to see the SMART launch flow\n\n// This demo simulates the OAuth 2.0 authorization\n// sequence used by SMART on FHIR applications.`}
              </pre>

              <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-accent">SMART on FHIR</strong> enables secure, embedded app launches
                  directly within EHR workflows. VitaSignal supports both <code className="text-accent">EHR Launch</code> and{' '}
                  <code className="text-accent">Standalone Launch</code> patterns.
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://docs.smarthealthit.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    SMART Docs <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/contact" className="flex items-center gap-1">
                    Request Integration
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
