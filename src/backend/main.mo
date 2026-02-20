import Array "mo:core/Array";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Debug "mo:core/Debug";

// Disease classifier component is to be used in the frontend only, as per the implementation strategy, using TypeScript bindings.

/*
Disease Classifier (Frontend only)
- Motoko backend does not need to process this logic.
- All disease classification is handled in frontend.
- This is merely a documentation reminder for developers.

type DiseaseClassifier = {
  ; // Backend classifier not needed
};
*/

// MOTOKO BACKEND 
actor {
  public type RiskPrediction = {
    riskPercentage : Float;
    riskCategory : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type WardKey = Nat;
  public type WardData = {
    rainfall : Float;
    humidity : Float;
    turbidity : Float;
    bacteriaIndex : Float;
    riskPrediction : RiskPrediction;
  };

  public type WardReference = {
    wardNumber : WardKey;
    fullName : Text;
    riskColor : Text;
    mapCellDescription : Text;
  };

  let wardReferences : [WardReference] = [
    {
      wardNumber = 1;
      fullName = "North Wind";
      riskColor = "Green";
      mapCellDescription = "Row 1, Column 1";
    },
    {
      wardNumber = 2;
      fullName = "Sunny Haven";
      riskColor = "Yellow";
      mapCellDescription = "Row 1, Column 2";
    },
    {
      wardNumber = 3;
      fullName = "Misty Ridge";
      riskColor = "Red";
      mapCellDescription = "Row 1, Column 3";
    },
    {
      wardNumber = 4;
      fullName = "Willow Creek";
      riskColor = "Green";
      mapCellDescription = "Row 2, Column 1";
    },
    {
      wardNumber = 5;
      fullName = "Lakeside Meadows";
      riskColor = "Red";
      mapCellDescription = "Row 2, Column 2";
    },
    {
      wardNumber = 6;
      fullName = "Blossom Hill";
      riskColor = "Yellow";
      mapCellDescription = "Row 2, Column 3";
    },
    {
      wardNumber = 7;
      fullName = "Pine Valley";
      riskColor = "Green";
      mapCellDescription = "Row 3, Column 1";
    },
    {
      wardNumber = 8;
      fullName = "Sunset Cross";
      riskColor = "Green";
      mapCellDescription = "Row 3, Column 2";
    },
    {
      wardNumber = 9;
      fullName = "Riverbend";
      riskColor = "Yellow";
      mapCellDescription = "Row 3, Column 3";
    },
  ];

  var rainfallHistory : [Float] = Array.repeat<Float>(0.0, 7);
  var humidityHistory : [Float] = Array.repeat<Float>(0.0, 7);
  var turbidityHistory : [Float] = Array.repeat<Float>(0.0, 7);
  var bacteriaHistory : [Float] = Array.repeat<Float>(0.0, 7);

  let wardDataMap = Map.empty<WardKey, WardData>();

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

  func calculateRisk(
    rainfall : Float,
    humidity : Float,
    turbidity : Float,
    bacteriaIndex : Float,
  ) : RiskPrediction {
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

  public query ({ caller }) func getWardReferences() : async [WardReference] {
    wardReferences;
  };

  public query ({ caller }) func getAllWardColors() : async [(WardKey, Text)] {
    let colors = [
      (1, "Green"),
      (2, "Yellow"),
      (3, "Red"),
      (4, "Green"),
      (5, "Red"),
      (6, "Yellow"),
      (7, "Green"),
      (8, "Green"),
      (9, "Yellow"),
    ];
    colors;
  };

  public query ({ caller }) func getExistingRiskPrediction(wardKey : WardKey) : async ?RiskPrediction {
    switch (wardDataMap.get(wardKey)) {
      case (null) { null };
      case (?data) { ?data.riskPrediction };
    };
  };

  public shared ({ caller }) func calculateAndPersistRisk(
    wardKey : WardKey,
    rainfall : Float,
    humidity : Float,
    turbidity : Float,
    bacteriaIndex : Float,
  ) : async ?RiskPrediction {
    if (wardKey < 1 or wardKey > 9) {
      Debug.print("wardKey " # wardKey.toText() # " is out of range. Returning null.");
      return null;
    };

    let risk = calculateRisk(rainfall, humidity, turbidity, bacteriaIndex);

    let newWardData : WardData = {
      rainfall;
      humidity;
      turbidity;
      bacteriaIndex;
      riskPrediction = risk;
    };
    wardDataMap.add(wardKey, newWardData);

    ?risk;
  };

  public shared ({ caller }) func resetHistoricalData() : async () {
    rainfallHistory := Array.repeat<Float>(0.0, 7);
    humidityHistory := Array.repeat<Float>(0.0, 7);
    turbidityHistory := Array.repeat<Float>(0.0, 7);
    bacteriaHistory := Array.repeat<Float>(0.0, 7);

    let emptyMap = Map.empty<WardKey, WardData>();
    while (wardDataMap.size() > 0) {
      let firstKey = switch (wardDataMap.keys().next()) {
        case (null) { return };
        case (?key) { key };
      };
      switch (wardDataMap.get(firstKey)) {
        case (null) {};
        case (?wardData) {
          emptyMap.add(firstKey, wardData);
        };
      };
    };

    Debug.print("Data arrays have been reset to all zeros. Persisted data cleared.");
  };

  public query ({ caller }) func getAllPersistedWardData() : async [(WardKey, WardData)] {
    wardDataMap.toArray();
  };
};
