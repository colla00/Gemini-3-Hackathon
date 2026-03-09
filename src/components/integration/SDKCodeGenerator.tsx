import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Code2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { id: "python", label: "Python", icon: "🐍" },
  { id: "javascript", label: "JavaScript / Node.js", icon: "⚡" },
  { id: "csharp", label: "C# / .NET", icon: "🔷" },
  { id: "curl", label: "cURL", icon: "📡" },
];

const SNIPPETS: Record<string, Record<string, { title: string; code: string }>> = {
  python: {
    webhook: {
      title: "Receive FHIR R4 Webhook",
      code: `import hmac, hashlib, json
from flask import Flask, request, jsonify

app = Flask(__name__)
WEBHOOK_SECRET = "your-hmac-secret"

@app.route("/vitasignal/webhook", methods=["POST"])
def fhir_webhook():
    # Verify HMAC-SHA256 signature
    signature = request.headers.get("X-VitaSignal-Signature", "")
    body = request.get_data()
    expected = hmac.new(
        WEBHOOK_SECRET.encode(), body, hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(f"sha256={expected}", signature):
        return jsonify({"error": "Invalid signature"}), 401
    
    payload = json.loads(body)
    resource_type = payload.get("resourceType")
    
    if resource_type == "RiskAssessment":
        patient_id = payload["subject"]["reference"]
        risk_score = payload["prediction"][0]["probabilityDecimal"]
        print(f"Patient {patient_id}: mortality risk {risk_score:.1%}")
        # Route to your clinical decision support system
    
    return jsonify({"status": "received"}), 200`,
    },
    predict: {
      title: "Submit Patient Data for Prediction",
      code: `import requests
from datetime import datetime

API_BASE = "https://api.vitasignal.ai/v1"
API_KEY = "your-api-key"

def submit_documentation_timestamps(patient_id: str, timestamps: list[dict]):
    """Submit EHR documentation timestamps for mortality prediction."""
    response = requests.post(
        f"{API_BASE}/predict/mortality",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/fhir+json",
        },
        json={
            "resourceType": "Bundle",
            "type": "collection",
            "entry": [
                {
                    "resource": {
                        "resourceType": "DocumentReference",
                        "subject": {"reference": f"Patient/{patient_id}"},
                        "date": ts["timestamp"],
                        "type": {"coding": [{"system": "http://loinc.org", "code": ts["loinc_code"]}]},
                        "context": {"period": {"start": ts["encounter_start"]}},
                    }
                }
                for ts in timestamps
            ],
        },
    )
    response.raise_for_status()
    return response.json()

# Example usage
result = submit_documentation_timestamps(
    patient_id="P-12345",
    timestamps=[
        {"timestamp": "2026-03-09T08:15:00Z", "loinc_code": "34133-9", "encounter_start": "2026-03-08T14:00:00Z"},
        {"timestamp": "2026-03-09T10:30:00Z", "loinc_code": "51847-2", "encounter_start": "2026-03-08T14:00:00Z"},
    ],
)
print(f"Risk Score: {result['prediction']['mortality_probability']:.1%}")`,
    },
    dbs: {
      title: "Query Documentation Burden Score",
      code: `import requests

API_BASE = "https://api.vitasignal.ai/v1"
API_KEY = "your-api-key"

def get_unit_dbs(unit_id: str, shift: str = "day"):
    """Retrieve Documentation Burden Score for a nursing unit."""
    response = requests.get(
        f"{API_BASE}/dbs/unit/{unit_id}",
        headers={"Authorization": f"Bearer {API_KEY}"},
        params={"shift": shift, "include_breakdown": True},
    )
    response.raise_for_status()
    data = response.json()
    
    print(f"Unit: {data['unit_name']}")
    print(f"DBS Score: {data['dbs_score']:.2f}")
    print(f"Documentation Events: {data['event_count']}")
    print(f"Nurse-to-Patient Ratio: {data['nurse_ratio']}")
    
    for nurse in data.get("nurse_breakdown", []):
        print(f"  {nurse['name']}: DBS {nurse['individual_dbs']:.2f} ({nurse['patient_count']} patients)")
    
    return data`,
    },
  },
  javascript: {
    webhook: {
      title: "Receive FHIR R4 Webhook",
      code: `import express from 'express';
import crypto from 'crypto';

const app = express();
const WEBHOOK_SECRET = process.env.VITASIGNAL_WEBHOOK_SECRET;

app.post('/vitasignal/webhook', express.raw({ type: '*/*' }), (req, res) => {
  // Verify HMAC-SHA256 signature
  const signature = req.headers['x-vitasignal-signature'] || '';
  const expected = 'sha256=' + crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const payload = JSON.parse(req.body);
  
  if (payload.resourceType === 'RiskAssessment') {
    const patientId = payload.subject.reference;
    const riskScore = payload.prediction[0].probabilityDecimal;
    console.log(\`Patient \${patientId}: mortality risk \${(riskScore * 100).toFixed(1)}%\`);
    // Route to your clinical decision support system
  }

  res.json({ status: 'received' });
});

app.listen(3000, () => console.log('Webhook listener on port 3000'));`,
    },
    predict: {
      title: "Submit Patient Data for Prediction",
      code: `const API_BASE = 'https://api.vitasignal.ai/v1';
const API_KEY = process.env.VITASIGNAL_API_KEY;

async function submitDocumentationTimestamps(patientId, timestamps) {
  const response = await fetch(\`\${API_BASE}/predict/mortality\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/fhir+json',
    },
    body: JSON.stringify({
      resourceType: 'Bundle',
      type: 'collection',
      entry: timestamps.map(ts => ({
        resource: {
          resourceType: 'DocumentReference',
          subject: { reference: \`Patient/\${patientId}\` },
          date: ts.timestamp,
          type: { coding: [{ system: 'http://loinc.org', code: ts.loincCode }] },
          context: { period: { start: ts.encounterStart } },
        },
      })),
    }),
  });

  if (!response.ok) throw new Error(\`API error: \${response.status}\`);
  return response.json();
}

// Example
const result = await submitDocumentationTimestamps('P-12345', [
  { timestamp: '2026-03-09T08:15:00Z', loincCode: '34133-9', encounterStart: '2026-03-08T14:00:00Z' },
]);
console.log(\`Risk: \${(result.prediction.mortality_probability * 100).toFixed(1)}%\`);`,
    },
    dbs: {
      title: "Query Documentation Burden Score",
      code: `const API_BASE = 'https://api.vitasignal.ai/v1';

async function getUnitDBS(unitId, shift = 'day') {
  const params = new URLSearchParams({ shift, include_breakdown: 'true' });
  const response = await fetch(
    \`\${API_BASE}/dbs/unit/\${unitId}?\${params}\`,
    { headers: { 'Authorization': \`Bearer \${process.env.VITASIGNAL_API_KEY}\` } }
  );
  
  if (!response.ok) throw new Error(\`API error: \${response.status}\`);
  const data = await response.json();
  
  console.log(\`Unit: \${data.unit_name} | DBS: \${data.dbs_score.toFixed(2)}\`);
  data.nurse_breakdown?.forEach(n => 
    console.log(\`  \${n.name}: DBS \${n.individual_dbs.toFixed(2)} (\${n.patient_count} pts)\`)
  );
  
  return data;
}`,
    },
  },
  csharp: {
    webhook: {
      title: "Receive FHIR R4 Webhook",
      code: `using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

[ApiController]
[Route("vitasignal")]
public class WebhookController : ControllerBase
{
    private readonly string _webhookSecret;

    public WebhookController(IConfiguration config)
    {
        _webhookSecret = config["VitaSignal:WebhookSecret"]!;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> HandleWebhook()
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();

        // Verify HMAC-SHA256 signature
        var signature = Request.Headers["X-VitaSignal-Signature"].ToString();
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_webhookSecret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(body));
        var expected = $"sha256={Convert.ToHexString(hash).ToLower()}";

        if (!CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(signature), Encoding.UTF8.GetBytes(expected)))
        {
            return Unauthorized(new { error = "Invalid signature" });
        }

        var payload = JsonSerializer.Deserialize<JsonElement>(body);
        var resourceType = payload.GetProperty("resourceType").GetString();

        if (resourceType == "RiskAssessment")
        {
            var patientRef = payload.GetProperty("subject").GetProperty("reference").GetString();
            var risk = payload.GetProperty("prediction")[0].GetProperty("probabilityDecimal").GetDecimal();
            // Route to clinical decision support
        }

        return Ok(new { status = "received" });
    }
}`,
    },
    predict: {
      title: "Submit Patient Data",
      code: `using System.Net.Http.Headers;
using System.Text.Json;

public class VitaSignalClient
{
    private readonly HttpClient _http;
    private const string ApiBase = "https://api.vitasignal.ai/v1";

    public VitaSignalClient(string apiKey)
    {
        _http = new HttpClient();
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
    }

    public async Task<JsonElement> PredictMortality(string patientId, List<DocumentTimestamp> timestamps)
    {
        var bundle = new
        {
            resourceType = "Bundle",
            type = "collection",
            entry = timestamps.Select(ts => new
            {
                resource = new
                {
                    resourceType = "DocumentReference",
                    subject = new { reference = $"Patient/{patientId}" },
                    date = ts.Timestamp.ToString("O"),
                    type = new { coding = new[] { new { system = "http://loinc.org", code = ts.LoincCode } } },
                }
            }).ToArray()
        };

        var response = await _http.PostAsJsonAsync($"{ApiBase}/predict/mortality", bundle);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<JsonElement>();
    }
}

public record DocumentTimestamp(DateTime Timestamp, string LoincCode, DateTime EncounterStart);`,
    },
    dbs: { title: "Query DBS", code: `// See predict example — same HttpClient pattern with GET request` },
  },
  curl: {
    webhook: {
      title: "Test Webhook Delivery",
      code: `# Send a test FHIR R4 RiskAssessment webhook
curl -X POST https://your-ehr.example.com/vitasignal/webhook \\
  -H "Content-Type: application/fhir+json" \\
  -H "X-VitaSignal-Signature: sha256=$(echo -n '{}' | openssl dgst -sha256 -hmac 'your-secret' | awk '{print $2}')" \\
  -d '{
    "resourceType": "RiskAssessment",
    "status": "final",
    "subject": { "reference": "Patient/P-12345" },
    "occurrenceDateTime": "2026-03-09T14:30:00Z",
    "prediction": [{
      "outcome": { "text": "ICU Mortality" },
      "probabilityDecimal": 0.23,
      "qualitativeRisk": { "coding": [{ "code": "moderate" }] }
    }],
    "basis": [{ "reference": "Observation/dbs-score-unit4c" }]
  }'`,
    },
    predict: {
      title: "Submit Prediction Request",
      code: `# Submit documentation timestamps for mortality prediction
curl -X POST https://api.vitasignal.ai/v1/predict/mortality \\
  -H "Authorization: Bearer \$VITASIGNAL_API_KEY" \\
  -H "Content-Type: application/fhir+json" \\
  -d '{
    "resourceType": "Bundle",
    "type": "collection",
    "entry": [{
      "resource": {
        "resourceType": "DocumentReference",
        "subject": { "reference": "Patient/P-12345" },
        "date": "2026-03-09T08:15:00Z",
        "type": {
          "coding": [{ "system": "http://loinc.org", "code": "34133-9" }]
        }
      }
    }]
  }'`,
    },
    dbs: {
      title: "Query DBS Score",
      code: `# Get Documentation Burden Score for a unit
curl -X GET "https://api.vitasignal.ai/v1/dbs/unit/unit-4c?shift=day&include_breakdown=true" \\
  -H "Authorization: Bearer \$VITASIGNAL_API_KEY"`,
    },
  },
};

export const SDKCodeGenerator = () => {
  const [language, setLanguage] = useState("python");
  const [snippet, setSnippet] = useState("webhook");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentSnippets = SNIPPETS[language] || {};
  const currentCode = currentSnippets[snippet]?.code || "";

  const handleCopy = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    toast.success("Code copied");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">SDK Code Generator</h3>
          <p className="text-xs text-muted-foreground">Ready-to-use integration snippets for your EHR environment</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={language} onValueChange={(v) => { setLanguage(v); setSnippet("webhook"); }}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.icon} {l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          {Object.entries(currentSnippets).map(([key, val]) => (
            <Button
              key={key}
              variant={snippet === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSnippet(key)}
            >
              {val.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-3 right-3 z-10">
          <Button variant="ghost" size="sm" onClick={() => handleCopy(snippet, currentCode)} className="bg-background/80 backdrop-blur-sm">
            {copiedKey === snippet ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copiedKey === snippet ? "Copied" : "Copy"}
          </Button>
        </div>
        <pre className="rounded-xl border bg-foreground text-primary-foreground p-5 overflow-x-auto text-xs leading-relaxed">
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
};
