/**
 * VitaSignal FHIR Patient Loader
 * 
 * Connects to a real FHIR R4 server and loads patient data for AI analysis.
 * 
 * Supported servers:
 * - HAPI FHIR Public Test Server (no auth, immediate): https://hapi.fhir.org/baseR4
 * - Epic Sandbox (requires Epic client credentials): https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4
 * - Any FHIR R4 compliant server via configuration
 * 
 * For production Epic integration, licensees provide their Epic client_id
 * obtained from https://open.epic.com after SMART on FHIR app registration.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// HAPI FHIR public R4 server — real FHIR, no credentials needed
const HAPI_FHIR_BASE = "https://hapi.fhir.org/baseR4";

// Epic sandbox base (requires OAuth — credentials come from Epic developer registration)
const EPIC_SANDBOX_BASE = "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4";

interface FHIRPatient {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  age: number;
  source: string;
  resourceType: "Patient";
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

function extractName(resource: any): string {
  const name = resource.name?.[0];
  if (!name) return "Unknown Patient";
  if (name.text) return name.text;
  const given = name.given?.join(" ") || "";
  const family = name.family || "";
  return `${given} ${family}`.trim() || "Unknown Patient";
}

function calculateAge(birthDate: string): number {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function mapObservationCategory(obs: any): string {
  const cats = obs.category || [];
  for (const cat of cats) {
    const code = cat.coding?.[0]?.code || "";
    if (code === "vital-signs") return "vitals";
    if (code === "laboratory") return "labs";
  }
  return "other";
}

function extractObservationValue(obs: any): { value: number | string; unit: string } {
  if (obs.valueQuantity) {
    return { value: obs.valueQuantity.value ?? 0, unit: obs.valueQuantity.unit || "" };
  }
  if (obs.valueCodeableConcept) {
    return { value: obs.valueCodeableConcept.coding?.[0]?.display || "coded", unit: "" };
  }
  if (obs.valueString) {
    return { value: obs.valueString, unit: "" };
  }
  if (obs.component) {
    // Blood pressure has components
    const sys = obs.component.find((c: any) => c.code?.coding?.[0]?.code === "8480-6");
    const dia = obs.component.find((c: any) => c.code?.coding?.[0]?.code === "8462-4");
    if (sys && dia) {
      return {
        value: `${sys.valueQuantity?.value}/${dia.valueQuantity?.value}`,
        unit: "mmHg"
      };
    }
  }
  return { value: "N/A", unit: "" };
}

async function loadFromHAPI(patientId?: string): Promise<PatientBundle | null> {
  try {
    // If no patientId, search for ICU-relevant patients
    let patientResource: any;

    if (patientId) {
      const r = await fetch(`${HAPI_FHIR_BASE}/Patient/${patientId}`, {
        headers: { "Accept": "application/fhir+json" }
      });
      if (!r.ok) return null;
      patientResource = await r.json();
    } else {
      // Search for adult patients with conditions (more clinical relevance)
      const searchResp = await fetch(
        `${HAPI_FHIR_BASE}/Patient?_count=20&_sort=-_lastUpdated&_elements=id,name,gender,birthDate`,
        { headers: { "Accept": "application/fhir+json" } }
      );
      if (!searchResp.ok) return null;
      const bundle = await searchResp.json();
      const entries = bundle.entry || [];
      
      // Find a patient with a birthDate (more complete record)
      const validEntry = entries.find((e: any) => e.resource?.birthDate);
      if (!validEntry) return null;
      patientResource = validEntry.resource;
    }

    const pid = patientResource.id;

    // Fetch observations and conditions in parallel
    const [obsResp, condResp, medResp] = await Promise.all([
      fetch(`${HAPI_FHIR_BASE}/Observation?patient=${pid}&_count=30&_sort=-date&category=vital-signs,laboratory`, {
        headers: { "Accept": "application/fhir+json" }
      }),
      fetch(`${HAPI_FHIR_BASE}/Condition?patient=${pid}&_count=10`, {
        headers: { "Accept": "application/fhir+json" }
      }),
      fetch(`${HAPI_FHIR_BASE}/MedicationRequest?patient=${pid}&_count=10&status=active`, {
        headers: { "Accept": "application/fhir+json" }
      }),
    ]);

    const observations: FHIRObservation[] = [];
    if (obsResp.ok) {
      const obsBundle = await obsResp.json();
      for (const entry of (obsBundle.entry || [])) {
        const obs = entry.resource;
        const { value, unit } = extractObservationValue(obs);
        observations.push({
          code: obs.code?.coding?.[0]?.code || "",
          display: obs.code?.coding?.[0]?.display || obs.code?.text || "Unknown",
          value,
          unit,
          effectiveDate: obs.effectiveDateTime || obs.issued || "",
          category: mapObservationCategory(obs),
        });
      }
    }

    const conditions: string[] = [];
    if (condResp.ok) {
      const condBundle = await condResp.json();
      for (const entry of (condBundle.entry || [])) {
        const cond = entry.resource;
        const display = cond.code?.coding?.[0]?.display || cond.code?.text || "Unknown condition";
        conditions.push(display);
      }
    }

    const medications: string[] = [];
    if (medResp.ok) {
      const medBundle = await medResp.json();
      for (const entry of (medBundle.entry || [])) {
        const med = entry.resource;
        const display =
          med.medicationCodeableConcept?.coding?.[0]?.display ||
          med.medicationCodeableConcept?.text ||
          "Unknown medication";
        medications.push(display);
      }
    }

    const age = calculateAge(patientResource.birthDate || "");

    return {
      patient: {
        id: pid,
        name: extractName(patientResource),
        gender: patientResource.gender || "unknown",
        birthDate: patientResource.birthDate || "",
        age,
        source: "HAPI FHIR Public Test Server",
        resourceType: "Patient",
      },
      observations,
      conditions,
      medications,
      rawFhirPatientId: pid,
      serverUrl: HAPI_FHIR_BASE,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[HAPI FHIR] Load error:", err);
    return null;
  }
}

// Transform FHIR bundle to VitaSignal inference input format
function transformToVitaSignalInput(bundle: PatientBundle) {
  const obs = bundle.observations;

  const getObs = (codes: string[], category?: string) => {
    const found = obs.find(o => 
      codes.includes(o.code) && 
      (category ? o.category === category : true)
    );
    return found ? Number(found.value) || undefined : undefined;
  };

  // LOINC codes for key vitals
  const heartRate = getObs(["8867-4", "8893-0"], "vitals");
  const systolicBP = obs.find(o => o.display?.toLowerCase().includes("systolic"))?.value;
  const spO2 = getObs(["59408-5", "2708-6"], "vitals");
  const respRate = getObs(["9279-1"], "vitals");
  const temp = getObs(["8310-5", "8331-1"], "vitals");

  // LOINC codes for key labs
  const wbc = getObs(["6690-2", "26464-8"], "labs");
  const hemoglobin = getObs(["718-7", "59260-0"], "labs");
  const sodium = getObs(["2947-0", "2951-2"], "labs");
  const lactate = getObs(["2524-7", "59032-3"], "labs");

  // Compute MAP from BP observation text
  let mapEstimate: number | undefined;
  const bpObs = obs.find(o => 
    o.display?.toLowerCase().includes("blood pressure") || 
    o.code === "55284-4" || o.code === "85354-9"
  );
  if (bpObs && typeof bpObs.value === "string" && bpObs.value.includes("/")) {
    const parts = bpObs.value.split("/");
    const sys = parseFloat(parts[0]);
    const dia = parseFloat(parts[1]);
    if (!isNaN(sys) && !isNaN(dia)) {
      mapEstimate = Math.round((sys + 2 * dia) / 3);
    }
  }

  return {
    patientId: bundle.patient.id,
    age: bundle.patient.age,
    gender: bundle.patient.gender,
    icuAdmissionSource: "Unknown (FHIR source)",
    mapMean: mapEstimate,
    hrMean: heartRate,
    rrMean: respRate,
    spO2Min: spO2,
    tempMax: temp,
    wbc,
    hemoglobin,
    sodium,
    lactate,
    // No documentation metrics from public FHIR (those come from EHR audit logs)
    // Note count proxy from observations count
    nursingNotesLast24h: Math.min(obs.length, 20),
    clinicalNotes: bundle.conditions.join("; "),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "load";
    const patientId = url.searchParams.get("patientId") || undefined;
    const server = url.searchParams.get("server") || "hapi";

    if (action === "capabilities") {
      // Return integration architecture for production documentation
      return new Response(JSON.stringify({
        supportedServers: [
          {
            name: "HAPI FHIR Public Test Server",
            id: "hapi",
            url: HAPI_FHIR_BASE,
            authRequired: false,
            status: "available",
            description: "Public FHIR R4 server for development and testing. No credentials needed.",
            dataTypes: ["Patient", "Observation", "Condition", "MedicationRequest", "Encounter"]
          },
          {
            name: "Epic Production",
            id: "epic",
            url: EPIC_SANDBOX_BASE,
            authRequired: true,
            status: "requires_registration",
            description: "Epic SMART on FHIR R4. Requires app registration at open.epic.com. Licensees obtain their own client_id.",
            registrationUrl: "https://open.epic.com",
            authFlow: "SMART on FHIR Authorization Code + PKCE",
            scopes: ["patient/Patient.read", "patient/Observation.read", "patient/Condition.read"]
          },
          {
            name: "Cerner/Oracle Health",
            id: "cerner",
            url: "https://fhir-ehr-code.cerner.com/r4",
            authRequired: true,
            status: "requires_registration",
            description: "Cerner SMART on FHIR R4. Requires app registration at code.cerner.com.",
            registrationUrl: "https://code.cerner.com"
          }
        ],
        vitaSignalFHIRProfile: {
          requiredResources: ["Patient", "Observation"],
          recommendedResources: ["Condition", "MedicationRequest", "Encounter", "DocumentReference"],
          minimumFHIRVersion: "R4",
          keyLOINCCodes: {
            vitals: ["8867-4 (HR)", "55284-4 (BP)", "59408-5 (SpO2)", "9279-1 (RR)", "8310-5 (Temp)"],
            labs: ["6690-2 (WBC)", "718-7 (Hemoglobin)", "2947-0 (Sodium)", "2524-7 (Lactate)"]
          }
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (action === "load" || action === "load-and-prepare") {
      console.log(`[FHIR Loader] Loading from ${server}, patient: ${patientId || "search"}`);

      let bundle: PatientBundle | null = null;

      if (server === "hapi") {
        bundle = await loadFromHAPI(patientId);
      } else {
        return new Response(
          JSON.stringify({ error: `Server '${server}' requires OAuth credentials from the EHR vendor. Use server=hapi for immediate testing.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!bundle) {
        return new Response(
          JSON.stringify({ error: "Could not load patient data from FHIR server" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const result: any = { bundle };

      if (action === "load-and-prepare") {
        result.vitaSignalInput = transformToVitaSignalInput(bundle);
        result.note = "vitaSignalInput is ready to POST to /functions/v1/vitasignal-inference";
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(
      JSON.stringify({ error: "Unknown action. Use: load, load-and-prepare, capabilities" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[FHIR Loader] Error:", error);
    return new Response(
      JSON.stringify({ error: "FHIR loader error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
