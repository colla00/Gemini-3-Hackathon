import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const now = () => new Date().toISOString();

const patientResource = (id: string) => ({
  resourceType: 'Patient',
  id,
  meta: { versionId: '3', lastUpdated: now(), profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'] },
  identifier: [{ system: 'urn:oid:2.16.840.1.113883.4.1', value: `***-**-${id.slice(-4)}` }],
  name: [{ family: 'Martinez', given: ['Rosa'], use: 'official' }],
  gender: 'female',
  birthDate: '1958-03-15',
  address: [{ line: ['123 Clinical Ave'], city: 'Chicago', state: 'IL', postalCode: '60601' }],
  telecom: [{ system: 'phone', value: '(312) 555-0142', use: 'home' }],
  maritalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-MaritalStatus', code: 'M', display: 'Married' }] },
  communication: [{ language: { coding: [{ system: 'urn:ietf:bcp:47', code: 'en', display: 'English' }] } }],
});

const observationBundle = (patientId: string) => ({
  resourceType: 'Bundle',
  type: 'searchset',
  total: 5,
  timestamp: now(),
  entry: [
    {
      resource: {
        resourceType: 'Observation', id: 'obs-hr-001', status: 'final',
        category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
        code: { coding: [{ system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' }], text: 'Heart Rate' },
        subject: { reference: `Patient/${patientId}` },
        effectiveDateTime: now(),
        valueQuantity: { value: 78 + Math.floor(Math.random() * 10), unit: 'beats/min', system: 'http://unitsofmeasure.org', code: '/min' },
      },
    },
    {
      resource: {
        resourceType: 'Observation', id: 'obs-bp-001', status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel' }], text: 'Blood Pressure' },
        subject: { reference: `Patient/${patientId}` },
        effectiveDateTime: now(),
        component: [
          { code: { text: 'Systolic' }, valueQuantity: { value: 120 + Math.floor(Math.random() * 20), unit: 'mmHg' } },
          { code: { text: 'Diastolic' }, valueQuantity: { value: 75 + Math.floor(Math.random() * 12), unit: 'mmHg' } },
        ],
      },
    },
    {
      resource: {
        resourceType: 'Observation', id: 'obs-spo2-001', status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '2708-6', display: 'Oxygen saturation' }], text: 'SpO₂' },
        subject: { reference: `Patient/${patientId}` },
        effectiveDateTime: now(),
        valueQuantity: { value: 94 + Math.floor(Math.random() * 5), unit: '%' },
      },
    },
    {
      resource: {
        resourceType: 'Observation', id: 'obs-temp-001', status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '8310-5', display: 'Body temperature' }], text: 'Temperature' },
        subject: { reference: `Patient/${patientId}` },
        effectiveDateTime: now(),
        valueQuantity: { value: parseFloat((97.5 + Math.random() * 2.5).toFixed(1)), unit: '°F' },
      },
    },
    {
      resource: {
        resourceType: 'Observation', id: 'obs-rr-001', status: 'final',
        code: { coding: [{ system: 'http://loinc.org', code: '9279-1', display: 'Respiratory rate' }], text: 'Respiratory Rate' },
        subject: { reference: `Patient/${patientId}` },
        effectiveDateTime: now(),
        valueQuantity: { value: 14 + Math.floor(Math.random() * 8), unit: 'breaths/min' },
      },
    },
  ],
});

const encounterBundle = (patientId: string) => ({
  resourceType: 'Bundle',
  type: 'searchset',
  total: 1,
  timestamp: now(),
  entry: [{
    resource: {
      resourceType: 'Encounter', id: 'enc-001', status: 'in-progress',
      class: { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'IMP', display: 'Inpatient' },
      type: [{ coding: [{ system: 'http://snomed.info/sct', code: '32485007', display: 'Hospital admission' }] }],
      subject: { reference: `Patient/${patientId}` },
      period: { start: '2026-03-04T08:00:00Z' },
      location: [{ location: { display: 'ICU-A Room 412' }, status: 'active', period: { start: '2026-03-04T08:15:00Z' } }],
      reasonCode: [{ text: 'Acute respiratory distress' }],
      participant: [{ individual: { display: 'Dr. Sarah Chen, MD' } }],
    },
  }],
});

const conditionBundle = (patientId: string) => ({
  resourceType: 'Bundle',
  type: 'searchset',
  total: 3,
  timestamp: now(),
  entry: [
    { resource: { resourceType: 'Condition', id: 'cond-fall', clinicalStatus: { coding: [{ code: 'active' }] }, category: [{ text: 'Problem List' }], code: { coding: [{ system: 'http://snomed.info/sct', code: '129839007', display: 'At risk for falls' }], text: 'Fall Risk — HIGH' }, severity: { text: 'High' }, subject: { reference: `Patient/${patientId}` }, recordedDate: now() } },
    { resource: { resourceType: 'Condition', id: 'cond-pi', clinicalStatus: { coding: [{ code: 'active' }] }, code: { text: 'Pressure Injury Risk — MODERATE' }, severity: { text: 'Moderate' }, subject: { reference: `Patient/${patientId}` }, recordedDate: now() } },
    { resource: { resourceType: 'Condition', id: 'cond-cauti', clinicalStatus: { coding: [{ code: 'active' }] }, code: { text: 'CAUTI Risk — LOW' }, severity: { text: 'Low' }, subject: { reference: `Patient/${patientId}` }, recordedDate: now() } },
  ],
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { resourceType, patientId, action, vendor } = body;
    const pid = patientId || 'PT-4821';

    const vendorMeta: Record<string, object> = {
      epic: { source: 'Epic FHIR R4', endpoint: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4' },
      cerner: { source: 'Oracle Health FHIR R4', endpoint: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d' },
      meditech: { source: 'MEDITECH Expanse FHIR R4', endpoint: 'https://fhir.meditech.com/r4' },
      allscripts: { source: 'Allscripts/Veradigm FHIR R4', endpoint: 'https://open.allscripts.com/fhir/r4' },
    };

    let responseData: unknown;

    switch (resourceType) {
      case 'Patient':
        responseData = patientResource(pid);
        break;
      case 'Observation':
        responseData = observationBundle(pid);
        break;
      case 'Encounter':
        responseData = encounterBundle(pid);
        break;
      case 'Condition':
        responseData = conditionBundle(pid);
        break;
      default:
        responseData = { resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: 'not-supported', diagnostics: `Resource type '${resourceType}' not supported in simulator` }] };
    }

    // Inject vendor metadata if specified
    if (vendor && vendorMeta[vendor] && typeof responseData === 'object' && responseData !== null) {
      (responseData as Record<string, unknown>).meta = {
        ...((responseData as Record<string, unknown>).meta as object || {}),
        ...vendorMeta[vendor],
        tag: [{ system: 'https://vitasignal.ai/fhir/vendor', code: vendor }],
      };
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/fhir+json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
