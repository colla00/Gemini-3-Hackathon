# Predetermined Change Control Plan
## VitaSignal Clinical Intelligence Platform
**Document ID:** CCP-001  
**Version:** 1.0  
**Date:** 2026-03-10  
**Standard:** FDA Predetermined Change Control Plan (PCCP) Guidance (Sept 2023)

---

## 1. Purpose

Define the predetermined modifications that can be made to VitaSignal's AI/ML algorithms without requiring a new regulatory submission, in accordance with the FDA's PCCP guidance for AI/ML-enabled medical devices.

## 2. Scope

This plan covers modifications to:
- Machine learning model parameters and weights
- Risk scoring thresholds and calibration
- Feature engineering and selection
- Training data composition
- User interface elements affecting clinical interpretation

## 3. Modification Protocol

### 3.1 Description of Planned Modifications

| Mod ID | Modification Type | Scope | Trigger Condition |
|--------|-------------------|-------|-------------------|
| M-001 | Model retraining | Update model weights with new data | AUC degradation > 2% from baseline |
| M-002 | Threshold recalibration | Adjust risk tier boundaries | Calibration drift > 5% across any subgroup |
| M-003 | Feature addition | Add new temporal documentation features | New validated EHR documentation patterns identified |
| M-004 | Feature removal | Remove underperforming features | Feature SHAP importance drops below 1% consistently |
| M-005 | Training data expansion | Include new hospital site data | New site passes data quality checks |
| M-006 | Bias correction | Adjust model to reduce demographic disparity | Demographic parity gap > 20% (80% rule violation) |

### 3.2 Modification Boundaries (Guardrails)

Each modification must remain within these predetermined boundaries:

| Parameter | Minimum Acceptable | Maximum Acceptable |
|-----------|-------------------|-------------------|
| AUC-ROC | ≥ 0.82 | — |
| Sensitivity (high-risk) | ≥ 0.75 | — |
| Specificity | ≥ 0.70 | — |
| Calibration slope | 0.85 | 1.15 |
| Demographic parity ratio | 0.80 | 1.20 |
| Equalized odds difference | — | ≤ 0.10 |
| False negative rate (high-risk) | — | ≤ 0.15 |
| Intended use | No change permitted | — |
| Input data types | Temporal documentation patterns only | — |
| Output format | Risk score + SHAP explanation | — |

### 3.3 Modifications NOT Covered (Require New Submission)

- Change to intended use or intended patient population
- Change to software safety classification (Class B → Class C)
- Addition of non-documentation input data (vitals, labs, imaging)
- Fundamental architecture change (e.g., switching from gradient boosting to deep learning)
- Expansion to non-ICU clinical settings
- Integration of real-time physiological monitoring data

## 4. Verification and Validation Protocol

### 4.1 Pre-Modification Validation

| Step | Activity | Acceptance Criteria | Responsible |
|------|----------|-------------------|-------------|
| 1 | Baseline performance capture | Document current metrics | ML Engineer |
| 2 | Holdout test set evaluation | Metrics within guardrails | ML Engineer |
| 3 | Subgroup analysis | All subgroups within equity thresholds | ML Engineer |
| 4 | SHAP consistency check | Top-5 features remain clinically interpretable | Clinical Advisor |

### 4.2 Post-Modification Validation

| Step | Activity | Acceptance Criteria | Responsible |
|------|----------|-------------------|-------------|
| 1 | Performance comparison | All metrics ≥ pre-modification baseline | ML Engineer |
| 2 | Calibration assessment | Slope between 0.85–1.15 | ML Engineer |
| 3 | Equity audit | Demographic parity ≥ 80% rule | Equity Officer |
| 4 | Clinical review | SHAP explanations clinically coherent | Clinical Advisor |
| 5 | Regression testing | No degradation in existing functionality | QA Engineer |
| 6 | Documentation update | DHF, risk analysis, and release notes updated | Regulatory |

### 4.3 Automated Monitoring Triggers

| Metric | Monitoring Frequency | Alert Threshold | Action |
|--------|---------------------|-----------------|--------|
| AUC-ROC | Weekly | Drop > 1% | Investigation |
| Calibration drift | Weekly | Deviation > 3% | Recalibration review |
| Demographic disparity | Weekly | Gap > 15% | Equity review |
| Feature stability | Monthly | Top-5 feature change | Clinical review |
| Data drift (PSI) | Weekly | PSI > 0.1 | Data quality review |
| Prediction volume anomaly | Daily | ±50% from rolling average | System review |

## 5. Documentation Requirements

Each modification must produce:

1. **Modification Request Form** — Description, justification, and risk assessment
2. **Pre-Modification Baseline Report** — Current performance metrics
3. **Validation Report** — Post-modification metrics vs. guardrails
4. **Clinical Review Sign-Off** — Clinical advisor approval
5. **Release Notes** — Summary of changes for clinicians
6. **Updated Risk Analysis** — ISO 14971 impact assessment
7. **Traceability Update** — Requirements ↔ design ↔ test linkage

## 6. Rollback Protocol

If any modification fails validation:

1. **Immediate rollback** to previous model version
2. **Incident report** filed within 24 hours
3. **Root cause analysis** completed within 5 business days
4. **CAPA initiated** if systemic issue identified
5. **Stakeholder notification** if clinically significant

## 7. Governance

| Role | Responsibility |
|------|---------------|
| ML Engineer | Implement modification, run validation |
| Clinical Advisor | Review clinical coherence of changes |
| QA Engineer | Execute regression and integration tests |
| Regulatory Affairs | Verify PCCP compliance, update documentation |
| Privacy Officer | Assess data handling implications |
| **Change Control Board** | **Final approval authority for all modifications** |

### 7.1 Change Control Board Composition

- CTO (Chair)
- Clinical Advisor
- Regulatory Affairs Lead
- ML Engineering Lead
- Quality Assurance Lead

### 7.2 Meeting Schedule

- **Routine changes:** Monthly CCB review
- **Urgent changes (safety-related):** Ad-hoc within 48 hours
- **Emergency rollbacks:** Immediate with retrospective CCB review within 5 days

## 8. Audit Trail

All modifications are logged with:
- Modification ID and type
- Date and responsible party
- Pre/post performance metrics
- Validation report reference
- CCB approval record
- Deployment confirmation

---

*This plan will be submitted as part of any future regulatory filing. It is maintained alongside the algorithm and updated when new modification types are identified.*
