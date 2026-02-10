// Patent domain types - centralized for reuse across components

export type ClaimCategory = 'system' | 'explainability' | 'forecasting' | 'thresholds' | 'feedback' | 'workflow' | 'trust' | 'equity' | 'dbs' | 'workload' | 'integration' | 'temporal' | 'phenotype';
export type ClaimStatus = 'implemented' | 'demonstrated' | 'prototype';
export type PatentId = 'trust-alerts' | 'risk-intelligence' | 'unified-platform' | 'dbs-system' | 'icu-mortality' | 'chartminder';

export interface PatentClaim {
  number: number;
  title: string;
  description: string;
  category: ClaimCategory;
  implementation: string;
  componentPath: string;
  status: ClaimStatus;
  demoSection?: string;
  patentId: PatentId;
}

export interface AttestationData {
  id?: string;
  witnessName: string;
  witnessTitle: string;
  witnessEmail: string;
  organization: string;
  attestedAt: string | null;
  signature: string;
  signatureImage?: string;
  persistedAt?: string;
}

export interface ClaimScreenshot {
  id: string;
  file_path: string;
  caption?: string | null;
}

export interface VideoSection {
  title: string;
  duration: string;
  claims: number[];
}

export interface CategoryConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}
