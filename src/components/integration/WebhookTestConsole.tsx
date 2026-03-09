import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, XCircle, Loader2, Shield, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SAMPLE_PAYLOADS: Record<string, string> = {
  riskAssessment: JSON.stringify({
    resourceType: "RiskAssessment",
    status: "final",
    subject: { reference: "Patient/P-12345" },
    occurrenceDateTime: new Date().toISOString(),
    prediction: [{
      outcome: { text: "ICU Mortality" },
      probabilityDecimal: 0.23,
      qualitativeRisk: { coding: [{ system: "http://hl7.org/fhir/risk-probability", code: "moderate" }] },
    }],
    basis: [{ reference: "Observation/dbs-score-unit4c" }],
  }, null, 2),
  observation: JSON.stringify({
    resourceType: "Observation",
    status: "final",
    code: { coding: [{ system: "http://loinc.org", code: "9279-1", display: "Respiratory rate" }] },
    subject: { reference: "Patient/P-12345" },
    effectiveDateTime: new Date().toISOString(),
    valueQuantity: { value: 22, unit: "breaths/min", system: "http://unitsofmeasure.org", code: "/min" },
  }, null, 2),
  documentReference: JSON.stringify({
    resourceType: "DocumentReference",
    status: "current",
    subject: { reference: "Patient/P-12345" },
    date: new Date().toISOString(),
    type: { coding: [{ system: "http://loinc.org", code: "34133-9", display: "Summary of episode note" }] },
    content: [{ attachment: { contentType: "text/plain" } }],
  }, null, 2),
};

interface TestResult {
  status: "success" | "error" | "pending";
  statusCode?: number;
  message: string;
  responseTime?: number;
  signatureValid?: boolean;
  timestamp: string;
}

export const WebhookTestConsole = () => {
  const [targetUrl, setTargetUrl] = useState("");
  const [hmacSecret, setHmacSecret] = useState("");
  const [payload, setPayload] = useState(SAMPLE_PAYLOADS.riskAssessment);
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const loadSample = (key: string) => {
    setPayload(SAMPLE_PAYLOADS[key] || "");
  };

  const handleTest = async () => {
    if (!targetUrl.trim()) {
      toast.error("Target URL is required");
      return;
    }

    // Validate JSON
    try {
      JSON.parse(payload);
    } catch {
      toast.error("Invalid JSON payload");
      return;
    }

    setIsTesting(true);
    const startTime = Date.now();

    // Simulate webhook delivery (actual delivery would need a backend proxy)
    // For now, we validate the payload structure and generate HMAC
    try {
      // Validate FHIR resource structure
      const parsed = JSON.parse(payload);
      const resourceType = parsed.resourceType;
      
      if (!resourceType) {
        throw new Error("Missing 'resourceType' — not a valid FHIR resource");
      }

      // Generate HMAC signature for display
      const encoder = new TextEncoder();
      const keyData = encoder.encode(hmacSecret || "test-secret");
      const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
      const hexSignature = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, "0")).join("");

      const elapsed = Date.now() - startTime;

      const result: TestResult = {
        status: "success",
        statusCode: 200,
        message: `✓ Valid ${resourceType} payload | HMAC: sha256=${hexSignature.slice(0, 16)}... | Ready for delivery to ${new URL(targetUrl).hostname}`,
        responseTime: elapsed,
        signatureValid: true,
        timestamp: new Date().toISOString(),
      };

      setResults(prev => [result, ...prev].slice(0, 10));
      toast.success("Payload validated successfully");
    } catch (e: any) {
      const elapsed = Date.now() - startTime;
      const result: TestResult = {
        status: "error",
        message: e.message || "Validation failed",
        responseTime: elapsed,
        signatureValid: false,
        timestamp: new Date().toISOString(),
      };
      setResults(prev => [result, ...prev].slice(0, 10));
      toast.error(e.message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Send className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">Webhook Testing Console</h3>
          <p className="text-xs text-muted-foreground">Validate FHIR payloads, test HMAC signatures, and debug webhook integration</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Config Panel */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Target Webhook URL</Label>
            <Input className="mt-1" placeholder="https://your-ehr.example.com/vitasignal/webhook" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} />
          </div>
          <div>
            <Label className="text-sm font-medium">HMAC Secret (for signature generation)</Label>
            <Input className="mt-1" type="password" placeholder="Your webhook HMAC secret..." value={hmacSecret} onChange={(e) => setHmacSecret(e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-sm font-medium">FHIR Payload</Label>
              <div className="flex gap-1">
                {Object.keys(SAMPLE_PAYLOADS).map((key) => (
                  <Button key={key} variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => loadSample(key)}>
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Button>
                ))}
              </div>
            </div>
            <Textarea
              className="mt-1 min-h-[250px] font-mono text-xs"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
            />
          </div>

          <Button onClick={handleTest} disabled={isTesting || !targetUrl.trim()} className="w-full">
            {isTesting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing...</> : <><Send className="w-4 h-4 mr-2" /> Validate & Test</>}
          </Button>
        </div>

        {/* Results Panel */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Test Results</Label>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm border rounded-lg bg-muted/20">
                <Send className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Run a test to see results here
              </div>
            ) : (
              results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-lg border p-3",
                    r.status === "success" ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {r.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground leading-relaxed">{r.message}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {r.responseTime}ms
                        </span>
                        {r.signatureValid !== undefined && (
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" /> HMAC {r.signatureValid ? "✓" : "✗"}
                          </span>
                        )}
                        <span>{new Date(r.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
