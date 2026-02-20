# Specification

## Summary
**Goal:** Enhance the Community Health Sentinel dashboard with predictive forecasting, enhanced risk analysis, automated alerts, ward-level heatmap, explainable AI factors, and data freshness indicators.

**Planned changes:**
- Add 14-Day Predictive Forecast section below Risk Trends with line chart showing outbreak probability projection, confidence score, and model AUC
- Enhance Real-Time Risk Analysis card with color-coded status text (Low/Moderate/High Risk) and prediction confidence label
- Add Automated Response Recommendation panel below Risk Analysis with color-coded alert boxes (red for high risk, yellow for moderate, green for low) and recommended actions
- Add Ward Risk Distribution section with 8 ward cards displaying risk percentages, levels, and color-coded borders with legend
- Add Explainable AI – Factor Contribution section with horizontal impact bars for Rainfall, Humidity, Turbidity, and Bacteria Index, plus explanation text
- Add data freshness footer at bottom showing last update timestamp and data sources
- Generate realistic mock data for 14-day forecast and 8-ward risk distribution

**User-visible outcome:** Users can view predictive outbreak forecasts, receive automated response recommendations based on risk levels, see ward-level risk distribution across 8 geographic areas, understand which factors drive outbreak risk through explainable AI visualizations, and verify data freshness.
