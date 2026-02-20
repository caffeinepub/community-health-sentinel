# Specification

## Summary
**Goal:** Fix the IC0508 canister rejection error preventing the outbreak risk calculation from completing successfully in the Government Data Panel.

**Planned changes:**
- Debug and resolve the IC0508 canister stopped error occurring when predictOutbreakRisk is called from the GovernmentDataPanel component
- Verify backend predictOutbreakRisk function handles all input parameters correctly and implements the 7-day moving average calculation without runtime errors
- Add comprehensive error handling in GovernmentDataPanel's handleUpdateRisk function with specific error messages for canister rejections, network failures, and validation errors
- Ensure risk calculation completes successfully and updates all dashboard visualizations (RiskGauge, DiseaseClassification, WardHeatmap, InterventionPriority)

**User-visible outcome:** Users can successfully click "Update & Recalculate Risk" button to calculate outbreak probability without seeing canister rejection errors. The dashboard displays valid risk percentages and updates all visualization components, with meaningful error messages shown if calculation fails.
