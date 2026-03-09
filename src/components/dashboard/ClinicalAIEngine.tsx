/**
 * Real AI Clinical Inference Engine Demo
 * 
 * This component demonstrates VitaSignal's IDI and DBS real-time AI inference
 * using Gemini 2.5 Pro — NOT simulated data.
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, AlertTriangle, Activity, FileText, Clock, Loader2, Sparkles, ArrowUp, ArrowDown, Minus, Cpu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ShapFeature {
  feature: string;
  value: string;
  contribution: number;
  direction: "increases" | "decreases" | "neutral";
}

interface InferenceResult {
  patientId: string;
  model: string;
  timestamp: string;
  idi: {
    mortalityProbability: number;
    riskCategory: string;
    auroc_context: string;
    shapFeatures: ShapFeature[];
    clinicalRationale: string;
    recommendedInterventions: string[];
    urgencyWindow: string;
  };
  dbs: {
    burdenIndex: number;
    burdenCategory: string;
    documentationEfficiency: number;
    timeReclaimableMin: number;
    topBurdenDrivers: string[];
    recommendedWorkflowChanges: string[];
    patientImpact: string;
  };
  combinedRiskAlert: boolean;
  alertMessage?: string;
  disclaimer: string;
}

// Sample patient data for demo
const SAMPLE_PATIENTS = [
  {
    name: "ICU Admission (High Risk)",
    data: {
      patientId: "PT-ICU-001",
      age: 72,
      gender: "Male",
      icuAdmissionSource: "Emergency Department",
      mapMean: 62,
      hrMean: 105,
      rrMean: 24,
      spO2Min: 88,
      tempMax: 38.9,
      bunCr: 28,
      wbc: 15.2,
      hemoglobin: 9.8,
      lactate: 4.2,
      sodium: 148,
      nursingNotesLast24h: 4,
      documentationVelocity: 0.17,
      avgNoteLength: 320,
      medicationReconciliations: 1,
      reassessmentFrequency: 2,
      avgDocTimePerPatientMin: 45,
      clicksPerShift: 2400,
      redundantFieldsPercent: 35,
      screenTransitionsPerHour: 85,
      patientLoadRatio: 6,
      clinicalNotes: "Sepsis suspected. Lactate elevated. Hypotension requiring vasopressors. Respiratory distress."
    }
  },
  {
    name: "Step-Down Unit (Moderate)",
    data: {
      patientId: "PT-SDU-002",
      age: 58,
      gender: "Female",
      icuAdmissionSource: "Post-operative transfer",
      mapMean: 78,
      hrMean: 82,
      rrMean: 18,
      spO2Min: 94,
      tempMax: 37.2,
      bunCr: 15,
      wbc: 9.1,
      hemoglobin: 11.5,
      lactate: 1.4,
      sodium: 139,
      nursingNotesLast24h: 8,
      documentationVelocity: 0.33,
      avgNoteLength: 450,
      medicationReconciliations: 3,
      reassessmentFrequency: 4,
      avgDocTimePerPatientMin: 28,
      clicksPerShift: 1200,
      redundantFieldsPercent: 18,
      screenTransitionsPerHour: 45,
      patientLoadRatio: 4,
      clinicalNotes: "POD1 from CABG. Pain controlled. Ambulated to chair. Tolerating diet."
    }
  },
  {
    name: "Low Risk, High Burden",
    data: {
      patientId: "PT-MED-003",
      age: 45,
      gender: "Male",
      icuAdmissionSource: "Direct admit",
      mapMean: 88,
      hrMean: 74,
      rrMean: 16,
      spO2Min: 97,
      tempMax: 36.8,
      bunCr: 12,
      wbc: 7.2,
      hemoglobin: 14.2,
      lactate: 0.9,
      sodium: 140,
      nursingNotesLast24h: 12,
      documentationVelocity: 0.5,
      avgNoteLength: 680,
      medicationReconciliations: 5,
      reassessmentFrequency: 6,
      avgDocTimePerPatientMin: 65,
      clicksPerShift: 3800,
      redundantFieldsPercent: 52,
      screenTransitionsPerHour: 120,
      patientLoadRatio: 8,
      chargeRNDocBurdenScore: 9,
      clinicalNotes: "Routine admission for monitoring. Stable condition. Extensive documentation requirements due to multiple flowsheets and compliance forms."
    }
  }
];

export function ClinicalAIEngine() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [selectedPatient, setSelectedPatient] = useState(0);
  const [customMode, setCustomMode] = useState(false);
  const [customData, setCustomData] = useState(SAMPLE_PATIENTS[0].data);

  const runInference = async () => {
    setLoading(true);
    setResult(null);

    try {
      const inputData = customMode ? customData : SAMPLE_PATIENTS[selectedPatient].data;
      
      const { data, error } = await supabase.functions.invoke("vitasignal-inference", {
        body: inputData,
      });

      if (error) throw error;
      setResult(data);
      toast.success("AI inference complete", { description: `Model: ${data.model}` });
    } catch (err: any) {
      console.error("Inference error:", err);
      toast.error("Inference failed", { description: err.message || "Unknown error" });
    } finally {
      setLoading(false);
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

  const getContributionIcon = (direction: string) => {
    switch (direction) {
      case "increases": return <ArrowUp className="w-3 h-3 text-red-500" />;
      case "decreases": return <ArrowDown className="w-3 h-3 text-emerald-500" />;
      default: return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                VitaSignal Real AI Inference Engine
                <Badge variant="default" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  Live AI
                </Badge>
              </CardTitle>
              <CardDescription>
                Gemini 2.5 Pro IDI + DBS scoring — NOT simulated
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
            <Cpu className="w-4 h-4" />
            <AlertTitle>Real AI Processing</AlertTitle>
            <AlertDescription className="text-sm">
              This demo sends structured clinical data to Google Gemini 2.5 Pro via Lovable AI Gateway. 
              The model analyzes inputs using VitaSignal's patent-pending IDI and DBS methodologies, 
              returning risk scores with SHAP-style feature attribution. Not a simulation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Input Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Patient Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={customMode ? "custom" : "presets"} onValueChange={v => setCustomMode(v === "custom")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="presets">Sample Patients</TabsTrigger>
              <TabsTrigger value="custom">Custom Input</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-4">
              <div className="grid gap-3">
                {SAMPLE_PATIENTS.map((pt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPatient(i)}
                    className={`p-4 text-left rounded-lg border transition-all ${
                      selectedPatient === i 
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-medium">{pt.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Age {pt.data.age} · {pt.data.gender} · MAP {pt.data.mapMean} · HR {pt.data.hrMean} · Lactate {pt.data.lactate}
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input 
                    type="number" 
                    value={customData.age} 
                    onChange={e => setCustomData({ ...customData, age: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>MAP (Mean Arterial Pressure)</Label>
                  <Input 
                    type="number" 
                    value={customData.mapMean} 
                    onChange={e => setCustomData({ ...customData, mapMean: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Heart Rate</Label>
                  <Input 
                    type="number" 
                    value={customData.hrMean} 
                    onChange={e => setCustomData({ ...customData, hrMean: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lactate (mmol/L)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={customData.lactate} 
                    onChange={e => setCustomData({ ...customData, lactate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>WBC (K/uL)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={customData.wbc} 
                    onChange={e => setCustomData({ ...customData, wbc: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Documentation Time (min/patient)</Label>
                  <Input 
                    type="number" 
                    value={customData.avgDocTimePerPatientMin} 
                    onChange={e => setCustomData({ ...customData, avgDocTimePerPatientMin: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={runInference} disabled={loading} className="w-full gap-2" size="lg">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running Inference...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Run VitaSignal AI Inference
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Combined Risk Alert */}
            {result.combinedRiskAlert && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertTitle>Compound Risk Detected</AlertTitle>
                <AlertDescription>{result.alertMessage}</AlertDescription>
              </Alert>
            )}

            {/* IDI Results */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-500/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-red-500" />
                    <div>
                      <CardTitle className="text-lg">IDI — ICU Mortality Prediction</CardTitle>
                      <CardDescription>Patent-pending documentation-based mortality scoring</CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getRiskColor(result.idi.riskCategory)} text-white`}>
                    {result.idi.riskCategory}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Mortality probability gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Mortality Probability</span>
                    <span className="font-bold text-lg">
                      {(result.idi.mortalityProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={result.idi.mortalityProbability * 100} 
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground">{result.idi.auroc_context}</p>
                </div>

                {/* SHAP Features */}
                {result.idi.shapFeatures.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      Feature Contributions (SHAP-style)
                    </h4>
                    <div className="space-y-1">
                      {result.idi.shapFeatures.slice(0, 6).map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                          <div className="flex items-center gap-2">
                            {getContributionIcon(f.direction)}
                            <span>{f.feature}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">{f.value}</span>
                            <span className={f.contribution > 0 ? "text-red-500" : f.contribution < 0 ? "text-emerald-500" : ""}>
                              {f.contribution > 0 ? "+" : ""}{(f.contribution * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clinical Rationale */}
                <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                  <h4 className="font-medium text-sm">Clinical Rationale</h4>
                  <p className="text-sm">{result.idi.clinicalRationale}</p>
                </div>

                {/* Interventions */}
                {result.idi.recommendedInterventions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recommended Actions ({result.idi.urgencyWindow})
                    </h4>
                    <ul className="space-y-1">
                      {result.idi.recommendedInterventions.map((int, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {int}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* DBS Results */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <CardTitle className="text-lg">DBS — Documentation Burden Score</CardTitle>
                      <CardDescription>Patent-pending EHR workflow efficiency analysis</CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getRiskColor(result.dbs.burdenCategory)} text-white`}>
                    {result.dbs.burdenCategory}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Burden gauge */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <div className="text-3xl font-bold text-blue-600">{result.dbs.burdenIndex}</div>
                    <div className="text-xs text-muted-foreground">Burden Index (0-100)</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <div className="text-3xl font-bold text-emerald-600">{result.dbs.documentationEfficiency}%</div>
                    <div className="text-xs text-muted-foreground">Documentation Efficiency</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 text-center">
                    <div className="text-3xl font-bold text-amber-600">{result.dbs.timeReclaimableMin}</div>
                    <div className="text-xs text-muted-foreground">Minutes Reclaimable/Shift</div>
                  </div>
                </div>

                {/* Burden Drivers */}
                {result.dbs.topBurdenDrivers.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Top Burden Drivers</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.dbs.topBurdenDrivers.map((d, i) => (
                        <Badge key={i} variant="outline">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workflow Recommendations */}
                {result.dbs.recommendedWorkflowChanges.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recommended Workflow Changes</h4>
                    <ul className="space-y-1">
                      {result.dbs.recommendedWorkflowChanges.map((w, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-blue-500">→</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Patient Impact */}
                {result.dbs.patientImpact && (
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertTitle>Patient Care Impact</AlertTitle>
                    <AlertDescription className="text-sm">{result.dbs.patientImpact}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Model: {result.model}</span>
                  <span>•</span>
                  <span>Patient: {result.patientId}</span>
                  <span>•</span>
                  <span>Timestamp: {new Date(result.timestamp).toLocaleString()}</span>
                </div>
                <p className="mt-4 text-xs text-muted-foreground border-t pt-4">
                  {result.disclaimer}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
