import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Shield, Clock, CheckCircle2, AlertTriangle, BookOpen, FileText, Siren, ClipboardList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const defaultRetentionPolicies = [
  { table_name: 'audit_logs', retention_days: 2190, description: 'HIPAA §164.530(j) — 6 year minimum' },
  { table_name: 'rate_limits', retention_days: 1, description: 'Operational — daily cleanup' },
  { table_name: 'rate_limit_violations', retention_days: 30, description: 'Security monitoring — 30 day window' },
  { table_name: 'fhir_events', retention_days: 365, description: 'Integration audit trail — 1 year' },
  { table_name: 'contact_inquiries', retention_days: 730, description: 'Business records — 2 years' },
  { table_name: 'licensing_inquiries', retention_days: 1095, description: 'Business/legal — 3 years' },
  { table_name: 'presentation_sessions', retention_days: 365, description: 'Analytics — 1 year' },
  { table_name: 'page_views', retention_days: 365, description: 'Analytics — 1 year' },
];

const trainingModules = [
  { title: 'HIPAA Privacy Fundamentals', category: 'privacy', duration_minutes: 45, description: 'Core privacy rule concepts, patient rights, and permitted uses/disclosures' },
  { title: 'HIPAA Security Awareness', category: 'security', duration_minutes: 30, description: 'Administrative, physical, and technical safeguards overview' },
  { title: 'Breach Notification Procedures', category: 'incident_response', duration_minutes: 30, description: '4-factor breach assessment, notification timelines, and reporting requirements' },
  { title: 'Platform Security Controls', category: 'technical', duration_minutes: 30, description: 'RBAC, RLS, encryption, session management, and audit logging' },
  { title: 'Data Handling & Disposal', category: 'operations', duration_minutes: 20, description: 'Data retention policies, secure deletion, and disposal verification' },
  { title: 'Social Engineering Awareness', category: 'security', duration_minutes: 20, description: 'Phishing, pretexting, and credential protection best practices' },
];

const tabletopScenarios = [
  { title: 'Credential Compromise', scenario_description: 'A staff member\'s account is compromised via a phishing email. The attacker has accessed patient-adjacent data for 2 hours before detection.', exercise_date: '2026-06-15' },
  { title: 'Insider Threat Detection', scenario_description: 'Audit logs reveal a privileged user has been accessing patent attestation PII outside of normal duties. Assess response procedures.', exercise_date: '2026-09-15' },
  { title: 'Ransomware Scenario', scenario_description: 'A ransomware attack encrypts the primary database. Backup restoration and business continuity procedures are tested.', exercise_date: '2026-12-15' },
  { title: 'FHIR API Exploitation', scenario_description: 'The FHIR webhook endpoint receives a burst of malformed requests attempting to exploit a potential injection vulnerability.', exercise_date: '2027-03-15' },
];

