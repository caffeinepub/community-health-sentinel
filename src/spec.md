# Specification

## Summary
**Goal:** Make the Disease Risk Distribution calculate disease probabilities dynamically based on environmental input data instead of using hardcoded values.

**Planned changes:**
- Update DiseaseClassification component to calculate Cholera, Typhoid, Dysentery, and Hepatitis A probabilities using weighted formulas based on rainfall, humidity, turbidity, and bacteria index
- Add custom event dispatching in GovernmentDataPanel after successful risk calculation to trigger disease probability recalculation
- Add custom event dispatching in RiskPredictionPanel after successful prediction to trigger disease probability recalculation
- Add event listener in DiseaseClassification to handle disease-classification-updated events and recalculate probabilities
- Normalize all calculated probabilities to sum to 100%
- Maintain existing UI with bar chart, pie chart, and red highlighting for highest probability disease

**User-visible outcome:** Disease risk percentages in the Disease Classification panel will automatically update based on the environmental data entered (rainfall, humidity, turbidity, bacteria index) rather than showing static hardcoded values.
