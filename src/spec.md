# Specification

## Summary
**Goal:** Upgrade Community Health Sentinel to a production-grade system with role-based dashboards, disease classification, 9-ward risk heatmap, priority scoring, alert history, EmailJS integration, and advanced visualizations for waterborne disease outbreak prediction in Coimbatore District.

**Planned changes:**
- Update RoleSelector labels to "Select User Type" with roles: Common Citizen, Hospital / PHC, Government Health Authority
- Add Disease Classification System showing probability distribution for Cholera, Typhoid, Dysentery, and Hepatitis A with bar and pie charts
- Expand WardHeatmap to 3x3 grid displaying 9 wards with color-coded risk levels (Green <30%, Yellow 30-70%, Red >70%)
- Create Intervention Priority component with vulnerability-weighted priority scoring, sortable table, bar chart, and deployment recommendations
- Add Alert History system storing MEDIUM/HIGH risk predictions with filtering by ward and risk level
- Create Patient Case Trend graph showing 30-day historical case volume
- Add Ward Comparison bar chart showing outbreak probability across all 9 wards
- Create Resource Estimation chart showing required medical staff, beds, water purification units, and chlorination teams
- Integrate EmailJS with placeholder configuration for alert email functionality
- Add automatic email alerts when risk exceeds 70% and manual "Send Alert Email" button
- Add CSV export functionality for Government dashboard with all ward data
- Implement role-specific dashboard layouts: Common Citizen (basic risk info + disease breakdown), Hospital/PHC (ward-specific data + manual alerts), Government (comprehensive analytics + priority management)
- Add ward selector dropdown for Hospital/PHC view with additional input fields (reported cases, sanitation coverage, water treatment coverage, population density)
- Enhance backend with 7-day moving average calculation for environmental parameters
- Generate realistic simulated ward-level data for all 9 wards
- Update all color thresholds to new classification: <30% Low (Green), 30-70% Medium (Yellow), >70% High (Red)
- Implement tab-based navigation for Government dashboard: Overview, Intervention Priority, Alert History, Analytics
- Ensure pure white backgrounds and consistent professional color theme across all components

**User-visible outcome:** Users can access role-specific dashboards with Common Citizens viewing basic risk information and disease probabilities, Hospital/PHC staff entering ward-specific data and managing alerts, and Government officials accessing comprehensive analytics including priority rankings, intervention recommendations, alert history, trend analysis, resource estimation, and CSV export capabilities, all powered by enhanced prediction algorithms and automated email notifications.