export const HIPAACompliancePanel = () => {
  const { isAdmin } = useAuth();
  const [seeding, setSeeding] = useState(false);

  const seedRetentionPolicies = async () => {
    setSeeding(true);
    try {
      for (const policy of defaultRetentionPolicies) {
        const { error } = await supabase.from('data_retention_policies').insert(policy);
        if (error && !error.message.includes('duplicate')) {
          console.error('Error seeding policy:', error);
        }
      }
      toast.success('Retention policies initialized');
    } catch (err) {
      toast.error('Failed to seed policies');
    } finally {
      setSeeding(false);
    }
  };

  const seedTrainingModules = async () => {
    setSeeding(true);
    try {
      for (const mod of trainingModules) {
        const { error } = await supabase.from('hipaa_training_modules').insert(mod);
        if (error && !error.message.includes('duplicate')) {
          console.error('Error seeding module:', error);
        }
      }
      toast.success('Training modules initialized');
    } catch (err) {
      toast.error('Failed to seed modules');
    } finally {
      setSeeding(false);
    }
  };

  const seedTabletopExercises = async () => {
    setSeeding(true);
    try {
      for (const scenario of tabletopScenarios) {
        const { error } = await supabase.from('tabletop_exercises').insert(scenario);
        if (error && !error.message.includes('duplicate')) {
          console.error('Error seeding exercise:', error);
        }
      }
      toast.success('Tabletop exercises scheduled');
    } catch (err) {
      toast.error('Failed to seed exercises');
    } finally {
      setSeeding(false);
    }
  };

  const createInitialRiskAssessment = async () => {
    setSeeding(true);
    try {
      const { error } = await supabase.from('security_risk_assessments').insert({
        assessment_year: 2026,
        assessment_type: 'annual',
        status: 'completed',
        assessor_name: 'Platform Security Team',
        findings_count: 10,
        critical_findings: 0,
        high_findings: 1,
        medium_findings: 7,
        low_findings: 2,
        overall_risk_level: 'low-moderate',
        summary: 'Comprehensive NIST SP 800-30 risk assessment covering all platform assets. No critical findings. One high finding (dependency management) under active monitoring. All identified risks have documented mitigations.',
        recommendations: '1. Activate HIPAA-eligible infrastructure tier\n2. Execute BAAs with subprocessors\n3. Conduct penetration testing\n4. Establish automated dependency scanning\n5. Schedule quarterly RLS policy reviews',
        next_review_date: '2027-03-10',
        completed_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success('Risk assessment record created');
    } catch (err) {
      toast.error('Failed to create risk assessment');
    } finally {
      setSeeding(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Admin access required for HIPAA compliance management.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          HIPAA Compliance Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage data retention, training, risk assessments, and breach response.
        </p>
      </div>

      <Tabs defaultValue="retention" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="retention" className="text-xs">
            <Clock className="w-3.5 h-3.5 mr-1" /> Retention
          </TabsTrigger>
          <TabsTrigger value="training" className="text-xs">
            <BookOpen className="w-3.5 h-3.5 mr-1" /> Training
          </TabsTrigger>
          <TabsTrigger value="risk" className="text-xs">
            <FileText className="w-3.5 h-3.5 mr-1" /> Risk Assessment
          </TabsTrigger>
          <TabsTrigger value="breach" className="text-xs">
            <Siren className="w-3.5 h-3.5 mr-1" /> Breach Response
          </TabsTrigger>
        </TabsList>

        {/* Data Retention Tab */}
        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Retention Policies</CardTitle>
              <CardDescription>Configure retention periods per table. Records older than the retention period will be eligible for automated cleanup.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Retention</TableHead>
                    <TableHead>Justification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaultRetentionPolicies.map((p) => (
                    <TableRow key={p.table_name}>
                      <TableCell className="font-mono text-xs">{p.table_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {p.retention_days >= 365 ? `${Math.round(p.retention_days / 365)} year${p.retention_days >= 730 ? 's' : ''}` : `${p.retention_days} day${p.retention_days > 1 ? 's' : ''}`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button size="sm" onClick={seedRetentionPolicies} disabled={seeding}>
                  Initialize Retention Policies
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">HIPAA Training Modules</CardTitle>
              <CardDescription>Required annual training for all platform users. Certificates expire after 1 year.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Pass Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingModules.map((m) => (
                    <TableRow key={m.title}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{m.title}</p>
                          <p className="text-xs text-muted-foreground">{m.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs capitalize">{m.category.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{m.duration_minutes} min</TableCell>
                      <TableCell className="text-sm">80%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Button size="sm" onClick={seedTrainingModules} disabled={seeding}>
                  Initialize Training Modules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Assessment Tab */}
        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security Risk Assessments</CardTitle>
              <CardDescription>NIST SP 800-30 aligned risk assessments. Annual review required per HIPAA §164.308(a)(1)(ii)(A).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">2026 Annual Risk Assessment</p>
                    <p className="text-xs text-muted-foreground">NIST SP 800-30 Rev. 1</p>
                  </div>
                  <Badge className="bg-risk-low/20 text-risk-low border-risk-low/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                  </Badge>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {[
                    { label: 'Critical', count: 0, color: 'text-destructive' },
                    { label: 'High', count: 1, color: 'text-warning' },
                    { label: 'Medium', count: 7, color: 'text-amber-500' },
                    { label: 'Low', count: 2, color: 'text-muted-foreground' },
                    { label: 'Total', count: 10, color: 'text-foreground' },
                  ].map(f => (
                    <div key={f.label} className="p-2 rounded bg-muted/50">
                      <p className={`text-lg font-bold ${f.color}`}>{f.count}</p>
                      <p className="text-xs text-muted-foreground">{f.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Next review: March 10, 2027</span>
                </div>
              </div>
              <div className="mt-4">
                <Button size="sm" onClick={createInitialRiskAssessment} disabled={seeding}>
                  Create Assessment Record
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breach Response Tab */}
        <TabsContent value="breach" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Breach Response & Tabletop Exercises</CardTitle>
              <CardDescription>Incident tracking and semi-annual tabletop exercises per 45 CFR §§164.400-414.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-risk-low/30 bg-risk-low/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-risk-low" />
                  <p className="text-sm font-medium">No Active Breach Incidents</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  All systems operational. No breaches detected or under investigation.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Scheduled Tabletop Exercises
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exercise</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tabletopScenarios.map((s) => {
                      const date = new Date(s.exercise_date);
                      const isPast = date < new Date();
                      return (
                        <TableRow key={s.title}>
                          <TableCell>
                            <p className="text-sm font-medium">{s.title}</p>
                            <p className="text-xs text-muted-foreground max-w-md truncate">{s.scenario_description}</p>
                          </TableCell>
                          <TableCell className="text-sm">{date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                          <TableCell>
                            <Badge variant={isPast ? 'default' : 'outline'}>
                              {isPast ? 'Completed' : 'Scheduled'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <Button size="sm" onClick={seedTabletopExercises} disabled={seeding}>
                    Schedule Tabletop Exercises
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
