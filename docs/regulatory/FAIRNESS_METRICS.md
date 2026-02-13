# Fairness Metrics Definition
## VitaSignal Clinical Intelligence Platform
**Document ID:** EQ-001  
**Version:** 1.0  
**Date:** 2026-02-13  
**Standard:** FDA Equity Guidance / AIM-AHEAD Framework

---

## 1. Purpose

Define quantitative fairness thresholds for the VitaSignal risk prediction system to ensure equitable performance across demographic subgroups.

## 2. Protected Groups Monitored

| Attribute | Subgroups | Data Source |
|-----------|-----------|-------------|
| Age | <45, 45–64, 65–79, ≥80 | MIMIC-IV |
| Sex | Male, Female | MIMIC-IV |
| Race/Ethnicity | White, Black, Hispanic, Asian, Other/Unknown | MIMIC-IV |
| Insurance | Medicare, Medicaid, Private, Self-Pay | MIMIC-IV |

## 3. Fairness Metrics & Thresholds

### 3.1 Demographic Parity
**Definition:** P(Ŷ=High Risk | Group=A) ≈ P(Ŷ=High Risk | Group=B)  
**Threshold:** Ratio of positive prediction rates between any two groups must be within **0.80–1.25** (80% rule).  
**Monitoring:** Health Equity Analyzer dashboard, updated per prediction cycle.

### 3.2 Equalized Odds
**Definition:** Equal true positive rates (TPR) and false positive rates (FPR) across groups.  
**Threshold:**
- TPR difference between any two groups: **≤ 0.10** (10 percentage points)
- FPR difference between any two groups: **≤ 0.10** (10 percentage points)

### 3.3 Predictive Parity
**Definition:** Equal positive predictive value (PPV) across groups.  
**Threshold:** PPV difference between any two groups: **≤ 0.10**

### 3.4 Calibration Equity
**Definition:** Predicted probabilities align with observed outcomes equally across groups.  
**Threshold:** Brier score difference between any two groups: **≤ 0.05**

## 4. Monitoring Implementation

| Metric | Tool | Frequency |
|--------|------|-----------|
| Demographic Parity | Health Equity Analyzer | Per prediction cycle |
| Equalized Odds | Equity Monitoring Engine | Per prediction cycle |
| Subgroup AUC | Bias Monitoring Dashboard | Continuous |
| Calibration | Performance Monitoring Dashboard | Weekly aggregate |

## 5. Remediation Protocol

When a fairness threshold is exceeded:

1. **Alert:** Equity monitoring engine flags the violation
2. **Investigation:** Analyze which subgroup is affected and potential causes
3. **Documentation:** Log in CAPA system as a Major severity issue
4. **Action:** Evaluate model recalibration, threshold adjustment, or feature review
5. **Verification:** Confirm metric returns to acceptable range post-intervention

## 6. Limitations & Transparency

- Fairness metrics are evaluated on MIMIC-IV (single-center, retrospective)
- Small subgroup sizes may produce unstable estimates
- Intersectional fairness (e.g., elderly Black females) requires larger datasets
- These thresholds will be refined during prospective multi-site validation

## 7. References

- FDA. "Diversity and Inclusion in Clinical Trials" (2024)
- AIM-AHEAD. "Algorithmic Fairness in Healthcare AI" (2024)
- Obermeyer et al. "Dissecting racial bias in an algorithm" Science (2019)

---

*Thresholds are subject to revision based on prospective validation data and regulatory feedback.*
