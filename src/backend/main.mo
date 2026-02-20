import Float "mo:core/Float";
import Int "mo:core/Int";

actor {
  public type RiskPrediction = {
    riskPercentage : Float;
    riskCategory : Text;
  };

  public shared ({ caller }) func predictOutbreakRisk(rainfall : Float, humidity : Float, turbidity : Float, bacteriaIndex : Float) : async RiskPrediction {
    let normalizedRainfall = if (rainfall > 200) { 1.0 } else { rainfall / 200 };
    let normalizedHumidity = humidity / 100;
    let normalizedTurbidity = if (turbidity > 50) { 1.0 } else { turbidity / 50 };
    let normalizedBacteria = if (bacteriaIndex > 1000) { 1.0 } else { bacteriaIndex / 1000 };

    let weightedSum = (
      normalizedRainfall * 0.3 +
      normalizedHumidity * 0.2 +
      normalizedTurbidity * 0.25 +
      normalizedBacteria * 0.25
    );

    let riskPercentage = (weightedSum * 0.85 + 0.15) * 100;
    let roundedRisk = Int.abs(riskPercentage.toInt()).toFloat();
    let riskCategory =
      if (roundedRisk < 40) {
        "Low (Green)";
      } else if (roundedRisk < 70) {
        "Moderate (Orange)";
      } else {
        "High (Red)";
      };

    {
      riskPercentage = roundedRisk;
      riskCategory;
    };
  };
};
