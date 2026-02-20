interface WardData {
  wardId: number;
  sanitationCoverage: number;
  waterTreatmentCoverage: number;
  populationDensity: number;
}

// Deterministic pseudo-random generator based on ward ID
function seededRandom(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  const random = x - Math.floor(x);
  return min + random * (max - min);
}

export function getWardData(wardId: number): WardData {
  // Generate deterministic values based on ward ID
  const sanitationCoverage = seededRandom(wardId * 7, 40, 85);
  const waterTreatmentCoverage = seededRandom(wardId * 11, 45, 90);
  const populationDensity = seededRandom(wardId * 13, 1500, 3500);

  return {
    wardId,
    sanitationCoverage: parseFloat(sanitationCoverage.toFixed(1)),
    waterTreatmentCoverage: parseFloat(waterTreatmentCoverage.toFixed(1)),
    populationDensity: Math.round(populationDensity)
  };
}

export function getAllWardsData(): WardData[] {
  return Array.from({ length: 9 }, (_, i) => getWardData(i + 1));
}
