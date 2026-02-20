import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Debug "mo:core/Debug";
import Text "mo:core/Text";
import Time "mo:core/Time";

actor {
  public type RiskPrediction = {
    riskPercentage : Float;
    riskCategory : Text;
    message : Text;
    timestamp : Time.Time;
  };

  var rainfallHistory : [Float] = Array.repeat<Float>(0.0, 7);
  var humidityHistory : [Float] = Array.repeat<Float>(0.0, 7);
  var turbidityHistory : [Float] = Array.repeat<Float>(0.0, 7);
  var bacteriaHistory : [Float] = Array.repeat<Float>(0.0, 7);

  func calculateSum(slice : [Float]) : Float {
    slice.foldLeft(0.0, func(acc, value) { acc + value });
  };

  func calculateMovingAverage(data : [Float]) : Float {
    var sum = 0.0;
    let nonZeroData = data.filter(func(value) { value != 0.0 });
    let size = nonZeroData.size();
    if (size > 0) {
      sum := calculateSum(nonZeroData);
      sum / size.toFloat();
    } else {
      sum := calculateSum(data);
      sum / data.size().toFloat();
    };
  };

  public shared ({ caller }) func resetHistoricalData() : async () {
    rainfallHistory := Array.repeat<Float>(0.0, 7);
    humidityHistory := Array.repeat<Float>(0.0, 7);
    turbidityHistory := Array.repeat<Float>(0.0, 7);
    bacteriaHistory := Array.repeat<Float>(0.0, 7);
    Debug.print("Historical data arrays have been reset to all zeros.");
  };

  func updateHistory(newValue : Float, history : [Float]) : [Float] {
    Array.tabulate<Float>(7, func(i) { if (i == 0) { newValue } else { history[i - 1] } });
  };

  func safeValue(v : Float, max : Float) : Float {
    if (v < 0) { 0.0 } else if (v > max) { max } else { v };
  };

  func normalizedValue(value : Float, max : Float) : Float {
    value / max;
  };

  func logInput(varName : Text, value : Float) {
    let logMsg = "Variable '" # varName # "' received value: " # value.toText();
    Debug.print(logMsg);
  };

  func logCalculation(stepName : Text, value : Float) {
    let logMsg = "Calculation Step '" # stepName # "' result: " # value.toText();
    Debug.print(logMsg);
  };

  public shared ({ caller }) func predictOutbreakRisk(
    rainfall : Float,
    humidity : Float,
    turbidity : Float,
    bacteriaIndex : Float,
  ) : async RiskPrediction {
    logInput("rainfall", rainfall);
    logInput("humidity", humidity);
    logInput("turbidity", turbidity);
    logInput("bacteriaIndex", bacteriaIndex);

    rainfallHistory := updateHistory(rainfall, rainfallHistory);
    humidityHistory := updateHistory(humidity, humidityHistory);
    turbidityHistory := updateHistory(turbidity, turbidityHistory);
    bacteriaHistory := updateHistory(bacteriaIndex, bacteriaHistory);

    let normalizedRainfall = normalizedValue(safeValue(calculateMovingAverage(rainfallHistory), 200), 200);
    let normalizedHumidity = normalizedValue(safeValue(calculateMovingAverage(humidityHistory), 100), 100);
    let normalizedTurbidity = normalizedValue(safeValue(calculateMovingAverage(turbidityHistory), 50), 50);
    let normalizedBacteria = normalizedValue(safeValue(calculateMovingAverage(bacteriaHistory), 1000), 1000);

    logCalculation("normalizedRainfall", normalizedRainfall);
    logCalculation("normalizedHumidity", normalizedHumidity);
    logCalculation("normalizedTurbidity", normalizedTurbidity);
    logCalculation("normalizedBacteria", normalizedBacteria);

    let environmentalRiskScore = (
      normalizedRainfall * 0.3 +
      normalizedTurbidity * 0.25 +
      normalizedBacteria * 0.25 +
      normalizedHumidity * 0.2
    );
    logCalculation("environmentalRiskScore", environmentalRiskScore);

    let populationDensityFactor = 1.1;
    let seasonalVariationFactor = 0.9;
    let historicalTrendFactor = 1.05;

    let adjustedRiskScore = (
      environmentalRiskScore *
      populationDensityFactor *
      seasonalVariationFactor *
      historicalTrendFactor
    );
    logCalculation("adjustedRiskScore", adjustedRiskScore);

    let riskPercentage = adjustedRiskScore * 100;
    let clampedRisk = if (riskPercentage > 100) { 100.0 } else { riskPercentage };
    let roundedRisk = Int.abs(clampedRisk.toInt()).toFloat();
    logCalculation("riskPercentage", roundedRisk);

    let riskCategory =
      if (roundedRisk < 30) {
        "Low (Green)";
      } else if (roundedRisk < 70) {
        "Medium (Yellow/Amber)";
      } else {
        "High (Red)";
      };

    let message = "Risk calculation completed successfully. Refer to logs for detailed computation steps.";

    {
      riskPercentage = roundedRisk;
      riskCategory;
      message;
      timestamp = Time.now();
    };
  };
};
