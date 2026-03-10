import { useState, useEffect } from 'react';
import { Building2, Mail, Shield, Key, CheckCircle2, Clock, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PATENT_PORTFOLIO } from '@/constants/patent';

const ONBOARDING_STEPS = [
  { id: 'register', label: 'Registration', icon: Building2, description: 'Organization details and contact information' },
  { id: 'nda', label: 'NDA & BAA', icon: Shield, description: 'Sign legal agreements for data protection' },
  { id: 'api-key', label: 'API Credentials', icon: Key, description: 'Receive sandbox API key for integration testing' },
  { id: 'integration', label: 'Technical Setup', icon: ArrowRight, description: 'Configure FHIR endpoints and webhooks' },
];

const SYSTEMS = PATENT_PORTFOLIO.slice(0, 6).map(p => ({ id: p.id, label: p.shortName }));

export const LicenseeOnboardingPortal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    organizationName: '',
    organizationType: 'health_system',
    contactName: '',
    email: '',
    phone: '',
    systemsOfInterest: [] as string[],
    message: '',
    ndaAgreed: false,
  });

  const updateForm = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const toggleSystem = (id: string) => {
    setForm(f => ({
      ...f,
      systemsOfInterest: f.systemsOfInterest.includes(id)
        ? f.systemsOfInterest.filter(s => s !== id)
        : [...f.systemsOfInterest, id],
    }));
  };

  const handleSubmit = async () => {
    if (!form.organizationName || !form.contactName || !form.email) {
      toast({ title: 'Required fields missing', variant: 'destructive' });
      return;
    }
    if (!form.ndaAgreed) {
      toast({ title: 'NDA agreement required', description: 'Please agree to the mutual NDA before proceeding.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('licensing_inquiries').insert({
      organization_name: form.organizationName,
      organization_type: form.organizationType,
      contact_name: form.contactName,
      email: form.email,
      phone: form.phone || null,
      systems_of_interest: form.systemsOfInterest,
      message: form.message || null,
      nda_agreed: form.ndaAgreed,
      status: 'new',
    });

    if (error) {
      toast({ title: 'Submission failed', description: error.message, variant: 'destructive' });
    } else {
      setSubmitted(true);
      toast({ title: 'Application submitted', description: 'Our team will review your application and provision sandbox access within 2 business days.' });
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Application Received</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your licensee onboarding application has been submitted. Our integration team will review your application and provision sandbox API credentials within 2 business days.
          </p>
        </div>
        <div className="bg-muted rounded-lg p-4 max-w-sm mx-auto text-left space-y-2">
          <p className="text-xs font-medium">What happens next:</p>
          <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal pl-4">
            <li>Application review (1–2 business days)</li>
            <li>Mutual NDA execution via DocuSign</li>
            <li>Sandbox API key provisioned</li>
            <li>Technical onboarding call scheduled</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress steps */}
      <div className="flex items-center justify-center gap-0">
        {ONBOARDING_STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = idx === currentStep;
          const isComplete = idx < currentStep;
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(idx)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs',
                  isActive ? 'bg-primary text-primary-foreground' :
                  isComplete ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                )}
              >
                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                <span className="hidden sm:inline font-medium">{step.label}</span>
              </button>
              {idx < ONBOARDING_STEPS.length - 1 && (
                <div className={cn('w-6 h-px mx-1', idx < currentStep ? 'bg-primary' : 'bg-border')} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      {currentStep === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organization Registration</CardTitle>
            <CardDescription>Tell us about your organization and integration goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Organization Name *</Label>
                <Input value={form.organizationName} onChange={e => updateForm('organizationName', e.target.value)} placeholder="e.g. Memorial Health System" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Organization Type</Label>
                <Select value={form.organizationType} onValueChange={v => updateForm('organizationType', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health_system">Health System</SelectItem>
                    <SelectItem value="ehr_vendor">EHR Vendor</SelectItem>
                    <SelectItem value="research">Research Institution</SelectItem>
                    <SelectItem value="government">Government / Public Health</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Contact Name *</Label>
                <Input value={form.contactName} onChange={e => updateForm('contactName', e.target.value)} placeholder="Full name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email *</Label>
                <Input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="you@organization.com" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(1)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legal Agreements</CardTitle>
            <CardDescription>Review and agree to required legal documents before receiving API access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mutual Non-Disclosure Agreement (NDA)</span>
                  <Badge variant="outline" className="text-[10px]">Required</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Protects confidential information exchanged during integration, including API specifications, clinical data schemas, and proprietary algorithms.</p>
              </div>
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Business Associate Agreement (BAA)</span>
                  <Badge variant="outline" className="text-[10px]">Required for PHI</Badge>
                </div>
                <p className="text-xs text-muted-foreground">HIPAA-required agreement for any integration that processes Protected Health Information.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                checked={form.ndaAgreed}
                onCheckedChange={v => updateForm('ndaAgreed', v)}
                id="nda-agree"
              />
              <label htmlFor="nda-agree" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                I acknowledge that a mutual NDA will be executed before sandbox API credentials are provisioned, and a BAA will be required before any PHI is exchanged.
              </label>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
              <Button onClick={() => setCurrentStep(2)} disabled={!form.ndaAgreed}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Systems of Interest</CardTitle>
            <CardDescription>Select which VitaSignal systems you'd like to integrate with.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              {SYSTEMS.map(sys => (
                <button
                  key={sys.id}
                  onClick={() => toggleSystem(sys.id)}
                  className={cn(
                    'text-left p-3 rounded-lg border transition-colors text-sm',
                    form.systemsOfInterest.includes(sys.id)
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {form.systemsOfInterest.includes(sys.id) && <CheckCircle2 className="w-4 h-4" />}
                    {sys.label}
                  </div>
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Additional Notes</Label>
              <Textarea
                value={form.message}
                onChange={e => updateForm('message', e.target.value)}
                placeholder="Describe your integration use case, timeline, or any specific requirements..."
                className="min-h-[80px] text-sm"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
              <Button onClick={() => setCurrentStep(3)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review & Submit</CardTitle>
            <CardDescription>Confirm your details and submit your licensee application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Organization</span><span className="font-medium">{form.organizationName || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span className="font-medium">{form.contactName || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{form.email || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">NDA Agreed</span><span className="font-medium">{form.ndaAgreed ? 'Yes' : 'No'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Systems</span><span className="font-medium">{form.systemsOfInterest.length} selected</span></div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
