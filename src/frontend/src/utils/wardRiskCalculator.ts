export interface WardCharacteristics {
  sanitation_coverage: number;
  water_treatment_coverage: number;
  population_density: number;
  environmental_multiplier: number;
}

function calculateSanitationFactor(sanitationCoverage: number): number {
  return (100 - sanitationCoverage) / 200;
}

function calculateWaterTreatmentFactor(waterTreatmentCoverage: number): number {
  return (100 - waterTreatmentCoverage) / 200;
}

function calculatePopulationDensityFactor(populationDensity: number): number {
  const densityFactor = (populationDensity - 2000) / 10000;
  return Math.max(0, Math.min(0.3, densityFactor));
}

function normalizeRisk(risk: number): number {
  return Math.max(0, Math.min(100, risk));
}

export function calculateWardRisk(
  baseRisk: number,
  characteristics: WardCharacteristics
): number {
  const sanitationFactor = calculateSanitationFactor(characteristics.sanitation_coverage);
  const waterTreatmentFactor = calculateWaterTreatmentFactor(characteristics.water_treatment_coverage);
  const populationDensityFactor = calculatePopulationDensityFactor(characteristics.population_density);
  const environmentalFactor = characteristics.environmental_multiplier - 1.0;
  
  const vulnerabilityMultiplier = 1.0 + 
    sanitationFactor + 
    waterTreatmentFactor + 
    populationDensityFactor + 
    environmentalFactor;
  
  const wardRisk = baseRisk * vulnerabilityMultiplier;
  
  return normalizeRisk(wardRisk);
}

export function getDefaultEnvironmentalMultiplier(wardId: number): number {
  const multipliers: Record<number, number> = {
    1: 0.9,
    2: 1.15,
    3: 0.95,
    4: 1.1,
    5: 0.85,
    6: 1.05,
    7: 1.2,
    8: 0.8,
    9: 1.08
  };
  
  return multipliers[wardId] || 1.0;
}
