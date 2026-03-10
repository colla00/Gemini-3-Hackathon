# Post-Market Clinical Follow-up (PMCF) Plan
## VitaSignal Clinical Intelligence Platform
**Document ID:** PMCF-001  
**Version:** 1.0  
**Date:** 2026-03-10  
**Standard:** MDR Annex XIV Part B / MEDDEV 2.12/2 Rev. 2

---

## 1. Purpose

Define the Post-Market Clinical Follow-up plan for VitaSignal to proactively collect and evaluate clinical data throughout the product lifecycle, confirming continued safety, performance, and clinical benefit.

## 2. Current Status

**VitaSignal is in pre-market research phase.** This PMCF plan is established proactively to:
- Define the surveillance framework before clinical deployment
- Align with EU MDR requirements (anticipatory compliance)
- Demonstrate regulatory maturity to investors and partners
- Ensure smooth transition from research to clinical deployment

## 3. PMCF Objectives

1. Confirm continued acceptable benefit-risk ratio
2. Detect previously unknown risks or performance degradation
3. Identify systematic misuse or off-label use patterns
4. Validate real-world clinical effectiveness across diverse settings
5. Update clinical evaluation based on real-world evidence
6. Monitor AI algorithm performance stability (model drift)

## 4. Clinical Performance Indicators

### 4.1 Primary Performance Metrics

| Metric | Target | Monitoring Frequency | Alert Threshold |
|--------|--------|---------------------|-----------------|
| AUC-ROC (mortality prediction) | ≥ 0.85 | Weekly | Drop > 2% |
| Sensitivity (high-risk detection) | ≥ 0.80 | Weekly | Drop > 5% |
| Specificity | ≥ 0.75 | Weekly | Drop > 5% |
| Positive predictive value | ≥ 0.70 | Weekly | Drop > 5% |
| Calibration slope | 0.90–1.10 | Weekly | Outside range |
| Alert-to-intervention time | < 30 minutes (median) | Monthly | Increase > 50% |

### 4.2 Safety Metrics

| Metric | Target | Monitoring | Alert |
|--------|--------|-----------|-------|
| False negative rate (high-risk) | ≤ 10% | Weekly | > 15% |
| Missed critical deterioration | 0 events | Continuous | Any event |
| Alert fatigue index | < 30% override rate | Monthly | > 40% |
| Unintended system influence on care | 0 documented events | Continuous | Any event |

### 4.3 Equity Metrics

| Metric | Target | Monitoring | Alert |
|--------|--------|-----------|-------|
| Demographic parity ratio | 0.80–1.20 | Weekly | Outside range |
| Equalized odds difference | ≤ 0.10 | Weekly | > 0.10 |
| Subgroup AUC variance | < 0.05 | Monthly | > 0.05 |
| Calibration equity (across groups) | Within 5% | Monthly | > 5% deviation |

## 5. Data Collection Methods

### 5.1 Automated Surveillance

| Data Source | Collection Method | Frequency |
|-------------|------------------|-----------|
| Prediction accuracy | Outcome tracking vs. predictions | Continuous |
| System performance | SLA metrics (response time, uptime) | Continuous |
| User behavior analytics | Audit logs, session analytics | Continuous |
| Model drift indicators | Feature distribution monitoring | Weekly |
| Equity metrics | Automated subgroup analysis | Weekly |

### 5.2 Active Clinical Data Collection

| Activity | Method | Frequency | Responsible |
|----------|--------|-----------|-------------|
| Clinician surveys | Structured questionnaire | Quarterly | Clinical Advisor |
| Usability assessment | Task completion analysis | Semi-annual | UX Researcher |
| Clinical outcome correlation | Chart review (de-identified) | Semi-annual | Clinical Advisor |
| Site visit assessments | On-site observation | Annual | Quality Manager |
| Advisory board review | Expert panel meeting | Semi-annual | Regulatory Affairs |

### 5.3 Passive Surveillance

| Source | Data Type | Review Frequency |
|--------|-----------|-----------------|
| User feedback/complaints | Free-text + categorized | Weekly |
| Support tickets | Issue categories + resolution | Monthly |
| Literature review | Relevant publications | Quarterly |
| Regulatory database monitoring | FDA MAUDE, EU Vigilance | Quarterly |
| Competitor surveillance | Comparative performance data | Semi-annual |

## 6. Analysis and Reporting

### 6.1 PMCF Reports

| Report | Frequency | Audience | Content |
|--------|-----------|----------|---------|
| Monthly performance summary | Monthly | CTO, Quality Manager | Key metrics, trends |
| Quarterly clinical review | Quarterly | CCB, Clinical Advisor | Clinical data analysis |
| Annual PMCF report | Annual | Management, Regulatory | Comprehensive evaluation |
| Safety signal report | As needed | CCB (urgent) | Risk assessment of signals |

### 6.2 Trend Analysis

- **Statistical process control (SPC)** charts for key metrics
- **Cumulative sum (CUSUM)** analysis for drift detection
- **Subgroup analysis** for equity monitoring
- **Time-series analysis** for seasonal patterns

## 7. Actions Based on PMCF Findings

| Finding Category | Action | Timeline |
|-----------------|--------|----------|
| Performance within expectations | Continue monitoring | Ongoing |
| Minor performance deviation | Investigation + root cause | 10 business days |
| Significant performance degradation | Model recalibration per PCCP | 5 business days |
| Safety signal detected | Immediate risk assessment | 24 hours |
| New risk identified | ISO 14971 risk analysis update | 5 business days |
| Equity threshold violation | Bias correction per PCCP | 5 business days |
| Benefit-risk ratio concern | CCB review + potential withdrawal | 48 hours |

## 8. PMCF Evaluation Schedule

| Year | Primary Activities |
|------|-------------------|
| Year 1 (deployment) | Baseline establishment, intensive monitoring (weekly reviews) |
| Year 2 | Routine monitoring, first annual PMCF report |
| Year 3 | Multi-site comparison, first external review |
| Year 5 | Comprehensive clinical evaluation update |
| Ongoing | Continuous per schedule above |

## 9. Integration with Other QMS Processes

| Process | Integration Point |
|---------|------------------|
| Risk management (ISO 14971) | PMCF findings feed into risk analysis updates |
| CAPA (ISO 13485 §8.5) | Safety signals trigger CAPA investigations |
| Change control (PCCP) | Performance data triggers predetermined modifications |
| MDR reporting | Reportable events identified through PMCF |
| Clinical evaluation | PMCF data incorporated into updated clinical evaluation |
| Internal audit | PMCF effectiveness audited per IAP-001 |

---

*This PMCF plan will be activated upon first clinical deployment. The monitoring infrastructure (automated metrics, equity analysis, SLA dashboards) is already operational in the research prototype.*
