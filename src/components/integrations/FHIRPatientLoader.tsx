/**
 * Real FHIR Patient Loader
 * 
 * Connects to HAPI FHIR R4 public test server and loads real patient data,
 * then runs it through VitaSignal AI inference.
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Server, User, Activity, Pill, Stethoscope, Loader2, CheckCircle2, ExternalLink, Brain, AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface FHIRPatient {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  age: number;
  source: string;
}

interface FHIRObservation {
  code: string;
  display: string;
  value: number | string;
  unit: string;
  effectiveDate: string;
  category: string;
}

interface PatientBundle {
  patient: FHIRPatient;
  observations: FHIRObservation[];
  conditions: string[];
  medications: string[];
  rawFhirPatientId: string;
  serverUrl: string;
  fetchedAt: string;
}

interface ServerCapabilities {
  supportedServers: Array<{
    name: string;
    id: string;
    url: string;
    authRequired: boolean;
    status: string;
    description: string;
  }>;
}

export function FHIRPatientLoader() {
  const [loading, setLoading] = useState(false);
  const [inferring, setInferring] = useState(false);
  const [bundle, setBundle] = useState<PatientBundle | null>(null);
  const [vitaSignalInput, setVitaSignalInput] = useState<any>(null);
  const [inferenceResult, setInferenceResult] = useState<any>(null);
  const [capabilities, setCapabilities] = useState<ServerCapabilities | null>(null);
  const [customPatientId, setCustomPatientId] = useState("");
  const [activeTab, setActiveTab] = useState<"load" | "analyze">("load");

  const loadCapabilities = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("fhir-patient-loader", {
        body: {},
        headers: {},
      });
      
      // Use URL query params instead of body for GET-style requests
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fhir-patient-loader?action=capabilities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      
      if (!response.ok) throw new Error("Failed to load capabilities");
      const caps = await response.json();
      setCapabilities(caps);
    } catch (err) {
      console.error("Error loading capabilities:", err);
    }
  };

  const loadPatient = async (patientId?: string) => {
    setLoading(true);
    setBundle(null);
    setVitaSignalInput(null);
    setInferenceResult(null);

    try {
      const params = new URLSearchParams({ action: "load-and-prepare", server: "hapi" });
      if (patientId) params.set("patientId", patientId);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fhir-patient-loader?${params}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to load patient");
      }

      const data = await response.json();
      setBundle(data.bundle);
      setVitaSignalInput(data.vitaSignalInput);
      toast.success("Patient loaded from FHIR R4 server", {
        description: `${data.bundle.patient.name} — ${data.bundle.observations.length} observations`,
      });
    } catch (err: any) {
      console.error("FHIR load error:", err);
      toast.error("FHIR Load Failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!vitaSignalInput) return;

    setInferring(true);
    try {
      const { data, error } = await supabase.functions.invoke("vitasignal-inference", {
        body: vitaSignalInput,
      });

      if (error) throw error;
      setInferenceResult(data);
      setActiveTab("analyze");
      toast.success("VitaSignal AI analysis complete");
    } catch (err: any) {
      console.error("Inference error:", err);
      toast.error("Analysis failed", { description: err.message });
    } finally {
      setInferring(false);
    }
  };

  const getRiskColor = (category: string) => {
    switch (category) {
      case "LOW": case "OPTIMAL": return "bg-emerald-500";
      case "MODERATE": case "MANAGEABLE": return "bg-amber-500";
      case "HIGH": return "bg-orange-500";
      case "CRITICAL": return "bg-red-600";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Server className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Real FHIR R4 Patient Loader
                <Badge className="bg-emerald-500 text-white gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>
                Load real patient data from HAPI FHIR server, then analyze with VitaSignal AI
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200">
            <Server className="w-4 h-4" />
            <AlertTitle>Production-Ready Architecture</AlertTitle>
            <AlertDescription className="text-sm">
              This connects to <code className="text-xs bg-muted px-1 rounded">hapi.fhir.org/baseR4</code> — a real FHIR R4 server.
              For production Epic/Cerner integration, licensees provide their OAuth credentials from <code className="text-xs bg-muted px-1 rounded">open.epic.com</code>.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "load" | "analyze")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="load" className="gap-2">
            <Server className="w-4 h-4" />
            Load FHIR Patient
          </TabsTrigger>
          <TabsTrigger value="analyze" className="gap-2" disabled={!bundle}>
            <Brain className="w-4 h-4" />
            AI Analysis
          </TabsTrigger>
        </TabsList>

        {/* Load Tab */}
        <TabsContent value="load" className="space-y-6">
          {/* Load Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">FHIR Patient Search</CardTitle>
              <CardDescription>Load from HAPI FHIR public R4 server (no credentials required)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={() => loadPatient()} disabled={loading} className="gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Load Random Patient
                </Button>
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="patient-id">Or enter specific FHIR Patient ID:</Label>
                  <Input
                    id="patient-id"
                    placeholder="e.g., 1974702"
                    value={customPatientId}
                    onChange={(e) => setCustomPatientId(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => loadPatient(customPatientId)}
                  disabled={loading || !customPatientId}
                >
                  Load
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Patient Data Display */}
          <AnimatePresence>
            {bundle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Patient Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{bundle.patient.name}</CardTitle>
                          <CardDescription>
                            {bundle.patient.age}yo {bundle.patient.gender} · FHIR ID: {bundle.patient.id}
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href={`${bundle.serverUrl}/Patient/${bundle.patient.id}`} target="_blank" rel="noopener noreferrer">
                          View FHIR Resource <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Observations */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Observations ({bundle.observations.length})
                      </h4>
                      <ScrollArea className="h-40 rounded border p-2">
                        {bundle.observations.length > 0 ? (
                          <div className="space-y-2">
                            {bundle.observations.map((obs, i) => (
                              <div key={i} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                                <span>{obs.display}</span>
                                <span className="font-medium">
                                  {obs.value} {obs.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No observations found</p>
                        )}
                      </ScrollArea>
                    </div>

                    {/* Conditions & Medications */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          Conditions
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {bundle.conditions.length > 0 ? (
                            bundle.conditions.map((c, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">None recorded</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Pill className="w-4 h-4" />
                          Medications
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {bundle.medications.length > 0 ? (
                            bundle.medications.map((m, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{m}</Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">None recorded</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-4 border-t">
                      <span>Source: {bundle.patient.source}</span>
                      <span>•</span>
                      <span>Fetched: {new Date(bundle.fetchedAt).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Run Analysis CTA */}
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Ready for AI Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                          Run VitaSignal IDI + DBS inference on this patient's data
                        </p>
                      </div>
                      <Button onClick={runAnalysis} disabled={inferring} size="lg" className="gap-2">
                        {inferring ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4" />
                            Run VitaSignal AI
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Analyze Tab */}
        <TabsContent value="analyze" className="space-y-6">
          {inferenceResult ? (
            <>
              {/* Combined Risk Alert */}
              {inferenceResult.combinedRiskAlert && (
                <Alert variant="destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertTitle>Compound Risk Detected</AlertTitle>
                  <AlertDescription>{inferenceResult.alertMessage}</AlertDescription>
                </Alert>
              )}

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* IDI Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">IDI Mortality Risk</CardTitle>
                      <Badge className={`${getRiskColor(inferenceResult.idi.riskCategory)} text-white`}>
                        {inferenceResult.idi.riskCategory}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-center py-4">
                      {(inferenceResult.idi.mortalityProbability * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">{inferenceResult.idi.clinicalRationale}</p>
                    <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">{inferenceResult.idi.auroc_context}</p>
                  </CardContent>
                </Card>

                {/* DBS Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">DBS Documentation Burden</CardTitle>
                      <Badge className={`${getRiskColor(inferenceResult.dbs.burdenCategory)} text-white`}>
                        {inferenceResult.dbs.burdenCategory}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-center py-4">
                      {inferenceResult.dbs.burdenIndex}/100
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Efficiency: {inferenceResult.dbs.documentationEfficiency}%</span>
                      <span>Reclaimable: {inferenceResult.dbs.timeReclaimableMin} min</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Disclaimer */}
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xs text-muted-foreground">{inferenceResult.disclaimer}</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Load a patient and run analysis to see results</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Epic Integration Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Production Epic Integration</CardTitle>
          <CardDescription>For licensees deploying to Epic EHR environments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border space-y-2">
              <h4 className="font-medium">1. Register at Epic</h4>
              <p className="text-sm text-muted-foreground">
                Create a SMART on FHIR app at <a href="https://open.epic.com" className="text-primary underline" target="_blank">open.epic.com</a>
              </p>
            </div>
            <div className="p-4 rounded-lg border space-y-2">
              <h4 className="font-medium">2. Configure Scopes</h4>
              <p className="text-sm text-muted-foreground">
                Request: <code className="text-xs">patient/Patient.read</code>, <code className="text-xs">patient/Observation.read</code>
              </p>
            </div>
            <div className="p-4 rounded-lg border space-y-2">
              <h4 className="font-medium">3. Provide Credentials</h4>
              <p className="text-sm text-muted-foreground">
                Supply your Epic <code className="text-xs">client_id</code> and redirect URI to VitaSignal config
              </p>
            </div>
            <div className="p-4 rounded-lg border space-y-2">
              <h4 className="font-medium">4. OAuth Flow</h4>
              <p className="text-sm text-muted-foreground">
                VitaSignal handles SMART on FHIR auth code + PKCE exchange automatically
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
