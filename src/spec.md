# Specification

## Summary
**Goal:** Implement strict role-based data control by completely separating Common Citizen, Hospital/PHC, and Government dashboard views with distinct data entry, visualization, and alert capabilities.

**Planned changes:**
- Remove all environmental input forms and risk calculation controls from Common Citizen dashboard view
- Create new LastGovernmentReport component displaying read-only government inspection data with timestamp
- Add "Public Transparency Dashboard" title to Common Citizen view
- Restrict Common Citizen view to only: LastGovernmentReport, RiskGauge (read-only), DiseaseClassification, SafetyAdvisory, PreventiveRecommendations, WardHeatmap (read-only), and AlertHistory (read-only)
- Create new GovernmentDataPanel component with 15 input fields including Ward, environmental metrics (rainfall, humidity, turbidity, bacteria), infrastructure data (sanitation coverage, water treatment coverage), and operational status fields
- Add "Update & Recalculate Risk" button in GovernmentDataPanel that validates inputs, calls backend risk prediction, updates all dashboard visualizations, creates alert history entry, and shows loading/success/error states
- Implement automatic email alert triggering via EmailJS when risk exceeds 70% using EmailAlertService
- Add manual "Send Alert Email" button in GovernmentDataPanel for on-demand alerts
- Expand AlertHistory component to 14 columns including all environmental inputs, calculated outputs, email sent status, and recommended actions
- Update alert storage to include complete environmental inputs, calculated risk outputs, email status, and recommended actions
- Implement priority score calculation formula (outbreak_probability × vulnerability_weight) in InterventionPriority component with top 3 wards highlighted in red with "Immediate Intervention Required" badge
- Simplify RiskPredictionPanel for Hospital/PHC view by removing government-only fields
- Maintain consistent white/blue/red/yellow/green government dashboard styling across all components

**User-visible outcome:** Common Citizens see a read-only public transparency dashboard with the latest government inspection report and risk status. Hospital/PHC users can input limited data for risk assessment. Government users have exclusive access to a comprehensive 15-field data entry panel that triggers full risk recalculation, updates all dashboard visualizations, stores complete alert history, and automatically sends email alerts when risk exceeds 70%.
