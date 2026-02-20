# Specification

## Summary
**Goal:** Revert the entire codebase to Version 17 state, removing all changes introduced in Version 18 and Version 19.

**Planned changes:**
- Remove multi-class disease classification features (diseaseClassifier.ts, FeatureImportance, DiagnosticReasoning components)
- Restore GovernmentDataPanel to original 15 input fields (remove symptom fields: diarrhea, fever, jaundice, bloody stool, skin rash; remove extended water quality fields: fecal coliform, WQI, primary season, water source, treatment status)
- Restore RiskPredictionPanel to 8 core input fields (environmental + hospital-specific only)
- Restore DiseaseClassification to show only 4 diseases (Cholera, Typhoid, Dysentery, Hepatitis A) with Version 17 calculation logic
- Remove FeatureImportance and DiagnosticReasoning from DashboardPage rendering
- Restore AlertHistory to Version 17 columns (remove Confidence column, show only original 4 diseases)
- Verify backend predictOutbreakRisk matches Version 17 implementation (no symptom or extended water quality parameters)

**User-visible outcome:** Application functions identically to Version 17, with the original 4-disease classification system, 15 government input fields, and simple environmental risk calculation without any Version 18/19 enhancements.
