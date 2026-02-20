import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";

actor {
  public type RiskPrediction = {
    riskPercentage : Float;
    riskCategory : Text;
  };

  var rainfallHistory : [Float] = Array.repeat<Float>(0.0, 7);
  var humidityHistory : [Float] = Array.repeat<Float>(0.0, 7);
  var turbidityHistory : [Float] = Array.repeat<Float>(0.0, 7);
  var bacteriaHistory : [Float] = Array.repeat<Float>(0.0, 7);

  func calculateMovingAverage(data : [Float]) : Float {
    let sum = data.foldLeft(0.0, func(acc, value) { acc + value });
    sum / data.size().toFloat();
  };

  func updateHistory(newValue : Float, history : [Float]) : [Float] {
    Array.tabulate<Float>(7, func(i) { if (i == 0) { newValue } else { history[i - 1] } });
  };

  public shared ({ caller }) func predictOutbreakRisk(rainfall : Float, humidity : Float, turbidity : Float, bacteriaIndex : Float) : async RiskPrediction {
    rainfallHistory := updateHistory(rainfall, rainfallHistory);
    humidityHistory := updateHistory(humidity, humidityHistory);
    turbidityHistory := updateHistory(turbidity, turbidityHistory);
    bacteriaHistory := updateHistory(bacteriaIndex, bacteriaHistory);

    let safeValue = func(v : Float, max : Float) : Float {
      if (v < 0) { 0.0 } else if (v > max) { max } else { v };
    };

    let normalizedValue = func(value : Float, max : Float) : Float {
      value / max;
    };

    let normalizedRainfall = normalizedValue(safeValue(calculateMovingAverage(rainfallHistory), 200), 200);
    let normalizedHumidity = normalizedValue(safeValue(calculateMovingAverage(humidityHistory), 100), 100);
    let normalizedTurbidity = normalizedValue(safeValue(calculateMovingAverage(turbidityHistory), 50), 50);
    let normalizedBacteria = normalizedValue(safeValue(calculateMovingAverage(bacteriaHistory), 1000), 1000);

    let environmentalRiskScore = (
      normalizedRainfall * 0.3 +
      normalizedTurbidity * 0.25 +
      normalizedBacteria * 0.25 +
      normalizedHumidity * 0.2
    );

    let populationDensityFactor = 1.1;
    let seasonalVariationFactor = 0.9;
    let historicalTrendFactor = 1.05;

    let adjustedRiskScore = (
      environmentalRiskScore *
      populationDensityFactor *
      seasonalVariationFactor *
      historicalTrendFactor
    );

    let riskPercentage = adjustedRiskScore * 100;
    let clampedRisk = if (riskPercentage > 100) { 100.0 } else { riskPercentage };
    let roundedRisk = Int.abs(clampedRisk.toInt()).toFloat();

    let riskCategory =
      if (roundedRisk < 30) {
        "Low (Green)";
      } else if (roundedRisk < 70) {
        "Medium (Yellow/Amber)";
      } else {
        "High (Red)";
      };

    {
      riskPercentage = roundedRisk;
      riskCategory;
    };
  };
};
