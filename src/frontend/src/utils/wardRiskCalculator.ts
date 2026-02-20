/**
 * Ward Risk Calculator Utility
 * 
 * Calculates ward-specific outbreak probability using scientifically grounded formula:
 * Ward_Risk = Base_Risk × (1 + Sanitation_Factor + Water_Treatment_Factor + Population_Density_Factor + Environmental_Factor)
 * 
 * Each factor contributes to the overall vulnerability of a ward:
 * - Sanitation_Factor: Lower sanitation coverage increases risk
 * - Water_Treatment_Factor: Lower water treatment coverage increases risk
 * - Population_Density_Factor: Higher density increases transmission risk
 * - Environmental_Factor: Ward-specific geographical/environmental characteristics
 */

export interface WardCharacteristics {
  sanitation_coverage: number;      // 0-100%
  water_treatment_coverage: number; // 0-100%
  population_density: number;       // people per sq km
  environmental_multiplier: number; // 0.8-1.2 (ward-specific geography)
}

/**
 * Calculate sanitation vulnerability factor
 * Lower sanitation coverage = higher risk
 * Range: 0 to 0.5 (50% max contribution)
 */
function calculateSanitationFactor(sanitationCoverage: number): number {
  // Normalize: 0% coverage = 0.5 factor, 100% coverage = 0 factor
  return (100 - sanitationCoverage) / 200;
}

/**
 * Calculate water treatment vulnerability factor
 * Lower water treatment coverage = higher risk
 * Range: 0 to 0.5 (50% max contribution)
 */
function calculateWaterTreatmentFactor(waterTreatmentCoverage: number): number {
  // Normalize: 0% coverage = 0.5 factor, 100% coverage = 0 factor
  return (100 - waterTreatmentCoverage) / 200;
}

/**
 * Calculate population density vulnerability factor
 * Higher density = higher transmission risk
 * Range: 0 to 0.3 (30% max contribution)
 * Baseline: 2000 people/sq km
 */
function calculatePopulationDensityFactor(populationDensity: number): number {
  // Normalize around baseline of 2000
  const densityFactor = (populationDensity - 2000) / 10000;
  // Clamp to 0-0.3 range
  return Math.max(0, Math.min(0.3, densityFactor));
}

/**
 * Normalize final risk to 0-100% range
 */
function normalizeRisk(risk: number): number {
  return Math.max(0, Math.min(100, risk));
}

/**
 * Calculate ward-specific outbreak risk
 * 
 * @param baseRisk - Overall system risk from backend calculation (0-100%)
 * @param characteristics - Ward-specific vulnerability characteristics
 * @returns Ward-specific outbreak probability (0-100%)
 */
export function calculateWardRisk(
  baseRisk: number,
  characteristics: WardCharacteristics
): number {
  // Calculate individual vulnerability factors
  const sanitationFactor = calculateSanitationFactor(characteristics.sanitation_coverage);
  const waterTreatmentFactor = calculateWaterTreatmentFactor(characteristics.water_treatment_coverage);
  const populationDensityFactor = calculatePopulationDensityFactor(characteristics.population_density);
  const environmentalFactor = characteristics.environmental_multiplier - 1.0; // Convert 0.8-1.2 to -0.2 to +0.2
  
  // Combined vulnerability multiplier
  // Base = 1.0, factors add vulnerability (max ~1.5x multiplier)
  const vulnerabilityMultiplier = 1.0 + 
    sanitationFactor + 
    waterTreatmentFactor + 
    populationDensityFactor + 
    environmentalFactor;
  
  // Apply vulnerability to base risk
  const wardRisk = baseRisk * vulnerabilityMultiplier;
  
  // Normalize to 0-100% range
  return normalizeRisk(wardRisk);
}

/**
 * Get default environmental multiplier for a ward
 * Based on geographical characteristics (proximity to water bodies, elevation, etc.)
 */
export function getDefaultEnvironmentalMultiplier(wardId: number): number {
  // Ward-specific environmental characteristics
  const multipliers: Record<number, number> = {
    1: 0.9,  // Lower risk area
    2: 1.15, // Near water body
    3: 0.95, // Moderate
    4: 1.1,  // Higher density urban
    5: 0.85, // Elevated area
    6: 1.05, // Moderate
    7: 1.2,  // Flood-prone area
    8: 0.8,  // Well-drained area
    9: 1.08  // Urban center
  };
  
  return multipliers[wardId] || 1.0;
}
